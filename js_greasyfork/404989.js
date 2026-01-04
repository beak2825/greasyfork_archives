//Thechild
// ==UserScript==
// @namespace ThecHilD
// @name NetLinkDirect
// @description TheFluidWorld
// @version 0.0.1
// @include https://pan.baidu.com/disk/*
// @connect baidu.com
// @grant GM_openInTab
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/404989/NetLinkDirect.user.js
// @updateURL https://update.greasyfork.org/scripts/404989/NetLinkDirect.meta.js
// ==/UserScript==
!function() {
  let x = Date.now(), y = localStorage.getItem("idmIntro");
  if (null == y || x > y) {
    localStorage.setItem("idmIntro", x + 3e7);
    GM_openInTab("https://space.bilibili.com/454155213/article");
  }
  let task = setInterval(() => {
    let dom, t = document.querySelector("a.g-button[data-button-id][title=\u4e0b\u8f7d]");
    if (t) {
      clearInterval(task);
      dom = t.cloneNode(true);
      t.after(dom);
      dom.removeAttribute("style");
      t.remove();
      dom.addEventListener("click", () => {
        let dom = window.event.currentTarget, arr = require("system-core:context/context.js").instanceForSystem.list.getSelected();
        dom.setAttribute("style", "background-color: #09e; color: #fff");
        1 == arr.length && 0 == arr[0].isdir ? GM_xmlhttpRequest({
          "url": "http://pcs.baidu.com/rest/2.0/pcs/file?app_id=778750&ver=4.0&method=locatedownload&path=" + encodeURIComponent(arr[0].path),
          "method": "GET",
          "responseType": "json",
          "headers": {
            "User-Agent": "netdisk;P2SP;2.2.60.26"
          },
          "onload": r => {
            dom.removeAttribute("style");
            r.response.hasOwnProperty("client_ip") && GM_setClipboard(r.response.urls[0].url + "&filename=" + encodeURIComponent(arr[0].server_filename), "text");
          }
        }) : alert("\u53ea\u80fd\u52fe\u9009\u4e00\u4e2a\u6587\u4ef6\u8fdb\u884c\u4e0b\u8f7d");
      });
    }
  }, 1e3);
}();
