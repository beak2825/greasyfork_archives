// ==UserScript==
// @name             磁力一键复制
// @homepage         https://greasyfork.org/zh-CN/scripts/495796
// @author           @zhuangyin8
// @version          2024-10-08
// @description      一键复制美化后的磁力
// @license          MIT
// @include          https://btsow.*/search/*
// @include          https://u9a9.*
// @include          https://btdig.com/*
// @include          https://sukebei.nyaa.si/*
// @include          https://zhongzidi.com/list*
// @grant            GM_setClipboard
// @grant            GM_addElement
// @grant            GM_addStyle
// @run-at           document-idle
// @downloadURL
// @updateURL
// @namespace *
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/495796/%E7%A3%81%E5%8A%9B%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/495796/%E7%A3%81%E5%8A%9B%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function () {
	"use strict";
	const addElement = (
		tagName = `button`,
		innerHTML = `点击复制`,
		options = {},
		parentNode = document.body
	) => {
		const el = document.createElement(tagName);
		el.innerHTML = innerHTML;
		Object.assign(el, options);
		parentNode.append(el);
	};
	const copyMagnet = (datalist, hash, title, size, date, magnet) => {
		document.querySelectorAll(datalist).forEach((element, index) => {
			const reg = /[a-fA-F\d]{40}/g;
			const link = `magnet:?xt=urn:btih:${element
				.querySelector(hash)
				.href.match(reg)[0]
				.toLowerCase()}&dn=${element.querySelector(title).innerText}🔞Size=${
				element.querySelector(size).innerText
			}🔞Date=${element.querySelector(date).innerText}`;
			element.querySelector(magnet).textContent = link;
			addElement(
				`button`,
				`点击复制第${index + 1}个磁力链接`,
				{
					/* className:"",*/
					onclick: (e) => {
						// GM_setClipboard(element.querySelector(hash).innerHTML , "html");
						GM_setClipboard(link, "text");
						//var myLink = "<a href='http://scriptish.org'>visit scriptish.org</a>";
						//GM_setClipboard(myLink, 'html');
						e.target.textContent = `已复制第${index + 1}个磁力链接`;
						setTimeout(() => {
							e.target.textContent = `点击复制第${index + 1}个磁力链接`;
						}, 3000);
						e.target.style.cssText =
							"color: red; background-color: yellow; height: 100%";
						// e.target.setAttribute(
						// 	"style",
						// 	"color: red; background-color: yellow; height: 2em;"
						// );
					}
				},
				element
			);
		});
	};
	let host = location.host.split(".")[0];
	switch (host) {
		case "zhongzidi":
			copyMagnet(
				".row table",
				"tr h4 a",
				"tr h4 a",
				"tr:nth-child(2) td:nth-child(2) strong",
				"tr:nth-child(2) td:first-child strong",
				"tr h4 a"
			);
			break;
			GM_addStyle(`/*zhongzidi*/`);
		case "btsow":
			copyMagnet(
				".data-list > .row:not(.hidden-xs)",
				"a",
				"a",
				".size",
				".date",
				"a div:first-child"
			);
			GM_addStyle(`/*btsow*/
            .tags-box { width: 100vw;position: fixed; top: 50px;}
            .data-list{ width: 100vw;position: absolute;top: 200px;}
            .hidden-xs:not(.tags-box,.text-right,.search,.search-container) { display: none !important;}
            .search,.search-container{}
            form .input-group{width: 100vw !important;top: 0 !important;left: 50px !important;position: fixed !important;z-index:99999;background:red}`);
			break;
		case "sukebei":
			copyMagnet(
				"tbody tr",
				"td:nth-child(3) a:last-child",
				"td:nth-child(2) a:not(:has(i))",
				"td:nth-child(4)",
				"td:nth-child(5)",
				"td:nth-child(2) a:last-child"
			);
			GM_addStyle(`/*sukebei*/
	    	.group-container,.exo_wrapper{display:none !important;}
            .torrent-list > tbody > tr > td {max-width:90vw;white-space: normal !important;}
            .data-list .row {padding: 0;}`);
			break;
		case "u9a9":
			copyMagnet(
				"tbody tr",
				"td:nth-child(3) a:last-child",
				"td:nth-child(2) a",
				"td:nth-child(4)",
				"td:nth-child(5)",
				"td:nth-child(2) a:last-child"
			);
			GM_addStyle(`/*u9a9*/
	    	.container .ad{display:none !important;}`);
			break;
		case "btdig":
			copyMagnet(
				".one_result > div",
				".torrent_name a",
				".torrent_name a",
				".torrent_size",
				".torrent_age",
				".torrent_magnet"
			);
			//document.querySelectorAll(".one_result *").forEach(e => {e.style="";e.classList.remove("style");});
			GM_addStyle(`/*btdig*/
			.one_result {display:inline-block;text-align: left;border: 1px dashed #32a1ce;line-height:1.4;}
			body > center > div > div:nth-child(1) {max-width:100vw !important;max-height:100vh !important;padding:0 !important;}
			.torrent_excerpt,.torrent_excerpt + div {padding:0 !important;}
			body > center > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(4) {display:grid !important;grid-template-columns:repeat(2, 1fr);grid-auto-rows: min-content;gap:0}
			.torrent_magnet {background:#00a400;}
			body > a,
			body > center > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(4) > div:nth-child(odd),
			body > center > div > div:nth-child(2),
			body > center > div > div:nth-child(1) > div:nth-child(1),
			body > center > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(5){display:none  !important;}
			body > center > div > div:nth-child(1) > form {position:fixed;top:0;right:0;}
			body > center > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2) > div > div,form{display:inline-block;margin:0 10px;}`);
			break;
		default:
	}
    GM_addStyle(`.container {width: 100vw;left: 360px;position: absolution;}`);
	/*GM_addStyle(`thead,.data-list .hidden-xs,tr .text-center,thead + tbody tr td:not(:nth-child(2)){ display: none !important;}
		.input-group {width:100%}
		.table-striped>tbody>tr:nth-of-type(odd) {background-color: rgb(213, 217, 237);}
		.torrent-list > tbody > tr > td{white-space: normal !important;}
		#article {max-width: 120ex !important;}
		.torrent_name {width: 980px !important;}
		body > center > div {max-width: 1500px !important;}`);*/
})();
