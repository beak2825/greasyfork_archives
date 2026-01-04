// ==UserScript==
// @name         NicoVideoMoreQuality
// @namespace    https://surume.tk/
// @version      0.2
// @description  dmc.nicoの画質がsmileサーバーより悪そうなときはsmileサーバーを利用します。HTML5プレイヤーでのみ動きます
// @author       petitsurume
// @match        http://www.nicovideo.jp/watch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31457/NicoVideoMoreQuality.user.js
// @updateURL https://update.greasyfork.org/scripts/31457/NicoVideoMoreQuality.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Start NicoVideoMoreQuality")
    var info = JSON.parse(document.getElementById("js-initial-watch-data").attributes["data-api-data"].value)
    console.log(info)
    var smileUrl = info.video.smileInfo.url
    if(!info.viewer.isPremium) return console.log("プレミアム会員ではありません")
    console.log("smile server is mp4?", !!~smileUrl.indexOf("?m="))
    console.log("smile server is not low?", !~smileUrl.indexOf("low"))
    if(!(~smileUrl.indexOf("?m=") && !~smileUrl.indexOf("low"))) {
        console.log("dmc.nicoのほうが画質がいい")
        return
    }
    var f = function(){
        var videos = document.getElementsByTagName("video")
        if (videos.length == 0) {
            console.log("<video>がない!!")
            setTimeout(f, 1000)
            return
        }
        var video = videos[0]
        if(video.src == "") {
            console.log("srcがまだ未指定")
            setTimeout(f, 1000)
            return
        }
        if(!~video.src.indexOf("dmc.nico")) {
            console.log("dmc.nicoじゃなかった")
            return
        }
        if(video.readyState != 4) {
            console.log("まだ準備中")
            setTimeout(f, 1000)
            return
        }
        console.log("dmc.nicoなvideo発見")
        console.log("dmc | smile")
        console.log(video.videoWidth,info.video.width)
        console.log(video.videoHeight,info.video.height)
        if(video.videoWidth < info.video.width || video.videoHeight < info.video.height) { // 解像度がこっちのほうが高い
            console.log("smileのほうが画質がいい")
            video.src = smileUrl
            console.log("smileにsrc差し替え")
            /*
            var targetVideos = (localStorage.getItem("surume-userscript-notusedmccache") || "").split(",")
            console.log(targetVideos.indexOf(info.video.id))
            if (~targetVideos.indexOf(info.video.id)) {
                return
            }
            targetVideos.push(info.video.id)
            localStorage.setItem("surume-userscript-notusedmccache", targetVideos.join(","))
            */
        } else {
            console.log("smileのほうが画質が悪い?")
        }
    }
    // 変なログが飛ばないようにlog送信を封じる
    if(!fetch) return console.log("fetch APIがネイティブでサポートされてない...")
    var origFetch = fetch
    fetch = function(url) {
        if(typeof url === "string" && ~url.indexOf("/api/logger.php")) {
            return Promise.reject()
        }
        return origFetch.apply(this, arguments)
    }
    console.log("fetch上書き")
    f()
})();