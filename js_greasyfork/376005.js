// ==UserScript==
// @name        哔哩哔哩同步播放
// @namespace   play_together
// @author      czqmike
// @license     GPL-3.0-or-later
// @homepageURL https://github.com/kkren/bilibili_adjustPlayer
// @include     http*://www.bilibili.com/video/av*
// @description 使用Bilibili播放器完成远程同步播放的脚本。使用了原作者为mickey7q7、kkren的部分代码。
// @version     test.0.2
// @grant       GM.setValue
// @grant       GM_setValue
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/376005/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%90%8C%E6%AD%A5%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/376005/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%90%8C%E6%AD%A5%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
	'use strict';
	function querySelectorFromIframe(obj) {
		var iframePlayer = document.querySelector('iframe.bilibiliHtml5Player');
		if (matchURL.isOldBangumi() || matchURL.isNewBangumi()) {
			if (iframePlayer !== null) {
				return iframePlayer.contentWindow.document.body.querySelector(obj);
			} else {
				return document.querySelector(obj);
			}
		} else {
			return document.querySelector(obj);
		}
    }

    function skipSetTime (set, skipTime, video) {
        if (typeof set !== 'undefined' && video !== null) {
            var setTime = function() {
                var vLength = video.duration.toFixed();
                //console.log(skipTime);
                try {
                    if (skipTime === 0) {
                        video.currentTime = set;
                    } else if (skipTime > vLength) {
                        return;
                    } else {
                        video.currentTime += skipTime;
                    }
                } catch (e) {
                    console.log('skipSetTime：' + e);
                }
            };
            setTime();
        }
    }

    function Main() {
        var video = querySelectorFromIframe('.bilibili-player-video video');
        skipSetTime(undefined, 60, video);
    }

    Main();
})();
