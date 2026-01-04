// ==UserScript==
// @name         M-Team大图预览
// @namespace    https://kp.m-team.cc
// @version      0.2
// @description  修改种子页面预览图尺寸
// @author       You
// @match        https://kp.m-team.cc/browse/adult
// @grant        none
// @license      MIT
// @author       y1
// @downloadURL https://update.greasyfork.org/scripts/491433/M-Team%E5%A4%A7%E5%9B%BE%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/491433/M-Team%E5%A4%A7%E5%9B%BE%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==


(function() {
    'use strict';

    document.addEventListener('wheel', function(event) {
        if (event.deltaY > 0) {
            document.querySelectorAll('.ant-image-img').forEach(function(element) {
                element.style.width = '600px';
                element.style.height = '400px';
            });
        } else if (event.deltaY < 0) {
            // Code to revert changes if scrolling up
        }
    });
})();
