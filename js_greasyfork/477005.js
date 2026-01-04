// ==UserScript==
// @name         掘金签到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  掘金签到,首页自动签到
// @author       You
// @match        https://juejin.cn*
// @match        https://juejin.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAByFBMVEUAAAAegP8fgP8egf8eev8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP8egP////9x6/jYAAAAlnRSTlMAAAAAAAZdWwUQhvTzhA8lq/ypJHH5C3PsBAJO2dghl2AqYZg7yBGIe/itJq96CGrozkMBRdDnaQwDaAfPN7ZwCfaUlnK3OGPeGP4Z8rww4+JeMr3xWt/aUjzHU9tYw+55IKSiHw3vwjYdn/qhCh6eHHfEOsbtdVDg4ddPL7qDhbkuF/cjrJMWbOnR0mtGKLD9JxKK9Ym9ME1eAAAAAWJLR0SX5m4brwAAAAd0SU1FB+UGEgMGHcgXPyMAAAHTSURBVDjLrVNpV1JRFH1bk55AISFPAVEQQXEgFTWQVDBDUsws5yErc8rU5tGZyjFNsvt7PfcBLizAtVqeD3fdu+9+5+6z3zmCcMkBioz3OYqrIjJ8nqtUqa9dT5cE0ORpGdPe0KVhAPl6RqHPT0uQCgoZKyyQUhAAgxECjKYis0neGM6TgOISC8kHrFa6gVhqK05mAGV2plY6YhjgKFcxe1kSA8YKJ8mv1HAMqKqmYpw1xuQUrpu1pL+u3g24Gxpp23TLhUR6j5dejcPNPp9MvU1UAQYPF9TS2uZHInGg/U4g8Rj8HXeDEDpDzFlyj/8kLo11dbGYXKDb5mShTqE8TGjPfbk4Sy938kGfXPDDR8TtVwriwCCBQ8NcCEbsjI3y+uAdGyc4NCEKyGp5TNvJJx5kA0+fTT3n6acrZgicnYvVPf9igbGFl/P8Rlrk69IUIfrlV3GvIL2eJP6b4JW4k2/f0fH9B+nMKXg/mgn6JHcTRMVnOnz5es5JrKyS5vBaLnXVuprq2tj8+3dutUfIobxvuu/kV+TH9j89AdfOLmXe26el9sCVoqfg/rnH5GhscKfsOeDw6Bc9U32cvq2jv09Uf6IZZocGR5GTebQuGL3/iVNGTHdSXGp/KgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNi0xOFQwMzowNjoyOSswMDowMBW0AwoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDYtMThUMDM6MDY6MjkrMDA6MDBk6bu2AAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477005/%E6%8E%98%E9%87%91%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/477005/%E6%8E%98%E9%87%91%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    async function main() {
        const href = window.location.href;
        // 首页
        if (href == 'https://juejin.cn/') {
            await delay(1500)
            const homeSigninBtn = $('.signin-btn')[0];
            //去签到
            if (homeSigninBtn.innerText == '去签到') {
                homeSigninBtn.click()
                await delay(1500)
                const signinBtns = $('.signin')[1];
                // 已签到,获取已签到按钮
                if (signinBtns != undefined && signinBtns.innerText == '立即签到') {
                    // 签到
                    signinBtns.click(); const btns = $('.btn');
                    const btnsLength = btns.length;
                    const raffleBtn = btns[btnsLength - 1];
                    raffleBtn.click();
                    await delay(2500)
                    const raffleFree = $('#turntable-item-0')[0];
                    if (raffleFree != undefined && raffleFree.innerText == '免费抽奖次数：1次') {
                        raffleFree.click()
                    }
                }
            }
        }
    }

    //延迟
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    main();
})();