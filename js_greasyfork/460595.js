// ==UserScript==
// @name         bing adblock
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  this script can perform perfectly on 'cn.bing.com' with extension 'requestly' for I redirect website requests to my local server and override it. However,
// @author       fvydjt
// @match        https://*.bing.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cn.bing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460595/bing%20adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/460595/bing%20adblock.meta.js
// ==/UserScript==

function runWhenReady(readySelector, callback) {
    let numAttempts = 0;
    let tryNow = function () {
        let elem = document.querySelector(readySelector);
        if (elem) {
            callback(elem);
        } else {
            numAttempts++;
            if (numAttempts >= 34) {
                console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
            }
        }
        setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
    };
    tryNow();
}
let func = () => {
    let ele = document.querySelector('.bottom_row.widget.msnpeek');
    ele.outerHTML = '';
};
let func2 = () => {
    setTimeout(func, 10);
    setTimeout(func, 100);
};
(function () {
    'use strict';
    // Your code here...
    let domain = location.host;
    if (domain == 'cn.bing.com') {
        func();
    } else if (domain == 'www.bing.com') {
        runWhenReady('.bottom_row.widget.msnpeek', func);
        // let ele = document.querySelector('form#sb_form');
        document.addEventListener('click', func2);
    }
    setInterval(func, 500);
})();