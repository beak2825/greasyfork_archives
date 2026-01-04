// ==UserScript==
// @name         lofterDown
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  lofter頁面內容下載
// @author       You
// @match        *.lofter.com/*
// @require      https://cdn.jsdelivr.net/npm/file-saver@1.3.8/FileSaver.min.js
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/422578/lofterDown.user.js
// @updateURL https://update.greasyfork.org/scripts/422578/lofterDown.meta.js
// ==/UserScript==

(function () {
  "use strict";

  //http://miyamayukimi06288.lofter.com&t=1583587016128

  async function gethtml(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: url,
        method: "GET",
        onload: function (response) {
          resolve(response.responseText);
        },
      });
    });
  }

  async function downone(url) {
    try {
      const txt = await gethtml(url);
      let doc = $("<html></html>");
      doc.html(txt);
      const tlist = doc.find(".postinner .ct");
      if (tlist.length == 0) return;

      const title = doc.find(".postinner .ct .ttl");

      var blob = new Blob([tlist.text()], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, `${title.text()}.txt`);
      console.log(`${url} ok`);
      return true;
    } catch (e) {
      console.log(`${url} error`);
      setTimeout(() => {
        alert(`${url} error`);
      }, 100);
      return false;
    }
  }

  function downpageall() {
    const num = $(".num").text();
    const maxnum = parseInt(num.split("/")[1].trim());
    // console.log(maxnum);

    for (let pagenum = 1; pagenum < maxnum; pagenum++) {
      const pageurl = `${document.baseURI}/?page=${pagenum}`;
      if (!downpageone(pageurl)) return;
    }
  }

  async function downpageone(pageurl) {
    const txt = await gethtml(pageurl);
    const doc = $("<html></html>");
    doc.html(txt);
    const tlist = doc.find(".m-postlst .postinner .ttl a");
    if (tlist.length == 0) return;
    for (let i = 0; i < tlist.length; i++) {
      //console.log(tlist[i].href);
      const re = await downone(tlist[i].href);
      if (!re) return;
    }
  }

  function addbuttonallpage() {
    const t = document.querySelector(".m-nav");
    // console.log(t);
    if (t) {
      let e = document.createElement("button");
      e.id = "TALLDownBtnpage";
      e.textContent = "下载所有頁";
      e.className = "btn btn-md btn-default";
      e.onclick = downpageall;
      t.parentNode.insertBefore(e, t);
    }
  }

  function addbuttonnoepage() {
    const t = document.querySelector(".m-nav");
    // console.log(t);
    if (t) {
      let e = document.createElement("button");
      e.id = "TONEDownBtnpage";
      e.textContent = "下载本頁";
      e.className = "btn btn-md btn-default";
      e.onclick = function () {
        downpageone(location.href);
      };
      t.parentNode.insertBefore(e, t);
    }
  }

  function addbuttonnoe() {
    const t = document.querySelector(".m-nav");
    // console.log(t);
    if (t) {
      let e = document.createElement("button");
      e.id = "TONEDownBtn";
      e.textContent = "下载本頁";
      e.className = "btn btn-md btn-default";
      e.onclick = function () {
        downone(location.href);
      };
      t.parentNode.insertBefore(e, t);
    }
  }

  async function run() {
    if (/lofter\.com\/post/.test(location.href)) {
      addbuttonnoe();
    } else {
      addbuttonnoepage();
      addbuttonallpage();
    }
  }
  run();
  // Your code here...
})();
