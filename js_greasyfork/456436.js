// ==UserScript==
// @name         Auto switch to student email domain
// @namespace    https://greasyfork.org/zh-TW/scripts/456436
// @version      1.1
// @description  Automatic switch to student email domain
// @author       Kasper4649
// @match        https://mail.ustc.edu.cn/*
// @match        https://email.ustc.edu.cn/*
// @icon         https://email.ustc.edu.cn/favicon.ico
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456436/Auto%20switch%20to%20student%20email%20domain.user.js
// @updateURL https://update.greasyfork.org/scripts/456436/Auto%20switch%20to%20student%20email%20domain.meta.js
// ==/UserScript==

(function() {
    'use strict';
    changeDomain('mail.ustc.edu.cn');
})();