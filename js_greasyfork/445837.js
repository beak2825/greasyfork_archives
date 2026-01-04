// ==UserScript==
// @name         TwitterAuto
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  TwitterAuto相关
// @author       lly
// @match        https://*.twitter.com/*
// @match        https://twitter.com/*
// @match        https://accounts.google.com/o/oauth2/*
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
// @downloadURL https://update.greasyfork.org/scripts/445837/TwitterAuto.user.js
// @updateURL https://update.greasyfork.org/scripts/445837/TwitterAuto.meta.js
// ==/UserScript==

(function() {
    'use strict';
	//程序入口-main
	var pageurl = window.location.href.split('//')[1].split('?')[0];
	var automatic = getQueryString("automatic");
    $(function () {
		pageOperate()
	})
    // Your code here...
	function pageOperate() {
        var pageurl = window.location.href.split('//')[1].split('?')[0];
		var automatic = getQueryString("automatic");
		switch (pageurl) {
                case 'twitter.com/settings/profile':
                    setTimeout(function(){
					if(automatic == 'setName'){
                        var nameStr = Faker.Name.findName().replace(' ','').replace(' ','').replace(' ','')
                        changeInputValue($("input[name='displayName']")[0],nameStr)
                        setTimeout(function(){
                            $('div[data-testid="Profile_Save_Button"]')[0].click()
                        },2000)
                    }
                },2000)
                break;

		}
	}
    function nullfun(){
        document.getElementById("captcha__form").submit()
    }
    function logcallback(){
        var userLogin =  $('button[type="submit"]')
        if(userLogin && userLogin.length>0){
            userLogin[0].click()
        }
    }

	function jihuoPage(url){
		unsafeWindow.location.href = url;
	}

    function changeInputValue(inputDom,newText){
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

    function hcaptchaAuto(selfsitekeycap,callback) {
        //去做h人机验证
        if (selfsitekeycap) {
            console.info('http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=hcaptcha&sitekey=' + selfsitekeycap + '&pageurl=https://expo.chikoroko.art');
            GM_xmlhttpRequest({
                url: 'http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=hcaptcha&sitekey=' + selfsitekeycap + '&pageurl=https://expo.chikoroko.art',
                method: "GET",
                data: "",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                onload: function (capdata) {
                    console.info(capdata.responseText);
                    var capcode = capdata.responseText;
                    if (capcode && capcode.split('|').length > 1) {
                        capcode = capcode.split('|')[1];
                        var codeEnd = '';
                        var inal = setInterval(function () {
                            console.info('开始执行');
                            console.info('http://2captcha.com/res.php?key=713882cc1979e7de38a57e9870ce616f&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString())
                            GM_xmlhttpRequest({
                                url: 'http://2captcha.com/res.php?key=713882cc1979e7de38a57e9870ce616f&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString(),
                                method: "GET",
                                data: "",
                                headers: {
                                    "Content-type": "application/x-www-form-urlencoded"
                                },
                                onload: function (capcoderes) {
                                    if (capcoderes.responseText && capcoderes.responseText.length > 50 && capcoderes.responseText.split('|').length > 1) {
                                        clearInterval(inal);
                                        codeEnd = capcoderes.responseText.split('|')[1];
                                        //赋值
                                        console.info('谷歌验证请求code', codeEnd)
                                        console.info('谷歌验证请求unsafeWindow', unsafeWindow)
                                        $('textarea').show();
                                        $('textarea').val(codeEnd);
                                        for (var key in unsafeWindow) {
                                            if (key.indexOf('hcaptchaCallback') > -1) {
                                                console.info('找到了回调方法+++++', key);
                                                eval(key + '("' + codeEnd + '")');
                                                break;
                                            }
                                        }
                                        callback()
                                        //___grecaptcha_cfg.clients['0']['l']['l'].callback(codeEnd)
                                        console.info('H验证请求成功')
                                    }
                                    //console.info(capcoderes.responseText);
                                }
                            });

                        }, 1000);
                    }
                }
            });
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