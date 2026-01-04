// ==UserScript==
// @name         getMetaMaskEthAddress
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  getMetaMaskEthAddress相关
// @author       lly
// @match        https://*.google.com/*
// @match        https://google.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/Base64/1.1.0/base64.min.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/index.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/unibabel.hex.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/unibabel.base32.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/forge/dist/forge.min.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/botp/sha1-hmac.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/botp/index.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/authenticator.js
// @require      https://greasyfork.org/scripts/433356-authenticator/code/authenticator.js?version=975957
// @require      https://cdn.jsdelivr.net/npm/Faker@0.7.2/Faker.js
// @grant        GM_xmlhttpRequest
// @connect      weleader5.oss-cn-shenzhen.aliyuncs.com
// @connect      pv.sohu.com
// @connect      jwc.08px.cn
// @connect      clcode.getpx.cn
// @connect      2captcha.com
// @connect      smshub.org
// @connect      beetaa.cn
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
// @license      lly
// @downloadURL https://update.greasyfork.org/scripts/445880/getMetaMaskEthAddress.user.js
// @updateURL https://update.greasyfork.org/scripts/445880/getMetaMaskEthAddress.meta.js
// ==/UserScript==

(function() {
    'use strict';
	//程序入口-main
	var pageurl = unsafeWindow.location.href.split('//')[1].split('?')[0];
	var automatic = getQueryString("automatic");
    $(function () {
		pageOperate()
	})
    // Your code here...
	function pageOperate() {
        var pageurl = unsafeWindow.location.href.split('//')[1].split('?')[0];
		var automatic = getQueryString("automatic");
		switch (pageurl) {
                case 'www.google.com/':
                    setTimeout(function(){
                        if(automatic == 'getAddress'){
                            if (typeof unsafeWindow.ethereum === "undefined") {
                                //没安装MetaMask钱包进行弹框提示
                                alert("请安装MetaMask")
                            } else {
                                //如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
                                ethereum.enable()
                                    .catch(function(reason) {
                                        //如果用户拒绝了登录请求
                                        if (reason === "User rejected provider access") {
                                            // 用户拒绝登录后执行语句；
                                        } else {
                                            // 本不该执行到这里，但是真到这里了，说明发生了意外
                                            alert("There was a problem signing you in");
                                        }
                                    }).then(function(accounts) {
                                        console.info(accounts[0]);
                                    });
                            }
                        }
                    },2000)
                break;

		}
	}


	function sleep(delay) {
		var start = (new Date()).getTime();
		while ((new Date()).getTime() - start < delay) {
		continue;
		}
	}

	 //采用正则表达式获取地址栏参数
    function getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        };
        return null;
    }




})();