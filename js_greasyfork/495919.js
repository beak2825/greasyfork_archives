// ==UserScript==
// @name         [自制]湖南开放大学
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Simulate video activity on lms.ouchn.cn
// @author       Your Name
// @match        https://lms.ouchn.cn/*
// @grant        GM_xmlhttpRequest
// @connect      lms.ouchn.cn
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/495919/%5B%E8%87%AA%E5%88%B6%5D%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/495919/%5B%E8%87%AA%E5%88%B6%5D%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6.meta.js
// ==/UserScript==
(async function () {
    'use strict';

    const coursesUrl = 'https://lms.ouchn.cn/api/my-courses?conditions=%7B%22status%22:%5B%22ongoing%22%5D,%22keyword%22:%22%22%7D&fields=id,display_name&page=1&page_size=100';
    const activityUrlTemplate = 'https://lms.ouchn.cn/api/course/COURSE_ID/all-activities?module_ids=[MODULE_IDS]&activity_types=learning_activities,exams,classrooms,live_records,rollcalls&no-loading-animation=true';
    const maxRetries = 5;
    let name;
    let rc;
    function sleep(delay = 1000) {

        return new Promise(resolve => setTimeout(resolve, delay));
    }

    function requests(url, data = {}, type = "GET") {
        return new Promise((resolve, reject) => {
            const headers = {
                'X-Requested-With': 'XMLHttpRequest',
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                'User-Agent': navigator.userAgent,
                'Content-Type': 'application/json',
            };
            GM_xmlhttpRequest({
                method: type,
                url: url,
                data: type === "POST" ? JSON.stringify(data) : data,
                headers: headers,
                onload: function (resp) {
                    try {
                        const parsedResp = JSON.parse(resp.responseText) || {};
                        resolve(parsedResp);
                    } catch (err) {
                        resolve(resp.responseText);
                    }
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    }

    function dateFormat(format, date) {
        const map = {
            "HH": String(date.getHours()).padStart(2, '0'),
            "MM": String(date.getMinutes()).padStart(2, '0')
        };
        return format.replace(/HH|MM/g, matched => map[matched]);
    }

    function add_log(text, type = "succ") {
        if ($("#log").find("div").length > 0) {
            $("#log").find("div")[0].remove();
        }
        let date = new Date();
        let formattedDate = dateFormat("HH:MM", date);
        let logMessage = `<span style="color:#aaa; float:left;">${formattedDate}</span> ${text}`;
        if (type === "succ") {
            $("#log").append(`<div style="text-align:right; clear:both; color:blue;">${logMessage}</div>`);
        } else if (type === "error") {
            $("#log").append(`<div style="text-align:right; clear:both; color:red;">${logMessage}</div>`);
        } else {
            $("#log").append(`<div style="text-align:right; clear:both; color:green;">${logMessage}</div>`);
        }
    }

    async function initUI() {
        $('head').append('<link href="https://unpkg.com/layui@2.6.8/dist/css/layui.css" rel="stylesheet" type="text/css" />');
        $('head').append(`
        <style>
            #startBtn {
                background-color: deepskyblue; 
                border: none; /* 去掉边框 */
                color: white; /* 白色文字 */
                width: -webkit-fill-available; /* 宽度 */
                text-align: center; /* 文字居中 */
                text-decoration: none; /* 去掉下划线 */
                display: inline-block; /* 内联块 */
                font-size: 16px; /* 字体大小 */
                margin: 4px 2px; /* 外边距 */
                cursor: pointer; /* 鼠标指针样式 */
                border-radius: 8px; /* 圆角 */
                transition: background-color 0.3s, transform 0.3s; /* 动画效果 */
            }
            #startBtn:hover {
                border: 1px solid deepskyblue;
                background-color: white; /* 悬停背景色 */
                color: skyblue;
            }
        </style>`)
        $('body').append(`
        <div class="layui-form" style="position: fixed; bottom: 20px; z-index: 9999; background-color: #fff;padding: 10px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1); width: 280px;">
            <div class="layui-form-item" style="margin-bottom:0;cursor:pointer;">
                <select id="studyCourse" lay-filter="studyCourse">
                    <option value="0" selected>全部选中</option>
                </select>
            </div>
            <button id="startBtn">看视频</button>
            
            <div id="log"></div>
            <div class="layui-progress" lay-showpercent="true" lay-filter="progress" style="margin-top: 5px;height:10px;">
                <div class="layui-progress-bar" lay-percent="0%" style="height:10px;"></div>
            </div>
        </div>
        `);
        rc = await requests(coursesUrl);
        rc.courses.map(item => {
            $('#studyCourse').append(`<option value="${item.id}">${item.display_name}</option>`);
        });
        layui.form.render('select');

        $('#startBtn').click(function () {
            init();
        });

    }
    async function checkNextActivity(activities, currentActivityIndex, retryCount = 0) {
        if (!activities || currentActivityIndex >= activities.length) {
            add_log('所有视频已完成');
            
            return;
        }

        const activity = activities[currentActivityIndex];
        currentActivityIndex++;

        if (activity.uploads[0].videos.length === 0) {
            add_log(`${activity.title} 视频未上传, 即将开始下一个视频`);
            await checkNextActivity(activities, currentActivityIndex);
            return;
        }

        const duration = activity.uploads[0].videos[0].duration;
        const criterionValue = activity.completion_criterion_value;
        const requiredWatchTime = Math.ceil((duration * criterionValue) / 100);
        const totalParts = Math.ceil(requiredWatchTime / 60);

        let start = 0;
        let end = 60;
        let partIndex = 0;
        const url = `https://lms.ouchn.cn/api/course/activities-read/${activity.id}`;

        try {
            await sleep();
            const response = await requests(url, {}, 'POST');
            if (response.completeness === 'full') {
    
                layui.element.progress('progress', '100%');
                await checkNextActivity(activities, currentActivityIndex);
                return;
            } else {
                if (response.data && response.data.end !== undefined) {
                    start = response.data.end;
                    end = start + 60;
                }
                end = start >= requiredWatchTime ? end : Math.min(end, requiredWatchTime);
                const completeness = response.data?.completeness || 0;
                add_log(` ${activity.title} 观看预计需要 ${(duration).toFixed(2) * completeness / 100} 秒`);
                layui.element.progress('progress', `${completeness}%`);
                await sleep(2000);

                async function watchVideo() {
                    while (partIndex < totalParts) {
                        try {
                            const intervalResponse = await requests(url, { start: start, end: end }, 'POST');
                            if (intervalResponse.completeness === 'full') {
                                layui.element.progress('progress', '100%');
                                break;
                            } else {
                                const intervalCompleteness = intervalResponse.data?.completeness || 0;
                                layui.element.progress('progress', `${intervalCompleteness}%`);
                                start += 60;
                                end += 60;
                                partIndex++;
                            }
                        } catch (intervalError) {
                            add_log(`请求错误: ${intervalError.message}`, 'error');
                            if (intervalError.message === 'Too Many Requests' && retryCount < maxRetries) {
                                retryCount++;
                                await sleep(2000, 3000);
                                add_log(`重试 ${activity.title} (${retryCount}/${maxRetries})...`);
                                partIndex--; // 回退索引
                            } else {
                                add_log(`达到最大重试次数停止, 请手动查看 ${activity.title}。`, 'error');
                                break;
                            }
                        }
                        await sleep(60000);
                    }
                    await checkNextActivity(activities, currentActivityIndex);
                }

                await watchVideo();
            }
        } catch (error) {
            add_log(`请求错误: ${error.message}`, 'error');
            if (error.message === 'Too Many Requests' && retryCount < maxRetries) {
                retryCount++;
                await sleep(2000, 3000);
                add_log(`重试检查活动(${retryCount}/${maxRetries})...`);
                currentActivityIndex--;
                await checkNextActivity(activities, currentActivityIndex, retryCount);
            } else {
                await checkNextActivity(activities, currentActivityIndex);
            }
        }
    }

    async function processCourse(course) {
        const modulesUrl = `https://lms.ouchn.cn/api/courses/${course.id}/modules`;
        const activityUrlTemplateForCourse = activityUrlTemplate.replace('COURSE_ID', course.id);
        const modulesResponse = await requests(modulesUrl);
        const moduleIds = modulesResponse.modules.map(module => module.id);
        const activityUrl = activityUrlTemplateForCourse.replace('MODULE_IDS', moduleIds.join(','));
        const activitiesResponse = await requests(activityUrl);
        const activities = activitiesResponse.learning_activities.filter(activity => activity.type === 'online_video');

        if (activities.length > 0) {
            add_log(`${course.display_name} 找到 ${activities.length} 个视频`);
            await checkNextActivity(activities, 0);
        } else {
            add_log(`${course.display_name} 没有视频`);
        }
    }

    async function init() {
        try {
            add_log('视频...');
            const targetCourses = name === '0' ? rc.courses : rc.courses.filter(course => course.id == name);

            for (const course of targetCourses.filter(Boolean)) {
                add_log(`检查 ${course.display_name} `);
                await processCourse(course);
            }
        } catch (error) {
            add_log(` ${error.message}`, 'error');
        }
    }

    $.getScript('https://lib.baomitu.com/layui/2.6.8/layui.js', function () {
        layui.use('form', function () {
            var form = layui.form;
            form.render();
            if (window.self === window.top) {
                initUI();
            }
            add_log(`当前：${$('#studyCourse option:selected').text()}`)
            form.on('select(studyCourse)', function (data) {
                name = data.value;
                add_log(`切换 ${data.elem[data.elem.selectedIndex].text}`);
            });

        });

    });
})();
