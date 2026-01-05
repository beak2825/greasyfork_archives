// ==UserScript==
// @name           ニコニコ動画 自動再生+α
// @description    無料会員でもニコニコ動画で動画を自動再生できるようにします
// @version        0.0.4.2
// @author         nodaguti
// @license        MIT License
// @namespace      http://nodaguti.usamimi.info/
// @include        http://www.nicovideo.jp/watch/*
// @downloadURL https://update.greasyfork.org/scripts/1144/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E8%87%AA%E5%8B%95%E5%86%8D%E7%94%9F%2B%CE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/1144/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E8%87%AA%E5%8B%95%E5%86%8D%E7%94%9F%2B%CE%B1.meta.js
// ==/UserScript==

(function(_window){

//----config----
//自動再生を試行する間隔 (ms)
var INTERVAL = 250;
//----/config----


function playVideo(){
    try{
        if(!_window.WatchApp.namespace.model.player.NicoPlayerConnector.isPrepared)
            return void(setTimeout(arguments.callee, INTERVAL));

        _window.WatchApp.namespace.model.player.NicoPlayerConnector.playVideo();
    }catch(e){
        setTimeout(arguments.callee, INTERVAL);
    }
}

playVideo();

})(unsafeWindow);
