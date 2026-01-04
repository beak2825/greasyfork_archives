// ==UserScript==
// @name         video operation
// @namespace    https://greasyfork.org/zh-CN/users/927158-gueson
// @version      0.1
// @description  some video operation
// @author       gueson
// @match        *://www.ys900.com/v_play/*
// @match        *://www.naifei.org/vodplay/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446708/video%20operation.user.js
// @updateURL https://update.greasyfork.org/scripts/446708/video%20operation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...setInterval setTimeout
    setInterval(() => {
        console.log('number', Math.random() * 10)
        const videos = document.getElementsByTagName('video')
        console.log('videos', JSON.stringify(videos))
        const iframe = document.getElementsByTagName('iframe')
        console.log('iframe', JSON.stringify(iframe))
        console.log('document1', JSON.stringify(document))
        console.log('body', JSON.stringify(document.body))
        console.log('window', JSON.stringify(window))

        for (var i = 0; i < videos.length; i++) {
				var current_video = videos[i]
                console.log('test', i)
				// 静音
				current_video.volume = 10
				// 2倍速
				 current_video.playbackRate = 3.0
				if (current_video.paused) {
					current_video.play()
				}
			}
    }, 1000)
})();