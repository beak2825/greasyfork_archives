// ==UserScript==
// @name         Steam Community Items Forum Code Quick Generation
// @namespace    http://tampermonkey.net/
// @version      1.01
// @author       祈之羽
// @match        https://www.steamcardexchange.net/index.php?gamepage-appid-*
// @grant        GM_setClipboard
// @license      MIT
// @description Extracts image urls from Steam Card Exchange
// @downloadURL https://update.greasyfork.org/scripts/493076/Steam%20Community%20Items%20Forum%20Code%20Quick%20Generation.user.js
// @updateURL https://update.greasyfork.org/scripts/493076/Steam%20Community%20Items%20Forum%20Code%20Quick%20Generation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var showcaseElement = document.querySelector('span.tracking-wider.text-3\\.5xl.font-league-gothic.truncate');
    showcaseElement.addEventListener('click', function() {
        var divElements = document.querySelectorAll('div.flex.justify-between.w-full.text-sxs');
        var normalCards = [];
        var shinyCards = [];
        var badges = [];
        var emoticons = [];
        var profileBackgrounds = [];
        divElements.forEach((div, index) => {
            var parentDiv = div.parentNode;
            var imgElement = parentDiv.querySelector('img');
            if (imgElement !== null) {
                if (index < divElements.length / 2) {
                    normalCards.push(`[img]${imgElement.src}[/img]`);
                } else {
                    shinyCards.push(`[img]${imgElement.src}[/img]`);
                }
            }
        });
        var booster = document.querySelector('div.flex.flex-col.items-center.p-5.gap-y-4.bg-gray-light > img');
        var boosterSrc = `[img]${booster.src.replace('&l=english', '&l=chinese')}[/img]`;
        var badgeElements = document.querySelectorAll('div.flex.flex-col.items-center.p-5.gap-y-2.bg-gray-light');
        badgeElements.forEach((badgeElement) => {
            var targetElement = badgeElement.querySelector('.text-xs.text-key-gray');
            if (targetElement) {
                var imgElement = badgeElement.querySelector('img');
                if (imgElement !== null) {
                    badges.push(`[img]${imgElement.src}[/img]`);
                }
            }
        });
        var shinyBadge = badges.pop();
        var emoticonElements = document.querySelectorAll('div.text-sm.text-center.break-all');
        emoticonElements.forEach((emoticonElement) => {
            var parentElement = emoticonElement.parentNode;
            var imgElements = parentElement.querySelectorAll('img');
            if (imgElements.length > 1) {
                emoticons.push(`[img]${imgElements[1].src}[/img]`);
            }
        });
        var backgroundElements = document.querySelectorAll('div.flex.justify-end.w-full.text-sxs');
        backgroundElements.forEach((backgroundElement) => {
            var parentElement = backgroundElement.parentNode;
            var imgElement = parentElement.querySelector('img.cursor-pointer.gallery-static-trigger');
            if (imgElement !== null) {
                var src = imgElement.src.split('?')[0];
                profileBackgrounds.push(`[img]${src}[/img]`);
            }
        });
        var currentURL = window.location.href;
        var appid = currentURL.split('gamepage-appid-')[1];
        var outputString = "[sframe]" + appid + "[/sframe]\n数据来源：[url=" + currentURL + "]" +
            currentURL + "[/url]" + "\n\n[k1]普通卡牌[/k1]\n" + normalCards.join('') +
            "\n\n[k1]闪亮卡牌[/k1]\n" + shinyCards.join('') +
            "\n\n[k1]补充包[/k1]\n" + boosterSrc +
            "\n\n[k1]普通徽章[/k1]\n" + badges.join('') +
            "\n\n[k1]闪亮徽章[/k1]\n" + shinyBadge +
            "\n\n[k1]表情[/k1]\n" + emoticons.join('') +
            "\n\n[k1]个人资料背景[/k1]\n" + profileBackgrounds.join('');
        GM_setClipboard(outputString); // Copy to clipboard
        alert("Generated code has been copied to clipboard!");
    }, false);
})();
