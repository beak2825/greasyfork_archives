// ==UserScript==
// @name         碧蓝幻想FPS显示和设置 
// @version      0.1.5
// @description  一切都快起来了，嘻嘻。ob/r 和 od/query 建议拦截嗷
// @author       wdnmd
// @icon         http://game.granbluefantasy.jp/favicon.ico
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @grant        none
// @namespace https://greasyfork.org/users/694822
// @downloadURL https://update.greasyfork.org/scripts/413153/%E7%A2%A7%E8%93%9D%E5%B9%BB%E6%83%B3FPS%E6%98%BE%E7%A4%BA%E5%92%8C%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/413153/%E7%A2%A7%E8%93%9D%E5%B9%BB%E6%83%B3FPS%E6%98%BE%E7%A4%BA%E5%92%8C%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var flag = 0;
    var x;
    var url = window.location.href;
    var game;
    var stage;
    var a1 =setInterval(function(){
        if(url.indexOf("raid")>0){
            if(window.Game && !game ){
                game = window.Game;
                console.log("Game,get")
            }else{
                console.log("Game,notget")
            }
        }
    }, 500);
    var a2 =setInterval(function(){
        if(url.indexOf("raid")>0){
            if(window.stage && !stage){
                stage = window.stage;
                console.log("stage,get")
            }else{
                console.log("stage,notget")
            }
        }
    }, 500);

    var fps = function(a){
        if(createjs){
            if(createjs.Ticker){
                if(url.indexOf("raid")>0){
                    //if(game && game.version != "1602467726"){
                        //alert("版本变了")
                    //}else{
                        if(flag == 0){
                            createjs.Ticker.timingMode = "single"
                        }else{
                            createjs.Ticker.timingMode = "synched"
                        }
                        createjs.Ticker.setFPS(a)
                    //}
                }
            }
        }
    }

    var FPS = {};
    FPS.time = 0;
    FPS.FPS = 0;
    FPS.startFPS = function (stage){
        FPS.shape = new createjs.Shape();
        FPS.shape.graphics.beginFill("#000000").drawRect(350, 50, 100, 30);
        stage.addChild(FPS.shape);
        FPS.txt =new createjs.Text("", "25px Arial", "#ffffff");
        FPS.txt.x = 350;
        FPS.txt.y = 50;
        stage.addChild(FPS.txt);
        createjs.Ticker.addEventListener("tick", FPS.TickerFPS);
    }
    FPS.TickerFPS = function (event)
    {
        FPS.date = new Date();
        FPS.currentTime = FPS.date.getTime();
        if(FPS.time!=0)
        {
            FPS.FPS = Math.ceil(1000/(FPS.currentTime -  FPS.time));
        }
        FPS.time = FPS.currentTime;
        FPS.txt.text = "FPS: "+FPS.FPS;
    }


    document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e.keyCode == 112 && e.ctrlKey) {
            if(flag == 0){
                x =setInterval(function(){
                    fps(60);
                }, 500);
                flag = 1;
                console.log("fps,start")
            }else{
                clearInterval(x)
                fps(30)
                flag = 0;
                console.log("fps,end")
            }
        }
        if (e.keyCode == 113 && e.ctrlKey) {
            if(stage){
                FPS.startFPS(stage);
                console.log("FPS,show")
            }
        }
    };

    var a3 =setInterval(function(){
        if(url.indexOf("raid")>0){
            if(stage  && !FPS.txt){
                FPS.startFPS(stage);
                console.log("FPS,show")
            }
        }
    }, 500);

    var a5 =setInterval(function(){
        url = window.location.href;
    }, 500);
}());