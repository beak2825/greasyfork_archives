// ==UserScript==
// @name TheOldReader - add links & full screen
// @description Improve TheOldReader RSS feed reader interface
// @namespace https://greasyfork.org/ro/scripts/37253
// @include *theoldreader.com*
// @include https://theoldreader.com/feeds/*
// @grant GM_addStyle
// @version 1.3
// @downloadURL https://update.greasyfork.org/scripts/37253/TheOldReader%20-%20add%20links%20%20full%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/37253/TheOldReader%20-%20add%20links%20%20full%20screen.meta.js
// ==/UserScript==

// Changes to interface
// =============================================================

GM_addStyle ( ".navbar-fixed-top { top: -55px !important}"); // hide header
GM_addStyle ( ".reader .body-fixed-top { top: -10px !important; }");   //lift article reading area
GM_addStyle ( ".static .page-header { margin-bottom: 2px; display:inline-flex; }"); //change feed identifying area
GM_addStyle ( ".page-header { margin-top: 22px; }"); //change feed identifying area
GM_addStyle ( ".reader .floating { background: #dcdcdc;  padding: 3px 0 5px 0; }"); //change feed identifying area
GM_addStyle ( ".floating { padding-left: 10px !important; padding-right: 10px !important; }");  // add some space
GM_addStyle ( ".static .page-header h1 { font-size:16px; }");      //****
GM_addStyle ( ".page-header .feedtop-buttons { padding-right:20px; }");      //****
GM_addStyle ( ".cell.sidenav-cell { top: -21px !important;  }"); //lift feed summary area from the left
GM_addStyle ( ".sidebar .nano { 106% !important; }");      //not working

GM_addStyle ( ".well { background:none; }");      //eliminate grey background
GM_addStyle ( ".post .btns { display:none; }");      //eliminate share buttons at the end of some articles

//GM_addStyle ( "a.dropdown-toggle { background-color: teal; top: 60px; }");      //eliminate share buttons at the end of some articles

GM_addStyle ( ".reader.has-notice .notice.nice { padding: 0px !important; max-height: 0px !important; display:none }"); //hide notification
GM_addStyle ( "navbar navbar-default navbar-fixed-top { max-height: 0px !important }"); //hide notification
GM_addStyle ( "body.has-notice .navbar { margin-top: 0px !important }"); //hide notification

GM_addStyle ( "XXXX { YYYY }");      //****
GM_addStyle ( "XXXX { YYYY }");      //****



// Add links
// =============================================================

document.getElementById("refresh-btn").addEventListener("click", myFunction);

myFunction();

var elemente = document.getElementsByTagName('strong');
for (var j = 0; j < elemente.length; j++) {
    elemente[j].addEventListener("click",myFunction_cover );
}

function myFunction_cover() {
    var titlu=document.getElementsByTagName("h1")[0].innerHTML;
    for(k=0;k<10;k++) {
        setTimeout(function(){
            var t=document.getElementsByTagName("h1")[0].innerHTML;
            if (t !== titlu) {
                //alert(k + ' / ' + titlu + ' // ' + t);
                myFunction();
            }
        } , 2000);
    }
}

function myFunction() {
    var a, links;
    links = document.getElementsByClassName('well clearfix post listview');
    for (var i = 0; i < links.length; i++) {
        a = links[i];
        a.innerHTML=a.innerHTML.replace(/(<strong>)([^<]*?)(<\/strong>[\S\s]*?<h3 dir="ltr">)([\S\s]*?)(<\/h3>)/g , "$1$4$3$4$5");
    }
}



