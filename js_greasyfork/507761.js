// ==UserScript==
// @name         删除学习通课程页面AI助教
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  删除课程页面AI助教
// @author       hydrofluoric07
// @match        https://mooc2-ans.chaoxing.com/mooc2-ans/mycourse/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/507761/%E5%88%A0%E9%99%A4%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%AF%BE%E7%A8%8B%E9%A1%B5%E9%9D%A2AI%E5%8A%A9%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/507761/%E5%88%A0%E9%99%A4%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%AF%BE%E7%A8%8B%E9%A1%B5%E9%9D%A2AI%E5%8A%A9%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
     window.addEventListener("load", function() {
        var elements = document.getElementById('nav_0');
        console.log(elements);
        elements.remove();
        elements = document.getElementsByClassName('cx-robot-wrapper');
        elements[0].remove();
    });
})();