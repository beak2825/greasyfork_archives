// ==UserScript==
// @name          Prospect
// @version        0.1
// @description    Mouseup and Postmessage script
// @author        ikarma
// @icon           http://www.mturkgrind.com/data/avatars/l/2/2601.jpg?1442882630
// @namespace  https://greasyfork.org/en/users/9054
// @require     http://code.jquery.com/jquery-latest.min.js
// @include        *
// @copyright      2012+, You
// @downloadURL https://update.greasyfork.org/scripts/13847/Prospect.user.js
// @updateURL https://update.greasyfork.org/scripts/13847/Prospect.meta.js
// ==/UserScript==

if ( $("p:contains('Enter the name')").length ) {
    var answ = "N/A";
    var  globalURL = "http://" + document.getElementsByClassName("row col-xs-12 col-md-12")[0].getElementsByTagName("td")[5].innerText;
    var searchWindow = window.open(globalURL,"searchWindow","height = 900, width = 900");
    var topBox = window.document.getElementById("web_url");

    window.addEventListener("message", listener, false);
}

$(window).mouseup(function(e) {      
    answ = window.getSelection().toString();
    window.opener.postMessage({A: answ},'*');
});

function listener(l){
    var info = l.data;
    topBox.value = info.A;
}