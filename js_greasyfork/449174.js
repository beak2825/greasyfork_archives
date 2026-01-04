// ==UserScript==
// @name         acgtv2otoink
// @namespace    https://www.moeac.fun
// @version      0.2
// @description  把简介的acgtv换成otoink
// @author       moeac
// @match        *://www.bilibili.com/video/*
// @icon         http://s.otm.ink/favicon.ico
// @grant        none
// @license BSD 2-Clause
// @downloadURL https://update.greasyfork.org/scripts/449174/acgtv2otoink.user.js
// @updateURL https://update.greasyfork.org/scripts/449174/acgtv2otoink.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    setTimeout(function() {
        var y = document.getElementsByClassName("desc-info desc-v2")[0].innerHTML;
        y = y.replace("<a href=\"//acg.tv", "<a href=\"//s.otm.ink");
        document.getElementsByClassName("desc-info desc-v2")[0].innerHTML = y
    },2000)
    function fuckacgtv() {
        setTimeout(function() {
            var x = document.getElementsByClassName("desc-info-text")[0].innerHTML;
            x = x.replace("<a href=\"//acg.tv", "<a href=\"//s.otm.ink");
            document.getElementsByClassName("desc-info-text")[0].innerHTML = x;

            var y = document.getElementsByClassName("desc-info desc-v2")[0].innerHTML;
            y = y.replace("<a href=\"//acg.tv", "<a href=\"//s.otm.ink");
            document.getElementsByClassName("desc-info desc-v2")[0].innerHTML = y
        },1000)
    }
    fuckacgtv();
})();