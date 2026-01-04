// ==UserScript==
// @name         CSDN强制复制
// @namespace    http://tampermonkey.net/
// @version      20240305
// @description  CSDN不登录即可复制内容
// @author       You
// @match        https://blog.csdn.net/*
// @icon         https://profile-avatar.csdnimg.cn/default.jpg!2
// @grant        none
// @license none
// @downloadURL https://update.greasyfork.org/scripts/489073/CSDN%E5%BC%BA%E5%88%B6%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/489073/CSDN%E5%BC%BA%E5%88%B6%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#content_views").unbind("copy")
})();