// ==UserScript==
// @name        bro3_iranadkiru
// @namespace   https://greasyfork.org/ja/users/9894
// @description bro3_iranadkill
// @include     http://*.3gokushi.jp*
// @version     1.00
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_xmlhttpRequest
// @grant               GM_addStyle
// @grant               GM_deleteValue
// @grant               GM_log
// @grant               GM_registerMenuCommand
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/10408/bro3_iranadkiru.user.js
// @updateURL https://update.greasyfork.org/scripts/10408/bro3_iranadkiru.meta.js
// ==/UserScript==
$(document).ready(function(){
document.getElementsByClassName('slide_wrap')[0].remove();
});
var box = document.getElementById('banner_set');
box.style.height = "0px";
