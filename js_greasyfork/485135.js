// ==UserScript==
// @name         KTBox
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description   KT
// @author       konglong
// @match        https://artio.faucet.berachain.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/crypto-js/3.1.9-1/crypto-js.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/Base64/1.1.0/base64.min.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/index.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/unibabel.hex.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/unibabel.base32.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/forge/dist/forge.min.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/botp/sha1-hmac.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/botp/index.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/authenticator.js
// @grant        GM_xmlhttpRequest
// @connect      weleader5.oss-cn-shenzhen.aliyuncs.com
// @connect      43.128.70.168
// @connect      127.0.0.1
// @connect      2captcha.com
// @connect      airdropapi.beetaa.cn
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info
// @license		 NO
// @downloadURL https://update.greasyfork.org/scripts/485135/KTBox.user.js
// @updateURL https://update.greasyfork.org/scripts/485135/KTBox.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(function () {
        pageOperate();
    })
    function pageOperate() {
        var pageurl = window.location.href.split('//')[1].split('?')[0];
        console.info(pageurl)
        if (pageurl.indexOf("faucet.berachain.com") > -1) {
            pageurl = "faucet.berachain.com"
        }

        switch (pageurl) {
            case 'faucet.berachain.com':
                GM_xmlhttpRequest({
                    url: "http://43.128.70.168:3001/api/Airdrop_BaseInfo/GetInfo?id=1",
                    method: "GET",
                    data: "",
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded"
                    },
                    onload: function (xhr) {
                        if (xhr.status == 200) {
                            var data = JSON.parse(xhr.responseText);
                            if (data.response != null) {
                                $("input").attr("value", data.response.WalletAddress);
                                return;

                            }
                        }
                    }
                })
                break;

        }
    }
    function IsSendData(postData) {
        //成功
        GM_xmlhttpRequest({
            url: 'http://clcode.getpx.cn:3081/api/KongTou_Email/updateEmailById',
            method: "POST",
            data: JSON.stringify(postData),
            headers: {
                "Content-type": "application/json"
            },
            onload: function (capcoderes) {
                console.info(capcoderes)
            }
        });
    }

})();