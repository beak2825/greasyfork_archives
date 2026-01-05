// ==UserScript==
// @name        恋恋影视、恋恋图片页面美化
// @namespace   bluefountain@sina.com
// @include     http://*.2mmei.com/
// @include     http://www.2mmei.com/*
// @include     http://*.2mm.tv/
// @include     http://www.flv.tv/*
// @include     http://*.flv.tv/*
// @include     http://www.vcd.tv/*
// @include     http://*.vcd.tv
// @include     http://www.2mmei.net*
// @include     http://*.2mmei.net
// @include     http://www.2ta.tv/*
// @include     http://*.2ta.tv/
// @include     http://*.33c.tv
// @include     https://www.33c.tv/*


// @version     1.5
// @grant       none
// @description 移除恋恋影视和恋恋图片站的缩略图莫名其妙的透明度遮挡
function addGlobalStyle(css) {
  var head,
  style;
  head = document.getElementsByTagName('head') [0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}
addGlobalStyle('.hm .i {opacity: 1;}');
addGlobalStyle('.s1 img {opacity: 1;}');

// @downloadURL https://update.greasyfork.org/scripts/11433/%E6%81%8B%E6%81%8B%E5%BD%B1%E8%A7%86%E3%80%81%E6%81%8B%E6%81%8B%E5%9B%BE%E7%89%87%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/11433/%E6%81%8B%E6%81%8B%E5%BD%B1%E8%A7%86%E3%80%81%E6%81%8B%E6%81%8B%E5%9B%BE%E7%89%87%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
