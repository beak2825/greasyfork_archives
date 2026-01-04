// ==UserScript==
// @name        去你的GitCode
// @description GitCode自动重定向到GitHub, 拒绝赤石
// @namespace   Violentmonkey Scripts
// @author      qby
// @match       https://gitcode.com/*
// @grant       none
// @version     1.1
// @license     MIT
// @author      -
// @description 6/28/2024, 6:27:54 AM
// @downloadURL https://update.greasyfork.org/scripts/499081/%E5%8E%BB%E4%BD%A0%E7%9A%84GitCode.user.js
// @updateURL https://update.greasyfork.org/scripts/499081/%E5%8E%BB%E4%BD%A0%E7%9A%84GitCode.meta.js
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
    window.location.href = "https://github.com/" + window.location.pathname;
  }
}

exec()
