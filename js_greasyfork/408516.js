// ==UserScript==
// @namespace     https://github.com/andywang425
// @name          哔哩哔哩自动连播
// @author        andywang425
// @description   跳过bilibili视频末尾的充电鸣谢
// @description:en 跳过bilibili视频末尾的充电鸣谢
// @version       0.1
// @icon         https://i0.hdslb.com/bfs/emote/f85c354995bd99e28fc76c869bfe42ba6438eff4.png
// @include      /https?:\/\/www\.bilibili\.com\/video\/.*/
// @run-at       document-end
// @license      WTFPL
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/408516/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/408516/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function () {
    var jumpButton = '.bilibili-player-electric-panel-jump';
    console.log(`[${GM_info.script.name}]: 开始运行`);
    setInterval(() => {
        if($(jumpButton).length > 0) {
            $(jumpButton).trigger('click')
        }
    }, 200)
})();