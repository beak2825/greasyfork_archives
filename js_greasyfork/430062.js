// ==UserScript==
// @name        動畫瘋-影片播放速度
// @namespace   Violentmonkey Scripts
// @match       https://ani.gamer.com.tw/animeVideo.php*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.6
// @author      bigiCrab
// @description 影片播放速度
// @downloadURL https://update.greasyfork.org/scripts/430062/%E5%8B%95%E7%95%AB%E7%98%8B-%E5%BD%B1%E7%89%87%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/430062/%E5%8B%95%E7%95%AB%E7%98%8B-%E5%BD%B1%E7%89%87%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.meta.js
// ==/UserScript==

/*
feature:
1. 自動使用上次的撥放速度
2. 滑鼠在影片上時，(ctrl或shift)+滾輪調整撥放速度(0.1~16)
3. 指標在右下撥放速度按鈕時，可以使用滾輪調整撥放速度
4. 點擊右下播放速度按鈕，將速度設為1x
 */
let console = null;
function makeLocalConsole(_ogConsole,_preFix){
    let console = {};
    for(let i in _ogConsole){
        console[i] = function(){_ogConsole[i].call(this, _preFix, ...arguments)}
    }
    return console;
}

// 存速度key值
const VIDEO_PLAYBACK_RATE = "bigi_videoPlayBackRate";
// videojs 載很慢
$(window.unsafeWindow).load(() => {
    console = makeLocalConsole(window.console,"😂playback😂");
    main();
});
async function main() {
    //   等到videojs 出現
    /* 改版了這邊沒用了
    while (window.unsafeWindow?.videojs === undefined) {
        console.error("video element not found");
        await sleep(500);
    }
    */
    let ani_video;
    //   等到video出現
    do{
        ani_video = $('video-js')[0]?.player;
        // TODO 找他的API
        console.log("video js: ", ani_video);
        await sleep(500);
    } while(ani_video === undefined)
    // test_trackAllEvent();

    loadAndTrackSavePlayRate();

    scrollToAdjustSpeed();

    function loadAndTrackSavePlayRate() {
        ani_video.on("playing", (e) => {
            if (ani_video.currentSrc().includes("gamer_ad")) {
                console.log("廣告中 不加速");
                ani_video.playbackRate(1);
                return;
            }
            //   apply play rate
            var lastTimePlayBackRate = GM_getValue(VIDEO_PLAYBACK_RATE, null);
            if (lastTimePlayBackRate !== null) {
                console.log(`設定為上次的撥放速度:${lastTimePlayBackRate}`);
                ani_video.playbackRate(lastTimePlayBackRate);
            }
        });
        //   save play rate
        ani_video.on("ratechange", (e) => {
            let newestRate = ani_video.playbackRate();
            console.log(`撥放速度變動..存起來:${newestRate}`);
            GM_setValue(VIDEO_PLAYBACK_RATE, newestRate);
        });
    }

    function scrollToAdjustSpeed() {
        const speedStap = 0.1;
        // 影片上用 (ctrl||shift)+wheel
        $("video").on("wheel", (event) => {
            if (event.shiftKey || event.ctrlKey) {
                event.preventDefault();
                // console.log("shift捲動", event.originalEvent);
                handleWheelEventPlaybackRate(event);
            }
        });
        // 指標在playbackRate時可以用滾輪調整
        let playEle = ani_video?.controlBar
        ?.getChildById("controlBarR")
        ?.getChildById("playbackRateMenuButton")?.el_;
        $(playEle).on("wheel", (event) => {
            event.preventDefault();
            handleWheelEventPlaybackRate(event);
        });
        $(playEle).on("click", (event) => {
            event.preventDefault();
            ani_video.playbackRate(1);
        });

        function handleWheelEventPlaybackRate(event) {
            let speedVector = event.originalEvent.deltaY < 0 ? 1 : -1;
            let newestRate = ani_video.playbackRate();
            let calcSpeed =
                Math.round((newestRate + speedVector * speedStap) * 100) / 100;
            calcSpeed = Math.min(Math.max(0.1, calcSpeed), 16);
            ani_video.playbackRate(calcSpeed);
        }
    }

    // 看videojs有甚麼狀態可用
    function test_trackAllEvent() {
        //   找到的都在上面
        let events = [
            "subtitles",
            "captions",
            "descriptions",
            "chapters",
            "metadata",
            "none",
            "metadata",
            "auto",
            "alternative",
            "captions",
            "descriptions",
            "main",
            "main-desc",
            "sign",
            "subtitles",
            "translation",
            "commentary",
            "onchange",
            "onaddtrack",
            "onremovetrack",
            "onchange",
            "onaddtrack",
            "onremovetrack",
            "oncuechange",
            "onenter",
            "onexit",
            "loadstart",
            // "progress",
            "suspend",
            "abort",
            "error",
            "emptied",
            "stalled",
            "loadedmetadata",
            "loadeddata",
            "canplay",
            "canplaythrough",
            "playing",
            "waiting",
            "seeking",
            "seeked",
            "ended",
            "durationchange",
            // "timeupdate",
            "play",
            "pause",
            "ratechange",
            "resize",
            "volumechange",
            "error",
            "change",
            "addtrack",
            "removetrack",
            "cuechange",
            "error",
            "load",
            "enter",
            "exit",
        ];
        ani_video.on(events, (e) => {
            console.log(e);
        });
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
