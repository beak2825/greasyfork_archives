// ==UserScript==
// @name         BeatStage 伪全屏模式
// @namespace    http://betastage.demojameson.com/
// @version      0.6
// @description  BeatStage 顶部菜单栏随页面滚动，并且自动下滚到演奏界面
// @author       DemoJameson
// @match        https://www.beatstage.com/play/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/369368/BeatStage%20%E4%BC%AA%E5%85%A8%E5%B1%8F%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/369368/BeatStage%20%E4%BC%AA%E5%85%A8%E5%B1%8F%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // TODO 尚未找到方向实现自动选择速度，不然可以记录每首歌的速度然后恢复
    // 配置选项：BPM 乘以速度得到一个衡量音符下落速度的值，根据这个值推荐适合的速度
    var BPMxSPEED = 600

    GM_addStyle(`
#navbar {
	position: absolute !important;
}

#uvTab {
	background: rgb(1, 163, 181) !important;
	opacity: 0.6 !important;
}

html::-webkit-scrollbar{width:0px !important}
    `);

    function scrollToPlayer(){
        document.documentElement.scrollTop = document.querySelector("#game-area").offsetTop + 4;
    }

    setTimeout(function(){
        scrollToPlayer()

        var messages = document.querySelector("#game-header > h2").textContent.match(/(.+?)\s+\n\s+(.+?)\s+(BPM:\s.+)\s+(\d+:\d+)/m);

        var bpm = messages[3].match(/\d+/)[0];
        var recommendSpeed = parseInt(BPMxSPEED / bpm);
        var decimal = BPMxSPEED % bpm / bpm;
        if (decimal < 0.25) {
            recommendSpeed += ".0";
        } else if (decimal < 0.75) {
            recommendSpeed += ".5";
        } else {
            recommendSpeed += 1;
            recommendSpeed += ".0";
        }

        var sMessage = "<p>" + messages[1] + "</p><p>" + messages[2] + "</p><p>" + messages[3] + "</p><p>" + messages[4] + "</p>速度：" + recommendSpeed;

        var aLink = document.querySelector("#uvTabLabel");
        aLink.innerHTML = sMessage;
        aLink.outerHTML = aLink.outerHTML;
        document.querySelector("#uvTabLabel").addEventListener("click", scrollToPlayer, false);
    }, 500)
})();