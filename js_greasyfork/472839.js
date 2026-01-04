// ==UserScript==
// @name        Listography Easy Copy Permalink
// @description Adds a button to copy list permalinks to clipboard
// @version     1.0.0
// @author      petracoding
// @namespace   petracoding
// @grant       none
// @include     https://listography.com/*
// @include     http://listography.com/*
// @downloadURL https://update.greasyfork.org/scripts/472839/Listography%20Easy%20Copy%20Permalink.user.js
// @updateURL https://update.greasyfork.org/scripts/472839/Listography%20Easy%20Copy%20Permalink.meta.js
// ==/UserScript==

// Early Return
if (!document.querySelector(".about")) return;

// Get User Id from avatar image
const userId = document.querySelector(".about img").getAttribute("src").replace("/action/user-image?uid=", "");

// Get all listboxes and add buttons
const listboxes = document.querySelectorAll(".listbox");
[...listboxes].forEach(listbox => {
  const listId = listbox.getAttribute("id").replace("listbox-", "");
  const permalink = "https://listography.com/action/list?uid=" + userId + "&lid=" + listId;
  
  const datesEl = listbox.querySelector(".dates");
  const copyBtn = document.createElement("button");
  
  copyBtn.innerHTML = "copy link";
  copyBtn.setAttribute("class", "copy-permalink-btn");
  copyBtn.setAttribute("title", permalink);
  copyBtn.setAttribute("style", `
		background: none;
    border: none;
    font-size: 1em;
    color: inherit;
    font-weight: bold;
    display: block;
    padding: 0;
    cursor: pointer;
	`);
  datesEl.appendChild(copyBtn);
});

// Add event listeners to the new buttons
const btns = document.querySelectorAll(".copy-permalink-btn");
[...btns].forEach(btn => {
  btn.addEventListener("click", () => {
    navigator.clipboard.writeText(btn.getAttribute("title"));
    btn.innerHTML = "copied!";
    
    setTimeout(function(){
    	btn.innerHTML = "copy link";
    }, 1000);
  });
});
