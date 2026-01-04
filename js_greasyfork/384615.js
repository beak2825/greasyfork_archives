// ==UserScript==
// @name         金斧子网删除
// @namespace    http://www.scixiv.com
// @version      0.1
// @description  删除烦人的投资人登录限制
// @author       Hardy Wu
// @match        https://*.jfz.com/*
// @grant        All
// @downloadURL https://update.greasyfork.org/scripts/384615/%E9%87%91%E6%96%A7%E5%AD%90%E7%BD%91%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/384615/%E9%87%91%E6%96%A7%E5%AD%90%E7%BD%91%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('load', function() {
        setTimeout(function(){
            var pop = document.querySelector('#LoginAuth')
            if (pop) pop.remove()
            document.body.removeAttribute('scroll')
            document.body.removeAttribute('style')
        }, 1000);
    }, false);
})();