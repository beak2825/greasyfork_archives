// ==UserScript==
// @name         人才学校点击
// @namespace    http://rcxy.com/
// @version      0.2
// @description  enter something useful
// @author       lizhengtao
// @match        http://60.191.1.173/personal/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34006/%E4%BA%BA%E6%89%8D%E5%AD%A6%E6%A0%A1%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/34006/%E4%BA%BA%E6%89%8D%E5%AD%A6%E6%A0%A1%E7%82%B9%E5%87%BB.meta.js
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
    $(document).ready(function () {
        start( $('[target="_blank"]'),4);
    });
}

function start(links,i)
{
     var link= links[i];
     link.click();
     i = i +1;
     setTimeout(function(){ start(links,i);}, 2400000);
     //setTimeout(function(){ start(links,i);}, 2400);
}
