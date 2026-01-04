// ==UserScript==
// @name        美年大健康 - 扁鹊主检VIP客户提示
// @namespace   Violentmonkey Scripts
// @match       https://main-inspection.health-100.cn/workstation
// @grant       none
// @version     1.0
// @author      -
// @license MIT
// @description 2023/7/12 12:29
// @downloadURL https://update.greasyfork.org/scripts/470641/%E7%BE%8E%E5%B9%B4%E5%A4%A7%E5%81%A5%E5%BA%B7%20-%20%E6%89%81%E9%B9%8A%E4%B8%BB%E6%A3%80VIP%E5%AE%A2%E6%88%B7%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/470641/%E7%BE%8E%E5%B9%B4%E5%A4%A7%E5%81%A5%E5%BA%B7%20-%20%E6%89%81%E9%B9%8A%E4%B8%BB%E6%A3%80VIP%E5%AE%A2%E6%88%B7%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

setInterval(() => {
  changeVIP();
}, 16);

function changeVIP(){
  var isVIP = false;
  let logoList = document.getElementsByClassName("ant-image-img");
  let logo;
  let regVIP = new RegExp("VIP.svg");
  let regChinese = new RegExp("[^\x00-\xff]");
  let customerName = document.getElementsByClassName("ant-col name")[0];

  for(let i = 0 ; i < logoList.length ; i++){
    if(regVIP.test(logoList[i].src)){
      isVIP = true;
      logo = logoList[i];
      break;
    }
    isVIP = false;
  }
  if(isVIP){
    logo.style.height = "30px";
    logo.style.width = "30px";
    if(customerName!=null && regChinese.test(customerName.innerText)) customerName.style.color = "red";
  }
}

