// ==UserScript==
// @name        Fuck EWT
// @namespace   Violentmonkey Scripts
// @match       https://teacher.ewt360.com/ewtbend/bend/index/*
// @match       http://web.ewt360.com/site-study/*
// @match       https://web.ewt360.com/site-study/*
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @icon        https://web.ewt360.com/favicon.ico
// @grant       none
// @version     1.2
// @author      MaxLen
// @license     MIT
// @description 2023/7/23 14:12:28
// @downloadURL https://update.greasyfork.org/scripts/471499/Fuck%20EWT.user.js
// @updateURL https://update.greasyfork.org/scripts/471499/Fuck%20EWT.meta.js
// ==/UserScript==

var int=window.setInterval(function(){var cX = $("div[class='earnest_check_mask_box']");cX.click();},5000);