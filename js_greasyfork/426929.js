// ==UserScript==
// @name        Keep 9anime Player speed
// @namespace   henrik9999
// @match       https://vidstreamz.online/embed/*
// @match       https://vidstream.pro/embed/*
// @match       https://mcloud.to/embed/*
// @match       https://streamtape.com/e/*
// @match       https://www.mp4upload.com/embed*
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       unsafeWindow
// @run-at      document-idle
// @version     1.9
// @description Keep the Player speed on some players
// @downloadURL https://update.greasyfork.org/scripts/426929/Keep%209anime%20Player%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/426929/Keep%209anime%20Player%20speed.meta.js
// ==/UserScript==
console.log("aaaaaaaaaa")
 
const api = {};
 
if (typeof GM_setValue !== 'undefined') {
    api.GM_setValue = GM_setValue;
} else if (
    typeof GM !== 'undefined' &&
    typeof GM.setValue !== 'undefined'
) {
    api.GM_setValue = GM.setValue;
}
 
if (typeof GM_getValue !== 'undefined') {
    api.GM_getValue = GM_getValue;
} else if (
    typeof GM !== 'undefined' &&
    typeof GM.getValue !== 'undefined'
) {
    api.GM_getValue = GM.getValue;
}
 
 
 
async function start() {
    let speed = await api.GM_getValue("speed")
 
    waitUntilTrue(function() {
            return typeof unsafeWindow.jwplayer === 'function' && typeof unsafeWindow.jwplayer().on === 'function'
        },
        function() {
            unsafeWindow.jwplayer().on('play', async function(data) {
              if (speed) {
                  console.log("set jwplayer speed to", speed)
                  unsafeWindow.jwplayer().setPlaybackRate(speed)
              }
            })
 
            unsafeWindow.jwplayer().on('playbackRateChanged', async function(data) {
                console.log("jwplayer playback change")
                await api.GM_setValue("speed", data.playbackRate)
                speed = data.playbackRate
            })
        })
 
    document.addEventListener('playing', async (event) => {
        if (speed && event && event.detail && event.detail.plyr) {
            const player = event.detail.plyr;
            console.log("set plyr speed to", speed)
            player.speed = speed;
 
        }
    });
 
    document.addEventListener('ratechange', async (event) => {
        if (event && event.detail && event.detail.plyr) {
            console.log("plyr playback change")
            const player = event.detail.plyr;
            await api.GM_setValue("speed", player.speed)
            speed = player.speed
        }
    });
 
 
    waitUntilTrue(function() {
            return typeof unsafeWindow.videojs === 'function'
        },
        function() {
 
            for (var first in unsafeWindow.videojs.getPlayers()) {
                const player = videojs.players[first];
                player.on('play', function() {
                    if (speed) {
                        console.log("set videojs speed to", speed)
                        player.playbackRate(speed)
                    }
                });
 
                player.on('ratechange', async function() {
                    console.log("videojs playback change")
                    await api.GM_setValue("speed", player.playbackRate())
                    speed = player.playbackRate()
                });
                break;
            }
        })
 
 
}
 
 
 
function waitUntilTrue(condition, callback, interval = 100) {
    const intervalId = setInterval(function() {
        if (condition()) {
            clearInterval(intervalId);
            callback();
        }
    }, interval);
 
    return intervalId;
}
 
start();