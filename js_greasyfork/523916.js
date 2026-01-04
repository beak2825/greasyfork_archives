// ==UserScript==
// @name         XMUM Moodle Submission Reminder
// @namespace    http://tampermonkey.net/
// @version      2025-01-16
// @description  Try to take over the moodle!
// @author       Reality361
// @run-at       document-idle
// @match        https://l.xmu.edu.my/mod/assign/*
// @icon         https://l.xmu.edu.my/pluginfile.php/1/core_admin/favicon/64x64/1726281221/XMUM%20Logo.PNG
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523916/XMUM%20Moodle%20Submission%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/523916/XMUM%20Moodle%20Submission%20Reminder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var introElement = document.getElementById("intro");
    introElement.insertAdjacentHTML('afterend', '<p>交任何东西/截止前看一下：<br>文件格式对吗<br>文件名对吗<br>封面、正文、后缀、评分标准的部分都全吗<br>写/填名字和学号了吗<br>所有题都写了吗<br>写的对吗<br>还要交其他的文件吗<br>提交成功了吗<br>小组中的所有人都要交吗<br>截止后就没有下次了</p>');
})();