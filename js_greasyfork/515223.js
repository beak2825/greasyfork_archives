// ==UserScript==
// @name        nicovideo-comfortable-controller-fader
// @namespace   https://github.com/dnek
// @version     1.0
// @author      dnek
// @description ニコニコ動画のプレイヤー下部のコントローラーを自然にフェードイン・フェードアウトさせます。
// @description:ja    ニコニコ動画のプレイヤー下部のコントローラーを自然にフェードイン・フェードアウトさせます。
// @homepageURL https://github.com/dnek/nicovideo-comfortable-controller-fader
// @match       https://www.nicovideo.jp/watch/*
// @grant       GM_addStyle
// @license     MIT license
// @downloadURL https://update.greasyfork.org/scripts/515223/nicovideo-comfortable-controller-fader.user.js
// @updateURL https://update.greasyfork.org/scripts/515223/nicovideo-comfortable-controller-fader.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    GM_addStyle(`
div[data-styling-id=":r3:"] {
    > div[data-styling-id=":r4:"] {
        opacity: 0;
        pointer-events: none;
        &:hover {
            opacity: 1;
            pointer-events: auto;
        }
    }
}
`);

    const mouseMovingStyleEl = GM_addStyle(`
div[data-styling-id=":r3:"] {
    > div[data-styling-id=":r4:"] {
        opacity: 1;
        pointer-events: auto;
    }
}
`);
    mouseMovingStyleEl.disabled = true;

    let timeoutID;

    const initFader = () => {
        const controllerEl = document.querySelector('div[data-styling-id=":r3:"] > div[data-styling-id=":r4:"]');
        if (controllerEl === null) {
            return;
        }

        controllerEl.setAttribute('nccf-controller', '');

        const enableMouseMovingStyle = () => {
            clearTimeout(timeoutID);
            timeoutID = setTimeout(() => {
                mouseMovingStyleEl.disabled = true;
            }, 2000);
            mouseMovingStyleEl.disabled = false;
        };

        enableMouseMovingStyle();

        const playerEl = controllerEl.parentElement;

        playerEl.addEventListener('mousemove', enableMouseMovingStyle);

        playerEl.addEventListener('mouseleave', () => {
            clearTimeout(timeoutID);
            mouseMovingStyleEl.disabled = true;
        });

        console.log('nicovideo-comfortable-controller-fader is added.');
    };

    setInterval(() => {
        if (document.querySelector('div[nccf-controller]') === null) {
            initFader();
        }
    }, 100);
})();
