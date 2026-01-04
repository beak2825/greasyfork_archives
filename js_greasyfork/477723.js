// ==UserScript==
// @name             AIO Side Bar to Floating Windows - grundos.cafe
// @namespace        Firestix
// @match            https://www.grundos.cafe/*
// @grant            GM_log
// @grant            GM_addStyle
// @grant            GM_getValue
// @grant            GM_setValue
// @grant            GM_registerMenuCommand
// @require https://greasyfork.org/scripts/477480-floatingwindow/code/FloatingWindow.js?version=1270124
// @version          0.0.3
// @author           Firestix
// @license          MIT
// @description Moves the AIO Side Bars to separate floating windows.
// @downloadURL https://update.greasyfork.org/scripts/477723/AIO%20Side%20Bar%20to%20Floating%20Windows%20-%20grundoscafe.user.js
// @updateURL https://update.greasyfork.org/scripts/477723/AIO%20Side%20Bar%20to%20Floating%20Windows%20-%20grundoscafe.meta.js
// ==/UserScript==

GM_addStyle(`
.floatingWindowTitleBar {
  background-color:var(--grid_head);
  padding:2px;
  line-height:20px;
}
.floatingWindowItemList {
  display:flex;
  flex-wrap: wrap;
}
`);

if (document.getElementById("aio_sidebar")) {
  let categories = document.querySelectorAll("#aio_sidebar > div");
  for (let x = 0, xlen = categories.length; x < xlen; x++) {
    let category = categories[x];
    if (!category.className || category.className === "") continue;
    let title = category.querySelector(".aio-section-header").innerText;
    let subTextElems = category.querySelectorAll(".aioImg > .aio-subtext, .aio-training-links");
    let bodyElems = category.querySelectorAll(".aioImg > div");
    let fWin = new FloatingWindow(title,{open:false,position:{x:window.innerWidth-200,y:x*24}});
    for (let s of subTextElems) {
      fWin.body.appendChild(s.cloneNode(true));
    }
    let flexBody = document.createElement("div");
    flexBody.className = "floatingWindowItemList";
    for (let b of bodyElems) {
      flexBody.appendChild(b.parentElement.removeChild(b));
    }
    fWin.body.appendChild(flexBody);
  }
}