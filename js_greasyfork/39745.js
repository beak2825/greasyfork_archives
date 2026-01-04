// JavaScript source code
// ==UserScript==
// @name         AutoRate4iCourse163
// @namespace    http://github.com/ducksoft
// @version      0.3
// @description  网易云课堂自动评作业
// @author       DuckSoft & Nekokir & wanghaiwei
// @match        *://www.icourse163.org/learn/*
// @match        *://www.icourse163.org/spoc/learn/*
// @downloadURL https://update.greasyfork.org/scripts/39745/AutoRate4iCourse163.user.js
// @updateURL https://update.greasyfork.org/scripts/39745/AutoRate4iCourse163.meta.js
// ==/UserScript==

(() => {
    "use strict";
    (f => {
        if (document.addEventListener) window.addEventListener("load", f, false);
        else if (window.attachEvent) window.attachEvent("onload", f);
    })(() => {
        var box = document.getElementById('courseLearn-inner-box');
        if (box) {
            box.addEventListener('dblclick', function(){
                [].forEach.call(document.getElementsByClassName('s'), e => {e.children[e.children.length-1].children[0].checked=true});
                [].forEach.call(document.getElementsByName('inputtxt'), e => {e.value='666'});
                document.getElementsByClassName('j-submitbtn')[0].click();
            });
        }
    });
})();
