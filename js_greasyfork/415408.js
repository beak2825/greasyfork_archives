// ==UserScript==
// @name         256zw
// @name:zh      禁止PC页面跳转
// @name:zh-CN   禁止PC页面跳转
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description:zh-cn  禁止256zw网站的PC页面跳转
// @description  Disable Redirect Url in PC!
// @author       Chas
// @include      *256zw.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/415408/256zw.user.js
// @updateURL https://update.greasyfork.org/scripts/415408/256zw.meta.js
// ==/UserScript==
(function() {
    'use strict';
    Object.defineProperty(navigator,'platform',{get:function(){return 'Android';}});
})();