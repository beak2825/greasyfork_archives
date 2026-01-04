// ==UserScript==
// @namespace   DJL
// @version     1.0.1.20180107
// @match       https://2.taobao.com/*
// @match       https://s.2.taobao.com/*
// @name        XianYu Search
// @name:zh-CN  闲鱼搜索
// @description:en Unlock XianYu Search
// @description:zh-CN 解除网页闲鱼搜索限制
// @description Unlock XianYu Search
// @downloadURL https://update.greasyfork.org/scripts/37103/XianYu%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/37103/XianYu%20Search.meta.js
// ==/UserScript==

//解除主页面上搜索框
Ele = document.getElementById('J_IdleHeader');
EleText = Ele.innerHTML.replace(/<!--/g,'').replace(/-->/,'');
Ele.innerHTML = EleText;

//解除搜索结果右上角搜索框
var url = document.domain;
if (url == 's.2.taobao.com'){
  document.getElementsByClassName('search-filters-block search-filters')[0].style.display='block';
};