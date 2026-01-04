// ==UserScript==
// @name        哔哩哔哩专栏动态显示原图
// @namespace   hzhbest
// @include     http://www.bilibili.com/read/*
// @include     https://www.bilibili.com/read/*
// @include     http://t.bilibili.com/*
// @include     https://t.bilibili.com/*
// @include     http://space.bilibili.com/*/dynamic*
// @include     https://space.bilibili.com/*/dynamic*
// @include     http://www.bilibili.com/opus/*
// @include     https://www.bilibili.com/opus/*
// @description    同屏显示哔哩哔哩专栏和动态中的原图
// @version     1.2
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/533481/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E5%8A%A8%E6%80%81%E6%98%BE%E7%A4%BA%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/533481/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E5%8A%A8%E6%80%81%E6%98%BE%E7%A4%BA%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
	// --这里是设置区-- //
	var topheight = 60; // 哔哩哔哩顶栏高度
	var topspare = 125; // 滚动预留顶部高度
	var autorefresh = true; // 是否定时自动检测页面变化
	var loadLargeGif = GM_getValue('BLimgAll') || false; // 是否载入大型动图

	// --以下是代码区，请不要随意改动-- //

	// 匹配哔哩哔哩专栏和动态页面
	var regexRead = /bilibili\.com\/read\/[cv]\d+/; // 专栏页面
	var regexOpus = /bilibili\.com\/opus\/\d+/; // 新版专栏页面
	var regexDynamic = /t\.bilibili\.com\/\d+/; // 单条动态页面
	var regexSpace = /space\.bilibili\.com\/\d+\/dynamic/; // 用户动态页面
	var cur = -1; // "当前图片"序
	pinit();

	function pinit() {
		// 检查是否已开大图，否则进入初始化进程；如果已开大图但网址已非匹配网址则去除按钮；一秒检测一次
		var bpimg = document.querySelector("img.big_pic");
		var isMatch = regexRead.test(document.location.href) || 
		              regexOpus.test(document.location.href) ||
		              regexDynamic.test(document.location.href) ||
		              regexSpace.test(document.location.href);
		console.log("matched?: ", isMatch);
		
		if (isMatch) {
			if (!bpimg) init();
		} else {
			var buttonbox = document.querySelector(".big_pic_b");
			if (!!buttonbox) buttonbox.parentNode.removeChild(buttonbox);
		}
		
		if (autorefresh) {
			setTimeout(pinit, 1000);
		}
	}

	function init() {
		// 根据不同页面类型执行不同的初始化
		if (regexRead.test(document.location.href)) {
			initRead();
		} else if (regexOpus.test(document.location.href)) {
			initOpus();
		} else if (regexDynamic.test(document.location.href) || regexSpace.test(document.location.href)) {
			initDynamic();
		}
	}

	function initRead() {
		// 初始化专栏页面
		var articleContainer = document.querySelector(".article-container");
		if (!articleContainer) {
			console.log("专栏容器未找到，等待加载");
			setTimeout(init, 1000);
			return;
		}

		var imgElements = articleContainer.querySelectorAll("img.normal-img");
		if (imgElements.length === 0) {
			console.log("未找到专栏图片，退出");
			return;
		}

		console.log("开始处理专栏图片");
		goRead(imgElements);
	}

	function initOpus() {
		// 初始化新版专栏页面(opus)
		console.log("开始初始化新版专栏页面");
		
		// 等待内容加载完成
		if (!document.querySelector(".opus-module-content")) {
			console.log("新版专栏容器未找到，等待加载");
			setTimeout(init, 1000);
			return;
		}
		
		// 只查找所有img标签
		var allImages = document.querySelectorAll(".opus-module-content img");
		
		if (allImages.length === 0) {
			console.log("未找到专栏图片，退出");
			return;
		}
		
		console.log("找到新版专栏图片，开始处理");
		goOpus(null, null, allImages);
	}

	function initDynamic() {
		// 初始化动态页面
		console.log("开始初始化动态页面");
		
		// 适配新版动态页面结构
		var dynamicContainer = document.querySelector(".bili-dyn-list__item") || 
		                      document.querySelector(".bili-dyn-item") ||
		                      document.querySelector(".card");
		
		if (!dynamicContainer) {
			console.log("动态容器未找到，等待加载");
			setTimeout(init, 1000);
			return;
		}

		// 只查找img标签
		var allImages = document.querySelectorAll(".bili-album__preview__picture__img img");
		
		if (allImages.length === 0) {
			console.log("未找到动态图片，尝试查找其他选择器");
			
			// 尝试查找其他可能的图片容器
			allImages = document.querySelectorAll("img[src*='hdslb.com/bfs/new_dyn/']");
			
			if (allImages.length === 0) {
				console.log("未找到任何动态图片，退出");
				return;
			}
		}
		
		console.log("找到动态图片，开始处理");
		goDynamic(null, null, allImages);
	}

	function goRead(imgElements) {
		// 处理专栏图片
		setupCSS();
		setupButtons();

		// 建立大图框架，用于插入大图
		var bpboxes = [],
			imgsrc,
			imgn,
			imgl = imgElements.length;
		var _limited = false;
		var root = document.querySelector(".article-container");
		var nslink = document.querySelector(".big_pic_ns");
		var nslinks = [];

		for (var i = 0; i < imgl; i++) {
			// 提取专栏大图
			// https://i0.hdslb.com/bfs/article/watermark/xxxx@progressive.webp
			// 转换为
			// https://i0.hdslb.com/bfs/article/xxxx 或 https://i0.hdslb.com/bfs/article/xxxx.jpg
			bpboxes[i] = creaElemIn("div", root);
			nslinks[i] = creaElemIn("div", nslink);
			nslinks[i].innerHTML = (i + 1);
			nslinks[i].name = i;
			creaElemIn("br", root);
            
			var imgSrc = imgElements[i].src;
			// 处理专栏图片URL，获取原图
			imgsrc = convertToOriginalImage(imgSrc);
			
			imgn = creaElemIn("img", bpboxes[i]);
			imgn.src = imgsrc;
			imgn.className = "big_pic";
			imgn.title = "[ " + (i + 1) + " / " + imgl + " ]";
			nslinks[i].style.backgroundImage = 'url("' + imgSrc + '")';
			
			nslinks[i].addEventListener(
				"click",
				function (e) {
					scrollto(getTop(bpboxes[e.target.name]) - topspare + 25);
				},
				false
			);
		}

		// 设置滚动事件和其他交互
		setupScrollEvent(bpboxes, nslinks, imgl);
	}

	function goOpus(allPictures, allSourceSets, allImages) {
		// 处理新版专栏图片
		setupCSS();
		setupButtons();

		// 建立大图框架，用于插入大图
		var bpboxes = [],
			imgsrc,
			imgn,
			imgl = 0;
		var _limited = false;
		var root = document.querySelector(".opus-module-content");
		var nslink = document.querySelector(".big_pic_ns");
		var nslinks = [];

		// 收集所有图片URL (只从img标签获取)
		var imageUrls = [];
		var processedOriginals = []; // 存储已处理过的原图URL，用于去重
		
		if (allImages.length > 0) {
			console.log("从img.src中获取图片URL");
			for (var i = 0; i < allImages.length; i++) {
				var src = allImages[i].getAttribute("src");
				if (src && src.includes("hdslb.com/bfs/")) {
					if (src.startsWith("//")) {
						src = "https:" + src;
					}
					
					// 提前计算原图URL用于去重
					var originalSrc = convertToOriginalImage(src);
					// 检查是否已经处理过相同的原图
					if (!processedOriginals.includes(originalSrc)) {
						imageUrls.push(src);
						processedOriginals.push(originalSrc);
					} else {
						console.log("跳过重复图片: " + src);
					}
				}
			}
		}
		
		console.log("找到图片URL数量: " + imageUrls.length);
		imgl = imageUrls.length;
		
		if (imgl === 0) {
			console.log("未能提取到有效的图片URL，退出");
			return;
		}

		for (var i = 0; i < imgl; i++) {
			bpboxes[i] = creaElemIn("div", root);
			nslinks[i] = creaElemIn("div", nslink);
			nslinks[i].innerHTML = (i + 1);
			nslinks[i].name = i;
			creaElemIn("br", root);
            
			var imgSrc = imageUrls[i];
			// 处理专栏图片URL，获取原图
			imgsrc = convertToOriginalImage(imgSrc);
			
			imgn = creaElemIn("img", bpboxes[i]);
			imgn.src = imgsrc;
			imgn.className = "big_pic";
			imgn.title = "[ " + (i + 1) + " / " + imgl + " ]";
			nslinks[i].style.backgroundImage = 'url("' + imgSrc + '")';
			
			nslinks[i].addEventListener(
				"click",
				function (e) {
					scrollto(getTop(bpboxes[e.target.name]) - topspare + 25);
				},
				false
			);
		}

		// 设置滚动事件和其他交互
		setupScrollEvent(bpboxes, nslinks, imgl);
	}

	function goDynamic(allPictures, allSourceSets, allImages) {
		// 处理动态图片
		setupCSS();
		setupButtons();

		// 建立大图框架，用于插入大图
		var bpboxes = [],
			imgsrc,
			imgn,
			imgl = 0;
		var _limited = false;
		var root = document.querySelector(".bili-dyn-list__item") || 
		          document.querySelector(".bili-dyn-item") ||
		          document.querySelector(".card");
		var nslink = document.querySelector(".big_pic_ns");
		var nslinks = [];

		// 收集所有图片URL (只从img标签获取)
		var imageUrls = [];
		var processedOriginals = []; // 存储已处理过的原图URL，用于去重
		
		if (allImages.length > 0) {
			console.log("从img.src中获取图片URL");
			for (var i = 0; i < allImages.length; i++) {
				var src = allImages[i].getAttribute("src");
				if (src && src.includes("hdslb.com/bfs/")) {
					if (src.startsWith("//")) {
						src = "https:" + src;
					}
					
					// 提前计算原图URL用于去重
					var originalSrc = convertToOriginalImage(src);
					// 检查是否已经处理过相同的原图
					if (!processedOriginals.includes(originalSrc)) {
						imageUrls.push(src);
						processedOriginals.push(originalSrc);
					} else {
						console.log("跳过重复图片: " + src);
					}
				}
			}
		}
		
		console.log("找到图片URL数量: " + imageUrls.length);
		imgl = imageUrls.length;
		
		if (imgl === 0) {
			console.log("未能提取到有效的图片URL，退出");
			return;
		}

		for (var i = 0; i < imgl; i++) {
			// 提取动态大图
			bpboxes[i] = creaElemIn("div", root);
			nslinks[i] = creaElemIn("div", nslink);
			nslinks[i].innerHTML = (i + 1);
			nslinks[i].name = i;
			creaElemIn("br", root);
            
			var imgSrc = imageUrls[i];
			// 处理动态图片URL，获取原图
			imgsrc = convertToOriginalImage(imgSrc);
			
			imgn = creaElemIn("img", bpboxes[i]);
			imgn.src = imgsrc;
			imgn.className = "big_pic";
			imgn.title = "[ " + (i + 1) + " / " + imgl + " ]";
			nslinks[i].style.backgroundImage = 'url("' + imgSrc + '")';
			
			nslinks[i].addEventListener(
				"click",
				function (e) {
					scrollto(getTop(bpboxes[e.target.name]) - topspare + 25);
				},
				false
			);
		}

		// 设置滚动事件和其他交互
		setupScrollEvent(bpboxes, nslinks, imgl);
	}

	function convertToOriginalImage(imgSrc) {
		// 转换图片链接为原图链接
		var originalSrc = imgSrc;
		
		// 处理专栏图片 - 老版格式
		// 移除watermark和后续参数
		if (imgSrc.includes("hdslb.com/bfs/article")) {
			originalSrc = imgSrc.replace(/\/watermark\/.*$/, "");
			// 移除@后的参数
			originalSrc = originalSrc.replace(/@.*$/, "");
			// 移除.webp后缀
			originalSrc = originalSrc.replace(/\.webp$/, "");
		}
		
		// 处理动态图片 - 老版格式
		// 替换@后的尺寸和格式参数
		if (imgSrc.includes("hdslb.com/bfs/album")) {
			// 移除@后的参数
			originalSrc = originalSrc.replace(/@.*$/, "");
			// 若没有扩展名，尝试添加.jpg
			if (!originalSrc.match(/\.(jpg|jpeg|png|gif)$/i)) {
				originalSrc += ".jpg";
			}
		}
		
		// 处理动态图片和新版专栏 - 新版格式
		// 替换@后的尺寸和格式参数
		if (imgSrc.includes("hdslb.com/bfs/new_dyn")) {
			// 移除@后的参数
			originalSrc = originalSrc.replace(/@.*$/, "");
			// 若没有扩展名，尝试添加.jpg
			if (!originalSrc.match(/\.(jpg|jpeg|png|gif)$/i)) {
				originalSrc += ".jpg";
			}
		}
		
		// 确保URL有协议头
		if (originalSrc.startsWith("//")) {
			originalSrc = "https:" + originalSrc;
		}
		
		console.log("原图URL: " + originalSrc);
		return originalSrc;
	}

	function setupCSS() {
		// 插入CSS
		var headID = document.getElementsByTagName("head")[0];
		var cssNode = creaElemIn("style", headID);
		cssNode.type = "text/css";
		cssNode.innerHTML = [
			".big_pic{max-width: 890px;}",
			".big_pic_n{max-width: 500px;}",
			".big_pic:hover, .big_pic_n:hover{box-shadow: 0 0 30px 2px #f1ecdf;}",
			".big_pic_poster{outline: 2px dashed #fcde44; outline-offset: -2px; cursor: pointer;}",
			".big_pic_v{max-width: 90%; max-height: 80vh; cursor: pointer;}"
		].join(""); //大图样式
		cssNode.innerHTML += [
			".big_pic_b{position: fixed; left: 10px; top: 200px; z-index: 99999;}",
			".big_pic_btn{height: 20px; min-width: 50px; width: fit-content; padding: 3px; margin-bottom: 20px; border: 1px solid white; color: white; background: rgba(133,133,133,0.6); cursor: pointer; user-select: none;}",
			".big_pic_btn:hover{background: rgba(133,133,200,0.6);}",
			".big_pic_ns{margin-bottom: 20px; width: 62px; display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; grid-gap: 3px;}",
			".big_pic_ns > div{font-size: 10px; line-height: 28px; text-align: right; height: 15px; width: 15px; background-clip: border-box; background-position: center; background-size: cover; padding: 3px; border: 1px solid #7a7a7a; color: white; text-shadow: 0 0 2px black,0 0 2px black,0 0 2px black; cursor: pointer; user-select: none; opacity: 0.7;}",
			".big_pic_ns > div:hover{font-size: 0px; outline: 1px solid #f8f87b; opacity: 1;}",
			".big_pic_ns > div.curr{outline: 3px solid #f87bce; opacity: 0.9;}"
		].join(""); //按钮样式
	}

	function setupButtons() {
		// 创建控制按钮
		var buttonbox = creaElemIn("div", document.body);
		buttonbox.className = "big_pic_b";
		var tplink = creaElemIn("div", buttonbox); // 直达页顶链接
		var nclink = creaElemIn("div", buttonbox); // 图片限宽链接
		var n1link = creaElemIn("div", buttonbox); // 首个图片链接
		var n2link = creaElemIn("div", buttonbox); // 上个图片链接
		var nslink = creaElemIn("div", buttonbox); // 图片导航按钮
		var n3link = creaElemIn("div", buttonbox); // 下个图片链接
		nslink.className = "big_pic_ns";

		tplink.className = "big_pic_btn";
		tplink.innerHTML = "回到页顶";
		tplink.addEventListener(
			"click",
			function () {
				var headerbox = document.querySelector("header");
				scrollto(getTop(headerbox) - topheight * 2);
			},
			false
		);

		nclink.className = "big_pic_btn";
		nclink.innerHTML = "图片限宽";
		nclink.addEventListener(
			"click",
			function () {
				var bpboxes = document.querySelectorAll("div > img.big_pic, div > img.big_pic_n");
				var i;
				if (bpboxes.length > 0) {
					if (bpboxes[0].className === "big_pic") {
						for (i = 0; i < bpboxes.length; i++) {
							bpboxes[i].className = "big_pic_n";
						}
					} else {
						for (i = 0; i < bpboxes.length; i++) {
							bpboxes[i].className = "big_pic";
						}
					}
				}
			},
			false
		);

		n1link.className = "big_pic_btn";
		n1link.innerHTML = "△首个图片";
		n1link.addEventListener(
			"click",
			function () {
				var bpboxes = document.querySelectorAll("div > img.big_pic, div > img.big_pic_n");
				if (bpboxes.length > 0) {
					scrollto(getTop(bpboxes[0].parentNode) - topspare + 25);
				}
			},
			false
		);

		n2link.className = "big_pic_btn";
		n2link.innerHTML = "▲上个图片";
		n2link.addEventListener(
			"click",
			function () {
				var bpboxes = document.querySelectorAll("div > img.big_pic, div > img.big_pic_n");
				var t = document.documentElement.scrollTop;
				for (var j = bpboxes.length - 1; j >= 0; j--) {
					if (t > getTop(bpboxes[j].parentNode) + bpboxes[j].parentNode.offsetHeight - topspare) {
						scrollto(getTop(bpboxes[j].parentNode) - topspare + 25);
						return;
					}
				}
			},
			false
		);

		n3link.className = "big_pic_btn";
		n3link.innerHTML = "▼下个图片";
		n3link.addEventListener(
			"click",
			function () {
				var bpboxes = document.querySelectorAll("div > img.big_pic, div > img.big_pic_n");
				var t = document.documentElement.scrollTop;
				for (var j = 0; j < bpboxes.length; j++) {
					if (t < getTop(bpboxes[j].parentNode) - topspare) {
						scrollto(getTop(bpboxes[j].parentNode) - topspare + 25);
						return;
					}
				}
			},
			false
		);
	}

	function setupScrollEvent(bpboxes, nslinks, imgl) {
		// 设置滚动事件以突出显示当前图片
		document.onscroll = function () {
			var t = document.documentElement.scrollTop; // 当前滚动位置（视框顶y）
			var w = window.innerHeight;	// 当前视框高度
			var percentage = 1 / 4;		// 视框内"注视框"距视框顶底距离（1-2*percentage 为注视框高度占比）
			var linetop = t + w * percentage - topspare;	// 注视框顶位置
			var linebtm = t + w * (1 - percentage);	// 注视框底位置
			var j, vh, vhmax = 0;	// 检查图片序、图片在注视框内高度、注视框内最大高度
			
			if (bpboxes.length > 0) {
				if (getTop(bpboxes[0]) >= linebtm || getTop(bpboxes[imgl - 1]) + bpboxes[imgl - 1].offsetHeight <= linetop) {
					cur = -1;	// 若首图在注视框底之下或末图在注视框顶之上，则无当前图
				} else {
					for (j = imgl - 1; j >= 0; j--) {	// 从底部检查各图片
						let ti = getTop(bpboxes[j]), hi = bpboxes[j].offsetHeight;	// 检查图片位置、检查图片高度
						if (ti < linebtm && (ti + hi) > linetop) {	// 若图片顶端在注视框底之上、底端在注视框顶之下
							vh = Math.min(linebtm, ti + hi) - Math.max(linetop, ti);	// 计算注视框内高度
							if (vh >= vhmax) {	// 当检查图片拥有更大的注视框内高度，则其为"当前图片"（等高则更前）
								vhmax = vh;
								cur = j;
							}
						}
					}
				}
				
				if (cur !== -1) {
					for (j = imgl - 1; j >= 0; j--) {
						if (j !== cur) {
							nslinks[j].classList.remove("curr");
						} else {
							nslinks[j].classList.add("curr");
						}
					}
				} else {
					for (j = imgl - 1; j >= 0; j--) {
						if (j !== cur) {
							nslinks[j].classList.remove("curr");
						}
					}
				}
			}
		};
	}

	function scrollto(pos) {
		// 滚动到指定位置
		document.documentElement.scrollTop = pos;
	}

	// 创建元素
	function creaElemIn(tagname, destin) {
		var theElem = destin.appendChild(document.createElement(tagname));
		return theElem;
	}

	// 通过xpath获取元素
	function getElem(xpath) {
		return document
			.evaluate(
				xpath,
				document,
				null,
				XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
				null
			)
			.snapshotItem(0);
	}

	// 获取元素的绝对顶部位置
	function getTop(e) {
		var offset = e.offsetTop;
		if (e.offsetParent != null) offset += getTop(e.offsetParent);
		return offset;
	}

})(); 