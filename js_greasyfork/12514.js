// ==UserScript==
// @name       Alternate Autologin 1000ms
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      https://www.volksbank-erkelenz.de/ptlweb/WebPortal?bankid=8282
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/12514/Alternate%20Autologin%201000ms.user.js
// @updateURL https://update.greasyfork.org/scripts/12514/Alternate%20Autologin%201000ms.meta.js
// ==/UserScript==
var success=0;

function autosubmit() {
    var t=setInterval(trysubmit,500); 
}

if(typeof jQuery=='undefined') {
    var headTag = document.getElementsByTagName("head")[0];
    var jqTag = document.createElement('script');
    jqTag.type = 'text/javascript';
    jqTag.src = '//ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js';
    jqTag.onload = autosubmit;
    headTag.appendChild(jqTag);
} else {
     autosubmit();
}

function trysubmit(){
    if (success==0){
        if ($('input[type="password"]').val()){
            $('input[type="submit"],button[type="submit"],input.submit,#submit,#login').trigger("click");
            //el = document.getElementById('button_login');
            //el.click();
            success = 1;
        }
    }
}