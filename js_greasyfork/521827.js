// ==UserScript==
// @name         opensea
// @namespace    http://tampermonkey.net/
// @version      1
// @description  opensea2
// @author       opensea1
// @match        https://*.opensea.io/*
// @match        https://*.x2y2.io/*
// @match        https://*.gem.xyz/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/index.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/unibabel.hex.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/unibabel.base32.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/forge/dist/forge.min.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/botp/sha1-hmac.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/botp/index.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/authenticator.js
// @grant        GM_xmlhttpRequest
// @connect      weleader5.oss-cn-shenzhen.aliyuncs.com
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
// @license		 opensea
// @downloadURL https://update.greasyfork.org/scripts/521827/opensea.user.js
// @updateURL https://update.greasyfork.org/scripts/521827/opensea.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let taskId = "";

    $(function () {
        // 获取页面的基本 URL
        let pageurl = window.location.hostname;
        if (pageurl.includes('opensea.io') || pageurl.includes('premint.xyz')) {
            pageurl = 'opensea.io';
        }

        // 界面操作初始化
        initData(pageurl);
    });

    function initData(pageurl) {
        switch (pageurl) {
            case "opensea.io":
                var initbalance = setInterval(function () {
                    GM_xmlhttpRequest({
                        url: `https://weleader5.oss-cn-shenzhen.aliyuncs.com/APP/opseajson.json?tt=${Date.now()}`,
                        method: "GET",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        onload: function (xhr) {
                            try {
                                // 解析 JSON 数据
                                var jsondata = JSON.parse(xhr.responseText);
                                console.log("获取数据成功：", jsondata);

                                // 查找页面上的账户链接
                                const offerlist = document.querySelectorAll("div[data-testid='ItemOwnerAccountLink']");
                                 offerlist.forEach(list => {
                                    var item=list.querySelector("span>a")
                                    const wallet = item.href.replace("https://opensea.io/", "").toLowerCase();
                                    const parentElement = document.querySelector("button > span").parentElement
                                    // 默认设置绿色背景
                                    parentElement.style.background = "green";
                                    parentElement.style.color = "#fff";
                                    parentElement.innerText="客户，不要买"

                                    // 根据 JSON 数据匹配更新
                                    jsondata.forEach(witem => {
                                        if (witem.WalletAddress.toLowerCase() === wallet) {
                                            parentElement.style.background = "red";
                                            parentElement.style.fontWeight = "bold";
                                            parentElement.textContent = witem.Pname;
                                            parentElement.innerText="自己的，可以买"
                                        }
                                    });
                                });
                            } catch (error) {
                                console.error("JSON 解析失败：", error);
                            }
                        },
                        onerror: function (xhr) {
                            console.error("API 请求失败：", xhr.statusText);
                        }
                    });
                }, 3000);

                // 清除定时器逻辑（示例）
                setTimeout(() => clearInterval(initbalance), 60000); // 1 分钟后清理
                break;
        }
    }
})();
