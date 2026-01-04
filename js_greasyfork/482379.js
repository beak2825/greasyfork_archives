// ==UserScript==
// @name         同济大学自动登录与验证码获取
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  使用浏览器自动填充密码时，使得同济大学相关页面可以自动登录，不需要点击登录按钮。支持加强认证自动选择邮箱并监听验证码输入。手动输入密码请勿使用该脚本。
// @author       gshcpp
// @match        https://iam.tongji.edu.cn/idp/authcenter/*
// @match        https://mail.tongji.edu.cn/*
// @grant        window.focus
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/482379/%E5%90%8C%E6%B5%8E%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E4%B8%8E%E9%AA%8C%E8%AF%81%E7%A0%81%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/482379/%E5%90%8C%E6%B5%8E%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E4%B8%8E%E9%AA%8C%E8%AF%81%E7%A0%81%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// 定义延迟常量
	const CHECK_INTERVAL_MS = 100;
	const VERIFY_CHECK_INTERVAL_MS = 500;

	// 标记变量，用于控制验证码流程
	let isAuthTabOpened = false;
	let isVerifyCodeTabOpening = false;

	// 网站和XPath对应的列表
	const siteXPaths = {
		'iam.tongji.edu.cn': {
			usernameFieldXPath: '//*[@id="j_username"]',
			passwordFieldXPath: '//*[@id="j_password"]',
			loginButtonXPath: '//*[@id="loginButton"]',
			// 加强认证相关XPath
			authMethodSelectXPath: '//*[@id="sel_auth_method"]',
			sendVerifyCodeButtonXPath: '//*[@id="smsBtn"]',
			verifyCodeInputXPath: '//*[@id="authcode"]',
			verifyCodeSubmitButtonXPath: '//*[@class="white loginBt" and @type="button" and onclick="validateLoginFieldSMS(\'authen4Form\')"]'
		},
		'mail.tongji.edu.cn': {
			usernameFieldXPath: '//*[@id="uid"]',
			passwordFieldXPath: '//*[@id="password"]',
			loginButtonXPath: '//form[@class="j-login-form u-form"]/div[3]/button'
		}
		// 在此添加更多网站和对应的XPath
	};

	// 获取当前网站的域名
	const currentDomain = window.location.hostname;

	// 选择当前网站的XPath配置
	const currentSiteXPath = siteXPaths[currentDomain];

	// 监听验证码输入框
	function monitorVerifyCodeInput() {
		if (currentDomain === 'iam.tongji.edu.cn') {
			const verifyCodeInput = document.evaluate(currentSiteXPath.verifyCodeInputXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			
			if (verifyCodeInput) {
				console.log('找到验证码输入框，添加监听');
				
				// 验证码自动提交函数
				const submitVerifyCode = function() {
					if (verifyCodeInput.value && verifyCodeInput.value.length === 6 && /^\d{6}$/.test(verifyCodeInput.value)) {
						console.log('验证码已输入6位，准备提交');
						
						// 点击提交按钮
						const verifyCodeSubmitButton = document.evaluate(currentSiteXPath.verifyCodeSubmitButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
						if (verifyCodeSubmitButton) {
							console.log('自动点击提交按钮');
							verifyCodeSubmitButton.click();
						} else {
							console.warn('未找到验证码提交按钮');
						}
					}
				};
				
				// 监听输入事件
				verifyCodeInput.addEventListener('input', submitVerifyCode);
				
				// 监听粘贴事件
				verifyCodeInput.addEventListener('paste', function() {
					// 粘贴后内容需要时间生效，延迟检查
					setTimeout(submitVerifyCode, 50);
				});
			} else {
				// 如果未找到输入框，稍后再试
				setTimeout(monitorVerifyCodeInput, VERIFY_CHECK_INTERVAL_MS);
			}
		}
	}

	// 处理加强认证页面
	function handleAuthVerification() {
		// 检查是否在认证页面
		const authMethodSelect = document.evaluate(currentSiteXPath.authMethodSelectXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		
		if (authMethodSelect) {
			// 选择邮箱选项
			// 遍历select中的option，找到包含"邮箱"的选项
			for (let i = 0; i < authMethodSelect.options.length; i++) {
				if (authMethodSelect.options[i].textContent.includes('邮箱')) {
					authMethodSelect.selectedIndex = i;
					// 触发change事件
					const event = new Event('change', { bubbles: true });
					authMethodSelect.dispatchEvent(event);
					break;
				}
			}
			
			// 点击发送验证码按钮
			const sendVerifyCodeButton = document.evaluate(currentSiteXPath.sendVerifyCodeButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (sendVerifyCodeButton) {
				sendVerifyCodeButton.click();
				
				// 在新标签页中打开邮箱（仅打开一次）
				if (!isAuthTabOpened && !isVerifyCodeTabOpening) {
					isVerifyCodeTabOpening = true;
					setTimeout(() => {
						window.open('https://mail.tongji.edu.cn/', '_blank');
						isAuthTabOpened = true;
						isVerifyCodeTabOpening = false;
					}, 1000);
				}
				
				// 开始监听验证码输入框
				setTimeout(monitorVerifyCodeInput, 1000);
			}
		}
	}

	// 检测自动填充的函数
	function checkAutofill() {
		if (!currentSiteXPath) {
			console.warn('No XPath configuration found for this site:', currentDomain);
			return;
		}

		// 获取用户名输入框
		var usernameField = document.evaluate(currentSiteXPath.usernameFieldXPath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
		// 获取密码输入框
		var passwordField = document.evaluate(currentSiteXPath.passwordFieldXPath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
		// 获取登录按钮
		var loginButton = document.evaluate(currentSiteXPath.loginButtonXPath, document, null, XPathResult.ANY_TYPE, null).iterateNext();

		// 如果用户名输入框、密码输入框和登录按钮都存在
		if (usernameField && passwordField && loginButton) {
			// 检查用户名和密码输入框是否被自动填充
			if (usernameField.value !== '' && passwordField.value !== '') {
				// 点击登录按钮
				loginButton.click();
				
				// 如果是统一认证页面，等待可能出现的加强认证
				if (currentDomain === 'iam.tongji.edu.cn') {
					setTimeout(handleAuthVerification, 1000);
				}
			} else {
				// 如果没有被自动填充，再次检查
				setTimeout(checkAutofill, CHECK_INTERVAL_MS);
			}
		} else {
			// 如果元素不存在，也再次检查
			setTimeout(checkAutofill, CHECK_INTERVAL_MS);
		}
	}

	// 根据当前域名执行不同的初始化
	if (currentDomain === 'iam.tongji.edu.cn') {
		// 开始检测自动填充
		setTimeout(checkAutofill, CHECK_INTERVAL_MS);
		// 检查是否已经在加强认证页面
		setTimeout(handleAuthVerification, 1000);
		// 监听验证码输入
		setTimeout(monitorVerifyCodeInput, 1500);
	} else if (currentDomain === 'mail.tongji.edu.cn') {
		// 只在邮箱页面执行自动登录
		setTimeout(checkAutofill, CHECK_INTERVAL_MS);
	}
})();