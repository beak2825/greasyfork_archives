// ==UserScript==
// @name          ひだまりラジオの孫の手
// @namespace    http://tampermonkey.net/
// @version      0.52
// @description  ひだまりラジオを超快適に聞けるUserscript
// @author       ikakonbu
// ここのrequire文に@マーク入れてね！
//require   https://www.aniplex.co.jp/hidamariradio/assets/js/js-player-module-brightcove.aniplex.js
//require   https://players.brightcove.net/4929511769001/S1paQN7v_default/index.min.js
// @match        https://www.aniplex.co.jp/hidamariradio/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420685/%E3%81%B2%E3%81%A0%E3%81%BE%E3%82%8A%E3%83%A9%E3%82%B8%E3%82%AA%E3%81%AE%E5%AD%AB%E3%81%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/420685/%E3%81%B2%E3%81%A0%E3%81%BE%E3%82%8A%E3%83%A9%E3%82%B8%E3%82%AA%E3%81%AE%E5%AD%AB%E3%81%AE%E6%89%8B.meta.js
// ==/UserScript==

(function() {

    var time = null;　//現在再生してる回
    var search = ""; //ゲストモードで対象となるゲスト名を入れるとこ
    var guestmode=0; //ゲストモードのon/off
    var h1; //ボタン要素格納用
    var h2; //ゲスト要素格納用
    var h3; //ゲスト要素格納用
    var v = videojs.players.brightcovePlayer_player;

    var skip10s = function(){
        var skiptime = v.cache_.currentTime + 10;
        if(v.cache_.duration-1 > skiptime){
            v.currentTime(skiptime);
        } else if(v.cache_.duration > skiptime){
             v.currentTime(v.cache_.duration-1);
        }
    }

      var back10s = function(){
        var skiptime = v.cache_.currentTime - 10;
        if(skiptime > 0){
            v.currentTime(skiptime);
        }
    }

    var skip = function(){
        if(time==null){
            h1 = document.getElementsByClassName('play_btn')[0];
            time=0;
        }else{
            time = time+1;
               if(time > 65) {
                   time=0;
               }
            h1 = document.getElementsByClassName('play_btn')[time];
        }
        h1.click();
        h1.scrollIntoView({behavior: 'smooth'});
    }

    var skipmizu = function(){
        var count=0;
        while(count < 65){
            if(time!=null) {
                time++;
            }else{
                time=0;
            }
            if(time > 65){
                time=0;
            }
            h2 = document.getElementsByClassName("inner")[time];
            h3 = h2.innerText;
            if(h3.indexOf(search) != -1){
                break;
            }
            count++;
        }
        if(h3.indexOf(search) == -1){
            alert("入力されたユーザ名の出演作品はありませんでした。通常再生に戻ります。");
            guestmode=0;
        }else{
            h1 = document.getElementsByClassName("inner")[time].getElementsByClassName("play_btn")[0];
          　h1.click();
            h1.scrollIntoView({behavior: 'smooth'});
        }
    }

    var back = function(){
        if(time==null){
            h1 = document.getElementsByClassName('play_btn')[65];
            time=65;
        }else{
        time = time-1;
        if(time < 0) {
            time = 65;
        }
        h1 = document.getElementsByClassName('play_btn')[time];
        h1.click();
        h1.scrollIntoView({behavior: 'smooth'});
        }
    }

    var backmizu = function(){
        while(1){
            time--;
            if(time < 0){
                time=65;
            }
            h2 = document.getElementsByClassName("inner")[time];
            h3 = h2.innerText;
            if(h3.indexOf(search) != -1){
                break;
            }
        }
        var h1 = document.getElementsByClassName("inner")[time].getElementsByClassName("play_btn")[0];
        h1.click();
        h1.scrollIntoView({behavior: 'smooth'});
        if(time < 0){
            time=65;
        }
    }

    document.onkeydown = function (e){
        if(e.keyCode == 39){
            if(guestmode==0) skip();
            else skipmizu();
            return false;

        }else if(e.keyCode == 37){
            if(guestmode==0) back();
            else backmizu();
            return false;

        }else if(e.keyCode == 38){
            search = window.prompt("対象ゲストを入力してください", "蒼樹うめ");
            if(search!=null){
                alert(search + "さんの出演回のみ再生します。通常再生に戻る場合は「↓」キーを押してください");
                guestmode=1;
                if(time > 65) time=0;
                skipmizu();
            }

        }else if(e.keyCode == 40 && guestmode==1){
            alert("通常再生モードに戻りました。");
            time--;
            if(time < 0) time=65;
            guestmode=0;
            return false;
        }else if(e.keyCode== 76){
            skip10s();
        }else if(e.keyCode== 74){
            back10s();
        }
    };
   window.onload = function(){
       var check;
       var num, di;
       if(localStorage.getItem("number") != "null"){
           num = Number(localStorage.getItem("number"));
           di = Number(localStorage.getItem("duration"));
            check = window.confirm("前回の続きから聞く？\n" + document.getElementsByClassName('play_btn')[num].offsetParent.innerText.split("\n")[0] + "  " + Math.floor(di /60) + "分" + String(Math.round(di%60)) + "秒あたり");
            if(check) {
                setTimeout(function(){
                    seeklast(num,di);
                    setTimeout(function(){
                        setInterval(mainloop,800);
                    }, 3000);
                }, 500);
             } else {
                 setTimeout(function(){
                     setInterval(mainloop,800);
                 }, 100);
             }
        } else {
            setInterval(mainloop,800);
        }
   }
   function seeklast(number, iti) {
       v.muted(false);
                    time = number;
                    h1 = document.getElementsByClassName('play_btn')[time];
                    h1.click();
            setTimeout(function(){
                    v.currentTime(iti);
                setTimeout(function(){
                    v.player_.play();
                }, 200);
            }, 1000);

     }
    var mainloop = function(){
        //連続再生の実装(総再生時間と現在の時間を見て同じならskipコマンド発火)
        var displaytime = document.getElementsByClassName('display_time')[0].innerHTML;
       if(displaytime.slice(0, -6) == displaytime.slice(-5) && displaytime.length == 11){
           if(guestmode==0) skip();
           else skipmizu();
       }
        //キャッシュ書き込み(次回開いたときに「続きから再生」実装用)
        if(v.paused() == false){
          localStorage.setItem("number",time);
          localStorage.setItem("duration",String(v.cache_.currentTime));
        }

        var nowplayingid =null;
        if(time != null) {
            nowplayingid = document.getElementsByClassName('play_btn')[time].offsetParent.getElementsByTagName("p")[0].dataset.pmbId;
        }
        //ユーザ操作で別トラックが再生されたときは検知して現在位置を自動で取得
        if(v.paused() == false && nowplayingid != v.mediainfo.id){
            for(var i = 0; i < 65; i++){
                if(document.getElementsByClassName('play_btn')[i].offsetParent.getElementsByTagName("p")[0].dataset.pmbId == v.mediainfo.id){
                    time = i;
                }
            }
        }
    }
})();