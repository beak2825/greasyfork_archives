// ==UserScript==
// @name         解除 SegmentFault.com 文章需登录后复制
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  我只是想看看，没想要注册个账号
// @author       You
// @match        https://segmentfault.com/a/*
// @match        https://segmentfault.com/q/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410908/%E8%A7%A3%E9%99%A4%20SegmentFaultcom%20%E6%96%87%E7%AB%A0%E9%9C%80%E7%99%BB%E5%BD%95%E5%90%8E%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/410908/%E8%A7%A3%E9%99%A4%20SegmentFaultcom%20%E6%96%87%E7%AB%A0%E9%9C%80%E7%99%BB%E5%BD%95%E5%90%8E%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(!$('#SFUserId').length){
        $('head').append('<meta name="userId" value="233" id="SFUserId">')
    }
})();