// ==UserScript==
// @name        Donderhiroba Total Played Counting Script byYiZhong
// @namespace   https://donderhiroba.jp/
// @grant       GM_setValue
// @grant       GM_getValue
// @include     https://donderhiroba.jp/*
// @version     1.0.2
// @author      YiZhong https://facebook.com/TaikoZhong
// @description Counts how many time you've played taiko AC.
// @downloadURL https://update.greasyfork.org/scripts/446287/Donderhiroba%20Total%20Played%20Counting%20Script%20byYiZhong.user.js
// @updateURL https://update.greasyfork.org/scripts/446287/Donderhiroba%20Total%20Played%20Counting%20Script%20byYiZhong.meta.js
// ==/UserScript==

(function() {





















  //GM_setValue('YiZhong.id', null); //If you want to force restart, please remove // and refresh hiroba, and then put these // back.
  //document.write('Your total play count (one song per number): '+ GM_getValue('YiZhong.playedcount', null)); //Force show total play count, normally it won't be used, please remove // and refresh hiroba, and then put these // back.
  //////////////////////////////Variable
    var DefaultLevel = 4; //Start counting from level...，1 easy, 2 normal, 3 hard, 4 oni, 5 ura
    var DefaultHighestLevel = 5; //End counting on level...，1 easy, 2 normal, 3 hard, 4 oni, 5 ura
    var songamount = 1150; //Starts from ID 1 to ID songamount, please change to largest taiko song id (it's okay to be higher).
  //////////////////////////////Variable























    'use strict';
    if(GM_getValue('YiZhong.id') == null){
      if(confirm('Start counting now? If no, please pause the script.')){
        GM_setValue('YiZhong.level', null);
        GM_setValue('YiZhong.id', null);
        GM_setValue('YiZhong.playedcount', null);
      }
      else{
      GM_setValue('YiZhong.id', songamount);
      }
    }

    if(GM_getValue('YiZhong.id') > songamount){
      window.alert('Your total play count (one song per number): ' + GM_getValue('YiZhong.playedcount'));
      if(confirm('Start recounting now? If no, please pause the script.')==true){
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
