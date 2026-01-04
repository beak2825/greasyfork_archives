// ==UserScript==
// @name         blurhelper
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  opsea
// @author       aridrop
// @match        https://*.opensea.io/*
// @match        https://*.x2y2.io/*
// @match        https://*.blur.io/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
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
// @connect      2captcha.com
// @connect      airdropapi.beetaa.cn
// @connect      43.134.27.147
// @connect      localhost
// @connect      api.yescaptcha.com
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
// @license		 kl
// @downloadURL https://update.greasyfork.org/scripts/460458/blurhelper.user.js
// @updateURL https://update.greasyfork.org/scripts/460458/blurhelper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var taskId = "";
    $(function () {
        //加载浮动层
        var mainView = $("<section style='pointer-events: none; position:fixed;left: 220px;top: 15%;transform: translate(0,-30%);display: flex;z-index:100000;height:100px;'>   <div id='dm' style='border-radius:10px ;margin: 0px 0px;display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 10px ;background-color: #1ca1f1;'> <p style='font-size: 40px;letter-spacing:5px ;font-weight: bold;color: #FFFFFF;padding: 0px 0px;' id='baomingjilu'>0.000</p> </div> </section>");
        var pageurl = window.location.href.split('//')[1].split('?')[0];
        if (pageurl.indexOf('opensea.io') > -1 || pageurl.indexOf('premint.xyz') > -1) {
            pageurl = 'opensea.io';
        }
        if (pageurl.indexOf('x2y2.io') > -1) {
            pageurl = 'x2y2.io';
        }
        if (pageurl.indexOf('gem.xyz') > -1) {
            pageurl = 'gem.xyz';
        }
        if (pageurl.indexOf('blur.io') > -1) {
            pageurl = 'blur.io';
        }
        //界面操作
        initData(pageurl);
    })
    function initData(pageurl) {
        switch (pageurl) {
            case "blur.io":
                var initbalance = setInterval(function () {
                    GM_xmlhttpRequest({
                        url: "https://weleader5.oss-cn-shenzhen.aliyuncs.com/APP/openseajson.json?tt" + Date.parse(new Date()).toString(),
                        method: "GET",
                        data: "fid=1037793830&act=1&re_src=11&jsonp=jsonp&csrf=e37f1881fd98f16756d16ab71109d37a",
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded"
                        },
                        onload: function (xhr) {
                            var cldata = xhr.responseText;
                            var jsondata = JSON.parse(cldata);
                            var offerlist = document.querySelector(".rows.interactive").firstElementChild.querySelectorAll(".row.sweepable");
                            $.each(offerlist, function (index, item) {
                                var wallet="";
                                if(item.querySelector(".index-5")!=null){
                                    wallet = item.querySelectorAll("a")[1].href.replace("https://blur.io/","").split('?')[0];

                                }

                              $(item).css("background","green")
                                //item.parentElement.parentElement.parentElement.style = "background:green;color:#fff;";
                                //item.parentElement.parentElement.parentElement.previousSibling.style = "background:green;color:#fff !important;";
                                //item.parentElement.parentElement.parentElement.previousSibling.previousSibling.textContent = '客户';
                                $.each(jsondata, function (windex, witem) {
                                    if (witem.WalletAddress.toString().toLowerCase() == wallet.toLowerCase()) {
                                         $(item).css("background","#B13A1B").css("color","#fff !important;")
                                    }
                                })
                            })
                        }
                    })
                }, 3000);
                break;
        }
    }
})();