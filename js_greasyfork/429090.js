// ==UserScript==
// @name        ABEMA VIDEO NextInfoCloser
// @description ABEMA VIDEOコンテンツの次の話に自動で飛ぶメニューを一度だけ閉じます。 TEST
// @namespace https://greasyfork.org/users/716748
// @match       https://abema.tv/video/*
// @grant       none
// @version     1.0.3
// @author      ykhr.m
// @downloadURL https://update.greasyfork.org/scripts/429090/ABEMA%20VIDEO%20NextInfoCloser.user.js
// @updateURL https://update.greasyfork.org/scripts/429090/ABEMA%20VIDEO%20NextInfoCloser.meta.js
// ==/UserScript==

//com-vod-VODNextProgramInfo com-vod-VODNextProgramInfo--is-show

const PERMISSION_CNT = 1; //閉じるを許可する回数
const closeBtnQueryStr = '.com-vod-VODPlayerNextContentRecommendBase__cancel-button';

function main(){
  const nextInfo = document.querySelector(".com-vod-VODPlayerNextContentRecommendBase");
  const nextinfoClassnameOnShow = 'com-vod-VODPlayerNextContentRecommendBase--is-show';
  const closebuttonnextInfo = document.querySelector(closeBtnQueryStr);
  let cnt_click = 0; //回数制限のためのカウンター
  nextInfo.addEventListener('transitionrun', function() {
    if(cnt_click < PERMISSION_CNT && nextInfo.classList.contains(nextinfoClassnameOnShow)){
      nextInfo.classList.remove(nextinfoClassnameOnShow);
      closebuttonnextInfo.click();
//      document.title = `click. ${cnt_click}`;
      cnt_click++;
    }
  });
}

function ini(){
  let obs_cnt = 0;
  let obs = setInterval(function(){
    if(document.querySelector(closeBtnQueryStr)){
      clearInterval(obs);
      main();
    };
    if(obs_cnt >= 20){
      clearInterval(obs);
    }
    obs_cnt++;
  }, 1000);
}

//他のページから変遷した場合にgreasemonkeyが実行されないために変遷したかを確認して初期化する
let oldhref = document.location.href;
function confirmURL(){
  if(oldhref != document.location.href) {
    oldhref = document.location.href;
    ini();    
  }
}

ini();
setInterval(confirmURL, 10000);
