// ==UserScript==
// @name        Extract images for pixiv
// @name:zh     P站原图收割机
// @namespace   https://github.com/cmheia/extract-images-for-pixiv
// @description Adds a button that get all attached images as original size to every post.
// @include     http://www.pixiv.net/member_illust.php*
// @include     https://www.pixiv.net/member_illust.php*
// @author      cmheia
// @version     1.3.2
// @icon        http://www.pixiv.net/favicon.ico
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @license     MPL
// @downloadURL https://update.greasyfork.org/scripts/20730/Extract%20images%20for%20pixiv.user.js
// @updateURL https://update.greasyfork.org/scripts/20730/Extract%20images%20for%20pixiv.meta.js
// ==/UserScript==
(function () {
	'use strict';
	/**********************************************************************
	 * 长得像库
	 **********************************************************************/
	var $id = function (o) {
		// return document.getElementById(o);
		return document.querySelector(`#${o}`);
	};

	var $class = function (o) {
		// return document.getElementsByClassName(o);
		return document.querySelector(`.${o}`);
	};

	// 去重
	var unique = function (arr) {
		var result = [],
		hash = {};
		for (let i = 0, elem; (elem = arr[i]) !== undefined; i++) {
			if (!hash[elem]) {
				result.push(elem);
				hash[elem] = true;
			}
		}
		return result;
	};

	// 插入样式表
	var apendStyle = function (cssText) {
		var head = document.head || document.getElementsByTagName('head')[0];
		var style = document.createElement('style');
		style.type = 'text/css';
		var textNode = document.createTextNode(cssText);
		style.appendChild(textNode);
		head.appendChild(style);
	};

	// 增加 class
	var addClassName = function (elem, clas) {
		var current = elem.className;
		if (current) {
			current += " ";
			current += clas;
			current = current.split(' ').filter(function (v, i) {
				if (v) {
					return v;
				}
			});
			current = unique(current);
			elem.className = current.join(" ");
		} else {
			elem.className = clas;
		}
	};

	// 移除 class
	var removeClassName = function (elem, clas) {
		var current = elem.className;
		if (current) {
			current = current.split(' ').filter(function (v, i) {
				if (clas != v) {
					return v;
				}
			});
			current = unique(current);
			elem.className = current.join(" ");
		}
	};

	// 增加/移除 class
	var toggleClassName = function (elem, clas) {
		var current = elem.className;
		if (current) {
			if (-1 === current.split(' ').indexOf(clas)) {
				addClassName(elem, clas);
			} else {
				removeClassName(elem, clas);
			}
		} else {
			elem.className = clas;
		}
	};

	// 伤脑筋！
	function illustCollector() {

		function tergetContainer() {
			// illust_id
			this.id = "-1";
			// 取得的原图链接
			this.result = [];
			// 最终的原图链接,1 -> yes,0 -> no,-1 -> failed
			this.final = [];
		}

		this.illust = [];

		// 删除重复目标
		this.shrinkTarget = function () {
			var elem,
			hash = {},
			duplicate = [];
			// 第一步：找出需要删除的重复 id
			for (let i = 0; (elem = this.illust[i]) !== undefined; i++) {
				if (hash[elem.id]) {
					duplicate.push(i); // 重复
				} else {
					hash[elem.id] = true;
				}
			}
			// 第二步：删除的重复 id
			for (let i = duplicate.length - 1; i >= 0; i--) {
				this.illust.splice(duplicate[i], 1);
			}
			// console.log("删除重复 id", duplicate.length, "个");
			return duplicate.length;
		};

		// 增加新目标
		this.addTarget = function (illust_id) {
			// console.group("addTarget", illust_id, this.illust.length);
			var i,
			index;
			for (i = 0; i < this.illust.length; i++) {
				if (illust_id === this.illust[i].id) {
					// console.log("目标重复了");
					index = -1;
					break;
				}
			}
			if (-1 !== index) {
				this.shrinkTarget();
				index = this.illust.length;
				// console.log("新增目标", index, this.illust.length);
				this.illust.push(new tergetContainer());
				// illust_id
				this.illust[index].id = illust_id;
			}
			// console.log(index, this.illust);
			// console.groupEnd();
			return index;
		};

		// 删除目标
		// type: true -> target is id; false -> target is index (default)
		this.removeTarget = function (target, type) {
			// console.group("removeTarget", target, type);
			var index = -1;

			if (type) {
				for (let i = 0; i < this.illust.length; i++) {
					if (target === this.illust[i].id) {
						index = i;
						break;
					}
				}
			} else {
				index = target;
			}
			if (index > -1) {
				this.illust.splice(index, 1);
			}
			// console.groupEnd();
		};

		// 记录指定 illust_id 包含的图片数量(取得目标 html 后调用)
		// count: -1 -> 记录为失败
		// type: true -> target is index; false -> target is id (default)
		this.recordTargetLength = function (target, count, type) {
			// console.group("recordTargetLength", target, count, type);
			var index = -1;

			if (type && this.illust[target] && this.illust[target].id) {
				index = target;
			} else {
				for (let i = 0; i < this.illust.length; i++) {
					if (target === this.illust[i].id) {
						index = i;
						break;
					}
				}
			}
			if (index > -1) {
				if (0 > count) {
					// 记录为失败
					// 取得的原图链接
					// this.illust[index].result[0] = "";
					// 最终的原图链接,1 -> yes,0 -> no,-1 -> failed
					this.illust[index].final[0] = -1;
					// console.log(target, "被标记为获取失败,index =", index);
				} else {
					// 取得的原图链接
					this.illust[index].result = new Array(count);
					// 最终的原图链接,1 -> yes,0 -> no,-1 -> failed
					this.illust[index].final = new Array(count);
					// console.log("初始化 illust[", index, "] 为", count, "个原图存放区");
				}
			}
			// console.groupEnd();
		};

		// 记录指定 illust_id 的原图 URL (取得目标的原图后调用, 每次调用添加一个 URL, 多图多调)
		// type: true -> target is index; false -> target is id (default)
		this.setTarget = function (target, content, offset, status, type) {
			// console.group("setTarget", target, content, offset, status, type);
			var index = -1,
			result = false;

			if (type && this.illust[target] && this.illust[target].id) {
				index = target;
			} else {
				for (let i = 0; i < this.illust.length; i++) {
					if (target === this.illust[i].id) {
						index = i;
						break;
					}
				}
			}
			if (index > -1) {
				if (offset < this.illust[index].final.length) {
					// console.log("记录第", offset, "个原图", content, "到", index);
					// 取得的原图链接
					this.illust[index].result[offset] = content;
					// 最终的原图链接,1 -> yes,0 -> no,-1 -> failed
					this.illust[index].final[offset] = parseInt(status);
					result = true;
				} else {
					// console.log(offset, "已越界");
				}
			}
			// console.groupEnd();
			return result;
		};

		// 完工？
		// final[],1 -> yes,0 -> no,-1 -> failed
		// 遍历所有 final, 发现 0 即为未完成
		this.isAllDone = function () {
			// console.group("isAllDone", this.illust.length);
			var working = false;

			// console.group("loop illust[]");
			for (let i = 0; i < this.illust.length && !working; i++) {
				// console.log("illust[", i, "]: id =", this.illust[i].id, ", final.length =", this.illust[i].final.length);
				if (0 === this.illust[i].final.length) {
					working = true;
					// console.warn("final.length=0, 即还未记录结果, 属未完成");
					break;
				}
				for (let j = 0; j < this.illust[i].final.length && !working; j++) {
					// console.log("\tfinal[", j, "] =", this.illust[i].final[j]);
					if (0 === this.illust[i].final[j]) {
						working = true;
						// console.warn("illust[", i, "].final[", j, "] = 0, 还未完成");
						break;
					}
				}
			}
			// console.groupEnd();
			if (working) {
				// console.warn("在忙");
			} else {
				// console.warn("完工！！！");
			}
			// console.groupEnd();
			return !working;
		};

		// 导出结果
		this.exportAll = function () {
			// console.group("exportAll");
			var j,
			k,
			total = 0,
			failed = new Array(this.illust.length),
			src = [],
			result = {};

			for (let i = 0; i < this.illust.length; i++) {
				for (j = 0, k = 0; j < this.illust[i].final.length; j++) {
					if (1 === this.illust[i].final[j]) {
						src[total++] = this.illust[i].result[j];
						k++;
					}
				}
				failed[i] = j - k;
				// console.log("illust[", i, "]导出", k, "个,失败", failed, "个");
			}
			// console.log("共导出", total, "个");
			result.fail = failed;
			result.done = src;
			// console.groupEnd();
			return result;
		};

		// 导出 ID
		this.getID = function () {
			// console.group("getID");
			var result = [];

			for (let i = 0; i < this.illust.length; i++) {
				result[i] = this.illust[i].id;
			}
			// console.groupEnd();
			return result;
		};
	}

	/**********************************************************************
	 * 基础设施
	 **********************************************************************/
	// 页面显示信息
	var msg = function (msg) {
		$id("extracted").innerHTML = msg;
	};

	// 创建样式表
	var addStyle = function () {
		apendStyle(".cmheia_checkbox {position:absolute;left:0;} .cmheia_item {padding:1px;} .cmheia_item_unselect {background-color:pink;}");
	};

	// 作品目录？
	// 综合
	// http://www.pixiv.net/member_illust.php?id=xxxxxxxx
	// 插画
	// http://www.pixiv.net/member_illust.php?type=illust&id=xxxxxxxx
	// 漫画
	// http://www.pixiv.net/member_illust.php?type=manga&id=xxxxxxxx
	// 动图
	// http://www.pixiv.net/member_illust.php?type=ugoira&id=xxxxxxxx
	// 小说
	// http://www.pixiv.net/novel/member.php?id=xxxxxxxx
	var isWorksList = function () {
		// console.group('页面类型');
		var userId,
		workId;

		userId = window.location.search.match(/[^_]id=(\d+)/);
		workId = window.location.search.match(/illust_id=(\d+)/);
		if (userId) {
			// console.log("作品目录,USER ID:", userId[1]);
		}
		if (workId) {
			// console.log("作品页面,WORK ID:", workId[1]);
		}
		// console.groupEnd();
		return null !== userId && null === workId;
	};

	// 匹配单个图片链接
	var parseImageUrl = function (src) {
		var result = src.match(/((http|https):\/\/)+(\w+\.)+(\w+)[\w\/\.\-]*(jpg|jpeg|gif|png|webp)/gi);
		if (null === result || 1 !== result.length) {
			return null;
		}
		return result[0];
	};

	// 提取多图页面原图链接
	var parseMultiImageUrl = function (target, callback) {
		// console.group("parseMultiImageUrl", target);
		var num = target.length,
		parsed = 0,
		result = {};
		var referer = target[0].replace(/big/, "medium");
		// console.warn('Referer :', referer);

		result.done = new Array(num);
		result.fail = new Array(num);
		for (let i = 0; i < num; i++) {
			// console.log(target[i]);
			// 下面闭包的 index 无实际必要,
			// xhr.finalUrl.replace(/.*(page=\d+)/, "$1") 可取得相同的值,
			// 然而
			// 听说闭包很深奥,那就多练练
			GM_xmlhttpRequest({
				method : 'GET',
				url    : target[i],
				headers: {
					'Referer': referer
				},
				onload : (function (xhr) {
					var index = i;
					return function (xhr) {
						var src;
						if (200 === xhr.status) {
							src = parseImageUrl(xhr.response);
							if (null !== src) {
								result.done[index] = src;
							}
						}
						// console.log("parseMultiImageUrl:onload", xhr.finalUrl.replace(/.*(page=\d+)/, "$1"), parsed, src, result);
						if (++parsed === num) {
							callback(result);
						}
					};
				})(),
				onerror: (function (xhr) {
					var index = i;
					return function (xhr) {
						// console.log("parseMultiImageUrl:onerror", xhr.finalUrl.replace(/.*(page=\d+)/, "$1"));
						result.fail[index] = xhr.finalUrl;
						if (++parsed === num) {
							callback(result);
						}
					};
				})()
			});
		}
		// console.groupEnd();
		return num;
	};

	/**********************************************************************
	 * 作品目录页面功能
	 **********************************************************************/
	// 解析详情页链接
	var extractIllustUrl = function () {
		// console.group("extractIllustUrl");
		var id = [],
		itemList = $class('_image-items').children;

		if (itemList) {
			for (let i = 0; i < itemList.length; i++) {
				let cmheia_checkbox = itemList[i].children[0].children[0].getElementsByTagName('input')[0];
				// console.log(cmheia_checkbox);
				if (cmheia_checkbox && cmheia_checkbox.checked) {
					let href = itemList[i].children[1].getAttribute('href');
					if (href && href.match(/.*illust_id=(\d+).*/)) {
						// id.push(href.replace(/.*illust_id=(\d+).*/, "$1") || "");
						id.push(href);
					}
				}
			}
		}
		// console.log(id);
		// console.groupEnd();
		return id;
	};

	// 选中全部图片
	var ctrlSelectAll = function () {
		// console.group("ctrlSelectAll");
		var itemList = $class('_image-items').children;

		if (itemList) {
			for (let i = 0; i < itemList.length; i++) {
				let index = itemList[i].children[0].children[0].children.length - 1;
				let bt = itemList[i].children[0].children[0].children[index];
				bt.checked = true;
				removeClassName(itemList[i].children[0], 'cmheia_item_unselect');
			}
		}
		// console.groupEnd();
	};

	// 反选
	var ctrlSelectInvert = function () {
		// console.group("ctrlSelectInvert");
		var itemList = $class('_image-items').children;

		if (itemList) {
			for (let i = 0; i < itemList.length; i++) {
				let index = itemList[i].children[0].children[0].children.length - 1;
				let bt = itemList[i].children[0].children[0].children[index];
				let x = bt.checked;
				bt.checked = !x;
				toggleClassName(itemList[i].children[0], 'cmheia_item_unselect');
			}
		}
		// console.groupEnd();
	};

	// 提取指定页面
	var fetchPageContent = function (arr, prefix, onload, onerror, referer) {
		// console.group('fetchPageContent');
		// console.warn('Referer :', referer);

		for (let i of arr) {
			// 听说闭包很深奥,那就多练练
			var target = i.replace(/.*illust_id=(\d+).*/, "$1");
			// console.log(prefix + i);
			GM_xmlhttpRequest({
				method : 'GET',
				url    : prefix + i,
				headers: {
					'Referer': referer
				},
				onload : (function (xhr) {
					var id = target;
					return function (xhr) {
						onload(id, xhr);
					};
				})(),
				onerror: (function (xhr) {
					var id = target;
					return function (xhr) {
						onerror(id, xhr);
					};
				})()
			});
		}
		// console.groupEnd();
	};

	// 从 html 源码提取原图链接
	// 先尝试作为单图解析,解析失败再作为图集解析,解析再次失败再作为动图解析
	// 返回：
	// 		单图 -> 原图链接(57565823);
	// 				 -> html 中包含字符串 "original-image"
	// 		多图 -> 包含原图的目标页面链接(第二个参数为此而生)(56207143);
	// 				 -> html 中包含字符串 "multiple"
	// 		动图 -> 原图压缩包链接(44588377,56083603)(动图仅包含单个 zip , 使用与单图相同的方法处理)
	// 				 -> html 中包含字符串 "ugoira_view"
	var parseWorkPage = function (html, url) {
		// console.group("parseWorkPage");
		// 2016-07-18 更新特征：
		// 		单图 -> 原图链接(57565823);
		// 				 -> html 中包含字符串 "original-image"
		// 				 -> document.querySelector('.works_display').innerHTML.indexOf('manga') === -1
		// 				 -> html 中仅字符串 "manga" 仅出现一次 <meta name="keywords" content="pixiv,插画,漫画,manga,社区,SNS投稿,比赛">
		// 				 -> 即 XMLHttpRequest.responseText.match(/manga/gi).length === 1
		// 		多图 -> 包含原图的目标页面链接(第二个参数为此而生)(56207143);
		// 				 -> html 中包含字符串 "multiple"
		// 				 -> html 中仅字符串 "manga" 仅出现一次 <meta name="keywords" content="pixiv,插画,漫画,manga,社区,SNS投稿,比赛">
		// 				 -> document.querySelector('.works_display').innerHTML.indexOf('manga') !== -1
		// 				 -> 即 XMLHttpRequest.responseText.match(/manga/gi).length > 1
		// 		动图 -> 原图压缩包链接(44588377,56083603)(动图仅包含单个 zip , 使用与单图相同的方法处理)
		// 				 -> html 中包含字符串 "ugoira_view"
		// 				 -> document.querySelector('.works_display').innerHTML.indexOf('manga') === -1
		// 				 -> html 中仅字符串 "manga" 仅出现一次 <meta name="keywords" content="pixiv,插画,漫画,manga,社区,SNS投稿,比赛">
		// 				 -> 即 XMLHttpRequest.responseText.match(/manga/gi).length === 1

		// 实例：
		// 		单图
		// 				<div class="works_display"><div class="_layout-thumbnail ui-modal-trigger"><img src="http://i1.pixiv.net/c/600x600/img-master/img/2015/01/23/12/29/40/xxxxxxxx_p0_master1200.jpg" alt="Верный"></div></div>
		// 		多图（伪）
		// 				<div class="works_display"><a href="member_illust.php?mode=big&amp;illust_id=xxxxxxxx" target="_blank" class=" _work manga "><div class="_layout-thumbnail"><img src="http://i3.pixiv.net/c/600x600/img-master/img/2015/11/13/20/05/08/xxxxxxxx_p0_master1200.jpg" alt="COMITIA114"></div></a></div>
		// 		多图（真）
		// 				<div class="works_display"><a href="member_illust.php?mode=manga&amp;illust_id=xxxxxxxx" target="_blank" class=" _work multiple "><div class="_layout-thumbnail"><div class="multiple"><i class="_icon-20 _icon-files"></i></div><img src="http://i3.pixiv.net/c/600x600/img-master/img/2016/07/15/20/47/58/xxxxxxxx_p0_master1200.jpg" alt="シャロ生誕祭"></div></a></div>
		// 		动图
		// 				<div class="works_display"><div class="_ugoku-illust-player-container ready playing"><div class="wrapper"><div class="_spinner"></div><div class="player toggle"><canvas width="477.326968973747" height="600" style="width: 477.327px; height: 600px;"></canvas></div><a href="/member_illust.php?mode=ugoira_view&amp;illust_id=xxxxxxxx" target="_blank" class="full-screen _ui-tooltip" data-tooltip="全屏显示"><img src="http://source.pixiv.net/www/images/ugoku-illust/full-screen.png?2" width="20" height="20"></a></div></div><div class="_full-screen-container"><div class="_ugoku-illust-player-container"><div class="wrapper toggle"><div class="_spinner"></div><div class="player"></div></div><div class="exit-full-screen"><img src="http://source.pixiv.net/www/images/ugoku-illust/exit-full-screen.png" width="30" height="30"></div></div></div></div>

		// 对应正则：
		// 		/<div[^<>]*class=\"works_display\">[^<>]*<(\w*)[^<>]*class=\"([\w\s\-\_]*)\"[^<>]*>/
		// 		/<div[^<>]*class[^<>]*=[^<>]*\"[^<>]*works_display[^<>]*\">[^<>]*<(\w*)[^<>]*class[^<>]*=[^<>]*\"([\w\s\-\_]*)\"[^<>]*>/

		// 上述实例 match 结果：
		// 		单图
		// 				["<div class="works_display"><div class="_layout-thumbnail ui-modal-trigger">", "div", "_layout-thumbnail ui-modal-trigger"]
		// 		多图（伪）
		// 				["<div class="works_display"><a href="member_illust.php?mode=big&amp;illust_id=xxxxxxxx" target="_blank" class=" _work manga ">", "a", " _work manga "]
		// 		多图（真）
		// 				["<div class="works_display"><a href="member_illust.php?mode=manga&amp;illust_id=xxxxxxxx" target="_blank" class=" _work multiple ">", "a", " _work multiple "]
		// 		动图
		// 				["<div class="works_display"><div class="_ugoku-illust-player-container ready playing">", "div", "_ugoku-illust-player-container ready playing"]
		var result = [],
		target = html.match(/<div[^<>]*class=\"works_display\">[^<>]*<(\w*)[^<>]*class=\"([\w\s\-\_]*)\"[^<>]*>/);

		if (target && 3 === target.length) {
			// 先尝试用类名判断
			if (-1 !== target[2].indexOf("trigger")) {
				// 单图
				target = html.match(/<img\s+alt=\"[^\"]*\".*data-src=\"([^\"]*)\".*class=\"original-image\">/);
				if (target && target[1]) {
					result.push(target[1]);
				}
				// console.log("单图", result);
				// console.log(target);
			} else if (-1 !== target[2].indexOf("multiple")) {
				// 多图（真）
				target = html.match(/<ul class=\"meta\"><li>[^<>]*<\/li><li>[^<>\d]*(\d+)P<\/li>/);
				if (target && target[1]) {
					let count = parseInt(target[1]);
					result.push(count);
					for (let i = 0; i < count; i++) {
						let link = url.replace(/medium/, "manga_big");
						link = `${link}&page=${i}`;
						result.push(link);
					}
				}
				// console.log("多图（真）", result);
				// console.log(target);
			} else if (-1 !== target[2].indexOf("_ugoku")) {
				// 动图
				target = html.match(/pixiv\.context\.ugokuIllustFullscreenData[\s]*=[\s]*\{[^}]*\"src\"[\s]*:[\s]*\"((http|https):[\\\/]*[\w\d\.]*pximg\.net(.*)\/(\d+)_ugoira(\d+)x(\d+)\.zip)\"/);
				if (target && target[1]) {
					result[0] = target[1].replace(/\\(.)/gi, '$1');
				}
				// console.log("动图", result);
			} else if (-1 !== target[2].indexOf("manga")) {
				// 多图（伪）
				result.push(1);
				result.push(url.replace(/medium/, "big"));
				// http://www.pixiv.net/member_illust.php?mode=big&illust_id=53517282
				// 这个链接直接打开会被302导致失败
				// 需要设置 Referer
				// console.log("多图（伪）", result);
				// console.log(target);
			} else {
				// 未知
				// console.error("错误：未知类型", target);
			}
		} else {
			// 不行再靠老一套
			target = html.match(/<img\s+alt=\"[^\"]*\".*data-src=\"([^\"]*)\".*class=\"original-image\">/);
			if (target && target[1]) {
				// 单图
				result[0] = target[1];
				// console.log("单图", result);
			} else if (-1 !== html.indexOf("multiple") && (target = html.match(/<ul class=\"meta\"><li>[^<>]*<\/li><li>[^<>\d]*(\d+)P<\/li>/)) && target && target[1]) {
				// 根据 meta 判断遇到作者使用多图模式发表单张图片会失败
				// meta === "一次性投稿多张作品 "(\d+)"P"
				// 多图
				// http://www.pixiv.net/member_illust.php?mode=manga_big&illust_id=xxxxxxxx&page=0
				let count = parseInt(target[1]);
				result.push(count);
				for (let i = 0; i < count; i++) {
					let link = url.replace(/medium/, "manga_big");
					link = `${link}&page=${i}`;
					result.push(link);
				}
				// console.log("多图", result, target);
			} else if (html.match(/manga/gi).length > 1) {
				// 多图模式的单图
				result.push(1);
				result.push(url.replace(/medium/, "big"));
				// http://www.pixiv.net/member_illust.php?mode=big&illust_id=53517282
				// 这个链接直接打开会被302导致失败
				// 需要设置 Referer
				// console.log("多图模式的单图", result, target);
			} else if (-1 !==html.indexOf("ugoira_view") && (target = html.match(/pixiv\.context\.ugokuIllustFullscreenData[\s]*=[\s]*\{[^}]*\"src\"[\s]*:[\s]*\"((http|https):[\\\/]*[\w\d\.]*pixiv\.net(.*)\/(\d+)_ugoira(\d+)x(\d+)\.zip)\"/)) && target && target[1]) {
				// 动图
				// http://www.pixiv.net/member_illust.php?mode=medium&illust_id=xxxxxxxx
				result[0] = target[1].replace(/\\(.)/gi, '$1');
				// console.log("动图", result[0]);
			} else {
				// console.error("错误：未知类型", target);
			}
		}

		// console.groupEnd();
		return result;
	};

	// 提取选定的原图
	var extractWorkList = function (url) {
		// console.group("开始提取");
		var exportImages = function () {
			if (result.isAllDone()) {
				var info,
				arr,
				res = result.exportAll();

				// console.log("已采集原图:", res.done);
				// console.log("提取失败: ", res.fail);
				info = "搞到 " + res.done.length + " 张图啦 （⺻▽⺻ ）";
				arr = result.getID();
				for (let i = res.fail.length - 1; i >= 0; i--) {
					if (0 === res.fail[i]) {
						arr.splice(i, 1);
					}
				}
				if (arr.length) {
					info += " 然而" + arr.toString() + "提取失败 (ಥ_ಥ)";
				}
				msg(info);
				GM_setClipboard(res.done.join("\r\n"));
			}
		};

		var recordFails = function (illustId, status) {
			// console.error(illustId, "提取失败", status);
			msg(illustId + "提取失败 (ಥ_ಥ) [http " + status + "]");
			result.recordTargetLength(illustId, -1);
			result.setTarget(illustId, null, 0, -1);
		};

		var progress = 0,
		result;

		if (0 === url.length) {
			msg("至少选择一张图吧 ◔ ‸◔？");
			// console.groupEnd();
			return;
		}
		msg("正在赶工 (๑•̀_•́๑)");
		// console.log("添加目标", url);
		result = new illustCollector();
		for (let i = 0; i < url.length; i++) {
			result.addTarget(url[i].replace(/.*illust_id=(\d+).*/, "$1"));
		}
		fetchPageContent(url,
			window.location.origin,
			function (illustId, xhr) {
				// console.group("得到页面", illustId, ", 开始解析", illustId == xhr.finalUrl.replace(/.*illust_id=(\d+).*/, "$1"));
				progress++;
				msg("进度" + progress + "/" + url.length + " (ฅ´ω`ฅ)");
				// console.warn("进度" + progress + "/" + url.length + " (ฅ´ω`ฅ)");

				if (200 === xhr.status) {
					// 解析页面取得原图链接(单图和动图)或新的目标页面链接(多图)
					let target = parseWorkPage(xhr.responseText, xhr.finalUrl);
					if (target) {
						// 记录原图数量
						if (1 === target.length) {
							result.recordTargetLength(illustId, 1);
							// 单图和动图可立即取得原图链接,那就顺手录入,并标记为已完成
							let i = result.setTarget(illustId, target[0], 0, 1);
							// console.log("记录单图或动图", i);
							// msg("到手" + parsed + "页，就剩" + (url.length - parsed) + "页啦 (ฅ´ω`ฅ)");
						} else {
							var count = target.shift();
							result.recordTargetLength(illustId, count);
							// 多图需要再次解析链接
							// console.warn("多图需要再次解析链接", target);
							if (1 === count && 1 === target.length) { // 伪多图
								result.setTarget(illustId, target[0], 0, 0);
								// console.warn("伪多图", target[0]);
							} else {
								for (let i = 0; i < count; i++) {
									result.setTarget(illustId, target[i], i, 0);
									// console.log(target[i]);
								}
							}
							parseMultiImageUrl(target, function (obj) {
								// console.warn("n:callback", obj);
								// console.log("搞完这 ", count, " 张图啦 （⺻▽⺻ ）");
								for (let i = 0; i < count; i++) {
									let status = (undefined !== obj.done[i] && undefined === obj.fail[i]) ? 1 : -1;
									result.setTarget(illustId, obj.done[i], i, status);
								}
								exportImages();
							});
						}
					} else {
						recordFails(illustId, xhr.status);
					}
				} else {
					recordFails(illustId, xhr.status);
				}
				exportImages();
				// console.groupEnd();
			},
			function (illustId, xhr) {
				// console.group("页面", illustId, ", 获取失败", illustId == xhr.finalUrl.replace(/.*illust_id=(\d+).*/, "$1"));
				progress++;
				msg("进度" + progress + "/" + url.length + " (ฅ´ω`ฅ)");

				recordFails(illustId, xhr.status);
				exportImages();
				// console.groupEnd();
			},
			window.location.href
		);
		// console.groupEnd();
	};

	// 添加按钮
	var addButtonWorkList = function () {
		// console.group("addButtonWorkList");
		var itemList = $class("_image-items");

		if (itemList) {
			let button,
			menu = $class('menu-items');

			// 全选按钮
			button = document.createElement('li');
			button.innerHTML="<a href='javascript:;'>全选</a>";
			button.addEventListener("click", function () {
				ctrlSelectAll();
			});
			menu.appendChild(button);

			// 反选按钮
			button = document.createElement('li');
			button.innerHTML="<a href='javascript:;'>反选</a>";
			button.addEventListener("click", function () {
				ctrlSelectInvert();
			});
			menu.appendChild(button);

			// 导出按钮
			button = document.createElement('li');
			button.innerHTML="<a href='javascript:;'>收割 ๑乛◡乛๑ (●´∀｀●)</a>";
			button.addEventListener("click", function () {
				extractWorkList(extractIllustUrl());
			});
			menu.appendChild(button);

			// 消息显示区域
			button = document.createElement('li');
			button.innerHTML="<span id='extracted'></span>";
			menu.appendChild(button);

			// 添加复选框
			addStyle();
			for (let i = 0; i < itemList.children.length; i++) {
				button = document.createElement('input');
				button.type = "checkbox";
				button.className = "cmheia_checkbox";
				button.checked = true;
				button.setAttribute('data-index', i);
				// a
				// 删除原先的链接
				// console.log(itemList.children[i].children[0]);
				itemList.children[i].children[0].setAttribute('href', '#');
				// 增加背景
				itemList.children[i].children[0].setAttribute('style', 'margin-bottom:0;');
				addClassName(itemList.children[i].children[0], 'cmheia_item');
				// addClassName(itemList.children[i].children[0], 'cmheia_item_unselect');
				// div
				// 增加点击事件
				itemList.children[i].children[0].children[0].appendChild(button);
				itemList.children[i].children[0].addEventListener("click", function (e) {
					// 点击图片切换选中状态
					let index = this.children[0].children.length - 1;
					let bt = this.children[0].children[index];
					// console.log(index);
					// console.log(bt);
					// console.log('点击图片切换' + (bt.checked ? '未' : '') + '选中状态');
					bt.checked = !bt.checked;
					toggleClassName(this, 'cmheia_item_unselect');
				});
			}
		}
		// console.groupEnd();
	};

	/**********************************************************************
	 * 作品页面功能
	 **********************************************************************/
	// 移除分享按钮
	var removeShareButton = function () {
		var shareButton = $class('share-link-container'),
		count = shareButton.children.length;
		for (let i = 0; i < count; i++) {
			shareButton.removeChild(shareButton.children[0]);
		}
	};

	// 添加导出按钮
	var addButtonWorkPage = function () {
		var button = document.createElement('li');
		button.innerHTML="<a href='javascript:;' style='margin:0 8px;'>收割 ๑乛◡乛๑ (●´∀｀●)</a>";
		button.addEventListener("click", function () {
			extractWorkList([window.location.pathname + window.location.search]);
		});
		$class('share-link-container').appendChild(button);

		button = document.createElement('li');
		button.innerHTML="<span id='extracted'></span>";
		$class('share-link-container').appendChild(button);
	};

	// 初始化作品列表界面
	var postInitWorksListUI = function () {
		let itemList = $class("_image-items");

		if (itemList) {
			if (1 === itemList.children.length && "" === itemList.children[0].className) {
				// <li>未找到任何相关结果</li>
				// console.log("未找到任何相关结果");
			} else {
				addButtonWorkList();
				document.addEventListener("keyup", function (event) {
					// F9 = 120
					if (120 === event.keyCode) {
						extractWorkList(extractIllustUrl());
					}
				}, true);
			}
		}
		console.warn("inited");
	};

	// 初始化作品列表界面
	var initWorksListUI = function () {
		var DOMObserverTimer = false;
		var DOMObserverConfig = {
			childList : true,
			subtree   : true,
		};
		var DOMObserver = new MutationObserver(function () {
				if (DOMObserverTimer !== 'false') {
					clearTimeout(DOMObserverTimer);
				}
				DOMObserverTimer = setTimeout(function () {
					if (!$id("extracted")) {
						DOMObserver.disconnect();
						postInitWorksListUI();
					}
				}, 100);
			});
		DOMObserver.observe(document.querySelector('.image-item'), DOMObserverConfig);
	};

	// 初始化作品界面
	var initWorkPageUI = function () {
		removeShareButton();
		addButtonWorkPage();
		document.addEventListener("keyup", function (event) {
			// F9 = 120
			if (120 === event.keyCode) {
				extractWorkList([window.location.pathname + window.location.search]);
			}
		}, true);
		console.warn("inited");
	};

	var initPEUI = function () {
		if (isWorksList()) {
			initWorksListUI();
		} else {
			initWorkPageUI();
		}
	};

	// 运行
	console.warn("P站原图收割机：开始");
	initPEUI();
}) ();
