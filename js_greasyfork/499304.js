// ==UserScript==
// @name         Speed Up Time Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tăng tốc thời gian trên trang web khi nhấp vào phần tử cụ thể
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license      Hi
// @downloadURL https://update.greasyfork.org/scripts/499304/Speed%20Up%20Time%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/499304/Speed%20Up%20Time%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findAndClickElementById() {
        const elementId = '#layma_me_vuatraffic';
        const element = document.querySelector(elementId);

        if (element) {
            console.log(`Element found: ${elementId}`);
            element.click();
            setTimeout(() => {
                activateSpeedUpTime();
                console.log("Clicked on the element and activated speed up.");
            }, 3000); // Đợi 3 giây trước khi kích hoạt tăng tốc
        } else {
            console.log(`Element not found: ${elementId}`);
        }
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

    // Gọi hàm để kiểm tra
    findAndClickElementById();
})();