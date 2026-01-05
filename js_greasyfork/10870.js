// ==UserScript==
// @name        微博图片全显示
// @namespace   hzhbest
// @include     http://weibo.com/*
// @include     https://weibo.com/*
// @include     http://www.weibo.com/*
// @include     https://www.weibo.com/*
// @description    同屏显示多图微博的全部大图。
// @version     4.22
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/10870/%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E5%85%A8%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/10870/%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E5%85%A8%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
	// --这里是设置区-- //
	var topheight = 60; //微博顶栏高度
	var topspare = 125; //滚动预留顶部高度
	var autorefresh = true; //是否定时自动检测页面变化
	var loadLargeGif = GM_getValue('WBimgAll') || false; //是否载入大型动图

	// --以下是代码区，请不要随意改动-- //

	// http://weibo.com/2710065263/BmxiVDCgt?from=page_1005052710065263_profile&wvr=6&mod=weibotime&type=comment#_rnd1436436058420
	// http://weibo.com/2328516855/CnYCvixUq?type=comment#_rnd1436493435761
	var regex = /weibo\.com\/\d{8,10}\/[a-z0-9A-Z]{9}\??/;
	var cur = -1	// “当前图片”序
	pinit();

	function pinit() {
		//检查是否已开大图，否则进入初始化进程；如果已开大图但网址已非单一微博网址则去除按钮；一秒检测一次
		var bpimg = document.querySelector("img.big_pic");
		console.log("matched?: ", regex.test(document.location.href));
		if (regex.test(document.location.href)) {
			//console.log(document.location.href);
			if (!bpimg) init();
		} else {
			var buttonbox = document.querySelector(".big_pic_b");
			if (!!buttonbox) buttonbox.parentNode.removeChild(buttonbox);
		}
		if (autorefresh) {
			setTimeout(pinit, 1000); //console.log("wait 1 sec");
		}
	}

	function init() {
		//通过评论框架确定页面载入完成，通过附加媒体容器确定有需要展开大图的情况，都成立时进入处理进程
		var list_ul = document.querySelector("div.vue-recycle-scroller__item-view"); //评论框架
		var expbox = document.querySelector('div[class*="picture-box_row_"'); //附加媒体容器
		document.querySelector('main>div[class^="Main_full_"]').style =
			"width: 800px;";
		if (!list_ul && !expbox) {
			console.log("no1"); // * [no1]未加载评论框架，等候
			setTimeout(init, 1000);
			return;
		} else if (!!list_ul && !expbox) {
			console.log("no2", expbox); // * [no2]评论框架已加载却无附加媒体容器，退出
			//getlongtext()
			return;
		} else {
			// * [go]一切正常，开始处理
			// 应对超过九图的情况
			var nyimg = document.querySelector(
				'[class*="woo-box-justifyCenter picture_mask_"]'
			);
			if (!!nyimg) {	//识别出超九图特征，将预览容器展开，以预览容器来获取图片
				nyimg.click();
				setTimeout(() => {
					expbox = document.querySelector('div[class*="picture-viewer_wrap_"]');
					console.log("go9");
					go(expbox);
					//console.log(expbox);
				}, 600);
			} else {
				console.log("go");
				go(expbox);
			}
		}
	}

	function go(expbox) {
		var feedbox = document.querySelector(".vue-recycle-scroller__item-wrapper"); //评论区容器元素
		var appbox = document.querySelector("WB_app_view"); //应用容器??
		var videobox = document.querySelector('div[class*="card-video_videoBox_"'); //视频容器
		var maintextimgs = document.querySelectorAll(
			'[class^="detail_wbtext_"]>a[target]'
		); //正文中的图片??
		var dbox =
			document.body.getElementsByTagName("main")[0].parentNode.parentNode; //主容器
		dbox.style.maxWidth = "none";

		// Insert CSS
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
			'main>div[class^="Main_full_"] {width: auto !important;min-width:800px;}',
			".WB_frame_c {width: auto !important; max-width: 920px; min-width: 600px;}",
			".WB_text.W_f14, .repeat_list .list_box .WB_text, .WB_expand>.WB_text{width: 490px;}",
			".WB_frame_c .media_box{display: none !important;}",
			'div[node-type="comment_list"] .media_box{display: block !important;}',
			'div[id^="Pl_Core_RecommendFeed__"]{right: 150px; width: 100px !important; max-height: 35px; overflow: hidden; transition: all ease 0.2s 0.5s;}',
			'div[id^="Pl_Core_RecommendFeed__"]:hover{width: 300px !important; max-height: 1000px;}',
			'div[id^="Pl_Core_RecommendFeed__"] .opt_box{display:none;}',
			'div[id^="Pl_Core_RecommendFeed__"]:hover .opt_box{display: inline-block;}'
		].join(""); //微博自身框架样式
		cssNode.innerHTML += [
			".big_pic_b{position: fixed; left: 10px; top: 200px;}",
			".big_pic_btn{height: 20px; min-width: 50px; width: fit-content; padding: 3px; margin-bottom: 20px; border: 1px solid white; color: white; background: rgba(133,133,133,0.6); cursor: pointer; user-select: none;}",
			".big_pic_btn:hover{background: rgba(133,133,200,0.6);}",
			".big_pic_ns{margin-bottom: 20px; width: 62px; display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; grid-gap: 3px;}",
			".big_pic_ns > div{font-size: 10px; line-height: 28px; text-align: right; height: 15px; width: 15px; background-clip: border-box; background-position: center; background-size: cover; padding: 3px; border: 1px solid #7a7a7a; color: white; text-shadow: 0 0 2px black,0 0 2px black,0 0 2px black; cursor: pointer; user-select: none; opacity: 0.7;}",
			".big_pic_ns > div:hover{font-size: 0px; outline: 1px solid #f8f87b; opacity: 1;}",
			".big_pic_ns > div.curr{outline: 3px solid #f87bce; opacity: 0.9;}"
		].join(""); //按钮样式

		var buttonbox = creaElemIn("div", document.body);
		buttonbox.className = "big_pic_b";
		var sclink = creaElemIn("div", buttonbox); //直达评论链接
		var tplink = creaElemIn("div", buttonbox); //直达页顶链接
		var nclink = creaElemIn("div", buttonbox); //图片限宽链接
		var n1link = creaElemIn("div", buttonbox); //首个图片链接
		var n2link = creaElemIn("div", buttonbox); //上个图片链接
		var nslink = creaElemIn("div", buttonbox); //图片导航按钮
		var n3link = creaElemIn("div", buttonbox); //下个图片链接
		var swmode = creaElemIn("div", buttonbox); //切换动图模式链接

		sclink.className = "big_pic_btn";
		sclink.innerHTML = "直达评论";
		sclink.addEventListener(
			"click",
			function () {
				var commentbox = document.querySelector("div.wbpro-tab3") || document.querySelector("#composerEle");
				scrollto(getTop(commentbox) - topheight * 2);
			},
			false
		);

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

		if (!!videobox) {
			cssNode.innerHTML = [
				".big_pic_sc{position: fixed; left:10px; padding: 3px; border: 1px solid white; color: white; background: rgba(133,133,133,0.6); cursor: pointer;} ",
				".big_pic_sc{top: 430px}",
			].join("");
			return;
		}

		if (!!appbox) {
			//检测到应用容器（微博文章或视频）时退出
			// box.appendChild(appbox);
			// if (!!wrpbox) expbox.removeChild(wrpbox);
			// cssNode.innerHTML = [
			// '.media_box{display: none !important;}',
			// '.big_pic_sc{position: fixed; left:10px; padding: 3px; border: 1px solid white; color: white; background: rgba(133,133,133,0.6); cursor: pointer;} ',
			// '.big_pic_sc{top: 430px}'].join("");
			return;
		}

		if (!!maintextimgs) {
			for (const i in maintextimgs) {
				if (/sinaimg.c(om|n)\/large/.test(maintextimgs[i].href)) {
					var mtimg = document.createElement("img");
					maintextimgs[i].parentNode.insertBefore(mtimg, maintextimgs[i]);
					mtimg.src = maintextimgs[i].href;
					mtimg.style =
						"border: 3px dotted #64882e; width: auto !important; height: auto !important; max-width: 500px;";
					maintextimgs[i].parentNode.removeChild(maintextimgs[i]);
				}
			}
		}

		//超过九图的应对
		var imgboxes;
		if (!!expbox.querySelector('[class*="picture-viewer_preview_"]')) {
			console.log("nine imgs");
			imgboxes = expbox.querySelectorAll(
				'[class*="picture-viewer_listContent_"]>div>div'
			);
			console.log(imgboxes.length);
		} else {
			imgboxes = expbox.querySelectorAll(
				'div[class*="woo-box-item-inlineBlock picture_item_"]'
			);
		}

		// 建立大图框架，用于插入大图
		var bpboxes = [],
			imgsrc,
			imgn,
			imgl = imgboxes.length;
		var _limited = false;
		var root = expbox.parentNode;
		nslink.className = "big_pic_ns";
		var nslinks = [];

		var j = 0;
		for (var i = 0; i < imgl; i++) {
			//提取大图
			// https://wx2.sinaimg.cn/orj360/006QkcF9ly1gz75df9qmuj30nn061dj1.jpg
			// https://wx2.sinaimg.cn/large/006QkcF9ly1gz75df9qmuj30nn061dj1.jpg
			// https://wx4.sinaimg.cn/large/002MwiQagy1gz7le15xtyj60k06851kx02.jpg
			// https://wx3.sinaimg.cn/large/003nJ9EBly1hakhpjuqugj60dc336n5l02.jpg
			bpboxes[i] = creaElemIn("div", root);
			nslinks[i] = creaElemIn("div", nslink);
			nslinks[i].innerHTML = (i + 1);
			nslinks[i].name = i;
			creaElemIn("br", root);
			var imgnode = imgboxes[i].querySelector("img");
			var imgvnode = imgboxes[i].querySelector("video"); //“动图”（实际上是mp4视频）
			// console.log('imgtest: #',i,/sinaimg.c(om|n)/.test(imgnode.src));
			if (/sinaimg.c(om|n)/.test(imgnode.src)) {	// 普通大图提取
				if (/sinaimg.c(om|n)\/(orj|thumb)\d{3}/.test(imgnode.src)) {
					imgsrc = imgnode.src.replace(
						/(sinaimg\.c(om|n)\/)(orj|thumb)\d{3}/,
						"$1large"
					);
				} else if (/sinaimg.c(om|n)\/large/.test(imgnode.src)) {
					imgsrc = imgnode.src;
				}
				imgn = creaElemIn("img", bpboxes[i]);
				imgn.src = imgsrc;
				imgn.className = "big_pic";
				imgn.title = "[ " + (i + 1) + " / " + imgl + " ]";
				nslinks[i].style.backgroundImage = 'url("' + imgnode.src + '")';
			} else if (!!imgvnode) {
				if (/sinaimg.c(om|n)\/(orj|thumb)\d{3}/.test(imgvnode.poster)) {	// 动图大图提取
					imgsrc = loadLargeGif
						? imgvnode.poster.replace(	// 动大图模式，使用封面的大图
							/(sinaimg\.c(om|n)\/)(orj|thumb)\d{3}/,
							"$1large"
						)
						: imgvnode.poster;	// 封面模式，直接用封面
				} else if (/sinaimg.c(om|n)\/large/.test(imgvnode.poster)) {	// 封面直接就是大图
					imgsrc = imgvnode.poster;
				}
				imgn = creaElemIn("img", bpboxes[i]);
				imgn.src = imgsrc;
				imgn.className = "big_pic" + ((loadLargeGif) ? "" : " big_pic_poster");
				imgn.title = "[ " + (i + 1) + " / " + imgl + " ] 点击以视频方式播放";
				imgn.onclick = function (event) {
					let pnode = event.target;
					let vnode = pnode.parentNode.getElementsByTagName("video")[0];
					pnode.style.display = "none";
					vnode.style.display = "block";
					vnode.play();
					console.log("p: ", "played");
				};
				nslinks[i].style.backgroundImage = 'url("' + imgvnode.poster + '")';
				bpboxes[i].appendChild(imgvnode);	// 将动图视频附在动图大图上，点击显示
				imgvnode.className = "big_pic_v";
				imgvnode.controls = true;
				imgvnode.style.display = "none";
				imgvnode.addEventListener("ended", function (event) {
					let vnode = event.target;
					let pnode = vnode.parentNode.getElementsByTagName("img")[0];
					console.log("p: ", pnode);
					vnode.style.display = "none";
					pnode.style.display = "block";
				});
				// imgvnode.onclick = function (event) {
				// 	console.log("v: ", "clicked");
				// 	//(vnode.paused)? vnode.play() : vnode.pause();
				// };
			} else {
				j += 1;
				continue;
			}
			nslinks[i].addEventListener(
				"click",
				function (e) {
					scrollto(getTop(bpboxes[e.target.name]) - topspare + 25);
				},
				false
			);
			if (j == imgl) return;
		}
		if (j == imgl) {
			//没找到符合条件的大图，退出
			cssNode.innerHTML =
				".big_pic_sc{position: fixed; left:10px; padding: 3px; border: 1px solid white; color: white; background: rgba(133,133,133,0.6); cursor: pointer;} .big_pic_sc{top: 430px}";
			return;
		}
		imgl = bpboxes.length;
		if (!!root) root.removeChild(expbox);

		nclink.className = "big_pic_btn";
		nclink.innerHTML = "图片限宽";
		nclink.addEventListener(
			"click",
			function () {
				var i;
				if (_limited) {
					for (i = 0; i < imgl; i++) {
						bpboxes[i].querySelector("img").className = "big_pic";
					}
					_limited = false;
				} else {
					for (i = 0; i < imgl; i++) {
						bpboxes[i].querySelector("img").className = "big_pic_n";
					}
					_limited = true;
				}
			},
			false
		);

		n1link.className = "big_pic_btn";
		n1link.innerHTML = "△首个图片";
		n1link.addEventListener(
			"click",
			function () {
				scrollto(getTop(bpboxes[0]) - topspare +25);
			},
			false
		);

		n2link.className = "big_pic_btn";
		n2link.innerHTML = "▲上个图片";
		n2link.addEventListener(
			"click",
			function () {
				var t = document.documentElement.scrollTop;
				for (var j = imgl - 1; j >= 0; j--) {
					if (t > getTop(bpboxes[j]) + bpboxes[j].offsetHeight - topspare) {
						scrollto(getTop(bpboxes[j]) - topspare + 25);
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
				var t = document.documentElement.scrollTop;
				for (var j = 0; j < imgl; j++) {
					if (t < getTop(bpboxes[j]) - topspare) {
						scrollto(getTop(bpboxes[j]) - topspare + 25);
						return;
					}
				}
			},
			false
		);

		swmode.className = "big_pic_btn";
		swmode.innerHTML = "↔切换动图模式";
		swmode.title = "切换为" + ((loadLargeGif) ? "显示封面静图" : "显示动图大图") + "并刷新页面";
		swmode.addEventListener(
			"click",
			function () {
				loadLargeGif = !loadLargeGif;
				GM_setValue('WBimgAll', loadLargeGif); 
				location.reload();
			},
			false
		);

		waitscroll();

		document.onscroll = function () {
			var t = document.documentElement.scrollTop; // 当前滚动位置（视框顶y）
			var w = window.innerHeight;	// 当前视框高度
			var percentage = 1 / 4;		// 视框内“注视框”距视框顶底距离（1-2*percentage 为注视框高度占比）
			var linetop = t + w * percentage - topspare;	// 注视框顶位置
			var linebtm = t + w * (1 - percentage);	// 注视框底位置
			var j, vh, vhmax = 0;	// 检查图片序、图片在注视框内高度、注视框内最大高度
			if (getTop(bpboxes[0]) >= linebtm || getTop(bpboxes[imgl - 1]) + bpboxes[imgl - 1].offsetHeight <= linetop) {
				cur = -1;	// 若首图在注视框底之下或末图在注视框顶之上，则无当前图
			} else {
				for (j = imgl - 1; j >= 0; j--) {	// 从底部检查各图片
					let ti = getTop(bpboxes[j]), hi = bpboxes[j].offsetHeight;	// 检查图片位置、检查图片高度
					if (ti < linebtm && (ti + hi) > linetop) {	// 若图片顶端在注视框底之上、底端在注视框顶之下
						vh = Math.min(linebtm, ti + hi) - Math.max(linetop, ti);	// 计算注视框内高度
						if (vh >= vhmax) {	// 当检查图片拥有更大的注视框内高度，则其为“当前图片”（等高则更前）
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
		};
	}

	function waitscroll() {
		//等待页面完全载入再滚动
		var list_ul = document.querySelector("div.list_ul"); //↓等待评论框架载入，如果评论框架就位就等待评论区或无评论提示载入，再视滚动位置判断
		if (
			!list_ul ||
			!list_ul.getElementsByTagName("div")[0] ||
			!document.querySelector("div.tips_rederror") ||
			document.documentElement.scrollTop < topheight + 70
		) {
			setTimeout(waitscroll, 300); //console.log("wait");
			return;
		} else {
			scrollto(topheight); //console.log("scroll");
		}
	}

	function scrollto(pos) {
		//滚动
		document.documentElement.scrollTop = pos;
	}

	// Create an element
	function creaElemIn(tagname, destin) {
		var theElem = destin.appendChild(document.createElement(tagname));
		return theElem;
	}
	// Get the first element by xpath
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
	// Get the absolute top of an element
	function getTop(e) {
		var offset = e.offsetTop;
		if (e.offsetParent != null) offset += getTop(e.offsetParent);
		return offset;
	}

})();
