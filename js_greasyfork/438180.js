// ==UserScript==
// @name         隐藏YouTube油管隐私相关界面
// @namespace    67373tools
// @description  隐藏油管关注人、各种推荐位等等
// @version      0.13
// @author       旅行
// @match        *://*.youtube.com/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438180/%E9%9A%90%E8%97%8FYouTube%E6%B2%B9%E7%AE%A1%E9%9A%90%E7%A7%81%E7%9B%B8%E5%85%B3%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/438180/%E9%9A%90%E8%97%8FYouTube%E6%B2%B9%E7%AE%A1%E9%9A%90%E7%A7%81%E7%9B%B8%E5%85%B3%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 屏蔽列表
  var pbList = {
    "首页推荐": [1, `
      ytd-rich-grid-renderer {
        visibility: hidden !important;
      }`],

    "首页推荐第二种方案": [1, `
      #feed, ytd-browse[page-subtype=home] {
        display: none !important;
      }`],

    "关注人": [1, `
      ytd-guide-section-renderer:nth-child(2) {
         visibility: hidden !important;
      }`],

    "播放页推荐": [1, `
      ytd-item-section-renderer.ytd-watch-next-secondary-results-renderer {
        visibility: hidden !important;
      }
      .style-scope.ytd-watch-next-secondary-results-renderer {
        visibility: hidden !important;
      }`],

    "即将放完了推荐": [1, `
      .ytp-ce-element {
        visibility: hidden !important;
      }`],

    "播放完了推荐": [1, `
      .html5-endscreen {
        visibility: hidden !important;
      }`],

    "右上角头像，评论框头像": [1, `
      div#simple-box yt-img-shadow img,
      div#end yt-img-shadow img{
         visibility: hidden !important;
      }
      div#simple-box yt-img-shadow,
      div#end yt-img-shadow{
         border:Green solid 1px !important;
      }`],

    "搜索联想": [1, `
      .gstl_50.sbdd_a{
         visibility: hidden !important;
      }
      `],
  }

  var pbStyle = document.createElement('style');

  // 在周三20:30~周四03:00，周六20:30~周日03:00打开时会自动屏蔽
  function timecheck(){
    let timeNow = new Date()
    let timeDay = timeNow.getDay()
    let timeMin = timeNow.getMinutes() + timeNow.getHours() * 60
    if(timeDay ==1){
      if(timeMin >= 21*60) return true
    } else if(timeDay == 3 || timeDay == 6){
      if(timeMin >= 20*60+30) return true
    }else if(timeDay == 2 || timeDay == 4 || timeDay == 0){
      if(timeMin <= 3*60) return true
    }else return false
  }

  if(timecheck()){
    if(!GM_getValue('uncheckOnWorkDay')){
      GM_setValue('pbChecked', true)
    }else if((Number(new Date())-GM_getValue('uncheckTime'))>(1000*60*60*6.5)){
      GM_setValue('pbChecked', true)
    }
  }

  pbStyle.textContent = ""
  for (var key in pbList) {
    if(pbList[key][0]){
      pbStyle.textContent += pbList[key][1];
    }
  }

  if(GM_getValue('pbChecked')){
    document.head.appendChild(pbStyle);
  }
  // 屏蔽样式部分结束

  // 添加控制按钮
  window.onload = function(){
    var pbButton = document.createElement('div')
    pbButton.style = "color: Green; align-items: center; display: flex;"
    pbButton.innerHTML = (`
    <div>pb</div>
    <input type="checkbox">
    `)
    pbButton.querySelector('input').checked = GM_getValue('pbChecked')
    document.querySelector("#start").appendChild(pbButton)

    pbButton.querySelector('input').addEventListener("click", pbCheck)
    function pbCheck(){
      GM_setValue('pbChecked', this.checked);
      if(this.checked){
        document.head.appendChild(pbStyle);
      }else{
        document.head.removeChild(pbStyle);
        GM_setValue('uncheckTime', Number(new Date()))
        if(timecheck()){
          GM_setValue('uncheckOnWorkDay', true)
        }else{
          GM_setValue('uncheckOnWorkDay', false)
        }
      }
    console.log([111,GM_getValue('pbChecked'),GM_getValue('uncheckTime'),GM_getValue('uncheckOnWorkDay')])
    }
  };

})();

