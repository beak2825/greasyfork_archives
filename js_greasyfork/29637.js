// ==UserScript==
// @name         Bagzilla_collapse_comment_by_Jenkins
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       m.semerikov@ispsystem.com
// @match        http://bugtrack.ispsystem.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29637/Bagzilla_collapse_comment_by_Jenkins.user.js
// @updateURL https://update.greasyfork.org/scripts/29637/Bagzilla_collapse_comment_by_Jenkins.meta.js
// ==/UserScript==

window.onload = function(){
var i, j=0, comment_number, comment_text_id, collapse, collapse_simbol, collapse_simbol_id;
var author = document.getElementsByClassName('fn');
var comment_text = document.getElementsByClassName('bz_comment_text');
var len = author.length, len_body;

for (i = 1; i <= len; i++){
    //alert(comment_text[i].innerHTML);
    //alert(1);
    if (author[i].innerHTML == "jenkins" && author[i].parentNode.parentNode.parentNode.className == "bz_comment_user"){
       comment_number = author[i].parentNode.parentNode.parentNode.parentNode.parentNode.id.slice(1);
       comment_text_id = "comment_text_" + comment_number;
       collapse = document.getElementById(comment_text_id);
       collapse.className = "bz_comment_text collapsed";

       collapse_simbol_id = "comment_link_" + comment_number;
       collapse_simbol = document.getElementById(collapse_simbol_id);
       collapse_simbol.innerHTML = "[+]";
    }
}
}();