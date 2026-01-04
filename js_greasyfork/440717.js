// ==UserScript==
// @name         usascript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动获取页面原生并自动点击
// @author       ll
// @match        https://accounts.google.com/*
// @match        https://getuba.uba.finance/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/crypto-js/3.1.9-1/crypto-js.min.js
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
// @connect      pv.sohu.com
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
// @license		 lly
// @downloadURL https://update.greasyfork.org/scripts/440717/usascript.user.js
// @updateURL https://update.greasyfork.org/scripts/440717/usascript.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var cldata = {};
    $(function () {
        pageOperate();
	})

	function pageOperate() {
		var pageurl = window.location.href.split('//')[1].split('?')[0];		
		console.info(pageurl)
		switch (pageurl) {
			case 'getuba.uba.finance/register':              
            var hrepInter_regval = setInterval(function () {
                if ($('#hcap-script').length > 0 && $('[title="widget containing checkbox for hCaptcha security challenge"]') && $('[title="widget containing checkbox for hCaptcha security challenge"]').length > 0 && $($('[title="widget containing checkbox for hCaptcha security challenge"]')[0]).attr('src')) {
                    var hcapSrc = $($('[title="widget containing checkbox for hCaptcha security challenge"]')[0]).attr('src');
                    if (hcapSrc.split('#').length > 1 && hcapSrc.split('#')[1] && hcapSrc.split('#')[1].split('sitekey=').length > 1 && hcapSrc.split('#')[1].split('sitekey=')[1].split('&')[0]) {
                        var sitekeycap = hcapSrc.split('#')[1].split('sitekey=')[1].split('&')[0];//getUrlParamQueryString(hcapSrc.split('?')[1],'sitekey');
                        console.info(sitekeycap);  
                        clearInterval(hrepInter_regval);                   
                        hcaptchaAuto(sitekeycap);
                        
                        return;
                    }
                }
                },15000);
                break;  
            case 'getuba.uba.finance/mine':                
                var isstart_Interval = setInterval(function () {
                  console.log("监控是否停止");
                if($(".mineBox-btn").html().indexOf("Start")>-1 || $(".mineBox-btn").html().indexOf("start")>-1){
                   // alert($(".mineBox-btn").html().indexOf("Start"));
                   $(".mineBox-btn").click();
                 }
                },3000);
              break;
			default:                 
				console.info('default验证___grecaptcha_cfg', unsafeWindow.___grecaptcha_cfg)
				setTimeout(function () {
					if (unsafeWindow.___grecaptcha_cfg) {
						//queueRecaptchasel();
					}
				}, 5000)
				break;
		}
	}
    function verifyCode(){
        if($(".setNickName").find(".input-box").val()){
            alert("111")
            //var key=findRecaptchaClients();                    
            //bindmail();            
        }

    }
	function hcaptchasel() {

		console.log('hcaptcha available, lets redefine render method', unsafeWindow.hcaptcha.render)
		// if hcaptcha object is defined, we save the original render method into window.originalRender
		unsafeWindow.originalRender = unsafeWindow.hcaptcha.render
		// then we redefine hcaptcha.render method with our function
		unsafeWindow.hcaptcha.render = (container, params) => {
			console.log(container)
			console.log(params)
			// storing hcaptcha callback globally
			unsafeWindow.hcaptchaCallback = params.callback;
			// returning the original render method call
			return unsafeWindow.originalRender(container, params)
		}

	}
	function bindmail() {
		var hrepInterval = setInterval(function () {
			if (!$('[title="Main content of the hCaptcha challenge"]').parent().parent().attr("aria-hidden") || $('[title="Main content of the hCaptcha challenge"]').parent().parent().attr("aria-hidden") != 'true') {
				//hcaptchasel();
				clearInterval(hrepInterval);
				//进行人机验证
				console.info('进行人机验证');
				var sitekey = $('h-captcha').attr('sitekey');
				console.info('sitekey', sitekey);
				if (sitekey) {
					console.info('http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=hcaptcha&sitekey=' + sitekey + '&pageurl=https://coinlist.co/');
					GM_xmlhttpRequest({
						url: 'http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=hcaptcha&sitekey=' + sitekey + '&pageurl=https://coinlist.co/',
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
												console.info('谷歌验证请求成功')
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
		}, 1000);
		//判断是否有验证 时间延时


	}

	function hcaptchaAuto(selfsitekeycap) {
		//去做h人机验证
		if (selfsitekeycap) {
			console.info('http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=hcaptcha&sitekey=' + selfsitekeycap + '&pageurl=https://getuba.uba.finance/');
			GM_xmlhttpRequest({
				url: 'http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=hcaptcha&sitekey=' + selfsitekeycap + '&pageurl=https://getuba.uba.finance/',
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
	//采用正则表达式获取地址栏参数
	function getQueryString(name) {
		let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		let r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return decodeURIComponent(r[2]);
		};
		return null;
	}

	function getUrlParamQueryString(urlparam, name) {
		let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		let r = urlparam.match(reg);
		if (r != null) {
			return decodeURIComponent(r[2]);
		};
		return null;
	}
	function findRecaptchaClients() {
		// eslint-disable-next-line camelcase
		if (typeof (___grecaptcha_cfg) !== 'undefined') {
			// eslint-disable-next-line camelcase, no-undef
			return Object.entries(___grecaptcha_cfg.clients).map(([cid, client]) => {
				const data = { id: cid, version: cid >= 10000 ? 'V3' : 'V2' };
				const objects = Object.entries(client).filter(([_, value]) => value && typeof value === 'object');

				objects.forEach(([toplevelKey, toplevel]) => {
					const found = Object.entries(toplevel).find(([_, value]) => (
						value && typeof value === 'object' && 'sitekey' in value && 'size' in value
					));

					if (typeof toplevel === 'object' && toplevel instanceof HTMLElement && toplevel['tagName'] === 'DIV') {
						data.pageurl = toplevel.baseURI;
					}

					if (found) {
						const [sublevelKey, sublevel] = found;

						data.sitekey = sublevel.sitekey;
						const callbackKey = data.version === 'V2' ? 'callback' : 'promise-callback';
						const callback = sublevel[callbackKey];
						if (!callback) {
							data.callback = null;
							data.function = null;
						} else {
							data.function = callback;
							const keys = [cid, toplevelKey, sublevelKey, callbackKey].map((key) => `['${key}']`).join('');
							data.callback = `___grecaptcha_cfg.clients${keys}`;
						}
					}
				});
				return data;
			});
		}
		return [];
	}
})();