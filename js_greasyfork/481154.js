// ==UserScript==
// @name         Moodle Login Automazer
// @namespace    https://github.com/Wiiiiam104/
// @version      0.2
// @description  Automaze Logining to Chiba-u Moodle
// @author       Wiiiiam104
// @match        https://moodle.gs.chiba-u.jp/moodle/*
// @downloadURL https://update.greasyfork.org/scripts/481154/Moodle%20Login%20Automazer.user.js
// @updateURL https://update.greasyfork.org/scripts/481154/Moodle%20Login%20Automazer.meta.js
// ==/UserScript==

(()=>{
  'use strict';

  let addCarouselItem=()=>{
    let a=document.createElement("a");
    a.classList=["dropdown-item"];
    a.role="menuitem";
    a.tabindex="-1";
    a.href='javascript:let username=window.prompt("usernameを入力してください");let password=window.prompt("passwordを入力してください");localStorage.MLA=JSON.stringify({username,password});"Complete changing. Press f5 to return the page."';
    a.innerHTML="ログイン情報の登録";
    document.querySelector("#carousel-item-main").appendChild(a);
  };

  let postLoginForm=(user,pass,token)=>{
    let span=document.createElement("span");

    span.innerHTML=`
      <form action="https://moodle.gs.chiba-u.jp/moodle/login/index.php" method="post" type="hidden">
        <input name="anchor" value="${location.hash}">
        <input name="logintoken" value="${token}">
        <input name="username" value="${user}">
        <input name="password" value="${pass}">
        <button id="loginbtn"></button>
      </form>
    `;

    document.querySelector("body").appendChild(span);
    span.querySelector("#loginbtn").click();
  };

  let login=(user, pass)=>{
    let xhr=new XMLHttpRequest();
    xhr.open("GET", "https://moodle.gs.chiba-u.jp/moodle/login/index.php");
    xhr.send();
    xhr.onload=()=>{
      let str=xhr.responseText;
      let token=str.split("logintoken")[1].split(">")[0].split("value")[1].split("\"")[1];
      postLoginForm(user,pass,token);
    };
  };

  if(window.location.pathname.split("/").length==3) login(JSON.parse(localStorage.MLA).username, JSON.parse(localStorage.MLA).password);
  else addCarouselItem();
})();