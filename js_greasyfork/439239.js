// ==UserScript==
// @name         百度云搞快点
// @version      0.2
// @description  不会重定向没有/s/的页面，放心使用
// @AuThor       阿杰的杰
// @match        *://pan.baidu.com/s/*
// @grant        none
// @namespace https://greasyfork.org/users/870057
// @downloadURL https://update.greasyfork.org/scripts/439239/%E7%99%BE%E5%BA%A6%E4%BA%91%E6%90%9E%E5%BF%AB%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/439239/%E7%99%BE%E5%BA%A6%E4%BA%91%E6%90%9E%E5%BF%AB%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.location.href = window.location.href.replace(window.location.origin,"https://baidu.kinh.cc/");
})();