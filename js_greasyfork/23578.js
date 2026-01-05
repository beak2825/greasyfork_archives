// ==UserScript==
// @name        Unforce input on GitHub search
// @author      bumaociyuan
// @description unfocus
// @namespace   unfocus
// @include     http*://github.com/search*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23578/Unforce%20input%20on%20GitHub%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/23578/Unforce%20input%20on%20GitHub%20search.meta.js
// ==/UserScript==

var unfocusInputFunction = function() {
    var form = 	document.getElementsByClassName('form-control');
    document.activeElement.blur();
};
window.onload = unfocusInputFunction;
window.onbeforeunload = unfocusInputFunction;