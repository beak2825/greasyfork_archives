// ==UserScript==
// @name         GYAO キーコントロール SCRIPT Version 2
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  Gyao shortcut key control script
// @author       ouninnoran
// @match        https://gyao.yahoo.co.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.co.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415074/GYAO%20%E3%82%AD%E3%83%BC%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB%20SCRIPT%20Version%202.user.js
// @updateURL https://update.greasyfork.org/scripts/415074/GYAO%20%E3%82%AD%E3%83%BC%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB%20SCRIPT%20Version%202.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = {
        foucs:[86,false,false],
        playB:[37,false,false],
        playF:[39,false,false],
        rateB:[37,true,false],
        rateF:[39,true,false],
        volP:[38,false,false],
        volM:[40,false,false],
        play0:[37,false,true],
        play100:[39,false,true]
    }
    var rotate = 100
    var checkTime = 3000 / rotate
    var buttonS = [".vjs-setting-container-playback-rate",".vjs-setting-container-buttons"]
    var scriptionItem = [
        "container-video-grid-item-sidebar",//target element class name
        "Gyao-keyControl-Scription",//place element zone
        [//texts
            "",
        ]
    ]
    var selectRate = ".is-selected"
    var audioval = 0.1; // 音声 1未満
    var BFval = 5; // 動画飛ばし
    var LSs = "gyao.player.speed"
    var pb = [-1,1]
    var timeout = [0,rotate*10]
    function keydisable(e){
        e.preventDefault()
    }
    function isfocus(){
        var v = document.querySelector("Video")
        console.log(["VideoElement focus",document.activeElement == v])
        if(!v)return false
        if(document.activeElement != v)return false
        return true
    }
    function videoControler(c){
        var v = document.querySelector("Video")
        var d = 0
        if(!isfocus())return false
        var time = v.currentTime
        if(c == "F")d = time + (BFval)
        if(c == "B")d = time + (BFval * -1)
        if(c == "0")d = 0
        if(c == "100")d = v.duration
        v.currentTime = d
        var vc = v.currentTime
        console.log("Current time " + String((vc / 3600).toFixed()) + ":" + String((vc / 60 % 60).toFixed()) + ":" + String((vc % 60).toFixed()))
    }
    function audioControl(c){
        var v = document.querySelector("video")
        var a = 0
        if(!isfocus())return false
        if(c=="P")a = audioval
        if(c=="M")a = audioval * -1
        var va = v.volume + a
        if(va > 1.0)va = 1.0
        else if(va < 0.0)va = 0.0
        va = va.toFixed(1)
        console.log(va)
        v.volume = va
    }
    function videofocus(){
        var v = document.querySelector("video")
        if(!v)return false
        console.log("focus")
        v.focus()
    }
    function clickRate(c,n=[,]){
        if(!isfocus() && c != "WL")return false
        var key = document.querySelector(n[0]).querySelectorAll(n[1])
        if(key.length == 0) return false
        if(c == "WL" && LSs in window.localStorage)pb[1] = Number(window.localStorage[LSs])
        if(c == "F") pb[1] = ( pb[1] + 1 ) % key.length;
        if(c == "B") pb[1]--;
        if(pb[1] < 0) pb[1] = pb[0] + pb[1]
        var k = pb[1]
        window.localStorage[LSs] = k
        console.log(['speed',k,key[k].getAttribute("data-value")])
        key[k].click()
    }
    function loadkey(n=["","",""]){
        var knull = document.querySelector(n[0])
        timeout[0]++;
        if(timeout[0] > timeout[1]){console.log("calling Key control time out");return false}
        if(knull == null){
            setTimeout(function(){loadkey(buttonS)},checkTime)
            return false
        }
        var key = document.querySelector(n[0]).querySelectorAll(n[1])
        var video = document.querySelector("video")
        if(video != null && key.length>0){
            pb[0] = key.length
            var e = null
            console.log("Key control connect success")
            window.addEventListener( "keydown" , function(e){
                var b = [e.keyCode,e.shiftKey,e.ctrlKey]
                if(b[1] == true){
                    switch(b[0]){
                        case button.rateB[0]:e.preventDefault();clickRate("B",buttonS);break;
                        case button.rateF[0]:e.preventDefault();clickRate("F",buttonS);break;
                        case button.volP[0]:e.preventDefault();audioControl("P");break;
                        case button.volM[0]:e.preventDefault();audioControl("M");break;
                    }
                }
                else if(b[2] == true){
                    switch(b[0]){
                        case button.play0[0]:e.preventDefault();videoControler("0");break;
                        case button.play100[0]:e.preventDefault();videoControler("100");break;
                    }
                }
                else{
                    switch(b[0]){
                        case button.foucs[0]:e.preventDefault();videofocus();break;
                        case button.playB[0]:e.preventDefault();videoControler("B");break;
                        case button.playF[0]:e.preventDefault();videoControler("F");break;
                    }
                }
            })
        }
        else setTimeout(function(){loadkey(buttonS)},checkTime)
    }
    function StartVideo(){
        var v = document.querySelector("video")
        timeout[0]++;
        if(v == null)setTimeout(StartVideo,checkTime*10)
        else if(!v.played)setTimeout(StartVideo,checkTime*10)
        else if(v.played.length == 0)setTimeout(StartVideo,checkTime*10)
        else clickRate("WL",buttonS)
        if(timeout[0] > timeout[1])console.log('this page is video none')
    }
    window.addEventListener('load',function(){
        loadkey(buttonS)
        StartVideo()
    })
})();