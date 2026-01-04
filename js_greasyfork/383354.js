// ==UserScript==
// @name sdk 预览工具
// @namespace https://github.com/Peter-WF/sdk-preview
// @version           0.0.8
// @icon              https://www.baidu.com/favicon.ico
// @description       便于预览 sdk 效果
// @run-at       document-start
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/383354/sdk%20%E9%A2%84%E8%A7%88%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/383354/sdk%20%E9%A2%84%E8%A7%88%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
//

(async function () {
    if(unsafeWindow.LP_SDK_MANAGER){
        unsafeWindow.LP_SDK_MANAGER.gmSetValue = function (key, value) {
            GM_setValue(key, value);
        }
    }else{
        var version = '68'
        var ideaId = await GM_getValue('ideaId', 0)
        console.log('当前：ideaId',ideaId)
        var eids = await GM_getValue('eids', 0)
        console.log('当前：eids',eids)
        unsafeWindow.BD_LP_CONFIG = {
            ideaId:ideaId,
            userId: "userId",
            searchId: "searchId",
            cuid: "cuid",
            eids:eids,
            productId: "8",
            bid_type: "3",
            ocpc_level: "2",
            ocpc_trans_from: "5",
            trans_type: "3",
            netType: "1"
        }
        var e = (new Date).getTime();
        var o = "BD_LP_SDK_LOCK";
        if (!sessionStorage.getItem(o)) {
            sessionStorage.setItem(o, "true");
            var n = new Image;
            n.onload = n.onerror = n.onabort = function () {
                n.onload = n.onerror = n.onabort = null;
                n = null
            };
            n.src = `https://als.baidu.com/elog/glog?f1=jssdk&f2=${ideaId}&f3=1033082990618843698&f4=4D6B14D95525B2636B4209F4F6A58384|945591830973968&f5=1986103,1986102,5005463,5006043,5006165,5006167,5004006,5004116,5004329,5004441,5005146,5005608,5005746,5005825,5005839,5005880,5006077,5004939,5005589,5005308,5005689,5005912,5006086,22745766,10140331&f6=16515&f7=2&rand=` + e
        }
        var d = document.createElement("script");
        d.src = `https://lp-static.cdn.bcebos.com/lp-sdk-js/lp-sdk-0.0.${version}.min.js`;
        d.crossOrigin1 = "anonymous1";
        var t = document.getElementsByTagName("head")[0];
        t.insertBefore(d, t.firstChild);
        console.log(unsafeWindow.BD_LP_CONFIG)

    }
})();