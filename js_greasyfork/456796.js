// ==UserScript==
// @name         BH3_wallpapers
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  崩坏3壁纸批量下载
// @author       backrock12
// @match        https://www.bh3.com/wallpapers
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bh3.com
// @grant       GM_download
// @grant       GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456796/BH3_wallpapers.user.js
// @updateURL https://update.greasyfork.org/scripts/456796/BH3_wallpapers.meta.js
// ==/UserScript==

(function () {
  "use strict";

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

  async function GET_JSON() {
    const url =
      "https://www.bh3.com/content/bh3Cn/getContentList?pageSize=9999&pageNum=1&channelId=177";
    const jsontext = await gethtml(url);

    var json = JSON.parse(jsontext);
    console.log(json);

    const list = json.data.list;
    if (!list) alert("LIST is null");

    console.log(list);

    let oknum = 0;
    let errornum = 0;

    for (let i = 0; i < list.length; i++) {
      const url = list[i].ext[0].value[0].url;
      const ext = list[i].ext[0].value[0].name;
      const name = list[i].ext[1].value;

      if (!url) alert("url is null");

      const title = name + ext.substring(ext.lastIndexOf("."));
      console.log(url);
      console.log(title);

      GM_download({
        url: url,
        name: title,
        onerror: (error) => {
          errornum++;
          console.log("error",url);
          console.log("error",error);
        },
        onload: () => {
          oknum++;
        },
      });
    }

    const time = list.length > 20 ? 2000 : 1000;

    const IntervalId = setInterval(() => {
      if (list.length == oknum + errornum) {
        const msg = `下载完成，共${list.length}个文件，成功${oknum}，失败${errornum}`;
        alert(msg);
        clearInterval(IntervalId);
      }
    }, time);
  }

  function all_down() {
    //按键ID
    const h1_id = ".paper-pagination";
    const h1 = document.querySelector(h1_id);
    console.log(h1);
    if (!h1) {
      console.log(" h1 is null  ");
    }

    //创建按钮
    const ce = document.createElement("button");
    ce.id = "CDownBtn";
    ce.textContent = "全部下载";
    ce.className = "btn btn-md btn-default";
    ce.onclick = function () {
      //down_all();
      GET_JSON();
    };
    h1.append(ce);
  }

  function add_down() {
    console.log("add_down");

    //按键ID
    const h1_id = ".paper-pagination";
    const h1 = document.querySelector(h1_id);
    console.log(h1);
    if (!h1) {
      console.log(" h1 is null  ");
    }

    //创建按钮
    const ce = document.createElement("button");
    ce.id = "CDownBtn";
    ce.textContent = "本页下载";
    ce.className = "btn btn-md btn-default";
    ce.onclick = function () {
      down_all();
    };
    h1.append(ce);

    //下载事件
    async function down_all() {
      // url
      const list = document.querySelectorAll(".paper-item a");
      console.log(list);

      const tlist = document.querySelectorAll(".paper-item div");
      console.log(tlist);

      let oknum = 0;
      let errornum = 0;

      for (let i = 0; i < list.length; i++) {
        const url = list[i].href;
        const name = tlist[i].innerText + ".jpg"; //.replace(".", "_");
        GM_download({
          url: url,
          name: name,
          onerror: (error) => {
            errornum++;
            console.log("error",url);
            console.log("error",error);
          },
          onload: () => {
            oknum++;
          },
        });
      }

      const time = list.length > 20 ? 2000 : 1000;

      const IntervalId = setInterval(() => {
        if (list.length == oknum + errornum) {
          const msg = `下载完成，共${list.length}个文件，成功${oknum}，失败${errornum}`;
          alert(msg);
          clearInterval(IntervalId);
        }
      }, time);
    }
  }

  all_down();
  add_down();
})();
