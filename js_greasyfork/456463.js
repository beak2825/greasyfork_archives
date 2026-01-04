// ==UserScript==
// @name        Timer bypass - straightforwarddriving.com
// @namespace   Violentmonkey Scripts
// @match       https://www.straightforwarddriving.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant       none
// @version     1.0
// @author      Bean
// @description Bypass that stupid timer
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456463/Timer%20bypass%20-%20straightforwarddrivingcom.user.js
// @updateURL https://update.greasyfork.org/scripts/456463/Timer%20bypass%20-%20straightforwarddrivingcom.meta.js
// ==/UserScript==

$(document).ready(function() {

   document.getElementsByClassName('learndash_mark_complete_button')[0].removeAttribute("disabled")

    });