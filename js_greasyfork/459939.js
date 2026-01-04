// ==UserScript==
// @name         ニコニコ動画　いいねしてくれた人を見ながら表示
// @namespace    tanbatu
// @version      0.1
// @description  アナリティクスに飛ばずにいいね一覧を重ねて表示します
// @author       You
// @match        https://*.nicovideo.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459939/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E3%80%80%E3%81%84%E3%81%84%E3%81%AD%E3%81%97%E3%81%A6%E3%81%8F%E3%82%8C%E3%81%9F%E4%BA%BA%E3%82%92%E8%A6%8B%E3%81%AA%E3%81%8C%E3%82%89%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/459939/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E3%80%80%E3%81%84%E3%81%84%E3%81%AD%E3%81%97%E3%81%A6%E3%81%8F%E3%82%8C%E3%81%9F%E4%BA%BA%E3%82%92%E8%A6%8B%E3%81%AA%E3%81%8C%E3%82%89%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  setInterval(function () {
    let list = document.querySelectorAll(".common-header-d2321f");
    list.forEach((list) => {
      if (
        list.href.startsWith(
          "https://www.upload.nicovideo.jp/nv-garage/videos/"
        )
      ) {
        let id = list.href.split("/")[5];
        list.addEventListener("click", function () {
          ex_showList(id);
        });
        list.href = "javascript:void(0)";
        list.target = "";
      }
    });
  }, 100);

  function formatDate(date) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let mn = date.getMinutes();

    return `${y}/${m}/${d} ${h}:${mn}`;
  }
  function ex_showList(id) {
    document.querySelector(".CommonHeader").insertAdjacentHTML(
      "afterend",
      `<div id='ex_likelist'>
          <a href="https://www.upload.nicovideo.jp/nv-garage/analytics/videos/"`+id+`>アナリティクスへ</a>
    <a href="javascript:document.querySelector('#ex_likelist').remove()" style="position:absolute;right:0">閉じる</a>

    </div>
    <style>
    #ex_likelist{
        overflow-y:scroll;
    box-shadow: rgba(0,0,0,0.2) 0px 0px 6px;
    position:fixed;
    z-index:999;
    bottom:0px;
    right:0px;
    width:300px;
    height:calc(100vh - 36px);
    background-color:rgba(255, 255, 255)
    }
    .likeuser{
    border-bottom: solid 1px #00000026;
    padding:8px;
    width: 100%;
    background: white;
    margin: 0 auto;
 }
    </style>`
    );

    fetch(
      `https://nvapi.nicovideo.jp/v2/users/me/videos/${id}/likes?sort=premiumPriority&pageSize=25&page=1`,
      {
        headers: {
          accept: "*/*",
          "sec-fetch-mode": "cors",
          "x-frontend-id": "25",
          "x-request-with": "nv-garage",
        },
        referrer: "https://www.upload.nicovideo.jp/",
        method: "GET",
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        data.data.items.forEach((items) => {
          document.querySelector("#ex_likelist").insertAdjacentHTML(
            "beforeend",
            `
    <a href="https://www.nicovideo.jp/user/${items.user.id}" target="_blank">
        <div class="likeuser" style="display:flex" >
        <img style="border-radius: 100%;
    height: 50px;" src=${items.user.icons.large}></img>
        <div style="margin-left:7px;"><h3 style="color:#363636">
        ${items.user.nickname}
        </h3>
        <p>${formatDate(new Date(items.like.likedAt))}
        </p></div></div></a>
    `
          );
        });
      });
  }
})();
