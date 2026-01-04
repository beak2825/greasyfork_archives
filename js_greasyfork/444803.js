// ==UserScript==
// @name         Interactive Teachnouvelle Book Hack
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This will get a FREE KEY to any book, and give you all the answers (In only 14 lines of code!).
// @author       You
// @match        https://interactive.teachnouvelle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teachnouvelle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444803/Interactive%20Teachnouvelle%20Book%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/444803/Interactive%20Teachnouvelle%20Book%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.cookie == "") {
         var bookid = document.getElementsByTagName('body')[0].className.substring(document.getElementsByTagName('body')[0].className.indexOf('postid') + 7).split(' ')[0];
         document.cookie = "book_"+bookid+"=yes"
         location.reload()}
   var answer = document.getElementById('correct-1').value.split(',')[0];
   document.getElementsByClassName('txtAnswer')[0].value = (answer)
    let ans = prompt("Here is the answer", (answer));
    if (ans != null) {
        setTimeout(() => {  $('#question_submit button').click(); }, 500);}
    else {setTimeout(() => {  $('#question_submit button').click(); }, 500);}
    var nextlink = document.getElementsByClassName('is_bookpage_nav content_block')[0].children[0].children[0].href
    window.location.href = nextlink
})();