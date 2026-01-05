// ==UserScript==
// @name Toggle Simplenote Sidebar
// @namespace http://calon.weblogs.us/
// @version 0.1
// @description Button in footer to hide Simplenote siadebar. 
// @match https://app.simplenote.com/*
// @include https://app.simplenote.com/*
// @match http://app.simplenote.com/*
// @include http://app.simplenote.com/*
// @supportURL calon.xu@gmail.com
// @downloadURL https://update.greasyfork.org/scripts/25963/Toggle%20Simplenote%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/25963/Toggle%20Simplenote%20Sidebar.meta.js
// ==/UserScript==

var footList = document.createElement("li");
var toggleButton = document.createElement("a");
toggleButton.innerHTML = "Hide";
footList.appendChild(toggleButton);

var footerrightElement = document.getElementsByClassName("footer-right");
footerrightElement[0].insertBefore(footList, footerrightElement[0].firstChild);

var sidebarElement = document.getElementsByClassName("sidebar");
var noteElement = document.getElementsByClassName("note");

toggleButton.onclick = function toggle() {
  if (sidebarElement[0].style.width == "0px") {
    noteElement[0].style.left = "361px";
    sidebarElement[0].style.width = "360px";
    toggleButton.innerHTML = "Hide";
  } else {
    noteElement[0].style.left = "0px";
    sidebarElement[0].style.width = "0px";
    toggleButton.innerHTML = "Show";
  }
}
