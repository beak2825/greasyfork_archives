"use strict";
// ==UserScript==
// @name         网易云封面旋转
// @namespace    https://gplane.win/
// @version      0.1.0
// @description  在播放当前页面对应的歌曲时旋转封面。
// @author       Pig Fang <g-plane@hotmail.com>
// @license      MIT
// @copyright    2022-present, Pig Fang
// @create       2022-05-08
// @lastmodified 2022-05-08
// @supportURL   https://github.com/g-plane/netease-music-cover-rotation
// @match        https://music.163.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444690/%E7%BD%91%E6%98%93%E4%BA%91%E5%B0%81%E9%9D%A2%E6%97%8B%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/444690/%E7%BD%91%E6%98%93%E4%BA%91%E5%B0%81%E9%9D%A2%E6%97%8B%E8%BD%AC.meta.js
// ==/UserScript==
;
(() => {
    function isCurrentSong() {
        var _a, _b;
        const linkToCurrent = (_b = (_a = document.querySelector('.m-playbar a.name')) === null || _a === void 0 ? void 0 : _a.href) !== null && _b !== void 0 ? _b : '';
        return linkToCurrent.endsWith(location.hash.replace('#', ''));
    }
    const style = document.createElement('style');
    style.textContent = `
  @keyframes cover-rotation {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .u-cover img {
    animation: 36s linear 0s infinite normal none paused cover-rotation;
  }
`;
    const button = document.querySelector('a.ply');
    setTimeout(() => {
        var _a, _b;
        (_b = (_a = document.querySelector('iframe')) === null || _a === void 0 ? void 0 : _a.contentDocument) === null || _b === void 0 ? void 0 : _b.head.appendChild(style);
    }, 900);
    window.addEventListener('hashchange', () => {
        setTimeout(() => {
            var _a, _b;
            (_b = (_a = document.querySelector('iframe')) === null || _a === void 0 ? void 0 : _a.contentDocument) === null || _b === void 0 ? void 0 : _b.head.appendChild(style);
            if (isCurrentSong() && button.dataset.action === 'pause') {
                const cover = document
                    .querySelector('iframe')
                    .contentDocument.body.querySelector('.u-cover img');
                cover.style.animationPlayState = 'running';
            }
        }, 900);
    });
    button.addEventListener('click', () => {
        if (!isCurrentSong()) {
            return;
        }
        const cover = document
            .querySelector('iframe')
            .contentDocument.body.querySelector('.u-cover img');
        if (button.dataset.action === 'play') {
            cover.style.animationPlayState = 'running';
        }
        else {
            cover.style.animationPlayState = 'paused';
        }
    });
})();
