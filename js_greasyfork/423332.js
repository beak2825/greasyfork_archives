// ==UserScript==
// @name         オルガルのお知らせ
// @namespace    Aime
// @version      1.0.0
// @description  オルガルのお知らせをブラウザで閲覧できるようにします
// @author       nepon
// @include      https://web.alterna.amebagames.com/page*
// @run-at       document-end
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423332/%E3%82%AA%E3%83%AB%E3%82%AC%E3%83%AB%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/423332/%E3%82%AA%E3%83%AB%E3%82%AC%E3%83%AB%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B.meta.js
// ==/UserScript==
// jshint esversion:8
(function() {
"use strict";

	document.head.insertAdjacentHTML("beforeend", `<style>
#mainContent {
	max-width: 640px;
	border-top: none;
}
.noticeListBox::before {
	display: none;
}
.noticeListBox a {
	color: inherit;
}

#page-buttons {
	position: fixed;
	right: calc(50% + 325px);
	top: 30px;
	display: flex;
	flex-flow: column nowrap;
}
#page-buttons li {
	display: inline-block;
}
#page-buttons li > a {
	display: inline-block;
	letter-spacing: normal;
	width: 8.5ch;
	padding: 10px 0;
	margin: 5px 3px 0;
	font-size: 14px;
	color: #FFF;
	background-color: rgb(128,159,169);
	border: 3px rgb(192,207,212) solid;
	border-radius: 5px;
	text-decoration: none;
}
@media screen and (max-width: 830px) {
	.container {
		margin-bottom: 50px;
	}
	#page-buttons {
		top: unset;
		bottom: 10px;
		left: 0;
		right: 0;
		flex-flow: row wrap;
		justify-content: center;
	}
}
</style>`);
	document.body.insertAdjacentHTML("beforeend", `
<ul id="page-buttons">
<li><a href="https://web.alterna.amebagames.com/page/notice">お知らせ</a></li>
<li><a href="https://web.alterna.amebagames.com/page/notice_bug">不具合</a></li>
<li><a href="https://web.alterna.amebagames.com/page/notice_pr">PR</a></li>
<li><a href="https://web.alterna.amebagames.com/page/notice_other">その他</a></li>
</ul>
`);

	window.meloEnv = { isApp: false };

	// 過去のお知らせを読み込むをクリックで動作するようにする
	const loadBtn = document.querySelector(".js-loadBtn");
	if (loadBtn) {
		loadBtn.addEventListener("mousedown", event => {
			event.stopImmediatePropagation();
		}, { capture: true });
	}

	// リストをa要素でラップ
	document.querySelectorAll(".noticeList > .js-move").forEach(elem => {
		const url = moveParamUrl(elem.dataset.moveParam);
		if (url) {
			const a = document.createElement("a");
			a.href = url;
			while (elem.firstChild) {
				a.appendChild(elem.firstChild);
			}
			elem.appendChild(a);
		}
	});

	// 記事内のブラウザで開くリンクを置換
	document.querySelectorAll('a[href^="uniwebview://browser?url="]').forEach(a => {
		a.href = decodeURIComponent(a.href.replace("uniwebview://browser?url=", ""));
	});


	function moveParamUrl(param) {
		let url = null;
		if (param) {
			url = param;
			if (!/^(https?|uniwebview):\/\//.test(url)) {
				const path = [];
				url.split("&").forEach(v => {
					path.push(decodeURIComponent(v.split("=")[1]));
				});
				url = "/page/" + path.join("/");
			}
		}
		return url;
	}
})();