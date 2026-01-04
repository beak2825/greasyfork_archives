// ==UserScript==
// @name         Comment Cleaner
// @namespace    http://greasyfork.org/
// @version      1.6b
// @description  filter unnecessary comments for securitytut.com | networktut.com | 9tut.com
// @author       t3amo
// @include       https://www.securitytut.com/ccna-security-210-260/share-your-ccna-security-experience-2/*
// @include       http://www.securitytut.com/ccna-security-210-260/share-your-ccna-security-experience-2/*
// @include       https://www.networktut.com/share-your-tshoot-v2-0-experience/*
// @include       http://www.9tut.com/share-your-ccna-v3-0-experience/*
// @include       http://www.digitaltut.com/share-your-route-v2-0-experience/*
// @include       https://www.certprepare.com/share-your-switch-v2-0-experience/*
// @include       http://www.rstut.com/ccie-v5-written/share-your-ccie-v5-written-experience/*
// @grant
// @downloadURL https://update.greasyfork.org/scripts/40204/Comment%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/40204/Comment%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';


function filter(zEvent) {
    zEvent.preventDefault ();
    zEvent.stopPropagation ();
var searchKey = [ "getmyfile", "pass4surekey","whatapp","whatsapp","voucher","ccieexam","%20Security%20210-260.pdf","cciecourse","ceesty","cciesplab","ebay.com",".cn/","Muhammad Masoom","ciscobraindump","rebrand","itlibraries",
    ".google","dumps4download","braindumpscerts","realexamdumps"];
var ctr=0;
var comment = document.getElementById('thecomments');
var totalComments = comment.getElementsByTagName('li').length;
for (var i = 0; i < totalComments; i++) {

    for (var x = 0; x < searchKey.length ; x++ ) {
         var getComment = comment.getElementsByTagName('li')[i].textContent;
         var google = getComment.search(searchKey[x]);
         if (google != -1 ){ comment.getElementsByTagName('li')[i].innerHTML=""; ctr= ctr+ 1;}
    }
    // remove short comments
         if (comment.getElementsByTagName('li')[i].textContent.length < 250 ){ ;comment.getElementsByTagName('li')[i].innerHTML=""; ctr= ctr+ 1;}


}
alert( ctr + " comments filtered!");
}
function filterURL(zEvent) {
    zEvent.preventDefault ();
    zEvent.stopPropagation ();

var comment = document.getElementById('thecomments');
var totalComments = comment.getElementsByTagName('li').length;
for (var i = 0; i < totalComments; i++) {
         var getComment = comment.getElementsByTagName('li')[i].textContent;
         var google = getComment.search("dropbox|zippyshare|mediafire|mega|nofile");
         if (google < 0 ){ comment.getElementsByTagName('li')[i].innerHTML="";}
}
}
function filterNO(zEvent) {
    zEvent.preventDefault ();
    zEvent.stopPropagation ();
    location.reload();
}


 //user defined functions
function downloadLink(zEvent) {
      zEvent.preventDefault ();
      zEvent.stopPropagation ();
    //alert("This will redirect you to the comment page where the download link was posted");
window.location.href='http://www.securitytut.com/ccna-security-210-260/share-your-ccna-security-experience-2/comment-page-169#comments';
}
//------------------------------------------end of user define function

// add elements on page
var element = document.getElementById("commentnavi");
var br = document.createElement('br');
element.appendChild(br);


var div1= document.createElement('div');
    div1.id = "filter1";
    div1.innerHTML = "<a href='#'>FILTER Comments</a><br>";
element.appendChild(div1);
div1.addEventListener ("click", filter, false);


var div2= document.createElement('div');
    div2.id = "filter2";
    div2.innerHTML = "<a href='#'>FILTER URL only</a><br>";
element.appendChild(div2);
div2.addEventListener ("click", filterURL, false);

var div3= document.createElement('div');
    div3.id = "filter3";
    div3.innerHTML = "<a href='#'>DISPLAY all comments</a><br>";
element.appendChild(div3);
div3.addEventListener ("click", filterNO, false);

//download links per website
if (window.location.host == 'www.securitytut.com'){
var div4= document.createElement('div');
    div4.id = "filter3";
    div4.innerHTML = "DOWNLOAD Links <br>&nbsp;&nbsp;<a href=''>IKE + 20</a><br>&nbsp;&nbsp;<a href=''>EGYPT GUY</a>";
element.appendChild(div4);
div4.addEventListener ("click", downloadLink, false);
}

if (window.location.href == 'http://www.securitytut.com/ccna-security-210-260/share-your-ccna-security-experience-2/comment-page-169#comments'){

var comment = document.getElementById('thecomments');
var totalComments = comment.getElementsByTagName('li').length;
for (var i = 0; i < totalComments; i++) {
         var getComment = comment.getElementsByTagName('li')[i].textContent;
         var google = getComment.search("dropbox|zippyshare|mediafire|mega|nofile");
         if (google < 0 ){ comment.getElementsByTagName('li')[i].innerHTML="";}
}
}























})();