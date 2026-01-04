// ==UserScript==
// @name         山西执业药师继续教育
// @namespace    http://tampermonkey.net/
// @version      2025.04.26.0621
// @description  山西执业药师继续教育自动刷视频、做题
// @author       BN_Dou
// @match        https://ysxh.cnslpa.com/*
// @icon         http://course.cnslpa.com/user/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/512135/%E5%B1%B1%E8%A5%BF%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/512135/%E5%B1%B1%E8%A5%BF%E6%89%A7%E4%B8%9A%E8%8D%AF%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var AutoPlay = setInterval(play, 10000);
    function play() {
        // 遍历每个 div.el-dialog__wrapper 元素
        var visibleWrapperCount = 0;
        document.querySelectorAll("div.el-dialog__wrapper").forEach((wrapper) => {
            // 获取元素的计算样式
            const computedStyle = window.getComputedStyle(wrapper);
            // 检查元素是否可见
            if (computedStyle.display!== 'none') {
                visibleWrapperCount++;
                
                // 查找元素内的 span.el-dialog__title 元素
                const titleElement = wrapper.querySelector("span.el-dialog__title");
                if (titleElement) {
                    // 获取原始标题文本
                    const originalTitle = titleElement.textContent.split("【")[0].trim();
                    // 获取标题文本并去除首尾空格
                    const titleText = titleElement.textContent.trim();

                    const video = wrapper.querySelector("video");
                    if (video) {
                        console.log('👉 设置【静音】');
                        video.muted = true;
                        console.log('👉 设置【播放状态】');
                        video.play();
                        const currentTimeDisplay = wrapper.querySelector("span.vjs-current-time-display");
                        const durationDisplay = wrapper.querySelector("span.vjs-duration-display");
                        if (currentTimeDisplay && durationDisplay) {
                            titleElement.textContent = originalTitle + "【" + currentTimeDisplay.textContent + "/" + durationDisplay.textContent + "】";
                        }
                        return;
                    }

                    // 判断标题文本是否为 "评价提醒" 或 "课程评价"
                    if (["评价提醒", "课程评价", "恭喜您！通过考试"].includes(titleText)) {
                        // 查找对应的按钮元素
                        const button = wrapper.querySelector("button.el-button.el-button--primary");
                        if (button) {
                            // 点击按钮
                            console.log("👉 点击【" + titleText + "】的确定按钮");
                            button.click();
                        }
                        return;
                    } else if (["考试提醒"].includes(titleText)) {
                        // 查找对应的按钮元素
                        const button = wrapper.querySelector("button.el-button.el-button--default");
                        if (button) {
                            // 点击按钮
                            console.log("👉 点击【" + titleText + "】的确定按钮");
                            button.click();
                        }
                        return;
                    }
                }
            }
        });

        if (!visibleWrapperCount && document.querySelector("#print-section") && !document.querySelector('div.video-player.vjs-custom-skin')) {
            var button = document.querySelector("div.margin-bottom-sm.bg-red");
            if (!button) {
                console.log("👉 ！！！学习完毕！！！脚本结束！！！");
                // 暂停循环监测
                clearInterval(AutoPlay);
                // 进度推送
                send();
            }
            if (button.textContent.split('\n')[0].trim() === '开始学习') {
                console.log('👉 点击【开始学习】按钮');
                // 点击开始学习
                button.click();
                // 进度推送
                send();
                // 找到并点击后立即退出循环
                return;
            }
        }
    }

    // 推送
    function send() {
        console.log("wxpusher推送");
        fetch('https://wxpusher.zjiecode.com/api/send/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "appToken": "AT_TVLwBLQ9RmXmOgqYByMIEWqjcY6DeOhX",
                "content": document.querySelector("div.margin-sm.bg-white.padding-md.border-radius.flex-1.flex-column").outerHTML,
                "summary": `执业药师_` + document.querySelector(".el-dropdown-link img").alt,
                "contentType": 2,
                "uids": ["UID_rpxCNGRdpZhMPEQ8VbXpAWoezmuP"],
                "verifyPay": false
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error(`请求失败，状态码: ${response.status}`);
                }
            })
            .then(data => console.log(data))
            .catch(error => console.error('发送请求时出错:', error));
    }

    // 等待标签加载
    function waitElement(selector, callback) {
        let element = document.querySelector(selector);
        if (element) {
            callback();
        } else {
            setTimeout(() => {
                waitElement(selector, callback);
            }, 2000);
        }
    }

    // 存储用户信息的对象
    const userInfo = {
        userId: null,
        userName: null,
        userPhone: null,
        classStudyId: null
    };

    // 定义请求头
    const headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        'token': null
    };

    // 注册菜单命令
    GM_registerMenuCommand("自动提交考试", async function() {
        const token = prompt('请输入Token（从浏览器cookie中获取）');
        if (!token) {
            alert('未输入Token，操作已取消');
            return;
        }
        
        headers.token = token;
        
        try {
            await main();
            console.log('考试提交完成');
            alert('考试提交完成！');
        } catch (error) {
            console.error('程序执行失败:', error);
            alert('考试提交失败：' + error.message);
        }
    });

    // 获取用户信息的函数
    async function getUserInfo() {
        try {
            // 如果已经获取过信息，直接返回
            if (userInfo.userId && userInfo.classStudyId) {
                console.log('使用缓存的用户信息');
                return userInfo;
            }

            console.log('开始获取用户信息...');
            
            // 获取userId
            const response1 = await fetch(
                `https://apiysxh.cnslpa.com/api/education/getUserInfo?usercode=${headers.token.split('<1949>')[1]}`, 
                { headers }
            );
            const data1 = await response1.json();
            
            if (!data1 || !data1.Data || !data1.Data.id) {
                throw new Error('获取用户ID失败: 响应数据格式不正确');
            }
            
            userInfo.userId = data1.Data.id;
            userInfo.userName = data1.Data.name;
            userInfo.userPhone = data1.Data.mobilePhone;
            console.log('获取到用户ID:', userInfo.userId);
            console.log('获取到用户姓名:', userInfo.userName);
            console.log('获取到用户手机号:', userInfo.userPhone);

            // 获取classStudyId
            const response2 = await fetch(
                'https://apiysxh.cnslpa.com/api//class/study/list?t=1745359352056&page=1&limit=9999999&year=2025', 
                { headers }
            );
            const data2 = await response2.json();
            
            if (!data2 || !data2.page || !data2.page.list || !data2.page.list[0]) {
                throw new Error('获取学习ID失败: 响应数据格式不正确');
            }
            
            userInfo.classStudyId = data2.page.list[0].id;
            console.log('获取到学习ID:', userInfo.classStudyId);

            return userInfo;
        } catch (error) {
            console.error('获取用户信息失败:', error.message);
            throw error;
        }
    }

    // 获取考试ID列表
    async function getExamCourseIds() {
        try {
            console.log('开始获取考试ID...');
            const { userId, classStudyId } = await getUserInfo();
            
            const response = await fetch(
                `https://apiysxh.cnslpa.com/api//education/getCourseLearningList?classStudyId=${classStudyId}&userId=${userId}`, 
                { headers }
            );
            const data = await response.json();
            
            if (!data || !data.date) {
                throw new Error('获取考试ID列表失败: 响应数据格式不正确');
            }
            
            const idList = [];
            data.date.forEach(item => {
                if (item.progressStatus === 2) {
                    const idValue = item.examId;
                    if (idValue) {
                        idList.push(idValue);
                    }
                }
            });
            
            return idList;
        } catch (error) {
            console.error('获取考试ID列表失败:', error.message);
            throw error;
        }
    }

    // 获取试卷信息
    async function getExamPapers(examIds) {
        try {
            console.log('开始获取试卷信息...');
            const allResponses = [];
            
            for (const id of examIds) {
                const url = 'https://apiysxh.cnslpa.com/api//class/exam/info/' + id;
                const response = await fetch(url, { headers });
                const data = await response.json();
                
                // 处理试卷信息
                if (data && data.classExam) {
                    const examData = data.classExam;
                    
                    // 修改 examItemList 中的 myselfAns 和用户信息
                    if (examData.examItemList && Array.isArray(examData.examItemList)) {
                        examData.examItemList.forEach(item => {
                            // 将 ans 的值赋给 myselfAns
                            if (item.ans) {
                                item.myselfAns = item.ans;
                            }
                        });
                        // 添加用户信息
                        examData.userId = userInfo.userId;
                        examData.userName = userInfo.userName;
                        examData.userPhone = userInfo.userPhone;
                    }
                    
                    // 只保存处理后的 classExam 数据
                    allResponses.push(examData);
                }
                
                // 每次请求后等待2秒
                console.log('等待2秒后继续请求...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            return allResponses;
        } catch (error) {
            console.error('获取试卷信息失败:', error.message);
            throw error;
        }
    }

    // 提交答卷
    async function submitExam(examData) {
        try {
            // 添加13位时间戳
            const submitData = {
                ...examData,
                t: Date.now()
            };
            // console.log(submitData);
            const response = await fetch('https://apiysxh.cnslpa.com/api//class/exam/itemConfig', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(submitData)
            });
            const data = await response.json();
            console.log('提交答卷成功，分数:', data.classExamUser.score);
            return data;
        } catch (error) {
            console.error('提交答卷失败:', error.message);
            throw error;
        }
    }

    // 主函数
    async function main() {
        try {
            console.log('开始执行主程序...');
            
            // 获取需要考试的课程ID
            const examIds = await getExamCourseIds();
            console.log('需要考试的课程ID列表:', examIds);

            // 获取试卷信息
            const examPapers = await getExamPapers(examIds);
            console.log('获取到所有试卷信息');

            // 提交答卷
            for (const examData of examPapers) {
                console.log('提交试卷:', examData.id);
                await submitExam(examData);
                // 每次提交后等待2秒
                console.log('等待2秒后继续提交...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } catch (error) {
            console.error('程序执行出错:', error.message);
            throw error;
        }
    }
})();