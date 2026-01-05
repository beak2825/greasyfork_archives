// ==UserScript==
// @name        Deleted OP Check On Forums
// @namespace   The Big Bad Boba 
// @description Checks for deleted users in the forums like releasers forum and introduction forum.
// @include     *kat.cr/community/introduction/*
// @include     *kat.cr/community/releasers/*
// @version     0.2
// @author      Boba Fett
// @contributor PXgamer
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19438/Deleted%20OP%20Check%20On%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/19438/Deleted%20OP%20Check%20On%20Forums.meta.js
// ==/UserScript==

$('#mainThreadsTable > tbody > tr > td.communityLayout > table > tbody > tr > td > div.markeredBlock.nopad > span > span > span.linethrough').each(function() {
    $($(this)).before('<span><img style="width: 17px; vertical-align: top;" src="https://yuq.me/users/38/842/r7TeUZWgLQ.gif"></span>');
});

console.log("Boba Fett is super awesome :P");