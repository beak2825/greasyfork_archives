// ==UserScript==
// @name         SPWN Player Style Mod
// @namespace    https://github.com/AyeBee/SPWNPlayerStyleMod
// @version      0.1
// @description  SPWN配信画面の余白を消してビデオ表示領域を広げます
// @author       ayebee
// @match        https://virtual.spwn.jp/videos/*
// @icon         https://www.google.com/s2/favicons?domain=spwn.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444505/SPWN%20Player%20Style%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/444505/SPWN%20Player%20Style%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeClass = (element, className) => {
        const classNames = (typeof element === 'object' ? element.className : element)
                .split(' ').filter(item => item !== className);
        if (typeof element === 'object') {
            element.className = classNames.join(' ');
        }
        return classNames;
    };

    const appendClass = (element, className) => {
        const classNames = removeClass(element, className);
        classNames.push(className);
        if (typeof element === 'object') {
            element.className = classNames.join(' ');
        }
        return classNames;
    };

    const createElement = (name, properties, parent) => {
        const element = document.createElement(name);
        if (properties) {
            for (const [key, value] of Object.entries(properties)) {
                element[key] = value;
            }
        }
        if (parent) {
            parent.append(element);
        }
        return element;
    };

    // スタイル追加
    createElement('style', {id: '__UserScript_SPWNFullWidth'}, document.getElementsByTagName('head')[0]).append(`
        /* プレイヤー領域大枠周りの設定 */
        html.better-style-enable {
            overflow: hidden;
        }
        .better-style-enable .css-7salpj,
        .better-style-enable .css-1vvbfnx,
        .better-style-enable div#Streaming {
            max-width: 100%;
        }
        .better-style-enable div#Streaming {
            width: 100%;
            padding: 0 !important;
            gap: 0;
        }

        /* ヘッダ領域の非表示設定 */
        .better-style-enable div#header,
        .better-style-enable .breadcrumb,
        .better-style-enable .MuiPaper-root.MuiExpansionPanel-root.MuiExpansionPanel-rounded.MuiPaper-elevation1.MuiPaper-rounded,
        .better-style-enable .css-xmwi3e {
            display: none;
        }

        /* コメント・グッズ領域設定 */
        .better-style-enable .css-f7aixm,
        .better-style-enable .css-1vml1ge,
        .better-style-enable .css-7salpj > *,
        .better-style-enable .css-1gucx1d > *,
        .better-style-enable .css-f7aixm > *,
        .better-style-enable .css-8jot76,
        .better-style-enable .css-5a5g1d,
        .better-style-enable .css-hfp7fm,
        .better-style-enable .css-1twjper,
        .better-style-enable .css-5a5g1d,
        .better-style-enable .css-v84gbb,
        .better-style-enable .css-7ym23u,
        .better-style-enable .css-v84gbb,
        .better-style-enable .css-1fyelzq,
        .better-style-enable .css-3f8z73 {
            border: none;
            box-shadow: 0 1px 1px #0005;
        }
        .better-style-enable .css-hfp7fm {
            /* コメント入力欄 */
            height: 105px;
        }
        .better-style-enable .css-7salpj,
        .better-style-enable .css-1gucx1d {
            display: flex;
            flex-flow: column;
            height: 100vh;
        }
        .better-style-enable .css-1psltl0 {
            flex: 1;
            display: flex;
            flex-flow: column;
        }
        .better-style-enable .css-8jot76 {
            flex: 1;
            padding-top: 0;
        }
        .better-style-enable .css-1twjper,
        .better-style-enable .css-5a5g1d {
            /* コメント・グッズタブ */
            height: 41px;
        }
        .better-style-enable .css-4zu9b0,
        .better-style-enable .css-hfp7fm {
            /* コメント入力欄 */
            height: 105px;
        }
        .better-style-enable div#msg-list-inner {
            /* メッセージ */
            height: calc(100vh - 41px - 105px);
        }
        .better-style-enable .css-1vml1ge,
        .better-style-enable .css-1ov0w5e {
            /* カートに入ってる商品 */
            height: 56px;
        }
        .better-style-enable .css-f7aixm,
        .better-style-enable .css-13rrf9l {
            /* グッズ */
            height: calc(100vh - 41px  - 56px);
        }
        .better-style-enable .css-1h00ykp {
            flex: 1;
        }

        .better-style-enable .css-7ym23u,
        .better-style-enable .css-1fyelzq {
            padding: 8px;
            margin: 0;
            width: 100%;
        }
        .better-style-enable .css-v84gbb {
            padding: 8px 0 0;
        }

        /* スタイル有効無効切り替えボタン */
        button.vjs-better-control.vjs-control.vjs-button {
            border-radius: 10%;
        }
        .better-style-enable button.vjs-better-control.vjs-control.vjs-button {
            background-color: #f00;
        }
        button.vjs-better-control.vjs-control.vjs-button::before {
            content: "B" !important;
            color: #fff;
        }
    `);

    const buttonText = createElement('span', {className: 'vjs-control-text'});

    const buttonTooltip = createElement('span', {className: 'theo-button-tooltip tooltip-better vjs-hidden'});
    buttonTooltip.append('Better style');

    const commandButton = createElement('button', {
        className: 'player-icon vjs-better-control vjs-control vjs-button',
        type: 'button',
        ariaLive: 'polite',
        ariaDisabled: 'false'
    });
    commandButton.append(buttonText, buttonTooltip);
    commandButton.addEventListener('mouseover', e => { removeClass(buttonTooltip, 'vjs-hidden') }, false);
    commandButton.addEventListener('mouseout', e => { appendClass(buttonTooltip, 'vjs-hidden') }, false);
    commandButton.addEventListener('click', e => {
        const html = document.getElementsByTagName('html')[0];
        const className = 'better-style-enable';
        if(html.className.indexOf(className) === -1) {
            appendClass(html, className);
            commandButton.ariaDisabled = 'true';
        } else {
            removeClass(html, className);
            commandButton.ariaDisabled = 'false';
        }
    }, false);

    // プレイヤーのロードが終わったらスタイル切り替えボタンを追加
    let interval;
    const appendButton = () => {
        const videoController = document.querySelector('#vjs_video_3 > div > div:nth-child(8)');
        videoController.append(commandButton);
        if (videoController) {
            clearInterval(interval);
        }
    };
    interval = setInterval(appendButton, 100);
})();
