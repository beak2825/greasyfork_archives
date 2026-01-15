// ==UserScript==
// @name         NotSoSharp
// @namespace    https://github.com/gui-ying233/NotSoSharp
// @version      1.7.0
// @description  尝试还原萌娘百科部分一方通行所屏蔽的内容
// @author       鬼影233
// @license      MIT
// @match        zh.moegirl.org.cn/*
// @match        mzh.moegirl.org.cn/*
// @match        mobile.moegirl.org.cn/*
// @match        commons.moegirl.org.cn/*
// @match        library.moegirl.org.cn/*
// @match        en.moegirl.org.cn/*
// @match        ja.moegirl.org.cn/*
// @icon         https://img.moegirl.org.cn/common/b/b7/%E5%A4%A7%E8%90%8C%E5%AD%97.svg
// @supportURL   https://github.com/gui-ying233/NotSoSharp/issues
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/464582/NotSoSharp.user.js
// @updateURL https://update.greasyfork.org/scripts/464582/NotSoSharp.meta.js
// ==/UserScript==

(async () => {
	"use strict";
	if (
		new URLSearchParams(window.location.search).get("safemode") ||
		document.currentScript ||
		!document.documentElement.textContent.includes("\u266F")
	)
		return;
	let pageName = "";
	await new Promise(resolve => {
		const intervId = setInterval(() => {
			if ([typeof mw, typeof wgULS].includes("undefined")) return;
			clearInterval(intervId);
			resolve();
		}, 50);
	});
	switch (mw.config.get("wgNamespaceNumber")) {
		case 2:
		case 3:
			pageName = wgULS("用户", "用戶");
			break;
		case 10:
		case 11:
			pageName = "模板";
			break;
		case 14:
		case 15:
			pageName = wgULS("分类", "分類");
			break;
		default:
			break;
	}
	switch (mw.config.get("wgNamespaceNumber")) {
		case 1:
		case 3:
		case 5:
		case 9:
		case 11:
		case 13:
		case 15:
			pageName += wgULS("讨论", "討論");
			break;
		default:
			break;
	}
	pageName += `${pageName ? ":" : ""}${mw.config.get("wgTitle")}`;
	const r = (a, b, c = pageName) => {
		if (a[b].includes("\u266F") && a[b] !== "幻影异闻录♯FE") a[b] = c;
	};
	r(document.getElementById("firstHeading"), "innerText");
	r(document, "title", `${pageName} - 萌娘百科_万物皆可萌的百科全书`);
	switch (mw.config.get("skin")) {
		case "vector":
			[...document.body.getElementsByClassName("toctext")].forEach(e =>
				r(e, "innerText", decodeURI(e.parentElement.hash.slice(1)))
			);
			break;
		case "moeskin":
		default:
			[
				...document.body.querySelectorAll(
					".moe-toc-tree.root a.anchor-link"
				),
			].forEach(e =>
				r(e, "title", decodeURI(e.hash.replaceAll(".", "%")))
			);
			[
				...document.body.querySelectorAll(
					".moe-toc-tree.root a.anchor-link > .text"
				),
			].forEach(e =>
				r(
					e,
					"innerText",
					decodeURI(e.parentElement.hash.replaceAll(".", "%")).slice(
						1
					)
				)
			);
			break;
	}
	[...document.body.querySelectorAll(".mw-heading > [id]")].forEach(e => {
		if (
			e.innerText.includes("\u266F") &&
			e.innerText.length === e.id.length
		)
			e.childNodes.forEach(n => {
				if (
					n.nodeType === Node.TEXT_NODE &&
					n.nodeValue.includes("\u266F") &&
					n.nodeValue.length === e.id.length
				)
					n.nodeValue = e.id;
			});
	});
	[...document.body.querySelectorAll("a:not(#catlinks a)")].forEach(e => {
		if (
			e.innerText.includes("\u266F") &&
			(new Set(e.innerHTML).size === 1 ||
				e.classList.contains("mw-changeslist-title") ||
				e.classList.contains("mw-userlink"))
		)
			e.innerText =
				new URL(e).searchParams.get("title") ||
				e.getAttribute("data-username") ||
				decodeURI(e.pathname).slice(1);
	});
	[...document.body.getElementsByClassName("mw-selflink")].forEach(e => {
		switch (e.innerHTML.length) {
			case pageName.length:
				r(e, "innerText");
				break;
			case mw.config.get("wgPageName").length:
				r(e, "innerText", mw.config.get("wgPageName"));
				break;
		}
	});
	[...document.body.querySelectorAll("#catlinks a")].forEach(e => {
		if (e.innerText.includes("\u266F") && new Set(e.innerHTML).size === 1)
			e.innerText = decodeURI(e.pathname).slice(10);
	});
	[...document.body.getElementsByTagName("a")].forEach(e => {
		if (!e.innerHTML.includes("\u266F")) return;
		const file = e.querySelector("span.mw-file-element.mw-broken-media");
		if (
			e.classList.contains("new") &&
			file?.textContent.includes("\u266F") &&
			!e.title?.includes("\u266F") &&
			e.title.length === file.textContent.length
		)
			return (file.textContent = e.title);
		if (e.innerHTML !== e.innerText) return;
		let url;
		switch (e.className) {
			case "new":
				url = new URL(e).searchParams.get("title");
				break;
			case "external":
			case "external free":
			case "external text":
				url = e.href;
				break;
			default:
				url = e.pathname.slice(1);
				break;
		}
		url = decodeURI(url);
		if (e.classList.contains("external")) url = url.replace(/\/$/, "");
		if (url.length !== e.innerText.length) return;
		const regexp = `${e.innerText
			.replaceAll(".", "\\.")
			.replaceAll("\u266F", ".")}`;
		if (url.match(regexp)) e.innerText = url.match(regexp)[0];
	});
	[
		...document.body.querySelectorAll(
			".infoBox.patroller-show > .infoBoxContent > .infoBoxText > big > center > b"
		),
	].forEach(e => {
		[...e.childNodes].forEach(
			n =>
				n.nodeType === Node.TEXT_NODE &&
				n.nodeValue.includes("\u266F") &&
				n.nodeValue.length === pageName.length + 11 &&
				(n.nodeValue = n.nodeValue.replace(
					/^致(?:(维护人员：本页面“)[^\u266F]*\u266F+[^\u266F]*(”)|(維護人員：本頁面「)[^\u266F]*\u266F+[^\u266F]*(」))$/giu,
					`致$1$3${pageName}$2$4`
				))
		);
	});
})();
