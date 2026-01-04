// ==UserScript==
// @name 三击关闭页面
// @namespace http://tampermonkey.net/
// @version 1.0.4
// @description 三击页面任意位置即可关闭页面
// @author 捈荼
// @license Apache License 2.0
// @match *://*/*
// @require https://greasyfork.org/scripts/453846-string-format/code/string%20format.js
// @run-at document-start
// @grant unsafeWindow
// @grant window.close
// @grant GM_log
// @downloadURL https://update.greasyfork.org/scripts/454709/%E4%B8%89%E5%87%BB%E5%85%B3%E9%97%AD%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/454709/%E4%B8%89%E5%87%BB%E5%85%B3%E9%97%AD%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

// commented by ChatGPT

function nclickEvent(n, interval, dom, fn) {
    "use strict";

    // Convert the incoming n parameter to an integer and set it to 1 if it is less than 1
    n = parseInt(n) < 1 ? 1 : parseInt(n);
    // Define variables count and lastTime to track the number of consecutive clicks and the time of the last click event
    let count = 0, lastTime = 0;
    // Define the handler function
    let handler = (event) => {
        // Record the current time
        let currentTime = new Date().getTime();
        // Compare the time difference between the current time and the time of the last click event
        // If the time difference is less than the specified interval, increment the count variable by 1;
        // If the time difference is greater than or equal to the interval, reset the count variable to 0
        count = (currentTime - lastTime) < interval ? count + 1 : 0;
        GM_log('click event: last since {} ms;\nconsecutive {} times.\n'.format(currentTime - lastTime, count + 1));
        // Record the current time
        lastTime = new Date().getTime();
        // If count is greater than or equal to n - 1, call the callback function fn and reset the count variable to 0
        if (count >= n - 1) {
            fn(event, n);
            count = 0;
        }
    };
    // Add a click event listener to the given DOM element with the handler function as the event handler
    dom.addEventListener('click', handler);
}

(function () {
    "use strict";

    // Listen for click events and call the callback function when 3 consecutive clicks are detected
    nclickEvent(3, 250, document, (_event, n) => {
        GM_log(n + 'click');
        window.opener = null;
        window.open('', '_self');
        setTimeout(() => window.close(), 1);
    });
})();