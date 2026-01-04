// ==UserScript==
// @name         [Neko0] 图站增强Danbooru/Gelbooru/Konachan/Yande
// @description  加入快捷键操作，按下 ← 或 A 上一页，按下 → 或 D 下一页，按下 S 或 O 查看原图，按下 F 查看来源页面，没错，单手操作
// @version      1.0.2
// @author       JoJunIori
// @namespace    neko0-web-tools
// @icon         https://konachan.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @homepageURL  https://github.com/nekozero/neko0-web-tools
// @supportURL   https://t.me/+URovzRdPTyHlWtQd
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      AGPL-3.0-or-later
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/solid.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/js/fontawesome.min.js
// @include      *://gelbooru.com/*
// @include      *://safebooru.org/*
// @include      *://danbooru.donmai.us/*
// @include      *://konachan.com/*
// @include      *://yande.re/*
// @downloadURL https://update.greasyfork.org/scripts/387907/%5BNeko0%5D%20%E5%9B%BE%E7%AB%99%E5%A2%9E%E5%BC%BADanbooruGelbooruKonachanYande.user.js
// @updateURL https://update.greasyfork.org/scripts/387907/%5BNeko0%5D%20%E5%9B%BE%E7%AB%99%E5%A2%9E%E5%BC%BADanbooruGelbooruKonachanYande.meta.js
// ==/UserScript==

// 判断站点
let site
if (location.host === 'gelbooru.com') {
	site = 'g'
}
if (location.host === 'safebooru.org') {
	site = 's'
}
if (location.host === 'danbooru.donmai.us') {
	site = 'd'
}
if (location.host === 'konachan.com') {
	site = 'k'
}
if (location.host === 'yande.re') {
	site = 'y'
}
// 判断页面
let page
if (site.match(/g|s/)) {
	GM_addStyle(`
    img#image {
        max-width: calc(100vh - 14px);
        max-height: calc(100vh - 304px);
        width: auto !important;
        height: auto !important;
    }
    `)
	if (location.href.split('s=')[1].split('&')[0] === 'list') {
		page = 'list'
	}
	if (location.href.split('s=')[1].split('&')[0] === 'view') {
		page = 'view'
	}
}
if (site.match(/d/)) {
	if ($('body').hasClass('a-index')) {
		page = 'list'
	}
	if ($('body').hasClass('a-show')) {
		page = 'view'
	}
}
if (site.match(/k|y/)) {
	if ($('html').hasClass('action-post-index')) {
		page = 'list'
	}
	if ($('html').hasClass('action-post-show')) {
		page = 'view'
	}
}

// 站点结构分类别
let structure = [
	{
		searchInputId: 'tags-search',
		prevPage: $('.pagination b').prev('a')[0],
		nextPage: $('.pagination b').next('a')[0],
		originalSize: $('a:contains("Original image")')[0],
		sourceFrom: $('li:contains("Source:") a')[0],
	},
	{
		searchInputId: 'tags',
		prevPage: $('#paginator-prev')[0],
		nextPage: $('#paginator-next')[0],
		originalSize: $('li:contains("Size:") a')[0],
		sourceFrom: $('li:contains("Source:") a')[0],
	},
	{
		searchInputId: 'tags',
		prevPage: $('.previous_page')[0],
		nextPage: $('.next_page')[0],
		originalSize: $('#png')[0] ? $('#png')[0] : $('#highres')[0],
		sourceFrom: $('li:contains("Source:") a')[0],
	},
]
let arg4site = {
	g: structure[0],
	s: structure[0],
	d: structure[1],
	k: structure[2],
	y: structure[2],
}

// 快捷键加强
$(document).keydown(function (event) {
	// 判断在输入框内则不触发快捷操作
	if (document.activeElement.id === arg4site[site].searchInputId) {
		return
	}

	// 当前按键
	let keyCode = event.keyCode.toString()

	// 列表页内
	if (page === 'list') {
		// 按下 ← 或 A 触发上一页
		if (keyCode.match(/37|65/)) {
			arg4site[site].prevPage.click()
		}
		// 按下 → 或 D 触发下一页
		if (keyCode.match(/39|68/)) {
			arg4site[site].nextPage.click()
		}
	}

	// 详情页内
	if (page === 'view') {
		// 按下 S 或 O
		if (keyCode.match(/83|79/)) {
			// 查看原图
			arg4site[site].originalSize.click()
		}
		// 按下 F
		if (keyCode.match(/70/)) {
			// 查看来源
			arg4site[site].sourceFrom.click()
		}
	}
})
