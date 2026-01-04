// ==UserScript==
// @name        AO3用戶备注
// @namespace   Violentmonkey Scripts
// @match       *://archiveofourown.org/users/*
// @match       *://zyfzd.top/users/*
// @match       *://ao3rc.andbru123.tk/users/*
// @match       *://archive.transformativeworks.org/users/*
// @match       *://jdkg.top/users/*
// @match       *://x.winsloweric.com/users/*
// @grant       none
// @version     1.1
// @author      windwords001
// @description 2024/7/14 20:50:06
// @license     AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/500903/AO3%E7%94%A8%E6%88%B6%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/500903/AO3%E7%94%A8%E6%88%B6%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
  var yonghu=document.querySelector(".primary.header.module h2.heading");
  console.log("当前用戶："+yonghu.textContent);
  if(localStorage.getItem(yonghu.textContent)!=null){
    var beizhu1=document.createElement("h2");
    beizhu1.textContent=localStorage.getItem(yonghu.textContent);
    document.querySelector("div.flash").appendChild(beizhu1);
  }else{
    console.log("未设置备注，已跳过修改。");
  }

  var anniu_weizhi=document.querySelector("div.flash");
  var anniu1=document.createElement("button");
  anniu1.textContent="设置或修改备注";
  anniu1.addEventListener("click", shezhi_beizhu);
  document.querySelector("div.flash").appendChild(anniu1);// flash这个地方好像沒人用，恰好在头像上面，按钮和备注就放这好了。
  if(localStorage.getItem(yonghu.textContent)!=null){
    var anniu2=document.createElement("button");
    anniu2.textContent="淸除备注";
    anniu2.addEventListener("click", qingchu_beizhu);
    document.querySelector("div.flash").appendChild(anniu2);
  }

  function shezhi_beizhu(){
    var beizhu=prompt("请输入用戶备注",localStorage.getItem(yonghu.textContent));
    if(beizhu!=null&&beizhu!=""){
      localStorage.setItem(yonghu.textContent,beizhu);
      alert("已成功设置备注，刷新生效。")
    }else{
      alert("你似乎未输入任何內容。备注未能被设置或修改。");
    }
  }

  function qingchu_beizhu(){
    localStorage.removeItem(yonghu.textContent);
    alert("备注已淸除，刷新生效。");
  }
})();