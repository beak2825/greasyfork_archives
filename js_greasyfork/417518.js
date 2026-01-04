// ==UserScript==
// @namespace     https://github.com/NoName
// @name          哔哩哔哩、西瓜视频跳过接下来播放
// @author        Guapi
// @description   哔哩哔哩跳过接下来播放/西瓜视频取消自动播放
// @description:en 哔哩哔哩跳过接下来播放/西瓜视频取消自动播放
// @version       0.2
// @icon         https://i0.hdslb.com/bfs/emote/f85c354995bd99e28fc76c869bfe42ba6438eff4.png
// @include      /https?:\/\/www\.bilibili\.com\/video\/.*/
// @include      /https?:\/\/www\.ixigua\.com\/*/
// @run-at       document-end
// @license      WTFPL
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/417518/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%81%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87%E6%8E%A5%E4%B8%8B%E6%9D%A5%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/417518/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%81%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87%E6%8E%A5%E4%B8%8B%E6%9D%A5%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    var jumpButton = '.bilibili-player-video-toast-item-jump';
    var xiguajumpButton = '.PlayEnding__nextVideo__cancel';
    console.log(`[${GM_info.script.name}]: 开始运行`);
    setInterval(() => {
        if($(jumpButton).length > 0) {
            $(jumpButton).trigger('click')
        };
        if($(xiguajumpButton).length > 0) {
            $(xiguajumpButton).trigger('click')
        }
    }, 100)
})();