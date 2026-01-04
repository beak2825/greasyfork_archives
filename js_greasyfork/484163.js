// ==UserScript==
// @name         ニコニコ動画 コメントウィンドウ表示
// @namespace    https://yyya-nico.co/
// @version      1.0.11
// @description  コメント一覧をポップアップウィンドウで表示します。
// @author       yyya_nico
// @license      MIT License
// @match        https://www.nicovideo.jp/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicovideo.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484163/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%82%A6%E3%82%A3%E3%83%B3%E3%83%89%E3%82%A6%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/484163/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%82%A6%E3%82%A3%E3%83%B3%E3%83%89%E3%82%A6%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let nicoApiDataElem = document.querySelector('[name="server-response"]');
    const origin = 'https://yyya-nico.com';
    let nicoApiData = JSON.parse(nicoApiDataElem.content).data.response;
    let popup = null;

    const observerWrap = (findTargetSelector, sendTargetSelector, callback) => {
        return new MutationObserver(records => {
            records.forEach(record => {
                record[sendTargetSelector ? 'addedNodes' : 'removedNodes'].forEach(node => {
                    if (node.nodeType == 1/*ELEMENT*/ && node.matches(findTargetSelector)) {
                        callback(
                            sendTargetSelector ? node.querySelector(sendTargetSelector)
                                               : record.target
                        );
                    }
                });
            });
        });
    }

    const createTask = target => {
        target.insertAdjacentHTML('beforeend', '<button dir="ltr" id="comments-list" class="cursor_pointer bdr_full fs_base hover:bg-c_action.baseHover hover:cursor_pointer disabled:fill_action.textOnBase_disabled disabled:pointer-events_none h_x4 fs_s fw_bold px_base white-space_nowrap" type="button">ウィンドウで表示</button>');
        const openBtn = document.getElementById('comments-list');
        openBtn.addEventListener('click', () => {
            const w = 480;
            const h = screen.height * .8;
            const lef = (screen.width - w) * .9;
            const top = (screen.height - h) * .25;
            popup = window.open(`${origin}/nv-comment-viewer`, 'comment-list', 'width='+ w +',height='+ h +',left='+ lef +',top='+ top);
        });
    }

    const waitCreatePlayerPanelContainerObserver = observerWrap('.grid-area_\\[sidebar\\] > .d_flex', '.d_flex > section > div > .d_flex', target => {
        if (target) {
            waitCreatePlayerPanelContainerObserver.disconnect();
            createTask(target);
        }
    });

    let lastProgress = null;
    const timeObserver = new MutationObserver(records => {
        records.forEach(record => {
            if (!popup.closed) {
                const progressPercentage = Number(record.target.style.transform.slice(7, -1)); // scaleX(****)
                if (progressPercentage !== lastProgress) {
                    popup.postMessage({
                        eventName: 'playerMetadataChange',
                        data: {
                            progressPercentage: progressPercentage
                        }
                    }, origin);
                    lastProgress = progressPercentage;
                }
            } else {
                timeObserver.disconnect();
            }
        });
    });

    window.addEventListener('message', e => {
        if (e.origin === origin) {
            switch (e.data.eventName) {
                case 'ready':
                    // console.log('ready');
                    if (nicoApiData) {
                        popup.postMessage({
                            eventName: 'sendData',
                            data: nicoApiData
                        }, origin);
                    } else {
                        const cutIndex = location.pathname.lastIndexOf('/') + 1;
                        const videoId = location.pathname.slice(cutIndex);
                        popup.postMessage({
                            eventName: 'sendVideoId',
                            data: {
                                videoId
                            }
                        }, origin);
                    }
                case 'returned':
                    // console.log('returned');
                    const played = document.querySelector('[aria-label="video - currentTime"]');
                    timeObserver.observe(played, {attributes: true});
                    break;

                case 'bye':
                    // console.log('bye');
                    timeObserver.disconnect();
                    break;

                case 'keyDown':
                    // console.log('keyDown');
                    ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', ' '];
                    switch (e.data.data) {
                        case 'ArrowUp':

                            break;
                        case 'ArrowRight':
                            document.querySelector('[aria-label="10 秒送る"]')?.click();
                            break;
                        case 'ArrowDown':

                            break;
                        case 'ArrowLeft':
                            document.querySelector('[aria-label="10 秒戻る"]')?.click();
                            break;
                        case ' ':
                            document.querySelector('[aria-label="再生する"], [aria-label="一時停止する"]')?.click();
                            break;
                    }
                    break;
            }
        }
    });

    const clearNicoApiData = () => {
        nicoApiData = null;
    };

    (history => {
        const pushState = history.pushState;
        history.pushState = (...args) => {
            clearNicoApiData();
            return pushState.apply(history, args);
        };
    })(window.history);

    window.addEventListener('popstate', clearNicoApiData);

    waitCreatePlayerPanelContainerObserver.observe(document.body, {childList: true, subtree: true});
})();