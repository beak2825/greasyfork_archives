// ==UserScript==
// @name         Yuketang Mess Helper
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  A note of exams haven't done
// @author       Linx
// @match        https://www.yuketang.cn/v2/web/index
// @match        https://www.yuketang.cn/v2/web/index/*
// @icon         none
// @grant        GM_addStyle
// @connect      yuketang.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521042/Yuketang%20Mess%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/521042/Yuketang%20Mess%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('Yuketang Homework Helper is running.');

    async function fetchClassroom() {
        return fetch("https://www.yuketang.cn/v2/api/web/courses/list?identity=2", {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "xt-agent": "web",
                "xtbz": "ykt"
            },
            referrer: "https://www.yuketang.cn/v2/web/index",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: null,
            method: "GET",
            mode: "cors",
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                if (data.errcode === 0 && data.data && Array.isArray(data.data.list)) {
                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear();
                    const currentMonth = currentDate.getMonth() + 1; // getMonth() 返回从 0 开始的月份
                    // 筛选 term 距今不超过 13 个月的 item
                    const filteredItems = data.data.list.filter(item => {
                        const termYear = Math.floor(item.term / 100); // term 的前 4 位表示年份
                        const termMonth = item.term % 100; // term 的后 2 位表示月份
                        const monthsDifference =
                            (currentYear - termYear) * 12 + (currentMonth - termMonth);
                        return monthsDifference <= 13;
                    });
                    const classrooms = filteredItems.map(item => {
                        return {
                            classroom_id: item.classroom_id,
                            course_name: item.course.name,
                            teacher_name: item.teacher.name
                        }
                    });
                    return classrooms;
                } else {
                    throw new Error("Unexpected response format");
                }
            })
            .catch(error => {
                console.error("Error fetching classroom data:", error);
                throw error;
            });
    }

    async function fetchExam() {
        return await fetchClassroom()
            .then(classrooms => {
                const page = 0;
                const offset = 20;
                const sort = -1;
                // 创建针对每个 classroom 的 fetch 请求
                const fetchPromises = classrooms.map(classroom => {
                    const url = `https://www.yuketang.cn/v2/api/web/logs/learn/${classroom.classroom_id}?actype=5&page=${page}&offset=${offset}&sort=${sort}`;
                    return fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            if (data && data.data && Array.isArray(data.data.activities)) {
                                return data.data.activities.map(activity => {
                                    return {
                                        ...activity,
                                        classroom_id: classroom.classroom_id,
                                        course_name: classroom.course_name,
                                        teacher_name: classroom.teacher_name
                                    };
                                });
                            } else {
                                console.warn(`Unexpected response for classroom ${classroom}:`, data);
                                return []; // 如果格式不符合预期，返回空数组
                            }
                        })
                        .catch(error => {
                            console.error(`Error fetching activities for classroom ${classroom}:`, error);
                            return []; // 返回空数组以避免 undefined
                        });
                });
                // 等待所有 fetch 请求完成
                return Promise.all(fetchPromises).then(activities => {
                    console.log(`Fetched ${activities.flat().length} activities`);
                    return activities.flat();
                });
            });
    }

    async function buildAcitivities() {
        return await fetchExam().then(activities => {
            const now = Date.now();
            const validActivities = activities.filter(item => item.deadline > now);
            validActivities.sort((a, b) => a.deadline - b.deadline);
            const container = document.createElement('div');
            for (const activity of validActivities) {
                container.appendChild(renderActivity(activity));
            }
            return container;
        })
    };

    function renderActivity(activity) {
        let link = `https://www.yuketang.cn/v2/web/exam/${activity.classroom_id}/${activity.courseware_id}`;
        if (activity.type === 4) {
            link = `https://www.yuketang.cn/v2/web/studentQuiz/${activity.courseware_id}/1`;
        }

        const linkBox = document.createElement('a');
        linkBox.href = link;
        linkBox.className = 'custom-link';
        linkBox.target = '_blank';

        const contentBox = document.createElement('div');
        contentBox.className = 'content-box';
        contentBox.style.padding = '15px';
        contentBox.style.margin = '10px 0';
        contentBox.style.border = '1px solid #e0e0e0';
        contentBox.style.borderRadius = '8px';
        contentBox.style.backgroundColor = '#f9f9f9';
        contentBox.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        contentBox.style.transition = 'transform 0.2s, box-shadow 0.2s';
        contentBox.addEventListener('mouseover', () => {
            contentBox.style.transform = 'translateY(-2px)';
            contentBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
        });
        contentBox.addEventListener('mouseout', () => {
            contentBox.style.transform = 'none';
            contentBox.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });

        const title = document.createElement('h2');
        title.style.fontSize = '18px';
        title.style.margin = '0 0 8px';
        title.style.color = '#333';
        title.textContent = `${activity.title} - ${activity.course_name} (${activity.teacher_name})`;

        const subInfo = document.createElement('div');
        subInfo.style.fontSize = '14px';
        subInfo.style.color = '#666';
        subInfo.innerHTML = `
            <span>满分：${activity.total_score}分</span> |
            <span>共${activity.problem_count}题</span> |
            ${activity.limit ? `<span>限时：${activity.limit / 60}分钟</span> |` : ''}
            <span style="color: #007bff;">截止时间：${formatDeadline(activity.deadline)}</span>
        `;

        contentBox.appendChild(title);
        contentBox.appendChild(subInfo);
        linkBox.appendChild(contentBox);

        return linkBox;
    }

    // 格式化截止时间
    function formatDeadline(deadlineTimestamp) {
        const date = new Date(deadlineTimestamp);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short' };
        return date.toLocaleDateString('zh-CN', options).replace(/\//g, '/');
    }

    function buildIframe(activities) {
        // 插入一个触发按钮到页面
        const triggerButton = document.createElement('button');
        triggerButton.style.borderRadius = '50px';
        triggerButton.style.padding = '12px 24px';
        triggerButton.style.transition = 'all 0.3s';
        triggerButton.textContent = '查看作业';
        triggerButton.style.position = 'fixed';
        triggerButton.style.bottom = '40px';
        triggerButton.style.right = '40px';
        triggerButton.style.padding = '10px 20px';
        triggerButton.style.fontSize = '16px';
        triggerButton.style.cursor = 'pointer';
        triggerButton.style.zIndex = '10000';
        triggerButton.style.backgroundColor = '#007bff';
        triggerButton.style.color = '#fff';
        triggerButton.style.border = 'none';
        triggerButton.style.borderRadius = '5px';
        triggerButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        triggerButton.addEventListener('mouseover', () => {
            triggerButton.style.backgroundColor = '#0078d7';
            triggerButton.style.transform = 'scale(1.05)';
        });
        triggerButton.addEventListener('mouseout', () => {
            triggerButton.style.backgroundColor = '#007bff';
            triggerButton.style.transform = 'scale(1)';
        });
        document.body.appendChild(triggerButton);

        // 创建 div 元素
        const hwDiv = document.createElement('div');
        hwDiv.id = 'hwIframe';
        hwDiv.style.position = 'fixed';
        hwDiv.style.top = '10%';
        hwDiv.style.left = '10%';
        hwDiv.style.width = '80%';
        hwDiv.style.height = '80%';
        hwDiv.style.border = '2px solid #ccc';
        hwDiv.style.borderRadius = '10px';
        hwDiv.style.zIndex = '10001';
        hwDiv.style.backgroundColor = '#fff';
        hwDiv.style.padding = '20px';
        hwDiv.style.boxSizing = 'border-box';
        hwDiv.style.overflowY = 'auto';
        hwDiv.style.maxHeight = '80%';
        hwDiv.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        hwDiv.style.transition = 'transform 0.3s';
        // hwDiv.addEventListener('mouseover', () => {
        //     hwDiv.style.transform = 'scale(1.01)';
        // });
        // hwDiv.addEventListener('mouseout', () => {
        //     hwDiv.style.transform = 'scale(1)';
        // });

        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '10px';
        closeBtn.style.width = '30px';
        closeBtn.style.height = '30px';
        closeBtn.style.padding = '0';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.backgroundColor = '#ff5c5c';
        closeBtn.style.color = '#fff';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '50%';
        closeBtn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        closeBtn.style.fontSize = '18px';
        closeBtn.style.display = 'flex';
        closeBtn.style.alignItems = 'center';
        closeBtn.style.justifyContent = 'center';
        closeBtn.style.transition = 'all 0.2s';

        // 添加鼠标悬停效果
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.backgroundColor = '#ff3b3b';
            closeBtn.style.transform = 'scale(1.1)';
        });
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.backgroundColor = '#ff5c5c';
            closeBtn.style.transform = 'scale(1)';
        });


        // 获取activities
        hwDiv.appendChild(activities);
        hwDiv.appendChild(closeBtn);
        // 点击关闭按钮时移除 div 和关闭按钮
        closeBtn.addEventListener('click', () => {
            hwDiv.remove();
        });

        triggerButton.addEventListener('click', () => {
            // 检查是否已经存在 div，避免重复添加
            if (document.getElementById('hwIframe')) {
                return;
            }
            // 将 div 和关闭按钮插入页面
            document.body.appendChild(hwDiv);
        });
    }

    buildAcitivities().then(activities => {
        buildIframe(activities);
    });
})();