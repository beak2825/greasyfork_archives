// ==UserScript==
// @name         Apple Daily News
// @namespace    http://hk.appledaily.com/
// @version      0.3
// @description  View without logging in
// @author       Lacek
// @match        https://hk.appledaily.com/*
// @match        https://hk.news.appledaily.com/*
// @match        https://hk.video.appledaily.com/*
// @match        https://hk.finance.appledaily.com/*
// @match        https://hk.entertainment.appledaily.com/*
// @match        https://hk.sports.appledaily.com/*
// @match        https://hk.lifestyle.appledaily.com/*
// @match        https://nextplus.nextmedia.com/article/*
// @grant        document-body
// @downloadURL https://update.greasyfork.org/scripts/382877/Apple%20Daily%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/382877/Apple%20Daily%20News.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function append(s) {
        document.head.appendChild(document.createElement('script'))
            .innerHTML = s.toString().replace(/^function.*{|}$/g, '');
    }

    append(function (){
        window.confirmSubscriptionOn = function(){
            return false;
        };
	});
})();