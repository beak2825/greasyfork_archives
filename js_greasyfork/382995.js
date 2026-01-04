// ==UserScript==
// @name                          ShiMo Full Screen
// @name:zh-CN                    石墨全屏
// @version                       0.0.1
// @description                   ShiMo Edit Full Screen
// @description:zh-CN             石墨编辑全屏
// @author                        1018ji
// @include                       https://shimo.im/docs/*
// @run-at                        document-end
// @namespace https://greasyfork.org/users/301526
// @downloadURL https://update.greasyfork.org/scripts/382995/ShiMo%20Full%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/382995/ShiMo%20Full%20Screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var editor = null
    setTimeout(function() {
        editor = document.getElementById('editor');
        if (editor) {
            editor.style.width = 'auto';
            editor.style.marginLeft = '350px';
            editor.style.marginRight = '50px';
        }
    }, 2000);
})();