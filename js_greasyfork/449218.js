// ==UserScript==
// @name        AtcoderSubmissionShareWithTitle
// @namespace   https://github.com/tmikada
// @version      1.01
// @description AtCoderの提出をシェアするときに問題のタイトルを含める
// @include     https://atcoder.jp/contests/*/submissions/*
// @auther tmikada
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449218/AtcoderSubmissionShareWithTitle.user.js
// @updateURL https://update.greasyfork.org/scripts/449218/AtcoderSubmissionShareWithTitle.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var mondaiTitle = "";
    var thElems = document.getElementsByTagName("th");
    for(var i = 0; i < thElems.length; i++) {
        var elm = thElems[i];
        if(thElems[i].innerHTML == "問題") {
            mondaiTitle = thElems[i].nextElementSibling.textContent;
        }
    }

    var tweetButton = document.getElementsByClassName("a2a_button_twitter");
    var linkNode = tweetButton[0].parentNode;
    var title = linkNode.getAttribute("data-a2a-title");
    linkNode.setAttribute("data-a2a-title",mondaiTitle+"\r\n"+title);

})();
