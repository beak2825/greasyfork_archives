// ==UserScript==
// @name        快手复制
// @namespace   Violentmonkey Scripts
// @match       https://www.kuaishou.com/profile/*
// @grant       none
// @version     1.0
// @author      shihaoliu
// @description 2024/3/27 14:48:31
// @downloadURL https://update.greasyfork.org/scripts/491050/%E5%BF%AB%E6%89%8B%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/491050/%E5%BF%AB%E6%89%8B%E5%A4%8D%E5%88%B6.meta.js
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
  const UName = document.getElementsByClassName('user-name');
  // 粉丝
  const Fan = document.getElementsByClassName('user-detail-item center-item');

  YQ_cube.addEventListener("click", function () {

    let FanNum = Fan[0].getElementsByTagName('h3')[0].innerText;
    if(FanNum.charAt(FanNum.length - 1) == '万'){
      if(FanNum.indexOf('.') === -1){
        FanNum = FanNum.substr(0, FanNum.length - 1).concat('0000')
      }else{
        FanNum = FanNum.substr(0, FanNum.length - 1).split(".").join("").concat('000');
      }
    }else{
      FanNum = FanNum;
    }

    // 要复制的内容
    const URLText = [UName[1].innerText,window.location.href,FanNum]

    console.log(URLText)
    navigator.clipboard.writeText(URLText);
    // console.log(navigator.clipboard.writeText(window.location.href));
  });

})();



