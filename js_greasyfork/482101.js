// ==UserScript==
// @name         YouTube show channel name in title
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Insert YouTube channel name in title
// @icon         https://www.youtube.com/favicon.ico
// @author       Fifv
// @match        https://www.youtube.com/*
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482101/YouTube%20show%20channel%20name%20in%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/482101/YouTube%20show%20channel%20name%20in%20title.meta.js
// ==/UserScript==

(function () {
    'use strict'

    setInterval(function () {
        if (location.pathname === '/watch') {
            const channelName = document.querySelector('#channel-name #text').textContent
            const stringInsertToTitle = ' - ' + channelName
            if (channelName && !document.title.includes(stringInsertToTitle)) {
                document.title = document.title.replace(' - YouTube', stringInsertToTitle + ' - YouTube')
                console.log('[Youtube show channel name in title] insert channel name to title:', stringInsertToTitle)
            }
        }
    }, 5000)



})()