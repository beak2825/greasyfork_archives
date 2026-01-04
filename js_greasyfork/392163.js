// ==UserScript==
// @name Facebook Ad Date Selector
// @namespace Violentmonkey Script
// @match https://business.facebook.com/*
// @grant none
// @description It changes the date on your facebook business manager to this month by default.
// @version 1
// @locale USA
// @downloadURL https://update.greasyfork.org/scripts/392163/Facebook%20Ad%20Date%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/392163/Facebook%20Ad%20Date%20Selector.meta.js
// ==/UserScript==

function changeDateFB() {
  if (
    window.location.href.indexOf("business.facebook.com/home/accounts?") == 8
  ) {
    if (
      document.getElementsByClassName("_1uz0")[0].innerHTML ==
      "<div>This month&nbsp;</div>"
    ) {
      return "Its Done";
    } else {
      document.getElementsByClassName("_1uz0")[0].click();
      setTimeout(clickThisMonth, 1100);
    }
  }
}
function clickThisMonth() {
  const mouseClickEvents = ["mousedown", "click", "mouseup"];
  var element = document.getElementsByClassName(" _rce")[7];
  function simulateMouseClick(element) {
    mouseClickEvents.forEach(mouseEventType =>
      element.dispatchEvent(
        new MouseEvent(mouseEventType, {
          view: window,
          bubbles: true,
          cancelable: true,
          buttons: 1
        })
      )
    );
  }
  simulateMouseClick(element);
}

window.onload = setTimeout(changeDateFB, 4500);
