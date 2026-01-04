// ==UserScript==
// @name        Google Play app details images scroll arrow keys
// @namespace   Violentmonkey Scripts
// @match       https://play.google.com/store/apps/details*
// @grant       none
// @version     1.3
// @author      You
// @description assign horizontal arrow keys to scroll app image previews in page and overlay
// @downloadURL https://update.greasyfork.org/scripts/404627/Google%20Play%20app%20details%20images%20scroll%20arrow%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/404627/Google%20Play%20app%20details%20images%20scroll%20arrow%20keys.meta.js
// ==/UserScript==


window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "Left": // IE/Edge specific value
    case "ArrowLeft":
		  var left = document.querySelector('[jsaction="click:E7ORLb"]');
		  if (left != null) {
			left.click()
			break;
		  }
		  var scrollleft = document.querySelector('[jsname="PjUZJf"]')
		  triggerMouseEvent(scrollleft, "mousedown"); triggerMouseEvent(scrollleft, "mouseup");
      break;
    case "Right": // IE/Edge specific value
    case "ArrowRight":
   		  var right = document.querySelector('[jsaction="click:tJiF1e"]');
   		  if (right != null) {
			right.click()
			break;
		  }

		  var scrollright = document.querySelector('[jsname="kZCROc"]')
		  triggerMouseEvent(scrollright, "mousedown"); triggerMouseEvent(scrollright, "mouseup"); 
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}