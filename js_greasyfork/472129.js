// ==UserScript==
// @name         Simplified Wattpad
// @namespace    https://sharkcat.neocities.org
// @version      0.1
// @description  improves desktop wattpad reading experience for the ao3 nerds
// @author       sharkcat
// @match        https://www.wattpad.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/472129/Simplified%20Wattpad.user.js
// @updateURL https://update.greasyfork.org/scripts/472129/Simplified%20Wattpad.meta.js
// ==/UserScript==

// remove scrolling author|pfp
$("#sticky-nav").remove();

// remove "you are reading" top bar
$("#media-container").remove();

// shrinks gap between title and top of page
document.querySelectorAll('h1.h2')[0].style.margin = "5px 30px";

// make author not dissapear when page gets big
$("div").removeClass("hidden-lg");

// remove pfp next to author name
document.querySelectorAll('a.on-navigate.avatar.avatar-sm.center-block')[0].style.display = "none";

// adds username under title
$("div.author").insertAfter("h1.h2");

// trying to add space under author name
document.querySelectorAll('div.author')[0].style.margin = "0px 0px 20px 0px";

// remove comments from top stats
$("span.comments.on-comments").remove();

// trying to remove side comments
$("button.btn-no-background.comment-marker").remove();
//$("btn-no-background.comment-marker").remove();

// remove comments
$("div.row.part-content.part-comments").remove();

// remove you'll also like from bottom
$("div.container.similar-stories-container.similar-stories-footer").remove();

// remove add and vote buttons from bottom
$("#part-footer-actions").remove();

// remove side panel "youll also like"
$("h4.panel-title").remove();
$("#similar-stories.similar-stories").remove();

// trying to remove paid stories section at top of browse pages
$("#component-tagpagepaidstoriescontainer-tagpage-paid-stories-%2fstories%2ffantasy").remove();


// to do:
// remove side comments
// remove hoverable add comment
// remove paid content from browse pages