// ==UserScript==
// @name         TC-Bounty-Spotter
// @namespace    ITF Enhancements
// @version      0.3
// @description  Highlight current bounties
// @author       asdfdelta#2822
// @match        https://titanconquest.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/386517/TC-Bounty-Spotter.user.js
// @updateURL https://update.greasyfork.org/scripts/386517/TC-Bounty-Spotter.meta.js
// ==/UserScript==

function testForBounty(){if($('div[id="progressItems"]:last').children().length>1){const t=/(\d.[A-Z].*?\()/,e=$('div[id="progressItems"]:last'),o=e.children().length;for(let r=1;r<o;r++){let o=e.children().eq(r).text().match(t);if(o){matchBounty(o[0].slice(2,-2))}}}}function matchBounty(t){$("#enemyList").children().each(function(){let e=$(this).find(".item-title").text();e.trim().startsWith(t.trim())?$(this).css({"background-color":"yellow",color:"black"}):e.includes("Memory")?$(this).css({"background-color":"#1874CD"}):e.includes("Material")?$(this).css({"background-color":"#104E8B"}):e.includes("Chest")&&$(this).css({"background-color":"#6183A6"})})}var observer=new MutationObserver(function(t){t.forEach(function(t){testForBounty()})});$(document).ready(function(){observer.observe(document.querySelector("body"),{childList:!0,subtree:!0}),testForBounty()});