// ==UserScript==
// @name         Fuck Elecfans
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  展开电子发烧友文章
// @author       whoami
// @match        *://www.elecfans.com/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389444/Fuck%20Elecfans.user.js
// @updateURL https://update.greasyfork.org/scripts/389444/Fuck%20Elecfans.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function () {
        if (document.getElementsByClassName("simditor-body")[0]){
            document.getElementsByClassName("simditor-body")[0].removeAttribute("style");
            document.getElementsByClassName("seeHide")[0].remove();
        } //自动展开
    }, 2000);
    setTimeout(function () {
        if (document.getElementById("new-middle-berry")) {
            document.getElementById("new-middle-berry").remove();
        }
        if (document.getElementById("AD-background")) {
            document.getElementById("AD-background").remove();
        }
    }, 400);
})();