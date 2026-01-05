// ==UserScript==
// @name         twitter.comのRTした人表記をscreen_nameにするやつ
// @namespace    https://surume.tk/
// @version      0.1
// @description  twitter.comのRTした人表記をscreen_nameにするやつです
// @author       petitsurume
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30021/twittercom%E3%81%AERT%E3%81%97%E3%81%9F%E4%BA%BA%E8%A1%A8%E8%A8%98%E3%82%92screen_name%E3%81%AB%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/30021/twittercom%E3%81%AERT%E3%81%97%E3%81%9F%E4%BA%BA%E8%A1%A8%E8%A8%98%E3%82%92screen_name%E3%81%AB%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // TODO: setIntervalを使うのをやめてMutationObserverとかその辺を使う
    setInterval(function(){
        document.body.querySelectorAll(".js-retweet-text > .js-user-profile-link:not(.userjs-retweet-screen-named").forEach(function(link){
            link.getElementsByTagName("b")[0].innerText = link.pathname.replace("/","@")
            link.className+=" userjs-retweet-screen-named"
        })
    },1000);
})();