// ==UserScript==
// @name             Twitter - Larger Font Tweets
// @description      Tweets now have a larger font
// @namespace        nickpapoutsis
// @author           nickpapoutsis
// @copyright        2019, nickpapoutsis (https://openuserjs.org/users/nickpapoutsis)
// @contributionURL  https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=A6EL76QADA2YY&source=url
// @license          MIT
// @include          https://twitter.com/*
// @include          https://*.twitter.com/*
// @version          0.2
// @grant            none
// @icon             data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/376026/Twitter%20-%20Larger%20Font%20Tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/376026/Twitter%20-%20Larger%20Font%20Tweets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    replace();

    new MutationObserver(replace).observe(document.getElementById("stream-items-id"), {
        childList: true,
        subtree: true
    });


    function replace(){

        var target = document.getElementsByClassName("TweetTextSize")

        for (let i = 0; i < target.length; i++){
            target[i].classList.remove("TweetTextSize--normal");
            target[i].classList.add("TweetTextSize--large");
        }}
})();
