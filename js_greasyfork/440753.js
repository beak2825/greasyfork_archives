// ==UserScript==
// @name         知乎、简书、CSDN、掘金、51CTO、infoq链接直接跳转
// @namespace    https://greasyfork.org/
// @version      0.8
// @description  去除知乎、简书、CSDN、掘金、51CTO、infoq链接跳转提示，点击链接直接跳转网页
// @author       Derek
// @match        https://*.zhihu.com/*
// @match        https://*.csdn.net/*
// @match        https://*.jianshu.com/*
// @match        https://*.juejin.cn/*
// @match        https://*.51cto.com/*
// @match        https://*.infoq.cn/*
// @grant        none
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440753/%E7%9F%A5%E4%B9%8E%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%81CSDN%E3%80%81%E6%8E%98%E9%87%91%E3%80%8151CTO%E3%80%81infoq%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/440753/%E7%9F%A5%E4%B9%8E%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%81CSDN%E3%80%81%E6%8E%98%E9%87%91%E3%80%8151CTO%E3%80%81infoq%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

function getRealHref(href) {
    try {
        if (href.startsWith(`https://link.zhihu.com/?target=`)) {
            let href_real = href.split(`?target=`)[1];
            return decodeURIComponent(href_real);
        } else if (href.startsWith(`https://link.jianshu.com?t=`)) {
            let href_real = href.split(`?t=`)[1];
            return decodeURIComponent(href_real);
        } else if (href.startsWith(`https://links.jianshu.com/go?to=`)) {
            let href_real = href.split(`go?to=`)[1];
            return decodeURIComponent(href_real);
        } else if (href.startsWith(`https://link.juejin.cn?target=`)) {
            let href_real = href.split(`?target=`)[1];
            return decodeURIComponent(href_real);
        } else {
            return href;
        }
    } catch (e) {
        return href;
    }
}

(function () {
    window.topen = window.open;
    window.open = (a, b) => {
        if (a.startsWith("https://link.csdn.net?target=")) {
            a = a.replace(/https\:\/\/link\.csdn\.net\?target\=/g, '');
            window.topen(decodeURIComponent(a), b);
        } else if (a.startsWith("https://blog.51cto.com/transfer?")) {
            a = a.replace(/https\:\/\/blog\.51cto\.com\/transfer\?/g, '');
            window.topen(decodeURIComponent(a), b);
        } else if (a.startsWith("https://www.infoq.cn/link?target=")) {
            a = a.replace(/https\:\/\/www\.infoq\.cn\/link\?target\=/g, '');
            window.topen(decodeURIComponent(a), b);
        } else {
            window.topen(a, b);
        }
    }
    setInterval(() => {
        //对新出现的内容，每 1.5s 刷新一次a标签的链接
        let a = $(`a`);
        for (let i = 0; i < a.length; i++) {
            let cur_a = a.eq(i);
            let cur_href = cur_a.attr(`href`);
            if (cur_href) {
                cur_a.attr(`href`, getRealHref(cur_href));
            }
        }
    }, 1500);
})();