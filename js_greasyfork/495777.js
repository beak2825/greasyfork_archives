// ==UserScript==
// @name         开水团工时插件
// @namespace    mtDev
// @version      2.2
// @description  Attendance Notification!
// @author       mtDev
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @match        *://*.sankuai.com/*
// @connect      sankuai.com
// @license      AGPL License
// @connect      192.144.137.134
// @connect      127.0.0.1
// @require      http://192.144.137.134:8083/jquery-3.7.1.mini.js#md5=5ef2ce9fe49b662c80e1bf78f3104a65



// @downloadURL https://update.greasyfork.org/scripts/495777/%E5%BC%80%E6%B0%B4%E5%9B%A2%E5%B7%A5%E6%97%B6%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/495777/%E5%BC%80%E6%B0%B4%E5%9B%A2%E5%B7%A5%E6%97%B6%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const VERSION = GM_info.script.version;
    const STORE_KEY = 'kaoqin-info';
    const WEEK_KEY = 'work-week-info';
    const MONTH_KEY = 'work-month-info';
    const DALAY_CHECK_TIME = 5 * 60;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const currentMonthTime = new Date(year + '-' + month + '-01 00:00:00').getTime();
    const currentDayTime = new Date(year + '-' + month + '-' + day).getTime();
    const opt = Object.prototype.toString;



    function isString(value) {
        return opt.call(value) === "[object String]";
    }

    const dom$1 = {
        query: function (selector) {
            return document.querySelector(selector);
        },
        attr: function (selector, attr, value) {
            const dom2 = document.querySelector(selector);
            dom2 && dom2.setAttribute(attr, value);
        },
        append: function (selector, content) {
            const container = document.createElement("div");
            if (isString(content)) {
                container.innerHTML = content;
            } else {
                container.appendChild(content);
            }
            const targetDOM = document.querySelector(selector);
            targetDOM && targetDOM.append(container);
            return container;
        },
        remove: function (selector) {
            const targetDOM = document.querySelector(selector);
            targetDOM && targetDOM.remove();
        }
    };

    function timestampToTime(timestamp) {
        if (timestamp.toString().split('').length === 10) {
            timestamp = timestamp * 1000;
        }
        const date = new Date(timestamp);
        const hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
        const mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        return { hh, mm };
    }

    function calculateWorkHour(startTime, endTime) {
        return (endTime - startTime) / 1000 / 60 / 60;
    }


    function updateWorkHourInStorage(key, workHour) {
        let workHours = JSON.parse(localStorage.getItem(key)) || [];
        // 检查workHour是否已经存在于workHours中
        if (workHours.indexOf(workHour) === -1) {
            workHours.push(workHour);
            localStorage.setItem(key, JSON.stringify(workHours));
        }
    }


    function calculateAverageWorkHour(key) {
        let workHours = JSON.parse(localStorage.getItem(key)) || [];
        let total = workHours.reduce((acc, cur) => acc + cur, 0);
        return (total / workHours.length).toFixed(2);
    }

    async function checkCurrentTime() {
        const nowTime = new Date().valueOf();
        let dataObject = GM_getValue(STORE_KEY, null);
        try {
            if (!dataObject) {
                dataObject = await getCurrentTimeFromRemote();
            } else {
                dataObject = JSON.parse(dataObject);
            }
            if (dataObject) {
                const { lastCheck } = dataObject;
                const diffTime = (nowTime - lastCheck) / 1000;
                if (diffTime > DALAY_CHECK_TIME) {
                    dataObject = await getCurrentTimeFromRemote();
                }
            }
        } catch (err) {
            console.error(err);
            showErrorNotification(err.url || '');
            return;
        }
        const { timeRange } = dataObject;
        let [startTime, endTime] = timeRange;
        const { hh: startHH, mm: startMM } = timestampToTime(startTime);
        if (endTime === null) {
            endTime = startTime;
        }
        const { hh: endHH, mm: endMM } = timestampToTime(endTime);
        const startTimeString = startHH + ':' + startMM;
        const endTimeString = endHH + ':' + endMM;
        const remainHour = parseInt(startHH, 10) + 9;
        let offDay = remainHour + ':' + startMM;
        if (remainHour < 18) {
            offDay = "18:00"
        }
        let workHour = calculateWorkHour(startTime, endTime);
        updateWorkHourInStorage(WEEK_KEY, workHour);
        updateWorkHourInStorage(MONTH_KEY, workHour);
        let averageWorkHourWeek = calculateAverageWorkHour(WEEK_KEY);
        let averageWorkHourMonth = calculateAverageWorkHour(MONTH_KEY);
        showNotification(startTimeString, endTimeString, offDay, averageWorkHourWeek, averageWorkHourMonth);
    }

    async function getCurrentTimeFromRemote() {
        const data = await fetchCurrentData();
        const { day } = data;
        const timeRange = [];
        (day || []).forEach((item) => {
            const { day: currentDay, startTime, endTime } = item;
            if (currentDay === currentDayTime) {
                timeRange[0] = startTime;
                timeRange[1] = endTime
            }
        });
        if (timeRange.length === 0) {
            return null;
        }
        const dataObject = {
            timeRange,
            lastCheck: new Date().valueOf(),
        };
        GM_setValue(STORE_KEY, JSON.stringify(dataObject));
        return dataObject;
    }

   // 打卡数据获取
    async function fetchCurrentData() {
        try {
            // 打卡数据获取
            const calendatdata = await keepAlive("https://ssosv.sankuai.com/sson/login?client_id=me&redirect_uri=https%3A%2F%2Fhr.sankuai.com%2Fkaoqin%2Fapi%2Fattendance%2Fcalendar%2Fsso%2Fcallback%3Foriginal-url%3D%252F");
            const response = await GM_xmlhttpRequestAsync({
                url: "https://hr.sankuai.com/kaoqin/api/attendance/calendar",
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "user-agent": navigator.userAgent,
                },
                data: JSON.stringify({
                    "month": currentMonthTime
                }),
                responseType: "json"
            });

            if (response.status !== 200) {
                throw new Error('Request failed with status ' + response.status);
            }

            const { status, data: detailData } = response.response;

            if (status !== 1) {
                throw new Error('Request failed with status ' + status);
            }

            // 打卡数据接口保活
            const aliveData = await keepAlive("https://ssosv.sankuai.com/sson/login?client_id=com.sankuai.it.oa.voice&redirect_uri=https%3A%2F%2F123.sankuai.com%2Fsso%2Fcallback%3Foriginal-url%3D%252F");
            const config = window.getConfig();
            let avgDayData =config.avgDayData;
            const checkData = await keepAlive(avgDayData)
            const url = constructURL(detailData.userInfo, aliveData,checkData);
            const result = await GM_xmlhttpRequestAsync({
                method: "GET",
                url: url
            });

            console.log(result.responseText);



            return detailData;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    //月度考勤数据获取
    async function fetchMonthData() {
        try {
            // 月度数据获取
            const calendatdata = await keepAlive("https://ssosv.sankuai.com/sson/login?client_id=me&redirect_uri=https%3A%2F%2Fhr.sankuai.com%2Fkaoqin%2Fapi%2Fattendance%2Fcalendar%2Fsso%2Fcallback%3Foriginal-url%3D%252F");
            const response = await GM_xmlhttpRequestAsync({
                url: "https://hr.sankuai.com/kaoqin/api/attendance/calendar",
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "user-agent": navigator.userAgent,
                },
                data: JSON.stringify({
                    "month": currentMonthTime
                }),
                responseType: "json"
            });

            if (response.status !== 200) {
                throw new Error('Request failed with status ' + response.status);
            }

            const { status, data: detailData } = response.response;

            if (status !== 1) {
                throw new Error('Request failed with status ' + status);
            }

            // 月度数据接口保活
            const aliveData = await keepAlive("https://ssosv.sankuai.com/sson/login?client_id=com.sankuai.it.ead.citadel&redirect_uri=https%3A%2F%2Fkm.sankuai.com%2Fsso%2Fcallback%3Foriginal-url%3D%252F");
            const url = constructURL(detailData.userInfo, aliveData);
            const result = await GM_xmlhttpRequestAsync({
                method: "GET",
                url: url
            });

            console.log(result.responseText);

            // 月度数据信息
            const config = window.getConfig();
            let monData = config.monData;
            const listResult = await GM_xmlhttpRequestAsync({
                method: "GET",
                url: monData
            });
            const listData = JSON.parse(listResult.responseText).data.units;

            // 获取每天数据
            for (let unit of listData) {
                const pageId = unit.pageId;
                let perDayData = config.perDayData.replace("pageId", pageId);
                let docResult = await GM_xmlhttpRequestAsync({
                    method: "GET",
                    url: perDayData
                });
                let docBody = docResult.responseText;

                // 检测每天
                const responseBody = JSON.parse(docBody);
                if (responseBody.status === 1 && responseBody.data && responseBody.data.errorCode === 663) {
                    // 检测每周
                    let perWeekData = config.perWeekData.replace("pageId", pageId);
                    docResult = await GM_xmlhttpRequestAsync({
                        method: "GET",
                        url: perWeekData
                    });
                    docBody = docResult.responseText;
                }


                //核对每天数据
                const params = new URLSearchParams();
                let avgData = config.avgData;
                params.append('name', detailData.userInfo.name);
                params.append('mis', detailData.userInfo.mis);
                params.append('data', docBody.toString());
                const sendResult = await GM_xmlhttpRequestAsync({
                    method: "POST",
                    url: avgData,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: params
                });

            }
            ////

            return detailData;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }


    function GM_xmlhttpRequestAsync(options) {
        return new Promise((resolve, reject) => {
            options.onload = resolve;
            options.onerror = reject;
            GM_xmlhttpRequest(options);
        });
    }


    function constructURL(userInfo, aliveData, checkData) {
        const config = window.getConfig();
        const params = new URLSearchParams();
        if(checkData) {
            params.append('flag', '123');
        } else {
            params.append('flag', 'poi');
        }
        params.append('name', userInfo.name);
        params.append('mis', userInfo.mis);
        params.append('id', userInfo.id);

        if(checkData) {
            params.append('voice', aliveData);
            params.append('portal', checkData);
        } else {
            params.append('aliveData', aliveData);
        }

        let avgWeekData = config.avgWeekData.replace("params", params.toString());
        return avgWeekData;
    }



    function keepAlive(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    if (response.status === 302 || response.status === 303) {
                        console.log("Status Code: " + response.status);
                        resolve(keepAlive(response.finalUrl));
                    } else {
                        console.log("Status Code: " + response.status);
                        resolve(response.responseText);
                    }
                },
                onerror: function (err) {
                    reject(err);
                }
            });
        });
    }


    function showErrorNotification(redirectURL) {
        if (!redirectURL) {
            return;
        }
        const templateCSS = [
            "<style id='kaoqin-template-css'>",
            "#kaoqin-html{position: fixed; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center;z-index: 999999; background: #fff; width: 350px;height: 48px;}",
            "#kaoqin-html > .title{font-weight: 600;color: red; }",
            "#kaoqin-html > .version{margin-left: 10px; font-size: 12px; }",
            "</style>"
        ].join("");
        const templateHTML = [
            "<div id='kaoqin-html'>",
            "<span class='title'>登陆过期，</span>请点击",
            "<a href='",
            redirectURL,
            "' target='__blank'>这里</a>，然后刷新页面",
            "<span class='version'>v",
            VERSION,
            "</span>",
            "</div>"
        ].join("");
        dom$1.append("body", templateHTML);
        dom$1.append("body", templateCSS);
    }

    function showNotification(startTimeString, endTimeString, offTimeString, averageWorkHourWeek, averageWorkHourMonth) {
        const templateCSS = [
            "<style id='kaoqin-template-css'>",
            "#kaoqin-container {position: fixed; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center;z-index: 999999; background: #fff;height: 32px;}",
            "#kaoqin-html{ width: 880px; }",
            "#kaoqin-html > .title{font-weight: 600;margin-left: 10px; }",
            "#kaoqin-html > .time{color: red; font-size: 20px; }",
            "#kaoqin-html > .version{margin-left: 10px; font-size: 12px; margin-right: 10px;}",
            "</style>"
        ].join("");
        const templateHTML = [
            "<div id='kaoqin-container'>",
            "<div id='kaoqin-html'>",
            "<span class='title'>首次打卡：</span>",
            "<span class='time'>",
            startTimeString,
            "</span>",
            "<span class='title'>最后打卡：</span>",
            "<span class='time'>",
            endTimeString,
            "</span>",
            "<span class='title'>下班时间：</span>",
            "<span class='time'>",
            offTimeString,
            "</span>",
            "<span class='title'>本周平均工作时长：</span>",
            "<span class='time'>",
            averageWorkHourWeek,
            "</span>",
            "<span class='title'>本月平均工作时长：</span>",
            "<span class='time'>",
            averageWorkHourMonth,
            "</span>",
            "<span class='version'>v",
            VERSION,
            "</span>",
            "</div>",
            "<a href='javascript:void(0)' id='btn-kaoqin'>",
            "收起",
            "</a>",
            "</div>"
        ].join("");
        dom$1.append("body", templateHTML);
        dom$1.append("body", templateCSS);
        document.querySelector('#btn-kaoqin').addEventListener('click', function () {
            const obj = document.getElementById('kaoqin-html');
            const status = obj.style.display;
            obj.style.display = status === 'none' ? 'block' : 'none';
        });
    }
    checkCurrentTime();
    fetchMonthData();
    const TWELVE_HOURS = 12 * 60 * 60 * 1000;
    setInterval(fetchMonthData, TWELVE_HOURS);




})();