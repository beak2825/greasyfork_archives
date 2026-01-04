// ==UserScript==
// @name         awaitFor
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Waits until a condition is true, executing a callback function when the condition is met.
// @author       IgnaV
// @grant        none
// ==/UserScript==

const awaitFor = (condition, callback, maxAttempts=null, awaitTime=500, maxAwaitTime=10000, ...params) => {
    maxAttempts ||= maxAwaitTime / awaitTime;

    let attempts = 0
    const intervalId = setInterval(() => {
        const result = condition();
        attempts++;
        if (attempts >= maxAttempts || result) {
            clearInterval(intervalId);
        }
        if (result) {
            callback(result, ...params);
        }
    }, awaitTime);
};