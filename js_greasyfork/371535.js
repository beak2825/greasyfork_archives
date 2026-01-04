/* jslint          moz: true, expr: true */
// ==UserScript==
// @name           Deezer AdBlock UI Fixer!
// @namespace      DeezerAdBlockUIFixer
// @description    Fix Deezer Squished UI when using an AdBlocker!
// @include        http*://*.deezer.*
// @noframe
// @author         SerSeek
// @priority          2
// @run-at         document-end
// @version        1.0.0.2
// @downloadURL https://update.greasyfork.org/scripts/371535/Deezer%20AdBlock%20UI%20Fixer%21.user.js
// @updateURL https://update.greasyfork.org/scripts/371535/Deezer%20AdBlock%20UI%20Fixer%21.meta.js
// ==/UserScript==
var xx;

!function AdBlock() {
    xx = document.getElementsByClassName('page-main');
    window.setTimeout(after, 800);
}();

function after() {
    xx[0].className = 'page-main';
}