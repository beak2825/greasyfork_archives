// ==UserScript==
// @name        BILIBILI视频描述中的N站链接的域名替换及脚本
// @namespace   bilibili_vdesc_exchange
// @description 刷新网页简介里的那个sm号应该就能用了（猜测）
// @include     *://*.bilibili.*/video/*
// @version     114.514
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/459151/BILIBILI%E8%A7%86%E9%A2%91%E6%8F%8F%E8%BF%B0%E4%B8%AD%E7%9A%84N%E7%AB%99%E9%93%BE%E6%8E%A5%E7%9A%84%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2%E5%8F%8A%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/459151/BILIBILI%E8%A7%86%E9%A2%91%E6%8F%8F%E8%BF%B0%E4%B8%AD%E7%9A%84N%E7%AB%99%E9%93%BE%E6%8E%A5%E7%9A%84%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2%E5%8F%8A%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

setTimeout(function() {
  var v_desc = document.querySelector('#v_desc');
  var n_v_desc = v_desc.innerHTML.replace(/\/\/acg\.tv/g,'//nicovideo.jp/watch');
     if (n_v_desc !== v_desc.innerHTML) {
    v_desc.innerHTML = n_v_desc;

  }
//  v_desc.innerHTML = n_v_desc;
}, 2000);