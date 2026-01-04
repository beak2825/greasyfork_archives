// ==UserScript==
// @name         coloripaintvn +
// @namespace    https://coloripaint.vn/
// @version      0.1
// @description  script for coloripaint.vn function①some links open in new tab[部分链接在新窗口中打开]
// @author       黄盐
// @match        *://coloripaint.vn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466823/coloripaintvn%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/466823/coloripaintvn%20%2B.meta.js
// ==/UserScript==
 
(function() {
    //match: coloripaint.vn/*/scripts/*[^(feedback)]$
    if(document.querySelectorAll("#browse-script-list a").length>0){
        [].slice.call(document.querySelectorAll("#browse-script-list a")).forEach(function(aTag) {aTag.setAttribute('target', '_blank');console.log("1");});
    }
    //match: coloripaint.vn/*/scripts/*/feedback
    else if(document.querySelectorAll("#discussions a").length>0){
        [].slice.call(document.querySelectorAll("#discussions a")).forEach(function(aTag) {aTag.setAttribute('target', '_blank');console.log("2");});
    }
})();