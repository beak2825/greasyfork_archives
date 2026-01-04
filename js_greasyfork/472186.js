// ==UserScript==
// @name         切出窗口自动暂停视频(Video Auto Pause After The Tab Hides)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Video Auto Pause After The Tab Hides
// @author       poco
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      GNU GPLv3
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/472186/%E5%88%87%E5%87%BA%E7%AA%97%E5%8F%A3%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91%28Video%20Auto%20Pause%20After%20The%20Tab%20Hides%29.user.js
// @updateURL https://update.greasyfork.org/scripts/472186/%E5%88%87%E5%87%BA%E7%AA%97%E5%8F%A3%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91%28Video%20Auto%20Pause%20After%20The%20Tab%20Hides%29.meta.js
// ==/UserScript==
(function() {
    if(document.domain.includes("huya.com")){
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                let pauseBtn = document.querySelector('.player-pause-btn')
                if(pauseBtn){
                    pauseBtn.click()
                }
            }
        })
    }else {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                let videoDom = document.querySelector('video')
                if(videoDom){
                    videoDom.pause()
                }
            }
        })
    }
})();
