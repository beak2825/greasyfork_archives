// ==UserScript==
// @name         copyija
// @namespace    lzwi/copyija
// @version      1.0.2
// @author       lzw-723
// @description  网页复制限制解除脚本
// @license      GPL-3
// @match        https://www.hrrsj.com/*
// @match        https://www.xuexila.com/*
// @match        https://www.baihuawen.cn/*
// @match        https://www.niubb.net/*
// @match        https://www.51test.net/*
// @match        http://www.xde6.net/*
// @match        http://www.fanwen118.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/456665/copyija.user.js
// @updateURL https://update.greasyfork.org/scripts/456665/copyija.meta.js
// ==/UserScript==

(e=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.innerText=e,document.head.appendChild(t)})(".marks{pointer-events:none!important;display:none!important;width:0px!important;height:0px!important}body>div.gf_mouse{pointer-events:none!important;display:none!important;width:0px!important;height:0px!important}");

(function() {
  "use strict";
  const style = "";
  window.clipboardData = {
    clearData: () => {
      if (new Error().stack.toString().includes("right.js")) {
        console.log("copyija: \u62E6\u622A\u526A\u5207\u677F\u6E05\u9664\u65B9\u6CD5\u6210\u529F");
        return;
      }
      window._clipboardData();
    },
    setData: (format, data) => {
      if (new Error().stack.toString().includes("right.js")) {
        console.log("copyija: \u62E6\u622A\u526A\u5207\u677F\u8BBE\u7F6E\u65B9\u6CD5\u6210\u529F\uFF0C\u683C\u5F0F\u4E3A", format, "\uFF0C\u6570\u636E\u4E3A", data);
        return;
      }
      window._clipboardData.setData(format, data);
    }
  };
  window._addEventListener = window.addEventListener;
  window.addEventListener = (type, listener, options) => {
    if (type == "copy") {
      console.log(listener);
      return;
    }
    window._addEventListener(type, listener, options);
  };
  window._addEventListener("copy", (e) => {
    if (!new Error().stack.toString().includes("right.js")) {
      const data = window.getSelection().toString();
      navigator.clipboard.writeText(data);
      console.log("copyija: \u6210\u529F\u6062\u590D\u590D\u5236\u6587\u672C", data);
    }
  });
  if (document.body.oncopy) {
    document.body.oncopy = (e) => {
      console.log("copyija: oncopy ", e);
    };
    console.log("copyija: \u6E05\u9664document.body.oncopy\u6210\u529F");
  }
  if (document.oncopy) {
    document.oncopy = (e) => {
      console.log("copyija: oncopy ", e);
    };
    console.log("copyija: \u6E05\u9664document.oncopy\u6210\u529F");
  }
  console.log("copyija: \u542F\u52A8\u6210\u529F");
})();
