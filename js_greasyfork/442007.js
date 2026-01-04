// ==UserScript==
// @name        增加周次切换按钮 - seewo.com
// @namespace   Violentmonkey Scripts
// @match       https://care.seewo.com/app/
// @grant       none
// @version     1.0
// @author      tony
// @description 2022/3/24 16:25:11
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442007/%E5%A2%9E%E5%8A%A0%E5%91%A8%E6%AC%A1%E5%88%87%E6%8D%A2%E6%8C%89%E9%92%AE%20-%20seewocom.user.js
// @updateURL https://update.greasyfork.org/scripts/442007/%E5%A2%9E%E5%8A%A0%E5%91%A8%E6%AC%A1%E5%88%87%E6%8D%A2%E6%8C%89%E9%92%AE%20-%20seewocom.meta.js
// ==/UserScript==

(function(){
  var tim;
  function preWeek(){
    alert("Hello,preWeek");
  }
  function nextWeek(){
    
  }
  function AddBtn(){
    pChoose = document.getElementsByClassName("ant-select-selection-selected-value");
    pDiv = document.getElementsByClassName("ant-row date-picker-row");
    ispreDiv =document.getElementById("newPreBtn");
    if(ispreDiv!=null){
      if(pChoose[0].innerHTML!="自定义"){
        pDiv[0].removeChild(ispreDiv);
      }
      return;
    }
    preDiv = document.createElement("div");
    preDiv.setAttribute("stype","margin-left: 10px");
    preDiv.id = "newPreBtn";
    preDiv.className ="ant-col-2";
    preBtn = document.createElement("button");
    preBtn.className ="ant-btn select-btn";
    preBtn.textContent ="上周";
    preBtn.addEventListener("click",preWeek);
    nextBtn = document.createElement("button");
    nextBtn.className ="ant-btn select-btn";
    nextBtn.textContent ="下周";
    nextBtn.addEventListener("click",nextWeek);
    preDiv.appendChild(preBtn);
    preDiv.appendChild(nextBtn);
    if(pDiv.length>0){
      if(pChoose[0].innerHTML=="自定义")
        {
          pDiv[0].appendChild(preDiv);
        }
    }
  }

  tim = setInterval(AddBtn,3000);
})();