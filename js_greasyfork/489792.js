// ==UserScript==
// @name         Nacos配置内容区域全屏
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  修改nacos的编辑器区域大小
// @author       witt
// @match        http://*/nacos/*
// @icon         https://nacos.io/img/nacos_colorful.png
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489792/Nacos%E9%85%8D%E7%BD%AE%E5%86%85%E5%AE%B9%E5%8C%BA%E5%9F%9F%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/489792/Nacos%E9%85%8D%E7%BD%AE%E5%86%85%E5%AE%B9%E5%8C%BA%E5%9F%9F%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function () {
	'use strict';
	GM_addStyle(`
        .main-container .right-panel {
            padding: 1px 10px;
        }

        .next-shell-brand .next-shell-aside.next-shell-navigation {
            width: 130px;
        }

		#container[style="clear: both; height: 300px;"] {
			height: 850px !important;
		}

        .editor-normal {
			height: 900px;
        }

		.button-list {
			position: fixed;
			z-index: 9999;
			bottom: 2px;
            right: 20px;
			background-color: #fff;
		}
    `);

	// function resetEditor() {

	// 	const editor = document.querySelector('.monaco-editor.vs-dark.alwaysShowFoldIcons');

	// 	if (!editor) {
	// 		console.log("[.monaco-editor .vs-dark .alwaysShowFoldIcons] selector not found .")
	// 		return;
	// 	}

	// 	const setEditorForV113 = function () {
	// 		editor.style.height = "800px";
	// 		console.log("reset editor .");
	// 	}

	// 	setEditorForV113();

	// 	window.addEventListener('load', setEditorForV113);
	// 	document.addEventListener('DOMContentLoaded', setEditorForV113);

	// 	// 监听哈希值变化
	// 	window.addEventListener('hashchange', setEditorForV113);

	// };

	// resetEditor();
})();