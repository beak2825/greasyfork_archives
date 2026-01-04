// ==UserScript==
// @name ABEMA 見逃し視聴、ビデオ ワイド表示を拡大
// @namespace https://greasyfork.org/users/716748
// @version 1.0.6
// @description 見逃し視聴、ビデオのワイド表示時のプレイヤー部分を拡大 テスト 弊害あり
// @author ykhr.m
// @grant GM_addStyle
// @run-at document-start
// @match *://*.abema.tv/*
// @downloadURL https://update.greasyfork.org/scripts/418630/ABEMA%20%E8%A6%8B%E9%80%83%E3%81%97%E8%A6%96%E8%81%B4%E3%80%81%E3%83%93%E3%83%87%E3%82%AA%20%E3%83%AF%E3%82%A4%E3%83%89%E8%A1%A8%E7%A4%BA%E3%82%92%E6%8B%A1%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/418630/ABEMA%20%E8%A6%8B%E9%80%83%E3%81%97%E8%A6%96%E8%81%B4%E3%80%81%E3%83%93%E3%83%87%E3%82%AA%20%E3%83%AF%E3%82%A4%E3%83%89%E8%A1%A8%E7%A4%BA%E3%82%92%E6%8B%A1%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
let css = `
.com-vod-VODResponsiveMainContent--wide-mode .c-vod-EpisodePlayerContainer-container
,.com-vod-VODResponsiveMainContent--wide-mode .c-tv-TimeshiftPlayerContainerView
{
    height: 100vh;
    width: 100vw;
    left: 0;
    position: fixed;
    top: 0;
    z-index: 15;
}

.com-vod-VODResponsiveMainContent--wide-mode {
    height: calc(100vh - 100px) !important;
}
.c-application-FooterContainer {
    display: none !important;
}
/* 縮小できるウインドウサイズ下限を広げる */
.c-application-DesktopAppContainer__content,
.com-vod-VODResponsiveMainContent--wide-mode {
    min-width: 261px !important;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
