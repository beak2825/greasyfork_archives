// ==UserScript==
// @name     Copy Torrent Descriptions
// @version  5
// @description  Userscript to copy torrent descriptions as BBcode to your clipboard
// @author       astonmartin34
// @match https://passthepopcorn.me/torrents.php*id=*
// @namespace https://passthepopcorn.me/user.php?id=111982#copydescriptions
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/427293/Copy%20Torrent%20Descriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/427293/Copy%20Torrent%20Descriptions.meta.js
// ==/UserScript==

'use strict';

// show a pop-up box to indicate to the user that the data was copied
function showinfo(info, node) {
  const showinfo_class = "comparison_copyinfobox";
  let el = node.parentElement.getElementsByClassName(showinfo_class)[0];
  if (!el) {
    el = document.createElement("div");
    el.classList.add(showinfo_class);
    el.style = "position: absolute; right: 10px; top: -40px; background-color: white; border: solid red 1px; border-radius: 5px; padding: 5px; color: black;"
    node.parentElement.insertAdjacentElement("beforeend", el);
  }
  el.textContent = info;
  el.animate({ opacity: [1,1,1,0], visibility: ["visible", "hidden"] }, { duration: 2000, easing: "ease-in", fill: "forwards" });
}

// simple clipboard handler
async function copytext(text, node) {
  try {
    await navigator.clipboard.writeText(text);
    showinfo("Torrent description copied!", node);
  }
  catch (err) {
    showinfo("Failed to copy description.\nCheck console for errors.", node);
    console.log(err);
  }
}

// handler for the CP button; requests the description with a callback
async function copydescription(event) {
  event.preventDefault();
  
  // callback for the xhr request for description
  function parse() {
    copytext(this.response, event.target);
  }
  
  const descUrl = event.target.getAttribute("desc_url");
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", parse); // hand off to parse() when request completes
  xhr.open("GET", descUrl); 
  xhr.responseType = "text";
  xhr.send();
}

// adds a copy button to the action panel for a torrent; node = flex container
function addcopybutton(node, descUrl) {
  const el = document.createElement("a");
  el.setAttribute("href", "#");
  el.setAttribute("title", "Copy description BBcode to clipboard]");
  el.setAttribute("desc_url", descUrl);
  el.innerHTML = "[Copy to clipboard]";
  el.style = "margin-left: auto;";
  node.insertAdjacentElement("beforeend", el);
  el.addEventListener("click", copydescription, true);
}

// adds a open button to the action panel for a torrent; node = flex container
function addopenbutton(node, descUrl) {
  const el = document.createElement("a");
  el.setAttribute("href", descUrl);
  el.setAttribute("title", "Open description BBcode in new tab");
  el.setAttribute("target", "_blank");
  el.innerHTML = "[Open in new tab]";
  node.insertAdjacentText("beforeend", "\xa0");
  node.insertAdjacentElement("beforeend", el);
}

// get a link to the description for each torrent, request buttons for the action panel
for (const torrent of document.getElementsByClassName("torrent_info_row")) {
  const torrent_id = torrent.id.split('_')[1];
  const table_guard = torrent.querySelector(".movie-page__torrent__panel > .bbcode-table-guard");
  
  // create a flex container for links
  const bbcode_action_container = document.createElement("div");
  bbcode_action_container.style = "display: flex; margin-bottom: 10px; position: relative;";
  bbcode_action_container.innerHTML = "Description:";
  table_guard.insertAdjacentElement("afterbegin", bbcode_action_container);
  
  // build URL and request buttons to be added  
  const url = "https://passthepopcorn.me/torrents.php?action=get_description&id=" + torrent_id;
  addcopybutton(bbcode_action_container, url);
  addopenbutton(bbcode_action_container, url)
}