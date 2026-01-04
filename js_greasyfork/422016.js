// ==UserScript==
// @name         ニコニコ動画紹介スキップ
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Skips Intro Movie!
// @author       ouninnoran
// @match        https://www.nicovideo.jp/video_top
// @match        https://www.nicovideo.jp/video_top?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422016/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E7%B4%B9%E4%BB%8B%E3%82%B9%E3%82%AD%E3%83%83%E3%83%97.user.js
// @updateURL https://update.greasyfork.org/scripts/422016/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%E7%B4%B9%E4%BB%8B%E3%82%B9%E3%82%AD%E3%83%83%E3%83%97.meta.js
// ==/UserScript==

(function() {
    var interval = setInterval(TMPVideoIntro,10/1000);
    var clickSave = false;
    var id = "TMP_VideoIntro_Next";
    var FC = "TMP_Next_false";
    var TC = "TMP_Next_true";
    function TMPVideoIntro(){
        var VE = VSearch();
        if(VE.length <= 0)return;//ビデオ要素がロードされていない場合は処理を終了する。
        VE = VE[0];
        clearInterval(interval);
        //
        //ボタンを作成し挿入する。
        //
        var button = document.createElement("input");
        button.type = "button"; button.id = id; button.value = "▶▶|";button.classList = FC;
        VE.after(button);
        //
        //ボタンイベントを追加する。
        //
        var event = document.getElementById(id);
        clickSave = false;
        event.addEventListener("click",function(e){
            var VE = VSearch()[0];
            if(VE.currentTime < 1.5)return;
            VE.currentTime = Math.floor(VE.duration);
            setTimeout(function(){var VE = VSearch()[0];if(VE.paused)VE.play();},500)
        })
        //
        //動画の再生状況を確認する
        //
        setInterval(function(){
            var VE = VSearch()[0];
            var button = document.getElementById(id);
            var bool = button.className.indexOf(FC);
            var CL = button.classList
            if(VE.currentTime < 1.5 && bool === -1){CL.add(FC);CL.remove(TC);}
            else if(VE.currentTime >= 1.5 && bool !== -1){CL.remove(FC);CL.add(TC);}
        },10/1000)
    }
    function VSearch(){
        return document.getElementsByTagName("video")
    }
    //
    //ボタンスタイルを追加する
    //
    var style = document.createElement("style");
    var ST = [
        "#TMP_VideoIntro_Next{",
            "z-index:10; position:absolute; right:10px; top:10px; padding:9px;padding-right:14px;",
            "font-size:22px; letter-spacing:-5px;border:2px solid white; border-radius:3px;",
            "color:#ffffff;}",
        ".TMP_Next_true{background-color:#0080ff;}",
        ".TMP_Next_false{background-color:grey;}",
        ".TMP_Next_true:active{background-color:#fee602c2}"
    ];
    style.innerHTML = ST.join("\n");
    document.body.appendChild(style);
})();