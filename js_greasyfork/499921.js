// ==UserScript==
// @name        f1-dash radio downloads
// @namespace   Violentmonkey Scripts
// @match       https://f1-dash.com/dashboard
// @match       https://f1-dash.com/window/team-radios
// @grant       GM.download
// @grant       GM.addStyle
// @grant       GM_getResourceText
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @resource    font-awesome https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css
// @version     1.1
// @license MIT
// @author      klliio
// @description Download team radios from f1-dash.com
// @downloadURL https://update.greasyfork.org/scripts/499921/f1-dash%20radio%20downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/499921/f1-dash%20radio%20downloads.meta.js
// ==/UserScript==

var fontawesome = GM_getResourceText("font-awesome");
GM.addStyle(fontawesome);

// check if there is an existing button on the parent
function CheckChildren(parent) {
  let has = false;
  parent.childNodes.forEach(function (child) {
    if (child.className == "download-button") {
      has = true;
    }
  });
  return has;
}

// add download buttons
function Download(url, filename, radio) {
  // keeps adding new buttons without this check
  if (!CheckChildren(radio.parentNode)) {
    let btn = document.createElement("button");
    btn.onclick = () => GM.download(url, filename);
    btn.className = "download-button";
    radio.parentNode.appendChild(btn);

    let icon = document.createElement("i");
    icon.className = "fa fa-download";
    icon.style.padding = "0px 10px";
    btn.appendChild(icon);
  }
}

function get() {
  document.querySelectorAll("audio").forEach(function (radio) {
    let url = radio.getAttribute("src");
    let filename = url.split("/").pop();
    Download(url, filename, radio);
  });
}

VM.observe(document.body, () => {
  console.log('test');
  get();
});
