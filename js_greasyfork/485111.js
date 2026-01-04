// ==UserScript==
// @name         WikiwandToWiki
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Wikiwand有时内容不全,在Wikiwand页面右小有一Wiki图标，点击即可跳回Wiki
// @author       leone
// @match        https://www.wikiwand.com/*
// @icon         https://wikiwandv2-19431.kxcdn.com/icons/icon-180x180.png
// @license      GPL-3.0 License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485111/WikiwandToWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/485111/WikiwandToWiki.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var iconDiv = document.createElement('div');
    iconDiv.id = "corner-icon";
    iconDiv.style.position = 'fixed';
    iconDiv.style.bottom = '20px';
    iconDiv.style.right = '20px';
    iconDiv.style.cursor = 'pointer';
    iconDiv.style.backgroundImage = 'url(https://zh.wikipedia.org/static/favicon/wikipedia.ico)';
    iconDiv.style.backgroundSize = 'contain';
    iconDiv.style.width = '40px';
    iconDiv.style.height = '40px';
    iconDiv.style.borderRadius = '50%';


    var currentUrl = window.location.href;
    var matchResult = currentUrl.match(/^https:\/\/www\.wikiwand\.com\/(.*?)\/(.*)/);
    console.log(matchResult);
    console.log(matchResult[1]);
    console.log(matchResult[2]);
    var newUrl = 'https://' + matchResult[1] + '.wikipedia.org/wiki/' + matchResult[2] + '?oldformat=true';

    iconDiv.addEventListener('click', function() {
        window.open(newUrl, '_blank');
    });

    document.body.appendChild(iconDiv);
})();