// ==UserScript==
// @name        Always desktop Twitter
// @description Redirect mobile Twitter to desktop
// @version     1.0
// @author      TiLied
// @namespace   https://greasyfork.org/users/102866
// @include     *://mobile.twitter.com/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29875/Always%20desktop%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/29875/Always%20desktop%20Twitter.meta.js
// ==/UserScript==

location.href = location.href.replace("mobile.twitter.com/", "twitter.com/");
