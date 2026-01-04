// ==UserScript==
// @name           Better Live UX
// @name:zh-CN     更好的直播体验（最高清晰度、禁弹幕、禁广告）
// @namespace      lhzbxx
// @version        2022.05.11
// @description    自动选择最高清晰度、禁止弹幕、禁止广告。
// @author         lhzbxx
// @run-at         document-idle
// @noframes
// @require        https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/1.12.4/jquery.min.js
// @require        https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @match          *://live.bilibili.com/*
// @match          *://www.douyu.com/*
// @match          *://www.huya.com/*
// @match          *://egame.qq.com/*
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/404495/Better%20Live%20UX.user.js
// @updateURL https://update.greasyfork.org/scripts/404495/Better%20Live%20UX.meta.js
// ==/UserScript==

const config = {
    huya: {
        init: () => {
            waitForKeyElements('div[class^="FanClubHd"]', (node) => {
                node[0].dispatchEvent(new MouseEvent('mouseover', {bubbles: true}));
                waitForKeyElements('span[class^="SignBtn"]', (cNode) => {
                    cNode.click();
                });
                setTimeout(() => {
                    node[0].dispatchEvent(new MouseEvent('mouseout', {bubbles: true}));
                }, 500);
            });
        },
        selectors: [
            '#player-danmu-btn[title="关闭弹幕"]',
            'ul.player-videotype-list > li:nth-child(1)',
            'div.ab-close-btn',
            // '#player-fullpage-btn',
        ],
        timeout: 2400,
    },
    douyu: {
        selectors: [
            `div[class^='showdanmu-']`,
            `div[class^='tip-'] > ul > li:nth-child(1)`,
            // `div[class^='wfs']:not([class^='wfs-exit'])`,
        ],
    },
    bilibili: {
        init: () => {
            waitForKeyElements('#live-player', (node) => {
                node[0].dispatchEvent(new MouseEvent('mousemove'));
            });
            waitForKeyElements('.quality-wrap', (node) => {
                node[0].dispatchEvent(new MouseEvent('mouseenter'));
                setTimeout(() => {
                    node[0].dispatchEvent(new MouseEvent('mouseleave'));
                }, 1200);
            });
        },
        selectors: [
            '.quality-wrap > div > div.quality-it:nth-child(2)',
            // 'div.danmaku',
        ],
    },
    qq: {
        selectors: [
            'div.vcp-extended-barrage',
            'a.vcp-vertical-switcher-item-clarity:nth-child(1)',
            // 'div.vcp-extended-webfullscreen',
        ],
    },
}

const site = config[document.domain.split('.').reverse()[1]];

(function() {
    'use strict';

    if (!site) {
        return;
    }

    site.init && site.init();
    site.selectors.forEach(selector => {
        setTimeout(() => {
            waitForKeyElements(selector, (node) => {
                node.click();
            });
        }, site.timeout || 0);
    });
})();
