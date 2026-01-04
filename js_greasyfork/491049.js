// ==UserScript==
// @name        快手粘贴
// @namespace   Violentmonkey Scripts
// @match       https://www.kuaishou.com/search/*
// @grant       none
// @version     1.0
// @author      豪哥
// @description 2024/3/26 16:44:52
// @downloadURL https://update.greasyfork.org/scripts/491049/%E5%BF%AB%E6%89%8B%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/491049/%E5%BF%AB%E6%89%8B%E7%B2%98%E8%B4%B4.meta.js
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
          left: 51%;
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
  // 粘贴按钮
  var Paste = document.createElement("div");

  Paste.className = "paste";

  Paste.textContent = "粘贴";

  document.body.appendChild(Paste);

  Paste.addEventListener("click", function () {
    // let URL = window.location.href;

    navigator.clipboard.readText().then((text) => {
      // console.log(URL)
      // https://www.kuaishou.com/search/author?searchKey=%E6%AD%8C%E6%89%8B%E7%8E%AE%E4%B8%80
      window.location.href = "https://www.kuaishou.com/search/author?searchKey="+text;
      console.log("https://www.kuaishou.com/search/author?searchKey="+text);
    });
  });

})();