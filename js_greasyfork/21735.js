// ==UserScript==
// @name         江西干部挂机
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       You
// @match        http://www.jxgbwlxy.gov.cn/student/course!list.action*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21735/%E6%B1%9F%E8%A5%BF%E5%B9%B2%E9%83%A8%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/21735/%E6%B1%9F%E8%A5%BF%E5%B9%B2%E9%83%A8%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var course = $("a[href='javascript:;']").get(0).attributes.onclick.nodeValue;
    course = course.substring(course.indexOf('(') + 1, course.indexOf(')'));
    $.get('http://www.jxgbwlxy.gov.cn/portal/study!start.action?id=' + course);
    setTimeout(function(){
        $.get('http://www.jxgbwlxy.gov.cn/portal/study!duration.action?id=' + course);
        location.replace(window.location.href);
    }, Math.random()*(900000-600000)+600000);
})();