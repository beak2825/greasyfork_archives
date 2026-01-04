// ==UserScript==
// @name         pawoo-adblock
// @namespace    https://greasyfork.org/zh-TW/scripts/439980-pawoo-adblock
// @version      0.1
// @description  Block timeline banner and bottom banner on Pawoo.net
// @author       Davy <me@davy.tw>
// @author       xatier (https://github.com/xatier)
// @match        *://pawoo.net/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://pawoo.net&size=16
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439980/pawoo-adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/439980/pawoo-adblock.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict'

    function go() {
        const timeline = document.getElementsByClassName('item-list')[0]

        // page not fully loaded yet
        if (!timeline) {
            return
        }

        const adBlock = (div) =>
        div.nodeName === 'DIV' &&
              div.innerHTML.includes('iframe') &&
              div.innerHTML.includes('ads.infocheetah.com')

        // remove TimelineBottomBanner
        // https://cs.github.com/CrossGate-Pawoo/mastodon?q=TimeLineBottomBanner
        const bottomBanner = document.getElementsByClassName('pawoo-kyoa-home')[0]
        if (bottomBanner && adBlock(bottomBanner)) {
            bottomBanner.innerHTML = ''
        }

        // remove TimeLineBanner
        // https://cs.github.com/CrossGate-Pawoo/mastodon?q=TimeLineBanner
        Array.from(timeline.childNodes)
            .filter(adBlock)
            .forEach((c) => c.parentNode.removeChild(c))
    }

    new MutationObserver(go).observe(document.body, { childList: true, subtree: true })
})()
