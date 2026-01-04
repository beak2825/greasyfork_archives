// ==UserScript==
// @name        廣場總遊玩計算腳本 by乾一盅
// @namespace   https://donderhiroba.jp/
// @grant       GM_setValue
// @grant       GM_getValue
// @include     https://donderhiroba.jp/*
// @version     1.0.3
// @author      乾一盅 https://facebook.com/TaikoZhong
// @description 計算指定難易度、歌曲區間的遊玩次數
// @downloadURL https://update.greasyfork.org/scripts/446164/%E5%BB%A3%E5%A0%B4%E7%B8%BD%E9%81%8A%E7%8E%A9%E8%A8%88%E7%AE%97%E8%85%B3%E6%9C%AC%20by%E4%B9%BE%E4%B8%80%E7%9B%85.user.js
// @updateURL https://update.greasyfork.org/scripts/446164/%E5%BB%A3%E5%A0%B4%E7%B8%BD%E9%81%8A%E7%8E%A9%E8%A8%88%E7%AE%97%E8%85%B3%E6%9C%AC%20by%E4%B9%BE%E4%B8%80%E7%9B%85.meta.js
// ==/UserScript==

(function() {





















  //GM_setValue('YiZhong.id', null); //如果想要強制重啟，請將最前面的//去掉，重載後再加回//。
  //document.write('您的總遊玩次數: '+ GM_getValue('YiZhong.playedcount', null)); //強制顯示總遊玩次數，正常情況下不必使用。
  //////////////////////////////變數，僅需變動此區域
    var DefaultLevel = 4; //計算到的最低難度，1梅, 2竹, 3松, 4鬼, 5裏
    var DefaultHighestLevel = 5; //計算到的最高難度，1梅, 2竹, 3松, 4鬼, 5裏
    var songamount = 1200; //從歌曲ID 1開始計算到ID songamount，請自行調整太鼓至最大ID(可以超過，不能少)
  //////////////////////////////變數，僅需變動此區域























    'use strict';
    if(GM_getValue('YiZhong.id') == null){
      if(confirm('您想要開始計算嗎?如否請記得將此腳本關閉。')){
        GM_setValue('YiZhong.level', null);
        GM_setValue('YiZhong.id', null);
        GM_setValue('YiZhong.playedcount', null);
      }
      else{
      GM_setValue('YiZhong.id', songamount);
      }
    }

    if(GM_getValue('YiZhong.id') > songamount){
      window.alert('您的總遊玩次數: ' + GM_getValue('YiZhong.playedcount'));
      if(confirm('您想要重新計算嗎?如否請記得將此腳本關閉。')==true){
        GM_setValue('YiZhong.level', null);
        GM_setValue('YiZhong.id', null);
        GM_setValue('YiZhong.playedcount', null);
        location.reload();
      }
    }

    if(GM_getValue('YiZhong.id') <= songamount){ //太鼓達人ID目前不超過1150
                //初始化
                if(GM_getValue('YiZhong.level')==null || GM_getValue('YiZhong.level')==undefined ){
                  GM_setValue('YiZhong.level', DefaultLevel - 1); //更改起始 變更defaultlevel
                }
                if(GM_getValue('YiZhong.id')==null || GM_getValue('YiZhong.id')==undefined ){
                  GM_setValue('YiZhong.id', 1);
                }
                if(GM_getValue('YiZhong.playedcount')==null || GM_getValue('YiZhong.playedcount')==undefined ){
                  GM_setValue('YiZhong.playedcount', 0);
                }
                //初始化結束


                GM_setValue('YiZhong.level', GM_getValue('YiZhong.level') + 1);

                if(GM_getValue('YiZhong.level') == DefaultHighestLevel + 1){ //更改最高 變更defaulthighestlevel
                   GM_setValue('YiZhong.id', GM_getValue('YiZhong.id') + 1);
                   GM_setValue('YiZhong.level', DefaultLevel); //更改起始 變更defaultlevel
                }

                if(document.getElementsByClassName('stage_cnt').length){
                  var temp=parseInt(document.getElementsByClassName("stage_cnt").item(0).childNodes[3].innerHTML); //總遊玩次數
                  GM_setValue('YiZhong.playedcount', GM_getValue('YiZhong.playedcount') + temp);
                }

                console.log('Played Count: '+ GM_getValue('YiZhong.playedcount'));
                console.log('Song ID: ' + GM_getValue('YiZhong.id'));
                console.log('Level  : ' + GM_getValue('YiZhong.level'));
                window.location.href = "https://donderhiroba.jp/score_detail.php?song_no=" + GM_getValue('YiZhong.id') + "&level=" + GM_getValue('YiZhong.level')
    }

})();
