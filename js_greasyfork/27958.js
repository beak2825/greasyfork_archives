// ==UserScript==
// @name     GptodayFrameRemove
// @description:en     Remove frame from GPToday site
// @version  1.0.1
// @include  http://*gptoday.com/full_story/*
// @include  https://*gptoday.com/full_story/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/108205
// @description Remove frame from GPToday site
// @downloadURL https://update.greasyfork.org/scripts/27958/GptodayFrameRemove.user.js
// @updateURL https://update.greasyfork.org/scripts/27958/GptodayFrameRemove.meta.js
// ==/UserScript==

var TargetLink = $("a:contains('Close Top Bar')");

if (TargetLink.length)
    window.location.href = TargetLink[0].href;