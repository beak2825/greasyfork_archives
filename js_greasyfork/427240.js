// ==UserScript==
// @name         优酷自动3倍速，改视频播放倍数
// @namespace    youkubeisu
// @version      1.0
// @description  增加优酷网页倍速播放的选项
// @author       土鸡
// @include      *.youku.com/v*
// @include      *m.youku.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427240/%E4%BC%98%E9%85%B7%E8%87%AA%E5%8A%A83%E5%80%8D%E9%80%9F%EF%BC%8C%E6%94%B9%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%80%8D%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/427240/%E4%BC%98%E9%85%B7%E8%87%AA%E5%8A%A83%E5%80%8D%E9%80%9F%EF%BC%8C%E6%94%B9%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%80%8D%E6%95%B0.meta.js
// ==/UserScript==

window.onload = function(){



setTimeout(function(){
//这里写时间到后执行的代码
$('.rate-dashboard').empty();
var strhtml = '';
var js= 5.5;
for (let i = 0; i <= 8; i++) {
    js -=0.5;
    strhtml +='<div data-val="' + js +'" class="settings-item rate-item" data-eventlog="xsr">'+
    '' + js +'X'+
   '</div>';
}
$('.rate-dashboard').append(strhtml);
$('.rate-dashboard')[0].childNodes[4].className='settings-item rate-item active';
}, 100);

};