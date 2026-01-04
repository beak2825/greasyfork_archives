// ==UserScript==
// @name        SCPredirect
// @namespace   wyrrrd.de
// @version     1.0.0
// @author      Wyrrrd
// @license     Unlicense
// @description Redirects old SCP-Wiki URL to new URL
// @icon        https://scp-wiki.wikidot.com/local--iosicon/iosicon.png
// @downloadurl https://gist.github.com/Wyrrrd/437b0280117a4b89119db769114ad3b6/raw/SCPredirect.user.js
// @include     https://scp-wiki.wikidot.com/*
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/444748/SCPredirect.user.js
// @updateURL https://update.greasyfork.org/scripts/444748/SCPredirect.meta.js
// ==/UserScript==

page_links = document.getElementsByTagName('a');
for(var i = 0; i < page_links.length; i++){
  curr_link = page_links[i];
  
  if (curr_link.href.indexOf('www.scp-wiki.net/') !== - 1) {
    curr_link.href = curr_link.href.replace(/www.scp-wiki.net/, 'scp-wiki.wikidot.com');
  }
}