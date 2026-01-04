// ==UserScript==
// @name         虎牙解锁蓝光20M清晰度
// @description  解锁虎牙直播所有清晰度，免扫码免登录。修改自477947-虎牙免登录观看。
// @author       L based on (σ｀д′)σ
// @version      1.1.0
// @namespace    https://greasyfork.org/zh-CN/users/1069880-l-l
// @license      GPL-3.0-or-later
// @match        *://www.huya.com/*
// // @include    /^https:\/\/www\.huya\.com\/[^/]+\/?$/
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/538229/%E8%99%8E%E7%89%99%E8%A7%A3%E9%94%81%E8%93%9D%E5%85%8920M%E6%B8%85%E6%99%B0%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/538229/%E8%99%8E%E7%89%99%E8%A7%A3%E9%94%81%E8%93%9D%E5%85%8920M%E6%B8%85%E6%99%B0%E5%BA%A6.meta.js
// ==/UserScript==

/*
 * 基于原脚本 https://greasyfork.org/zh-CN/scripts/477947 修改。
 * 原作者: (σ｀д′)σ
 * 依据 GPL-3.0-or-later 许可证进行分发。
 */


(() => {
    'use strict';

    const getById = (id) => document.getElementById(id);
    let autoSelectHighRes = GM_getValue('autoSelectHighRes', false);

    GM_registerMenuCommand(`自动切换最高清晰度: ${autoSelectHighRes ? '开启' : '关闭'}`, () => {
        autoSelectHighRes = !autoSelectHighRes;
        GM_setValue('autoSelectHighRes', autoSelectHighRes);
        alert(`自动切换最高清晰度已${autoSelectHighRes ? '开启' : '关闭'}，即将自动刷新`);
        location.reload();
    });

    // 解锁视频清晰度
    function unlockResolution() {
        const $vtList = $('#player-ctrl-wrap .player-videotype-list');
        if (!$vtList.length) return;

        const unlockRES = () => {
            const $highRes = $vtList.children(':has(.bitrate-right-btn.common-enjoy-btn)');
            if ($highRes.length) {
                $highRes.each((i, e) => {
                    $(e).data('data').status = 0;
                    // 自动选择最高清晰度
                    if (autoSelectHighRes && i === 0) {
                        setTimeout(() => e.click(), 0);
                    }
                });
            } else if ($vtList.children().length > 1 && autoSelectHighRes) {
                $vtList.children()[0].click();
            }
        };

        // 观察视频清晰度列表变化
        new MutationObserver(unlockRES).observe($vtList[0], {
            attributes: false,
            childList: true,
            subtree: false
        });
        unlockRES();
    }

    // 初始化，等待播放器控件加载
    new MutationObserver((mutations, ob) => {
        const playerCtrlWrap = getById('player-ctrl-wrap');
        if (playerCtrlWrap) {
            unlockResolution();
            ob.disconnect();
        }
    }).observe(document.body, {
        attributes: false,
        childList: true,
        subtree: false
    });
})();