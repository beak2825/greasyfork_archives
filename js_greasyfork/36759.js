// ==UserScript==
// @name         Youtrack_check_changelog
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       m.semerikov@ispsystem.com
// @match        http://youtrack.ispsystem.net:8080/issue/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36759/Youtrack_check_changelog.user.js
// @updateURL https://update.greasyfork.org/scripts/36759/Youtrack_check_changelog.meta.js
// ==/UserScript==

window.onload = function(){
var i, j=0;
var comment_text = document.getElementsByClassName('comment-content');
var len = comment_text.length;

//alert(document.getElementById('resolution').value);

if (len > 0) {
    for (i = 0; i <= len; i++){
        if ( -1 < comment_text[i].innerHTML.indexOf("#CL#") ) {
            j += 1;
        }
        //alert ( i + "  " + len + "  " + j );

        if ( (i == len-1) && ( j === 0) ){
            alert ('\n\n                     ATTENTION! Changelog was not found! \n\n');
        }
    }
} else {
    alert ('\n\n                     ATTENTION! Changelog was not found! \n\n');
}
}();