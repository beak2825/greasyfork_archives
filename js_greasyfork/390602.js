// ==UserScript==
// @name         CSDN Auto Read More
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动展开CSDN阅读页面
// @author       Jas0n
// @match        https://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390602/CSDN%20Auto%20Read%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/390602/CSDN%20Auto%20Read%20More.meta.js
// ==/UserScript==


(function() {
    'use strict';

    console.log('cnsn自动展开脚本被触发');
    var el = document.getElementsByClassName('btn-readmore');
    if (el.length == 0) {
        return
    }
    var evt = document.createEvent('Event');
    evt.initEvent('click',true,true);
    el[0].dispatchEvent(evt);
})();