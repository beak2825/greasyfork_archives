// ==UserScript==
// @name        Remove confirm in shop - antineverfate.tk
// @namespace   Violentmonkey Scripts
// @match       http://antineverfate.tk/shop.php?go=sale
// @grant       none
// @version     1.0
// @author      -
// @description 11/7/2020, 8:42:37 PM
// @downloadURL https://update.greasyfork.org/scripts/415768/Remove%20confirm%20in%20shop%20-%20antineverfatetk.user.js
// @updateURL https://update.greasyfork.org/scripts/415768/Remove%20confirm%20in%20shop%20-%20antineverfatetk.meta.js
// ==/UserScript==

let scope;
if (typeof unsafeWindow === "undefined") {
    scope = window;
} else {
    scope = unsafeWindow;
}

// override confirm
scope.confirm = function (str) {
  console.log ("confirm: ", str);
  return true;
};

function emulateClick(element) {
  let event = document.createEvent('Events');
  event.initEvent('click', true, false);
  element.dispatchEvent(event);
  element.style.boxShadow = "0 0 0 2px red";
}

let title = document.querySelector('body > h4');
if (title) {
  title = title.textContent.toLowerCase();
  if (title === 'травяная лавка') {
    let btns = Array.from(document.querySelectorAll('.btn[onclick*="salethisall=1"]'));
    let count = btns.length;
    let sell = (Math.random()*count*0.02) + (count*0.005);
    console.log(count, sell);
    if (sell > 1) {
      setTimeout(() => emulateClick(btns[count - 1]), 500);
    } else if (count > 1) {
      let sleep = ((Math.floor(Math.random() * 70)) + 1);
      setTimeout(() => window.location.reload(), sleep*1000);
      console.log('sleep', sleep);
    }
  }
}
