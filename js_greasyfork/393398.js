// ==UserScript==
// @name         A站 自动播放 & 网页全屏
// @version      0.11
// @description  AcFun Autoplay & FullScreen
// @author       Erimus
// @include      http*://*acfun.cn/v/ac*
// @grant        none
// @namespace    https://greasyfork.org/users/46393
// @downloadURL https://update.greasyfork.org/scripts/393398/A%E7%AB%99%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20%20%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/393398/A%E7%AB%99%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20%20%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('=== autoplay & fullscreen')

    // 把是否在播放的判断条件改为计数。
    // 防止网络不好长时间Loading，出现播了一点，判断为已播放，其实暂停了的情况。
    let playing = 0
    // 现在是折中的方法，只判断3次，防止Loading造成的暂停。
    // 但是1.5秒内用户点击暂停后，会继续播放。
    let play_count_limit = 3
    let fullscreen = false

    let main = setInterval(function() {

        if (!fullscreen) {
            // find full screen button
            let fullScreenBtn = document.querySelector('.fullscreen-web')
            console.log('=== Full Screen Button:', fullScreenBtn)
            if (fullScreenBtn) {
                // check fullscreen status
                let closed = fullScreenBtn.querySelector('.btn-span').getAttribute('data-bind-attr')
                console.log('=== Closed:', closed)
                // alert(1)
                if (closed=='web') {
                    console.log('=== fullscreen OK')
                    fullscreen = true
                } else {
                    fullScreenBtn.click()
                }
            }
        }

        if (playing < play_count_limit) {
            // find start button on player area bottom
            let playBtn = document.querySelector('.btn-play');
            console.log('=== Play Button:', playBtn)
            if (playBtn) {
                // check play status
                let check = playBtn.querySelector('.btn-span').getAttribute('data-bind-attr')
                console.log('=== Playing check:', check)
                if (check=='play') {
                    playing++
                    console.log('=== playing', playing)
                } else {
                    playBtn.click()
                }
            }
        }

        if (playing >= play_count_limit && fullscreen) {
            console.log('=== quit loop')
            clearInterval(main)
        }

    }, 200);

})();
