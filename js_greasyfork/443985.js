// ==UserScript==
// @name         哔哩哔哩番剧CC字幕样式（描边）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  更改哔哩哔哩番剧CC字幕样式
// @author       TGSAN
// @match        *://www.bilibili.com/bangumi*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443985/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%95%AA%E5%89%A7CC%E5%AD%97%E5%B9%95%E6%A0%B7%E5%BC%8F%EF%BC%88%E6%8F%8F%E8%BE%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/443985/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%95%AA%E5%89%A7CC%E5%AD%97%E5%B9%95%E6%A0%B7%E5%BC%8F%EF%BC%88%E6%8F%8F%E8%BE%B9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let subtitleStyle = `
span.squirtle-subtitle-item-text {
    background: transparent !important;
    transform: perspective(1px) scale(1) translateY(-1.0em);
    text-shadow: 0 0 0.075em black, 0 0 0.075em black, 0 0 0.075em black, 0 0 0.075em black, 0 0 0.075em black, 0 0 0.075em black,0 0 0.075em black, 0 0 0.075em black, 0 0 0.075em black, 0 0 0.075em black, 0 0 0.075em black, 0 0 0.075em black, 0 0 0.075em black, 0 0 0.075em black, 0 0 0.075em black, 0 0 0.075em black,0 0 0.075em black, 0 0 0.075em black, 0 0 0.075em black, 0 0 0.075em black;
}
`;
    let applySubtitleStyle = document.createElement("style");
    applySubtitleStyle.innerHTML = subtitleStyle;
    document.head.appendChild(applySubtitleStyle);
})();