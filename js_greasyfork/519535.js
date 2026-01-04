// ==UserScript==
// @name            javdb预告片修复
// @namespace       javdb预告片修复
// @version         0.0.4
// @author          blc
// @license         轻肥不肥
// @description     预告片
// @match           https://javdb.com/*
// @icon            https://javdb.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/519535/javdb%E9%A2%84%E5%91%8A%E7%89%87%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/519535/javdb%E9%A2%84%E5%91%8A%E7%89%87%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.onload = function() {
        setTimeout(function() {
            // 找到所有视频标签
            var videos = document.querySelectorAll('video');

            // 遍历所有视频，修改链接
            videos.forEach(function(video) {
                var source = video.querySelector('source');
                if (source) {
                    var src = source.getAttribute('src');
                    if (src && src.includes('cc3001.dmm.co.jp')) {
                        // 修改src链接
                        var newSrc = src.replace('cc3001.dmm.co.jp', 'cc3001.dmm.com');
                        source.setAttribute('src', newSrc);
                        video.load(); // 重新加载视频
                        console.log('视频链接已修改:', src, '->', newSrc);
                    }
                }
            });
        }, 2000); // 延时1秒，确保页面完全加载
    };
})();
