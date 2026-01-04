// ==UserScript==
// @name         解除原神国际服HoyoLab每日签到地区限制
// @namespace    https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481
// @version      1.0.0
// @description  解除原神国际服HoyoLab每日签到对部分地区的限制
// @author       popcorner
// @license      MIT
// @match        https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500863/%E8%A7%A3%E9%99%A4%E5%8E%9F%E7%A5%9E%E5%9B%BD%E9%99%85%E6%9C%8DHoyoLab%E6%AF%8F%E6%97%A5%E7%AD%BE%E5%88%B0%E5%9C%B0%E5%8C%BA%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/500863/%E8%A7%A3%E9%99%A4%E5%8E%9F%E7%A5%9E%E5%9B%BD%E9%99%85%E6%9C%8DHoyoLab%E6%AF%8F%E6%97%A5%E7%AD%BE%E5%88%B0%E5%9C%B0%E5%8C%BA%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    setTimeout(function () {
        if (document.cookie.indexOf('ltmid_v2') == -1) {
            document.querySelector('.mhy-hoyolab-account-block').click();
            setInterval(function () {
                if (!document.querySelector('#hyv-account-frame')) {
                    window.location.reload();
                }
            }, 1000);
        } else {
            document.querySelector('body>div').__vue__.$store.state.isLogin = true;
        }
    }, 1000);
})();