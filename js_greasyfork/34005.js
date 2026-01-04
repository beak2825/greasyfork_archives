// ==UserScript==
// @name         人才学校拦截
// @namespace    http://rcxy.com/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://*.rcxy.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34005/%E4%BA%BA%E6%89%8D%E5%AD%A6%E6%A0%A1%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/34005/%E4%BA%BA%E6%89%8D%E5%AD%A6%E6%A0%A1%E6%8B%A6%E6%88%AA.meta.js
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
        var tr = $("#layout").children("table").children("tbody").children("tr").first();
        tr.hide();
        var tr = tr.next();
        tr.hide();
        var tr = tr.next();
        var tr1 = tr.next();
        tr1.hide();
        tr1 = tr1.next();
        tr1.hide();
        tr1 = tr1.next();
        tr1.hide();
        tr1 = tr1.next();
        tr1.hide();
        tr = tr.children("td").children("table").children("tbody").children("tr").children("td").children("table").children("tbody").children("tr").first();
        tr.hide();
        var tr = tr.next();
        tr.hide();
        var tr = tr.next();
        tr.hide();
        var tr = tr.next();
        tr.hide();
        var tr = tr.next();
        tr.hide();
        var tr = tr.next().children("td").children("table").children("tbody").children("tr").first();
        tr.hide();
        var tr = tr.next();
        tr.hide();
    });
}