// ==UserScript==
// @name         JXNU jxnu_stu 校园网登录页面自动化
// @description  当打开江西师大校园网的登录页面时，可以设置自动输入账号密码和运营商，以及自动登录。
// @namespace    leawind
// @version      1.2.2
// @author       leawind
// @include      http://172.16.8.8/*
// @grant        unsafeWindow
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452212/JXNU%20jxnu_stu%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/452212/JXNU%20jxnu_stu%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

(function () {
	'use strict';

	let config = loadConfig();
	injectElements();

	if (/已用时长/.exec(document.querySelector('#login-form').innerText) == null)
		window.addEventListener('load', () => {
			let username = $('#username')[0],
				password = $('#password')[0],
				domain = $('#domain'),
				login_button = $('#login')[0];
			try {
				if (config.autoInput) {
					username.value = config.username;
					password.value = config.password;
					domain.val(config.domain);
					if (config.username && config.password && config.autoClick) login_button.click();
				}
			} catch (e) {
				console.error(e);
			}
			username.addEventListener('input', e => {
				if (e.target.value) config.username = e.target.value;
				saveConfig();
			});
			password.addEventListener('input', e => {
				if (e.target.value) config.password = e.target.value;
				saveConfig();
			});
			domain[0].addEventListener('input', e => {
				config.domain = e.target.value;
				saveConfig();
			});
		});
	else
		document.querySelector('#logout').addEventListener('click', e => {
			config.autoClick = false;
			saveConfig();
		});

	function loadConfig() {
		try {
			return JSON.parse(localStorage.config);
		} catch (e) {
			return {
				currentProfile: 0,
				autoInput: true,
				autoClick: false,
				username: '',
				password: '',
				domain: '@cmcc',
			};
		}
	}

	function injectElements() {
		let ele_menu = document.createElement('div');
		ele_menu.id = 'leawind-menu';
		document.body.appendChild(ele_menu);
		ele_menu.isOpen = false;
		ele_menu.onchange = saveConfig;
		ele_menu.innerHTML = `<style>
input[type="checkbox"] {
	-webkit-appearance: none;
	appearance: none;
	width: 4em;
	height: 2em;
	position: relative;
	border-radius: 1em;
	cursor: pointer;
	background-color: #aaa;
	transition: background linear 200ms;
}
input[type="checkbox"]:before {
	content: "";
	position: absolute;
	width: 1.6em;
	height: 1.6em;
	background: white;
	left: 0.2em;
	top: 0.2em;
	border-radius: 100%;
	transition: left cubic-bezier(0.3, 1.5, 0.7, 1) 120ms;
}
input[type="checkbox"]:checked {
	background-color: rgb(93, 93, 246);
}
input[type="checkbox"]:checked:before {
	left: 2.2em;
}
input[type="checkbox"]:checked:after {
	color: black;
}
 
#leawind-menu{
	display: block;
	position: fixed;
	left: 2vmin;
	top: 2vmin;
	transition: width 150ms, height 150ms;
	background: #fff;
	border-radius: 1vmin;
	width:4vmin;
	height: 4vmin;
	box-shadow: 0.2vmin 0.2vmin 8px -0.3vmin #000;
	overflow: hidden;
	z-index: 25565;
	font-size: 1.28vmin;
}
#leawind-menubtn{
	width: 4vmin;
	height: 4vmin;
	display: inline-block;
	border-radius: 1vmin 0 1vmin 0;
	background: #00f;
	cursor: pointer;
	z-index: 25566;
}
 
#leawind-settings{
	display: block;
}
.leawind-option{
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 0.7em 0;
	box-shadow: 0 0.5vmin 10px -0.7vmin #888;
}
.leawind-text{
	font-size: 1.5em;
}
.leawind-cpr{
	font-size: 0.8em;
	line-height: 1.2em;
	margin: 1em 2em;
	text-align: center;
	opacity: 0.5;
}
#leawind-menutop{
	display: flex;
	align-items: center;
}
#leawind-help{
	display: none;
	z-index: 25562;
	font-size: 1.8vmin;
	line-height: 1.2em;
	margin: 0 1em;
	color: #44f;
	cursor: pointer;
}
</style>
 
<div id="leawind-menutop">
	<canvas id="leawind-menubtn"></canvas>
	<div id="leawind-help">help</div>
</div>
<div id="leawind-settings">
	<div class="leawind-option">
		<span class="leawind-text">自动输入账号密码</span> <input type="checkbox" id="leawind-settings-autoinput"> 
	</div>
	<div class="leawind-option">
		<span class="leawind-text">自动点击登录按钮</span> <input type="checkbox" id="leawind-settings-autoclick"> 
	</div>
</div>
<div class="leawind-cpr">© 2022 - LEAWIND No Rights Reserved.</div>
`;

		const ele_menubtn = ele_menu.querySelector('#leawind-menubtn');
		const ele_autoinput = ele_menu.querySelector('#leawind-settings-autoinput');
		const ele_autoclick = ele_menu.querySelector('#leawind-settings-autoclick');
		ele_menubtn.onpointerdown = e => {
			toggleMenu();
			e.cancelBubble = true;
			e.preventDefault();
		};
		ele_autoinput.checked = !!config.autoInput;
		ele_autoclick.checked = !!config.autoClick;
		ele_autoinput.onclick = e => {
			config.autoInput = !!e.target.checked;
		};
		ele_autoclick.onclick = e => {
			config.autoClick = !!e.target.checked;
		};

		document.body.addEventListener('click', function (e) {
			if (ele_menu.isOpen && !ele_menu.contains(e.target)) toggleMenu();
		});
		function toggleMenu() {
			ele_menu.isOpen = !ele_menu.isOpen;
			ele_menu.style.width = ele_menu.isOpen ? '36vmin' : '4vmin';
			ele_menu.style.height = ele_menu.isOpen ? '18vmin' : '4vmin';
		}
	}

	function saveConfig() {
		try {
			localStorage.config = JSON.stringify(config);
		} catch (e) {
			console.error(e);
		}
	}
})();
