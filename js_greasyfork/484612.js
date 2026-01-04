// ==UserScript==
// @name         Bux auto claim
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Renda Extra
// @author       You
// @match        https://seoclub.su/*
// @match        http://videoblog.su/*
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://bulkviews.ru/*
// @match        https://losena.net/*
// @match        https://socexpertt.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seoclub.su
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484612/Bux%20auto%20claim.user.js
// @updateURL https://update.greasyfork.org/scripts/484612/Bux%20auto%20claim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes("https://m.youtube.com/") ){
      window.close();}

    if (window.location.href.includes("https://bulkviews.ru/") ){
      setTimeout (function() { history.go(0);}, 25000);}

    if (window.location.href.includes("https://losena.net/") ){
      setTimeout (function() {history.go(0);}, 25000);}


if (window.location.href.includes("https://seoclub.su/") ){
      setTimeout (function() { history.go(0);}, 25000);}



setTimeout(function() {
        // Localize e clique no elemento usando o seletor CSS fornecido
        document.querySelector('div:nth-of-type(11) span').click();
    }, 2000);

    setTimeout(function() {
        // Localize e clique no elemento usando o seletor CSS fornecido
        document.querySelector('.go-link-youtube').click();
    }, 4000);

setTimeout(function() {
   if (!(/[?&]autoplay=1/).test(location.search)) {
  document.querySelector(".ytp-large-play-button").click();
}
}, 500);

    if( $(".timer") ) {

            var check = setInterval( function() {

                if( $(".timer").text() == "0" ) {
                    clearInterval( check )
                    setTimeout(function() {document.querySelector('.butt-nw').click();}, 800);


                }1 * 1000;
            }, 1000);


        }




})();