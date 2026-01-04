// ==UserScript==
// @name         Greasyfork +
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  script for Greasyfork.org function①some links open in new tab[部分链接在新窗口中打开]
// @author       黄盐
// @match        *://greasyfork.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30381/Greasyfork%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/30381/Greasyfork%20%2B.meta.js
// ==/UserScript==

(function() {
    //match: greasyfork.org/*/scripts/*[^(feedback)]$
    if(document.querySelectorAll("#browse-script-list a").length>0){
        [].slice.call(document.querySelectorAll("#browse-script-list a")).forEach(function(aTag) {aTag.setAttribute('target', '_blank');console.log("1");});
    }
    //match: greasyfork.org/*/scripts/*/feedback
    else if(document.querySelectorAll("#discussions a").length>0){
        [].slice.call(document.querySelectorAll("#discussions a")).forEach(function(aTag) {aTag.setAttribute('target', '_blank');console.log("2");});
    }
})();