// ==UserScript==
// @name         默认显示账号密码登录（首次不显示二维码）
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Default display account password login (QR code is not displayed for the first time).
// @author       lfeng
// @supportURL   https://github.com/lfeng1420/TamperMonkeyScript
// @match        *://auth.alipay.com/*
// @match        *://www.alipay.com/
// @match        *://passport.douyu.com/*
// @match        *://login.xiami.com/*
// @match        *://passport.xiami.com/*
// @match        *://www.xiami.com/*
// @match        *://pan.baidu.com/
// @match        *://passport.jd.com/*
// @match        *://kyfw.12306.cn/*
// @match        *://www.iqiyi.com/*
// @match        *://ziyuan.baidu.com/*
// @match        *://www.huya.com/*
// @match        *://www.acfun.cn/*
// @match        *://ssl.xui.ptlogin2.weiyun.com/*
// @match        *://xui.ptlogin2.qq.com/*
// @match        *://wenku.baidu.com/*
// @match        *://tieba.baidu.com/*
// @match        *://passport.baidu.com/*
// @match        *://www.baidu.com/*
// @match        *://passport.58.com/*
// @match        *://passport.csdn.net/*
// @match        *://www.tianya.cn/*
// @match        *://exmail.qq.com/*
// @match        *://login.taobao.com/*
// @match        *://passport.suning.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36707/%E9%BB%98%E8%AE%A4%E6%98%BE%E7%A4%BA%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95%EF%BC%88%E9%A6%96%E6%AC%A1%E4%B8%8D%E6%98%BE%E7%A4%BA%E4%BA%8C%E7%BB%B4%E7%A0%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/36707/%E9%BB%98%E8%AE%A4%E6%98%BE%E7%A4%BA%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95%EF%BC%88%E9%A6%96%E6%AC%A1%E4%B8%8D%E6%98%BE%E7%A4%BA%E4%BA%8C%E7%BB%B4%E7%A0%81%EF%BC%89.meta.js
// ==/UserScript==

(function () {
	'use strict';

	function getByClassName(szClsName, index, doc) {
		doc = doc || document;
		index = index || 0;
		var arrElements = doc.getElementsByClassName(szClsName);
		if (arrElements === null || arrElements.length === 0) {
			return null;
		}

		return arrElements[index];
	}

	function getById(id, doc) {
		doc = doc || document;
		return doc.getElementById(id);
	}

	function getByTagName(name, index, doc) {
		doc = doc || document;
		index = index || 0;
		var arrElements = doc.getElementsByTagName(name);
		if (arrElements === null || arrElements.length === 0) {
			return null;
		}

		return arrElements[index];
	}

	function hasClass(o, name) {
		if (o.classList === null || o.classList.length === 0) {
			return false;
		}

		for (var index = 0; index < o.classList.length; ++index) {
			if (o.classList[index] == name) {
				return true;
			}
		}

		return false;
	}

	/////////////////////////////////////////////////////

	function HandleMainXiami() {
		var element = getByClassName("modal-inner");
		if (element === null) {
			return false;
		}

		// login
		var loginBtn = getByClassName("login");
		loginBtn.click();
		return true;
	}

	function HandleMainAlipay() {
		// 移除video
		var video = getById("J_video_player");
		if (video !== null) {
			video.parentNode.removeChild(video);
		}

		var poster = getById("J_poster");
		if (poster !== null) {
			poster.parentNode.removeChild(poster);
		}

		// 条件：用户点了登录按钮
		var popbox = getById("J_popbox");
		if (!popbox || (popbox.getAttribute("class") !== "popbox stat-login")) {
			return false;
		}

		// 获取嵌套的iframe
		var iframe = getById("J_loginIframe");
		if (!iframe) {
			return false;
		}

		// contentWindow
		var frameDocument = iframe.contentDocument || iframe.contentWindow.document;
		if (!frameDocument) {
			return false;
		}

		// 切换按钮
		var qrcode = getById("J-qrcode-target", frameDocument);
		if (!qrcode) {
			return false;
		}

		// 点击
		qrcode.click();
		return true;
	}

	function HandleAuthAlipay() {
		var pathName = location.pathname;
		if (pathName == "/login/index.htm") {
			// 显示账密登录
			var loginForm = getById("J-login");
			if (loginForm !== null) {
				loginForm.setAttribute("class", "login login-modern");
			}
			// 隐藏扫码登录
			var qrCodeForm = getById("J-qrcode");
			if (qrCodeForm !== null) {
				qrCodeForm.setAttribute("class", "qrcode qrcode-modern  fn-hide");
			}

			// 修改标签
			var tabs = getById("J-loginMethod-tabs");
			if (tabs !== null) {
				var liArray = tabs.getElementsByTagName("li");
				for (var index = 0; index < liArray.length; ++index) {
					var liElement = liArray[index];
					if (liElement.innerText === "扫码登录") {
						liElement.setAttribute("class", "");
						continue;
					}
					if (liElement.innerText === "账密登录") {
						liElement.setAttribute("class", " active ");
						continue;
					}
				}
			}
		}
		else if (pathName == "/login/express.htm") {
			var loginMethod = getById("J-loginFormMethod");
			if (loginMethod === null) {
				return false;
			}

			var style = window.getComputedStyle(loginMethod);
			if (style === null) {
				return false;
			}
			var qrcode = getById("J-qrcode-target");
			if (qrcode === null) {
				return false;
			}

			qrcode.click();
		}

		return true;
	}

	function HandleDouyu() {
		// 获取按钮
		var element = getByClassName("scanicon-toLogin js-qrcode-switch");
		if (element === null) {
			return false;
		}

		// 点击按钮
		element.click();

		// 获取Form
		var formElement = getByClassName("login-form login-by-phoneNum");
		if (formElement !== null) {
			formElement.setAttribute("class", "login-form login-by-nickname");
		}

		// 修改标签
		var tabElement = getByClassName("loginbox-login-subtype");
		if (tabElement !== null) {
			var spanArray = tabElement.getElementsByTagName("span");
			for (var index = 0; index < spanArray.length; ++index) {
				var child = spanArray[index];
				if (child.innerText === "昵称登录") {
					child.setAttribute("class", "l-stype js-l-stype active");
					continue;
				}
				if (child.innerText === "手机登录") {
					child.setAttribute("class", "l-stype js-l-stype");
					continue;
				}
			}
		}

		return true;
	}

	function HandleXiami() {
		var switchBtn = getById("J_LoginSwitch");
		if (switchBtn === null) {
			return false;
		}

		switchBtn.click();
		return true;
	}

	function HandleBaiduYun() {
		var switchBtn = getById("TANGRAM__PSP_4__footerULoginBtn");
		if (switchBtn === null) {
			return false;
		}

		switchBtn.click();
		return true;
	}

	function Handlejd() {
		var qrcodeBtn = getByClassName("login-tab-l");
		if (qrcodeBtn === null) {
			return false;
		}
		var link = getByTagName("a", 0, qrcodeBtn);
		if (link === null) {
			return false;
		}

		if (link.getAttribute("class") != "checked") {
			return false;
		}

		var loginBtn = getByClassName("login-tab-r");
		if (loginBtn === null) {
			return false;
		}

		loginBtn.click();
		return true;
	}

	function Handle12306() {
		var loginCode = getByClassName("login-code");
		if (loginCode === null) {
			return false;
		}

		var style = loginCode.getAttribute("style");
		if (style.length !== 0 && style.indexOf("display: block;") == -1) {
			return false;
		}

		// 点击
		var loginBtn = getByClassName("login-hd-account");
		if (loginBtn !== null) {
			loginBtn.click();
		}

		// 隐藏二维码
		style = style.replace("display: block", "display: none");
		loginCode.setAttribute("style", style);

		return true;
	}

	function HandleIqiyi() {
		var elements = document.getElementsByClassName("login-frame");
		if (elements === null || elements.length === 0) {
			return false;
		}

		var hasLoginFrameFlag = false;
		var finalElement = null;
		for (var index = 0; index < elements.length; ++index) {
			var element = elements[index];
			if (element.getAttribute("class") == "login-frame" && element.getAttribute("data-loginele") == "codeLogin") {
				element.setAttribute("class", "login-frame dn");
				hasLoginFrameFlag = true;
			}

			if (element.getAttribute("data-loginele") == "passLogin") {
				finalElement = element;
			}
		}

		if (hasLoginFrameFlag && finalElement !== null) {
			finalElement.setAttribute("class", "login-frame");
		}

		return hasLoginFrameFlag;
	}

	function HandleHuya() {
		var obj = getByClassName("UDBSdkLgn-qrImage");
		if (obj === null) {
			return false;
		}
		if (obj.getAttribute("src") === null) {
			return false;
		}
		var normalLogin = getByClassName("UDBSdkLgn-inner account login");
		if (normalLogin !== null) {
			var classList = normalLogin.getAttribute("class");
			if (classList.indexOf("UDBSdkLgn-none") != -1) {
				classList = classList.replace("UDBSdkLgn-none", "");
				normalLogin.setAttribute("class", classList);
				var qrLogin = getByClassName("UDBSdkLgn-inner qrCode login");
				classList = qrLogin.getAttribute("class");
				qrLogin.setAttribute("class", classList + " UDBSdkLgn-none");
			}
		}

		return true;
	}

	function HandleAcfun() {
		var loginSwitch = getById("login-switch");
		if (loginSwitch === null) {
			return false;
		}
		loginSwitch.click();
		return true;
	}

	function HandleQQ() {
		var qlogin = getByClassName("web_qr_login");
		if (qlogin === null) {
			return false;
		}
		var style = qlogin.getAttribute("style");
		if (style === null) {
			return false;
		}
		if (style.indexOf("display: none") != -1) {
			var switchBtn = getById("switcher_plogin");
			if (switchBtn !== null) {
				switchBtn.click();
			}
		}
		return true;
	}

	function HandleBaiduZiyuan() {
		var switchBtn = getByClassName("tang-pass-footerBarULogin pass-link");
		if (switchBtn !== null) {
			switchBtn.click();
		}

		return (switchBtn !== null);
	}

	function HandleBaiduCommon() {
		var loginFrame = getById("passport-login-pop");
		if (loginFrame === null) {
			return false;
		}

		var loginStyle = loginFrame.getAttribute("style");
		if (loginStyle === null || loginStyle.indexOf("display: none") != -1) {
			return false;
		}

		var switchBtn = getByClassName("tang-pass-footerBarULogin pass-link", 0, loginFrame);
		if (switchBtn !== null) {
			switchBtn.click();
		}

		return true;
	}

	function Handle58() {
		var qrcodeLogin = getByClassName("qrcodelogin");
		if (qrcodeLogin === null) {
			return false;
		}
		var style = qrcodeLogin.getAttribute("style");
		if (style === null) {
			return false;
		}
		if (style.indexOf("display: block") != -1) {
			var switchBtn = getByClassName("qrcode");
			if (switchBtn !== null) {
				switchBtn.click();
			}
		}
	}

	function HandleBaiduPassport() {
		var switchBtn = getByClassName("tang-pass-footerBarULogin pass-link");
		if (switchBtn !== null) {
			switchBtn.click();
		}
		return (switchBtn !== null);
	}

	function HandleCsdn() {
		var elements = document.getElementsByClassName("text-tab border-right");
		if (elements === null || elements.length < 2) {
			return false;
		}
		var link = getByTagName("a", 0, elements[1]);
		if (link !== null) {
			link.click();
			return true;
		}
		return false;
	}

	function HandleTianya() {
		var wrapper = getById("loginWin_content_wrapper");
		if (wrapper === null) {
			return false;
		}
		if (wrapper.getAttribute("class") != "loginWin-normal-login-wrapper") {
			var button = getByClassName("normal-login-tab");
			if (button !== null) {
				button.click();
			}
		}
		return true;
	}

	function HandleExmail() {
		var elements = document.getElementsByClassName("nav_item js_verify_item");
		if (elements === null || elements.length === 0) {
			return false;
		}
		for (var index = 0; index < elements.length; ++index) {
			var element = elements[index];
			if (element.getAttribute("data-type") == "phone") {
				element.click();
			}
		}
		return true;
	}

	function HandleTaobao() {
		var imgElement = getByClassName("qrcode-img");
		if (imgElement === null) {
			return false;
		}
		var img = getByTagName("img", 0, imgElement);
		if (img === null) {
			return false;
		}
		var button = getById("J_Quick2Static");
		if (button === null) {
			return false;
		}
		button.click();
		return true;
	}

	function HandleSuning() {
		var img = getByClassName("qrCodesId");
		if (img === null) {
			return false;
		}
		var elements = document.getElementsByClassName("tab-item");
		if (elements === null || elements.length === 0) {
			return false;
		}
		for (var index = 0; index < elements.length; ++index) {
			var element = elements[index];
			if (element.innerText == "账户登录") {
				element.click();
			}
		}
		return true;
	}

	var handle_funcs =
	{
		"www.alipay.com": HandleMainAlipay,
		"auth.alipay.com": HandleAuthAlipay,
		"www.xiami.com": HandleMainXiami,
		"passport.douyu.com": HandleDouyu,
		"login.xiami.com": HandleXiami,
		"passport.xiami.com": HandleXiami,
		"pan.baidu.com": HandleBaiduYun,
		"passport.jd.com": Handlejd,
		"kyfw.12306.cn": Handle12306,
		"www.iqiyi.com": HandleIqiyi,
		"www.huya.com": HandleHuya,
		"www.acfun.cn": HandleAcfun,
		"ssl.xui.ptlogin2.weiyun.com": HandleQQ,
		"xui.ptlogin2.qq.com": HandleQQ,
		"ziyuan.baidu.com": HandleBaiduZiyuan,
		"wenku.baidu.com": HandleBaiduCommon,
		"tieba.baidu.com": HandleBaiduCommon,
		"www.baidu.com": HandleBaiduCommon,
		"passport.baidu.com": HandleBaiduPassport,
		"passport.58.com": Handle58,
		"passport.csdn.net": HandleCsdn,
		"www.tianya.cn": HandleTianya,
		"exmail.qq.com": HandleExmail,
		"login.taobao.com": HandleTaobao,
		"passport.suning.com": HandleSuning,
	};

	function commonFunc_Loop(func) {
        var retryCount = 0;
		var repeatAction = setInterval(function () {
			if (func()) {
				clearInterval(repeatAction);
				console.log("Handle '%s' Succ.", location.host);
			}
            if (++retryCount > 100) {
                clearInterval(repeatAction);
				console.log("Handle '%s' time out!", location.host);
            }
		}, 50);
	}

	function __Main() {
		if (handle_funcs[location.host] !== undefined) {
			commonFunc_Loop(handle_funcs[location.host]);
		}
	}

	__Main();
})();
