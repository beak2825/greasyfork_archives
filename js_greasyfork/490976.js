// ==UserScript==
// @name        抖音搜索粘贴
// @namespace   Violentmonkey Scripts
// @match       https://www.douyin.com/search/*
// @grant       none
// @version     1.0
// @author      shihaoliu
// @description 2024/3/25 20:38:35
// @downloadURL https://update.greasyfork.org/scripts/490976/%E6%8A%96%E9%9F%B3%E6%90%9C%E7%B4%A2%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/490976/%E6%8A%96%E9%9F%B3%E6%90%9C%E7%B4%A2%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==
(function () {
  "use strict";

  var style = document.createElement("style");
  style.textContent = `
        .paste{
          width: 70px;
          height: 30px;
          border-radius: 5px;
          background-color: #CCC;
          position: fixed;
          left: 35%;
          top: 2%;
          cursor: pointer;
          z-index: 99999999;
          transform: translate(0, -50 %);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 13px;
          font-weight: bold;
          box-shadow: rgb(0 0 0 / 30%) 0px 2px 5px;
        }
    `;

  document.head.appendChild(style);

  var SearchInput = document.getElementsByClassName('igFQqPKs');
  var SearchBtn = document.getElementsByClassName('rB8dMXOc');

  // 粘贴按钮
  var Paste = document.createElement("div");

  Paste.className = "paste";

  Paste.textContent = "粘贴";

  document.body.appendChild(Paste);

  Paste.addEventListener("click", function () {
    // let URL = window.location.href;

    navigator.clipboard.readText().then((text) => {
      // SearchInput[0].value = text;
      // console.log(URL)
      // https://www.douyin.com/search/%E8%84%B1%E7%BC%B0%E5%87%AF?type=user
      window.location.href = "https://www.douyin.com/search/"+text+"?type=user";
      console.log("https://www.douyin.com/search/"+text+"?type=user");
    });
  });

})();