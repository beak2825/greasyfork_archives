// ==UserScript==
// @name         115浏览器-启动时自动登陆115
// @namespace    http://115.com/
// @version      0.1
// @description  启动时自动登陆115
// @author       Kernel
// @match        http://115.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367949/115%E6%B5%8F%E8%A7%88%E5%99%A8-%E5%90%AF%E5%8A%A8%E6%97%B6%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86115.user.js
// @updateURL https://update.greasyfork.org/scripts/367949/115%E6%B5%8F%E8%A7%88%E5%99%A8-%E5%90%AF%E5%8A%A8%E6%97%B6%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86115.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var submit_btn = document.querySelector('#js-submit');
    if(submit_btn) {
        window.setTimeout(function(){
            submit_btn.click();
        }, 1000 * 5);
    }
})();