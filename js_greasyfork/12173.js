// ==UserScript==
// @name         lacucaracha.hatenablog ad kill
// @namespace    http://your.homepage/
// @version      0.1
// @description  ad kill for lacucaracha.hatenablog
// @author       a
// @match        http://lacucaracha.hatenablog.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12173/lacucarachahatenablog%20ad%20kill.user.js
// @updateURL https://update.greasyfork.org/scripts/12173/lacucarachahatenablog%20ad%20kill.meta.js
// ==/UserScript==
!function() {
    document.getElementsByClassName("a-alert")[0].style.display="none";
    document.getElementsByClassName("a-alert")[1].style.display="none";
}();