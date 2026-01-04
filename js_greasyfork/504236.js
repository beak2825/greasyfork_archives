// ==UserScript==
// @name         google location auto update
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  update google location automatically
// @author       Door Ma
// @match        https://www.google.com/search?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504236/google%20location%20auto%20update.user.js
// @updateURL https://update.greasyfork.org/scripts/504236/google%20location%20auto%20update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 对于 search 的提交时间间隔
    setInterval(function() {
        if (window.location.href.includes('www.google.com/search?q=')) {
            let element_search = document.querySelector('update-location');
            if (element_search) {
                element_search.click();
            } else {
                console.log('未找到更新按钮');
                alert('未找到更新按钮');
            }
        }
    }, 600000); // 毫秒，执行一次位置提交

})();
