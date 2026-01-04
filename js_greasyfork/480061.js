// ==UserScript==
// @license MIT
// @name         巴哈姆特動畫瘋 - 自動設定播放速度
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在動畫瘋開啟時，自動選擇播放速度
// @author       musingfox
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant        GM_registerMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/480061/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%20-%20%E8%87%AA%E5%8B%95%E8%A8%AD%E5%AE%9A%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/480061/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8B%20-%20%E8%87%AA%E5%8B%95%E8%A8%AD%E5%AE%9A%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.meta.js
// ==/UserScript==

(async function() {
    let speed = await GM.getValue("speed");
    if (speed == undefined) {
        speed = 4;
        GM.setValue('speed', speed);
    }
    let speedOptions = [
        '2x',
        '1.75x',
        '1.5x',
        '1.25x',
        '1x', // default
        '0.75x',
        '0.5x'
    ];

    for (let i = 0; i < speedOptions.length; i++) {
        let text = speedOptions[i];
        let index = i;
        GM_registerMenuCommand(text, () => triggerSpeed(index));
    }

    function triggerSpeed(s) {
        speed = s;
		GM.setValue('speed', speed);
        autoPlayBackSpeed();
	}

    window.addEventListener('load', init());

    function init() {
        setTimeout(() => autoPlayBackSpeed(), 5000);
    }

    function autoPlayBackSpeed() {
        let retry = 5;
        while (retry != 0) {
            retry--;
            let list = document.querySelector("#ani_video > div.vjs-control-bar > div.control-bar-rightbtn > div.vjs-playback-rate.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button.menu-button-opacity-animetion > div.vjs-menu > ul")
            if (list) {
                let speedOptions = list.querySelectorAll('li');
                if (speedOptions.length >= speed) {
                    let clickEvent = document.createEvent('MouseEvent');
                    clickEvent.initEvent('click', true, true);
                    speedOptions[speed].dispatchEvent(clickEvent);

                    break;
                }

            }
            setTimeout(() => {console.log('retry...')}, 1000);
        }
    }
})();
