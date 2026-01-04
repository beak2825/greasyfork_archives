// ==UserScript==
// @name         人才学校视频关闭
// @namespace    http://rcxy.com/
// @version      0.1
// @description  enter something useful
// @author       lizhengtao
// @match        http://www.rcxy.com/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34007/%E4%BA%BA%E6%89%8D%E5%AD%A6%E6%A0%A1%E8%A7%86%E9%A2%91%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/34007/%E4%BA%BA%E6%89%8D%E5%AD%A6%E6%A0%A1%E8%A7%86%E9%A2%91%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==


var Tampermonkey_jQuery = document.createElement('script');
Tampermonkey_jQuery.src = 'http://lib.sinaapp.com/js/jquery/2.0.3/jquery-2.0.3.min.js';
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
    setTimeout(Close, 2220000);
}
