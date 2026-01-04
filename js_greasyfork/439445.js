// ==UserScript==
// @name        Hide Entered Raffles - scrap.tf
// @description Adds a button to hide/show already joined raffles.
// @namespace   Violentmonkey Scripts
// @match       https://scrap.tf/raffles
// @include     https://scrap.tf/raffles/ending
// @include     https://scrap.tf/raffles/puzzle
// @include     https://scrap.tf/raffles/puzzle/ending
// @license     MIT
// @grant       none
// @version     1.11
// @author      U.N.Owen
// @downloadURL https://update.greasyfork.org/scripts/439445/Hide%20Entered%20Raffles%20-%20scraptf.user.js
// @updateURL https://update.greasyfork.org/scripts/439445/Hide%20Entered%20Raffles%20-%20scraptf.meta.js
// ==/UserScript==


function scrollToBottom(){
  if (document.querySelector(".raffle-pagination-done").style["display"] == "none"){
    window.scrollTo(0,document.body.scrollHeight);
    setTimeout(scrollToBottom, 50);
  } else {
    toggleVisibility();
  }
}

function toggleVisibility(){
  window.scrollTo(0,0);
  
  document.querySelectorAll(".raffle-entered").forEach((e)=>{e.hidden = !e.hidden});
  if(btn.textContent == "Hide Entered"){
    btn.textContent = "Show Entered";
  }
  else{
    btn.textContent = "Hide Entered";
  }
}

let btn = document.createElement("button"); btn.textContent="Hide Entered";
btn.classList.add("btn","btn-info","btn-embossed"); btn.onclick=scrollToBottom;

document.querySelectorAll(".new-raffle")[0].append(btn);