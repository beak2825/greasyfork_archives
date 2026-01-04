// ==UserScript==
// @name         微信读书加宽可视范围和几个白色主题的护眼模式
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  将宽度改的更宽，看起来舒服一些,在url地址栏加参数，自定义程度高一些，也添加了几个白色主题下的背景颜色，对眼睛更友好写吧
// @author       yehuda
// @icon         https://rescdn.qqmail.com/node/wr/wrpage/style/images/independent/favicon/favicon_32h.png
// @match        https://weread.qq.com/web/reader/*
// @match      *://https://weread.qq.com/web/reader/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458095/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%8A%A0%E5%AE%BD%E5%8F%AF%E8%A7%86%E8%8C%83%E5%9B%B4%E5%92%8C%E5%87%A0%E4%B8%AA%E7%99%BD%E8%89%B2%E4%B8%BB%E9%A2%98%E7%9A%84%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/458095/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%8A%A0%E5%AE%BD%E5%8F%AF%E8%A7%86%E8%8C%83%E5%9B%B4%E5%92%8C%E5%87%A0%E4%B8%AA%E7%99%BD%E8%89%B2%E4%B8%BB%E9%A2%98%E7%9A%84%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
	'use strict';
	// bg 为背景颜色
	// rbg为导航栏头部header的颜色
	// bgb为画布即阅读容器的背景颜色
	// bgbBar为打开抽屉侧边栏的背景颜色
	// 支持RGB、RGBA、十六进制等等格式
	const colors = [
		{ bg: 'rgba(236, 217, 172, 0.4)', rbg: 'rgba(243, 227, 188, 1)', bgb: 'rgba(251, 239, 209, 0.5)',bgbBar: '#dbdbdb', white: true },
		{
			bg: 'rgba(102, 128, 102, 0.1)',
			rbg: 'rgba(65, 94, 62, 1)',
			bgb: 'rgba(102, 128, 102, 0.25)',
			bgbbgbBar: '#dbdbdb',
			white: true
		},
		{ bg: '#b5b5b5', rbg: '#c5c5c5', bgb: '#dbdbdb',bgbBar: '#dbdbdb', white: true }
	];
	const getUrlParam = (name, url) => {
		let qs = arguments[1] || window.location.href,
			reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
			r = qs.substr(qs.indexOf('?') + 1).match(reg);
		if (r !== null) {
			let i = decodeURI(r[2]).indexOf('#');
			if (i !== -1) {
				return decodeURI(r[2]).substring(0, i);
			} else {
				return decodeURI(r[2]);
			}
		} else {
			return '';
		}
	};
	const tarWidth = getUrlParam('w') || '1500';
	const tartoolsMargin = getUrlParam('m') || '800';
	const fontSize_range = getUrlParam('r') || '-75';
	const routerViewDOM = document.getElementById('routerView');
	if (routerViewDOM) {
		// 主体内容宽度
		const app_contentTarDOM = routerViewDOM.getElementsByClassName('app_content').item(0);
		if (app_contentTarDOM) {
			app_contentTarDOM.style.maxWidth = tarWidth ? `${tarWidth}px` : ``;
			const readerTopBarDOM = routerViewDOM.getElementsByClassName('readerTopBar').item(0);
			if (readerTopBarDOM) {
				readerTopBarDOM.style.maxWidth = tarWidth ? `${tarWidth}px` : ``;
			}
		}
		// 功能栏定位
		const readerControlsDOM = routerViewDOM.getElementsByClassName('readerControls').item(0);
		if (readerControlsDOM) {
			readerControlsDOM.style.marginLeft = tartoolsMargin ? `${tartoolsMargin}px` : ``;
			// 字体大小设置
			const fontSizerangeDOM = routerViewDOM.getElementsByClassName('readerControls_fontSize').item(0);
			if (fontSizerangeDOM) {
				// 大小选择栏位置
				fontSizerangeDOM.addEventListener(
					'click',
					(e) => {
						e.stopPropagation();
						fontSizerangeDOM.style.transition = `none`;
						fontSizerangeDOM.style.transform = `translateX(${fontSize_range}px)`;
					},
					false
				);
				document.addEventListener('click', () => {
					fontSizerangeDOM.style.transition = `none`;
					fontSizerangeDOM.style.transform = ``;
				});
			}
		}
	}
	// 两个弹框设置成紧贴右边
	const readerCatalogDOM = document.getElementsByClassName('readerCatalog').item(0);
	const readerNotePaneltDOM = document.getElementsByClassName('readerNotePanel').item(0);
	if (readerCatalogDOM && readerCatalogDOM.style) {
		readerCatalogDOM.style.left = 'unset';
		readerCatalogDOM.style.right = '0';
		readerNotePaneltDOM.style.left = 'unset';
		readerNotePaneltDOM.style.right = '0';
	}

	setTimeout(load, 100);

	function load() {
		const style = getStyleStr();
		document.head.innerHTML = document.head.innerHTML + style;
		init();
		// 注销下载app按钮绑定的事件
		let appDownloadbutton = document.querySelector('[title="下载App"]');
		// 获取改变主体颜色的按钮
		let themeButton = document.querySelector('[title="深色"]') || document.querySelector('[title="浅色"]');
		themeButton.addEventListener('click', () => {
			removeEventListeners(appDownloadbutton);
			if (themeButton.title == '深色') {
				addWatchThemeChange();
			}
			removeStyle();
		});
		removeEventListeners(appDownloadbutton);
		addWatchThemeChange();
		// 添加主体样式监听
		function addWatchThemeChange() {
			appDownloadbutton = document.querySelector('[title="下载App"]');
			appDownloadbutton.addEventListener('click', function () {
				const body = document.body;
				const mode = body.getAttribute('color-mode');
				let nextMode = null;
				if (!mode) {
					nextMode = 0;
					body.classList.add('wr-mode-0');
					body.setAttribute('color-mode', 0);
				} else {
					nextMode = parseInt(mode) + 1;
					if (nextMode >= colors.length) {
						nextMode = 0;
					}
				}
				changeMode(nextMode, mode);
			});
		}
	}
	// 获取样式
	function init() {
		const localMode = localStorage.getItem('wr-mode');
		if (localMode) {
			changeMode(localMode);
		}
	}
	// 删除绑定的事件
	function removeEventListeners(element) {
		// 获取目标元素下的所有子孙元素
		const descendants = element.getElementsByTagName('*');

		// 移除目标元素上绑定的事件
		element.replaceWith(element.cloneNode(true));

		// 移除目标元素下的所有子孙元素上绑定的事件
		for (let i = 0; i < descendants.length; i++) {
			const clone = descendants[i].cloneNode(true);
			descendants[i].replaceWith(clone);
		}
	}
	// 删除自定义的护眼样式
	function removeStyle() {
		const body = document.body;
		colors.forEach((color, index) => {
			body.classList.remove('wr-mode-' + index);
			if (localStorage.getItem('wr-mode')) {
				localStorage.removeItem('wr-mode');
			}
		});
	}
	// 修改模式
	function changeMode(modeIndex, currentModeIndex = null) {
		const body = document.body;
		if (currentModeIndex) {
			body.classList.remove('wr-mode-' + currentModeIndex);
		}
		body.classList.add('wr-mode-' + modeIndex);
		body.setAttribute('color-mode', modeIndex);
		localStorage.setItem('wr-mode', modeIndex);
	}
	// 获取初始化样式
	function getStyleStr() {
		let style = '<style>';
		for (let i = 0; i < colors.length; i++) {
			const color = colors[i];
			style += `
              body.wr-mode-${i} .change-mode-plugins span{
                  color:${color.white ? '#2a2a2a' : '#b9b9ba'};
              }
              body.wr-mode-${i}{
                  background-color:${color.bg} !important;
              }
              body.wr-mode-${i} .readerTopBar {
                  background-color:${color.rbg} !important;
              }
              body.wr-mode-${i} .readerControls_item,body.wr-mode-${i} .readerControls_fontSize,body.wr-mode-${i} .app_content
              {
                  background-color:${color.bgb} !important;
              }
              body.wr-mode-${i} .readerCatalog {
                background-color:${color.bgbbgbBar} !important;
              }
              body.wr-mode-${i} .chapterItem_link {
                border: dashed #2a2a2a !important;
                border-width: 0 0 2px !important;
              }
              body.wr-mode-${i} .chapterItem_text {
                font-size: 18px !important;
              }
              body.wr-mode-${i} .readerNotePanel {
                background-color:${color.bgbbgbBar} !important;
              }
              body.wr-mode-${i} .sectionListItem_divider {
                border: dashed #2a2a2a !important;
                border-width: 0 0 2px !important;
              }
              body.wr-mode-${i} .readerNotePanelBottomBar {
                border: solid ${color.bgbBar} !important;
                border-width: 0 0 2px !important;
                background-color:${color.rbg} !important;
              }
          `;
			if (color.white) {
				style += `
                  body.wr-mode-${i} .readerFooter_button,body.wr-mode-${i} .readerFooter_button:hover{
                      background-color:${color.bg} !important;
                      color:#2a2a2a !important;
                  }
              `;
			}
		}
		style += '</style>';
		return style;
	}
})();
