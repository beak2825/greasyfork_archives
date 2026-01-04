// ==UserScript==
// @name         华南师大快速登陆
// @version      1.2
// @description  当你未登录时，帮你自动进入统一认证登陆页面，免去点击各种登陆按钮。
// @author       LittleboyHarry
// @match        *://moodle.scnu.edu.cn/*
// @match        https://ssp.scnu.edu.cn/*
// @match        *://www.scholat.com/*
// @grant        none
// @namespace https://greasyfork.org/users/457866
// @downloadURL https://update.greasyfork.org/scripts/397776/%E5%8D%8E%E5%8D%97%E5%B8%88%E5%A4%A7%E5%BF%AB%E9%80%9F%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/397776/%E5%8D%8E%E5%8D%97%E5%B8%88%E5%A4%A7%E5%BF%AB%E9%80%9F%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const storageKeyForRecoverHref = '#scnu_qucik_login.save_href'

const tipsElementDefaultStyle = `
background: #00000055;
position: fixed;
top: 0;
bottom: 0;
left: 0;
right: 0;
z-index: 32;
display: flex;
justify-content: center;
align-items: center;
font-size: 32px;
color: white;
text-shadow: 0 0 8px black;
`

/** @summary 只在这些站点启动自动 URL 保存 */
const hostnames = ["www.scholat.com"]

function prepareJump() {
	return new Promise(resolve => {
		//#region 提示自动跳转
		const tipsElement = document.createElement("div");
		tipsElement.style = tipsElementDefaultStyle;
		tipsElement.innerText = "… 自动跳转 …";
		document.body.appendChild(tipsElement);
		//#endregion

		//#region 保存 href
		if (hostnames.indexOf(location.hostname) !== -1)
			if (!sessionStorage.getItem(storageKeyForRecoverHref))
				sessionStorage.setItem(storageKeyForRecoverHref, location.href)
		//#endregion

		resolve();
	})
}

//#region 会话恢复控制
/** @summary 不要在这些页面恢复 */
const loginPaths = ["/login.html"]

const recoverHref = sessionStorage.getItem(storageKeyForRecoverHref)
if (recoverHref && loginPaths.indexOf(location.pathname) === -1)
	prepareJump().then(() => {
		sessionStorage.removeItem(storageKeyForRecoverHref)
		location.href = recoverHref
	})
//#endregion

/** @type {?HTMLAnchorElement} */
const { hostname } = location
switch (hostname) {
	case 'moodle.scnu.edu.cn':
		{
			const loginButton = document.querySelector(
				'.profileblock a[href$="login/index.php"]'
			);

			if (loginButton)
				prepareJump().then(() => {
					loginButton.click();
				})
			else if (location.pathname === "/login/index.php") {
				const frameHook = () => {
					const ssoButton = document.getElementById("ssobtn");
					if (ssoButton)
						prepareJump().then(() => {
							ssoButton.click();
						})
					else requestAnimationFrame(frameHook);
				};
				frameHook();
			}
		}
		break;
	case 'ssp.scnu.edu.cn':
		{
			const loginSpanElement = document.getElementById('gologin')
			if (loginSpanElement)
				prepareJump().then(() => {
					loginSpanElement.children[1].click();
				})
		}
		break;
	case 'www.scholat.com':
		{
			const loginButton = document.getElementById('loginHref')
			const loginBox = document.getElementById('portal_nologin')
			if (loginBox && loginBox.style.display === 'none') loginButton = null
			if (loginButton)
				prepareJump().then(() => {
					loginButton.click();
				});
		}
		break;
}


})();