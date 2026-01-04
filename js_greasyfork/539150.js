// ==UserScript==
// @name         校精灵增强 - 点名时课时显示
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       CaO_U_May
// @license      MIT
// @description  用于校精灵教务管理系统点名之前的剩余课时展示, 学生姓名后会增加「剩xx节」字样
// @match        https://xiaojing0.com/admin/teaching/checkin*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.xiaojing0.com
// @downloadURL https://update.greasyfork.org/scripts/539150/%E6%A0%A1%E7%B2%BE%E7%81%B5%E5%A2%9E%E5%BC%BA%20-%20%E7%82%B9%E5%90%8D%E6%97%B6%E8%AF%BE%E6%97%B6%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/539150/%E6%A0%A1%E7%B2%BE%E7%81%B5%E5%A2%9E%E5%BC%BA%20-%20%E7%82%B9%E5%90%8D%E6%97%B6%E8%AF%BE%E6%97%B6%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ✅ 页面加载完成后再执行主逻辑
    window.addEventListener("load", () => {
        // 延迟 500ms，确保 Vue 页面数据渲染完毕
        setTimeout(main, 500);
    });

    function main() {
        const VERSION = "2.15.1-200";
        const LS_KEY = "xiaojing_api_cookie";
        const timestamp = Date.now();
        const cookie = localStorage.getItem(LS_KEY);

        if (!cookie) {
            console.warn("❌ 未找到保存的 Cookie，请先设置：");
            console.log(`localStorage.setItem("${LS_KEY}", "你的 Cookie")`);
            return;
        }

        // 📌 一、请求所有班级列表
        const classUrl = `https://api.xiaojing0.com/workbench_api/edu_class/list` +
            `?_=${timestamp}&index=0&limit=100&isNeedSum=1&isNeedSchedulingSum=1` +
            `&filterFields=%7B%22isFinishedCourse%22%3Afalse%2C%22isDeleted%22%3Afalse%2C%22isPrivate%22%3Afalse%2C%22courseType%22%3A1%7D` +
            `&selectArray=%5B%22eduClassId%22%5D` +
            `&version=${VERSION}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: classUrl,
            headers: { "Cookie": cookie },
            onload: function (res) {
                if (res.status !== 200) {
                    console.error("❌ 班级列表请求失败：", res.status);
                    return;
                }
                const data = JSON.parse(res.responseText);
                const eduClassIds = (data.data.eduClasses || []).map(c => c.eduClassId);
                const idListWrapped = [eduClassIds];
                console.log("📋 获取班级 ID 列表：", idListWrapped);

                fetchAllStudentInfo(idListWrapped);
            },
            onerror: function (err) {
                console.error("❌ 网络错误：", err);
            }
        });
    }

    function fetchAllStudentInfo(idListWrapped) {
        const resultDict = {};
        const allClassIds = idListWrapped[0];
        let completed = 0;

        allClassIds.forEach(classId => {
            fetchStudentsByClass(classId, resultDict, () => {
                completed++;
                if (completed === allClassIds.length) {
                    console.log("✅ 所有班级学生信息获取完成");
                    console.log("📚 学生课时字典：", resultDict);
                    window.studentRemainDict = resultDict;

                    injectRemainInfoToPage();
                    startAutoUpdateRemainInfo(); // 每秒更新 DOM
                }
            });
        });
    }

    function fetchStudentsByClass(classId, resultDict, callback) {
        let index = 0;
        const limit = 60;
        const VERSION = "2.15.1-200";
        const cookie = localStorage.getItem("xiaojing_api_cookie");
        const selectArray = encodeURIComponent(JSON.stringify(["studentId", "name", "eduClasses", "eduClassGroups"]));
        const filterFields = encodeURIComponent(JSON.stringify({ eduClassId: classId, eduClassState: 1 }));

        function requestNextPage() {
            const url = `https://api.xiaojing0.com/workbench_api/student/multi?_=${Date.now()}&index=${index}&limit=${limit}` +
                `&selectArray=${selectArray}&isNeedSum=1&filterFields=${filterFields}&version=${VERSION}`;

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: { "Cookie": cookie },
                onload: function (res) {
                    if (res.status !== 200) {
                        console.warn(`❌ 班级 ${classId} 请求失败：`, res.status);
                        callback();
                        return;
                    }

                    const data = JSON.parse(res.responseText);
                    const students = data.data?.pagedResult || [];

                    for (const stu of students) {
                        const name = stu.name || "未知";
                        let remain = -1;

                        // 查找对应 groupId
                        let groupId = null;
                        for (const cls of stu.eduClasses || []) {
                            if (cls.eduClassId === classId) {
                                groupId = cls.eduClassGroupId;
                                break;
                            }
                        }

                        // 查找 remainPeriods
                        if (groupId) {
                            for (const group of stu.eduClassGroups || []) {
                                if (group.eduClassGroupId === groupId) {
                                    remain = group.remainPeriods ?? -1;
                                    break;
                                }
                            }
                        }

                        resultDict[name] = remain;
                    }

                    if (students.length < limit) {
                        callback(); // 当前班级处理完毕
                    } else {
                        index += limit;
                        requestNextPage(); // 翻页处理
                    }
                },
                onerror: function () {
                    console.error(`❌ 班级 ${classId} 学生请求失败`);
                    callback();
                }
            });
        }

        requestNextPage();
    }

    function injectRemainInfoToPage() {
        const dict = window.studentRemainDict || {};
        let count = 0;

        document.querySelectorAll("span.name").forEach(el => {
            const textNode = el.childNodes[0];
            if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

            const rawText = textNode.textContent.trim();
            const name = rawText.split("（")[0].trim();
            const remain = dict[name];

            if (remain === undefined) return;

            const exists = el.querySelector("span.remain-info");
            if (exists) return; // 已插入，避免重复

            // 创建新的样式元素
            const remainSpan = document.createElement("span");
            remainSpan.className = "remain-info";
            remainSpan.textContent = `（剩 ${remain} 节）`;

            if (remain <= 5) {
                remainSpan.classList.add("alert");
            }

            // 插入文本后面
            textNode.textContent = name;
            el.insertBefore(remainSpan, el.childNodes[1]);

            count++;
        });

        console.log(`🔁 页面更新：已处理 ${count} 位学生`);
    }

    function startAutoUpdateRemainInfo(interval = 1000) {
        setInterval(() => {
            injectRemainInfoToPage();
        }, interval);
    }

    GM_addStyle(`
        .remain-info {
            margin-left: 4px;
        }
        .remain-info.alert {
            color: red;
            font-weight: bold;
        }
    `);
})();
