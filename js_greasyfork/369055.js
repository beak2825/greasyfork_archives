// ==UserScript==
// @name     VIP视频CCAV5解析
// @version    1.0.18.0909
// @description  一键免费观看[优酷|腾讯|乐视|爱奇艺|芒果|M1905|AB站]等站VIP影视，提供30多组无广告接口，欢迎体验。
// @author     CCAV5
// @homepage  https://ccav5.ml/
// @icon	https://ccav5.ml/favicon.ico
// @namespace https://greasyfork.org/users/189233
// @license MIT
// @noframes
// @match    *://*.iqiyi.com/*
// @match    *://*.youku.com/*
// @match    *://*.le.com/*
// @match    *://*.letv.com/*
// @match    *://v.qq.com/*
// @match    *://film.qq.com/*
// @match    *://*.tudou.com/*
// @match    *://*.mgtv.com/*
// @match    *://film.sohu.com/*
// @match    *://tv.sohu.com/*
// @match    *://*.acfun.cn/v/*
// @match    *://*.bilibili.com/*
// @match    *://vip.1905.com/play/*
// @match    *://*.pptv.com/*
// @match    *://v.yinyuetai.com/video/*
// @match    *://v.yinyuetai.com/playlist/*
// @match    *://*.fun.tv/vplay/*
// @match    *://*.wasu.cn/Play/show/*
// @match    *://*.56.com/*
// @exclude  *://*.bilibili.com/blackboard/*
// @downloadURL https://update.greasyfork.org/scripts/369055/VIP%E8%A7%86%E9%A2%91CCAV5%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/369055/VIP%E8%A7%86%E9%A2%91CCAV5%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(() => {
  'use strict';
  const CCAV5Icon = '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g><rect fill="none" id="canvas_background" height="18" width="18" y="-1" x="-1"/></g><g><ellipse stroke="#000" ry="7.24994" rx="6.74994" id="svg_11" cy="7.75002" cx="8" stroke-opacity="null" stroke-width="0" fill="#1A333F"/><text font-weight="bold" stroke="#000" transform="matrix(0.809852357853394,0,0,0.5467730283520195,9.023962100405583,8.460591711368162) " xml:space="preserve" text-anchor="start" font-family="Helvetica, Arial, sans-serif" font-size="24" id="svg_10" y="7.74679" x="-9.13863" stroke-opacity="null" stroke-width="0" fill="#ffffff">5</text></g></svg>';
  var tMscript = document.createElement('script');
  tMscript.innerText = `q = function(cssSelector){return document.querySelector(cssSelector);};qa = function(cssSelector){return document.querySelectorAll(cssSelector);};`;
  document.head.appendChild(tMscript);
  window.q = function(cssSelector) {return document.querySelector(cssSelector);};
  window.qa = function(cssSelector) {return document.querySelectorAll(cssSelector);};
  /* 兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+ */
  function GMaddStyle(cssText){
    let a = document.createElement('style');
    a.textContent = cssText;
    let doc = document.head || document.documentElement;
    doc.appendChild(a);
  }
  GMaddStyle(`
    #CCAV5{position:fixed;background-color:#debb50;top:7em;left:0;padding:0;z-index:999999;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:15px;}
    #CCAV5 li{list-style:none;}
    #CCAV5 svg{float:right;}
    .AV5{opacity:0.3;position:relative;padding:1em .4em;height:5.5em;width:1.2em;cursor:pointer;}
    .AV5:hover{opacity:1;display:block;}
  `);
  var ccav5api = {
    title: "免费看VIP视频就用CCAV5解析",
    url: "http://ccav5.ml/v.html?url=",
    name:CCAV5Icon+"免费观看"
  };

  /*  执行  */
  var div = document.createElement("div");
  div.id = "CCAV5Play";
  var txt = '', i = 0;

  div.innerHTML = `
    <ul id="CCAV5">
      <li class="AV5" data-url="${ccav5api.url}" title="${ccav5api.title}" onclick="window.open(this.dataset.url+location.href,'_self')">${ccav5api.name}</li>
      <li class="AV5" style="height:1.5em;" data-url="${ccav5api.url}" title="在新窗口中解析播放" onclick="window.open(this.dataset.url+location.href)">🎬</li>
    </ul>
  `;
  document.body.appendChild(div);

})();
