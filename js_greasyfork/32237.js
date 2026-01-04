// ==UserScript==
// @name         斗鱼助手
// @namespace    https://github.com/EternalPhane/UserScripts/
// @version      0.5.2
// @description  自动领取鱼丸（需要手动输入验证码）、自动打开宝箱
// @author       EternalPhane
// @include      /^https?:\/\/(www|yuxiu)\.douyu\.com\/(t(opic)?\/)?\w+$/
// @resource     css https://raw.githubusercontent.com/EternalPhane/UserScripts/master/Douyu%20Assistant/douyu-assistant.css
// @resource     html https://raw.githubusercontent.com/EternalPhane/UserScripts/master/Douyu%20Assistant/douyu-assistant.html
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/32237/%E6%96%97%E9%B1%BC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/32237/%E6%96%97%E9%B1%BC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

$.noConflict();
(($) => {
    'use strict';
    const attach = () => {
        GM_addStyle(GM_getResourceText('css'));
        $('div.ToolbarActivityArea').after(GM_getResourceText('html'));
        let chestId = null;
        let yuwanId = null;
        const getYuwan = () => {
            const time = $('span.RewardModule-countdown').text();
            const wait = () => {
                if ($('div.geetest_wait').length) {
                    $('div.geetest_btn')
                        .mouseenter()
                        .click();
                    getYuwan();
                } else {
                    setTimeout(wait, 100);
                }
            };
            switch (time) {
                case '领 取':
                    if ($('div.geetest_holder:visible').length) {
                        break;
                    }
                    if (!$('div.RewardModal.super').length) {
                        $('div.RewardModule-toggle')
                            .mouseenter()
                            .click()
                    };
                    $('span.RewardM-text.enable')
                        .mouseenter()
                        .click();
                    setTimeout(wait, 100);
                    return;
                case '完 成':
                    return;
                case '':
                    break;
                default:
                    const [minute, second] = time.split(':');
                    const ms = (Number(minute) * 60 + Number(second)) * 1000;
                    yuwanId = setTimeout(getYuwan, ms);
                    return;
            }
            yuwanId = setTimeout(getYuwan, 1000);
        };
        $('input#chest-switch').change((e) => {
            localStorage.setItem('chest', String(e.currentTarget.checked));
            e.currentTarget.checked
                ? (chestId = setInterval(() => {
                    if ($('div.TreasureGee:visible').length) {
                        return;
                    }
                    const treasure = $('div.Treasure.is-finish div.TreasureStatus-text');
                    treasure.length &&
                        '领取' === treasure.text() &&
                        // [not working]
                        // treasure.mouseenter().click();
                        //
                        // [not working]
                        // treasure[0].dispatchEvent(new MouseEvent("click", {
                        //     bubbles: true,
                        //     cancelable: true,
                        //     composed: true,
                        //     detail: 1,
                        //     screenX: 1795,
                        //     screenY: 765,
                        //     clientX: 1796,
                        //     clientY: 664,
                        //     buttons: 1
                        // }));
                        //
                        // isTrusted?
                        null;
                }, 100))
                : clearInterval(chestId);
        });
        $('input#yuwan-switch').change(
            (e) => {
                localStorage.setItem('yuwan', String(e.currentTarget.checked));
                e.currentTarget.checked ? getYuwan() : clearTimeout(yuwanId);
            }
        );
        $('input#chest-switch').prop('checked', 'true' == localStorage.getItem('chest')).change();
        $('input#yuwan-switch').prop('checked', 'true' == localStorage.getItem('yuwan')).change();
    };
    const wait = setInterval(() => {
        if ($('div.ToolbarActivityArea').length) {
            clearInterval(wait);
            attach();
        }
    }, 100);
})(jQuery);
