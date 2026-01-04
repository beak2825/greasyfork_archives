// ==UserScript==
// @name         surviv.io - 難易度、ショートカット
// @name:en      surviv.io - difficulty and shortcut
// @author       にゃんにゃる
// @homepage     https://www1.x-feeder.info/script_test_room/
// @namespace    https://www.x-feeder.info/
// @version      3.1
// @description  広告のブロック、surviv.ioの難易度変更ボタンやのショートカットボタンを追加します。
// @description:en Add ad block, surviv.io's difficulty change button and shortcut button.
// @match http*://*surviv2.io*
// @match http*://*2dbattleroyale.com*
// @match http*://*2dbattleroyale.org*
// @match http*://*piearesquared.info*
// @match http*://*thecircleisclosing.com*
// @match http*://*surviv.io*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375165/survivio%20-%20%E9%9B%A3%E6%98%93%E5%BA%A6%E3%80%81%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/375165/survivio%20-%20%E9%9B%A3%E6%98%93%E5%BA%A6%E3%80%81%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88.meta.js
// ==/UserScript==
(function () {
    'use strict';
    document.getElementById("ad-block-left").innerHTML = "";

    function delAds(eID){
        if (document.getElementById(eID)){
            document.getElementById(eID).remove();
        }
    }
    setInterval(function() {
        delAds("main-med-rect-blocked");
        delAds("surviv-io_300x250");
        delAds("surviv-io_728x90");
        delAds("start-top-left");
        document.getElementById("ad-block-left").getElementsByTagName("script")[0].remove();
    },1000);

    setTimeout(function(){
        let thebaba = document.getElementById("ui-map-wrapper");
        let thecocuk = document.createElement("div");
        thecocuk.innerHTML = '<div id="moji" style="margin-left: 200px; color: black; font-size:30px;">Local Mode Play</div>';
        thebaba.appendChild(thecocuk);
        thebaba.insertBefore(thebaba.firstChild, thecocuk);
    },0);

    function hide(_elm){
        _elm.style.display ='none';
    }

    function show(_elm){
        _elm.style.display ='block';
    }

    var testTimer1;
    function startTimer1(){
        testTimer1=setInterval(function(){
            hide(document.getElementById("ui-map-info"));
            hide(document.getElementById("ui-upper-center"));
            hide(document.getElementById("ui-spec-counter"));
            hide(document.getElementById("ui-bottom-center-1"));
            hide(document.getElementById("ui-bottom-center-2"));
            hide(document.getElementById("ui-lower-center"));
            hide(document.getElementById("ui-team-indicators"));
        }, 500);
    };
    function stopTimer1(){
        clearInterval(testTimer1);
    };

    var testTimer2;
    function startTimer2(){
        testTimer2=setInterval(function(){
            show(document.getElementById("ui-map-info"));
            show(document.getElementById("ui-upper-center"));
            show(document.getElementById("ui-spec-counter"));
            show(document.getElementById("ui-bottom-center-1"));
            show(document.getElementById("ui-bottom-center-2"));
            show(document.getElementById("ui-lower-center"));
            show(document.getElementById("ui-team-indicators"));
        }, 500);
    };
    function stopTimer2(){
        clearInterval(testTimer2);
    };

    function main(){
        hide(document.getElementById("ui-health-counter"));//HPバー
        hide(document.getElementById("ui-current-clip"));//残りの装弾数
        hide(document.getElementById("ui-map-info"));//ガスタイマー
        hide(document.getElementById("ui-leaderboard-alive"));//生存数
        hide(document.getElementById("ui-leaderboard").getElementsByClassName('ui-leaderboard-header')[0]);//生存の文字
        hide(document.getElementById("ui-kill-counter"));//kill数
        hide(document.getElementById("ui-kill-counter-wrapper").getElementsByClassName("ui-kill-counter-header")[0]);//kill数文字
        hide(document.getElementById("ui-top-left"));//teamHP
        hide(document.getElementById("ui-boost-counter"));//アドレナリンバー
        hide(document.getElementById("btn-game-quit"));//試合から撤退ボタン
        hide(document.getElementById("ui-killfeed-contents"));//右上のメッセージ
        hide(document.getElementById("ui-team-indicators"));//チームの居場所
    };

    var LM = document.createElement("button");
    LM.setAttribute("id", "Local_Mode");
    LM.setAttribute("class", "btn-green btn-darken menu-option");
    LM.innerHTML = "Hard Mode：OFF";
    LM.style.color = "blue";
    LM.style.backgroundColor = "white";
    LM.style.borderButtom = "2px solid rgb(96, 96, 96)";
    LM.style.boxShadow = "rgb(96, 96, 96) 0px -2px inset";
    window.myFunc = function () {
        main();
        startTimer1();
        stopTimer2();
        document.getElementById("moji").innerHTML = "Hard Mode Play";
        document.getElementById("moji").style.color = "#FF0000";
        hide(LM);
        show(HM);
        hide(MLM);
        hide(MHM);
    };
    LM.addEventListener('click', window.myFunc);

    function mained(){
        show(document.getElementById("ui-health-counter"));//HPバー
        show(document.getElementById("ui-current-clip"));//残りの装弾数
        show(document.getElementById("ui-map-info"));//がす
        show(document.getElementById("ui-leaderboard-alive"));//生存数
        show(document.getElementById("ui-leaderboard").getElementsByClassName('ui-leaderboard-header')[0]);//生存の文字
        show(document.getElementById("ui-kill-counter"));//kill数
        show(document.getElementById("ui-kill-counter-wrapper").getElementsByClassName("ui-kill-counter-header")[0]);//kill数文字
        show(document.getElementById("ui-top-left"));//teamHP
        document.getElementById("ui-boost-counter").style = "opacity: 0;";//アドレナリンバー
        show(document.getElementById("btn-game-quit"));//試合から撤退ボタン
        show(document.getElementById("ui-killfeed-contents"));//右上のメッセージ
        show(document.getElementById("ui-team-indicators"));//チームの居場所
    };

    var HM = document.createElement("button");
    HM.setAttribute("id", "Hard_Mode");
    HM.setAttribute("class", "btn-green btn-darken menu-option");
    HM.innerHTML = "Hard Mode：ON";
    HM.style.color = "yellow";
    HM.style.backgroundColor = "red";
    HM.style.borderBottom = "2px solid rgb(85, 0, 0)";
    HM.style.boxShadow = "rgb(85, 0, 0) 0px -2px inset";
    window.myFunc = function () {
        mained();
        startTimer2();
        stopTimer1();
        document.getElementById("moji").innerHTML = "Local Mode Play";
        document.getElementById("moji").style.color = "#000000";
        hide(HM);
        show(LM);
        show(MLM);
        hide(MHM);
    };
    HM.addEventListener('click', window.myFunc);

    var MLM = document.createElement("button");
    MLM.setAttribute("id", "MLocal_Mode");
    MLM.setAttribute("class", "btn-green btn-darken menu-option");
    MLM.innerHTML = "Maximum Hard Mode：OFF";
    MLM.style.color = "blue";
    MLM.style.backgroundColor = "white";
    MLM.style.borderButtom = "2px solid rgb(96, 96, 96)";
    MLM.style.boxShadow = "rgb(96, 96, 96) 0px -2px inset";
    window.myFunc = function () {
        document.getElementById("moji").innerHTML = "Maximum Hard Mode Play";
        document.getElementById("moji").style.color = "#FF0000";
        hide(document.getElementById("ui-game"));
        hide(LM);
        hide(HM);
        hide(MLM);
        show(MHM);
    };
    MLM.addEventListener('click', window.myFunc);

    var MHM = document.createElement("button");
    MHM.setAttribute("id", "MHard_Mode");
    MHM.setAttribute("class", "btn-green btn-darken menu-option");
    MHM.innerHTML = "Maximum Hard Mode：ON";
    MHM.style.color = "yellow";
    MHM.style.backgroundColor = "red";
    MHM.style.borderBottom = "2px solid rgb(85, 0, 0)";
    MHM.style.backgroundColor = "red";
    MHM.style.boxShadow = "rgb(85, 0, 0) 0px -2px inset";
    window.myFunc = function () {
        document.getElementById("moji").innerHTML = "Local Mode Play";
        document.getElementById("moji").style.color = "#000000";
        show(document.getElementById("ui-game"));
        show(LM);
        hide(HM);
        show(MLM);
        hide(MHM);
    };
    MHM.addEventListener('click', window.myFunc);

    function DUO(){
        document.getElementById("btn-create-team").click();
        setTimeout(function(){
            document.getElementById("btn-team-queue-mode-1").click();
            document.getElementById("btn-team-fill-none").click();
            document.getElementById("btn-start-team").click();
        },750);
    };

    var DUO_btn = document.createElement("button");
    DUO_btn.setAttribute("id", "solo_duo");
    DUO_btn.setAttribute("class", "btn-green btn-darken menu-option");
    DUO_btn.innerHTML = "solo:duo";
    DUO_btn.style.display = "inline-block";
    DUO_btn.style.width = "50%";
    DUO_btn.style.backgroundColor = "rgb(255, 30, 30)";
    DUO_btn.style.borderBottom = "2px solid rgb(255, 0, 0)";
    DUO_btn.style.boxShadow = "rgb(255, 0, 0) 0px -2px inset";
    window.myFunc = function () {
        DUO();
    };
    DUO_btn.addEventListener('click', window.myFunc);

    function SQUAD(){
        document.getElementById("btn-create-team").click();
        setTimeout(function(){
            document.getElementById("btn-team-queue-mode-2").click();
            document.getElementById("btn-team-fill-none").click();
            document.getElementById("btn-start-team").click();
        },750);
    };

    var SQUAD_btn = document.createElement("button");
    SQUAD_btn.setAttribute("id", "solo_squad");
    SQUAD_btn.setAttribute("class", "btn-green btn-darken menu-option");
    SQUAD_btn.innerHTML = "solo:squad";
    SQUAD_btn.style.display = "inline-block";
    SQUAD_btn.style.width = "50%";
    SQUAD_btn.style.backgroundColor = "rgb(150, 0, 0)";
    SQUAD_btn.style.borderBottom = "2px solid rgb(100, 0, 0)";
    SQUAD_btn.style.boxShadow = "rgb(100, 0, 0) 0px -2px inset";
    window.myFunc = function () {
        SQUAD();
    };
    SQUAD_btn.addEventListener('click', window.myFunc);

    hide(HM);
    hide(MHM);
    hide(document.getElementById("start-bottom-left"));
    hide(document.getElementById("start-bottom-middle"));

    document.getElementById("ad-block-left").append(HM);
    document.getElementById("ad-block-left").append(LM);
    document.getElementById("ad-block-left").append(MHM);
    document.getElementById("ad-block-left").append(MLM);
    document.getElementById("ad-block-left").append(DUO_btn);
    document.getElementById("ad-block-left").append(SQUAD_btn);
})();