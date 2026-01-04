// ==UserScript==
// @name         解除openwrite阅读更多
// @namespace    https://jisuye.com/
// @version      0.1
// @description  解除openwrite阅读更多!!
// @author       ixx
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403204/%E8%A7%A3%E9%99%A4openwrite%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/403204/%E8%A7%A3%E9%99%A4openwrite%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.getElementById("read-more-wrap")){
        document.getElementById("read-more-wrap").remove();
        document.getElementById("content").style.height=''
    }
})();