// ==UserScript==
// @name         麦课通识学院
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动完成课程
// @author       You
// @match        *://mcwk.mycourse.cn/*
// @downloadURL https://update.greasyfork.org/scripts/388174/%E9%BA%A6%E8%AF%BE%E9%80%9A%E8%AF%86%E5%AD%A6%E9%99%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/388174/%E9%BA%A6%E8%AF%BE%E9%80%9A%E8%AF%86%E5%AD%A6%E9%99%A2.meta.js
// ==/UserScript==

(function() {
    setTimeout(function() {
        finishWxCourse();
        backToList();
    }, 2500);
})();