// ==UserScript==
// @name        Unblock Reddit Image - reddit.com
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/media*
// @grant       none
// @version     1.1
// @author      -
// @noframes
// @license     WTFPL
// @description 12/17/2023, 2:10:12 PM
// @downloadURL https://update.greasyfork.org/scripts/482466/Unblock%20Reddit%20Image%20-%20redditcom.user.js
// @updateURL https://update.greasyfork.org/scripts/482466/Unblock%20Reddit%20Image%20-%20redditcom.meta.js
// ==/UserScript==

if (document.title === "Blocked") {
  const imageUrl = new URL(window.location.href).searchParams.get('url');
  document.body.innerHTML = "";
  const node = document.createElement("img",);
  node.src = imageUrl;
  document.head.getElementsByTagName('style')[0].remove();
  document.body.appendChild(node);
  document.title = "Unblocked";
}
