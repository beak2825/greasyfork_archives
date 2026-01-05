// ==UserScript==
// @name        Deleted User Check
// @namespace   PXgamer
// @description Checks for deleted users in the introduction page.
// @include     *kat.cr/community/introduction/*
// @version     0.2
// @author      Boba Fett & PXgamer
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19437/Deleted%20User%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/19437/Deleted%20User%20Check.meta.js
// ==/UserScript==

$('#mainThreadsTable > tbody > tr > td.communityLayout > table > tbody > tr > td > div.markeredBlock.nopad > span > span > span.linethrough').each(function() {
    $($(this)).before('<span><img style="width: 12px; vertical-align: top;" src="https://pximg.xyz/images/862933be4fde36a667d7958d305546ad.png"></span>');
});

console.log("Shit's over...");