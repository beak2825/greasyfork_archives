// ==UserScript==
// @name         Mouseout Killer
// @author       MetaMiku
// @namespace    https://github.com/MetaMikuAI/Mouseout-Killer/
// @description  禁用通视频学习web对鼠标离开的eventlisteners - (修改自keepcalmandbelogical的脚本mouse events ad killer)
// @warning      本脚本请在下载后24h内删除，本脚本未进行后台检验，由此脚本造成的一切后果由使用者自负
// @version      0.2
// @match        *://*.chaoxing.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482940/Mouseout%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/482940/Mouseout%20Killer.meta.js
// ==/UserScript==

/*
 * 更新日志:
 * 0.2 - 添加了自动播放视频和自动静音的功能(js模拟点击)
 * 0.1 - 允许用户鼠标离开时保持视频播放(屏蔽mouseout事件监听器)
 */


(function() {
    Window.prototype.addEventListener = (function() {
        var f = Window.prototype.addEventListener;
        return function(type, handler) {
            if (type.toLowerCase() !== "mouseout") {
                f.apply(this, arguments);
            }
        };
    })();
    console.log("[MetaMiku]已屏蔽Mouseout监听器");

    setTimeout(function() {
        document.getElementsByClassName("vjs-poster")[0].click();
        console.log("[MetaMiku]已启动视频播放");
    }, 3000);

    setTimeout(function() {
        document.getElementsByClassName("vjs-mute-control vjs-control vjs-button vjs-vol-3")[0].click();
        console.log("[MetaMiku]已执行自动静音");
    }, 1000);
})();
