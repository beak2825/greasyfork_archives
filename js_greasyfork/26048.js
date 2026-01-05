// ==UserScript==
// @name       淘宝无刷新加载翻页(预读)
// @namespace  https://greasyfork.org/zh-CN/users/6065-hatn
// @version    0.2.6
// @description  淘宝: 搜索列表改无刷新(预读)翻页：双击【←→】键快速翻页
// @icon           http://www.gravatar.com/avatar/10670da5cbd7779dcb70c28594abbe56?r=PG&s=92&default=identicon
// @include		*2.taobao.com/list/list.htm*
// @include		*2.taobao.com/item.htm*
// @include		*2.taobao.com/
// @include		*s.taobao.com/search*
// @require		http://cdn.staticfile.org/jquery/2.1.1-rc2/jquery.min.js
// @copyright	2016, hatn
// @author		hatn
// @run-at     	document-end
// @grant0       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/26048/%E6%B7%98%E5%AE%9D%E6%97%A0%E5%88%B7%E6%96%B0%E5%8A%A0%E8%BD%BD%E7%BF%BB%E9%A1%B5%28%E9%A2%84%E8%AF%BB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/26048/%E6%B7%98%E5%AE%9D%E6%97%A0%E5%88%B7%E6%96%B0%E5%8A%A0%E8%BD%BD%E7%BF%BB%E9%A1%B5%28%E9%A2%84%E8%AF%BB%29.meta.js
// ==/UserScript==

/**
* Ali Page Turning By AJAX
* 功能：淘宝 搜索列表改无刷新(预读)翻页
*
* 使用说明：
* 1、视图强制改为列表模式；
* 2、双击 【←→】按键 快速翻页(上/下一页)；
* 3、原翻页方式改为无刷新方式：动态替换/载入 翻页内容；
* 4、预读成功的页码数变为绿色。
*
*/

/* #########  参数设置 S ######### */

var config = {
    mode_status: 1,			// 工作模式 [1]淘宝(默认) [2]闲鱼(已无法使用) [3]淘宝
	act_type: 1,			// 加载模式 [1]底部自动载入(默认) [0]翻页
	search_flag: 1,			// 闲鱼恢复搜索框 (已无法使用)
    keyboard_flag: 1,		// 监听双击键盘事件 [1]开启(默认) [0]关闭
	scroll_time: 600		// 滚动到指定页数位置的动画时长 默认600毫秒
};
/* #########  参数设置 E ######### */

var AliObj = {
	/* 数据集 */
    DATA: {
		config: {}, // 参数配置
		/* 默认配置 */
		defaultCfg: {
            mode_status: 1,
			act_type: 1,
            search_flag: 1,
			keyboard_flag: 1,
			scroll_time: 600
		},
		/* 双击按键参数 */
		keyData: {
			timenow: 0, // 上一按键时间
			preKey: null, // 记忆前一按键
			keepTime: 400, // 双击间隔
		},
		/* 页数信息 */
		pageData: {
			pageCurr: 1,
			pageNext: 2,
			pagePre: null,
			pageTotal: null,
			pagePreReadingData: {}, // 格式 {"2": {"list": domObj, "pagelist": domObj, "page": pageNum}, "3": {...}, ...}
			pageReadArr: [] // 已读页数集合
		},
		/* url类别 */
		urlData: {
			"xianyuList": {
				"type": 'xianyuList',
				"match": /2\.taobao\.com\/list\/list\.htm/,
				"cssOnly": false, // 只需加载css的url类别
				"selector": {
					"try": 1,
					"pageTotal": '#J_Pages span.paginator-count',
					"pageCurr": '#J_Pages span.paginator-curr',
					"pageItem": '#J_Pages a',
					"pageItemNot": '.paginator-pre, .paginator-next',
					"pageItems": 'div.pagination div.wrapper',
					//"pageItemsBox": 'div.pagination',
					"goodsItems": '#J_ItemListsContainer ul',
				}
			},
			"xianyuGoods": {
				"type": 'xianyuGoods',
				"match": /2\.taobao\.com\/item\.htm/,
				"cssOnly": true
			},
			"xianyuIndex": {
				"type": 'xianyuIndex',
				"match": /2\.taobao\.com\/$/,
				"cssOnly": true
			},
			"taobaoList": {
				"type": 'taobaoList',
				"try": 20,
				"match": /s\.taobao\.com\/search/,
				"cssOnly": false,
				"selector": {
					"pageTotal": '#mainsrp-pager div.total',
					"pageCurr": '#mainsrp-pager li.item.active span.num',
					"pageItem": '#mainsrp-pager ul.items li.item a.num',
					"pageItemParent": '#mainsrp-pager ul.items li.item',
					"pageItemNot": '.icon-tag',
					"pageItemRmClass": 'J_Ajax',
					//"pageItemNot": '#mainsrp-pager ul.items li.pre a, #mainsrp-pager ul.items li.next a',
					"pageItems": '#mainsrp-pager div.m-page div.wraper',
					//"pageItemsBox": '#mainsrp-pager div.m-page',
					"goodsItems_list": '#mainsrp-itemlist div div div div.items',
					"goodsItems_grid": '#mainsrp-itemlist div div div.items',
					//"goodsItems": '#mainsrp-itemlist div div div.items, #mainsrp-itemlist div div div div.items', // 动态定义 line: 184
					"goodsListType": 'a.J_SortbarStyle.link.icon-tag.active.icon-hover',
					"sortbarMode": '.m-sortbar a[data-key][data-value], .m-nav a[data-key][data-value]'
				}
			},
		},
		urlInfo: {}, // 当前url类别信息
    },
	/* 初始化 */
	init: function() {
		var s = this;
		s.band();
		s.addHtmlCss();
		s.autoPreReading();
		console.log('log: Ali Page Turning By AJAX, Run...');
	},
	/* 启动器 */
	launcher: function(config) {
		var s = this;
		if (getUrlParam('ifm') == 'true') {
			console.log('log: iframe not work');
			return false; // iframe 不重复加载
		}
        var times = 10;
		var ii = 0;
		s.setParam(config);
		var	res = s.dealUrlInfo();
		if (res == false) {
			s.addHtmlCss();
			return false;
		}
	},
	/* 获取url类别信息 */
	dealUrlInfo: function() {
		var s = this, uTemp;
		var href = location.href;
		for (var i in s.DATA.urlData) {
			uTemp = s.DATA.urlData[i];
			if (!uTemp.match.test(href)) continue;
			s.DATA.urlInfo = uTemp;
			//console.log(uTemp); // debug
			if (uTemp.cssOnly == true) return false;

			switch (i) {
				case 'xianyuList':
					if ($.inArray(s.DATA.config.mode_status, [1, 2]) == -1) {
						console.log('log: xianyu not work !');
						die();
					}
					if (getUrlParam('ist') != 0) { // 改为视图若为瀑布流则改列表模式
						var url = location.href;
						url = url.replace(/&ist=1/, '');
						url += '&ist=0';
						location.href = url;
						return false;
					}
					break;
				case 'taobaoList':
					if ($.inArray(s.DATA.config.mode_status, [1, 3]) == -1) {
						console.log('log: taobao not work !');
						die();
					}
					break;
				default:
					break;
			}

			/*s.init(config);
			return true;*/
			var pageItems = uTemp.selector.pageItems;
			var goodsItems = uTemp.selector.goodsItems || false;
			var ii = 1, max = uTemp.try || 1;
			var timer = setInterval(function() {
				if (ii > max) {
					clearInterval(timer);
					console.log('log: No pagelist !');
					return false;
				}
				console.log('log: run ' + ii + ' times');
				if ($(pageItems).length >= 1) {
					if (uTemp.type == 'taobaoList') {
						var listType = $(uTemp.selector.goodsListType).attr('data-value');
						goodsItems = s.DATA.urlInfo.selector.goodsItems = uTemp.selector['goodsItems_' + listType];
						//console.log('ttt'+listType+s.DATA.urlInfo.selector.goodsListType);
					}
					if ($(goodsItems).length >= 1) {
						clearInterval(timer);
						s.init();
						return false; // 当前页面无商品或只有一页
					}
				}
				++ii;
			}, 600);
			break;
		}
		return true;
	},
	/* 事件绑定 */
	band: function() {
		var s = this, config = s.DATA.config, selectorInfo = s.DATA.urlInfo.selector, stype = s.DATA.urlInfo.type;
		config.keyboard_flag == 1 && $(window).on('keyup', function (event) {
			var keyCode = event.keyCode;
			if (event.type == 'keyup' && $("input:focus, textarea:focus").length == 0) {
				var double = doubleClick(keyCode);
				if (double == false) return false; // 非双击 不作响应
                if (keyCode == '39') { // 右方向键 下一页
					s.pageTurning('next');
                } else if (keyCode == '37') {
					s.pageTurning('pre'); // 左方向键 上一页
				}
			}
		});

		// 淘宝筛选/排序
		stype == 'taobaoList' && $(document).on('click', selectorInfo.sortbarMode, function() {
			var $a = $(this);
			var href = $a.attr('href');
			if (href != undefined && href.length > 10) location.href = href;
			var key = $a.data('key');
			var val = $a.data('value');
			var _act = $a.data('action');
			var act = _act == undefined ? false : _act;
			var selector_type = /:/.test(val) ? 'nav' : 'sort';
			var cat = new RegExp("&" + key + "=[^&]*", "g");
			var cat_val = new RegExp('&' + key + '=' + val, 'g');
			var url, _url = location.href.replace(/#.*/, "");
			//var jumpFlag = true;
			if (selector_type == 'sort') {
				switch (key) {
					case 's':
						if (val == undefined) return;
						s.pageTurning($.trim($a.attr('title')));
						return;
						break;
					case 'auction_tag[]':
						var cat_val_tag = new RegExp('&' + encodeURIComponent(key) + '=' + val, 'g');
						active = cat_val_tag.test(_url);
						if (active) {
							url = _url.replace(cat_val_tag, '');
						} else {
							url = _url + '&' + key + '=' + val;
						}
						break;
					default:
						var active = cat_val.test(_url);
						url = _url.replace(cat, '');
						if (!active) url = url + '&' + key + '=' + val;
				}
			} else if (selector_type == 'nav') {
				val = encodeURIComponent(val);
				if (act == 'add') {
					var key_val = cat.exec(_url);
					key_val = key_val == null ? '&' + key + '=' : key_val[0];
					url = _url.replace(cat, '') + key_val + '%3B' + val;
				} else if (act == 'remove') {
					var cat_rm = new RegExp('(?:%3B)?' + val, 'g');
					url = _url.replace(cat_rm, '');
				}
			}
			location.href = url;
		});

		// 页码点击事件
		var pageEvent = selectorInfo.pageItem;
		//if (stype == 'taobaoList') pageEvent += ', ' + selectorInfo.pageItemParent;
		$(document).on('click', pageEvent, function(event) {
			//console.log($(this)[0]);
			event.preventDefault(); // 阻止 默认行为
			event.stopPropagation(); // 阻止 事件冒泡
			var val;
			if (stype == 'taobaoList' && $(this).selector == selectorInfo.pageItemParent) {
				val = $('a:eq(0)', this).text();
			} else {
				val = $(this).text();
			}
			//alert('miaode: ' + val);
			s.pageTurning(val);
			return false;
		});

		// 滚动条 · 底部自动载入
		var scroll_flag = true; // 防重复载入标识
		config.act_type == 1 && $(window).scroll(function() {
			if (!scroll_flag) return false;
			var scrollTop = $(this).scrollTop();
			var scrollHeight = $(document).height();
			var windowHeight = $(this).height();
			//console.log(scrollTop + windowHeight, scrollHeight); // 查看数值
			if (scrollTop + windowHeight >= scrollHeight - 5) {
				scroll_flag = false;
				s.pageTurning('next');
				setTimeout(() => scroll_flag = true, 1000);
		　　}
		});

		/* 双击判定 */
		function doubleClick(keyCode) {
			var keyData = s.DATA.keyData;
			var timenow = (new Date()).getTime();
			if (keyData.timenow == 0) {
				keyData.timenow = timenow;
				keyData.preKey = keyCode;
				return false;
			} else {
				var intval = timenow - keyData.timenow;
				if (intval < keyData.keepTime && keyData.preKey == keyCode) {
					keyData.timenow = 0;
					return true;
				}
				keyData.preKey = keyCode;
				keyData.timenow = timenow;
			}
			return false;
		}
	},
	/* 注入css */
	addHtmlCss: function() {
		var s = this;
		var insertStr = `<style id="other-style">
		/* xianyu */
		div.mau-guide,div#popUp-div,div#popUp-div{display:none !important}.save-flag{color:#8ddc90 !important;}.pre-reading{position: absolute; left: 10000px;top: -10000px; max-height: 0; overflow: hidden; }
		/* taobao */
		#mainsrp-pager { float: right; }
		[id^="items-page-"] { float: left; }
		[id^="items-page-"]:before {
			content: "　第 " attr(page-num) " 页";
			float: left;
			width: 98%;
			text-indent: 2%;
			font-size: 16px;
			font-weight: bold;
			line-height: 31px;
			background: rgb(255,68,0);
			color: #fff;
			margin: 10px auto;
		}
		iframe[id=^"i-page-"] { display: none; border: 0; }
		</style>`;
		$(insertStr).appendTo($('body'));

		if (s.DATA.config.search_flag == 1 && s.DATA.urlInfo.type != 'taobaoList') {
			var q = $('h3.search-keywords').text();
			var search_form = `
			<div class="idle-search">
				<form method="get" action="//s.2.taobao.com/list/list.htm" name="search" target="_top">
					<input class="input-search" id="J_HeaderSearchQuery" name="q" type="text" value="${q}" placeholder="搜闲鱼" />
					<input type="hidden" name="search_type" value="item" autocomplete="off" />
					<input type="hidden" name="app" value="shopsearch" autocomplete="off" />
					<button class="btn-search" type="submit"><i class="iconfont">&#xe602;</i><span class="search-img"></span></button>
				</form>
			</div>`;
			$('.idle-nav').after(search_form);
		} else if (s.DATA.urlInfo.type == 'taobaoList') {
			$('a.' + s.DATA.urlInfo.selector.pageItemRmClass).removeClass(s.DATA.urlInfo.selector.pageItemRmClass);
		}
	},
	/* 自动预读 */
	autoPreReading: function() {
		var s = this;
		s.dealPageInfo();
		s.preReading();
	},
	/* 参数读取 */
	setParam: function(config) {
		var s = this;
		config = typeof config == 'object' ? config : {};
        $.extend(s.DATA.defaultCfg, config);
		s.dataMgr('get');
		//s.cfg = {};
		//s.dataMgr('set');
	},
	/* 页码处理 */
	dealPageInfo: function() {
		var s = this, pageData = s.DATA.pageData, selectorInfo = s.DATA.urlInfo.selector;
		var totalStr = $(selectorInfo.pageTotal + ':eq(0)').text();
		var count_res = preg_match_all(/\d+/g, totalStr, 'B');
		pageData.pageTotal = count_res ? parseInt(count_res[0][0]) : 2;
		pageData.pageCurr = parseInt($(selectorInfo.pageCurr + ':eq(0)').text());
		pageData.pagePre = pageData.pageCurr > 1 ? pageData.pageCurr - 1 : null;
		pageData.pageNext = pageData.pageCurr == pageData.pageTotal ? null : pageData.pageCurr + 1;
	},
	/* 预读当前页码 */
	preReading: function() {
		var s = this, selectorInfo = s.DATA.urlInfo.selector, stype = s.DATA.urlInfo.type;
		var $page_arr = $(selectorInfo.pageItem).not(selectorInfo.pageItemNot);
		var $tmp, pageNum, pre_arr = [], pid, href, dvalue, rand;
		var pageCache = s.DATA.pageData.pagePreReadingData;
		if (stype == 'taobaoList') {
			var _href = location.href.replace(/&s=\d*/g, '').replace(/#/g, '').replace(/&bcoffset=-?\d*/g, '').replace(/&ntoffset=-?\d*/g, '');
		}

		// 保存当前页面 内容
		var curr = s.DATA.pageData.pageCurr;
		if (typeof pageCache[curr] == 'undefined') {
			var content_c = $(selectorInfo.goodsItems + ':eq(0)').attr('page-num', curr).attr('id', 'items-page-' + curr)[0].outerHTML;
			//setTimeout(function(){console.log($(selectorInfo.pageItems + ':eq(0)'))}, 1);
			var plist_c = $(selectorInfo.pageItems + ':eq(0)')[0].outerHTML;
			pageCache[curr] = {"list": $(content_c), "pageList": $(plist_c), "page": curr};
			s.DATA.pageData.pageReadArr.push(curr);
		}
		//console.log($(selectorInfo.pageItem));
		$page_arr.each(function() {
			$tmp = $(this);
			pageNum = parseInt($tmp.text());
			if (typeof pageCache[pageNum] == 'undefined') {
				if (stype == 'xianyuList') {
					href = $tmp.attr('href');
				} else if (stype ==  'taobaoList') {
					dvalue = encodeURIComponent($tmp.attr('data-value'));
					rand = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
					href = _href + '&ifm=true&s=' + dvalue + '&bcoffset=-' + rand + '&ntoffset=-' + rand;
				}
				pid = 'page-pid-' + pageNum;
				$tmp[0].id = pid;
				pre_arr.push([pageNum, href, pid]);
			} else { // 已缓存的 页码变色操作
				$tmp.addClass('save-flag'); // #8ddc90
			}
		});
		if (pre_arr.length > 0) dealPrePage(pre_arr, pageCache);

		// 预读并保存
		function dealPrePage(pre_arr, pageCache) {
			//console.log(pre_arr); // test
			var tmp, $body = $('body'), ii = 0;
			for (var i in pre_arr) {
				tmp = pre_arr[i];
				readingPage(tmp);
                ++ii;
			}

			/*s.DATA.config.act_type == 0 && setTimeout(function() {
				$('.pre-reading').remove();
			}, 8000); // 8秒后移除*/

			/* 加载预读页面 */
			function readingPage(_tmp) {
				var tmp = _tmp, $iframe, content, plist, $content, delay_time = ii * 550;
				setTimeout(function() {
					if (stype == 'xianyuList') {
						$.get(tmp[1], function(data, status) {
							content = $(selectorInfo.goodsItems + ':eq(0)', $(data))[0].outerHTML;
							plist = $(selectorInfo.pageItems + ':eq(0)', $(data))[0].outerHTML;
							//div = '<div class="pre-reading" id="pre-id-' + tmp[0] + '">' + content + '</div>';
							$content = $(content).attr('id', 'items-page-' + tmp[0]).attr('page-num', tmp[0]).addClass('pre-reading');
							$body.append($content); // 预读图片资源
							pageCache[tmp[0]] = {"list": $(content), "pageList": $(plist), "page": tmp[0]};
							$('#' + tmp[2]).addClass('save-flag'); //修改当前页码为绿色（已缓存
						});
					} else if (stype == 'taobaoList') {
						$iframe = $('<iframe src="' + tmp[1] + '&ifm=true" data-iframe="' + tmp[0] + '" height="0" id="i-page-' + tmp[0] + '"></iframe>');
						$iframe[0].onload = iframeOnload;
						$body.append($iframe);
					}
				}, delay_time); // 每个页码间隔delay_time毫秒载入
			}
			// taobaoList iframe 预读处理
			function iframeOnload() {
				var $dom = $(this);
				var pageNum = $dom.attr('data-iframe');
				var pageItems = selectorInfo.pageItems;
				var goodsItems = selectorInfo.goodsItems;
				var ii = 1, max = s.DATA.urlInfo.try;
				var content, plist, $content;
				var timer = setInterval(function() { // TODO
					if (ii > max) {
						clearInterval(timer);
						console.log('log: iframe[' + $dom[0].id + '] No pagelist !');
						return false;
					}
					console.log('log: iframe[' + $dom[0].id + '] run ' + ii + ' times');
					if ($(pageItems + ', ' + goodsItems).length >= 2) {
						clearInterval(timer);
						content = $dom.contents().find(selectorInfo.goodsItems + ':eq(0)')[0].outerHTML;
						plist = $dom.contents().find(selectorInfo.pageItems + ':eq(0)')[0].outerHTML;
						$content = $(content);
						$content.attr('id', 'items-page-' + pageNum).attr('page-num', pageNum).addClass('pre-reading');
						$plist = $(plist);
						$('a.' + selectorInfo.pageItemRmClass, $plist).removeClass(selectorInfo.pageItemRmClass);
						$('img.J_ItemPic', $content).each(function() {
							this.src = location.protocol + $(this).data('src');
						});
						$body.append($content); // 预读图片资源
						pageCache[pageNum] = {"list": $content, "pageList": $plist, "page": pageNum};
						$('#page-pid-' + pageNum).addClass('save-flag'); //修改当前页码为绿色(已缓存)
						$dom.remove();
						console.log('log: iframe[' + $dom[0].id + '] remove.');
					}
					++ii;
				}, 600);
			}
		}
	},
	/* 翻页操作 */
	pageTurning: function(_cmd) {
		var s = this, pageData = s.DATA.pageData, act_type = s.DATA.config.act_type, selectorInfo = s.DATA.urlInfo.selector, stype = s.DATA.urlInfo.type;
		var action = pageDataDeal(_cmd);
		if (!action) return false;
		// 页码数据 替换 商品列表ul + 页码列表div
		var curr = pageData.pageCurr;
		var pageCache = pageData.pagePreReadingData;
		if (typeof pageCache[curr] == 'undefined') {
			//alert('页码[' + curr + ']尚未缓存成功，请稍后再试');
			//if (act_type == 1) $('html, body').animate({scrollTop: $(document).height() - 150}, s.DATA.config.scroll_time);
			return false;
		}
		var pageInfo = pageCache[curr];
		var read_flag = true; // 已阅标识
		if ($.inArray(curr, pageData.pageReadArr) == -1) {
			pageData.pageReadArr.push(curr);
			read_flag = false;
		}
		var $pageItems = $(selectorInfo.pageItems + ':eq(0)');
		var $pageItemsParent = $pageItems.parent();
		$pageItems.remove();
		$pageItemsParent.append(pageInfo.pageList);
		s.preReading(); // 继续预读当前未缓存的页码

		var $goodsItems = $(selectorInfo.goodsItems); //  + ':eq(0)'
		var $goodsItemsParent = $goodsItems.parent();
		if (act_type == 0) {
			$goodsItems.remove();
			$goodsItemsParent.append(pageInfo.list.removeClass('pre-reading'));
			//console.log(pageInfo.list); // test
			$('html, body').animate({scrollTop: $goodsItemsParent.offset().top}, s.DATA.config.scroll_time); // 描点回到顶部
		} else if (act_type == 1) {
			var uid = '#items-page-' + pageInfo.page;
			read_flag == false && $goodsItemsParent.append($(uid).removeClass('pre-reading'));
			$('html, body').animate({scrollTop: $(uid).offset().top}, s.DATA.config.scroll_time);
		}

		// 页码信息处理
		function pageDataDeal(_cmd) {
			_cmd = _cmd || 'next'; // 默认下一页
			var cmd_arr = ['next', 'pre', '下一页', '上一页'];
			_cmd = $.trim(_cmd);
			var cmd, cmd_n = parseInt(_cmd);

			if (cmd_n >= 1) { // 按指定数字页码翻页
				if (cmd_n == pageData.pageCurr) { // 当前页 不处理
					console.log('log: pageNum == pageCurr !');
					return false;
				}
				cmd = cmd_n < pageData.pageTotal ? cmd_n : pageData.pageTotal;
				pageData.pageCurr = cmd;
				pageData.pageNext = cmd >= pageData.pageTotal ? null : cmd + 1;
				pageData.pagePre = cmd <= 1 ? null : cmd - 1;
			} else {
				cmd = $.inArray(_cmd, cmd_arr) == -1 ? false : _cmd;
				if (cmd == false) {
					console.log('log: cmd[' + _cmd + '] was not accepted !');
					return false; // 指令有误
				}
				if (cmd == 'next' || cmd == '下一页') {
					if (pageData.pageNext == null) {
						console.log('log: No pageNext !');
						return false;
					}
					++pageData.pagePre;
					++pageData.pageCurr;
					var next = pageData.pageNext + 1;
					pageData.pageNext = next > pageData.pageTotal ? null : next;
				} else if (cmd == 'pre' || cmd == '上一页') {
					if (pageData.pagePre == null) {
						console.log('log: No pagePre !');
						return false;
					}
					--pageData.pageNext;
					--pageData.pageCurr;
					var pre = pageData.pagePre - 1;
					pageData.pagePre = pre < 1 ? null : pre;
				}
			}
			return true;
		}
	},
	/* 数据操作 */
	dataMgr: function(act) {
		var s = this;
		var action = act == 'set' ? 'set' : 'get';
		if (action == 'get') {
			var cfgStr = GM_getValue('config');
			if (typeof cfgStr == 'undefined' || cfgStr == '') {
				s.DATA.config = s.DATA.defaultCfg;
				return true;
			}
            var cfg_obj = JSON.parse(cfgStr);
			$.extend(s.DATA.config, s.DATA.defaultCfg, cfg_obj); // 合并
		} else {
			var cfgStr = JSON.stringify(s.DATA.config);
			GM_setValue('config', cfgStr);
		}
	}
};

AliObj.launcher(config);


/* 工具函数 */

// 仿PHP 正则
function preg_match_all(match, str, _type, limit_num) {
	// _type: [A] 默认排序 同序号/顺序的所有匹配结果放入同一数组; [B] 一次匹配的所有结果放入同一个数组
	var type = typeof _type != 'undefined' && _type == 'B' ? 'B' : 'A';
    var cat, data = [], limit = 0, limit_num = parseInt(limit_num) >= 1 ? parseInt(limit_num) : 0;
	while ((cat = match.exec(str)) != null) {
        if (limit_num > 0 && limit >= limit_num) break;
		data.push(cat);
        ++limit;
	}
	if (data.length == 0) return false; // 无匹配
	// A模式排序 处理
	if (type == 'A') {
		var dataTmp = [], tmp;
		for (var i in data) {
			tmp = data[i];
			for (var ii in tmp) {
				if (typeof dataTmp[ii] == 'undefined') dataTmp[ii] = [];
				dataTmp[ii].push(tmp[ii]);
			}
		}
		data = dataTmp;
	}

	return data;
}

//获取url中的参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}