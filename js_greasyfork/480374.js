// ==UserScript==
// @name         onVisibilityChange
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Waits until the tab is focused, executing a callback function when it happens.
// @author       IgnaV
// @grant        none
// ==/UserScript==

const onVisibilityChange = (onFocus, onBlur, minTime = 0) => {
    let lastExecutionTime = 0;

    document.addEventListener('visibilitychange', function() {
        const currentTime = Date.now();

        if (currentTime - lastExecutionTime >= minTime * 1000) {}
            if (document.visibilityState === 'visible') {
                onFocus?.();
            } else {
                onBlur?.();
            }

            lastExecutionTime = currentTime;
        });
};
