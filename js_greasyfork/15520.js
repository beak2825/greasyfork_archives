// ==UserScript==
// @name        Hide Karma
// @namespace   https://www.reddit.com
// @description Hides karma scores on Reddit links and comments
// @include     https://www.reddit.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15520/Hide%20Karma.user.js
// @updateURL https://update.greasyfork.org/scripts/15520/Hide%20Karma.meta.js
// ==/UserScript==

$(".score").css("display", "none");
$("span:contains('[score hidden]')").css("display", "none");