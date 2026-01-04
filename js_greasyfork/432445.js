// ==UserScript==
// @name         yapi mini tool
// @version      0.1
// @description  yapi复制下划线转驼峰
// @author       huanglinbin
// @include      http://yapi.batmobi.cn/*
// @include      https://yapi.batmobi.cn/*
// @grant        none
// @namespace https://greasyfork.org/users/815606
// @downloadURL https://update.greasyfork.org/scripts/432445/yapi%20mini%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/432445/yapi%20mini%20tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('copy', function(clipBoardEvent) {
        var text = window.getSelection().toString();

        clipBoardEvent.clipboardData.setData('text/plain', text.replace(/_+(.)/g, (__, letter) => letter.toUpperCase()));

        clipBoardEvent.preventDefault();

    });

})();