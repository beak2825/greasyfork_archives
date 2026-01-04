// ==UserScript==
// @name         visibilityChangeListener
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Waits until the tab is focused, executing a callback function when it happens.
// @author       IgnaV
// @grant        none
// ==/UserScript==

const visibilityChangeListener = (onFocus, onBlur, minTime = 0) => {
    let lastExecutionFocusTime = 0;
    let lastExecutionBlurTime = 0;

    document.addEventListener('visibilitychange', function () {
        const currentTime = Date.now();

        if (document.visibilityState === 'visible') {
            if (onFocus && currentTime - lastExecutionFocusTime >= minTime) {
                onFocus();
                lastExecutionFocusTime = currentTime;
            }
        } else if (onBlur && currentTime - lastExecutionBlurTime >= minTime) {
            onBlur();
            lastExecutionBlurTime = currentTime;
        }
    });
};
