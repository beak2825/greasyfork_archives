// ==UserScript==
// @name               Clean Cloudflare URL
// @name:zh-CN         清理 Cloudflare 生成的 URL 参数
// @namespace          https://github.com/andylizi
// @version            0.2
// @author             andylizi
// @description        Remove ugly Cloudflare-generated parameters from the url
// @description:zh-CN  清除 Cloudflare 在 URL 中插入的一长串参数
// @icon               https://www.cloudflare.com/favicon.ico
// @include            /__cf_chl_(jschl_|captcha_|managed_|rt_|f_|)tk(__)?=/
// @run-at             document-start
// @grant              none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/425855/Clean%20Cloudflare%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/425855/Clean%20Cloudflare%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const oldUrl = location.href, url = new URL(oldUrl);
    const params = url.searchParams;
    ["__cf_chl_jschl_tk__", "__cf_chl_managed_tk__", "__cf_chl_captcha_tk__", "__cf_chl_tk", "__cf_chl_rt_tk", "__cf_chl_f_tk"]
        .forEach(p => params.delete(p));
    const newUrl = url.toString();
    (newUrl !== oldUrl) && history.replaceState(history.state, '', newUrl);
})();