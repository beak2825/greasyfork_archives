// ==UserScript==
// @name         keylol 板块自动按最新发布排序
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  keylol 板块自动按最新发布排序脚本
// @author       shiquda
// @include      /https://keylol.com/f\d+\-\d+
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453565/keylol%20%E6%9D%BF%E5%9D%97%E8%87%AA%E5%8A%A8%E6%8C%89%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/453565/keylol%20%E6%9D%BF%E5%9D%97%E8%87%AA%E5%8A%A8%E6%8C%89%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    var $url = window.location.href
    var fid = Number($url.slice(20,23))
    window.location.href = 'https://keylol.com/forum.php?mod=forumdisplay&fid=' + fid + '&filter=author&orderby=dateline'
})()
