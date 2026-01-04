// ==UserScript==
// @name         ZenHelper
// @namespace    https://zenvideo.cn/
// @version      0.2
// @description  try to take over the world!
// @author       wen.wu
// @match        https://*.zenvideo.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40065/ZenHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/40065/ZenHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function appendStyle(styles) {
        var css = document.createElement('style');
        css.type = 'text/css';

        if (css.styleSheet) css.styleSheet.cssText = styles;
        else css.appendChild(document.createTextNode(styles));

        document.getElementsByTagName("head")[0].appendChild(css);
    }

    var styles = '.preview-canvas-box {position: relative;}'
               + 'svg foreignObject {z-index: 5}';

    appendStyle(styles);
    /*window.onload = function() {
        appendStyle(styles);
    };*/
})();