// ==UserScript==
// @name         Block Bilibili AppPromote
// @namespace    http://www.bilibili.com/
// @version      0.2
// @description  Get rid of the annoying app promote element.
// @author       LTW
// @match        http://www.bilibili.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23409/Block%20Bilibili%20AppPromote.user.js
// @updateURL https://update.greasyfork.org/scripts/23409/Block%20Bilibili%20AppPromote.meta.js
// ==/UserScript==
//感谢知乎用户@张大川的代码分享~

var Tampermonkey_jQuery = document.createElement('script');
Tampermonkey_jQuery.src = 'http://www.bilibili.com/online.js';
Tampermonkey_jQuery.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(Tampermonkey_jQuery);

function Tampermonkey_jQuery_wait()
{
    if(typeof jQuery == 'undefined') { window.setTimeout(Tampermonkey_jQuery_wait,100); }
    else { $ = jQuery; runjQuery(); }
    console.log("waiting for jQuery prepared");
}
Tampermonkey_jQuery_wait();

function runjQuery()
{
    $(document).ready(function () {
        // here to add your code
        $(".app-promote").hide();
        $("#ad").remove();
        $("#dc").remove();
        $("#ifd").remove();
    });
}