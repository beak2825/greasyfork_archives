// ==UserScript==
// @name        喜马拉雅FM音质修改
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改喜马拉雅FM音质为64/128kbps
// @author       jing
// @match        www.ximalaya.com
// @match        www.ximalaya.com/*/*
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415063/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85FM%E9%9F%B3%E8%B4%A8%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/415063/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85FM%E9%9F%B3%E8%B4%A8%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==


(function () {
    'use strict';
    ah.proxy({
        //请求发起前进入
        onRequest: (config, handler) => {
            if (config.url.indexOf("mpay.ximalaya.com/mobile/track/pay") != -1) {
                config.url = config.url.replace("trackQualityLevel=0", "trackQualityLevel=1") // 将默认参数 0(24kbps) 替换为 1(64kbps) 或者 2(128kbps 需VIP)
            }
            handler.next(config);
        },
        //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
        onError: (err, handler) => {
            handler.next(err)
        },
        //请求成功后进入
        onResponse: (response, handler) => {
            handler.next(response)
        }
    })
})();