// ==UserScript==
// @name         vgtime图片下载
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  vgtime图片下载按鈕
// @author       backrock12
// @match        https://www.vgtime.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vgtime.com
// @grant       GM_download
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452201/vgtime%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/452201/vgtime%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function init_button() {
    const h1 = document.querySelector("div.game_box:nth-child(1)");
    // console.log(h1);

    const ce = document.createElement("button");
    ce.id = "CDownBtn";
    ce.textContent = "全部下载";
    ce.className = "btn btn-md btn- open_myremark_box";
    ce.style = "padding: 5px;font-size: 16px;";
    ce.onclick = function () {
      down_all();
    };
    h1.append(ce);
  }

  function down_all() {
    let tlist = document.querySelectorAll(".game_focus_list li img");
    // console.log(tlist);
    if (!tlist || tlist.length == 0) {
      alert("无资料");
    }
    const titleu =
      "div.game_box:nth-child(1) > h2:nth-child(2) > a:nth-child(1)";
    let title = "";
    const titleobj = document.querySelector(titleu);
    if (titleobj) title = titleobj.innerText.replace("的全部图片", "");
    let url_list = [];
    let oknum = 0;
    let errornum = 0;

    const h1obj = document.querySelector(".game_info_box > img:nth-child(1)");
    if (h1obj) {
      const h1url = h1obj.src.substring(0, h1obj.src.lastIndexOf(".jpg") + 4);

      url_list.push(h1url);
    }

    for (let i = 0; i < tlist.length; i++) {
        if (tlist[i].src.length > 5){
      const url = tlist[i].src.substring(
        0,
        tlist[i].src.lastIndexOf(".jpg") + 4
      );
      url_list.push(url);
        }
    }

    console.log(url_list);

    for (let i = 0; i < url_list.length; i++) {
      const url = url_list[i];
      const name =
        title +
        "_pic_auto_down_" +
        i.toString().padStart(4, 0) +
        "_" +
        url.substring(url.lastIndexOf("/") + 1); //.replace(".", "_");
      GM_download({
        url: url,
        name: name,
        onerror: (error) => {
          errornum++;
          console.log(url);
          console.log(error);
        },
        onload: () => {
          oknum++;
        },
      });
    }

    const time = url_list.length > 20 ? 2000 : 1000;

    const IntervalId = setInterval(() => {
      if (url_list.length == oknum + errornum) {
        const msg = `下载完成，共${url_list.length}个文件，成功${oknum}，失败${errornum}`;
        alert(msg);
        clearInterval(IntervalId);
      }
    }, time);
  }

  init_button();
})();
