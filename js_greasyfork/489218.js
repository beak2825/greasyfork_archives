// ==UserScript==
// @name         Steam Cloudsave
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Steam Cloudsave for store webpage.
// @description:zh-cn Steam 商店页面添加访问云存档按钮
// @description:zh-tw Steam 商店頁面添加訪問雲端存檔按鈕
// @author       WK
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489218/Steam%20Cloudsave.user.js
// @updateURL https://update.greasyfork.org/scripts/489218/Steam%20Cloudsave.meta.js
// ==/UserScript==

(function() {
  function prepend(element,id) {
      var firstChild = document.body.firstChild;
      document.getElementById(id).insertBefore(element, document.getElementById(id).children[0]);
  }

var url = location.href;
var match = url.match(/app\/(\d+)\//);

if (match) {
  var appId = match[1];
  console.log(appId);
}

function getBrowserLanguage() {
  let language = navigator.language || navigator.userLanguage;
  if (!language) {
    language = 'en-US';
  }
  return language;
}

const language = getBrowserLanguage();

var text = "🔃 Cloudsave";
    if(language=="zh-CN"){
        text = "🔃 云存档";
    }else if(language=="zh-TW"){
        text = "🔃 雲端存檔";
    }

var element = document.createElement("div");

element.innerHTML = '<a href="https://store.steampowered.com/account/remotestorageapp?appid='+appId+'&index=0" class="btnv6_blue_hoverfade btn_medium es_app_btn" target="_blank"><span>'+text+'</span></a>';

prepend(element,"shareEmbedRow");

var element2 = document.createElement("div");

element2.innerHTML = '<div class="store_header_btn_gray store_header_btn"><div class="store_header_btn_caps store_header_btn_leftcap"></div><div class="store_header_btn_caps store_header_btn_rightcap"></div><a id="cloudsave_btn" class="store_header_btn_content" href="https://store.steampowered.com/account/remotestorageapp?appid='+appId+'&index=0" target="_blank">'+text+'</a></div>';

prepend(element2,"cart_status_data");

})();