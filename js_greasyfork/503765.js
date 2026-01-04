// ==UserScript==
// @name              （改）B站成分检测器（键政贵物DLC）
// @version           1.35.9
// @author            hmjz100,xulaupuz,trychen
// @namespace         github.com/hmjz100
// @license           GPLv3
// @description       B站评论区自动标注成分，支持动态、发言历史、收藏、稿件和关注识别，默认标注包括原神、崩坏3、崩坏星穹铁道、明日方舟、碧蓝航线、Vtuber、Asoul、王者荣耀、三国杀、我的世界、迷你世界、初生科技。
// @match             *://*.bilibili.com/*
// @icon              data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABMLAAATCwAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A1qEAANahAADWoQAG1qEAb9ahAMvWoQD01qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD01qEAy9ahAG/WoQAG1qEAANahAADWoQAA1qEAG9ahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahANDWoQAb1qEAANahAAfWoQDQ1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahANHWoQAH1qEAbtahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAG7WoQDH1qEA/9ahAP/WoQD/1qEAtdahABjWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABvWoQC11qEA/9ahAP/WoQD/1qEAx9ahAPnWoQD/1qEA/9ahAP/WoQAZ1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABjWoQD/1qEA/9ahAP/WoQDz1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAErWoQDn1qEA5NahAErWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAErWoQDn1qEA5NahAErWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA59ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA59ahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA5tahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA5tahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQBJ1qEA5tahAObWoQBJ1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQBJ1qEA5tahAObWoQBJ1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA+dahAP/WoQD/1qEA/9ahABnWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAGdahAP/WoQD/1qEA/9ahAPjWoQDH1qEA/9ahAP/WoQD/1qEAttahABnWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABnWoQC21qEA/9ahAP/WoQD/1qEAx9ahAG3WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQBt1qEABtahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA0NahAAfWoQAA1qEAG9ahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAM/WoQAb1qEAANahAADWoQAA1qEABtahAG7WoQDH1qEA89ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA89ahAMfWoQBu1qEABtahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAA/WoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAA/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAAbWoQDF1qEA/9ahAP/WoQD/1qEA/9ahAMXWoQAP1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAAbWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAYtahAP/WoQD/1qEA/9ahAP/WoQDF1qEADtahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAY9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQBf1qEA/9ahAP/WoQD/1qEAxdahAA7WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQBf1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAATWoQCg1qEA6tahAKjWoQAO1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAKjWoQDr1qEAoNahAATWoQAA1qEAANahAADWoQAA1qEAAP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A///////////AAAADgAAAAQAAAAAAAAAAA///wAf//+AP///wD///8A////AP///wDw/w8A8P8PAPD/DwDw/w8A8P8PAPD/DwD///8A////AH///gA///wAAAAAAAAAAAgAAAAcAAAAP8A8A/+AfgH/gP8B/4H/gf+D/8H/////8=
// @connect           bilibili.com
// @connect           bing.com
// @grant             GM_xmlhttpRequest
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @grant   GM_getValue
// @grant   GM_setValue
// @require           https://unpkg.com/jquery@3.6.3/dist/jquery.min.js
// @require           https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.js
// @resource Swal     https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.css
// @resource SwalDark https://unpkg.com/@sweetalert2/theme-dark@5.0.15/dark.min.css
// @downloadURL https://update.greasyfork.org/scripts/503765/%EF%BC%88%E6%94%B9%EF%BC%89B%E7%AB%99%E6%88%90%E5%88%86%E6%A3%80%E6%B5%8B%E5%99%A8%EF%BC%88%E9%94%AE%E6%94%BF%E8%B4%B5%E7%89%A9DLC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/503765/%EF%BC%88%E6%94%B9%EF%BC%89B%E7%AB%99%E6%88%90%E5%88%86%E6%A3%80%E6%B5%8B%E5%99%A8%EF%BC%88%E9%94%AE%E6%94%BF%E8%B4%B5%E7%89%A9DLC%EF%BC%89.meta.js
// ==/UserScript==

$(function () {
	// 准备好sweetalert
	let toast = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		showCloseButton: true,
		timer: 2000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer);
		}
	});

	const message = {
		success: (text) => {
			toast.fire({title: text, icon: 'success'});
		},
		error: (text) => {
			toast.fire({title: text, icon: 'error'});
		},
		warning: (text) => {
			toast.fire({title: text, icon: 'warning'});
		},
		info: (text) => {
			toast.fire({title: text, icon: 'info'});
		},
		question: (text) => {
			toast.fire({title: text, icon: 'question'});
		}
	};

	// 增加CSS界面样式
	let base = {
		addStyle(id, tag, css) {
			tag = tag || 'style';
			let doc = document, styleDom = doc.getElementById(id);
			if (styleDom) styleDom.remove();
			let style = doc.createElement(tag);
			style.rel = 'stylesheet';
			style.id = id;
			tag === 'style' ? style.innerHTML = css : style.href = css;
			doc.getElementsByTagName('head')[0].appendChild(style);
		},

		addSwalStyle() {
			let color = "#574AB8";

			let swalcss = `
			.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:${color} transparent ${color} transparent }
			.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:${color};color:#fff;font-size:1em}
			.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px ${color}80 }
			.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}
			.swal2-timer-progress-bar{width:100%;height:.25em;background:${color}33 }
			.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:${color};color:#fff;line-height:2em;text-align:center}
			.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:${color} }
			.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:${color}}
			.swal2-popup {padding:0 0 1.25em;flex-direction:column}
			.swal2-close {position:absolute;top:0;right:0}
			div:where(.swal2-container) .swal2-html-container{margin: 1em 1.3em 0.3em;}
			.composition-badge {
				display: inline-flex;
 				justify-content: center;
 				align-items: center;
				width: fit-content;
 				background: #7367f026;
 				border-radius: 10px;
 				margin: 0 5px;
 				font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
				cursor: pointer;
			}

			.composition-name {
 				line-height: 13px;
 				font-size: 13px;
				color: ${color} !important;
				padding: 2px 8px;
			}

			.composition-icon {
				width: 25px;
				height: 25px;
				border-radius: 50%;
				border: 2px solid ${color}80;
				margin: -6px;
				margin-right: 5px;
			}

			.composition-badge-control {
				display: inline-flex;
				justify-content: center;
				align-items: center;
				width: fit-content;
				background: #00000008 !important;
				border-radius: 10px;
				margin: 0 5px;
				font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
			}

			.composition-name-control {
				line-height: 13px;
				font-size: 12px;
				color: #00000050 !important;
				padding: 2px 8px;
			}
			`;

			// 先监听颜色方案变化 SweetAlert2-Default
			window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
				if (e.matches) {
					// 切换到暗色主题
					this.addStyle('swal-pub-style', 'style', GM_getResourceText('SwalDark'));
				} else {
					// 切换到浅色主题
					this.addStyle('swal-pub-style', 'style', GM_getResourceText('Swal'));
				}
				this.addStyle('SweetAlert2-User', 'style', swalcss);
			});

			// 再修改主题 SweetAlert2-Default
			if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
				// 切换到暗色主题
				this.addStyle('swal-pub-style', 'style', GM_getResourceText('SwalDark'));
			} else {
				// 切换到浅色主题
				this.addStyle('swal-pub-style', 'style', GM_getResourceText('Swal'));
			}
			this.addStyle('SweetAlert2-User', 'style', swalcss);
		},
	};
	base.addSwalStyle();

	// 在这里配置要检查的成分，以及直接 拉黑（使用指定UID评论的人直接添加标签）。
	// 比如你要直接给指定UID添加一个标签，就这样写：blacklist: [401742377]
	const checkers = [
		{
			displayName: "抽奖",
			displayIcon: "data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik04NTQgMjA5Yy02LjQgMC0xMC4yLTcuMi02LjYtMTIuNSAxNS42LTIzLjIgMjMuMi00OC43IDIxLjUtNzQtMS45LTMwLjMtMTctNTYuNS00My43LTc1LjgtMTkuMi0xMy45LTQ0LjctMjQtNzEuNy0yOC42LTQ5LTguMi0xMDAuOSA1LjctMTQ2LjMgMzkuMy0yNC40IDE4LjEtNDYuNiA0MS4yLTY2LjQgNjkuMi0xMi43IDE3LjktMzkuNCAxNy45LTUyIDAtMTkuOC0yOC00Mi01MS4xLTY2LjQtNjkuMkMzNzcgMjMuOCAzMjUuMSA5LjggMjc2LjEgMTguMWMtMjcgNC42LTUyLjUgMTQuNy03MS43IDI4LjYtMjYuNyAxOS4zLTQxLjkgNDUuNS00My44IDc1LjgtMS42IDI1LjMgNS45IDUwLjggMjEuNiA3NCAzLjYgNS4zLTAuMSAxMi41LTYuNiAxMi41SDEyOEM1Ny4zIDIwOSAwIDI2Ni4zIDAgMzM3djEyOGMwIDE3LjcgMTQuMyAzMiAzMiAzMmgyNGM0LjQgMCA4IDMuNiA4IDh2NDQwYzAgMzUuMyAyOC43IDY0IDY0IDY0aDc2OGMzNS4zIDAgNjQtMjguNyA2NC02NFY1MDVjMC00LjQgMy42LTggOC04aDI0YzE3LjcgMCAzMi0xNC4zIDMyLTMyVjMzN2MwLTcwLjctNTcuMy0xMjgtMTI4LTEyOGgtNDJ6TTc0Mi45IDgxLjJjNi4xIDEgNjAgMTEuMSA2Mi4zIDQ1LjQgMS45IDI5LjktMzEuMSA2OS41LTg4IDgyLjRoLTEzOGMtNi4xIDAtOS45LTYuNS03LTExLjkgNTMuMS05Ni41IDEyMC41LTEyNC40IDE3MC43LTExNS45eiBtLTUxOC40IDQ1LjRjMi4yLTM0LjMgNTYuMS00NC4zIDYyLjMtNDUuNCA1MC4xLTguNCAxMTcuNiAxOS40IDE3MC43IDExNS45IDIuOSA1LjMtMC45IDExLjktNyAxMS45aC0xMzhjLTU2LjktMTMtOTAtNTIuNS04OC04Mi40ek00MDggOTQ1SDE0NGMtOC44IDAtMTYtNy4yLTE2LTE2VjUwNWMwLTQuNCAzLjYtOCA4LThoMjcyYzQuNCAwIDggMy42IDggOHY0MzJjMCA0LjQtMy42IDgtOCA4eiBtMTI4IDBoLTQ4Yy00LjQgMC04LTMuNi04LThWNTA1YzAtNC40IDMuNi04IDgtOGg0OGM0LjQgMCA4IDMuNiA4IDh2NDMyYzAgNC40LTMuNiA4LTggOHogbTM0NCAwSDYxNmMtNC40IDAtOC0zLjYtOC04VjUwNWMwLTQuNCAzLjYtOCA4LThoMjcyYzQuNCAwIDggMy42IDggOHY0MjRjMCA4LjgtNy4yIDE2LTE2IDE2eiBtNjQtNTEySDgwYy04LjggMC0xNi03LjItMTYtMTZ2LTgwYzAtMzUuMyAyOC43LTY0IDY0LTY0aDc2OGMzNS4zIDAgNjQgMjguNyA2NCA2NHY4MGMwIDguOC03LjIgMTYtMTYgMTZ6Ij48L3BhdGg+PC9zdmc+",
			keywords: ["互动抽奖","转发本条动态"],
		},
		{
			displayName: "原神",
			displayIcon: "https://i2.hdslb.com/bfs/face/d2a95376140fb1e5efbcbed70ef62891a3e5284f.jpg",
			keywords: ["互动抽奖 #原神","#原神","#米哈游#","#miHoYo#","原神","芙宁娜","白术","赛诺","神里绫人","神里绫华","夏洛蒂","珊瑚宫","心海","北斗","五郎","九条裟罗","雷神","班尼特","夜阑","夜兰","那维莱特","行秋","枫原万叶","万叶","钟离","纳西妲","香菱","锅巴","八重神子","久岐忍","菲谢尔","艾尔海森","胡桃","林尼","达达利亚","提纳里","宵宫","莫娜","甘雨","罗莎莉亚","刻晴","北斗","九条裟罗","温蒂","温迪","阿贝多","云堇","芭芭拉","可莉","迪卢克","烟绯","早柚","重云","米卡","雷泽","多莉","凝光","丽莎","坎蒂丝","安柏","辛焱"],
			followings: [401742377] // 原神官方号的 UID
		},
		{
			displayName: "崩坏3",
			displayIcon: "https://i0.hdslb.com/bfs/face/f861b2ff49d2bb996ec5fd05ba7a1eeb320dbf7b.jpg",
			keywords: ["互动抽奖 #崩坏3","#崩坏3","崩坏3"],
			followings: [27534330] // 崩坏3官方号的 UID
		},
		{
			displayName: "崩坏星穹铁道",
			displayIcon: "https://i2.hdslb.com/bfs/face/57b6e8c16b909a49bfc8d8394d946f908cabe728.jpg",
			keywords: ["互动抽奖 #崩坏星穹铁道","#崩坏星穹铁道","崩坏星穹铁道","星铁","崩铁"],
			followings: [1340190821] // 崩坏星穹铁道官方号的 UID
		},
		{
			displayName: "明日方舟",
			displayIcon: "https://i2.hdslb.com/bfs/face/d4005a0f9b898d8bb049caf9c6355f8e8f772a8f.jpg",
			keywords: ["明日方舟","#明日方舟"],
			followings: [
				161775300, // 明日方舟官方号的 UID
			]
		},
		{
			displayName: "碧蓝航线",
			displayIcon: "https://i1.hdslb.com/bfs/face/1fd5b43d5f619e6df8c8adcf13c962a3e80ee971.jpg",
			keywords: ["碧蓝航线","#碧蓝航线","#舰船新增#","#碧蓝航线5周年生日快乐"],
			followings: [
				233114659, // 碧蓝航线官方号的 UID
			]
		},
		{
			displayName: "VTuber",
			displayIcon: "https://i2.hdslb.com/bfs/face/d399d6f5cf7943a996ae96999ba3e6ae2a2988de.jpg",
			keywords: ["雪蓮","塔菲","七海","草莓猫","嘉然"],
			followings: [
				1437582453, // 東雪蓮Official
				1265680561, // 永雏塔菲
				434334701, // 七海Nana7mi
				1210816252, // 草莓猫Taffy
				672328094, // 嘉然今天吃什么
				672342685, // 乃琳Queen
				351609538, // 珈乐Carol
				672346917, // 向晚大魔王
				672353429, // 贝拉kira
			]
		},
		{
			displayName: "Asoul",
			displayIcon: "https://i2.hdslb.com/bfs/face/43b21998da8e7e210340333f46d4e2ae7ec046eb.jpg",
			keywords: ["@A-SOUL_Official", "#A_SOUL#"],
			followings: [
				703007996, // Asoul
				547510303, // Asoul二创计画
				672328094, // 嘉然今天吃什么
				672342685, // 乃琳Queen
				351609538, // 珈乐Carol
				672346917, // 向晚大魔王
				672353429, // 贝拉kira
			]
		},
		{
			displayName: "王者荣耀",
			displayIcon: "https://i2.hdslb.com/bfs/face/effbafff589a27f02148d15bca7e97031a31d772.jpg",
			keywords: ["互动抽奖 #王者荣耀","#王者荣耀","王者荣耀"],
			followings: [
				57863910, // 王者荣耀
				392836434, // 哔哩哔哩王者荣耀赛事
			]
		},
		{
			displayName: "三国杀",
			displayIcon: "https://i0.hdslb.com/bfs/face/fe2e1a6e3dc702a6c91378e096ef37ca71bf4629.jpg",
			keywords: ["互动抽奖 #三国杀","#三国杀","三国杀","#2023三国杀"],
			followings: [1254932367] // 三国杀十周年官方号的 UID
		},
		{
			displayName: "Minecraft",
			displayIcon: "https://i2.hdslb.com/bfs/face/c5578966c447a70edf831bbf7e522b7be6090fea.jpg",
			keywords: ["MC","我的世界","minecraft","#我的世界","我的世界拜年祭","MCBBS","我的世界中文论坛","MC玩家"],
			followings: [
				43310262, // 我的世界官方号的 UID
				39914211, // 我的世界中文论坛(MCBBS)官方号的 UID
			]
		},
		{
			displayName: "迷你世界",
			displayIcon: "https://i0.hdslb.com/bfs/face/a7591e5e0278aafb76cc083b11ca5dd46f049420.jpg",
			keywords: ["mnsj","迷你世界","miniworld","#迷你世界","迷你世界拜年祭"],
			followings: [
				470935187, // 迷你世界官方号的 UID
			]
		},{
            displayName: "兔友",
            displayIcon: "https://pic2.zhimg.com/80/v2-8e08912298d7c7c1bf1671a448f15369_1440w.webp",
            keywords: ["种花", "昂撒","殖人", "润人", "偷国", "七哥", "心医", "公知","躺匪","新冠后遗症","美狗","1450","入关","唐飞","电子宠物","不爱国","撅醒","大棋","华为","倪师","中医","文化输出","丑国","恨国","犹太","西方","渗透","白左"],
            followings: [346563107, 439478093, 19248926, 289189019, 1482025194, 77701536, 323397658,648113003,397672,1458767615,510362725,2233213],
        }, {
            displayName: "网左",
            displayIcon: "https://i0.hdslb.com/bfs/emote/0922c375da40e6b69002bd89b858572f424dcfca.png@112w_112h.webp",
            keywords: ["革命", "同志", "阶级","觉醒","资本","剥削","斗争","无产","劳动","左壬","苏联","红军","布尔什维克","斯大林","列宁","中苏","封建","共产","选集","全集","马克思"],
            followings: [23191782, 521249172,43219807]
        }, {
            displayName: "毛左",
            displayIcon: "https://i0.hdslb.com/bfs/emote/2caafee2e5db4db72104650d87810cc2c123fc86.png@48w_48h.webp",
            keywords: ["教员","毛主席","一声扑向","艾公","修正","邓","前三十年","前30年","艾跃进","艾老师"],
            followings: [605727461,2022537742,3493133453101082]
        }, {
            displayName: "黄鹅",
            displayIcon: "https://i1.hdslb.com/bfs/archive/87cadbe23ec449f2114cb998d04ce7160f7dfdec.jpg@672w_378h_1c_!web-search-common-cover.avif",
            keywords: ["大帝", "乌贼", "鱿鱼", "大佐", "乌拉", "战斗民族","喀秋莎"],
            followings: [153890218, 664086886, 622986240, 501247999,433443590]
        }, {
            displayName: "中医粉",
            displayIcon: "https://i0.hdslb.com/bfs/face/c0629ce0c4cc3d442101704b33756b2ef738f7aa.jpg@96w_96h_1c_1s_!web-avatar.avif",
            keywords: ["国医", "国药", "吃中药", "针灸", "中医黑", "汉方","经络","倪海厦","倪师","易经","弟子规","国学","汤剂","曾仕强","南怀瑾","易学","养生","中医","太极","中醫","寒湿"],
            followings: []
        }, {
            displayName: "恨猫闹钟",
            displayIcon: "https://img0.baidu.com/it/u=1427754838,2773895594&fm=253&fmt=auto&app=138&f=JPEG?w=394&h=450",
            keywords: ["哈基十","猫孝子","爱猫","改猫","灭猫","猫奴","消灭流浪猫","人道毁灭","捕杀流浪猫","处理流浪猫","猫肉","狗粉","杰克辣条","流浪猫虐杀","动保"],
            followings: []
        },{
            displayName: "键政神童",
            displayIcon: "https://i2.hdslb.com/bfs/face/880c533cfd7434acf77b91552e5799d11d25ddcc.jpg@240w_240h_1c_1s_!web-avatar-search-user.webp",
            keywords: ["班级","中考","高考","四六级","不放假","防沉迷","上学","班里","班委","放寒假","写作业","学校的","我们老师","开学"],
            followings: []
        },{
			displayName: "初生科技",
			displayIcon: "https://i2.hdslb.com/bfs/face/eb4c7bbea813eed3a92ee194809d85715e6a7659.jpg",
			keywords: ["易语言","编程猫","scratch","破解","黑客","ramos","winpe","bsod","memz","MEMZ","WindowsCE","下崽器","aero","setup","DWM","CmzPrep","RAM","虚拟机","VMWare","希沃白板","捡垃圾","root","解BL"],
			followings: [
				//- 组1/关键词:system -//
				493998035, // SYSTEM-RAMOS-ZDY 唯一真神，他的脸皮比医院设备还要厚
				702028797, // JERRY-SYSTEM
				631731585, // system-bootmgr-L
				501355555, // MS-SYSTEM
				1865727084, // SYSTEM-WinPE-CHD
				//- 组2/关键词:bsod -//
				451475014, // STR-BSOD
				1511907771, // MEMZ-BSOD
				1975308950, // BSOD-MEMZ
				397847418, // 蓝屏钙BSOD
				1776025003, // 蓝瓶钙BSoD
				//- 组3/关键词:memz -//
				21927744, // 360MEMZ
				1353783215, // MEMZ-Chrome
				412777837, // 注册表MEMZ
				457692234, // 奇怪的MEMZ
				298993710, // 注册表编辑器MEMZ
				//- 组4/关键词:Aero setup -//
				435972058, // WindowsAero毛玻璃
				1452376557, // 没有Aero就没有灵魂
				1911529131, // Aero8m
				1321946754, // 没有Aero的Windows7
				//- 组5/关键词：setup -//
				589370259, // setup-windows安装
				2050076822, // Windows-Setup
				//- 组6/关键词:Start -//
				524501321, // Start-hs888
				2030178992, // Start-BME
				//- 自定义组/依照个人判断 -//
				1157923020, // 仗义的老班长
				401094700, // 旮沓曼_gt428
				356882513, // 被重组吃掉的虚拟桌面
				1151325757, // SYSTEM-OPS-LJY
				1304244190, // System-NBNB
				504179884, // MYB_CKLS
				1776456802, // 奇怪的MEMZ的小号
				1534842751, // 爱WinPE的MEMZ
				2112060594, // WINPE-SYSTEM
				1439352366, // SYSTEM-WINPE-EXE
				678414222, // Windows-regedit
				1863175083, // 半不了世的空城
				1736202379, // 胡桃玩VM
				1322183332, // WindowsCEMEMZ新账号
				414666753, // 桌面窗口管理器_DWM
				1380415597, // 雨林木风YLMF
				698760287, // 出星海wrcjs_sp4
				307432672, // 花l火
				3493108908034540, // S-1-5-21-1726115
				1158046953, // VistaChrome108
				727892489, // Windows2003R2
				1243577821, // hyq061221
			],
			blacklist: [
				2102787368, // Silence默不作声 按理说休学的他不应该出现在这
				//- 组1/关键词:system -//
				493998035, // SYSTEM-RAMOS-ZDY 唯一真神，他的脸皮比医院设备还要厚
				702028797, // JERRY-SYSTEM
				631731585, // system-bootmgr-L
				501355555, // MS-SYSTEM
				1865727084, // SYSTEM-WinPE-CHD
				1162296488, // System3206
				1531948091, // SYSTEM_Win11_RE
				392697653, // System-i386
				313342814, // SYSTEM-GREE-GZN
				1546428456, // SYSTEM-WIN-EDGE
				//- 组2/关键词:bsod -//
				451475014, // STR-BSOD
				1511907771, // MEMZ-BSOD
				1975308950, // BSOD-MEMZ
				397847418, // 蓝屏钙BSOD
				1776025003, // 蓝瓶钙BSoD
				1007224506, // EXPLORER-BSOD
				1175873768, // BSOD-Winme
				2032637936, // BSOD-SYSTEM
				1933399514, // win11_BSOD
				1641461034, // DEEPIN_BSOD2_CMD
				//- 组3/关键词:memz -//
				21927744, // 360MEMZ
				1353783215, // MEMZ-Chrome
				412777837, // 注册表MEMZ
				457692234, // 奇怪的MEMZ
				298993710, // 注册表编辑器MEMZ
				413269076, // Cmd_MEMZ
				649846967, // Win7MEMZ-BX
				498912953, // AMD_MEMZ
				390483853, // 炒鸡360MEMZ
				362451533, // NC_Memz
				//- 组5/关键词:Aero -//
				435972058, // WindowsAero毛玻璃
				1452376557, // 没有Aero就没有灵魂
				1911529131, // Aero8m
				1321946754, // 没有Aero的Windows7
				//- 组5/关键词:setup -//
				589370259, // setup-windows安装
				2050076822, // Windows-Setup
				1549141274, // system-setup
				692755897, // Setup-Official
				483574120, // setup安装程序
				1031408618, // Deewin-Setup
				671918906, // win95setup
				//- 组6/关键词:Start -//
				524501321, // Start-hs888
				2030178992, // Start-BME
				//- 自定义组/依照个人判断 -//
				1157923020, // 仗义的老班长
				401094700, // 旮沓曼_gt428
				356882513, // 被重组吃掉的虚拟桌面
				1151325757, // SYSTEM-OPS-LJY
				1304244190, // System-NBNB
				504179884, // MYB_CKLS
				1776456802, // 奇怪的MEMZ的小号
				1534842751, // 爱WinPE的MEMZ
				2112060594, // WINPE-SYSTEM
				1439352366, // SYSTEM-WINPE-EXE
				678414222, // Windows-regedit
				505199229, // SYSTEM_PHILI
				652188355, // 一个windows爱好者
				1863175083, // 半不了世的空城
				1736202379, // 胡桃玩VM
				1322183332, // WindowsCEMEMZ新账号
				414666753, // 桌面窗口管理器_DWM
				698760287, // 出星海wrcjs_sp4
				307432672, // 花l火
				3493108908034540, // S-1-5-21-1726115
				1158046953, // VistaChrome108
				727892489, // Windows2003R2
				1243577821, // hyq061221
			]
		},
		// 指定仙家军UID与仙话的XianLists太容易误杀，故此处删除
	]



	// 空间动态api
	const spaceApiUrl = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
	const followingApiUrl = 'https://api.bilibili.com/x/relation/followings?vmid='
	const searchIcon = `<svg width="12" height="12" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.3451 15.2003C16.6377 15.4915 16.4752 15.772 16.1934 16.0632C16.15 16.1279 16.0958 16.1818 16.0525 16.2249C15.7707 16.473 15.4456 16.624 15.1854 16.3652L11.6848 12.8815C10.4709 13.8198 8.97529 14.3267 7.44714 14.3267C3.62134 14.3267 0.5 11.2314 0.5 7.41337C0.5 3.60616 3.6105 0.5 7.44714 0.5C11.2729 0.5 14.3943 3.59538 14.3943 7.41337C14.3943 8.98802 13.8524 10.5087 12.8661 11.7383L16.3451 15.2003ZM2.13647 7.4026C2.13647 10.3146 4.52083 12.6766 7.43624 12.6766C10.3517 12.6766 12.736 10.3146 12.736 7.4026C12.736 4.49058 10.3517 2.1286 7.43624 2.1286C4.50999 2.1286 2.13647 4.50136 2.13647 7.4026Z" fill="currentColor"></path></svg>`
	const checked = {}
	const checking = {}
	var printed = false

	// 监听用户ID元素出现
	waitForKeyElements(".user-name", installCheckButton);
	waitForKeyElements(".sub-user-name", installCheckButton);
	waitForKeyElements(".user .name", installCheckButton);
	waitForKeyElements(".user-card .btn-box .like", installCheckButton);



	console.log("开启B站用户成分检查器...")
	let dom = ''

	// 添加检查按钮
	function installCheckButton(element) {
		let node = $(`<div style="display: inline-block;" class="composition-checkable"><div class="composition-badge-control"><a class="composition-name-control" title="点击查看已识别用户">${searchIcon}</a></div></div>`)
		if (element.attr("data-user-id") || element.attr("data-usercard-mid")){
			node.on('click', function () {
				checkComposition(element, node.find(".composition-name-control"))
			})
			node.click()
			element.after(node)
		} else if (element.attr("mid")) {
			node.on('click', function () {
				checkComposition(element, node.find(".composition-name-control"))
			})
			node.click()
			node.css({"margin":"8px 5px"});
			element.parent().after(node);
		}
	}

	// 添加标签
	function installComposition(id, element, setting) {
		let node = $(`<div style="display: inline-block;"><div class="composition-badge">
  <a class="composition-name" title="点击查看已识别用户">${setting.displayName}</a>
  <img src="${setting.displayIcon}" class="composition-icon">
</div></div>`)
		node.on('click', function () {
			check.showAllUser()
		})
		if (element.attr("data-user-id") || element.attr("data-usercard-mid")){
			element.after(node)
		} else if (element.attr("mid")) {
			node.css({"margin":"10px 0"});
			element.parent().after(node);
		}
	}

	// 检查标签
	function checkComposition(element, loadingElement) {
		// 用户ID
		let userID = element.attr("data-user-id") || element.attr("data-usercard-mid") || element.attr("mid")
		// 用户名
		let name = element.text().charAt(0) == "@" ? element.text().substring(1) : element.text()

		if (checked[userID] != undefined && GM_getValue(userID, undefined) != undefined ) {
			// 已经缓存过了

			let found = GM_getValue(userID, undefined)//checked[userID]
			if (found.length > 0) {
				for (let setting of found) {
					installComposition(userID, element, setting)
				}
				loadingElement.parent().remove()
			} else {
				console.log(`检测到 ${name} ${userID} 的成分为 无`)
				loadingElement.text('路人')
				loadingElement.on('click', function () {
					check.showAllUser()
				})
			}
		} else if (checking[userID] != undefined) {
			// 检查中
			if (checking[userID].indexOf(element) < 0)
				checking[userID].push(element)
		} else {
			checking[userID] = [element]
			console.log("正在检查用户 " + name + " 的成分...");

			new Promise(async (resolve, reject) => {
				try {
					// 找到的匹配内容
					let found = []

					let spaceRequest = request({
						data: "",
						url: spaceApiUrl + userID,
					})

                    let bingRequest = requestbing({
						data: "",
						url: 'https://www.bing.com/search?q="'+name+'" %2B'+userID.toString()+' site:bilibili.com',
					})

                    let vidreq = requestbing({
						data: "",
						url: 'https://space.bilibili.com/'+userID.toString(),
					})

                    let artreq = requestbing({
						data: "",
						url: 'https://space.bilibili.com/'+userID.toString()+'/article',
					})

                    let favreq = requestbing({
						data: "",
						url: 'https://space.bilibili.com/'+userID.toString()+'/favlist',
					})

					let followingRequest = request({
						data: "",
						url: followingApiUrl + userID,
					})

					try {
						//console.log(spaceApiUrl + userID)
                        try{
						let spaceContent = await spaceRequest
                        if (!printed) {
							console.log(spaceContent)
							printed = true
						}

						// 动态内容检查
						if (spaceContent.code == 0) {
							// 解析并拼接动态数据
							let st = JSON.stringify(spaceContent.data.items)
                            //alert(bingContent)
							for (let setting of checkers) {
								// 检查动态内容
								if (setting.keywords) {
									if (setting.keywords.find(keyword => st.includes(keyword))) {
										if (found.indexOf(setting) < 0)
											found.push(setting)
										continue;
									}
								}
							}
						}
                        }catch(error){
                        console.log("no")
                        }
                        let bingContent = await bingRequest
                        let vidContent = await vidreq
                        let artContent = await artreq
                        let favContent = await favreq


                        						// 动态内容检查
						if (vidContent.code == 0) {
							// 解析并拼接动态数据
							let st = vidContent+" "+artContent+" "+favContent+" "+element.parent().attr('text')+" "+name
                            //alert(bingContent)
							for (let setting of checkers) {
								// 检查动态内容
								if (setting.keywords) {
									if (setting.keywords.find(keyword => st.includes(keyword))) {
										if (found.indexOf(setting) < 0)
											found.push(setting)
										continue;
									}
								}
							}
						}
                        						// 动态内容检查
						if (bingContent.code == 0) {
							// 解析并拼接动态数据
							let st = bingContent
							for (let setting of checkers) {
								// 检查动态内容
								if (setting.keywords) {
									if (setting.keywords.find(keyword => st.includes(keyword))) {
										if (found.indexOf(setting) < 0 && setting.displayName != "兔友" && setting.displayName != "Minecraft")
											found.push(setting)
										continue;
									}
								}
							}
						}
					} catch(error) {
						console.error(`获取 ${name} ${userID} 的动态失败`, error)
					}

					try {
						//console.log(followingApiUrl + userID)
						let followingContent = await followingRequest
						// 可能无权限
						let following = followingContent.code == 0 ? followingContent.data.list.map(it => it.mid) : []
						if (following) {
							for (let setting of checkers) {
								// 检查关注列表
								if (setting.followings)
									for (let mid of setting.followings) {
										if (following.indexOf(mid) >= 0) {
											if (found.indexOf(setting) < 0)
												found.push(setting)
											continue;
										}
									}
							}
						}
					} catch(error) {
						console.error(`获取 ${name} ${userID} 的关注列表失败`, error)
					}

					try {
						for (let setting of checkers) {
							// 检查关注列表
							if (setting.blacklist)
								for (let mid of setting.blacklist) {
									if (userID.indexOf(mid) >= 0) {
										if (found.indexOf(setting) < 0)
											found.push(setting)
										continue;
									}
								}
						}
					} catch(error) {
						console.error(`获取 ${name} ${userID} 是否在命中名单失败`, error)
					}

					// 添加标签
					if (found.length > 0) {
						// 输出日志
						// console.log(`检测到 ${name} ${userID} 的成分为 `, found.map(it => it.displayName))
						dom += `<span>昵称: ${name}<br>UID: ${userID}<br>成分: ${found.map(it => it.displayName)}<br>主页: <a href="https://space.bilibili.com/${userID}" target="_blank" style="color: #fb7299;">space.bilibili.com/${userID}</a></span><br><br>`;
						checked[userID] = found

						// 给所有用到的地方添加标签
						for (let element of checking[userID]) {
							for (let setting of found) {
								installComposition(userID, element, setting)
							}
						}
						loadingElement.parent().remove()
					} else {
						// console.log(`检测到 ${name} ${userID} 的成分为 无`)
						loadingElement.text('路人')
						loadingElement.on('click', function () {
							check.showAllUser()
						})
					}

					checked[userID] = found
                    GM_setValue(userID, found)
					delete checking[userID]

					resolve(found)
				} catch (error) {
					console.error(`检测 ${name} ${userID} 的成分失败`, error)
					loadingElement.text('失败')
					loadingElement.on('click', function () {
						check.showAllUser()
					})
					delete checking[userID]
					reject(error)
				}
			})
		}
	}
	dom = '<div id="Identified"><span id="tips">注:因判断关键词较为广泛，可能会出现识别错误的现象<br>脚本还在测试阶段，喜欢的话还请留下你的评论</span><br><br>' + dom + '</div>';
	let check = {
		showAllUser() {
			Swal.fire({
				title: '已识别用户',
				html: dom,
				icon: 'info',
				heightAuto: false,
				scrollbarPadding: false,
				showCloseButton: true,
				confirmButtonText: '关闭'
			})
		},
	}

	GM_registerMenuCommand("查看所有已识别用户", () => {
		check.showAllUser();
	});

	function request(option) {
		return new Promise((resolve, reject) => {
			let requestFunction = GM_xmlhttpRequest ? GM_xmlhttpRequest : GM.xmlHttpRequest

			requestFunction({
				method: "get",
				headers: {
					'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
				},
				...option,
				onload: (response) => {
					let res = JSON.parse(response.responseText)
					resolve(res)
				},
				onerror: (error) => {
					reject(error);
				}
			});
		})
	}
    function requestbing(option) {
		return new Promise((resolve, reject) => {
			let requestFunction = GM_xmlhttpRequest ? GM_xmlhttpRequest : GM.xmlHttpRequest

			requestFunction({
				method: "get",
				headers: {
					'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
				},
				...option,
				onload: (response) => {
					let res = response.responseText
					resolve(res)
				},
				onerror: (error) => {
					reject(error);
				}
			});
		})
	}


	/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
	that detects and handles AJAXed content.
	Usage example:
		waitForKeyElements (
			"div.comments"
			, commentCallbackFunction
		);
		//--- Page-specific function to do what we want when the node is found.
		function commentCallbackFunction (jNode) {
			jNode.text ("This comment changed by waitForKeyElements().");
		}
	IMPORTANT: This function requires your script to have loaded jQuery.
	*/
	function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
		var targetNodes, btargetsFound;

		if (typeof iframeSelector == "undefined")
			targetNodes = $(selectorTxt);
		else
			targetNodes = $(iframeSelector).contents()
				.find(selectorTxt);

		if (targetNodes && targetNodes.length > 0) {
			btargetsFound = true;
			targetNodes.each(function () {
				var jThis = $(this);
				var alreadyFound = jThis.data('alreadyFound') || false;

				if (!alreadyFound) {
					//--- Call the payload function.
					var cancelFound = actionFunction(jThis);
					if (cancelFound) btargetsFound = false;
					else jThis.data('alreadyFound', true);
				}
			});
		} else {
			btargetsFound = false;
		}

		//--- Get the timer-control variable for this selector.
		var controlObj = waitForKeyElements.controlObj || {};
		var controlKey = selectorTxt.replace(/[^\w]/g, "_");
		var timeControl = controlObj[controlKey];

		//--- Now set or clear the timer as appropriate.
		if (btargetsFound && bWaitOnce && timeControl) {
			//--- The only condition where we need to clear the timer.
			clearInterval(timeControl);
			delete controlObj[controlKey]
		} else {
			//--- Set a timer, if needed.
			if (!timeControl) {
				timeControl = setInterval(function () {
					waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
				}, 300);
				controlObj[controlKey] = timeControl;
			}
		}
		waitForKeyElements.controlObj = controlObj;
	}
})