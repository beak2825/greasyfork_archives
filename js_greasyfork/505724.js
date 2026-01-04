
// ==UserScript==
// @name         story
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  story1
// @author       kl
// @match        https://faucet.story.foundation/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @require      https://cdn.jsdelivr.net/npm/jquery.min.js@3.5.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/index.min.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/index.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/unibabel.hex.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/unibabel.base32.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/forge/dist/forge.min.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/botp/sha1-hmac.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/botp/index.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/authenticator.js
// @grant        GM_xmlhttpRequest
// @connect      weleader5.oss-cn-shenzhen.aliyuncs.com
// @connect      43.135.155.29
// @connect      localhost
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
// @license		 kl1
// @downloadURL https://update.greasyfork.org/scripts/505724/story.user.js
// @updateURL https://update.greasyfork.org/scripts/505724/story.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    $(function () {
        pageOperate();
    })
    function pageOperate() {
        var pageurl = window.location.href.split('//')[1].split('?')[0];
        console.info(pageurl)
        if (pageurl.indexOf("https://faucet.story.foundation/") > -1) {
            pageurl = "faucet.story.foundation"
        }
 
        switch (pageurl) {
            case 'faucet.story.foundation/':
            case 'faucet.story.foundation':
                var findinalstr = setInterval(function () {
                    if ( $('#address').length >0) {  
                        clearInterval(findinalstr);
                        GM_xmlhttpRequest({
                            url: "http://43.135.155.29:9291/api/KT_Address/Get",
                            method: "GET",
                            data: "",
                            headers: {
                                "Content-type": "application/x-www-form-urlencoded"
                            },
                            onload: function (xhr) {
                                if (xhr.status == 200) {
                                    var data = JSON.parse(xhr.responseText); 
                                    if (data.response != null) {
                                        $("input[id='address']").attr("value", data.response.Wallet); 
                                        return;
 
                                    }
 
                                }
 
                            }
                        })
                    }
 
                }, 15000);
                break; 
        }
    }
})();