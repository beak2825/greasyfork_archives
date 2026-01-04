// ==UserScript==
// @name         twitter.comの名前とscreen_nameを入れ替える
// @namespace    https://surume.tk/
// @version      0.1
// @author       petitsurume
// @description 名前通り
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32462/twittercom%E3%81%AE%E5%90%8D%E5%89%8D%E3%81%A8screen_name%E3%82%92%E5%85%A5%E3%82%8C%E6%9B%BF%E3%81%88%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/32462/twittercom%E3%81%AE%E5%90%8D%E5%89%8D%E3%81%A8screen_name%E3%82%92%E5%85%A5%E3%82%8C%E6%9B%BF%E3%81%88%E3%82%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // TODO: setIntervalを使うのをやめてMutationObserverとかその辺を使う
    setInterval(function(){
        document.body.querySelectorAll(".js-retweet-text > .js-user-profile-link:not(.userjs-retweet-screen-named").forEach(function(link){
            link.className+=" userjs-retweet-screen-named"
            link.getElementsByTagName("b")[0].innerText = link.pathname.replace("/","@")
        })
        document.body.querySelectorAll(".pretty-link.js-user-profile-link.js-nav:not(.userjs-retweet-screen-named").forEach(function(link){
            link.className+=" userjs-retweet-screen-named"
            link.getElementsByTagName("strong")[0].innerText = link.pathname.replace("/","@")
        })
        document.body.querySelectorAll(".account-group.js-account-group.js-action-profile.js-user-profile-link.js-nav:not(.userjs-retweet-screen-named)").forEach(function(link){
            link.className+=" userjs-retweet-screen-named"
            var screenName = link.getElementsByClassName("username")[0].innerText
            var name = link.getElementsByClassName("fullname")[0].innerText
            link.getElementsByClassName("fullname")[0].innerText = screenName
            link.getElementsByClassName("username")[0].innerText = name
        })
        document.body.querySelectorAll(".DMInboxItem-title.account-group:not(.userjs-retweet-screen-named)").forEach(function(link){
            link.className+=" userjs-retweet-screen-named"
            var screenName = link.getElementsByClassName("username")[0].innerText
            var name = link.getElementsByClassName("fullname")[0].innerText
            link.getElementsByClassName("fullname")[0].innerText = screenName
            link.getElementsByClassName("username")[0].innerText = name
        })
        document.body.querySelectorAll(".ProfileCard-userFields:not(.userjs-retweet-screen-named)").forEach(function(link){
            link.className+=" userjs-retweet-screen-named"
            var screenName = link.getElementsByClassName("username")[0].innerText
            var name = link.getElementsByClassName("fullname")[0].innerText
            link.getElementsByClassName("fullname")[0].innerText = screenName
            link.getElementsByClassName("username")[0].innerText = name
        })
        document.body.querySelectorAll(".QuoteTweet-originalAuthor:not(.userjs-retweet-screen-named)").forEach(function(link){
            link.className+=" userjs-retweet-screen-named"
            var screenName = link.getElementsByClassName("username")[0].innerText
            var name = link.getElementsByClassName("QuoteTweet-fullname")[0].innerText
            link.getElementsByClassName("QuoteTweet-fullname")[0].innerText = screenName
            link.getElementsByClassName("username")[0].innerText = name
        })
        
    },1000);
})();