// ==UserScript==
// @name             移除框架广告 Remove Ads In iframes
// @namespace        https://ez118.github.io/
// @version          1.7
// @icon             https://adblockplus.org/favicon.ico
// @description      Block ads in websites. The script can only block the ads wraped with iframe.
// @author           ZZY_WISU
// @match            *://*/*
// @license          GPLv3
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/446837/%E7%A7%BB%E9%99%A4%E6%A1%86%E6%9E%B6%E5%B9%BF%E5%91%8A%20Remove%20Ads%20In%20iframes.user.js
// @updateURL https://update.greasyfork.org/scripts/446837/%E7%A7%BB%E9%99%A4%E6%A1%86%E6%9E%B6%E5%B9%BF%E5%91%8A%20Remove%20Ads%20In%20iframes.meta.js
// ==/UserScript==

/*If this can't block your ads, add the url to block it!*/
var AdsUrlList = ["kunpeng-sc.csdnimg.cn", "googleads.g.doubleclick.net", "pos.baidu.com", "vt.ipinyou.com", "www.2345.com", "show-3.mediav.com",
                 "acdn.adnxs.com", "googleads.g.doubleclick.net", "gum.criteo.com", "ads.yieldmo.com", "ads.pubmatic.com", "bh.contextweb.com",
                 "contextual.media.net", "prebid.a-mo.net", "safeframe.googlesyndication.com", "tpc.googlesyndication.com", "s0.2mdn.net",
                 "c.aaxads.com"];
/*目前可拦截这些广告商的广告: CSDN, GOOGLE, BAIDU等 */

/* function BlockIt() {
    Array.prototype.forEach.call(document.querySelectorAll('iframe'), function(iframe) {
        for(let i = 0; i < AdsUrlList.length; i ++){
            if(iframe.src.includes(AdsUrlList[i])){
                try { iframe.remove(); }
                catch(e) { iframe.parentElement.removeChild(iframe); }
                break;
            }
        }
    });
} */

function BlockIt() {
    // 将广告 URL 列表合并为正则表达式
    const adsUrlPattern = new RegExp(AdsUrlList.map(url => url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');

    // 遍历所有 iframe 元素
    document.querySelectorAll('iframe').forEach(function(iframe) {
        const src = iframe.src; // 缓存 src 属性
        if (adsUrlPattern.test(src)) { // 使用正则表达式检查 src
            try {
                iframe.remove(); // 尝试移除 iframe
            } catch (e) {
                iframe.parentElement.removeChild(iframe); // 兼容处理
            }
        }
    });
}


(function() {
    'use strict';

    if(window.self !== window.top){ return; }

    BlockIt();

    'use strict';
    setTimeout(BlockIt, 800);
    setInterval(BlockIt, 3000);
})();
