// ==UserScript==
// @name         Netease cloud music controller
// @namespace    https://github.com/superboy724/NeteaseCloudMusicController
// @version      1.0.5
// @description  Chrome global media control support for netease cloud music 
// @author       superboy724
// @match        music.163.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394881/Netease%20cloud%20music%20controller.user.js
// @updateURL https://update.greasyfork.org/scripts/394881/Netease%20cloud%20music%20controller.meta.js
// ==/UserScript==

var NeteaseMusicController = {
    neteaseController : NEJ.P('nm.w').uX2x.fQ8I(),
    prev : function(){
        //网易云上一曲
        this.neteaseController.EB5G()
    },
    next : function(){
        //网易云下一曲
        this.neteaseController.pl1x()
    }
}



function getItemToJson(key){
    return JSON.parse(localStorage.getItem(key))
}

//重写localstorage的setItem方法，给localstorage的内容赋值时进行回调
function overrideLocalStorageSetItem(caller){
    let superMethod = localStorage.setItem
    localStorage.setItem = function(key,value){
        superMethod.apply(this,arguments)
        caller(key)
    }
}

//初始化media session
function registerMediaSession(){
    if ('mediaSession' in navigator){
            navigator.mediaSession.metadata = new MediaMetadata({
            title: '',
            artist: '',
            album: '',
            artwork: []
        })
    } else {
        return false
    }

    //注册“上一曲”按钮
    navigator.mediaSession.setActionHandler('previoustrack', function() {
        NeteaseMusicController.prev()
    });
    //注册“下一曲”按钮
    navigator.mediaSession.setActionHandler('nexttrack', function() {
        NeteaseMusicController.next()
    });

    return true
}

//更新media session元数据
function playlistUpdate(){
    let playersetting = getItemToJson('player-setting')
    let trackInfos = getItemToJson('track-queue')

    if((playersetting && trackInfos) == false){
        console.info("Chrome media control support for netease cloud music:storage is empty")
        return;
    }
    if(trackInfos.length == 0){
        console.info("Chrome media control support for netease cloud music:playlist is empty")
        return;
    }

    let playlistIndex = playersetting.index
    let trackInfo = trackInfos[playlistIndex]
    let artistNames = ''
    let artwork = []

    for(i = 0;i<=trackInfo.artists.length - 1;i++){
        artistNames += i == 0 ? trackInfo.artists[i].name : '/' + trackInfo.artists[i].name
    }
    artwork.push({sizes: "130x130",src:trackInfo.album.picUrl})

    navigator.mediaSession.metadata.title = trackInfo.name
    navigator.mediaSession.metadata.artist = artistNames
    navigator.mediaSession.metadata.album = trackInfo.album.name
    navigator.mediaSession.metadata.artwork = artwork
}

(function() {
    'use strict';

    if(!registerMediaSession()){
        console.error("Chrome media control support for netease cloud music:unsupport")
    }
    overrideLocalStorageSetItem((key)=>{
        //1.网易云换歌时会将当前播放到播放列表的第几曲写入player-setting中，则检测到该key中内容更新时进行mediasession的更新
        //2.当发生播放列表更改时也进行更新
        if(key === 'player-setting' || key === 'track-queue'){
            playlistUpdate()
        }
    })
    //所有内容初始化完毕后给mediasession赋初始值
    playlistUpdate()
})()