// ==UserScript==
// @name         Youtube image Link
// @namespace    http://radialbit.com
// @version      0.2
// @description  Fetches the image link from the page metadata and adds it to the page so it can be easily dragged/copied.
// @author       Zoltee
// @match        http*://www.youtube.com/*
// @update       https://greasyfork.org/scripts/14021-youtube-image-link/code/Youtube%20image%20Link.user.js
// @require       http://code.jquery.com/jquery-2.1.4.min.js
// @copyright  Radialbit
// @downloadURL https://update.greasyfork.org/scripts/14021/Youtube%20image%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/14021/Youtube%20image%20Link.meta.js
// ==/UserScript==

$(  '<img src="'+$("meta[property='og:image']").attr("content")+'" style="max-height:25px; margin-left: 8px; vertical-align: middle;">').insertAfter( "#watch7-subscription-container" );   