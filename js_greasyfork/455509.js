// ==UserScript==
// @name         Disable YouTube Glow/Ambilight --GreaseMonkey Fix (hopefully)--
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script that removes the shitty glow/ambilight effect on the new YouTube downgrade. A mod suggested a fix for Greasemonkey which doesn't use GM_AddStyle anymore, so i pasted it in. Did a quick test with GreasyMonkey and it does seem to work.
// @author       TB-303
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455509/Disable%20YouTube%20GlowAmbilight%20--GreaseMonkey%20Fix%20%28hopefully%29--.user.js
// @updateURL https://update.greasyfork.org/scripts/455509/Disable%20YouTube%20GlowAmbilight%20--GreaseMonkey%20Fix%20%28hopefully%29--.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

(function() {
'use strict';
if(typeof GM_addStyle !== 'function'){
var GM_addStyle = function addStyle(css) {// GM_addStyle redefined as explained here: https://9to5answer.com/gm_addstyle-equivalent-in-tampermonkey
const style = document.getElementById("GM_addStyleBy8626") || (function() {
const style = document.createElement('style');
style.type = 'text/css';
style.id = "GM_addStyleBy8626";
document.head.appendChild(style);
return style;
})();
const sheet = style.sheet;
sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}
}
GM_addStyle
(`#cinematics.ytd-watch-flexy {
display: none;
}
`)

})();
})();