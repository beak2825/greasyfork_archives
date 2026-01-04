// ==UserScript==
// @name        Youtube強制用空白鍵播放/暫停
// @namespace   https://greasyfork.org/scripts/479470
// @version     1.1
// @description 讓空白鍵像k鍵一樣方便 原始功能依舊保持 所以空白鍵會同時擁有空白鍵和k鍵的效果
// @author      fmnijk
// @match       https://www.youtube.com/*
// @icon        https://www.google.com/s2/favicons?domain=youtube.com
// @grant       none
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/479470/Youtube%E5%BC%B7%E5%88%B6%E7%94%A8%E7%A9%BA%E7%99%BD%E9%8D%B5%E6%92%AD%E6%94%BE%E6%9A%AB%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/479470/Youtube%E5%BC%B7%E5%88%B6%E7%94%A8%E7%A9%BA%E7%99%BD%E9%8D%B5%E6%92%AD%E6%94%BE%E6%9A%AB%E5%81%9C.meta.js
// ==/UserScript==

/*main function*/

let old_state = true
let new_state = true

function kevent(){
    const kEvent = new KeyboardEvent("keydown", {
        keyCode: 75, // k鍵的keyCode是75
        bubbles: true, // 事件要冒泡
        cancelable: true // 事件要可取消
    });
    document.activeElement.dispatchEvent(kEvent);
}

(window.onload = function() {
    'use strict';

    Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
        get: function(){
            return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
        }
    })

    document.addEventListener("keydown", function(event) {
        // 如果按下的是空格鍵
        if (event.keyCode == 32 &&
            event.target != document.querySelector('#movie_player') &&
            event.target != document.querySelector('h2#title')){
            console.log(event.target)
            old_state = document.querySelector(".video-stream.html5-main-video").playing
            kevent()
            setTimeout(() => {
                new_state = document.querySelector(".video-stream.html5-main-video").playing
                if (new_state == old_state) {
                    kevent()
                }
            }, "125");
        }
    });

})





