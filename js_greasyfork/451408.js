// ==UserScript==
// @name         ieltsonlinetests 滚动优化
// @namespace    ieltsonlinetests.com
// @version      1.0
// @description  绕过 nicescroll 在 mac 上糟糕的滚动表现；听力播放器增加键盘控制。
// @author       Shouduo
// @match        https://ieltsonlinetests.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABxVBMVEVHcEw0s84aMEXMZHjaooLRYHUysNLNYXUqs8Q1NSnGY3rQXm8xssXQZXsAAAA1tM+/YHapm2PzsE8ur8jdfokzsc8ys8zgdHf9pzYCAgfKWW3PXG/RXnBHpbzUaH4CN14zsMguscrSYn7XYHU0sMAAAADOZnn7pz87rssAAAAAAAAAAAD/q0AhP1D/tUY4qMI2ssY+nrjRXnIrs80AAADhb4Y3sMzsnz0AAAAdj6bzrlD///9EPFXLmzozrs31mjrRYHY1iJkAAAD/sD7TYXPskyQsnrwAQTCFSUEVW2OZTVL2r0vwhIDEpFQAAAD////6193ExsAUbn+bUmZBtdT/tEHRxL3ruFQAAACMZhH/3GcansSQfozgoC2Thks7gpVUX1AAAAAjEBfbVFkAg5YhDxlVKjfzjyAvGhC9W26XT1H00dj52d9RRmVPqsVsQVEAHzJNp6+xjjb/rkD/rUIyssXJYXnzrFDRYnbNYnkyssoysb8ttMsrr7/BZX3/rkLTXXAANiI0ttclSWj3pkorlrbXZnYhcFzZXGslZ03daH+rXGT/tEQXQmYxVHmhRkkupMfvc4EcHyPSRF3/qSxtVm4ud5DDbnmyAAAAdXRSTlMA/f3zBsz+/v4Ez2DhoAaoKvr9Kwxd0R80/nYX5hHn/IJzrofQG93euHkqUfT8pHv5GUMcEHDsiI388iz790JsuG6dl/K69PqT/Y3al/DqE8gu/e/Fd1LtZVuJqX9n/Mz6gcz4+ojE/vz0wIDr6Xjr+t3VZr9AK6LSAAACaklEQVQ4jc3SZ1PiUBQG4EsqAUIQaQKCgCB9sIvYy6hj727vvZdURLKAyGLX3f29e5ONDjvrD9h38uXMfXJP5pwA8G+Wc7ncMnZdYjbs7/PWrZW3K29WKa1MDKRv34pTDSDx+vzy0tvbo5XTL34cddwzN4DY6bksV3GnViaLxeLRZGOXR4d1WRCuQVEB6UYQO6wKDWAeXpHcpABlVmOzYbNVgRRF3ILZbGaKAl/SX9ObTtCTiE1MDAzMLizQEUEQOQ4dCwaDvZYwwFwuFwZW30f7CKK0f/zzsCqSJAScKIp1X8j9p8/WRp+OKJVKv5Bj/xA6RXJqRBH1RUB8J7aTYHTS7u4uUUKQk7Lf/0rgroTIgf7h4eHPn/R6PRSlFHJyUj72oxrg0EgEzFut24trGphrKcP43/m0GwxuI7BaB7e/HUCgNzFMNHVxgaTKyDp8OUjTtNHpATxvbVKBI9Ddat8giLOztY9De3sGC8AoZUUq+J4vmALdcJF2B0EQ+y0pCDzaJHmeV0F7s7pqhpAgQNQbbgKdUUmSbgamNijC4w6W1YCzERzkC3komsfbMyzL7rcM7XEGCxYO95jNEAw2zSiANTnaTRk2n2ezSx9IztDV+/zxs3hcAYszB4UCqyavPNmldZLz0ni97qNDSgv+/twVUJN9WZNJEkUFUfT5IKjwyYdn8OO1Yynz9LQmC3Dn8L8iSTBfqVQ6pu84dDpJScbBMA+e1GQvjnsFYQrHQX9HJTnp6rQzJh1MX9Te3XzXW5Npo3FMlnG4LNdo/6gLjnDEHmhrC9hHOgGwGEPuLpunyx0yeq4G/n/nN0NSxS0LQn+wAAAAAElFTkSuQmCC
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451408/ieltsonlinetests%20%E6%BB%9A%E5%8A%A8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/451408/ieltsonlinetests%20%E6%BB%9A%E5%8A%A8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // entrence of modification
    let start = function () {
        // bypass scroll control from nicescroll
        let splitItems = document.getElementsByClassName('split-item');
        [...splitItems].forEach((item) => {
            item.style.overflowY = 'auto';
            let child = item.lastChild;
            child.style.height = '100%';
            child.style.overflow = 'auto';
        });
        // keyboard control for audio player
        let reviewExplanation = document.getElementsByClassName('review-explanation')[0];
        let audioPlayButton = document.getElementsByClassName('audio-play-button')[0];
        let playbackButton = document.getElementsByClassName('playback')[0];
        let playforwardButton = document.getElementsByClassName('playforward')[0];
        reviewExplanation.onkeydown = (e) => {
            switch(e.code) {
                case 'Space':
                    audioPlayButton.click();
                    break;
                case 'ArrowLeft':
                    playbackButton.click();
                    break;
                case 'ArrowRight':
                    playforwardButton.click();
                    break;
            }
        }
        // hide extra scrollbar created by nicescroll
        let ascrails = document.getElementsByClassName('nicescroll-rails');
        [...ascrails].forEach((rail) => {
            rail.style.display = 'none';
        });
    };
    // wait for dom ready
    let sleep = function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };
    //
    sleep(1000).then(() => {
        start();
    })
})();