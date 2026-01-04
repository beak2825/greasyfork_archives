// ==UserScript==
// @name         JDY_Packing_List
// @namespace    https://www.liftnova-cranes.com/
// @version      0.3
// @description  用于简道云装箱清单
// @author       Bruce
// @match        https://u4c0fh51hz.jiandaoyun.com/f/630adcd5970d7e0008093d2f
// @icon         https://www.google.com/s2/favicons?domain=jiandaoyun.com
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/491370/JDY_Packing_List.user.js
// @updateURL https://update.greasyfork.org/scripts/491370/JDY_Packing_List.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const ComputerName = "仓库主机";
    var delay_time = 2000; //单位毫秒，根据原本页面载入用时判断
setTimeout(function(){
//css start
    var div1=document.getElementsByClassName("form-content")[0];
    div1.style.width="1700px";
    var div2=document.getElementsByClassName("subform-content ps")[0];
    div2.style.maxHeight="none";
    var div3=document.getElementsByClassName("external-qr")[0];
    div3.style.display="none";
//css end

  //找到要添加节点的父节点(head-title)
  var head_title = document.getElementsByClassName("head-title")[0];
  //添加一个按钮
  var Refresh_btn = document.createElement("input");
  Refresh_btn.type = "button";
  Refresh_btn.value = "重置页面";
  Refresh_btn.style = "background-color: yellow;border-color: yellowgreen;color: red;width: 120px;font-size: 20px;border-radius: 3px;cursor: pointer;";
  //添加onclick事件,和事件执行的函数
  Refresh_btn.onclick = function Refresh_fun(){
  location.reload();
  }
  //添加另一个按钮
  var Clear_btn = document.createElement("input");
  Clear_btn.type = "button";
  Clear_btn.value = "去除0行";
  Clear_btn.style = "background-color: lightgrey;border-color: yellowgreen;color: red;width: 120px;font-size: 20px;border-radius: 3px;cursor: pointer;";
  //添加onclick事件,和事件执行的函数
  Clear_btn.onclick = function Clear_fun(){
	  for(var rows=document.getElementsByClassName("fx-subform-row"),i=rows.length-1;i=>0;i--){
		  if(0==rows[i].getElementsByClassName("subform-cell")[8].getElementsByClassName("normal-input")[0].getAttribute("value")){
			rows[i].getElementsByClassName("x-icon iconfont-fx-pc row-icon icon-trash")[0].click();
			setTimeout(function(){document.getElementsByClassName("x-button x-button-css-var size-small style-normal danger footer-btn")[0].click();},1000);
		  }
	  }
  }
  //把节点添加到head-title当中
  head_title.appendChild(Refresh_btn);
  head_title.appendChild(Clear_btn);
  //填写主机名称
  function set(dom,num,value){
      let inputLabel = dom; //这里获取需要自动录入的input内容
      let lastValue = inputLabel[num].value;
      inputLabel[num].value = value;
      let event = new Event("input", { bubbles: true });
      event.simulated = true;
      let tracker = inputLabel[num]._valueTracker;
      if (tracker) {
          tracker.setValue(lastValue);
      }
      inputLabel[num].dispatchEvent(event);
  }
  setTimeout(()=>{
      set(document.getElementsByClassName("input-inner"),1,ComputerName);
  },200)
  var CN= document.getElementsByClassName("input-inner")[1];
  CN.focus();
  setTimeout(()=>{
      CN.setAttribute("readOnly","true");
  },200)
  setTimeout(()=>{
  var QR_input = document.getElementsByClassName("input-inner")[0];
  QR_input.focus();
  },1000)
} , delay_time)
    // Your code here...
})();