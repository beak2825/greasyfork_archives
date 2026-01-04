// ==UserScript==
// @name         自动填写并提交 Steam 家庭监护 PIN
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  通过自动填写 PIN 码并提交，实现在浏览器中自动退出 Steam 家庭监护的状态。
// @author       Ne0
// @include      http*://*.steampowered.com/*
// @include      http*://steamcommunity.com/*
// @include      http*://*.steamcommunity.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420345/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%B9%B6%E6%8F%90%E4%BA%A4%20Steam%20%E5%AE%B6%E5%BA%AD%E7%9B%91%E6%8A%A4%20PIN.user.js
// @updateURL https://update.greasyfork.org/scripts/420345/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%B9%B6%E6%8F%90%E4%BA%A4%20Steam%20%E5%AE%B6%E5%BA%AD%E7%9B%91%E6%8A%A4%20PIN.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var pin = "pin"; // 在这里填写您的 PIN

  if(document.getElementById("steam_parental_password_box")!=null && pin == "pin"){
        // username check
        alert("【自动退出 Steam 家庭监护脚本】\n 请编辑脚本并填写您的 PIN");
        return false;
  }

  document.getElementById("steam_parental_password_box").value = pin;
  SubmitForm();

})();
