// ==UserScript==
// @name         OSP Document Clear(PayneV)
// @namespace    https://greasyfork.org/zh-CN/users/142985-paynev
// @version      0.5
// @description  清除 outsystems.com/Documentation里乱七八糟的Header，知识点树，Footer,etc.
// @author       PayneV
// @include      https://*outsystems.com/Documentation/*
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/402053/OSP%20Document%20Clear%28PayneV%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402053/OSP%20Document%20Clear%28PayneV%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var array = new Array();
    // Header
    array.push("header.elm-header");
    // 右下角Fix的小图标
    array.push("#drift-widget-container");
    // 右边FeedBack
    array.push("div.elm-article-feedback");
    // 左侧知识点树
    // array.push("div#sidebar");
    // Footer
    array.push("footer.elm-footer");

    var selector = array.join(',');

    $(selector).remove();

})();