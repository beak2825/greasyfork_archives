// ==UserScript==
// @name         csdn复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一行代码解决csdn复制，基于csdn(copyright)修改
// @author       hoo yo
// @match        https://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372478/csdn%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/372478/csdn%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    csdn.copyright.init($("article")[0],"","");
})();