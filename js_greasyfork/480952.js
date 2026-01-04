// ==UserScript==
// @name         NovelAI 连点器
// @name:en      NovelAI Auto Clicker
// @namespace    https://novelai.net
// @version      1.2.1.3
// @description:zh-cn 解放你的手
// @description:en to free your hands
// @author       LigHT
// @license      MIT
// @match        https://novelai.net/image
// @grant        none
// @icon         https://novelai.net/icons/novelai-round.png
// @description 解放你的手
// @downloadURL https://update.greasyfork.org/scripts/480952/NovelAI%20%E8%BF%9E%E7%82%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/480952/NovelAI%20%E8%BF%9E%E7%82%B9%E5%99%A8.meta.js
// ==/UserScript==

var button = document.createElement("button");
button.innerHTML = "run";
button.style.position = "fixed";
button.style.bottom = "0.5%";
button.style.right = "0.5%";
button.style.zIndex = "9999";
button.style.backgroundColor = '#13152c';
button.style.color = '#f5f3c2';
button.style.borderRadius = '3px';
button.style.border = '0.01px solid';
button.style.borderColor = 'rgba(40, 43, 73, 1)';
button.style.fontFamily = 'Source Sans Pro';
button.style.fontSize = '15px';
button.style.cursor = "pointer";
document.body.appendChild(button);

// Make the button draggable
//button.onmousedown = function(event) {
  // Get the mouse cursor position at startup
//  var pos1 = event.clientX;
//  var pos2 = event.clientY;
  // Call a function whenever the cursor moves
//  document.onmousemove = function(event) {
    // Calculate the new cursor position
//    var pos3 = event.clientX;
//    var pos4 = event.clientY;
    // Set the button's new position
//    button.style.left = (button.offsetLeft - pos1 + pos3) + "px";
//    button.style.top = (button.offsetTop - pos2 + pos4) + "px";
    // Update the old cursor position
//    pos1 = pos3;
//    pos2 = pos4;
//  };
  // Stop moving when mouse button is released
//  document.onmouseup = function() {
//    document.onmousemove = null;
//    document.onmouseup = null;
//  };
//};

var interval;

function clickElement() {
  var target = document.evaluate("//*[@id='__next']/div[2]/div[4]/div[2]/div[1]/div[1]/div[5]/button", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  var event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window
  });
  target.dispatchEvent(event);
}

button.onclick = function() {
  if (interval) {
    clearInterval(interval);
    interval = null;
    button.innerHTML = "run";
  } else {
    // Set the interval to call the click function every second
    interval = setInterval(clickElement, 1000);
    button.innerHTML = "pause";
  }
};
