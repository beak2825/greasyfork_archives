// ==UserScript==
// @name        Animesong
// @namespace   https://twitter.com/akameco
// @description いわゆるコピペを可能とするアレ
// @include     http://www.jtw.zaq.ne.jp/animesong/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4044/Animesong.user.js
// @updateURL https://update.greasyfork.org/scripts/4044/Animesong.meta.js
// ==/UserScript==

// enable focus text
function enableCopyText() {
  // set attributes for body 
  document.body.setAttribute("oncontextmenu","return true");
  document.body.setAttribute("onselectstart","return true");
}

// select all textarea
function selectText(c) {
  let element= document.querySelector(c);
  // create range
  let rng = document.createRange();
  rng.selectNodeContents(element);
  // add range for the selected regions
  window.getSelection().addRange(rng);
}

// create new button
function createCopyButton() {
  let button = document.createElement("button");
  // set text 
  button.innerHTML = "選択";
  button.style.margin = "0px 0px 10px 0px";
  button.style.borderTop = "1px solid #ccc";
  button.style.borderRight = "1px solid #999";
  button.style.borderBottom = "1px solid #999"; 
  button.style.borderLeft = "1px solid #ccc";
  button.style.padding = "3px 12px";
  button.style.cursor = "pointer";
  button.style.color = "#666";

  button.addEventListener("click",function(){selectText(".b")},false);
  let frame = document.querySelector("tbody");
  frame.appendChild(button);
  // swap elements
  button.parentNode.insertBefore(button,button.parentNode.firstChild);

}

window.onload = function () {
  setTimeout(function() {
    enableCopyText(); 
    createCopyButton();
  }, 10);
} 
