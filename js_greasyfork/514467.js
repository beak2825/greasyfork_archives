// ==UserScript==
// @name         Douyin Collector
// @namespace    http://tampermonkey.net/
// @version      20241121
// @description  collect 170 stream videos
// @author       tth37
// @match        https://www.douyin.com/?recommend=1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514467/Douyin%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/514467/Douyin%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const authorLinks = []
    const NUM_LINKS = 170

    function scrollDown() {
        document.querySelector('.xgplayer-playswitch-next').click();
    }

    function copyLinksToClipboard() {
        const text = authorLinks.join('\n')
        navigator.clipboard.writeText(text)
        alert('Copied Author Links to Clipboard')
    }

    function addAuthorLink(link) {
        link = link.split('?')[0]

        if (!link) return
        if (link.includes('self')) return
        if (authorLinks.length >= NUM_LINKS) return
        if (authorLinks.includes(link)) return
        authorLinks.push(link)

        console.log('authorLinks:', authorLinks)
        if (authorLinks.length == NUM_LINKS) {
            clearInterval(scrollDownInterval)
            clearInterval(grabUserInterval)
            copyLinksToClipboard()
        }
    }

    function findUserLinks() {
        const links = document.querySelectorAll('a[href*="douyin.com/user"]');
        return Array.from(links);
    }

    const scrollDownInterval = setInterval(() => {
        scrollDown()
    }, 0);

    const grabUserInterval = setInterval(() => {
        const links = findUserLinks()
        links.forEach(link => {
            addAuthorLink(link.href)
        })
    }, 0)

    function parseLiveStream(response) {
        return response.data.owner.sec_uid
    }

    function parsePost(response) {
        return response.aweme_list[0].author.sec_uid
    }




})();