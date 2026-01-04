// ==UserScript==
// @name		获取哔哩哔哩视频和直播间的封面图片 get bilibili cover image
// @namespace	http://saber.love/?p=3259
// @version		2.1.0
// @description	在视频列表上以及视频播放页面，按 ctrl+鼠标右键 ，就会在新窗口打开这个视频的封面图
// @author		xuejianxianzun
// @include		*://*bilibili.com/*
// @license 	MIT
// @icon 		https://www.bilibili.com/favicon.ico
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/30714/%E8%8E%B7%E5%8F%96%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E5%92%8C%E7%9B%B4%E6%92%AD%E9%97%B4%E7%9A%84%E5%B0%81%E9%9D%A2%E5%9B%BE%E7%89%87%20get%20bilibili%20cover%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/30714/%E8%8E%B7%E5%8F%96%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E5%92%8C%E7%9B%B4%E6%92%AD%E9%97%B4%E7%9A%84%E5%B0%81%E9%9D%A2%E5%9B%BE%E7%89%87%20get%20bilibili%20cover%20image.meta.js
// ==/UserScript==

'use strict';

// 如果封面图在右键的元素本身
const ownsClass = ['scrollx', 'groom-module', 'card-live-module', 'rank-item', 'spread-module', 'card-timing-module', 'image-area', 'l-item', 'v', 'vb', 'v-item', 'small-item', 'cover-normal', 'common-lazy-img', 'biref-img', 'game-groom-m', 'i-pin-c', 'anchor-item', 'room-cover-wrapper', 'room-card-item', 'special-module', 'chief-recom-item', 'bangumi-info-wrapper', 'similar-list-child', 'v1-bangumi-list-part-child', 'lv-preview', 'recom-item', 'misl-ep-img', 'media-info-inner', 'matrix', 'bangumi-list', 'bilibili-player-recommend-left', 'bilibili-player-ending-panel-box-recommend', 'album-top', 'm-recommend-item', 'card-box'];

// 如果封面图在右键的元素的父元素里，则通过下面的 class 查找特定的父元素
const parentsClass = ['bili-dyn-card-video__cover', 'hot-item-cover', 'season-cover', 'bm-v-list', 'rlist', 'topic-preview', 'cover-wrapper', 'hover-cover-box', 'room-card-wrapper', 'room-card-ctnr', 'bpx-player-ending-related-item'];

// 某些情况下，需要从父元素里的 source 子元素获取。这是父元素的子集
const searchSource = ['bili-dyn-card-video__cover', 'hot-item-cover', 'season-cover']

// 某些情况下，需要从父元素里的 .cover-ctnr 子元素获取。这是父元素的子集
const searchCoverCtnr = ['cover-wrapper', 'hover-cover-box', 'room-card-wrapper', 'room-card-ctnr']

// 获取触发右键菜单的元素
document.body.addEventListener('contextmenu', function (e) {
	let ev = e || window.event;
	if (ev.ctrlKey) {
		getCoverImage(ev.target, ev);
	}
});

function getCoverImage (target, ev) {
	// 处理 target 就是封面图的情况
	if (target.nodeName === 'IMG') {
		openCoverImage(target.src);
		return
	}

	// 直播分区页面和“全部直播”
	if (location.href.startsWith('https://live.bilibili.com/p') || location.href.startsWith('https://live.bilibili.com/all')) {
		openCoverImage(getBG(target));
		return
	}

	// 直播间内
	if (/live.bilibili.com\/\d+/.test(location.href)) {
		if (__NEPTUNE_IS_MY_WAIFU__) {
			// 打开封面图
			const cover = __NEPTUNE_IS_MY_WAIFU__.roomInfoRes.data.room_info.cover
			openCoverImage(cover)
			// 打开背景图。如果背景图片是默认的，则是空字符串，此时不打开
			const bg = __NEPTUNE_IS_MY_WAIFU__.roomInfoRes.data.room_info.background
			bg && openCoverImage(bg)
			return
		}
	}

	// 处理当前元素及其子元素里含有背景图的情况
	for (const _class of ownsClass) {
		if (target.classList.contains(_class)) {
			if (_class === 'anchor-item') { //直播列表上部分
				openCoverImage(getBG(target, '.anchor-cover'));
			} else if (_class === 'room-cover-wrapper') { //直播列表下部分
				openCoverImage(getBG(target, '.room-cover'));
			} else if (_class === 'room-card-item') { //直播分类页面的列表
				openCoverImage(getBG(target, '.cover'));
			} else if (_class === 'album-top') { //相册封面
				openCoverImage(getBG(target, '.album-img'));
			} else if (_class === 'video-block') {
				openCoverImage(getBG(target, '.video-preview'));
			} else if (_class === 'bilibili-player-ending-panel-box-recommend') {
				openCoverImage(getBG(target, '.bilibili-player-ending-panel-box-recommend-img'));
			} else if (_class === 'm-recommend-item') {
				openCoverImage(getBG(target));
			} else {
				openCoverImage(target.querySelector('img').src);
			}
			return
		}
	}

	// 处理需要从父元素里查找背景图的情况
	let parentNode = target.parentNode;
	for (const _class of parentsClass) {
		if (parentNode.classList.contains(_class)) {
			// 有时从父元素的 source 子元素获取
			if (searchSource.includes(_class)) {
				const src = parentNode.querySelector('source')?.srcset
				if (src) {
					return openCoverImage(src);
				}
			}

			// 有时从父元素的特定子元素获取
			if (searchCoverCtnr.includes(_class)) {
				openCoverImage(getBG(parentNode, '.cover-ctnr'));
				return
			}

			// 视频播放完之后出现的相关推荐视频
			if (_class === 'bpx-player-ending-related-item') {
				openCoverImage(getBG(parentNode, '.bpx-player-ending-related-item-img'));
				return
			}

			// 有时从右键的元素的 img 子标签获取
			let childrens = parentNode.childNodes;
			for (let j = 0; j < childrens.length; j++) {
				if (childrens[j] === target) {
					openCoverImage(target.querySelector('img').src);
					return
				}
			}
		}
	}

	// 如果没有到BODY，则返回父元素，递归查找
	if (parentNode.tagName !== 'BODY') {
		return getCoverImage(parentNode);
	} else {
		// 如果到了BODY仍然没有找到，尝试直接获取视频播放页的封面。优先级要低，如果放在前面的话，用户点击播放页面的其他封面就不起作用了
		// 尝试直接获取储存封面图的IMG标签
		let cover_img = document.querySelector('.cover_image');
		if (cover_img !== null) {
			return openCoverImage(cover_img.src);
		}
		// 在视频播放页面内，从meta中获取封面图
		let meta_info = document.querySelector('meta[itemprop="image"]');
		if (meta_info !== null) {
			return openCoverImage(meta_info.content);
		}
		// 番剧播放页，使用另一个meta
		let bangumi_meta_info = document.querySelector('meta[property="og:image"]');
		if (bangumi_meta_info !== null) {
			return openCoverImage(bangumi_meta_info.content);
		}
		// 以上规则里都找不到时，直接取img的src
		if (target.tagName === 'IMG') {
			return openCoverImage(target.src);
		}
		// 最后也没找到
		console.log('cover not found');
		return
	}
}

const matchBGURL = /\/\/.*(?=")/;

// 从特定元素上获取背景图片
// 如果第二个参数为 undefined，表示背景图就在这个元素本身
// 如果背景图在这个元素的子元素上，则第二个参数需要传递子元素的选择器
function getBG (element, find_class) {
	let target = element
	if (find_class !== undefined) {
		target = element.querySelector(find_class);
	}
	return matchBGURL.exec(target.style.backgroundImage)[0];
}

function openCoverImage (url) {
	let coverImageBigUrl = url;
	// 去除url中的裁剪标识
	if (url.indexOf('@') > -1) { //处理以@做裁剪标识的url
		coverImageBigUrl = url.split('@')[0];
	}
	if (url.indexOf('jpg_') > -1) { //处理以_做裁剪标识的url
		coverImageBigUrl = url.split('jpg_')[0] + 'jpg'; //默认所有图片都是jpg格式的。如果不是jpg，则可能会出错
	}
	if (url.indexOf('png_') > -1) { //处理以_做裁剪标识的url
		coverImageBigUrl = url.split('png_')[0] + 'png';
	}
	if (url.indexOf('/320_200/') > -1) { //有时裁剪标识是在后缀名之前的 目前主要发现的是“番剧”板块的列表里有，但尚不清楚其他地方的情况
		coverImageBigUrl = url.replace('/320_200', '');
	}
	window.open(coverImageBigUrl);
}