// ==UserScript==
// @name         Avgle
// @namespace    undefined
// @version      0.0.3
// @description  AD killer
// @author       Xiang Yang
// @match        https://avgle.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34434/Avgle.user.js
// @updateURL https://update.greasyfork.org/scripts/34434/Avgle.meta.js
// ==/UserScript==

$('#player_3x2_container').remove();
$('#aoverlay').remove();
$('.vjs-text-track-display').remove();
$('.vjs-loading-spinner').remove();
removedMessage=true;
isEmbed=true;
