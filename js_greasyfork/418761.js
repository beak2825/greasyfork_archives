// ==UserScript==
// @name         Listyou
// @namespace    https://te31.com/
// @version      1.1
// @description  make playlist from Youtube official artist channel
// @author       scr1ptk1d
// @match        *://www.youtube.com/user/*
// @match        *://www.youtube.com/c/*
// @match        *://youtube.com/user/*
// @match        *://youtube.com/c/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418761/Listyou.user.js
// @updateURL https://update.greasyfork.org/scripts/418761/Listyou.meta.js
// ==/UserScript==

(function() {
    'use strict'

    document.querySelector(".ytd-channel-name").addEventListener('click',function(){location.href=`/playlist?list=${'UU'+ytInitialData.metadata.channelMetadataRenderer.externalId.substr(2)}&playnext=1&index=1`})
})()