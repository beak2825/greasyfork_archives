// ==UserScript==
// @name         Bilibili 剧场播放
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bilibili剧场模式
// @author       pxoxq
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500775/Bilibili%20%E5%89%A7%E5%9C%BA%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/500775/Bilibili%20%E5%89%A7%E5%9C%BA%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    const playerHeight = '80vh'; // 设置播放器高度为窗口高度的80%
    const widePlayerStyles = `
.bpx-player-ctrl-wide {
  width: 0px;
}
#wide-box::-webkit-scrollbar {
  display: none;
}
#wide-box {
  scrollbar-width: 0;
}
#wide-box #bilibili-player {
  width: 100vw !important;
}
#wide-box #playerWrap {
  order: -1;
  height: ${playerHeight} !important;
}
#wide-box #bilibili-player {
  height: ${playerHeight} !important;
}
#wide-box .left-container.scroll-sticky {
  display: flex;
  flex-direction: column;
}
#wide-box div.right-container.is-in-large-ab {
  margin-top: ${playerHeight} !important;
}
#wide-box #danmukuBox {
  margin-top: 0;
}
#wide-box div.video-container-v1 {
  padding: 0;
  justify-content: left;
}
#wide-box .left-container.scroll-sticky > div:not(#playerWrap) {
  margin-left: 100px;
}
#wide-box #biliMainHeader .bili-header__bar {
  background-color: #000;
}
#wide-box #biliMainHeader .bili-header__bar a.default-entry {
  color: white;
}
#wide-box #biliMainHeader .bili-header__bar li svg {
  color: white;
}
#wide-box .mini-header .right-entry .right-entry__outside .right-entry-text {
  color: white;
}
`;

    function injectStyle(styleStr, nodeId = 'pxo') {
        $('head').append(`<style id="${nodeId}">${styleStr}</style>`);
    }

    function wideModeToggle() {
        $('.bpx-player-ctrl-wide').click();
        const mainBox = 'body';
        const boxId = $(mainBox).attr('id');
        if (!boxId) {
            $(mainBox).attr('id', 'wide-box');
        }
    }

    function initWideMode() {
        injectStyle(widePlayerStyles);
        wideModeToggle();
    }

    const checkInterval = setInterval(() => {
        if ($('#viewbox_report').length) {
            clearInterval(checkInterval);
            initWideMode();
        }
    }, 100);

})();
