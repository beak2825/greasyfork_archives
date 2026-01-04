// ==UserScript==
// @name        草榴 - 处理广告相关问题 & 主动加载图片
// @description 去除广告，去除反广告屏蔽，去除部分发帖者加入的内容广告，主动从图片元素的属性中加载图片
// @namespace   匿名网友
// @author      匿名网友
// @icon        https://t66y.com/favicon.ico
// @version     1.1
// @match       https://t66y.com/htm_data/*
// @grant       none
// @inject-into page
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/399787/%E8%8D%89%E6%A6%B4%20-%20%E5%A4%84%E7%90%86%E5%B9%BF%E5%91%8A%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%20%20%E4%B8%BB%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/399787/%E8%8D%89%E6%A6%B4%20-%20%E5%A4%84%E7%90%86%E5%B9%BF%E5%91%8A%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%20%20%E4%B8%BB%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

"use strict";

new Map([
	// 将广告函数设死为移除广告元素
	[ "spinit", function () { document.currentScript.parentNode.remove(); } ],
	// 将反广告屏蔽器函数设死为空函数
	[ "r9aeadS", function () {} ]
]).forEach(
	(value, name) => Object.defineProperty(
		unsafeWindow, name, {
			configurable: false,
			enumerable: true,
			writable: false,
			value: value
		}
	)
);

// 检查文本
const checkContent = content => [
	"澳门", "澳門", "葡京", "赌场",
	"娱乐", "体育", "彩票", "赛马",
	"六合彩", "百家乐", "轮盘", "投注",
	"荷官", "在线", "影音", "视频",
	"播放"
].some( word => content.includes(word) );

// 检查链接
const checkUrl = url => {
	const urlObj = new URL(url);
	return (
		urlObj.pathname === "/" &&
		urlObj.search === ""
	) || [
		"jq.qq.com",
		"www.laifaka.cn",
		"pj.792079207920.com",
		"www.3001666.com",
		"mmse228.com"
	].some(
		domain => urlObj.hostname === domain
	);
}

// 检查图片链接
const checkImgUrl = url => {
	const urlObj = new URL(url);
	return [
		"dioimg.net",
		"kk.51688.cc"
	].some(
		domain => urlObj.hostname === domain
	);
}

// 循环移除多余的空白和 <br> 元素
const removeSpace = ( element, counter ) => {
	console.log("a", element.nextSibling);
	if ( counter === undefined ) counter = 9;
	if (
		counter > 0 &&
		element.nextSibling && ((
			element.nextSibling.nodeType === 1 &&
			element.nextSibling.tagName === "BR"
		) || (
			element.nextSibling.nodeType === 3 &&
			/^\s*$/.test(element.nextSibling.textContent)
		))
	) {
		console.log("b", element.nextSibling);
		element.nextSibling.remove();
		removeSpace( element, counter );
	}
}

// 递归查找最外层广告元素，目前，如果有空白字符，就会遗漏
const getParent = ( element, counter ) => {
	if ( counter === undefined ) counter = 9;
	
	return counter > 0 && (
		element.parentNode.childNodes.length -
		element.parentNode.querySelectorAll(':scope > br').length
	) <= 1
		? getParent( element.parentNode, counter )
		: element;
}
	

// DOM 加载完毕后
document.addEventListener(
	"DOMContentLoaded", () => {

		// 隐藏多余的换行
		const style = document.createElement("style");
		style.textContent = "br { line-height: 0; }";
		document.head.appendChild(style);

		// 主动加载图片
		document.querySelectorAll( '.tpc_content img[ess-data]' ).forEach(
			img => {
				// ess-data 为空时，不加载图片
				if ( img.getAttribute("ess-data") ) {
					if ( checkImgUrl(img.getAttribute("ess-data")) ) {
						// 移除部分广告图片
						console.log(
							img.getAttribute("data-link") + "\n" +
							img.getAttribute("ess-data")
						);
						removeSpace(img);
						img.remove();
					} else {
						// 主动加载图片
						img.setAttribute( "referrerpolicy", "no-referrer");
						img.setAttribute( "src", img.getAttribute("ess-data") );
					}
				}
			}
		);
		
		// 如果图片有链接，则检查链接
		document.querySelectorAll( '.tpc_content img[data-link]' ).forEach(
			img => {
				if ( img.getAttribute("data-link") ) {
					if ( checkUrl(img.getAttribute("data-link")) ) {
						// 移除部分广告图片
						console.log(
							img.getAttribute("data-link") + "\n" +
							img.getAttribute("ess-data")
						);
						removeSpace(img);
						img.remove();
					} else {
						// 将图片置于链接之中
						const link = document.createElement("a");
						new Map([
							[ "href", img.getAttribute("data-link") ],
							[ "referrerpolicy", "no-referrer" ],
							[ "rel", "noreferrer noopener" ],
							[ "target", "_blank" ]
						]).forEach(
							(value, name) => link.setAttribute(name, value)
						);
						img.parentNode.insertBefore(link, img);
						link.appendChild(img);
					}
				}
			}
		);

		// 处理链接
		const jumpPrefix = "http://www.viidii.info/?";
		const jumpPrefixRegExp = new RegExp(
			"^" + jumpPrefix.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' )
		);
		document.querySelectorAll( '.tpc_content a' ).forEach(
			link => {

				// 去除链接跳转
				link.href.startsWith(jumpPrefix) && link.setAttribute(
					"href", link.getAttribute("href")
						.replace( jumpPrefixRegExp, "" )
						.replace( /______/g, "." )
						.replace( /&z/, "" )
				);

				// 移除部分广告链接
				if (
					checkUrl(link.href) ||
					checkContent(link.textContent)
				) {
					console.log(
						link.textContent + link.href
					);
					const parent = getParent(link, 3);
					if ( parent && parent.remove ) {
						
						removeSpace(parent);
						parent.remove();
					} else {
						link.remove();
					}
				}
			}
		);

	}
);