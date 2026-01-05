// ==UserScript==
// @name        2nyan.org 二次壁 Anti Adblcok Bypass
// @namespace   tw.nya.2cat_anti_adblock_killer
// @description 繞過 Komica 二次壁 / 高解析板的擋廣告檢查程式
// @match       *://*.2nyan.org/*
// @run-at document-start
// @version     7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13720/2nyanorg%20%E4%BA%8C%E6%AC%A1%E5%A3%81%20Anti%20Adblcok%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/13720/2nyanorg%20%E4%BA%8C%E6%AC%A1%E5%A3%81%20Anti%20Adblcok%20Bypass.meta.js
// ==/UserScript==

// 已知 TemperMonkey 設定 injection mode = instant 會噴
let scope = (typeof unsafeWindow == "undefined") ? window : unsafeWindow;
scope.google_ad_block = 1;

// TemperMonkey with Instant mode = Default
if( GM_info.scriptHandler == "Tampermonkey" && document.readyState == "interactive" && document.body){
  stop();

  let html = document.documentElement.innerHTML;
  document.open()
  document.write(html);
  document.close();
}