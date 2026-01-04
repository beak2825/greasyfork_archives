// ==UserScript==
// @name         bianNFT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  bianNFT相关
// @author       lly
// @match        https://*.binance.com/*
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
// @grant        GM_xmlhttpRequest
// @connect      weleader5.oss-cn-shenzhen.aliyuncs.com
// @connect      pv.sohu.com
// @connect      jwc.08px.cn
// @connect      clcode.getpx.cn
// @connect      2captcha.com
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
// @downloadURL https://update.greasyfork.org/scripts/443678/bianNFT.user.js
// @updateURL https://update.greasyfork.org/scripts/443678/bianNFT.meta.js
// ==/UserScript==

(function() {
    'use strict';
	//程序入口-main
    $(function () {
		pageOperate()
	})
	/**
	* @param inputDom 输入框DOM 比如：document.getElementById('userId')
	* @newText 新的文本
	*/
	function changeReactInputValue(inputDom,newText){
		let lastValue = inputDom.value;
		inputDom.value = newText;
		let event = new Event('input', { bubbles: true });
		event.simulated = true;
		let tracker = inputDom._valueTracker;
		if (tracker) {
		tracker.setValue(lastValue);
		}
		inputDom.dispatchEvent(event);
	}
    // Your code here...
	function pageOperate() {
        var pageurl = window.location.href.split('//')[1].split('?')[0];
        var queueInterval01 = setInterval(function () {
            //console.info('监控页面检查。。。');
            var btns = document.getElementsByTagName('button');
            for(var i = 0 ; i<btns.length;i++){
                var btnBuy = btns[i].innerText;
                if(btnBuy == '购买'){
                    //clearInterval(queueInterval01);//取消定时器
                    btns[i].click();
                }
            }
        }, 10)
        var queueInterval02 = setInterval(function () {
            //console.info('监控页面检查02。。。');
            var btnsTwo = document.getElementsByTagName('button');
            for(var j = 0 ; j<btnsTwo.length;j++){
                var btnSub = btnsTwo[j].innerText;
                if(btnSub == '确认'){
                    //clearInterval(queueInterval02);//取消定时器
                    //console.info(btnSub)
                    btnsTwo[j].click();
                }
            }
        }, 10)
	}
})();