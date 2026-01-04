// ==UserScript==
// @name         NHK Web Cheaty
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Shows the furigana when you click a Kanji on NHK WEB Easy.
// @author       You
// @match        https://www3.nhk.or.jp/news/easy/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/380416/NHK%20Web%20Cheaty.user.js
// @updateURL https://update.greasyfork.org/scripts/380416/NHK%20Web%20Cheaty.meta.js
// ==/UserScript==

(function() {

    $('head').append('<style>ruby.show-rt rt {visibility:visible !important; display:block !important; } ruby.show-rt {color:blue;} </style>');

    $('ruby').click(function(e) {
       $(this).toggleClass('show-rt');
    });

    // Your code here...
})();