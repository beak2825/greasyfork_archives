// ==UserScript==
// @name         hzrs_helper
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  day day up
// @author       machine learning engineer
// @run-at       document-end
// @match       *://learning.hzrs.hangzhou.gov.cn/*
// @match       *://course.hzrs.hangzhou.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/540868/hzrs_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/540868/hzrs_helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const BASE_URL = window.location.origin;

    async function gmPostRequest(url, data) {
        const token = localStorage.getItem("front_token");
        if (!token) throw new Error("请先登录");

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json, text/plain, */*"
                },
                data: JSON.stringify(data),
                onload: (res) => {
                    try {
                        const json = JSON.parse(res.responseText);
                        // console.log(url, data, json);
                        if (json.status == -1) {
                            reject(new Error("登录失效"));
                        } else {
                            resolve(json);
                        }
                    } catch (err) {
                        reject(new Error("返回数据格式错误"));
                    }
                },
                onerror: (err) => reject(err)
            });
        });
    }
    async function getLearnedCourses() {
        const url = `${BASE_URL}/api/index/Study.StudyHour/myStudyList`;

        // 获取第一页
        const json = await gmPostRequest(url, { page: 1 });
        const firstPage = json.data;

        if (!firstPage || firstPage.total === 0 || firstPage.last_page === 0) {
            return [];
        }

        let allData = [...firstPage.data];

        for (let page = 2; page <= firstPage.last_page; page++) {
            const page_json = await gmPostRequest(url, { page });
            allData.push(...page_json.data.data);
        }

        return allData;
    }
    async function getPageCourses() {
        const url = `${window.location.origin}/api/index/index/SelectCourse`;

        // 获取当前页码
        const getCurrentPageIndex = () => {
            const pageNode = document.querySelector('div.Right li.is-active.number');
            const text = pageNode?.textContent?.trim();
            return text ? parseInt(text, 10) : 1;
        };

        // 获取课程类型
        const getClassType = () => {
            const classNameNode = document.querySelector('div.Right div.el-select span');
            const name = classNameNode?.textContent?.trim();
            switch (name) {
                case "一般公需": return "17";
                case "行业公需": return "16";
                case "专业课程": return "15";
                default: return "";
            }
        };

        const classType = getClassType();
        const inputData = {
            limit: 30,
            page: getCurrentPageIndex(),
            ...(classType ? { type: classType } : {})
        };

        try {
            const json = await gmPostRequest(url, inputData);
            const courseList = json?.course?.data ?? [];
            return courseList;
        } catch (err) {
            console.error('❌ 获取课程列表失败：', err);
            return [];
        }
    }


    function isCourseSelectPage(url) {
        return url.endsWith('learning.hzrs.hangzhou.gov.cn/#/Course');
    }

    function isCourseLearningPage(url) {
        return url
    }

    function disableCloseConfirm() {
        // 1. 劫持 addEventListener，屏蔽页面添加 beforeunload
        const rawAddEventListener = unsafeWindow.addEventListener;
        unsafeWindow.addEventListener = function(type, listener, options) {
            if (type === 'beforeunload') {
                console.log('[UserScript] 阻止 beforeunload 事件注册:', listener);
                return;
            }
            return rawAddEventListener.call(this, type, listener, options);
        };

        // 2. 清除已注册的 window.onbeforeunload
        Object.defineProperty(unsafeWindow, 'onbeforeunload', {
            get() {
                return null;
            },
            set(value) {
                console.log('[UserScript] 阻止 onbeforeunload 设置:', value);
                return;
            },
            configurable: true
        });

        // 3. 移除已注册的事件（如果可能）
        try {
            unsafeWindow.removeEventListener('beforeunload', unsafeWindow.Z); // 如你的代码中叫 Z
        } catch (e) {
            // 不处理
        }

        console.log('[UserScript] 已禁用页面关闭提示');
    }


    function disablePause(){

        let ori_setInterval = unsafeWindow.setInterval;

        // 保活劫持
        unsafeWindow.setInterval = function(fn, delay, ...args) {
            if (delay === 20 * 60 * 1000) {
                console.log('[🛠️ Userscript] 保活定时器延长为2小时');
                delay = 2 * 60 * 60 * 1000;
            }
            return ori_setInterval.call(this, fn, delay, ...args);
        };

    }

    function waitForRightElement(callback, el_name, timeout = 600) {
        const start = Date.now();
        const interval = setInterval(() => {
            const el = document.querySelector(el_name);
            console.log('等待了',el_name, Date.now() - start);
            if (el) {
                clearInterval(interval);
                callback(el);
            } else if (Date.now() - start > timeout*1000) {
                clearInterval(interval);
                console.warn(`等待 ${el_name} 元素超时`);
            }
        }, 1000);
    }

    function displayInfo(info, container_name = 'progress info') {
        const right_div = document.querySelector('div.Right');
        if (!right_div) return;

        // 创建容器（仅第一次执行时）
        let container = document.getElementById(container_name);
        if (!container) {
            container = document.createElement('div');
            container.id = container_name;
            container.style.cssText = `
              margin-top: 12px;
              padding: 10px;
              background: #f9f9f9;
              border: 1px solid #ddd;
              border-radius: 8px;
              font-family: Arial, sans-serif;
            `;
            right_div.prepend(container);
        }

        // 获取完整时间字符串
        const now = new Date();
        const timestamp = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }); // eg. 2025/06/22 14:52:01

        // 添加信息段
        const p = document.createElement('p');
        p.style.cssText = `
            margin: 6px 0;
            padding: 6px 10px;
            background-color: #fff3f3;
            border-left: 4px solid #d8000c;
            font-size: 16px;
            line-height: 1.4;
            border-radius: 4px;
          `;
        p.textContent = `[${timestamp}] ${info}`;
        // container.appendChild(p);
        container.prepend(p);
    }

    async function getCourseInfo(cid) {
        const BASE_URL = window.location.origin;
        const url = `${BASE_URL}/api/index/index/getCourseInfo`;
        const json = await gmPostRequest(url, { courseid: cid });
        return json.data;
    }

    function wait(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function displaysummary(learned_courses) {
        // 按课程类型统计总学时
        const periodByType = {};

        learned_courses.forEach(item => {
            const type = item.coursetype_text || '未知类型';
            const period = parseFloat(item.period || 0);
            if (!periodByType[type]) {
                periodByType[type] = 0;
            }
            periodByType[type] += period;
        });

        // 计算总课程数和总学时
        const total_period = Object.values(periodByType).reduce((sum, val) => sum + val, 0);
        const total_courses = learned_courses.length;

        // 构造输出文本
        let message = `📚 总共已学 ${total_courses} 门课程，累计： ${total_period.toFixed(2)} 学时\n`;

        for (const [type, period] of Object.entries(periodByType)) {
            message += `📌 ${type}: ${period.toFixed(2)} 学时\n`;
        }

        // 显示信息
        displayInfo(message, 'summary');
    }


    async function autoLearn() {
        const btn = document.querySelector('#mybtn');
        try {
            btn.disabled = true;
            btn.textContent = "学习中...";
            btn.style.background = "#ccc";
            btn.style.color = "#666";
            btn.style.boxShadow = "none";
            btn.style.cursor = "not-allowed";

            const all_page_courses = await getPageCourses();
            if (all_page_courses.length === 0) {
                displayInfo("⚠️ 无法获取本页相关课程");
                return;
            }

            const page_courses = all_page_courses.filter(item =>
                                                         item.typeid !== "15" || item.min_catelogname === "工学"
                                                        );

            const learned_courses = await getLearnedCourses();
            displaysummary(learned_courses);

            const learned_ids = learned_courses.map(c => c.courseid);
            const unlearned_courses = page_courses.filter(c => !learned_ids.includes(c.courseid));
            displayInfo(`📄 本页共 ${all_page_courses.length} 门课程，需要学习${page_courses.length}门, 已学 ${page_courses.length - unlearned_courses.length} 门，还需学习 ${unlearned_courses.length} 门`);

            if (unlearned_courses.length === 0) {
                displayInfo("✅ 本页课程均已学完!");
                return;
            }

            const total = unlearned_courses.length;
            let index = 0;
            for (const course of unlearned_courses) {
                const now = new Date();
                if (now.getHours() < 9) {
                    console.warn('⏰ 时间不早了，先休息明天再吧!(非学习时间0:00 - 9:00)');
                    displayInfo('⏰ 时间不早了，先休息明天再吧!(非学习时间0:00 - 9:00)');
                    break;
                }
                index++;

                const course_detail = await getCourseInfo(course.courseid);
                // console.log('course detail', course_detail.course_id, course_detail);

                const duration = course_detail.coursetimes || 2; // 默认 2 秒
                const random_wait = getRandomInt(5, 60);
                const wait_time = duration + random_wait;
                const finishTime = new Date(Date.now() + wait_time * 1000);
                const finishTimeStr = finishTime.toLocaleTimeString();

                const proc_info = `▶️ [${index}/${total}]正在学习 ${course_detail.courseid}：学时：${course_detail.period}，${course_detail.coursename}，预计完成时间 ${finishTimeStr}`;
                console.log(proc_info);
                displayInfo(proc_info);

                const url = `https://learning.hzrs.hangzhou.gov.cn/#/class?courseId=${course_detail.courseid}&coursetitle=${course_detail.coursename}`;
                console.log('url', url);
                let win = window.open(url);
                await wait(wait_time);
                win.close();
            }
            displayInfo(`本页需要学习${total}门课程，已学习${index}门`);

        } catch (err) {
            alert("⚠️ 登录失效或课程加载失败！");
            console.error('自动学习出错：', err);
        } finally {
            btn.disabled = false;
            btn.textContent = "学习结束";
        }
    }

    function addLearnButton(right_div) {
        const btn_id = 'mybtn';
        if (document.getElementById(btn_id)) {
            console.log('按钮已存在，跳过插入');
            return;
        }

        // 创建包裹按钮和提示的容器
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center'; // 垂直居中
        wrapper.style.margin = '10px 0';

        // 创建按钮
        const newBtn = document.createElement("button");
        newBtn.id = btn_id;
        newBtn.textContent = "学习本页课程";
        newBtn.onclick = autoLearn;

        newBtn.style.cssText = `
          padding: 10px 20px;
          font-size: 15px;
          font-weight: 500;
          background: linear-gradient(135deg, #2b8dfc 0%, #1e70bf 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: all 0.3s ease;
          /* 去掉 display:flex 和 justify-content */
        `;

        // 创建提示文字
        const tip = document.createElement('span');
        tip.textContent = '请先在下面筛选课程，再点击按钮开始学习!';
        tip.style.color = 'red';
        tip.style.marginLeft = '8px';

        // 把按钮和提示放到wrapper里
        wrapper.appendChild(newBtn);
        wrapper.appendChild(tip);


        // 插入wrapper到right_div指定位置
        right_div.prepend(wrapper);
    }



    const url = unsafeWindow.location.href;
    if (isCourseLearningPage(url)){
        disablePause();
        disableCloseConfirm();
    }

    if (isCourseSelectPage(url)){
        waitForRightElement(addLearnButton, 'div.Right ');
    }
    console.log('hzrs-helper ready!');
})();