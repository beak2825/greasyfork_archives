// ==UserScript==
// @name         Remove Reddit various suggested posts
// @namespace    NetNeg
// @version      0.5
// @description  An attempt to get rid of the various suggested posts from Reddit main page.
// @author       NetNeg
// @match        https://www.reddit.com/
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443121/Remove%20Reddit%20various%20suggested%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/443121/Remove%20Reddit%20various%20suggested%20posts.meta.js
// ==/UserScript==
var upElems = 3;
function hidesuggestions() {
  $("p:contains('shown interest in')").parents().eq(upElems).remove();
  $("p:contains('Popular on Reddit right now')").parents().eq(upElems).remove();
  $("p:contains('Because you visited this community before')").parents().eq(upElems).remove();
  $("p:contains('Similar to r/')").parents().eq(upElems).remove();
  $("p:contains('Videos that redditors liked')").parents().eq(upElems).remove();
  $("p:contains('Some redditors find this funny')").parents().eq(upElems).remove();
  $("h3:contains('What do you want to see more of?')").parents().eq(upElems).remove();
  $("div").hasAttribute('data-survey').remove();
}
hidesuggestions();
document.addEventListener("DOMNodeInserted", hidesuggestions);