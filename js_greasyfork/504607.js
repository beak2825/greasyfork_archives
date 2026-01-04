// ==UserScript==
// @name         Better Hydro
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Improve the Hydro interface with custom settings!
// @author       Cheerimy
// @match        *://hydro.ac/*
// @match        *://goj.wiki/*
// @match        *://oiclass.com/*
// @match        *://www.oiclass.com/*
// @match        *://106.53.100.188:10024/*
// @icon         https://s21.ax1x.com/2024/08/22/pAi6KDP.png
// @grant        none
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/504607/Better%20Hydro.user.js
// @updateURL https://update.greasyfork.org/scripts/504607/Better%20Hydro.meta.js
// ==/UserScript==

(function() {
	'use strict';
	//Cookies 初始化函数
	function setCookieIfNotExists(name, value) {
		if (!document.cookie.split('; ').map(cookie => cookie.split('=')[0]).includes(name)) {
			document.cookie = `${name}=${encodeURIComponent(value)};path=/;expires=${new Date(Date.now()+365*24*60*60*1000).toUTCString()}`
		}
	}
	//获取 Cookies 模块
	function getCookie(name) {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? decodeURIComponent(match[2]) : null
	}
	//初始化 Cookies 模块
	function initCookies() {
		setCookieIfNotExists('browserupdateorg', 'pause');
		setCookieIfNotExists('background', 'https://api.imlazy.ink/mcapi/mcbg.php');
		setCookieIfNotExists('music', '//music.163.com/outchain/player?type=2&id=133567&auto=0&height=66');
		console.log('Cookies 模块加载成功！');
	}
	//基本模块（欢迎栏与 UI 优化）
	function loadWelcomeMessage() {
		const username = Array.from(document.querySelectorAll('li[data-dropdown-target="#menu-nav-user"]')).map(item => item.querySelector('a')).find(link => link && link.textContent.trim() !== 'Language')?.textContent.trim() || 'Visitor';
		const panel = document.getElementById('panel');
		panel.style.backgroundImage = `url(${getCookie('background')})`;
		panel.style.backgroundSize = 'cover';
		panel.style.backgroundPosition = 'center';
		const style = document.createElement('style');
		style.textContent = `.section{border-radius:8px!important;opacity:0.75!important}.section:hover{opacity:1!important}.section__table-header{border-radius:8px 8px 0 0;opacity:0.75!important}.section__table-header:hover{opacity:1!important}`;
		document.head.append(style);
        const title=document.title;
        const name=title.split(" - ").pop().trim();
		const newHTML = `<div class="section visible"><div class="section__header"><h1 class="section__title">欢迎 ${username} 来到 ${name}！</h1><h1 class="section__title"style="text-align: end;">Let's Coding Now!</h1></div></div>`;
		const main = panel.querySelector('.main');
		const element = main.querySelector('div');
		element.insertAdjacentHTML('afterbegin', newHTML);
		console.log('基本模块加载成功！');
	}
	//音乐模块（播放音乐源音乐）
	function loadMusicPlayer() {
		const musicURL = getCookie('music');
		const musicHTML = `<div class="section side visible"><div class="section__header"><h1 class="section__title">一首歌曲</h1></div><div class="section__body typo"><iframe frameborder="no"border="0"marginwidth="0"marginheight="0"width="100%"height="86"src="${musicURL}"></iframe></div></div>`;
		const row = document.getElementById('panel').querySelector('.main').querySelector('.row');
		const divs = row.querySelectorAll(':scope > div');
		divs.forEach(div => {
			const className = div.className;
			if (className.includes('medium-3') && className.includes('columns')) {
				div.insertAdjacentHTML('afterbegin', musicHTML)
			}
		});
		console.log('音乐播放器加载成功！')
	}
	//个性化面板模块
	function loadSettingsPanel() {
        const regex = /^https?:\/\/[^\/]+\/setup$/;
        if (regex.test(window.location.href))
        {
            const mainContent = document.querySelector('.main');
            mainContent.id = 'setting';
            mainContent.innerHTML = `<style>.input-group{display:flex;flex-direction:column;gap:10px;max-width:400px;margin:0 auto}.input-group label{font-size:14px;color:#333}.input-group input[type="text"]{padding:8px;font-size:14px;border:1px solid#ccc;border-radius:4px;width:100%;box-sizing:border-box}.input-group input[type="text"]::placeholder{color:#999}</style><div class="section__body typo"><div class="input-group"><h1 class="section__title">设置</h1><label for="background-url">背景图片：</label><input type="text"id="background-url"placeholder="输入背景图片地址"><button id="save-background">保存背景</button><label for="music-url">音乐地址：</label><input type="text"id="music-url"placeholder="输入音乐播放器地址"><button id="save-music">保存音乐</button></div></div>`;
            const setCookie = (name, value, days = 365) => {
                const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
                document.cookie = `${name}=${value};expires=${expires};path=/`
            };
            const saveInput = (inputId, cookieName) => {
                const input = document.getElementById(inputId);
                if (input) {
                    setCookie(cookieName, input.value)
                } else {
                    console.error(`Element#${inputId}not found`)
                }
            };
            document.getElementById('save-background').onclick = () => saveInput('background-url', 'background');
            document.getElementById('save-music').onclick = () => saveInput('music-url', 'music');
            console.log('个性化面板模块加载成功！')
        }else
        {
            const settingDiv = document.createElement('div');
            settingDiv.innerHTML = `<a class="section__title" href="/setup">前往设置</a>`;
            const omnibarContent = document.getElementById('omnibar-content');
            omnibarContent.insertAdjacentElement('afterend', settingDiv);
            console.log('个性化面板引导模块加载成功！')
        }
	}
	//尝试加载 Cookies 模块
	try {
		initCookies();
	} catch (error) {
		console.error('Cookies 模块加载失败，错误：:', error);
	}
	//尝试加载基础模块
	try {
		loadWelcomeMessage();
	} catch (error) {
		console.error('基础模块加载失败，错误：:', error);
	}
	//尝试加载音乐模块
	try {
		loadMusicPlayer();
	} catch (error) {
		console.error('音乐模块加载失败，错误：:', error);
	}
	//尝试个性化面板面板模块
	setTimeout(function() {
		try {
			loadSettingsPanel();
		} catch (error) {
			console.error('个性化面板模块加载失败，错误：:', error);
		}
	}, 2000);
})();