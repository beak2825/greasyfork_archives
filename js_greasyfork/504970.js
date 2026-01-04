// ==UserScript==
// @name         ⏰JAV larger thumbnails
// @name:zh-CN   ⏰JAV 封面大图
// @namespace    https://github.com/zhuangyin8
// @homepage     https://greasyfork.org/zh-CN/scripts/504970-javbus-larger-thumbnails
// @version      2024-10-31
// @author       zhuangyin
// @license      MIT
// @description          replace thumbnails of javbus,javdb,javlibrary and avmoo with source images
// @description:zh-CN    javbus,javdb,javlibrary,avmoo替换封面为源图

// @include      *javbus.com/*
// @include      *javdb.com/*
// @include      *avmoo.cyou/*
// @include      *javlibrary.com/*
// @include      /^.*(javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav)\..*$/
// @include      /^.*(javdb)[0-9]*\..*$/
// @include      /^.*(avmoo)\..*$/

// @require      https://cdn.jsdelivr.net/npm/vanilla-lazyload@19.1.3/dist/lazyload.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_setClipboard
// @connect      pics.dmm.co.jp
// @connect      cc3001.dmm.co.jp
// @connect      www.prestige-av.com

// 2024-06-29 修复图片下载失败的问题;新增更新内容通知弹窗
// 2022-09-18 修复视频截图报错
// 2022-05-26 调整lazyload插件为本地加载; 加载插件方法loadJS增加备用源
// 2022-04-29 适配javdb的新页面; 查看视频截图: 增加blogjav的防攻击跳转提示
// 2022-04-17 调整javdb的磁力元素选择器;查看视频截图：显示所有的结果
// 2022-03-28 匹配dmmbus;修复标题不可点击的bug;屏蔽词:支持逗号和单个作品,调整界面到右下角
// 2022-03-18 修复欧美区磁力按钮打开重复的问题；javlibrary添加将左侧菜单上移的功能
// 2022-03-04 新增屏蔽词功能
// 2022-03-03 调整设置按钮到左上角；删除javdb磁力列表里的广告
// 2021-10-07 调整下载界面样式；下载文件名调整为番号+标题
// 2021-09-03 匹配javdb更多网址 例如javdb30
// 2021-08-18 调整blogjav视频截图获取方法
// 2021-06-07 添加封面图片的批量下载功能
// 2021-06-03 修复javdb磁力弹窗预告片播放bug；番号变成可点击
// 2021-06-01 修复多列布局下 图片样式失效的问题
// 2021-05-31 JavDb添加磁力功能;解决已点击链接颜色失效问题;对大于标准宽高比的图片进行缩放;
// 2021-05-06 适配javlibrary;添加标题全显样式控制;自动翻页开关无需刷新页面;删除高清图标的显示控制
// 2021-04-04 适配JAVDB;点击图片弹出新窗口;标题默认显示一行;调整样式;增加英文显示
// 2021-03-09 恢复高清字幕图标的显示
// 2021-02-06 新增图片懒加载插件；重调样式；优化按钮效果，切换样式不刷新页面；磁力界面新增演员表样品图显示；
// 2021-01-18 适配AVMOO网站;无码页面屏蔽竖图模式;调整域名匹配规则
// 2021-01-01 新增宽度调整功能;
// 2020-12-29 解决半图模式下 竖图显示不全的问题;
// 2020-10-16 解决功能开关取默认值为undefined的bug
// 2020-10-16 解决和"JAV老司机"同时运行时样式冲突问题，需关闭老司机的瀑布流
// 2020-10-14 收藏界面只匹配影片；下载图片文件名添加标题；新增复制番号、标题功能；视频截图文件下载；封面显示半图；增加样式开关
// 2020-09-20 收藏界面的适配
// 2020-08-27 适配更多界面
// 2020-08-26 修复查询结果为1个时，item宽度为100%的问题
// 2020-08-26 添加瀑布流
// 2020-08-24 第一版：封面大图、下载封面、查看视频截图
// @downloadURL https://update.greasyfork.org/scripts/504970/%E2%8F%B0JAV%20larger%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/504970/%E2%8F%B0JAV%20larger%20thumbnails.meta.js
// ==/UserScript==

(function () {
	"use strict";
	let statusDefault = {
		autoPage: false,
		copyBtn: true,
		toolBar: true,
		avInfo: true,
		halfImg: false,
		fullTitle: false,
		waterfallWidth: 100,
		columnNumFull: 3,
		columnNumHalf: 4,
		menutoTop: false,
		hiddenWord: [],
		hiddenAvid: [],
		hiddenCategory: [] // todo hide 类别 例如變性者
	};
	const VERSION = "20240904";
	const NOTICE = "2024-09-04: 修复图片下载失败的问题";
	const SCREENSHOT_SUFFIX = "-screenshot-tag";
	const AVINFO_SUFFIX = "-avInfo-tag";
	const blogjavSelector = "h2.entry-title>a";
	const fullImgCSS = `width: 100%!important;height:100%!important;`;
	const halfImgCSS = `position: relative;left: -112%;width: 212% !important;height: 100% !important;max-width: 212%;`;

	const copy_Svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"  width="16" height="16" viewBox="0 0 16 16"><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/></svg>`;
	const download_Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="tool-svg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/></svg>`;
	const picture_Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"  class="tool-svg" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/></svg>`;
	const magnet_Svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"  class="tool-svg" x="0px" y="0px" viewBox="0 0 1000 1000" ><g><g transform="translate(0.000000,460.000000) scale(0.100000,-0.100000)"><path d="M4171.6,3994c-183.9-13.4-515.3-67.1-706.9-113c-770.2-187.7-1448.4-563.3-2021.2-1118.8c-707-685.9-1130.3-1494.4-1299-2481c-59.4-358.3-59.4-1002,0-1360.2c157.1-923.4,546-1705.1,1172.5-2354.6c695.4-722.3,1534.6-1159.1,2548.1-1325.7c174.4-28.7,388.9-34.5,1643.8-40.2l1440.7-7.7v1302.8v1302.8l-1354.5,7.6c-1207,5.7-1369.8,9.6-1480.9,40.2c-448.3,116.9-785.5,335.3-1036.5,666.7c-252.9,339.1-364,666.7-364,1088.2s111.1,749.1,364,1088.2c241.4,318,595.8,551.8,1000.1,659.1c157.1,40.2,191.6,42.1,1517.3,47.9l1354.5,7.7v1302.8v1300.9l-1344.9-3.8C4863.3,4001.6,4219.5,3997.8,4171.6,3994z"/><path d="M7620.1,2704.6V1401.8h1139.9H9900v1302.8v1302.8H8760.1H7620.1V2704.6z"/><path d="M7620.1-3502.7v-1302.8h1139.9H9900v1302.8v1302.8H8760.1H7620.1V-3502.7z"/></g></g></svg>`;

	const LOCALE = {
		zh: {
			menuText: "设置",
			menu_autoPage: "自动下一页",
			menu_copyBtn: "复制图标",
			menu_toolBar: "功能图标",
			menu_avInfo: "弹窗中的演员和样品图",
			menu_halfImg: "竖图模式",
			menu_fullTitle: "标题全显",
			menu_columnNum: "列",
			menu_menutoTop: "左侧菜单移至上方",
			copyButton: "复制",
			copySuccess: "复制成功",
			getAvImg_norespond: "blogjav.net网站暂时无法响应",
			getAvImg_none: "未搜索到",
			tool_magnetTip: "磁力",
			tool_downloadTip: "下载封面",
			tool_pictureTip: "视频截图(blogjav.net)需代理",
			scrollerPlugin_end: "完"
		},
		en: {
			menuText: "Settings",
			menu_autoPage: "auto Next Page",
			menu_copyBtn: "copy icon",
			menu_toolBar: "tools icon",
			menu_avInfo: "actors and sample images in pop-ups",
			menu_halfImg: "Vertical image mode",
			menu_fullTitle: "Full Title",
			menu_columnNum: "columns",
			menu_menutoTop: "Move the left menu to the top",
			copyButton: "Copy",
			copySuccess: "Copy successful",
			getAvImg_norespond: "blogjav.net is temporarily unable to respond",
			getAvImg_none: "Not found",
			tool_magnetTip: "Magnet",
			tool_downloadTip: "Download cover",
			tool_pictureTip: "Video screenshot from blogjav.net",
			scrollerPlugin_end: "End"
		}
	};
	let getlanguage = () => {
		let local = navigator.language;
		local = local.toLowerCase().replace("_", "-");
		if (local in LOCALE) {
			return LOCALE[local];
		} else if (local.split("-")[0] in LOCALE) {
			return LOCALE[local.split("-")[0]];
		} else {
			return LOCALE.en;
		}
	};
	let lang = getlanguage();

	// 弹出提示框
	let showAlert = (msg, close = false) => {
		const alertElement = document.createElement("div");
		alertElement.classList.add("alert-zdy");
		alertElement.textContent = msg;

		if (close) {
			const closeElement = document.createElement("div");
			closeElement.style.cssText =
				"display: inline-block;padding: 0 0 0 10px;color:gray;cursor: pointer;";
			closeElement.textContent = "X";
			alertElement.append(closeElement);

			closeElement.addEventListener("click", () => (alertElement.hidden = true));
		}

		document.body.appendChild(alertElement);
		alertElement.style.marginTop = `-${alertElement.offsetHeight / 2}px`;
		alertElement.style.marginLeft = `-${alertElement.offsetWidth / 2}px`;
		alertElement.style.display = "block";

		if (!close) {
			setTimeout(() => alertElement.classList.add("fadeOut"), 3000);
		}
	};
	//图片加载时的回调函数
	let imgCallback = (img) => {
		if (Status.isHalfImg()) {
			if (img.height < img.width) {
				img.style = halfImgCSS;
			} else {
				img.style = fullImgCSS;
			}
		} else {
			//大图模式下，对大于标准比例(以ipx的封面为准)的图片进行缩小
			if (img.height / img.width >= 0.7) {
				img.style = `width:${(img.width * 67.25) / img.height}%;`;
			} else {
				img.style = fullImgCSS;
			}
		}
	};

	let Status = {
		halfImg_block: false, //是否屏蔽竖图模式，默认为否
		set: function (key, value) {
			if (key == "columnNum") {
				key = key + (this.isHalfImg() ? "Half" : "Full");
			} else if (key == "waterfallWidth") {
				key = key + "_" + currentWeb; //宽度为各网站独立属性
			}
			return GM_setValue(key, value);
		},
		get: function (key) {
			return GM_getValue(
				key == "waterfallWidth" ? key + "_" + currentWeb : key,
				statusDefault[key]
			);
		},
		//是否为竖图模式
		isHalfImg: function () {
			return this.get("halfImg") && !this.halfImg_block;
		},
		//获取列数
		getColumnNum: function () {
			var key = "columnNum" + (this.isHalfImg() ? "Half" : "Full");
			return this.get(key);
		}
	};
	//弹窗类，用于展示演员,样品图和磁力
	class Popover {
		show() {
			document.documentElement.classList.add("scrollBarHide");
			this.element.show({
				duration: 0,
				start: function () {
					var t = $(this).find("#modal-div");
					//t.css({ transform: "translateY(10%)" });
					//t.css({"margin-top": Math.max(0, ($(window).height() - t.height()) / 2),});
				}
			});
		}
		hide() {
			document.documentElement.classList.remove("scrollBarHide");
			this.element.hide(); //<div id="myModal" style="display: none;">
			//this.element.find('.pop-up-tag').hide();
			this.element.find(".pop-up-tag").remove(); //解决弹窗关闭之后番号数据没有清除
		}
		init() {
			var me = this;
			me.element = $('<div  id="myModal"><div  id="modal-div" > </div></div>');
			me.element.on("click", function (e) {
				if ($(e.target).closest("#modal-div").length == 0) {
					me.hide();
				}
			});
			me.scrollBarWidth = me.getScrollBarWidth();
			GM_addStyle(
				`.scrollBarHide{ padding-right:${me.scrollBarWidth}px;overflow:hidden;}`
			);
			$("body").append(me.element);
			//加载javbus的图片浏览插件
			if (currentWeb == "javbus") {
				me.element.magnificPopup({
					delegate: "a.sample-box-zdy:visible",
					type: "image",
					closeOnContentClick: false,
					closeBtnInside: false,
					mainClass: "mfp-with-zoom mfp-img-mobile",
					image: { verticalFit: true },
					gallery: { enabled: true },
					zoom: {
						enabled: true,
						duration: 300,
						opener: function (element) {
							return element.find("img");
						}
					}
				});
			}
		}
		append(elem) {
			if (!this.element) {
				this.init();
			}
			this.element.find("#modal-div").append(elem);
			return this;
		}
		//获取滚动条的宽度
		getScrollBarWidth() {
			var el = document.createElement("p");
			var styles = { width: "100px", height: "100px", overflowY: "scroll" };
			for (var i in styles) {
				el.style[i] = styles[i];
			}
			document.body.appendChild(el);
			var scrollBarWidth = el.offsetWidth - el.clientWidth;
			el.remove();
			return scrollBarWidth;
		}
	}
	//
	class SettingMenu {
		onChange = {
			autoPage: function () {
				if (scroller) {
					scroller.destroy();
					scroller = null;
				} else {
					scroller = new ScrollerPlugin($("#grid-b"), lazyLoad);
				}
			},
			copyBtn: function () {
				$("#grid-b .copy-span").toggle();
			},
			toolBar: function () {
				$("#grid-b .toolbar-b").toggle();
			},
			halfImg: function () {
				let me = this;
				$("#grid-b .box-b img.loaded").each(function (index, el) {
					imgCallback(el);
				});
				var columnNum = Status.getColumnNum();
				GM_addStyle(`#grid-b .item-b{ width: ${100 / columnNum}%;}`);
				$("#columnNum_range").val(columnNum);
				$("#columnNum_range+span").text(columnNum);
			},
			fullTitle: function () {
				$("#grid-b a[name='av-title']").toggleClass("titleNowrap");
			},
			avInfo: function () {},
			menutoTop: function () {
				location.reload();
			},
			columnNum: function (columnNum) {
				GM_addStyle(`#grid-b .item-b{ width: ${100 / columnNum}%;}`);
			},
			waterfallWidth: function (width) {
				$(currentObj.widthSelector).css({
					width: `${width}%`,
					margin: `0 ${width > 100 ? (100 - width) / 2 + "%" : "auto"}`
				});
			},
			downloadPanel: () => {
				TabPanel.getInstance().show(0);
			},
			addHiddenWords: () => {
				TabPanel.getInstance().show(1);
			}
		};
		constructor() {
			let columnNum = Status.getColumnNum();
			let $menu = $('<div id="menu-div"></div>');
			$menu.append(this.creatCheckbox("autoPage", lang.menu_autoPage));
			$menu.append(this.creatCheckbox("copyBtn", lang.menu_copyBtn));
			$menu.append(this.creatCheckbox("toolBar", lang.menu_toolBar));
			$menu.append(
				this.creatCheckbox("halfImg", lang.menu_halfImg, Status.halfImg_block)
			);
			$menu.append(this.creatCheckbox("fullTitle", lang.menu_fullTitle));
			if (["javbus", "javdb"].includes(currentWeb)) {
				$menu.append(this.creatCheckbox("avInfo", lang.menu_avInfo));
			}
			if (currentWeb == "javlibrary") {
				$menu.append(this.creatCheckbox("menutoTop", lang.menu_menutoTop));
			}
			$menu.append(
				this.creatRange("columnNum", lang.menu_columnNum, columnNum, 8)
			);
			/*$menu.append(this.creatRange("waterfallWidth","%",Status.get("waterfallWidth"),currentObj.maxWidth ? currentObj.maxWidth : 100));*/
			$menu.append(this.creatButton("downloadPanel", "批量下载封面"));
			$menu.append(this.creatButton("addHiddenWords", "添加屏蔽词"));
			let $circle = $(
				`<div style="position: ${
					currentWeb == "javlibrary" ? "absolute" : "fixed"
				};z-index: 1030;left:0;top:${
					currentWeb == "javlibrary" ? "36px" : "0px"
				};"><div style="width: 40px;height: 40px;background-color: rgb(208 176 176 / 90%);border-radius: 20px;"></div></div>`
			);
			$circle.append($menu);
			$circle.mouseenter(() => $menu.show()).mouseleave(() => $menu.hide());
			$("body").append($circle);
			notice($menu);
		}
		creatCheckbox(fName, name, disabled) {
			//console.log(fName);
			let me = this;
			let $checkbox = $(
				`<div class="switch-div"><input ${
					disabled ? 'disabled="disabled"' : ""
				} type="checkbox" id="${fName}_checkbox" /><label for="${fName}_checkbox" >${name}</label></div>`
			);
			$checkbox.find("input")[0].checked = Status.get(fName);
			$checkbox
				.find("input")
				.eq(0)
				.click(function () {
					Status.set(fName, this.checked);
					me.onChange[fName]();
				});
			return $checkbox;
		}
		creatRange(fName, name, value, max) {
			let me = this;
			let $range = $(
				`<div class="range-div"><input type="range" id="${fName}_range"  min="4" max="${max}" step="1" value="${value}"  /><span name="value">${value}</span><span>${name}</span></div>`
			);
			$range.bind("input propertychange", function () {
				var val = $(this).find("input").eq(0).val();
				$(this).find("span[name=value]").html(val);
				Status.set(fName, val);
				me.onChange[fName](val);
			});
			return $range;
		}
		creatButton(fName, name) {
			let me = this;
			var $button = $(
				`<div style="margin:3px;"><button style="width: 100%;padding: 3px;">${name}</button></div>`
			);
			$button.bind("click", () => {
				me.onChange[fName]();
			});
			return $button;
		}
	}

	const notice = ($menu) => {
		let version = Status.get("version");
		if (version != VERSION) {
			if (!version) {
				$menu.slideDown();
			}
			showAlert(NOTICE, true);
			Status.set("version", VERSION);
		}
	};
	function showMagnetTable(itemID, avid, href, elem) {
		if ($(elem).hasClass("span-loading")) {
			return;
		}
		let tagName = `${itemID}${AVINFO_SUFFIX}`;
		let $el = $(`.pop-up-tag[name='${tagName}']`);
		if ($el.length > 0) {
			$el.show();
			myModal.show();
		} else {
			$(elem).addClass("span-loading");
			Promise.resolve()
				.then(() => {
					switch (currentWeb) {
						case "javbus": {
							return getMagnet4JavBus(href, tagName);
						}
						case "javdb": {
							return getMagnet4JavDB(href, tagName, itemID, avid);
						}
					}
				})
				.then((dom) => {
					myModal.append(dom).show();
				})
				.catch((err) => alert(err))
				.then(() => $(elem).removeClass("span-loading"));
		}
	}

	//获取javdb的演员、预览图、磁力信息
	async function getMagnet4JavDB(href, tagName, itemID, avid) {
		GM_addStyle(`#modal-div .pop-up-tag {display: grid;  grid-template-columns: repeat(2, 1fr);grid-auto-rows: minmax(100px, auto);
        grid-template-areas:"b b""c d";}/*.pop-up-tag .panel-block{grid-area: a;}*/.pop-up-tag div:first-child{grid-area: b;}
        .pop-up-tag div:nth-child(2){grid-area: c;}.pop-up-tag nav{grid-area: d;}#tabs-container{max-height: 442px;overflow-x: hidden}
        .panel > .panel-block,.review-items *{display: inline-block;}`);
		let doc = await fetch(href).then((response) => response.text());
		let parsedDoc = new DOMParser().parseFromString(doc, "text/html");
		let info = document.createElement("div");
		info.classList.add("pop-up-tag");
		info.setAttribute("name", tagName);
		if (Status.get("avInfo")) {
			let previewImages = parsedDoc.querySelector(
				`div.tile-images.preview-images`
			); //""

			const repeatLastChild = (parent, targetCount = 12) => {
				const childCount = parent.children.length;
				if (childCount < targetCount) {
					const lastChild = parent.lastElementChild;
					for (let i = childCount; i < targetCount; i++) {
						parent.appendChild(lastChild.cloneNode(true));
					}
				}
			};
			repeatLastChild(previewImages, 12);
			console.log(previewImages);
			dmm(previewImages, avid);
			info.appendChild(previewImages || document.createElement("div")); // Handle empty case
			//info.appendChild(document.createElement("div")).dataset.controller ="movie-tab"; // More readable
		}
		const magnetTable = parsedDoc.querySelector(
			`div.columns[data-controller="movie-tab"]`
		);
		magnetTable.querySelector("div.top-meta").remove();
		const moviePanelInfo = parsedDoc.querySelector(".movie-panel-info");
		info.appendChild(magnetTable);
		info.appendChild(moviePanelInfo);
		return info;
	}
	/*根据番号转换用于在JAVDB详情页面替换预览图片的dmm获取 如果javdb没有预览图*/
	const dmm = (previewImages, avid) => {
		previewImages.querySelectorAll("a.tile-item").forEach((el, i) => {
			i += 1;
			const arr = avid.split("-");
			const qian = arr[0].toLowerCase();
			const hou = arr[1];
			let fanhao, url;
			if (
				[
					"aed",
					"ako",
					"anb",
					"apaa",
					"apns",
					"aquco",
					"aqula",
					"aran",
					"atid",
					"awd",
					"dass",
					"dvdms",
					"ekdv",
					"erofc",
					"fbos",
					"fjin",
					"hkd",
					"hoks",
					"hunta",
					"huntb",
					"huntc",
					"hhhvr",
					"instc",
					"jsop",
					"lulu",
					"kiwvr",
					"ktra",
					"mide",
					"midv",
					"nima",
					"omhd",
					"pred",
					"snis",
					"sivr",
					"sone",
					"sqte",
					"ssni",
					"tttv",
					"urvrsp"
				].includes(qian) ||
				(qian == "vrkm" && hou > 167 && hou < 1000) ||
				(qian == "savr" && hou > 105) ||
				(qian == "crvr" && hou > 239) ||
				(qian == "mkmp" && hou > 389) ||
				(qian == "wanz" && hou > 261)
			) {
				fanhao = `${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (qian == "vrkm" && hou > 999) {
				fanhao = `${qian}0${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (
				[
					"aege",
					"akdl",
					"bkynb",
					"dandy",
					"dldss",
					"drpt",
					"dvdes",
					"fadss",
					"fcdss",
					"fsdss",
					"fset",
					"fsvss",
					"ftht",
					"ftk",
					"ftkd",
					"gar",
					"havd",
					"hbad",
					"iene",
					"ienf",
					"ienfh",
					"kmhr",
					"kmhrs",
					"mane",
					"mfth",
					"mist",
					"mogi",
					"moon",
					"msfh",
					"msfh",
					"mtall",
					"nhdta",
					"nhdtb",
					"nhvr",
					"ntr",
					"nyh",
					"piyo",
					"rct",
					"rctd",
					"sdhs",
					"setm",
					"sdab",
					"sdam",
					"sdde",
					"sdjs",
					"sdmf",
					"sdmm",
					"sdmu",
					"sdmua",
					"sdnm",
					"sdnt",
					"sdth",
					"senn",
					"seven",
					"sgki",
					"shh",
					"shn",
					"silkc",
					"sply",
					"star",
					"stars",
					"start",
					"stko",
					"sun",
					"suwk",
					"svdvd",
					"svgal",
					"svmgm",
					"sw",
					"wawa",
					"wo"
				].includes(qian)
			) {
				fanhao = `1${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["wzen"].includes(qian)) {
				fanhao = `2${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["wanz"].includes(qian) || (qian == "wanz" && hou < 262)) {
				fanhao = `3${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["lol"].includes(qian)) {
				fanhao = `12${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["gg", "gvg"].includes(qian)) {
				fanhao = `13${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["mond"].includes(qian)) {
				fanhao = `18${qian}0${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["dsvr"].includes(qian)) {
				fanhao = `13${qian}0${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["doks"].includes(qian)) {
				fanhao = `36${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["tmavr"].includes(qian)) {
				fanhao = `55${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["hez"].includes(qian)) {
				fanhao = `59${qian}${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (
				["tpvr", "kmvr", "kbvr", "averv"].includes(qian) ||
				(qian == "vrkm" && hou < 168) ||
				(qian == "mkmp" && hou < 390)
			) {
				fanhao = `84${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (
				[
					"abf",
					"abp",
					/*'abw',*/ "aoi",
					"bgn",
					"docp",
					"fir",
					"gets",
					"giro",
					"gnab",
					/*'good',*/ "har",
					"jbs",
					"kbi",
					"mas",
					"mct",
					"npv",
					"ppt",
					"rdt",
					"sga",
					"tem",
					"wps"
				].includes(qian)
			) {
				fanhao = `118${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["sgm"].includes(qian)) {
				fanhao = `143${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["hodv"].includes(qian)) {
				fanhao = `5642${qian}${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["nash"].includes(qian)) {
				fanhao = `h_067${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["mxgs"].includes(qian)) {
				fanhao = `h_068${qian}0${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["fera", "hone", "toen", "ypaa"].includes(qian)) {
				fanhao = `h_086${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["ktra"].includes(qian)) {
				fanhao = `h_094${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (
				[
					/*'nsps'*/
				].includes(qian)
			) {
				fanhao = `h_102${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["jukf", "jutn"].includes(qian)) {
				fanhao = `h_227${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["ambi", "emot", "hdka", "nacr"].includes(qian)) {
				fanhao = `h_237${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["tama"].includes(qian)) {
				fanhao = `h_254${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["tmdi"].includes(qian)) {
				fanhao = `h_452${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["fone"].includes(qian)) {
				fanhao = `h_491${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["san"].includes(qian)) {
				fanhao = `h_796${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["gigl"].includes(qian)) {
				fanhao = `h_860${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["vrtm", "vrvr"].includes(qian)) {
				fanhao = `h_910${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["hzgd"].includes(qian)) {
				fanhao = `h_1100${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["bstc"].includes(qian)) {
				fanhao = `h_1117${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["vovs"].includes(qian)) {
				fanhao = `h_1127${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if ([/*'good',*/ "mone"].includes(qian)) {
				fanhao = `h_1133${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (qian == "crvr" && hou < 240) {
				fanhao = `h_1155${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (qian == "savr" && hou < 106) {
				fanhao = `h_1241${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (
				[
					/*'kiwvr'*/
				].includes(qian)
			) {
				fanhao = `h_1248${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["tpvr"].includes(qian)) {
				fanhao = `h_1256${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["cbikmv"].includes(qian)) {
				fanhao = `h_1285${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["skmj"].includes(qian)) {
				fanhao = `h_1324${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["kamef"].includes(qian)) {
				fanhao = `h_1350${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["zmen", "hzmen"].includes(qian)) {
				fanhao = `h_1371${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["enki"].includes(qian)) {
				fanhao = `h_1406${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["fanh", "instv"].includes(qian)) {
				fanhao = `h_1472${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["devr"].includes(qian)) {
				fanhao = `h_1711${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["ggdr"].includes(qian)) {
				fanhao = `h_1758${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else if (["simm"].includes(qian)) {
				fanhao = `345${qian}-${hou}`;
				url = `https://image.mgstage.com/images/shiroutomanman/345${qian}/${hou}/cap_e_${i}_${fanhao}.jpg`;
			} else if (["anan"].includes(qian)) {
				fanhao = `714${qian}00${hou}`;
				url = `https://image.mgstage.com/images/shiroutoanan/${fanhao}/cap_e_${i}_${fanhao}.jpg`;
			} else if (["onex"].includes(qian)) {
				url = `https://image.mgstage.com/images/onemore/013${qian}/${hou}/cap_e_${
					i - 1
				}_393${qian}-${hou}.jpg`;
			} else if (["otim"].includes(qian)) {
				url = `https://image.mgstage.com/images/onetime/393${qian}/${hou}/cap_e_${
					i - 1
				}_393${qian}-${hou}.jpg`;
			} else if (["abw"].includes(qian)) {
				url = `https://www.prestige-av.com/images/corner/goods/prestige/${qian}/${hou}/cap_e_${
					i - 1
				}_${qian}-${hou}.jpg`;
			} else if (["nkmtndvaj"].includes(qian)) {
				fanhao = `yr${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			} else {
				fanhao = `${qian}00${hou}`;
				url = `https://pics.dmm.co.jp/digital/video/${fanhao}/${fanhao}jp-${i}.jpg`;
			}
			el.href = url;
		});
	};
	// javbus：获取演员磁力信息
	async function getMagnet4JavBus(href, tagName) {
		GM_addStyle(`#modal-div {display: grid;  grid-template-columns: repeat(2, 1fr);grid-auto-rows: minmax(100px, auto);gap:5px;
        grid-template-areas:"b b""c d";}/*.pop-up-tag .panel-block{grid-area: a;}*/
        #modal-div div:first-child{grid-area: b;display: grid;  grid-template-columns: repeat(10, 1fr);/*grid-auto-rows: minmax(100px, auto);*/}
        #modal-div div:nth-child(2){grid-area: c;}  #modal-div table{grid-area: d;}
        #tabs-container{max-height: 442px;overflow-x: hidden}.panel > .panel-block,.review-items *{display: inline-block;}
        .info {width:100%;background:white;border-radius:8px;padding:15px}input[name="gr_sel"], #gr_btn {display: none;}
        .info p {margin: 15px 0 ;}`);
		let { gid, dom } = await avInfofetch(href, tagName);
		let uc_code = location.pathname.search(/(uncensored|mod=uc)/) < 1 ? 0 : 1; //有码和欧美 0  无码 1
		let url =
			`${location.protocol}//${location.hostname}/ajax/uncledatoolsbyajax.php?gid=${gid}&lang=zh&img=&uc=${uc_code}&floor=` +
			Math.floor(Math.random() * 1e3 + 1);
		let doc = await fetch(url).then((response) => response.text());
		let table_html = doc.substring(0, doc.indexOf("<script")).trim();
		let table_tag = document.createElement("table");
		table_tag.classList.add("table", "pop-up-tag");
		table_tag.setAttribute("name", tagName);
		table_tag.style.backgroundColor = "#FFFFFF";
		// Parse HTML string into DOM elements
		let tableBody = document.createElement("tbody");
		tableBody.innerHTML = table_html;
		table_tag.appendChild(tableBody);
		// Loop through table rows
		const tableRows = tableBody.querySelectorAll("tr");
		for (let i = 0; i < tableRows.length; i++) {
			const row = tableRows[i];
			const anchor = row.querySelector("a");
			if (anchor) {
				const magnetUrl = anchor.href;
				row.prepend(creatCopybutton(magnetUrl)); // Assuming creatCopybutton function exists
			}
		}
		dom.push(table_tag);
		return dom;
	}
	//javbus：磁力链接添加复制按钮
	function creatCopybutton(text) {
		const copyButton = document.createElement("td");
		copyButton.classList.add("center-block");

		const button = document.createElement("button");
		button.textContent = lang.copyButton;
		copyButton.appendChild(button);

		button.addEventListener("click", () => {
			GM_setClipboard(text);
			showAlert(lang.copySuccess);
		});

		return copyButton;
	}
	//javbus：获取详情页面的 演员表和样品图元素
	async function avInfofetch(href, tagName) {
		let doc = await fetch(href, {
			method: "GET",
			mode: "no-cors"
		}).then((response) => response.text());
		let str = /var\s+gid\s+=\s+(\d{1,})/.exec(doc);
		let avInfo = { gid: str[1], dom: [] };

		if (Status.get("avInfo")) {
			const parser = new DOMParser();
			const htmlDoc = parser.parseFromString(doc, "text/html");

			let avatarWaterfall = htmlDoc.getElementById("avatar-waterfall");
			let sampleWaterfall = htmlDoc.getElementById("sample-waterfall");
			let info = htmlDoc.getElementsByClassName("info");
			console.log(info); //container
			if (avatarWaterfall) {
				avatarWaterfall.id = "";
				avatarWaterfall.classList.add("pop-up-tag");
				avatarWaterfall.setAttribute("name", tagName);

				const avatarBoxes = avatarWaterfall.querySelectorAll("a.avatar-box span");
				avatarBoxes.forEach((el, i) => {
					const copySvg = document.createElement("div");
					copySvg.style.cssText = `width:24px;height:24px;display: flex;align-items: center;justify-content: center;`;
					copySvg.innerHTML = copy_Svg; // Assuming copy_Svg is defined elsewhere

					copySvg.addEventListener("click", () => {
						GM_setClipboard(el.textContent);
						showAlert(lang.copySuccess);
						return false;
					});

					el.prepend(copySvg);
				});

				avatarWaterfall.querySelectorAll("a.avatar-box").forEach((box) => {
					box.target = "_blank";
					box.classList.remove("avatar-box");
					box.classList.add("avatar-box-zdy");
				});

				//avInfo.dom.push(avatarWaterfall);
			}

			if (sampleWaterfall) {
				sampleWaterfall.id = "";
				sampleWaterfall.classList.add("pop-up-tag");
				sampleWaterfall.setAttribute("name", tagName);

				sampleWaterfall
					.querySelectorAll(".sample-box")
					.forEach((box) => box.classList.add("sample-box-zdy", "avatar-box-zdy")); // Assuming same styling

				avInfo.dom.push(sampleWaterfall);
			}
			avInfo.dom.push(info);
		}
		return avInfo;
	}
	//弹出视频截图
	const showBigImg = (itemID, avid, elem) => {
		if (elem.classList.contains("span-loading")) return; // Early return if loading

		const tagName = `${itemID}${SCREENSHOT_SUFFIX}`;
		const selector = document.querySelector(`.pop-up-tag[name="${tagName}"]`);

		if (selector) {
			selector.style.display = "block";
			myModal.show();
		} else {
			elem.classList.add("span-loading");

			getAvImg(avid, tagName)
				.then((img) => {
					// Use arrow function for cleaner syntax
					myModal.append(img);
					myModal.show();
				})
				.catch((err) => err && showAlert(err)) // Handle errors
				.finally(() => elem.classList.remove("span-loading")); // Always remove loading class
		}
	};
	const getRequest = (url, params) => {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest(
				Object.assign(
					{
						method: "GET",
						url: url,
						timeout: 20000,
						onload: (r) => resolve(r),
						onerror: (r) => reject(`error`),
						ontimeout: (r) => reject(`timeout`)
					},
					params
				)
			);
		});
	};
	//下载封面之后没有提示
	const downloadImg = (url, name, elem) => {
		if ($(elem).hasClass("span-loading")) return;
		$(elem).addClass("span-loading");
		new Promise((resolve, reject) => {
			GM_download({
				url: url,
				name: name,
				headers: { Referer: url },
				onload: (r) => resolve(r),
				onerror: (error, detail) => reject(`error 错误`),
				ontimeout: (r) => reject(`timeout 超时`)
			});
		})
			.catch((err) => showAlert(err))
			.then(() => $(elem).removeClass("span-loading"));
	};
	/**根据番号获取blogjav的视频截图，使用fetch会产生跨域问题*/
	async function getAvImg(avid, tagName) {
		const r = await getRequest(`https://blogjav.net/?s=${avid}`);
		if (r.status == 503) {
			showAlert(
				`blogjav.net有防攻击机制, <a target="_blank"  href="https://blogjav.net">点击跳转</a>解除 `,
				`close`
			);
			return Promise.reject();
		} else if (r.status != 200) {
			return Promise.reject(lang.getAvImg_norespond);
		}
		let resultList = $($.parseHTML(r.responseText))
			.find(blogjavSelector)
			.toArray()
			.map((v) => {
				return { title: v.innerHTML, href: v.href };
			});
		if (resultList.length == 0) {
			return Promise.reject(lang.getAvImg_none);
		}
		let $img = new ScreenshotPanel(tagName, resultList, avid);
		let findIndex = resultList.findIndex((v) => v.title.search(/FHD/i) > 0); //默认显示FHD
		let index_show = findIndex > -1 ? findIndex : 0;
		$img.find(`li.imgResult-li[index=${index_show}]`).trigger("click");
		return $img;
	}
	class ScreenshotPanel {
		constructor(tagName, resultList, avid) {
			let me = this;
			let $img = $(`<div name="${tagName}" class="pop-up-tag" style="min-height:${$(
				window
			).height()}px;">
                        <ul style="${
																									resultList.length == 1 ? "display:none" : ""
																								}">${resultList
				.map(
					(v, i) =>
						`<li class="imgResult-li" index=${i} data="${v.href}">${v.title}</li>`
				)
				.join("")}</ul>
                        <span class="download-icon" >${download_Svg}</span>${resultList
				.map(
					(v, i) =>
						`<img index=${i}  name="screenshot" style="display:none;width:100%" />`
				)
				.join("")}</div>`);
			$img.find("li.imgResult-li").click(function () {
				if ($(this).hasClass("imgResult-loading")) {
					return;
				}
				let index_to = $(this).attr("index");
				let index_from = $img.find("img:visible").attr(`index`);
				if (index_to != index_from) {
					$img
						.find("li.imgResult-li.imgResult-Current")
						.removeClass("imgResult-Current");
					$(this).addClass(`imgResult-loading`).addClass("imgResult-Current");
					$img.find("img").hide();
					let $img_to = $img.find(`img[index=${index_to}]`);
					$img_to.show();
					Promise.resolve()
						.then(() => {
							if ($img_to.attr(`src`)) {
								return true;
							} else {
								return me.getScreenshotUrl($(this).attr("data")).then((r) => {
									$img_to.attr(`src`, r);
								});
							}
						})
						.catch((err) => {
							showAlert(err);
						})
						.then((r) => {
							$(this).removeClass(`imgResult-loading`);
						});
				}
			});
			$img.find("span.download-icon").click(function () {
				let url = $img.find("img:visible").attr(`src`);
				let name = `${avid || "screenshot"}.jpg`;
				downloadImg(url, name, this);
			});
			return $img;
		}
		async getScreenshotUrl(imgUrl) {
			const result = await getRequest(imgUrl);
			let img_src = /<noscript>.*src="(.*pixhost.to\/thumbs[\S]+)".*<\/noscript>/.exec(
				result.responseText
			);
			let src = img_src[1]
				.replace("thumbs", "images")
				.replace("//t", "//img")
				.replace('"', "");
			//console.log(src);
			return src;
		}
	}

	let lazyLoad;
	let scroller;
	let myModal; //弹窗插件实例
	let currentWeb = "javbus"; //网站域名标识，用于判断当前在什么网站
	let currentObj; //当前网站对应的属性对象
	/**
	 * 通用属性对象
	 * domainReg：         域名正则式 用于判断当前在什么网站
	 * excludePages：      排除的页面
	 * halfImg_block_Pages 屏蔽竖图的页面
	 * gridSelector        源网页的网格选择器
	 * itemSelector        源网页的子元素选择器
	 * widthSelector       源网页的宽度设置元素选择器
	 * pageNext            源网页的下一页元素选择器
	 * pageSelector        源网页的翻页元素选择器
	 * getAvItem           解析源网页item的数据
	 * init_Style          加载各网页的特殊css
	 */
	let ConstCode = {
		javbus: {
			domainReg: /(javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav)\./i,
			excludePages: [
				"/actresses",
				"mdl=favor&sort=1",
				"mdl=favor&sort=2",
				"mdl=favor&sort=3",
				"mdl=favor&sort=4",
				"searchstar"
			],
			halfImg_block_Pages: ["/uncensored", "javbus.one", "mod=uc", "javbus.red"],
			gridSelector: "div#waterfall",
			itemSelector: "div#waterfall div.item",
			widthSelector: "#grid-b",
			pageNext: "a#next",
			pageSelector: ".pagination",
			getAvItem: function (elem) {
				var photoDiv = elem.find("div.photo-frame")[0];
				var href = elem.find("a")[0].href;
				var img = $(photoDiv).children("img")[0];
				var src = img.src;
				if (src.match(/pics.dmm.co.jp/)) {
					src = src.replace(/ps.jpg/, "pl.jpg");
				} else {
					src = src
						.replace(/thumbs/, "cover")
						.replace(/thumb/, "cover")
						.replace(/.jpg/, "_b.jpg");
				}
				var title = img.title;
				var AVID = elem.find("date").eq(0).text();
				var date = elem.find("date").eq(1).text();
				var itemTag = "";
				elem
					.find("div.photo-info .btn")
					.toArray()
					.forEach((x) => (itemTag += x.outerHTML));
				return { AVID, href, src, title, date, itemTag };
			}
		},
		javdb: {
			domainReg: /(javdb)[0-9]*\./i,
			excludePages: ["/users/"],
			halfImg_block_Pages: [
				"/uncensored",
				"/western",
				"/video_uncensored",
				"/video_western"
			],
			gridSelector: "div.movie-list.h",
			itemSelector: "div.movie-list.h>div.item",
			widthSelector: "#grid-b",
			pageNext: "a.pagination-next",
			pageSelector: ".pagination-list",
			init_Style: function () {
				GM_addStyle(`#grid-b .info-bottom-two{flex-grow:1}
                [data-theme=light] .pop-up-tag[name$='${AVINFO_SUFFIX}'] {background-color: rgb(255 255 255 / 90%);}
                [data-theme=dark] .scroll-request span{background:white;}
                [data-theme=dark] #grid-b .box-b a:link {color : inherit;}
                [data-theme=dark] #grid-b  .box-b{background-color:#222;}
                [data-theme=dark] .alert-zdy {color: black;background-color: rgb(255 255 255 / 90%);}
                #myModal #modal-div article.message {margin-bottom: 0}`);
			},
			maxWidth: 150, //javdb允许的最大宽度为150%，其他网站默认最大宽度为100%
			getAvItem: function (elem) {
				var href = elem.find("a")[0].href;
				var src = elem.find("div.cover>img").eq(0).attr("src");
				var title = elem.find("a")[0].title;
				var AVID = elem.find("div.video-title>strong").eq(0).text();
				var date = elem.find("div.meta").eq(0).text();
				var score = elem.find("div.score").html();
				var itemTag = elem.find(".tags.has-addons").html();
				return { AVID, href, src, title, date, itemTag, score };
			}
			//init: function(){ if(location.href.includes("/users/")){ this.widthSelector="div.section";} }
		},
		avmoo: {
			domainReg: /avmoo\./i,
			excludePages: ["/actresses"],
			gridSelector: "div#waterfall",
			itemSelector: "div#waterfall div.item",
			widthSelector: "#grid-b",
			pageNext: 'a[name="nextpage"]',
			pageSelector: ".pagination",
			getAvItem: function (elem) {
				var photoDiv = elem.find("div.photo-frame")[0];
				var href = elem.find("a")[0].href;
				var img = $(photoDiv).children("img")[0];
				var src = img.src.replace(/ps.jpg/, "pl.jpg");
				var title = img.title;
				var AVID = elem.find("date").eq(0).text();
				var date = elem.find("date").eq(1).text();
				var itemTag = "";
				elem
					.find("div.photo-info .btn")
					.toArray()
					.forEach((x) => (itemTag += x.outerHTML));
				return { AVID, href, src, title, date, itemTag };
			}
		},
		javlibrary: {
			domainReg: /javlibrary\./i,
			gridSelector: "div.videothumblist",
			itemSelector: "div.videos div.video",
			widthSelector: "#grid-b",
			pageNext: "a.page.next",
			pageSelector: ".page_selector",
			getAvItem: function (elem) {
				var href = elem.find("a")[0].href;
				var src = elem.find("img")[0].src;
				if (src.indexOf("pixhost") < 0) {
					//排除含有pixhost的src，暂时未发现规律
					src = src.replace(/ps.jpg/, "pl.jpg");
				}
				var title = elem.find("div.title").eq(0).text();
				var AVID = elem.find("div.id").eq(0).text();
				return { AVID, href, src, title, date: "", itemTag: "" };
			},
			init_Style: function () {
				GM_addStyle(`${
					Status.get("menutoTop")
						? `
                #leftmenu {width : 100%;float: none;}
                #leftmenu>table { display : none;}
                #leftmenu .menul1,#leftmenu .menul1>ul{display: flex;align-items: center;justify-content: center;flex-wrap: wrap;}
                #leftmenu .menul1{padding: 5px;}
                #rightcolumn{margin: 0 5px;padding : 10px 5px;}`
						: ``
				}
                #grid-b div{box-sizing: border-box;}`);
			}
		}
	};

	/** 用于屏蔽老司机脚本的代码*/
	//    function oldDriverBlock() {
	//        if (["javbus", "avmoo"].includes(currentWeb)) {
	//            //屏蔽老司机脚本,改写id
	//            if ($(".masonry").length > 0) {
	//                $(".masonry").removeClass("masonry");
	//            }
	//            let $waterfall = $("#waterfall");
	//            if ($waterfall.length) {
	//                $waterfall.get(0).id = "waterfall-destroy";
	//            }
	//            if ($waterfall.find("#waterfall").length) {
	//                //javbus首页有2个'waterfall' ID
	//                $waterfall.find("#waterfall").get(0).id = "";
	//            }
	//            //解决 JAV老司机 $pages[0].parentElement.parentElement.id = "waterfall_h";
	//            //女优作品界面此代码会把id设置到class=row层
	//            if ($("#waterfall_h.row").length > 0) {
	//                $("#waterfall_h.row").removeAttr("id");
	//            }
	//            let $waterfall_h = $("#waterfall_h");
	//            if ($waterfall_h.length) {
	//                $waterfall_h.get(0).id = "waterfall-destroy";
	//            }
	//            if (location.pathname.search(/search/) > 0) {
	//                //解决"改写id后，搜索页面自动跳转到无码页面"的bug
	//                $("body").append('<div id="waterfall"></div>');
	//            }
	//            currentObj.gridSelector = "#waterfall-destroy";
	//        }
	//        if (["javlibrary"].includes(currentWeb)) {
	//            //屏蔽老司机脚本,改写id
	//            let $waterfall = $("div.videothumblist");
	//            if ($waterfall.length) {
	//                $waterfall.removeClass("videothumblist");
	//                $waterfall.find(".videos").removeClass("videos");
	//                $waterfall.get(0).id = "waterfall-destroy";
	//            }
	//            currentObj.gridSelector = "#waterfall-destroy";
	//        }
	//    }
	class Page {
		constructor() {
			for (let key in ConstCode) {
				let domainReg = ConstCode[key].domainReg;
				if (domainReg && domainReg.test(location.href)) {
					currentWeb = key; //首先判断当前是什么网站
					break;
				}
			}
			currentObj = ConstCode[currentWeb];
			//排除页面的判断
			if (currentObj.excludePages) {
				for (let page of currentObj.excludePages) {
					if (location.pathname.includes(page)) return;
				}
			}
			//调用初始化方法 未使用  if (currentObj.init) { currentObj.init();}
			//屏蔽竖图模式的页面判断
			if (currentObj.halfImg_block_Pages) {
				for (let blockPage of currentObj.halfImg_block_Pages) {
					if (location.href.includes(blockPage)) {
						Status.halfImg_block = true;
						break;
					}
				}
			}
			this.render();
		}
		render() {
			let $items = $(currentObj.itemSelector);
			if ($items.length < 1) return;
			//            oldDriverBlock();
			addStyle();
			currentObj.init_Style?.();
			let menu = new SettingMenu();
			//加载图片懒加载插件
			lazyLoad = new LazyLoad({
				callback_loaded: function (img) {
					$(img).removeClass("minHeight-200");
					imgCallback(img);
				}
			});
			let gridPanel = new GridPanel($items, lazyLoad);
			myModal = new Popover(); //弹出插件
			//加载滚动翻页插件
			if (Status.get("autoPage") && $(currentObj.pageSelector).length) {
				scroller = new ScrollerPlugin(gridPanel.$dom, lazyLoad);
			}
		}
	}
	class GridPanel {
		constructor($items, lazyLoad) {
			this.$dom = $(`<div id= 'grid-b'></div>`);
			$(currentObj.gridSelector).hide().eq(0).before(this.$dom);
			let $elems = this.constructor.parseItems($items);
			this.$dom.append($elems);
			lazyLoad.update();
		}
		static parseItems(elems) {
			let elemsHtml = "";
			let {
				imgStyle,
				getAvItem,
				toolBar,
				copyBtn,
				fullTitle,
				magnet,
				magnetTip,
				downloadTip,
				pictureTip
			} = {
				imgStyle: Status.isHalfImg() ? halfImgCSS : fullImgCSS,
				getAvItem: currentObj.getAvItem,
				toolBar: Status.get("toolBar") ? "" : "hidden-b",
				copyBtn: Status.get("copyBtn") ? "" : "hidden-b",
				fullTitle: Status.get("fullTitle") ? "" : "titleNowrap",
				magnet: ["javbus", "javdb"].includes(currentWeb) ? "" : "hidden-b",
				magnetTip: lang.tool_magnetTip,
				downloadTip: lang.tool_downloadTip,
				pictureTip: lang.tool_pictureTip
			};
			let [hiddenWords, hiddenAvids, hiddenCategorys] = [
				Status.get("hiddenWord"),
				Status.get("hiddenAvid"),
				Status.get("hiddenCategory")
			];
			for (let i = 0; i < elems.length; i++) {
				let tag = elems.eq(i);
				let html = "";
				//判断是否为 女优个人资料item
				if (currentWeb != "javdb" && tag.find(".avatar-box").length) {
					tag.find(".avatar-box").addClass("avatar-box-b").removeClass("avatar-box");
					html = `<div class='item-b'>${tag.html()}</div>`;
				} else {
					let AvItem = getAvItem(tag);
					if (
						!(
							(
								hiddenWords.find((v, i) => AvItem.title.includes(v)) ||
								hiddenAvids.find(
									(v, i) =>
										AvItem.AVID.toUpperCase().startsWith(v.toUpperCase() + "-") ||
										AvItem.AVID.toUpperCase() == v.toUpperCase()
								) ||
								hiddenCategorys.find((v, i) => AvItem.title.includes(v))
							) //todo
						)
					) {
						html = `<div class="item-b">
                                <div class="box-b">
                                <div class="cover-b">
                                    <a  href="${
																																					AvItem.href
																																				}" target="_blank"><img style="${imgStyle}" class="lazy minHeight-200"  data-src="${
							AvItem.src
						}" ></a>
                                </div>
                                <div class="detail-b">
                                    <a name="av-title" href="${
																																					AvItem.href
																																				}" target="_blank" title="${
							AvItem.title
						}" class="${fullTitle}"><span class="tool-span copy-span ${copyBtn}" name="copy">${copy_Svg}</span> <span>${
							AvItem.AVID
						} ${AvItem.title}</span></a>
                                    <div class="info-bottom">
                                      <div class="info-bottom-one">
                                          <a  href="${
																																											AvItem.href
																																										}" target="_blank"><span class="tool-span copy-span ${copyBtn}" name="copy">${copy_Svg}</span><date name="avid">${
							AvItem.AVID
						}</date>${AvItem.date ? ` / ${AvItem.date}` : ""}</a>
                                      </div>
                                      ${
																																							AvItem.score
																																								? `<a  href="${AvItem.href}" target="_blank"><div class="score">${AvItem.score}</div></a>`
																																								: ``
																																						}
                                      <div class="info-bottom-two">
                                        <div class="item-tag">${
																																									AvItem.itemTag
																																								}</div>
                                        <div class="toolbar-b ${toolBar}" item-id="${
							AvItem.AVID
						}${Math.random().toString(16).slice(2)}"  >
                                        <span name="magnet" class="tool-span  ${magnet}" title="${magnetTip}" AVID="${
							AvItem.AVID
						}" data-href="${AvItem.href}">${magnet_Svg}</span>
                                        <span name="download" class="tool-span" title="${downloadTip}" src="${
							AvItem.src
						}" src-title="${AvItem.AVID} ${AvItem.title}">${download_Svg}</span>
                                        <span name="picture" class="tool-span" title="${pictureTip}" AVID="${
							AvItem.AVID
						}" >${picture_Svg}</span>
                                       </div>
                                     </div>
                                   </div>
                                </div>
                                </div>
                            </div>`;
					}
				}
				elemsHtml = elemsHtml + html;
			}
			let $elems = $(elemsHtml);
			$elems.find("span[name]").click(function () {
				let name = $(this).attr("name");
				switch (name) {
					case "copy":
						GM_setClipboard($(this).next().text());
						showAlert(lang.copySuccess);
						return false;
					case "download":
						let [url, name] = [
							$(this).attr("src"),
							$(this).attr("src-title") + ".jpg"
						];
						downloadImg(url, name, this);
						break;
					case "magnet":
						showMagnetTable(
							$(this).parent("div").attr("item-id"),
							$(this).attr("AVID").replace(/\./g, "-"),
							$(this).attr("data-href"),
							this
						);
						break;
					case "picture":
						showBigImg(
							$(this).parent("div").attr("item-id"),
							$(this).attr("AVID"),
							this
						);
						break;
					default:
						break;
				}
			});
			return $elems;
		}
	}
	class ScrollerPlugin {
		constructor(waterfall, lazyLoad) {
			let me = this;
			me.waterfall = waterfall;
			me.lazyLoad = lazyLoad;
			let $pageNext = $(currentObj.pageNext);
			me.nextURL = $pageNext.attr("href");
			me.scroller_status = $(
				`<div class = "scroller-status"  style="text-align:center;display:none"><div class="scroll-request"><span></span><span></span><span></span><span></span></div><h2 class="scroll-last">${lang.scrollerPlugin_end}</h2></div>`
			);
			me.waterfall.after(me.scroller_status);
			me.locked = false;
			me.canLoad = true;
			me.$page = $(currentObj.pageSelector);
			me.domWatch_func = me.domWatch.bind(me);
			document.addEventListener("scroll", me.domWatch_func);
			if (history.scrollRestoration) {
				history.scrollRestoration = "manual"; //防止自动恢复页面位置
			}
		}
		domWatch() {
			let me = this;
			if (
				me.$page.get(0).getBoundingClientRect().top - $(window).height() < 300 &&
				!me.locked &&
				me.canLoad
			) {
				me.locked = true;
				me.loadNextPage(me.nextURL).then(() => {
					me.locked = false;
				});
			}
		}
		async loadNextPage(url) {
			this.showStatus("request");
			//console.log(url);
			let responseText = await fetch(url, {
				credentials: "same-origin"
			}).then((respond) => respond.text());
			let $body = $(new DOMParser().parseFromString(responseText, "text/html"));
			let elems = GridPanel.parseItems($body.find(currentObj.itemSelector));
			if (currentWeb != "javdb" && location.pathname.includes("/star/") && elems) {
				elems = elems.slice(1);
			}
			this.scroller_status.hide();
			this.waterfall.append(elems);
			this.lazyLoad.update();
			//history.pushState({}, "", url);
			this.nextURL = $body.find(currentObj.pageNext).attr("href");
			if (!this.nextURL) {
				this.canLoad = false;
				this.showStatus("last");
			}
		}
		showStatus(status) {
			this.scroller_status.children().each((i, e) => {
				$(e).hide();
			});
			this.scroller_status.find(`.scroll-${status}`).show();
			this.scroller_status.show();
		}
		destroy() {
			this.scroller_status.remove();
			document.removeEventListener("scroll", this.domWatch_func);
		}
	}

	const addStyle = () => {
		let columnNum = Status.getColumnNum();
		let waterfallWidth = Status.get("waterfallWidth");
		let css_waterfall = `${
			currentObj.widthSelector
		}{width:${waterfallWidth}%;margin:0 ${
			waterfallWidth > 100 ? (100 - waterfallWidth) / 2 + "%" : "auto"
		};transition:.5s;}
        #grid-b{display:flex;flex-direction:row;flex-wrap:wrap;}
        #grid-b .item-b{padding:5px;width:${
									100 / columnNum
								}%;transition:.5s ;animation: fadeInUp .5s ease-out;}
        #grid-b .box-b{border-radius:5px;background-color:white;border:1px solid rgba(0,0,0,0.2);box-shadow:0 2px 3px 0 rgba(0,0,0,0.1);overflow:hidden}
        #grid-b .box-b a:link{color:black}
        #grid-b .box-b a:visited{color:gray}
        #grid-b .box-b .cover-b{text-align:center}
        #grid-b .box-b .detail-b{padding:7px}
        #grid-b .box-b .detail-b a{display:block}
        #grid-b .info-bottom,.info-bottom-two{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
        #grid-b .avatar-box-b{display:flex;flex-direction:column;background-color:white;border-radius:5px;align-items:center;border:1px solid rgba(0,0,0,0.2)}
        #grid-b .avatar-box-b p{margin:0 !important}
        #grid-b date:first-of-type{font-size:18px !important}
        #grid-b .toolbar-b{float:right;padding:2px;white-space:nowrap}
        #grid-b .toolbar-b span{margin-right:2px}
        #grid-b .copy-span{vertical-align:middle;display:inline-block}
        #grid-b span.tool-span{cursor:pointer;opacity:.3}
        #grid-b span.tool-span:hover{opacity:1}
        #grid-b .item-tag{display:inline-block;white-space:nowrap}
        #grid-b .hidden-b{display:none}
        #grid-b .minHeight-200{min-height:200px}
        #grid-b .cover-b img:not([src]) {visibility: hidden;}
        svg.tool-svg{fill:currentColor;width:22px;height:22px;vertical-align:middle}
        span.span-loading{display:inline-block;animation:span-loading 2s infinite}

        #myModal{overflow-x:hidden;overflow-y:auto;display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:1050;background-color:rgba(0,0,0,0.5)}
        #myModal #modal-div{position:relative;width:70%;margin:100px auto;background-color:rgb(6 6 6 / 50%);border-radius:8px;animation:fadeInDown .5s}
        #modal-div .pop-up-tag{border-radius:8px;overflow:hidden}

        #modal-div .avatar-box-zdy span{font-weight:bold;text-align:center;word-wrap:break-word;display:flex;justify-content:center;align-items:center;padding:5px;line-height:22px;color:#333;background-color:#fafafa;border-top:1px solid #f2f2f2}

        #menu-div{white-space:nowrap;background-color:white;color:black;display:none;min-width:200px;border-radius:5px;padding:10px;box-shadow:0 10px 20px 0 rgb(0 0 0 / 50%)}
        #menu-div>div:hover{background-color:gainsboro}
        #menu-div .switch-div{display:flex;align-items:center;font-size:large;}
        #menu-div .switch-div *{margin:0;padding:4px}
        #menu-div .switch-div label{flex-grow:1}
        #menu-div .range-div{display:flex;flex-direction:row;flex-wrap:nowrap}
        #menu-div .range-div input{cursor:pointer;width:80%;max-width:200px}
        .alert-zdy{position:fixed;top:50%;left:50%;padding:12px 20px;font-size:20px;color:white;background-color:rgb(0,0,0,.75);border-radius:4px;animation:itemShow .3s;z-index:1051}
        .titleNowrap{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
        .download-icon{position:absolute;right:0;z-index:2;cursor:pointer}
        .download-icon>svg{width:30px;height:30px;fill:aliceblue}
        @keyframes fadeInUp{0%{transform:translate3d(0,10%,0);opacity:.5}100%{transform:none;opacity:1}}
        @keyframes fadeInDown{0%{transform:translate3d(0,-100%,0);opacity:0}100%{transform:none;opacity:1}}
        @keyframes itemShow{0%{transform:scale(0)}100%{transform:scale(1)}}
        @keyframes span-loading{0%{transform:scale(1);opacity:1}50%{transform:scale(1.2);opacity:1}100%{transform:scale(1);opacity:1}}
        .scroll-request{text-align:center;height:15px;margin:15px auto}
        .scroll-request span{display:inline-block;width:15px;height:100%;margin-right:8px;border-radius:50%;background:rgb(16,19,16);animation:scroll-load 1s ease infinite}
        @keyframes scroll-load{0%,100%{transform:scale(1)} 50%{transform:scale(0)}}
        .scroll-request span:nth-child(2){animation-delay:0.125s}
        .scroll-request span:nth-child(3){animation-delay:0.25s}
        .scroll-request span:nth-child(4){animation-delay:0.375s}
        .imgResult-li{color:rgb(255,255,255,50%);font-size:20px}
        .imgResult-li.imgResult-Current{color:white}
        .imgResult-loading{animation:changeTextColor 1s  ease-in  infinite}
        .imgResult-li:hover{cursor:pointer;color:white}
        @keyframes changeTextColor{0%{color:rgba(255,255,255,1)}50%{color:rgba(255,255,255,.5)}100%{color:rgba(255,255,255,1)}}
        .container:not(.is-max-desktop):not(.is-max-widescreen) {max-width: 100%;}`;
		GM_addStyle(css_waterfall);
	};

	class DownloadPanel {
		constructor() {
			this.addPanel();
		}
		async loadJS() {
			let me = this;
			const urlList = [
				[
					"https://unpkg.com/jszip@3.6.0/dist/jszip.min.js",
					"https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"
				],
				[
					"https://cdn.jsdelivr.net/npm/jszip@3.6.0/dist/jszip.min.js",
					"https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"
				],
				[
					"https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js",
					"https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"
				]
			];
			const getJSFile = (url) => {
				//console.log(url);
				return getRequest(url, { timeout: 10000, responseType: "text" });
			};
			let index = GM_getValue("downloadPanel_url", 0);
			for (let k = 0; k < urlList.length; k++) {
				const values = await Promise.all([
					getJSFile(urlList[index][0]),
					getJSFile(urlList[index][1])
				]).catch((reason) => {
					//console.log(reason);
					return false;
				});
				if (values) {
					values.forEach((v) => eval(v.responseText));
					me.element.find("button[name=download]").attr("disabled", false);
					GM_setValue("downloadPanel_url", index);
					break;
				} else {
					index++;
					if (index >= urlList.length) {
						index = urlList.length - index;
					}
					continue;
				}
			}
		}
		addPanel() {
			let me = this;
			GM_addStyle(
				`#downloadPanel{margin:5px;}#downloadPanel button[name="download"]{height:38px;border:1px solid #ce9c9c;padding:0 9px;
                border-radius:4px;font-size:20px;}#downloadPanel input{height:30px;padding:4px;border-radius:4px;border:1px solid #ce9c9c;font-size:20px;}
                #downloadPanel input:focus{outline:0px;}#downloadPanel button[disabled]{color:#0006;cursor:not-allowed !important}
                .downloadform{font-size:20px;display:flex;height:40px;align-items:center;}#file-Info div[name=filename]{width:70%;display:inline-block;text-align:right}
                #file-Info div[name=state]{width:30%;display:inline}`
			);
			me.element = $(`<div id="downloadPanel">
                          <div class="downloadform">
                            <button name="download"  disabled="true">下载</button>
                            <span style="margin-left:10px;">番号: </span><input  placeholder="ssni,abp" autocomplete="off" name="key"></input>
                            <span style="display:none">线程数</span><input style="display:none" name="poolLimit" value="3"></input>
                            <span class="progress-Info" style="margin-left:10px;">
                                <span name="sum"></span><span name="total"></span><span name="msg"></span>
                            </span>
                          </div>
                          <div id="file-Info"></div>
                       </div>`);
			//me.loadJS();
			me.element.find("button[name=download]").on("click", function () {
				let button = this;
				button.disabled = true;
				me.resetInfo();
				let arrayList = me.getResultList();
				if (arrayList.length) {
					me.element.find("span[name=total]").text(arrayList.length);
					let poolLimit = me.element.find("input[name=poolLimit]").val();
					me
						.downloadZip(poolLimit ? poolLimit : 5, arrayList)
						.then(() => (button.disabled = false));
				} else {
					me.element.find("span[name=msg]").text("无过滤结果");
					button.disabled = false;
				}
			});
		}
		getResultList() {
			let list = [];
			let key = this.element.find("input[name=key]").val().toUpperCase();
			let keyArray = key
				.replace("，", ",")
				.split(",")
				.filter((k) => k && k.trim());
			$("div.box-b").each(function () {
				let avid = $(this).find("date[name=avid]").text();
				if (
					keyArray.length &&
					!keyArray.find((k) => avid.toUpperCase().indexOf(k) > -1)
				) {
					return;
				}
				let url = $(this).find("img.lazy").attr("data-src");
				let title = $(this).find("a[name='av-title']").attr("title");
				let filename = `${avid} ${title.replace(/\//g, "_")}.jpg`; //标题中含有斜杠时，压缩包创建文件夹
				list.push({ avid: avid, url: url, filename: filename });
			});
			return list;
		}
		downloadZip(poolLimit, arrayList) {
			let me = this;
			let sum = 0;
			let zip = new JSZip();
			return me
				.asyncPool(poolLimit, arrayList, function (item, array) {
					let $state = me.addFileInfo(item.avid);
					return me
						.getImgResource(item.url)
						.then((r) => {
							if (r.status == "200") {
								zip.file(item.filename, r.response);
								$state.text(`✅`);
								me.element.find(`span[name="sum"]`).text(`${++sum}/`);
							} else {
								$state.text(`❎`);
							}
						})
						.catch((err) => $state.text(`❎`));
				})
				.then(() =>
					zip
						.generateAsync({ type: "blob" })
						.then((blob) => saveAs(blob, "download.zip"))
				);
		}
		getImgResource(url) {
			return getRequest(url, {
				responseType: "blob",
				headers: { Referer: url }
			});
		}
		//https://blog.csdn.net/ghostlpx/article/details/106431837
		async asyncPool(poolLimit, array, iteratorFn) {
			const ret = [];
			const executing = [];
			for (const item of array) {
				const p = Promise.resolve().then(() => iteratorFn(item, array));
				ret.push(p);
				const e = p.then(() => executing.splice(executing.indexOf(e), 1));
				executing.push(e);
				if (executing.length >= poolLimit) {
					await Promise.race(executing);
				}
			}
			return Promise.all(ret);
		}
		addFileInfo(avid) {
			let $fileInfo = $(
				`<div style="width:50%;display:inline-block;float:left;"><div name="filename">${avid}:</div><div name="state">⏰</div></div>`
			);
			this.element.find("#file-Info").append($fileInfo);
			return $fileInfo.find("div[name=state]");
		}
		resetInfo() {
			this.element.find("span.progress-Info span").text("");
			this.element.find("#file-Info").empty();
		}
	}

	class InputTagPanel {
		constructor(key, placeholder) {
			let me = this;
			me.key = key;
			me.data = Status.get(key) || [];
			me.$panel = $(`<div class="input-tag-panel" name="${key}"></div>`);
			me.$input = $(
				`<input type="text" autocomplete="off" value="" placeholder="${placeholder}">`
			);
			me.$panel.append(me.$input);
			me.data.forEach(function (value, index, array) {
				me.$panel.append(`<kbd><span>${value}</span><a href="#">❌</a><kbd>`);
			});
			me.$panel.on("click", "a", function () {
				me.delete($(this));
			});
			me.$input.keyup(function (event) {
				let key = me.$input.val().trim();
				if (key && (event.keyCode ? event.keyCode : event.which) === 13) {
					let keyArray = key
						.replace("，", ",")
						.split(",")
						.filter((k) => k && k.trim());
					me.add(keyArray);
				}
			});
			GM_addStyle(
				`.input-tag-panel{display:flex;flex-direction:row;flex-wrap:wrap;margin:5px;align-content:flex-start;align-items:stretch;}
                .input-tag-panel>kbd{display:flex;line-height:25px;background-color:burlywood;padding:5px;margin-right:5px;margin-top:5px;border-radius:4px;align-items:center;}
                .input-tag-panel>kbd>a{color:white !important;font-size:20px;text-decoration:none;padding:0 5px 0 5px;}
                .input-tag-panel>kbd>a:hover{cursor:pointer;color:red;}
                .input-tag-panel input{width:100%;height:30px;border:solid 1px burlywood;border-radius:5px;padding:5px;font-size:20px;}
                .input-tag-panel input:focus{outline:none;}`
			);
		}
		add(keyArray) {
			let me = this;
			let $tag = [];
			keyArray.forEach((key) => {
				$tag.push(`<kbd><span>${key}</span><a href="#">❌</a><kbd>`);
				me.data.push(key);
			});
			me.$panel.append($tag).fadeIn();
			Status.set(me.key, me.data);
		}
		delete($a) {
			let me = this;
			let key = $a.prev("span").text();
			$a.parent("kbd").fadeOut();
			let index = me.data.findIndex((v) => key == v);
			index > -1 && me.data.splice(index, 1);
			Status.set(me.key, me.data);
		}
	}

	class TabPanel {
		constructor() {
			let me = this;
			GM_addStyle(
				`#tabPanel{display:none;width:600px;height:400px;background-color:white;border-radius:5px;position:fixed;right:15px;bottom:5px;color:black;text-align:center;border:1px solid #ccc;box-shadow:5px 5px 4px 0 rgb(0 0 0 / 10%);z-index:1000}#tabPanel *{box-sizing:content-box;}#tabPanel ul{padding:0;margin:0;}.tab_list{height:40px;background-color:#facbcb;}.tab_list ul li{list-style:none;float:left;height:40px;padding:0 20px;font-size:20px;border-radius:5px 5px 0 0;text-align:center;line-height:40px;cursor:pointer;}.tab_list .tab_current{background-color:white;}.tab_content{height:355px;}.tab_content_item{overflow-y:auto;display:none;width:100%;height:100%;background-color:white;}.tab_content_item::-webkit-scrollbar{width:7px}.tab_content_item::-webkit-scrollbar-track{border-radius:8px;background-color:#f5f5f5}.tab_content_item::-webkit-scrollbar-thumb{border-radius:8px;background-color:#c8c8c8}.close-div{position:absolute;right:0px;width:40px;height:40px;font-size:40px;line-height:30px;cursor:pointer;color:gray;transform:rotate(45deg);}.close-div:hover{color:black;}`
			);
			me.element = $(`<div id="tabPanel">
                                <div class="tab_list">
                                    <ul><li>批量下载</li><li>屏蔽词</li></ul>
                                    <div class="close-div">+</div>
                                </div>
                                <div class="tab_content">
                                    <div class="tab_content_item"></div>
                                    <div class="tab_content_item"></div>
                                </div>
                            </div>`);
			me.$li = me.element.find(".tab_list ul>li");
			me.$item = me.element.find(".tab_content_item");
			me.$li.on("click", function () {
				me.show(me.$li.index(this));
			});
			me.element.find(".close-div").on("click", function () {
				me.element.toggle();
			});
			$("body").append(me.element);
		}
		show(index = 0) {
			let me = this;
			me.$li.each((i, el) => {
				$(el).removeClass("tab_current");
			});
			me.$li.eq(index).addClass("tab_current");
			me.$item.each((i, el) => {
				$(el).hide();
			});
			if (me.$item.eq(index).children().length == 0) {
				me.addItem(index);
			}
			me.$item.eq(index).show();
			me.element.show();
		}
		addItem(index) {
			let me = this;
			switch (index) {
				case 0:
					let downloadPanel = new DownloadPanel();
					me.$item.eq(index).append(downloadPanel.element);
					break;
				case 1:
					let tag1 = new InputTagPanel("hiddenWord", "标题：支持逗号隔开");
					let tag2 = new InputTagPanel(
						"hiddenAvid",
						`番号：支持逗号隔开,单个或系列如SSIS,OPX-123`
					);
					me.$item.eq(index).append(tag1.$panel).append(tag2.$panel);
					break;
			}
		}
		static getInstance() {
			if (!this.instance) {
				this.instance = new TabPanel();
			}
			return this.instance;
		}
	}
	new Page();
})();
