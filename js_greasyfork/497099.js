// ==UserScript==
// @name         volc request proxy
// @namespace    volc
// @version      2024-06-05-4
// @description  一个能够拦截请求并修改响应的脚本
// @author       captain_bytedance
// @match        https://console.volcengine.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=volcengine.com
// @require      https://scriptcat.org/lib/637/1.4.1/ajaxHooker.js#sha256=k69hpCTTpzC162cpC1b4R2QyG/NRLFcbRV+7orOXq+k=
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497099/volc%20request%20proxy.user.js
// @updateURL https://update.greasyfork.org/scripts/497099/volc%20request%20proxy.meta.js
// ==/UserScript==
(function() {
    ajaxHooker.hook(request => {
        if (request.url.includes('CountEvents')) {
            request.abort = true;
            request.response = res => {
                res.responseText = {
                    ResponseMetadata: {
                        "RequestId":"xxxxxx","Action":"CountEvents","Version":"2022-09-01","Service":"edgemonitor","Region":"cn-north-1",
                        "Error":{"CodeN":100013,"Code":"AccessDenied","Message":"User is not authorized to perform: edgemonitor:CountEvents on resource: "}
                    }

                }
            }
        }
    });
})();