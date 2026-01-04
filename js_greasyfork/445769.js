// ==UserScript==
// @name         Emby-PotPlayer本地播放的最佳方式
// @description  emby web调用potplayer播放本地的视频，纯本地播放，不走网络流媒体
// @version      1.03
// @grant        none
// @include      http*://*/web/*
// @author       zhanaa
// @namespace    https://greasyfork.org/users/753082
// @downloadURL https://update.greasyfork.org/scripts/445769/Emby-PotPlayer%E6%9C%AC%E5%9C%B0%E6%92%AD%E6%94%BE%E7%9A%84%E6%9C%80%E4%BD%B3%E6%96%B9%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/445769/Emby-PotPlayer%E6%9C%AC%E5%9C%B0%E6%92%AD%E6%94%BE%E7%9A%84%E6%9C%80%E4%BD%B3%E6%96%B9%E5%BC%8F.meta.js
// ==/UserScript==
(async function() {
    'use strict';
    while (!window.require || !window.ConnectionManager) await new Promise(resolve => setTimeout(resolve, 500));
    window.require(['pluginManager'], (pluginManager) => pluginManager.register(new EmbyPot()));
})();
class EmbyPot{
    constructor(){
        this.name = 'Pot Player'; this.type = 'mediaplayer'; this.id = 'potplayer';
        for (var cc of ['currentTime','volume', 'currentSrc', 'isMuted', 'paused']) this[cc] = function(){};
    }
    async getDeviceProfile(a,b){return null};
    canPlayItem(){return true};
    canPlayMediaType(a){return (a || '').toLowerCase() === 'video'};
    async stop() {}
    async play(a,b){window.location.href = `emby://${a.mediaSource.Path}`};
 };