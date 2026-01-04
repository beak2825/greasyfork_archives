// ==UserScript==
// @name         一键测评
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  正方教育网教学质量测评一键脚本
// @author       JiaNiuBi
// @match        http://jwxt2.jit.edu.cn/xs_main.aspx?xh=*&type=1
// @icon         http://ehall.jit.edu.cn/resources/app/5288724893588109/1.0_R1/icon_72.png?_=1599616695000
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428535/%E4%B8%80%E9%94%AE%E6%B5%8B%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/428535/%E4%B8%80%E9%94%AE%E6%B5%8B%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

window.onload=function(){
  let bodyDiv = document.querySelector("#bodyDiv");
  let newB = document.createElement("div");
 bodyDiv.appendChild(newB);
  newB.setAttribute("id", "newB");
  newB.style.position = "absolute";
  newB.style.height = "80px"
  newB.style.width = "160px"
  newB.style.border = "1px solid black"
  newB.style.top = "45%";
  newB.style.right = "0";
    newB.style.zIndex = "9999";
    newB.style.margin = "3px 2px 0";
    newB.style.backgroundColor = "#cee1fd"
    newB.style.textAlign = "center";
    let div2 = document.createElement("div")
    let p1 = document.createElement("p");
    newB.appendChild(div2);
    div2.appendChild(p1);
    div2.style.width = "156px";
    div2.style.margin = "20px auto"
    p1.innerHTML = "教学质量测评："
    p1.style.float = "left";
     let btn = document.createElement("button");
  div2.appendChild(btn)
  btn.innerHTML = "一键更改";
      btn.style.float = "left";
    btn.onclick = function (){
    let selected = document.querySelector("#iframeautoheight").contentWindow.document.querySelectorAll('select')

        console.log(selected);
    for(let i = 0;i < selected.length;i++){
    selected[i].value = "A强烈同意";
        selected[4].value = "B同意";
        selected[7].value = "B同意";
    }
}
  }

})();