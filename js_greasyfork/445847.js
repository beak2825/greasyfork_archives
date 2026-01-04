// ==UserScript==
// @name         bilibili_favlist_backup
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  备份bilibili收藏夹
// @author       hh
// @match        https://space.bilibili.com/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445847/bilibili_favlist_backup.user.js
// @updateURL https://update.greasyfork.org/scripts/445847/bilibili_favlist_backup.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let myMID = document.baseURI.match(/\d+/g)[0];
  async function getList() {
    return fetch(
      "https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=" +
        myMID +
        "&jsonp=jsonp",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en,zh-CN;q=0.9,zh;q=0.8",
          "cache-control": "no-cache",
          pragma: "no-cache",
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
        referrerPolicy: "no-referrer-when-downgrade",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    ).then((r) => r.json());
  }

  var result = [];
  async function setResult() {
    result = [];
    document.querySelector("#mybt1").innerText = "Waiting~";
    setTimeout(() => {
      document.querySelector("#mybt1").innerText = "done";
    }, 8000);

    let myList = getList();
    myList.then((d) => {
      if (d.code === 0) {
        let my2List = d.data.list;
        for (let i = 0; i < my2List.length; i++) {
          const curList = my2List[i];
          result[i] = {
            media_id: curList.id,
            media_count: curList.media_count,
            title: curList.title,
            content: [],
          };
          let page = Math.ceil(curList.media_count / 20);
          for (let j = 1; j <= page; j++) {
            setTimeout(() => {
              //let cnt = (j === page) ? curList.media_count - (page - 1) * 20 : 20;
              let cnt = 20;
              fetch(
                "https://api.bilibili.com/x/v3/fav/resource/list?media_id=" +
                  curList.id +
                  "&pn=" +
                  j +
                  "&ps=" +
                  cnt +
                  "&keyword=&order=mtime&type=0&tid=0&platform=web&jsonp=jsonp",
                {
                  headers: {
                    accept: "application/json, text/plain, */*",
                    "accept-language": "en,zh-CN;q=0.9,zh;q=0.8",
                    "cache-control": "no-cache",
                    pragma: "no-cache",
                    "sec-ch-ua-mobile": "?0",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                  },
                  referrer: "https://space.bilibili.com/" + myMID + "/favlist",
                  referrerPolicy: "no-referrer-when-downgrade",
                  body: null,
                  method: "GET",
                  mode: "cors",
                  credentials: "include",
                }
              ).then((r) =>
                r.json().then((curPage) => {
                  if (curPage.code === 0) {
                    result[i].content = result[i].content.concat(
                      curPage.data.medias
                    );
                  } else {
                    console.log(curPage);
                    document.querySelector("#internationalHeader").innerHTML +=
                      '<br><br><p>以下信息获取失败:</p><p style="color:red">' +
                      JSON.stringify(curPage) +
                      "</p>";
                  }
                })
              );
            }, 500 * j);
          }
        }
      } else {
        console.log(d);
        alert("获取收藏夹列表信息失败");
      }
    });
  }

  let LoadElement = () => {
    document.querySelector(".h-user").innerHTML +=
      '<div><button id="mybt1">Query</button><button id="mybt2">ShowJson</button></div>';
    document.querySelector(".h-user").innerHTML +=
      '<p style="background:white" id="resultP">---</p>';
    document.querySelector("#mybt1").addEventListener("click", setResult);
    document.querySelector("#mybt2").addEventListener("click", () => {
      document.querySelector("#resultP").innerText = JSON.stringify(result);
    });
  };

  window.onload = setTimeout(LoadElement, 3000);
})();
