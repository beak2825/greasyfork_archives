// ==UserScript==
// @name         删除大工学生选课提示框
// @version      0.4
// @description  删除选课界面令人厌恶的提示框和弹出层
// @author       小胖子
// @match        http://jxgl.dlut.edu.cn/student/for-std/course-select/*/turn/*/select
// @include      http://jxgl.dlut.edu.cn/student/for-std/course-select/*/turn/*/select
// @namespace    https://greasyfork.org/zh-CN/scripts/410934
// @license      MIT License
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410934/%E5%88%A0%E9%99%A4%E5%A4%A7%E5%B7%A5%E5%AD%A6%E7%94%9F%E9%80%89%E8%AF%BE%E6%8F%90%E7%A4%BA%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/410934/%E5%88%A0%E9%99%A4%E5%A4%A7%E5%B7%A5%E5%AD%A6%E7%94%9F%E9%80%89%E8%AF%BE%E6%8F%90%E7%A4%BA%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("modal-bulletin").parentNode.removeChild(document.getElementById("modal-bulletin"));
    console.info("Notification removed.");
//      设置cookie,减少提示框的显示
//  $.cookie("stdNoLongerSign", "1",{expires:30});
    document.cookie = "stdNoLongerSign = 1"
})();