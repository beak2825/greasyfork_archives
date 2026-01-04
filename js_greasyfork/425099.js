// ==UserScript==
// @name         No-Ads for Skykiwi Forum
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove annoying ads in forum.
// @author       verybox
// @match        http://bbs.skykiwi.com/forum.php*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @require https://code.jquery.com/jquery-1.0.pack.js
// @downloadURL https://update.greasyfork.org/scripts/425099/No-Ads%20for%20Skykiwi%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/425099/No-Ads%20for%20Skykiwi%20Forum.meta.js
// ==/UserScript==

  $("div.a_cb").remove();
  $("div[data-fuse]").remove();
  $("div.portal_block_summary").remove();
  $("div.middileAdPos").remove();
  $("div.a_pb").remove();
