// ==UserScript==
// @name         Emilianify
// @version      70.4.0.2 AlphaBeta
// @description  Try to Emilianify your world!
// @author       Player_AAA
// @match        https://www.reddit.com/r/Re_Zero/*
// @match        https://www.reddit.com/r/re_zero/*
// @match        https://www.reddit.com/r/Re_Zero
// @match        https://www.reddit.com/r/re_zero
// @grant        none
// @namespace https://greasyfork.org/users/62991
// @downloadURL https://update.greasyfork.org/scripts/22724/Emilianify.user.js
// @updateURL https://update.greasyfork.org/scripts/22724/Emilianify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i;
    var flair = document.getElementsByClassName('flair');
    for (i = 0; i < flair.length; ++i) {
        flair[i].style.backgroundPosition = '0px -1200px';
    }
    document.querySelectorAll("a[href='#hms']")[0].setAttribute('style', 'background-image:url("https://s3.postimg.io/fnpl4p8ib/right_sidebar_emilianified.png")');
    document.querySelectorAll("a[href='#hmc']")[0].setAttribute('style', 'background-image:url("https://s3.postimg.io/fnpl4p8ib/right_sidebar_emilianified.png")');
    document.querySelectorAll("a[href='#hmt']")[0].setAttribute('style', 'background-image:url("https://s3.postimg.io/fnpl4p8ib/right_sidebar_emilianified.png")');
    document.querySelectorAll("a[href='#hmf']")[0].setAttribute('style', 'background-image:url("https://s3.postimg.io/fnpl4p8ib/right_sidebar_emilianified.png")');
    document.querySelectorAll("a[href='#hmr']")[0].setAttribute('style', 'background-image:url("https://s3.postimg.io/fnpl4p8ib/right_sidebar_emilianified.png")');
    document.getElementsByClassName('footer-parent')[0].remove();
    document.getElementsByClassName('titlebox')[0].childNodes[0].style.backgroundImage = "url('https://geekorner.files.wordpress.com/2016/03/rezero-kara-hajimeru-isekai-seikatsu-re-life-in-a-different-world-from-zero-rezero-anime-3.jpg?w=280&h=397')";
    document.getElementsByClassName('titlebox')[0].childNodes[0].style.height = '397px';
})();