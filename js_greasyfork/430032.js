// ==UserScript==
// @name        公众号图文编辑图片一键居中
// @namespace   https://gitee.com/wang-yifan0905
// @match       https://mp.weixin.qq.com/cgi-bin/appmsg
// @grant       none
// @version     1.1
// @author      伍陆柒
// @description 2021/7/29 上午9:56:54
// @downloadURL https://update.greasyfork.org/scripts/430032/%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%BE%E6%96%87%E7%BC%96%E8%BE%91%E5%9B%BE%E7%89%87%E4%B8%80%E9%94%AE%E5%B1%85%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/430032/%E5%85%AC%E4%BC%97%E5%8F%B7%E5%9B%BE%E6%96%87%E7%BC%96%E8%BE%91%E5%9B%BE%E7%89%87%E4%B8%80%E9%94%AE%E5%B1%85%E4%B8%AD.meta.js
// ==/UserScript==

  "use strict"
  window.onload=function(){
  setTimeout(function(){
      var box = document.querySelector("#mpa-extra-tools-container");
      var divBtn = document.createElement('div');
      divBtn.innerHTML = "图片一键居中";
      divBtn.style.padding = "5px";
      divBtn.style.background = "#07c160";
      divBtn.style.color = "#ffffff";
      divBtn.style.fontSize = "12px";
      divBtn.style.cursor = "pointer"
      box.appendChild(divBtn);
        divBtn.addEventListener("click", function(){
        var parent = document.getElementById("ueditor_0").contentWindow.document.querySelector(".view");
        var imgArr = parent.getElementsByTagName("img");
        for(var i=0;i<imgArr.length;i++){
        imgArr[i].parentNode.style.display = "block";
        imgArr[i].parentNode.style.textAlign = "center";
   }
 })
  },2000)

 
 }