// ==UserScript==
// @name         Speed Up Time Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tăng tốc thời gian trên trang web khi nhấp vào phần tử cụ thể
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license      Hi
// @downloadURL https://update.greasyfork.org/scripts/520213/Speed%20Up%20Time%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/520213/Speed%20Up%20Time%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findAndClickElementById() {
        const elementId = '#layma_me_vuatraffic';
        const timeout = 10000; // Thời gian chờ tối đa là 10 giây
        const startTime = Date.now();

        function tryFindElement() {
            const element = document.querySelector(elementId);

            if (element) {
                console.log(`Element found: ${elementId}`);
                element.scrollIntoView();
                setTimeout(() => {
                    element.click();
                    console.log("Scrolled to and clicked on the element.");
                }, 1000); // Đợi 1 giây trước khi click
            } else if (Date.now() - startTime < timeout) {
                // Nếu chưa hết thời gian chờ thì thử lại
                setTimeout(tryFindElement, 500); // Kiểm tra lại sau 500ms
            } else {
                console.log(`Element not found after 10 seconds: ${elementId}`);
            }
        }

        tryFindElement();
    }

    function activateSpeedUpTime() {
        console.log("Activating Speed Up Time");

        let speedConfig = {
            speed: 100.0,
            cbSetIntervalChecked: true,
            cbSetTimeoutChecked: true,
            cbPerformanceNowChecked: true,
            cbDateNowChecked: true,
            cbRequestAnimationFrameChecked: true,
        };

        const emptyFunction = () => {};

        const originalClearInterval = window.clearInterval;
        const originalclearTimeout = window.clearTimeout;

        const originalSetInterval = window.setInterval;
        const originalSetTimeout = window.setTimeout;

        const originalPerformanceNow = window.performance.now.bind(
            window.performance
        );

        const originalDateNow = Date.now;

        const originalRequestAnimationFrame = window.requestAnimationFrame;

        let timers = [];
        const reloadTimers = () => {
            console.log(timers);
            const newtimers = [];
            timers.forEach((timer) => {
                originalClearInterval(timer.id);
                if (timer.customTimerId) {
                    originalClearInterval(timer.customTimerId);
                }
                if (!timer.finished) {
                    const newTimerId = originalSetInterval(
                        timer.handler,
                        speedConfig.cbSetIntervalChecked
                            ? timer.timeout / speedConfig.speed
                            : timer.timeout,
                        ...timer.args
                    );
                    timer.customTimerId = newTimerId;
                    newtimers.push(timer);
                }
            });
            timers = newtimers;
        };

        window.addEventListener("message", (e) => {
            if (e.data.command === "setSpeedConfig") {
                speedConfig = e.data.config;
                reloadTimers();
            }
        });

        window.postMessage({ command: "getSpeedConfig" });

        window.clearInterval = (id) => {
            originalClearInterval(id);
            timers.forEach((timer) => {
                if (timer.id == id) {
                    timer.finished = true;
                    if (timer.customTimerId) {
                        originalClearInterval(timer.customTimerId);
                    }
                }
            });
        };

        window.clearTimeout = (id) => {
            originalclearTimeout(id);
            timers.forEach((timer) => {
                if (timer.id == id) {
                    timer.finished = true;
                    if (timer.customTimerId) {
                        originalclearTimeout(timer.customTimerId);
                    }
                }
            });
        };

        window.setInterval = (handler, timeout, ...args) => {
            console.log("timeout  ", timeout);
            if (!timeout) timeout = 0;
            const id = originalSetInterval(
                handler,
                speedConfig.cbSetIntervalChecked ? timeout / speedConfig.speed : timeout,
                ...args
            );
            timers.push({
                id: id,
                handler: handler,
                timeout: timeout,
                args: args,
                finished: false,
                customTimerId: null,
            });
            return id;
        };

        window.setTimeout = (handler, timeout, ...args) => {
            if (!timeout) timeout = 0;
            return originalSetTimeout(
                handler,
                speedConfig.cbSetTimeoutChecked ? timeout / speedConfig.speed : timeout,
                ...args
            );
        };

        // performance.now
        (function () {
            let performanceNowValue = null;
            let previousPerformanceNowValue = null;
            window.performance.now = () => {
                const originalValue = originalPerformanceNow();
                if (performanceNowValue) {
                    performanceNowValue +=
                        (originalValue - previousPerformanceNowValue) *
                        (speedConfig.cbPerformanceNowChecked ? speedConfig.speed : 1);
                } else {
                    performanceNowValue = originalValue;
                }
                previousPerformanceNowValue = originalValue;
                return Math.floor(performanceNowValue);
            };
        })();

        // Date.now
        (function () {
            let dateNowValue = null;
            let previousDateNowValue = null;
            Date.now = () => {
                const originalValue = originalDateNow();
                if (dateNowValue) {
                    dateNowValue +=
                        (originalValue - previousDateNowValue) *
                        (speedConfig.cbDateNowChecked ? speedConfig.speed : 1);
                } else {
                    dateNowValue = originalValue;
                }
                previousDateNowValue = originalValue;
                return Math.floor(dateNowValue);
            };
        })();

        // requestAnimationFrame
        (function () {
            let dateNowValue = null;
            let previousDateNowValue = null;
            const callbackFunctions = [];
            const callbackTick = [];
            const newRequestAnimationFrame = (callback) => {
                return originalRequestAnimationFrame((timestamp) => {
                    const originalValue = originalDateNow();
                    if (dateNowValue) {
                        dateNowValue +=
                            (originalValue - previousDateNowValue) *
                            (speedConfig.cbRequestAnimationFrameChecked
                                ? speedConfig.speed
                                : 1);
                    } else {
                        dateNowValue = originalValue;
                    }
                    previousDateNowValue = originalValue;

                    const dateNowValue_MathFloor = Math.floor(dateNowValue);

                    const index = callbackFunctions.indexOf(callback);
                    let tickFrame = null;
                    if (index === -1) {
                        callbackFunctions.push(callback);
                        callbackTick.push(0);
                        callback(dateNowValue_MathFloor);
                    } else if (speedConfig.cbRequestAnimationFrameChecked) {
                        tickFrame = callbackTick[index];
                        tickFrame += speedConfig.speed;

                        if (tickFrame >= 1) {
                            while (tickFrame >= 1) {
                                callback(dateNowValue_MathFloor);
                                window.requestAnimationFrame = emptyFunction;
                                tickFrame -= 1;
                            }
                            window.requestAnimationFrame = newRequestAnimationFrame;
                        } else {
                            window.requestAnimationFrame(callback);
                        }
                        callbackTick[index] = tickFrame;
                    } else {
                        callback(dateNowValue_MathFloor);
                    }
                });
            };
            window.requestAnimationFrame = newRequestAnimationFrame;
        })();
    }

    // Gọi hàm để kiểm tra và click
    findAndClickElementById();

    // Vòng lặp while để gọi activateSpeedUpTime mỗi 1 giây
    let intervalId = setInterval(() => {
        activateSpeedUpTime();
    }, 1000);
})();