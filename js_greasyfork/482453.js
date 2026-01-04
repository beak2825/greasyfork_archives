// ==UserScript==
// @name          网页sm解密网页sm解密
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   网页sm解密
// @author       You
// @match        https://scden.sc.sgcc.com.cn/*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482453/%E7%BD%91%E9%A1%B5sm%E8%A7%A3%E5%AF%86%E7%BD%91%E9%A1%B5sm%E8%A7%A3%E5%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/482453/%E7%BD%91%E9%A1%B5sm%E8%A7%A3%E5%AF%86%E7%BD%91%E9%A1%B5sm%E8%A7%A3%E5%AF%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!Sm2Utils || !Sm4Utils) {
        console.info("加密方法不存在，加载插件失败")
        return
    }
    console.info("存在加密方法，开始加载插件-----------")

    let prvKeyHex = "00D437C318242C7DD29DC07712799725FE6BC9A5355DB2CD0A179FA23643333D06";
    let sm2 = new Sm2Utils();

    XMLHttpRequest.prototype.__param = function () {
        let newVar = this.__paramData || {};
        this.__paramData = newVar;
        return newVar;
    };

    let proxiedHead = window.XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function () {
        let param = this.__param();
        let header = param.header || {};
        param["header"] = header;
        header[arguments[0]] = arguments[1]
        // console.info("xhr-req-head", arguments)
        return proxiedHead.apply(this, arguments);
    };

    let proxiedOpen = window.XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        let param = this.__param();
        param["method"] = arguments[0];
        param["url"] = arguments[1];
        // console.info("xhr-open", arguments)
        return proxiedOpen.apply(this, arguments);
    };


    let proxiedSend = window.XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        // console.info("xhr-req-send", this, arguments)
        let param = this.__param();
        param["requestData"] = arguments[0];
        let xhr = this;
        this.onreadystatechange = function () {
                let responseText = null;
            if(xhr.responseType!='blob'){
                responseText = xhr.responseText;
            }

   ;
            if (xhr.readyState != 4) {//
                return
            }
            let param = xhr.__param();
            let header = param.header || {};
            let url = param.url;
            let requestData = param["requestData"];
            let mmHeader = header["X-Acloud-Crypto-Symmetric-Code"]

            if (!mmHeader) {
                return;
            }
            let sm2Decrypt = null;
            let split = null;
            let responseDecrypt = null;
            let requestDecrypt = null;
            let urlCrypt = null;
            let urlDecrypt = null;

            try {
                sm2Decrypt = sm2.decryptToText(prvKeyHex, mmHeader);
                split = sm2Decrypt.split(",");

                //请求
                if (requestData) {
                    try {
                        requestDecrypt = Sm4Utils.CBC.decryptToText(requestData, split[1], split[2]);
                        let requestTemp = requestDecrypt;
                        requestDecrypt = JSON.parse(requestDecrypt)
                        requestDecrypt.__source = requestTemp
                    }catch ( e){}

                }
                //响应
                if (responseText) {
                    try {
                    responseDecrypt = Sm4Utils.CBC.decryptToText(responseText, split[1], split[2]);
                    let responseTemp = responseDecrypt;
                    responseDecrypt = JSON.parse(responseDecrypt)
                    responseDecrypt.__source = responseTemp
                    }catch ( e){}
                }

                if (!url.startsWith("http")) {
                    url = location.origin + url
                }
                urlCrypt = new URL(url).searchParams.get("x_acloud_query_param_crypto_data");
                urlDecrypt = Sm4Utils.CBC.decryptToText(urlCrypt, split[1], split[2]);

            } catch (e) {

            }
            console.info(
                "解密数据", "\r\n",
                "url:", url, "\r\n",
                "method:",  param["method"], "\r\n",
                "tid:",  header["tid"], "\r\n",
                "token:",  header["Authorization"], "\r\n",
                "url参数：", urlDecrypt, "\r\n",
                "请求数据", requestDecrypt, "\r\n",
                "响应数据", responseDecrypt ,"\r\n",
                "数据", param ,"\r\n",

            );
        };
        return proxiedSend.apply(this, arguments);
    };
    // Your code here...
})();