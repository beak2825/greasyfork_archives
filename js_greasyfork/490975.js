// ==UserScript==
// @name        抖音复制
// @namespace   Violentmonkey Scripts
// @match       https://www.douyin.com/user/*
// @grant       none
// @version     1.0
// @author      shihaoliu
// @description 2024/3/25 19:20:12
// @downloadURL https://update.greasyfork.org/scripts/490975/%E6%8A%96%E9%9F%B3%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/490975/%E6%8A%96%E9%9F%B3%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function () {
  "use strict";

  var Name = document.getElementsByClassName('el-descriptions-item__content');

  var YQ_cube = document.createElement("div");
  YQ_cube.className = "no-select";
  YQ_cube.style.cssText = `
        width: 70px;
        height: 30px;
        border-radius: 5px;
        background-color: #CCC;
        position: fixed;
        left: 43%;
        top: 10%;
        cursor: pointer;
        z-index: 99999999;
        transform: translate(0, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 13px;
        font-weight: bold;
        box-shadow: rgb(0 0 0 / 30%) 0px 2px 5px;
    `;

  YQ_cube.textContent = "复制";

  document.body.appendChild(YQ_cube);

  // 昵称
  const UName = document.getElementsByClassName('a34DMvQe');
  // 粉丝
  const Fan = document.getElementsByClassName('sCnO6dhe');

  YQ_cube.addEventListener("click", function () {



    let FanNum = Fan[1].innerText;
    if(FanNum.charAt(FanNum.length - 1) == '万'){
      FanNum = FanNum.substr(0, FanNum.length - 1).split(".").join("").concat('000');
    }else{
      FanNum = FanNum;
    }

    // 要复制的内容
    const URLText = [UName[0].innerText,window.location.href,FanNum]

    console.log(URLText)
    navigator.clipboard.writeText(URLText);
    // console.log(navigator.clipboard.writeText(window.location.href));
  });

})();



