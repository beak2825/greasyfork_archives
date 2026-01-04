// ==UserScript==
// @name        飞书插件左侧显示 feishuPluginLeft0{left:0}
// @namespace   leizingyiu.net
// @match       *://*.feishu.cn/base/*
// @grant       none
// @version     1.0
// @author      leizingyiu
// @description 2024/4/1 14:23:54
// @license     GNU AGPLv3 
// @downloadURL https://update.greasyfork.org/scripts/491392/%E9%A3%9E%E4%B9%A6%E6%8F%92%E4%BB%B6%E5%B7%A6%E4%BE%A7%E6%98%BE%E7%A4%BA%20feishuPluginLeft0%7Bleft%3A0%7D.user.js
// @updateURL https://update.greasyfork.org/scripts/491392/%E9%A3%9E%E4%B9%A6%E6%8F%92%E4%BB%B6%E5%B7%A6%E4%BE%A7%E6%98%BE%E7%A4%BA%20feishuPluginLeft0%7Bleft%3A0%7D.meta.js
// ==/UserScript==

if(window.location.href.match(/https*:\/\/\S*\.feishu\.cn\/base\/.*/)){
  let s=document.createElement('style');
  s.innerText=`
.garr-container.suite-body.flex.garr-container-bitable {
	margin-left: 400px;
	overflow: visible!important;
}
.extension-market-v4.extension-market-v4-spread {
	position: absolute;
	left: -400px;
}

.bitable-block-switcher,
.bitable-view-head-wrapper {
	right: 0!important;
}
#bitable-container {
	right: 0!important;
}`;
  document.body.appendChild(s);
};