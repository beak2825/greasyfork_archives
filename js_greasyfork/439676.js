// ==UserScript==
// @name         BTSOW复制修复
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  BTSOW的复制修复
// @author       lvzhenbo
// @match        https://btsow.bar/magnet/*
// @icon         https://btsow.bar/app/bts/View/img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439676/BTSOW%E5%A4%8D%E5%88%B6%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/439676/BTSOW%E5%A4%8D%E5%88%B6%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = document.getElementById('copyToClipboard');
    button.addEventListener('click', function () {
        var text = document.getElementById('magnetLink');
        text.select();
        document.execCommand("copy");
        alert("复制成功");
    }, false);
})();