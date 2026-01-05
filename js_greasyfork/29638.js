// ==UserScript==
// @name         Bagzilla_check_changelog
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       m.semerikov@ispsystem.com
// @match        http://bugtrack.ispsystem.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29638/Bagzilla_check_changelog.user.js
// @updateURL https://update.greasyfork.org/scripts/29638/Bagzilla_check_changelog.meta.js
// ==/UserScript==

window.onload = function(){
var i, j=0;
var comment_text = document.getElementsByClassName('bz_comment_text');
var len = comment_text.length;

//alert(document.getElementById('resolution').value);

if ( (document.getElementById('bug_status').value == 'RESOLVED') && (document.getElementById('resolution').value == 'FIXED') ) //Если статус баги РЕШЕНА ИСПРАВЛЕНА, то проверяем ченжлог
{
    for (i = 0; i <= len; i++){
        if ( -1 < comment_text[i].innerHTML.indexOf("#CL#") ){
            j += 1;
        }
        //alert ( i + "  " + len + "  " + j );

        if ( (i == len-1) && ( j === 0) ){
            alert ('\n\n                     ATTENTION! Changelog was not found! \n\n');
        }
    }
}
}();