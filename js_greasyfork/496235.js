// ==UserScript==
// @name         通过发起请求完成观看视频等
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Simulate video activity on lms.ouchn.cn
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      lms.ouchn.cn
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/496235/%E9%80%9A%E8%BF%87%E5%8F%91%E8%B5%B7%E8%AF%B7%E6%B1%82%E5%AE%8C%E6%88%90%E8%A7%82%E7%9C%8B%E8%A7%86%E9%A2%91%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/496235/%E9%80%9A%E8%BF%87%E5%8F%91%E8%B5%B7%E8%AF%B7%E6%B1%82%E5%AE%8C%E6%88%90%E8%A7%82%E7%9C%8B%E8%A7%86%E9%A2%91%E7%AD%89.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const coursesUrl = 'https://lms.ouchn.cn/api/my-courses?conditions=%7B%22status%22:%5B%22ongoing%22%5D,%22keyword%22:%22%22%7D&fields=id,display_name&page=1&page_size=100';
    const activityUrlTemplate = 'https://lms.ouchn.cn/api/course/COURSE_ID/all-activities?module_ids=[MODULE_IDS]&activity_types=learning_activities,exams,classrooms,live_records,rollcalls&no-loading-animation=true';
    const maxRetries = 5;
    const name = '全部';

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

    function add_log(message, type = 'info') {
        console[type](message);
    }

    async function checkNextActivity(activities, currentActivityIndex, retryCount = 0) {
        if (!activities || currentActivityIndex >= activities.length) {
            add_log('所有视频已完成');
            return;
        }
        // await sleep();

        const activity = activities[currentActivityIndex];
        currentActivityIndex++;

        if (activity.uploads[0].videos.length === 0) {
            add_log(`${activity.title} 视频未上传`);
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
                add_log(`${activity.title} 状态为已完成`);
                await checkNextActivity(activities, currentActivityIndex);
                return;
            } else {
                if (response.data && response.data.end !== undefined) {
                    start = response.data.end;
                    end = start + 60;
                }
                end = start >= requiredWatchTime ? end : Math.min(end, requiredWatchTime);
                const completeness = response.data?.completeness || 0;
                add_log(`开始观看 ${activity.title}, 共 ${(duration / 60).toFixed(2)} 分钟, 目前进度: ${completeness} %`);

                async function watchVideo() {
                    while (partIndex < totalParts) {
                        try {
                            const intervalResponse = await requests(url, { start: start, end: end }, 'POST');
                            if (intervalResponse.completeness === 'full') {
                                add_log(`${activity.title} 视频已完成`);
                                break;
                            } else {
                                const intervalCompleteness = intervalResponse.data?.completeness || 0;
                                add_log(`${activity.title} 视频进度: ${intervalCompleteness}%`);
                                start += 60;
                                end += 60;
                                partIndex++;
                            }
                        } catch (intervalError) {
                            add_log(`请求错误: ${intervalError.message}`, 'error');
                            if (intervalError.message === 'Too Many Requests' && retryCount < maxRetries) {
                                retryCount++;
                                await sleep(2000, 3000);
                                add_log(`重试检查活动(${retryCount}/${maxRetries})...`);
                                start -= 60; // 回退索引
                            } else {
                                add_log('达到最大重试次数，停止检查活动。', 'error');
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
            add_log(`开始检查 ${course.display_name} 课程`);
            add_log(`${course.display_name} 课程下有 ${activities.length} 个视频`);
            await checkNextActivity(activities, 0);
        } else {
            add_log(`${course.display_name} 课程下没有视频`);
        }
    }

    async function init() {
        try {
            add_log('开始执行脚本...');
            const response = await requests(coursesUrl);
            const targetCourses = name === '全部' ? response.courses : response.courses.filter(course => course.display_name === name);

            for (const course of targetCourses.filter(Boolean)) {
                await processCourse(course);
            }
        } catch (error) {
            add_log(`获取活动错误: ${error.message}`, 'error');
        }
    }

    init();
})();



