// ==UserScript==
// @name         欧洲开放大学刷课脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  None
// @author       You
// @license      Yeatom
// @match        https://academyeurope.eu/lp-courses/mba-diploma-program/master-of-business-administration/lessons/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476724/%E6%AC%A7%E6%B4%B2%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/476724/%E6%AC%A7%E6%B4%B2%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function run(func, ms) {
        return new Promise((resolve, reject) => {
            try {
                const timerId = setTimeout(() => {
                    const result = func();
                    clearTimeout(timerId);
                    resolve(result);
                }, ms);
            } catch (error) {
                reject(error);
            }
        });
    }

    function clickComplete() {
        document.getElementsByClassName('lp-button button button-complete-item button-complete-lesson lp-btn-complete-item')[0].click()
    }

    function clickYes() {
        document.getElementsByClassName('lp-button btn-yes')[0].click()
    }

    async function main() {
        await run(clickComplete, 4500)
        await run(clickYes, 1500)
    }

    main()

})();