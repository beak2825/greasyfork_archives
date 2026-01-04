// ==UserScript==
// @name         AudioStation support the MediaSession API
// @name:en      AudioStation support the MediaSession API
// @name:zh      AudioStation的MediaSession API支持
// @namespace    https://greasyfork.org/en/users/1434718-ot0kaz4
// @version      1.0
// @description  让AudioStation支持系统级别的媒体控制（上一首、下一首、暂停/播放）
// @description:en  Make AudioStation support system-level media control (Previous, Next, Pause/Play)
// @description:zh  让AudioStation支持系统级别的媒体控制（上一首、下一首、暂停/播放）
// @homepageURL  https://otokaze.me
// @license MIT
// @author       otokaze.me
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/526802/AudioStation%20support%20the%20MediaSession%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/526802/AudioStation%20support%20the%20MediaSession%20API.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("配置AudioStation域名", function(){
        let domains = prompt("配置AudioStation域名（多个用逗号隔开）")
        if (domains){
            GM_setValue("allowedDomains", domains.split(','))
        }
    })
    let allowedDomains = GM_getValue("allowedDomains", []);
    const currentDomain = window.location.hostname;
    const isAllowed = allowedDomains.some(domain => currentDomain.endsWith(domain));
    if (!isAllowed) {
        console.log("当前域名未在白名单内，脚本不会执行。");
        return;
    }
    console.log("✅ 脚本已启用！当前站点：" + currentDomain);

    setInterval(function() {
        if (!navigator.mediaSession) {
            return
        }
        var main = SYNO?.SDS?.AudioStation?.Window?.getPanelScope("SYNO.SDS.AudioStation.Main")
        if (!main) {
            return
        }
        navigator.mediaSession.metadata = new MediaMetadata({
            title: main.playerPanel.Ctrl.getCurrentTitle(),
            artist: main.playerPanel.Ctrl.getCurrentArtist(),
            album: main.playerPanel.Ctrl.getCurrentAlbum(),
            artwork: [{
                src: main.playerPanel.Ctrl.getCurrentCover(),
                // sizes: "480x480",
                // type: "image/jpeg",
            }],
        });
        navigator.mediaSession.setActionHandler('play', function() {
            main.audioPlayer.doPlay();
        });
        navigator.mediaSession.setActionHandler('pause', function() {
            main.audioPlayer.doPlay();
        });
        navigator.mediaSession.setActionHandler('previoustrack', function() {
            main.audioPlayer.doPrevious();
        });
        navigator.mediaSession.setActionHandler('nexttrack', function() {
            main.audioPlayer.doNext();
        });
    },1000)
})();
