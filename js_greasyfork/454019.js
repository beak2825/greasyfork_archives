// ==UserScript==
// @name        AQW BuyBack Every Item - aq.com
// @namespace   Violentmonkey Scripts
// @match       https://account.aq.com/AQW/BuyBack
// @grant       none
// @version     1.0
// @author      -
// @description 10/31/2022, 1:38:28 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454019/AQW%20BuyBack%20Every%20Item%20-%20aqcom.user.js
// @updateURL https://update.greasyfork.org/scripts/454019/AQW%20BuyBack%20Every%20Item%20-%20aqcom.meta.js
// ==/UserScript==

waitForElement();

function waitForElement() {
  if (
    typeof document.getElementById("listinvBuyBk").innerHTML.length !==
    "undefined"
  ) {
    if (document.getElementById("listinvBuyBk").innerHTML.length >= 2000) {
      const items = document.querySelectorAll("tr.odd, tr.even");
      let interval = setInterval((gen) => {
        const { value, done } = gen.next();

        if (done) {
          clearInterval(interval);
        } else {
          const xd = value.childNodes[0].firstChild;
          if (xd.innerHTML === "Free") {
            console.log(`Buying ` + value.childNodes[1].innerHTML);
            xd.click()
          }
        }
      }, 3000, items[Symbol.iterator]());
    } else {
      setTimeout(waitForElement, 250);
    }
  } else {
    setTimeout(waitForElement, 250);
  }
}
