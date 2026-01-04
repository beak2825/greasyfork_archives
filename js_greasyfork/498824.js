// ==UserScript==
// @name         智云课堂搜索显示学期
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  智云课堂中，获取并显示课程学期
// @author       JiepengLab
// @match        https://classroom.zju.edu.cn/searchContent?title=*
// @grant        GM_xmlhttpRequest
// @connect      classroom.zju.edu.cn
// @connect      yjapi.cmc.zju.edu.cn
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498824/%E6%99%BA%E4%BA%91%E8%AF%BE%E5%A0%82%E6%90%9C%E7%B4%A2%E6%98%BE%E7%A4%BA%E5%AD%A6%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/498824/%E6%99%BA%E4%BA%91%E8%AF%BE%E5%A0%82%E6%90%9C%E7%B4%A2%E6%98%BE%E7%A4%BA%E5%AD%A6%E6%9C%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to execute the main logic
    function executeScript() {
        // 获取当前URL的title, page, realname和trans参数
        const searchParams = new URLSearchParams(window.location.search);
        const title = searchParams.get('title') || "";
        const page = searchParams.get('page') || "1";
        const realname = searchParams.get('realname') || "";
        const trans = searchParams.get('trans') || "";

        // 获取用户信息
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://classroom.zju.edu.cn/userapi/v1/infosimple",
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                if (response.status === 200) {
                    const userData = JSON.parse(response.responseText);
                    if (userData.code === 200) {
                        const userId = userData.params.id;
                        const userName = userData.params.account;
                        const tenantId = userData.params.tenant_id;
                        const student = userData.params.account;

                        // 动态生成请求 URL，添加 realname 和 trans 参数
                        const requestUrl = `https://classroom.zju.edu.cn/pptnote/v1/searchlist?tenant_id=${tenantId}&user_id=${userId}&user_name=${userName}&page=${page}&per_page=16&title=${encodeURIComponent(title)}&realname=${encodeURIComponent(realname)}&trans=${encodeURIComponent(trans)}&tenant_code=${tenantId}`;

                        // 发起GET请求获取数据
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: requestUrl,
                            headers: {
                                "Content-Type": "application/json"
                            },
                            onload: function(response) {
                                if (response.status === 200) {
                                    const data = JSON.parse(response.responseText);
                                    if (data.code === 0 && data.msg === "查询成功") {
                                        const list = data.total.list;
                                        const courses = document.querySelectorAll(".result-course-wrapper");

                                        courses.forEach((course, index) => {
                                            if (list[index]) {
                                                const courseId = list[index].course_id;

                                                // 通过 course_id 和 student 获取课程详细信息
                                                GM_xmlhttpRequest({
                                                    method: "GET",
                                                    url: `https://yjapi.cmc.zju.edu.cn/courseapi/v3/multi-search/get-course-detail?course_id=${courseId}&student=${student}`,
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    },
                                                    onload: function(response) {
                                                        if (response.status === 200) {
                                                            const courseData = JSON.parse(response.responseText);
                                                            if (courseData.code === 0 && courseData.msg === "success") {
                                                                let termName = courseData.data.term_name;
                                                                // 合并学期名称
                                                                if (termName.includes(',')) {
                                                                    const termParts = termName.split(',').map(part => part.trim());
                                                                    const termYear = termParts[0].match(/^\d+-\d+/)[0];
                                                                    const termSeasons = termParts.map(part => part.match(/\D+$/)[0]).join('');
                                                                    termName = termYear + termSeasons;
                                                                }
                                                                const termElement = course.querySelector("span.term");
                                                                if (termElement) {
                                                                    termElement.textContent = termName;
                                                                }
                                                            } else {
                                                                console.error("课程详情查询失败: ", courseData.msg);
                                                            }
                                                        } else {
                                                            console.error("请求课程详情失败，状态代码: ", response.status);
                                                        }
                                                    },
                                                    onerror: function(err) {
                                                        console.error("请求课程详情错误: ", err);
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        console.error("数据查询失败: ", data.msg);
                                    }
                                } else {
                                    console.error("请求失败，状态代码: ", response.status);
                                }
                            },
                            onerror: function(err) {
                                console.error("请求错误: ", err);
                            }
                        });
                    } else {
                        console.error("用户信息查询失败: ", userData.message);
                    }
                } else {
                    console.error("用户信息请求失败，状态代码: ", response.status);
                }
            },
            onerror: function(err) {
                console.error("用户信息请求错误: ", err);
            }
        });
    }

    // Initial script execution
    executeScript();

    // 监听URL变化
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            executeScript();
        }
    }).observe(document.querySelector('#app'), { subtree: true, childList: true });
})();
