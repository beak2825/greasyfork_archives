// ==UserScript==
// @name         YaMusic media buttons
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  add prev and next media buttons
// @author       lexxter
// @match        https://music.yandex.ru/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/443334/YaMusic%20media%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/443334/YaMusic%20media%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
const externalAPIP = new Promise((r)=>{
 const interval =setInterval(()=>{
        if(window.externalAPI && window.externalAPI.on){
            clearInterval(interval)
           r(window.externalAPI)
        }
    },60)
})



externalAPIP.then((externalAPI)=>{
    const getMetaData=(tr)=>new MediaMetadata({
        title: tr.title,
        artist: tr.artists.map((art)=>art.title).join(", "),
        album: tr.album.title,
        artwork:[{src:`https://${tr.cover.replace("%%","200x200")}`,sizes:"200x200",type:"image/png"}]
    })


     externalAPI.on(externalAPI.EVENT_READY,()=>{
                navigator.mediaSession.setActionHandler('previoustrack', function() {
                    const track = externalAPI.getPrevTrack();
                    navigator.mediaSession.metadata=getMetaData(track)
                    externalAPI.prev();
                });
                navigator.mediaSession.setActionHandler('nexttrack',function() {
                    const track = externalAPI.getNextTrack();
                    navigator.mediaSession.metadata=getMetaData(track)
                    externalAPI.next()
                });
                navigator.mediaSession.setActionHandler('pause', function() {
                    const track = externalAPI.getCurrentTrack();
                    navigator.mediaSession.metadata=getMetaData(track)
                    externalAPI.togglePause()
                })
            })
})

})();