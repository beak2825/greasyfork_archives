// ==UserScript==
// @name         FlyView Script
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  飞阅平台推出的一款用户行为监测插件，用于收集用户的一些常见的行为和操作。
// @author       TuGuobin
// @match        *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494690/FlyView%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/494690/FlyView%20Script.meta.js
// ==/UserScript==

(async () => {
    const API_KEY = "VKSBZ-BECLJ-4I7FV-D3GTV-JF3Q5-Q6BSN";
    const SESSION_ID = generateSessionId();
    const EVENT_TYPE_LIST = ["Page Visit", "Page Load", "First Interaction", "Text Input", "Element Click", "Window Resizing", "Viewport Stay", "Scrolling"];
    const eventIdIterator = generateEventId();
    const userEnvironment = {};
    getUserEnvironmentAttributes().then(env => Object.assign(userEnvironment, env));
    const performanceAttributes = {};
    getPerformanceAttributes().then(perf => Object.assign(performanceAttributes, perf));
    const startmonitor = `<svg t="1715410165408" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5767" width="24" height="24" data-spm-anchor-id="a313x.search_index.0.i4.17963a81PPG7yV"><path d="M512 192c156.448 0 296.021333 98.730667 418.410667 291.605333a52.938667 52.938667 0 0 1 0 56.789334C808.021333 733.269333 668.448 832 512 832c-156.448 0-296.021333-98.730667-418.410667-291.605333a52.938667 52.938667 0 0 1 0-56.789334C215.978667 290.730667 355.552 192 512 192z m0 128c-106.037333 0-192 85.962667-192 192s85.962667 192 192 192 192-85.962667 192-192-85.962667-192-192-192z m0 320c70.688 0 128-57.312 128-128s-57.312-128-128-128-128 57.312-128 128 57.312 128 128 128z" fill="#ffffff" p-id="5768" data-spm-anchor-id="a313x.search_index.0.i0.17963a81PPG7yV" class=""></path></svg><span>结束监听</span>`
    const stopmonitor = `<svg t="1715410246647" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2860" width="24" height="24"><path d="M512 832c-156.448 0-296.021333-98.730667-418.410667-291.605333a52.938667 52.938667 0 0 1 0-56.789334C215.978667 290.730667 355.552 192 512 192c156.448 0 296.021333 98.730667 418.410667 291.605333a52.938667 52.938667 0 0 1 0 56.789334C808.021333 733.269333 668.448 832 512 832z m0-576c-129.514667 0-249.461333 83.850667-360.117333 256C262.538667 684.149333 382.485333 768 512 768c129.514667 0 249.461333-83.850667 360.117333-256C761.461333 339.850667 641.514667 256 512 256z m0 405.333333c-83.210667 0-150.666667-66.858667-150.666667-149.333333S428.789333 362.666667 512 362.666667s150.666667 66.858667 150.666667 149.333333S595.210667 661.333333 512 661.333333z m0-64c47.552 0 86.101333-38.208 86.101333-85.333333S559.552 426.666667 512 426.666667c-47.552 0-86.101333 38.208-86.101333 85.333333s38.549333 85.333333 86.101333 85.333333z" fill="#ffffff" p-id="2861"></path></svg><span>开始监听</span>`;
    let info;
    let status = JSON.parse(localStorage.getItem('isMonitoring') || 'false');

    function insertStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
        .monitor {
            border: unset;
            border-radius: 4px;
            position: fixed;
            right: 10px;
            opacity: 0.8;
            top: 10px;
            background: linear-gradient(45deg, #aaa 0%, #ddd 25%, #54CA80 50%, #80dfff 100%);
            background-size: 400% 400%;
            background-position: left bottom;
            padding: 6px 16px;
            font-size: 14px;
            cursor: pointer;
            transition: background-position .3s, opacity .3s;
            display: flex;
            align-items: center;
            white-space: nowrap;
            gap: 6px;
            color: #fff;
            font-family: 'PingFang SC';
            z-index: 99999999999999999999999999;
        }

        .monitor:hover {
            background-position: right top;
            opacity: 1;
        }

        .stop {
            background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
            opacity: 1;
        }
        `
        document.head.appendChild(style);
    }

    function createButton() {
        const button = document.createElement('button');
        button.className = 'monitor'
        button.draggable = true
        button.addEventListener('dragstart', (e) => {
            const boundingRect = button.getBoundingClientRect();
            let left = e.clientX - boundingRect.left;
            let top = e.clientY - boundingRect.top;

            function move(e) {
                e.preventDefault()
                button.style.left = e.clientX - left + 'px'
                button.style.top = e.clientY - top + 'px'
                button.style.right = 'unset'
                button.removeEventListener('dragend', move)
            }

            button.addEventListener('dragend', move)
        })

        return button;
    }

    function changeButton(button, status) {
        localStorage.setItem('isMonitoring', status)
        if (status) {
            button.innerHTML = startmonitor
            button.classList.add('stop')
            info = monitor();
            window.addEventListener('unload', download);
        } else {
            button.innerHTML = stopmonitor
            button.classList.remove('stop')
            window.removeEventListener('unload', download);
        }
    }

    function init() {
        insertStyle();

        const button = createButton();
        document.body.appendChild(button);
        changeButton(button, status)

        button.addEventListener('click', () => {
            status = !status
            changeButton(button, status)
            if (!status) {
                download();
                const monitorEvent = new CustomEvent("monitor", {
                    detail: info
                });
                window.dispatchEvent(monitorEvent);
            }
        })
    }

    function generateEventId() {
        let count = 0;

        return (type) => {
            count++;
            return SESSION_ID + '-' + EVENT_TYPE_LIST.indexOf(type) + '-' + count;
        };
    }

    async function getBrowserInfo() {
        const browserInfo = {
            browser: {
                displayName: "Browser",
                order: "11",
                value: navigator.userAgentData ? navigator.userAgentData.brands[0].brand + '/' + navigator.userAgentData.brands[0].version : navigator.userAgent
            },
            userAgent: {
                displayName: "User Agent",
                order: "22",
                value: navigator.userAgent
            }
        };

        return await Promise.resolve(browserInfo);
    }

    async function getDeviceInfo() {

        const deviceInfo = {
            operatingSystem: {
                displayName: "OS",
                order: "9",
                value: navigator.oscpu || navigator.platform
            },
            deviceType: {
                displayName: "Device Type",
                order: "18",
                value: /Mobi/i.test(navigator.userAgent) ? "Mobile" : "Desktop"
            },
            screen: {
                displayName: "Screen",
                order: "13",
                value: {
                    width: window.screen.width,
                    height: window.screen.height
                }
            },
            language: {
                displayName: "Language",
                order: "7",
                value: navigator.language || navigator.userLanguage || "en-US"
            }
        };

        return await Promise.resolve(deviceInfo);
    }

    async function getIPInfo() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return { ip: data.ip };
        } catch (error) {
            console.error('Error fetching user IP:', error);
            return null;
        }
    }

    function getGeolocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        resolve({ latitude, longitude });
                    },
                    (error) => {
                        console.log("Error occurred. Error code: " + error.code);
                        reject(error);
                    }
                );
            } else {
                console.log("Geolocation is not supported by this browser.");
                reject(new Error("Geolocation not supported"));
            }
        });
    }

    async function getGeolocationInfo(latitude, longitude) {

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            window.myCallback = function (data) {
                if (data && data.result) {
                    resolve({
                        country: data.result.ad_info.nation,
                        city: data.result.ad_info.city,
                        province: data.result.ad_info.province,
                    });
                }
            };
            script.src = `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${API_KEY}&output=jsonp&callback=myCallback`;
            document.body.appendChild(script);
        });
    }

    async function getUserEnvironmentAttributes() {
        const envAttr = {};
        const browserInfo = await getBrowserInfo();
        const deviceInfo = await getDeviceInfo();
        const ipInfo = await getIPInfo();
        const geolocation = await getGeolocation();
        const geoInfo = await getGeolocationInfo(geolocation.latitude, geolocation.longitude);

        Object.assign(envAttr, browserInfo, deviceInfo);

        if (ipInfo) {
            envAttr.ip = {
                displayName: "IP",
                order: "1",
                value: ipInfo.ip
            };
        }

        if (geoInfo) {
            envAttr.country = {
                displayName: "Country or Region",
                order: "2",
                value: geoInfo.country
            };
            envAttr.city = {
                displayName: "City",
                order: "4",
                value: geoInfo.city
            };
            envAttr.province = {
                displayName: "Province",
                order: "3",
                value: geoInfo.province
            }
        }

        return envAttr;
    }

    async function getPerformanceAttributes() {

        const performanceAttr = {
            consoleErrors: {
                displayName: "Console Error Count",
                order: "15",
                value: 0
            },
            consoleInfos: {
                displayName: "Console Log Count",
                order: "14",
                value: 0
            },
            consoleWarnings: {
                displayName: "Console Warning Count",
                order: "16",
                value: 0
            },
        };


        const origConsoleLog = console.log;
        const origConsoleError = console.error;
        const origConsoleWarn = console.warn;

        console.log = function (msg) {
            performanceAttr.consoleInfos.value++;
            origConsoleLog.call(console, msg);
        };

        console.error = function (msg) {
            performanceAttr.consoleErrors.value++;
            origConsoleError.call(console, msg);
        };

        console.warn = function (msg) {
            performanceAttr.consoleWarnings.value++;
            origConsoleWarn.call(console, msg);
        };

        return performanceAttr;
    }

    function generateUserAttributes() {
        const userAttributes = {
            deviceGroupId: 1,
            projectId: 19,
            screenDirect: window.innerWidth > window.innerHeight ? 1 : 0,
            sessionId: SESSION_ID,
            userId: 1
        };

        return userAttributes;
    }

    function generateSessionId() {
        return Date.now().toString();
    }

    function generatePageAttributes() {
        const pageAttr = {
            clientCreateTs: {
                displayName: "",
                value: Date.now()
            },
            libVersion: {
                displayName: "SDK Version",
                order: "22",
                value: "1.4.0"
            },
            referrer: {
                displayName: "Previous URL",
                order: "15",
                value: document.referrer || "No referrer"
            },
            referrerHost: {
                displayName: "Previous Domain",
                order: "16",
                value: document.referrer ? new URL(document.referrer).hostname : "No referrer"
            },
            sdkType: {
                displayName: "SDK Type",
                order: "21",
                value: "WEB"
            },
            sessionId: {
                displayName: "",
                order: "",
                value: SESSION_ID
            },
            title: {
                displayName: "Page Title",
                order: "10",
                value: document.title || "Untitled"
            },
            uri: {
                displayName: "Page URI",
                order: "12",
                value: window.location.href || "No URI"
            },
            url: {
                displayName: "Page URL",
                order: "11",
                value: window.location.href
            },
            urlHost: {
                displayName: "Page Domain",
                order: "13",
                value: window.location.hostname || "No host"
            },
            urlPath: {
                displayName: "Page Path",
                order: "14",
                value: window.location.pathname || "/"
            }
        };
        return pageAttr;
    }

    function generateInteractionAttributes(eventName, e) {
        const timeSincePageLoad = Date.now() - performance.timing.navigationStart;
        const timeSinceSessionStart = timeSincePageLoad;
        const eventId = eventIdIterator(eventName);
        let interactionAttr;
        let desc = eventName;
        if (eventName === 'Page Visit') {
            desc = window.location.href;
        } else if (eventName === 'Page Load') {
            desc = `Performance Good (LCP: ${Math.max(performance.timing.loadEventStart - performance.timing.navigationStart, parseInt(Math.random() * 1000))} ms)`
        }
        if (e) {
            interactionAttr = {
                timeSincePageLoad: {
                    displayName: "Duration Before Entering the Page",
                    order: "17",
                    value: e.timeStamp
                },
                timeSinceSessionStart: {
                    displayName: "Time From Session Start",
                    order: "18",
                    value: e.timeStamp
                },
                interactionType: e.type
            }
            if (e.type === 'click') {
                if (e.target?.innerText?.length < 10)
                    desc = `Click ${e.target.innerText}`;
                interactionAttr.repeatClick = {
                    "displayName": "Multiple Clicks",
                    "order": "19",
                    "value": e.detail > 1 ? "True" : "False"
                };
                interactionAttr.errorCount = {
                    "displayName": "Error Count",
                    "order": "21",
                    "value": 0
                };
            } else if (e.type === 'scroll') {
                desc = `Scroll ${window.scrollY} px`;
                interactionAttr.viewportPosition = {
                    "displayName": "Viewport Distance from Top",
                    "order": "9",
                    "value": window.scrollY
                }
                interactionAttr.viewportPositionPercentage = {
                    "displayName": "Viewport Relative Page Proportion",
                    "order": "10",
                    "value": window.scrollY / document.body.scrollHeight
                }
            } else if (e.type === 'input') {
                desc = `Input ${e.target.value}`
                interactionAttr.textInput = {
                    "displayName": "Input Text",
                    "order": "1",
                    "value": e.target.value
                };
                interactionAttr.textInputTime = {
                    "displayName": "Text Input Latency",
                    "order": "2",
                    "value": e.timeStamp
                }
            }

        } else {
            interactionAttr = {
                "timeSincePageLoad": {
                    "displayName": "Duration Before Entering the Page",
                    "order": "17",
                    "value": timeSincePageLoad
                },
                "timeSinceSessionStart": {
                    "displayName": "Time From Session Start",
                    "order": "18",
                    "value": timeSinceSessionStart
                }
            }
        }

        return {
            desc,
            eventId,
            eventTypeId: EVENT_TYPE_LIST.indexOf(eventName),
            eventName,
            interactionAttr
        };
    }

    async function generateInteraction(eventType, e) {
        const data = generateUserAttributes();
        data.envAttr = userEnvironment;
        data.performanceAttr = performanceAttributes;
        const pageAttributes = generatePageAttributes();
        data.pageAttr = pageAttributes;
        const interactionAttributes = generateInteractionAttributes(eventType, e);
        Object.assign(data, interactionAttributes);
        return data;
    }

    function monitor() {
        window.addEventListener('DOMContentLoaded', (e) => handleInteraction('Page Load', e));
        window.addEventListener('load', (e) => handleInteraction('Page Visit', e));
        window.addEventListener('resize', (e) => debounceHandleInteraction('Window Resizing', e));
        window.addEventListener('click', (e) => handleInteraction('Element Click', e));
        window.addEventListener('scroll', (e) => debounceHandleInteraction('Scrolling', e));
        window.addEventListener('input', (e) => debounceHandleInteraction('Text Input', e));

        let firstInteraction = true;
        const firstInteractionList = ["Window Resizing", "Element Click", "Scrolling", "Text Input"];
        let stayTimer = null;

        const info = {
            data: [],
            timestamp: Date.now(),
            message: "success"
        };

        function handleInteraction(eventType, e) {
            stayTimer && clearTimeout(stayTimer);
            stayTimer = setTimeout(() => {
                handleInteraction('Viewport Stay');
            }, 30000);

            if (firstInteraction && firstInteractionList.includes(eventType)) {
                firstInteraction = false;
                handleInteraction('First Interaction');
                return
            }

            generateInteraction(eventType, e).then((data) => {
                info.data.push(data);
            });
        }

        const debounceHandleInteraction = debounce(handleInteraction, 100);

        return info;
    }

    function debounce(fn, delay) {
        let timer = null;
        return (...args) => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                timer = null;
                fn(...args);
            }, delay);
        }
    }

    function download() {
        const blob = new Blob([JSON.stringify(info, null, 4)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'monitor.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    init();
})()