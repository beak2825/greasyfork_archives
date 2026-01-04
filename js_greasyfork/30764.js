// ==UserScript==
// @name        SteamBadgeShowNext
// @namespace   SteamBadgeShowNext@Byzod.user.js
// @description 在徽章页面查看下一级徽章图标
// @include     /^https?:\/\/steamcommunity\.com\/(profiles|id)\/[^\/]+\/badges/
// @version     2017-6-19
// @grant       GM_xmlhttpRequest
// jshint esversion:6
// @downloadURL https://update.greasyfork.org/scripts/30764/SteamBadgeShowNext.user.js
// @updateURL https://update.greasyfork.org/scripts/30764/SteamBadgeShowNext.meta.js
// ==/UserScript==


// Steam CDN 主机
const STEAM_CDN_HOST = "cdn.steamstatic.com.8686c.com";
// LAZY_LOAD_DISTANCE 像素内的徽章图标才会加载
const LAZY_LOAD_DISTANCE = 500;
// Steam loading 图标
const STEAM_LOADING_INDICATOR_URL = "http://steamcommunity-a.akamaihd.net/public/images/login/throbber.gif";
// SCE 徽章页面前缀 （ + appId ）
const SCE_BADGES_URL_PREFIX = "http://www.steamcardexchange.net/index.php?gamepage-appid-";
// 升到顶级的提示图标，PNG最佳
// const HIGHEST_LEVEL_INDICATOR_URL = "https://steamcommunity-a.akamaihd.net/public/images/badges/generic/ValveEmployee_80.png";
const HIGHEST_LEVEL_INDICATOR_URL = "data:image/png;base64,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";

// “差不多这个意思”版延迟加载类
// targets: 需要lazy load的目标们
// callback: 目标可见后的回调处理
//   有一个参数target，为状态变为可见的目标
function LazyLoader(targets, callback){
	// 监视对象Set
	this.Targets = targets ? new Set(targets) : new Set();
	// 回调函数
	this.Callback = (callback && typeof(callback)==="function") ? callback : null;
	// Lazy load距离 (像素)
	this.Distance = 0;
	// 初始化
	this.Init = function(win){
		win = win ? win : window;
		win.addEventListener("scroll", ScrollEventHandler, false);
		// 先调用一次，处理目前可视区域
		ScrollEventHandler(null);
	}
	
	let ScrollEventHandler = e => {
		// console.log('[LazyLoader] 处理Scroll event, 例遍 %o 个目标...', this.Targets.size) // DEBUG
		this.Targets.forEach(target => {
			// target 可见
			if(this.Callback
				&& typeof(this.Callback)==="function"
				&& LazyLoader.IsElementVisible(target, this.Distance)){
				// console.log('[LazyLoader] 正在处理 ' + target.innerText) // DEBUG
				// 回调
				this.Callback(target);
				// 从Set里移除已回调的target
				this.Targets.delete(target);
			}
		});
	}
}

// Static function
// 对象是否可见？（在视野distance像素内）
LazyLoader.IsElementVisible = function IsElementVisible(elem, distance){
	if(!distance){
		distance = 0;
	}
	if(elem){
		let viewport = {
			width : window.innerWidth,
			height : window.innerHeight
		};
		// console.log("[IsElementVisible]: viewport %o" + viewport); // DEBUG
		
		let rect = elem.getBoundingClientRect();
		// console.log("[IsElementVisible]: rect %o" + rect); // DEBUG
		
		return (
			rect.left < viewport.width + distance
			&& rect.right > 0 - distance
			&& rect.top < viewport.height + distance
			&& rect.bottom > 0 - distance
		);
	} else {
		throw("[IsElementVisible]: Element not exist");
	}
}

// 插入样式
let badgeImageCSS = document.createElement("style");
badgeImageCSS.innerHTML = `
	.badge_next {
		position: absolute;
		overflow: hidden;
		width: 100px;
		top: -5px;
		left: -120px;
		bottom: -5px;
		padding: 5px;
		background: linear-gradient( to bottom, #232424 5%, #141414 95%);
	}
	.badge_next_loading {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.showcase-element {
		position: absolute;
		left: 0;
		right: 0;
	}
	.element-image {
		width: 80px;
		height: 80px;
		margin: 0px auto 0px auto;
		display: block;
		float: none;
	}
	.element-text {
		text-align: center;
		display: block;
		padding-top: 2px;
	}
	.element-experience {
		text-align: center;
		display: block;
		padding-top: 2px;
		color: #8F98A0;
	}
	.badge_highest_level{
		padding-top: 20px;
		box-shadow:0 1px 4px rgba(255, 255, 255, 0.3), 0 0 20px 5px rgba(255, 255, 255, 0.1);
	}
`
document.head.appendChild(badgeImageCSS);


// 插入下一级徽章图
let badgeRows = document.querySelectorAll(".badge_row");
// console.log("[Steam+]: badgeRows: " + badgeRows.length); // DEBUG
// 延迟附加徽章图
let lazyLoader = new LazyLoader(
	badgeRows,
	row => {
		let appIdMatch = row.querySelector(".badge_row_overlay").href.match(/gamecards\/(\d+)(\/\?border=1)?/);
		let appId = appIdMatch ? appIdMatch[1] : 0;
		let foil = appIdMatch && appIdMatch.length > 2 && appIdMatch[2] ? true : false;
		
		let currentLevelInfo = row.querySelector(".badge_info_title + div");
		let currentLevel = currentLevelInfo ? parseInt(currentLevelInfo.innerText.match(/\d+/)[0]) : 0;
		
		// console.log(`[Steam+]: 处理 ${appId} (lv.${currentLevel}${foil?" foil":""})`); // DEBUG
		// 获取徽章数据
		if(appId !== 0){
			let badgeNextShowcase = document.createElement("a");
			badgeNextShowcase.className = "badge_next";
			badgeNextShowcase.href = SCE_BADGES_URL_PREFIX + appId;
			badgeNextShowcase.target = "_blank";
			badgeNextShowcase.innerHTML = '<img class="badge_next_loading" src="' + STEAM_LOADING_INDICATOR_URL + '" alt="Loading" />';
			
			GM_xmlhttpRequest({
				method: "GET",
				url: SCE_BADGES_URL_PREFIX + appId,
				onload: function (response) {
					let badgeData = PraseBadgeData(response.responseText);
					if(badgeData){
						let showcase = GetNextLevelBadgeShowcase(
							foil ? badgeData.FoilBadgeShowcases : badgeData.BadgeShowcases,
							currentLevel
						);
						// 停止转圈圈
						badgeNextShowcase.innerHTML = '';
						if(showcase){
							// 一切正常就显示徽章
							// console.log("[Steam+]: showcase (foil: %o): %o: ", foil, showcase); // DEBUG
							badgeNextShowcase.appendChild(showcase);
						} else {
							// 找不到showcase，已经最高级了
							// 随便恭喜一下
							badgeNextShowcase.classList.add("badge_highest_level");
							badgeNextShowcase.innerHTML = '<div class="showcase-element badge_info"><img class="element-image badge_info_image" src="' + HIGHEST_LEVEL_INDICATOR_URL + '" alt="Top Level"><span class="element-text badge_info_description badge_info_title">已升至顶级</span></div>';
						}
					}
				}
			});
			
			// 添加徽章展柜
			row.appendChild(
				badgeNextShowcase
			);
		}
	}
);
// 设置lazy loader参数
// 可视范围外额外lazy load的范围 (像素)
lazyLoader.Distance = LAZY_LOAD_DISTANCE;
lazyLoader.Init(window);

// 处理SCE数据
function PraseBadgeData(data){
	// SCE 文档碎片
	let sceFrag;
	// Badge 数据
	let badgeData = null;
	// 徽章选择器
	let badgeSelector = ".badge>.showcase-element";
	
	// 将 SCE 页面中的链接替换成支持 https 的域名
	data = data.replace(/https?:\/\/(community\.edgecast\.steamstatic\.com|steamcommunity-a\.akamaihd\.net|cdn\.steamcommunity\.com)\//g, "//steamcommunity-a.akamaihd.net/");
	data = data.replace(/https?:\/\/(cdn\.edgecast\.steamstatic\.com|steamcdn-a\.akamaihd\.net|cdn\.akamai\.steamstatic\.com)\//g, "//steamcdn-a.akamaihd.net/");
	// 先去除又臭又长的下拉菜单选项……
	data = data.replace(/<select[^]+<\/select>/,"");
	// 替换为Steam样式的class
	data = data.replace(/class="showcase-element"/g, 'class="showcase-element badge_info"');
	data = data.replace(/class="element-image"/g, 'class="element-image badge_info_image"');
	data = data.replace(/class="element-text"/g, 'class="element-text badge_info_description badge_info_title"');
	data = data.replace(/class="element-experience"/g, 'class="element-experience badge_info_description"');
	
	// 转为DOM
	sceFrag = document.createRange().createContextualFragment(data);
	
	// 普通徽章
	let badgeRows = ClosetParentNode(
		sceFrag.querySelector(".showcase-element-container.badge"), // 第一个.badge 父节点即为普通徽章box
		".content-box"
	);
	// 闪亮徽章
	let foilBadgeRows = badgeRows ? badgeRows.nextSibling : null; // 好兄弟排排坐
	if(badgeRows && foilBadgeRows){
		badgeData = {
			BadgeShowcases : badgeRows.querySelectorAll(badgeSelector),
			FoilBadgeShowcases : foilBadgeRows.querySelectorAll(badgeSelector)
		};
	} else {
		badgeData = null;
	}
	
	// console.log("[Steam+]: badgeData: %o: ", badgeData); // DEBUG
	
	return badgeData;
}

// 简单实现JQuery的closet
function ClosetParentNode(elem, selector){
	let parent = null;
	
	while (elem) {
		parent = elem.parentElement;
		if (parent && parent.matches(selector)) {
			return parent;
		}
		elem = parent;
	}
	return null;
}

// 获取下一等级徽章showcase
function GetNextLevelBadgeShowcase(badgeShowcases, currentLevel){
	let showcase = null;
	const LEVEL_SELECTOR = ".element-experience";
	// {level} or {level low} - {level high} or {level low} - ???
	const LEVEL_REGEX = /Level (\d+)(?: - (\d+|\?\?\?))?/;
	
	for(let badge of badgeShowcases){
		let levelElem = badge.querySelector(LEVEL_SELECTOR);
		// 没有level也不要慌，showcase有很多空的，略过就是
		if(levelElem){
			let levelMatch = levelElem.innerText.match(LEVEL_REGEX);
			
			// 只有low的时候取low，有low和high时取high
			let level = levelMatch 
				? (levelMatch.length > 2 && levelMatch[2]
					? levelMatch[2]
					: levelMatch[1]
					)
				: 0;
			// 转为Int
			level = isNaN(level)
				? (level === "???" ? Infinity : 0) // 特别的，high=???代表该徽章可无限升级。给夏促大佬递女装
				: parseInt(level);
			if(level > currentLevel){
				// 找到下一级了，走起
				showcase = badge;
				break;
			}
		}
	}
	
	return showcase;
}