// ==UserScript==
// @name        赤石啊 GitCode
// @name:zh-CN  赤石啊 GitCode
// @name:zh-HK  吔屎啊 GitCode
// @description GitCode自动重定向到GitHub, 拒绝赤石
// @description:zh-CN GitCode自动重定向到GitHub, 拒绝赤石
// @description:zh-HK GitCode自動重定向至GitHub
// @namespace   Violentmonkey Scripts
// @author      TC999，原作者qby(https://greasyfork.org/zh-CN/users/844141-cubewhy)
// @match       https://gitcode.com/*
// @grant       none
// @version     1.2.1
// @license     MIT
// @icon        https://cdn-static.gitcode.com/static/images/logo-favicon.png
// @downloadURL https://update.greasyfork.org/scripts/499305/%E8%B5%A4%E7%9F%B3%E5%95%8A%20GitCode.user.js
// @updateURL https://update.greasyfork.org/scripts/499305/%E8%B5%A4%E7%9F%B3%E5%95%8A%20GitCode.meta.js
// ==/UserScript==
console.log("Fuck you GitCode!");

function exec() {
  let target = "https://gitcode.com/Gitcode-offical-team/GitCode-Docs/issues/198"
  if (window.location.href == target){
    return;
  }
  alert("傻逼GitCode");
  if (window.location.pathname == "/") {
    window.location.href = target
  } else {
    let remove = window.location.pathname.replace('/overview','');// 删除地址末尾
    window.location.href = "https://github.com" + remove;
  }
}

exec()
