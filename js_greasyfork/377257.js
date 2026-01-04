// ==UserScript==
// @name    Mastodon Local tiemline automatic pull-down script
// @description Automatic pull-down Mastodon Local tiemline
// @version  1.1
// @author bgme
// @include https://multicast.social/*
// @include https://gouhuoapp.com/*
// @include https://bangdream.space/*
// @include https://free-le.info/*
// @include https://mastodon.futa.moe/*
// @include https://acg.mn/*
// @include https://kopiti.am/*
// @include https://wb.xiaoyuanvc.com/*
// @include https://g0v.social/*
// @include https://social.simcu.com/*
// @include https://chating.xyz/*
// @include https://m.moe.cat/*
// @include https://wxw.moe/*
// @include https://cncs.io/*
// @include https://acg.social/*
// @include https://sn.angry.im/*
// @include https://cap.moe/*
// @include https://inanna.xyz/*
// @include https://cmx.im/*
// @include https://m.hitorino.moe/*
// @include https://nebula.moe/*
// @include https://humblr.social/*
// @include https://pawoo.net/*
// @run-at document-idle
// @grant  none
// @namespace https://greasyfork.org/users/243072
// @downloadURL https://update.greasyfork.org/scripts/377257/Mastodon%20Local%20tiemline%20automatic%20pull-down%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/377257/Mastodon%20Local%20tiemline%20automatic%20pull-down%20script.meta.js
// ==/UserScript==

"use strict";

var i = 0;

function ss(){
  const columns = document.getElementsByClassName('column');
  var S = null
  for (let column of columns) {
    let icon = column.getElementsByClassName('fa-users');
    if (icon.length === 1){
      var S = column.getElementsByClassName('scrollable')[0];
      var L = S.getElementsByClassName('item-list')[0];
      break;
    };
  };
  if (S === null){
    console.error('Not found Local timeline!');
    return false;
  };
  try {
    clearInterval(s);
  }
  catch (error) {
    console.log('First running.')
  }
  finally {
    window.s = setInterval(function(){
      let t = S.scrollTop;
      S.scrollTo(0,S.scrollTop+2000);
      if (S.scrollTop > t){
        i = i + 1;
      }
    },800)};
  return true;
};

function sstop() {
  try {
    clearInterval(s);
  }
  finally {
  console.log('The number of pull down:',i);
  }
  return true;
};

var ele1 = document.createElement('button');
var ele2 = document.createElement('button');

if (
  window.navigator.language == 'zh-CN' ||
  window.navigator.language == 'zh-TW' ||
  window.navigator.language == 'zh-HK'
){
	ele1.textContent = '开始';
	ele2.textContent = '停止';
}else{
  ele1.textContent = 'Start';
	ele2.textContent = 'Stop';
};
ele1.id = 'scroll_start';
ele2.id = 'scroll_stop';
ele1.classList.add('auto_scroll');
ele2.classList.add('auto_scroll');
var button_css  = "transition: all linear .37s;" +
  	"-webkit-user-select: none;" +
  	"width: 20px;" +
  	"padding: 5px 0;" +
  	"background-color: rgb(0, 0, 0);" +
  	"color: rgb(255, 255, 255);" +
  	"font-size: 12px;" +
  	"text-align: center;" +
  	"position: fixed;" +
  	"right: 0;" +
  	"cursor: pointer;" +
  	"opacity: .6;" +
  	"filter: Alpha(opacity=60);" +
    "writing-mode: tb-rl;";

ele1.style.cssText = button_css + "bottom: 5.5em;";
ele2.style.cssText = button_css + "bottom: 1em;";

ele1.onclick=ss;
ele2.onclick=sstop;

document.body.appendChild(ele1);
document.body.appendChild(ele2);
