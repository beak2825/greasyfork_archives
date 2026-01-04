// ==UserScript==
// @name         京东自营过滤
// @version      0.5.3.4
// @icon         https://www.jd.com/favicon.ico
// @description  在京东商品列表和搜索结果页面增加【自营】【非自营】以及【满赠】【满减】等超过30个商品过滤选项，为【京东配送】【仅显示有货】以及【排序】选项增加记忆功能。
// @author       You!
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        unsafeWindow
// @include      *://list.jd.com/list.html?*
// @include      *://coll.jd.com/list.html?*
// @include      *://list.jd.com/search?*
// @include      *://list.jd.com/Search?*
// @include      *://search.jd.com/search?*
// @include      *://search.jd.com/Search?*
// @include      *://www.jd.com/pinpai/*
// _require      https://code.jquery.com/jquery-3.5.0.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// _require      https://code.jquery.com/color/jquery.color-2.1.2.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-color/2.1.2/jquery.color.min.js
// @run-at       document-start
// @namespace    https://greasyfork.org/zh-CN/scripts/33729-京东自营过滤
// @downloadURL https://update.greasyfork.org/scripts/33729/%E4%BA%AC%E4%B8%9C%E8%87%AA%E8%90%A5%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/33729/%E4%BA%AC%E4%B8%9C%E8%87%AA%E8%90%A5%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
	'use strict';

	//过滤器
	var jdGoodsFilters = [
		//自营，非自营
		{name:'自营',nameN:'非自营',lv:0,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'京东自营，品质保障'
			]}
		]},

		//PLUS会员价
		{name:'PLUS会员',nameN:'非PLUS会员',lv:1,conditions:[
			{type:'attr',tag:'span',attr:'title',vals:[
				'PLUS会员专享价'
			]}
		]},

		//优惠券
		{name:'优惠券',nameN:'无优惠券',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'优惠券',
				'本商品可领用优惠券'
			]}
		]},

		//满减
		{name:'满减',nameN:'非满减',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'该商品参加满减活动',
				'本商品参与满减促销',
				'满减'
			]},
		]},

		//满件
		{name:'满件',nameN:'非满件',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'本商品参与满件促销'
			]}
		]},

		//满赠
		{name:'满赠',nameN:'非满赠',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'该商品参加满赠活动'
			]}
		]},

		//赠品
		{name:'赠品',nameN:'无赠品',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'购买本商品送赠品'
			]}
		]},

		//京东物流
		{name:'京东物流',nameN:'非京东物流',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'京东物流仓配，商家提供售后服务'
			]}
		]},

		//厂商配送
		{name:'厂商配送',nameN:'非厂商配送',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'厂家或供应商发货和配送'
			]}
		]},

		//到店自取
		{name:'到店自取',nameN:'非到店自取',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'该商品支持到店自取'
			]}
		]},

		//免邮
		{name:'免邮',nameN:'不免邮',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'当前收货地址，该商品免邮费',
				'当前收货地址，本商品免邮费'
			]}
		]},

		//运费险
		{name:'运费险',nameN:'无运费险',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'运费险',
				'退换货免运费'
			]},
		]},

		//京尊达
		{name:'京尊达',nameN:'非京尊达',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'专人配送，尊贵体验'
			]}
		]},

		//预约抢购
		{name:'预约抢购',nameN:'非预约抢购',conditions:[
			{type:'multi',vals:[
				{tag:'div',cls:'p-presell-time',textAny:['预约']},
			]},
		]},

		//秒杀
		{name:'秒杀',nameN:'非秒杀',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'天天低价，正品保证'
			]}
		]},

		//闪购
		{name:'闪购',nameN:'非闪购',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'品牌限时特卖'
			]}
		]},

		//定期购
		{name:'定期购',nameN:'非定期购',conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'定期免运费，省心又优惠'
			]}
		]},

		//全球购
		{name:'全球购',nameN:'非全球购',conditions:[
			{type:'text',tag:'span',vals:[
				'全球购'
			]}
		]},

		//包税
		{name:'包税',nameN:'不包税',conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'本商品已包税'
			]}
		]},

		//新品
		{name:'新品',nameN:'非新品',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'该商品是当季新品'
			]}
		]},

		//商场同款
		{name:'商场同款',nameN:'非商场同款',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'该商品是商场同款'
			]}
		]},

		//京东精选
		{name:'京东精选',nameN:'非京东精选',lv:1,conditions:[
			{type:'attr',tag:'img',attr:'src',vals:[
				'//img14.360buyimg.com/uba/jfs/t6919/268/501386350/1257/92e5fb39/5976fcf9Nd915775f.png'
			]},
			{type:'attr',tag:'img',attr:'data-tips',vals:[
				'京东精选'
			]}
		]},

		//品质优选
		{name:'品质优选',nameN:'非品质优选',lv:1,conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'只为品质生活'
			]}
		]},

		//京东超市
		{name:'京东超市',nameN:'非京东超市',lv:1,conditions:[
			{type:'text',tag:'span',vals:[
				'京东超市'
			]}
		]},

		//Sam's
		{name:'山姆会员',nameN:'非山姆会员',lv:1,conditions:[
			{type:'shop',vals:[
				'山姆会员商店官方旗舰店',
				'山姆会员商店全球购官方旗舰店'
			]},
			{type:'multi',vals:[
				{tag:'span',cls:'price-sams-1'},
				{tag:'em',textStart:'¥'}
			]},
		]},

		//有机
		{name:'有机',nameN:'非有机',conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'有机'
			]}
		]},

		//绿色
		{name:'绿色',nameN:'非绿色',conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'绿色'
			]}
		]},

		//无公害
		{name:'无公害',nameN:'非无公害',conditions:[
			{type:'text',tag:'i',vals:[
				'无公害'
			]}
		]},

		//三同
		{name:'三同',nameN:'非三同',conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'三同'
			]}
		]},

		//京东检测
		{name:'京东检测',nameN:'非京东检测',conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'京东检测'
			]}
		]},

		//双11保价
		{name:'双11保价',nameN:'无双11保价',conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'商品当前价格已与11.11当天一致，买贵返还差额'
			]}
		]},

		//老字号
		{name:'老字号',nameN:'非老字号',conditions:[
			{type:'text',tag:'i',vals:[
				'老字号'
			]}
		]},

		//地标产品
		{name:'地标产品',nameN:'非地标产品',conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'地标产品'
			]}
		]},

		//ASC
		{name:'ASC',nameN:'非ASC',conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'ASC'
			]}
		]},

		//BAP
		{name:'BAP',nameN:'非BAP',conditions:[
			{type:'attr',tag:'i',attr:'data-tips',vals:[
				'BAP'
			]}
		]},

		//海产品捕捞认证
		{name:'海捕证',nameN:'无海捕证',conditions:[
			{type:'text',tag:'i',vals:[
				'海产品捕捞认证'
			]}
		]},

		//商家客服
		{name:'商家客服',nameN:'无商家客服',lv:1,conditions:[
			{type:'attr',tag:'b',attr:'title',vals:[
				'联系客服'
			]},
			{type:'attr',tag:'em',attr:'title',vals:[
				'联系供应商进行咨询',
				'联系第三方卖家进行咨询',
				'供应商客服不在线，可留言'
			]}
		]},

		//抢购中
		{name:'抢购中',nameN:'非抢购中',conditions:[
			{type:'multi',vals:[
				{tag:'div',cls:'p-presell-time'},
				{tag:'span',textAny:['抢购中']}
			]}
		]},

		//有货
		{name:'有货',nameN:'无货',conditions:[
			{type:'multi',not:true,vals:[
				{tag:'div',cls:'p-stock',textAny:['无货']}
			]}
		]},

		//预订
		{name:'预订',nameN:'非预订',conditions:[
			{type:'multi',vals:[
				{tag:'div',cls:'p-stock',textAny:['预订']}
			]}
		]},

		//配送
		{name:'支持配送',nameN:'不支持配送',conditions:[
			{type:'multi',not:true,vals:[
				{tag:'div',cls:'p-stock',textAny:['不支持配送']}
			]}
		]},

		//二手有售
		{name:'二手有售',nameN:'非二手有售',conditions:[
			{type:'multi',vals:[
				{tag:'a',cls:'spu-link',texts:['二手有售']}
			]}
		]},

		//二手
		{name:'二手',nameN:'非二手',conditions:[
			{type:'multi',vals:[
				{tag:'span',cls:'p-tag',texts:['拍拍']}
			]}
		]},

		//2人拼
		{name:'2人拼',nameN:'非2人拼',conditions:[
			{type:'text',tag:'span',vals:[
				'2人拼'
			]}
		]},

		//放心购
		{name:'放心购',nameN:'非放心购',conditions:[
			{type:'text',tag:'i',vals:[
				'放心购'
			]}
		]},

		//爱心东东
		{name:'爱心东东',nameN:'非爱心东东',conditions:[
			{type:'text',tag:'span',vals:[
				'爱心东东'
			]}
		]},

		//广告
		{name:'广告',nameN:'非广告',conditions:[
			{type:'text',tag:'span',vals:[
				'广告'
			]}
		]},

		//本地仓
		{name:'本地仓',nameN:'非本地仓',conditions:[
            {type:'text',tag:'i',vals:[
                '本地仓'
            ]}
		]},

		//商品名匹配
		{name:'商品名匹配',nameN:'商品名不匹配',conditions:[
			{type:'multi',vals:[
				{tag:'div',cls:'p-name'},
				{tag:'em'}
			]}],
			_hlInfo:{ //私有数据
				tag: 'b',
				cls: 'hl',
				getEmTag: function(elem) {
					return elem.emTag || (elem.emTag = elem.getElementsByClassName('p-name')[0].getElementsByTagName('em')[0]);
				}
			},
			onPassed: function(elem) { //过滤器命中时执行：先取消高亮，再重新高亮
				if (!unsafeWindow.x$.highlightGoodsPattern) return this.onMissed(elem);
				var hlInfo = this._hlInfo;
				var em = hlInfo.getEmTag(elem);
				var condVal = this.conditions[0].vals[1];
				var match = condVal.textAny || condVal.textAll || condVal.textRex;
				if (!match) return this.onMissed(elem);
				var hlMatch = elem.highlighted;
				var html = em.innerHTML;
				var hlHtml = hlMatch === undefined ?
					highlightHtml(html, match, hlInfo) : //新加高亮
					replaceHighlightHtml(html, match, hlMatch, hlInfo); //已经高亮过，尝试替换
				if (hlHtml !== null) {
					elem.highlighted = match;
					em.innerHTML = hlHtml;
				}
			},
			onMissed: function(elem) { //过滤器未命中时执行：取消高亮
				if (!elem.highlighted) return;
				var hlInfo = this._hlInfo;
				var em = hlInfo.getEmTag(elem);
				var html = unhighlightHtml(em.innerHTML, hlInfo);
				if (html) em.innerHTML = html;
				delete elem.highlighted;
			},
			init: function() { //过滤器初始化，只运行一次
				var hlInfo = this._hlInfo;
				hlInfo.tag0 = [];
				for(var i=1; i<=9; ++i) hlInfo.tag0.push('<'+hlInfo.tag+' class="'+hlInfo.cls+i+'">');
				hlInfo.tag1 = '</'+hlInfo.tag+'>';
			}
		}
	];
	//过滤器处理程序
	var goodsFilterMap = {
		attr: function(elem, cond) {
			var tags = elem.getElementsByTagName(cond.tag);
			for (var i=0; i<tags.length; ++i) {
				var attr = tags[i].getAttribute(cond.attr);
				if (attr !== null && includesAny(attr, cond.vals)) return true;
			}
			return false;
		},
		text: function(elem, cond) {
			var tags = elem.getElementsByTagName(cond.tag);
			for (var i=0; i<tags.length; ++i) {
				var text = tags[i].innerText;
				if (text.length > 0 && (text = text.trim()).length > 0 && includesAny(text, cond.vals)) return true;
			}
			return false;
		},
		multi: function(elem, cond) {
			return filterTag(elem, cond.vals, 0);
			function filterTag(elem, conds, ci) {
				var cond = conds[ci];
				var tags = elem.getElementsByTagName(cond.tag);
				for (var i = 0; i < tags.length; ++i) {
					var tag = tags[i];
					if (cond.cls && !hasClasses(tag, cond.cls)) continue;
					//if (cond.attr && !hitAttributes(tag, cond.attr)) continue;
					var text = tag.innerText.trim();
					if (cond.texts && (text.length === 0 || !isAny(text, cond.texts))) continue;
					if (cond.textAny && (text.length === 0 || !includesAny(text, cond.textAny))) continue;
					if (cond.textAll && (text.length === 0 || !includesAll(text, cond.textAll))) continue;
					if (cond.textStart && (text.length === 0 || !text.startsWith(cond.textStart))) continue;
					// if (cond.textEnd && (text.length === 0 || !text.endsWith(cond.textEnd))) continue;
					// if (cond.textSub && (text.length === 0 || !text.includes(cond.textSub))) continue;
					if (cond.textRex && (text.length === 0 || (cond.textRex.lastIndex = 0) || !cond.textRex.test(text))) continue;
					return (++ci === conds.length) || filterTag(tag, conds, ci);
				}
				return false;
				function hasClasses(e,c) {
					if (!(c instanceof Array)) return e.classList.contains(c);
					for (var i=0; i<c.length; ++i) if (!e.classList.contains(c[i])) return false;
					return true;
				}
				// function hitAttributes(e,c) {
				// 	if (!(c instanceof Array)) return hitAttribute(e, c);
				// 	for (var i=0; i<c.length; ++i) if (!hitAttribute(e, c[i])) return false;
				// 	return true;
				// 	function hitAttribute(e,c) {
				// 		var a = e.getAttribute(c.attr);
				// 		return a !== null && includesAny(a, c.vals);
				// 	}
				// }
			}
		},
		shop: function(elem, cond) {
			var tags = elem.getElementsByTagName('div');
			for (var i=0; i<tags.length; ++i) {
				var tag = tags[i];
				if (tag.classList.contains('p-shop')) {
					var tags2 = tag.getElementsByTagName('a');
					for (var j=0; j<tags2.length; ++j) {
						var title = tags2[j].title;
						if (title.length > 0 && (title = title.trim()).length > 0 && cond.vals.includes(title)) return true;
					}
				}
			}
			return false;
		}//,
		// fn: function(elem, cond) {
		// 	for (var i=0; i<cond.vals.length; ++i) {
		// 		if (cond.vals[i](elem, cond)) return true;
		// 	}
		// 	return false;
		// }
	};

	//防止页面重入
	if (document.getElementById('goodsFilter'+jdGoodsFilters[0].name) !== null) return;

	//扫描页面的间隔频率时间
	var timerFreq = 333;
	//当前页面路径
	var currentPathname = location.pathname.toLowerCase();
	if (currentPathname.startsWith('/pinpai/')) currentPathname = '/search';
	//京东自带过滤器和排序选项
	var jdFilters = {
		京东配送: {type:0, gm_name:'京东配送', val:'1'},
		货到付款: {type:0, gm_name:'货到付款', val:'1'},
		仅显示有货: {type:0, gm_name:'仅显示有货', name:'stock',val:'1',def:'0'},
		排序: {type:1, gm_name:'排序', vals:[
			//综合没有值
			'sort_dredisprice_desc',
			'sort_dredisprice_asc',
			'sort_totalsales15_desc',
			'sort_commentcount_desc',
			'sort_winsdate_desc'
		]}
	};
	//检查插件数据
	CheckSettings(true);
	//通过重定向应用保存的京东自带过滤器和排序选项（v0.5.3.3 - jd更新【京东配送】【货到付款】等选项的参数后，某些情况商品页面会自动跳转到登录页，此版中暂时禁用。很久以后有时间了再修吧）
	//var newSearch = OnDocStart();
	//if (newSearch !== undefined) location.search = newSearch;
	//else
		setTimeout(OnDocReady, 0);

	//载入【京东配送】【仅显示有货】和排序的设置，返回重定向的路径
	function OnDocStart() {
		switch (currentPathname) {
			case '/search':
				jdFilters.京东配送.name = 'wtype';
				jdFilters.货到付款.name = 'cod';
				jdFilters.排序.name = 'psort';
				break;

			case '/list.html':
				jdFilters.京东配送.name = 'delivery';
				jdFilters.货到付款.name = 'delivery_daofu';
				jdFilters.货到付款.val = '3';
				jdFilters.排序.name = 'sort';
				break;
		}
		var urlOpts = url2Obj();
		if (readOpts(urlOpts)) {
			var newSearch = '?';
			for (var opt in urlOpts) {
				if (newSearch.length > 1) newSearch += '&';
				newSearch += opt;
				newSearch += '=';
				newSearch += urlOpts[opt];
			}
			return newSearch.length > 1 ? newSearch : '';
		}

		function url2Obj() {
			var ret = {};
			var u = location.search.split(/[\?&]/);
			for (var i in u) {
				var opt = u[i];
				if (opt.length > 0) {
					opt = opt.split('=');
					ret[opt[0]] = opt[1];
				}
			}
			return ret;
		}
		function readOpts(opts) {
			var modified;
			for (var optKey in jdFilters) {
				var opt = jdFilters[optKey];
				switch (opt.type) {
					case 0: modified |= readFilterOpt(opts, opt); break;
					case 1: modified |= readSortOpt(opts, opt); break;
				}
			}
			return modified;

			function readFilterOpt(opts, opt) {
				if (GM_getValue(opt.gm_name)) { //有保存的值
					if (!opts.hasOwnProperty(opt.name) || opts[opt.name] !== opt.val) {
						opts[opt.name] = opt.val;
						return true;
					}
				} else { //没有保存的值
					if (opt.def !== undefined) { //不允许url不带该参数
						if (opts.hasOwnProperty(opt.name)) {
							if (opts[opt.name] !== opt.def) {
								opts[opt.name] = opt.def;
								return true;
							}
						} else {
							opts[opt.name] = opt.def;
							return true;
						}
					} else if (opts.hasOwnProperty(opt.name) && opts[opt.name] !== '0') {
						delete opts[opt.name];
						return true;
					}
				}
				return false;
			}
			function readSortOpt(opts, opt) {
				var sortOpt = GM_getValue(opt.gm_name);
				switch (currentPathname) {
					case '/search':
						if (sortOpt !== undefined) ++sortOpt;
						break;

					case '/list.html':
						sortOpt = jdFilters.排序.vals[sortOpt];
						break;
				}

				if (sortOpt !== undefined) {
					if (!opts.hasOwnProperty(opt.name) || urlOpts[opt.name] != sortOpt) {
						urlOpts[opt.name] = sortOpt;
						return true;
					}
				} else if (opts.hasOwnProperty(opt.name)) {
					delete opts[opt.name];
					return true;
				}
				return false;
			}
		}
	}
	//载入页面后，为页面增加【自营】【非自营】等过滤器
	function OnDocReady() {
		//防止页面重入
		if (document.getElementById('goodsFilter'+jdGoodsFilters[0].name) !== null) return;

		runMain();

		//页面入口点
		function runMain() {
			if ($ && $.fn && $.fn.jquery) {
				enableAllFilters();
				loadAllSettings();
				initAllFilters();
				uiInitAndLoadAllGoods();
			} else setTimeout(runMain, timerFreq);

			function enableAllFilters() {
				for (var i=0; i<jdGoodsFilters.length; ++i) if (jdGoodsFilters[i].lv === undefined) jdGoodsFilters[i].lv = 1;
			}
			//加载设置
			function loadAllSettings() {
				unsafeWindow.x$ = { //init:设置数据缓冲
					infoLogText: '正在等待商品列表加载，请稍候……'
				};
				unsafeWindow.y$ = {}; //init:设置控件引用缓冲
				unsafeWindow.z$ = {}; //init:设置临时缓冲

				loadAllFiltersStates(); //加载过滤器选中状态
				loadFilterMode(); //加载过滤方式
				loadMisc(); //加载其他设置

				function loadAllFiltersStates() {
					for (var i=0; i<jdGoodsFilters.length; ++i) {
						var f = jdGoodsFilters[i];
						//加载启用状态
						f.level = GM_getValue('level'+f.name);
						if (f.level === undefined && f.lv !== undefined) f.level = f.lv;
						//加载选中状态
						f.checked = undefined === GM_getValue(f.name);
						f.checkedN = undefined === GM_getValue(f.nameN);
					}
					//【商品名匹配使用正则】设置
					var useRegex = GM_getValue('商品名匹配正则');
					if (useRegex !== undefined) unsafeWindow.x$.useRegexChecked = true; //init:商品名匹配正则
					//【商品名匹配高亮】设置
					if (GM_getValue('商品名匹配不高亮') === undefined) unsafeWindow.x$.highlightGoodsPattern = true; //init:商品名匹配高亮

					//【商品名匹配】过滤器
					var cond = jdGoodsFilters[jdGoodsFilters.findIndex(function(j) {return j.name === '商品名匹配';})].conditions[0].vals[1];
					var pattern = GM_getValue('商品名匹配规则');
					if (pattern !== undefined) {
						unsafeWindow.x$.goodsPattern = pattern;
						if (useRegex) cond.textRex = ToRegex(pattern);
						else {
							var txtCond = ToTextCond(pattern);
							if (txtCond.allMatch) cond.textAll = txtCond.txts;
							else cond.textAny = txtCond.txts;
						}
					}
					unsafeWindow.x$.goodsPatternCondition = cond; //init:商品名匹配规则
				}
				function loadFilterMode() {
					unsafeWindow.x$.filterModes = [ //init:设置过滤方式字典
						'akari',
						'haruhi',
						'cirno',
						'yuno',
						'mizuki',
						'burnIt',
						'succubus',
						'conan',
						'hphphp'
					];
					unsafeWindow.x$.goodsFilterModeIndex = GM_getValue('过滤方式'); //init:过滤方式索引
					if (unsafeWindow.x$.goodsFilterModeIndex === undefined) unsafeWindow.x$.goodsFilterModeIndex = 0; //init:过滤方式索引没有保存
					else if (unsafeWindow.x$.goodsFilterModeIndex < 0 || unsafeWindow.x$.goodsFilterModeIndex >= unsafeWindow.x$.filterModes.length) unsafeWindow.x$.goodsFilterModeIndex = 0; //init:过滤方式索引超限
					unsafeWindow.x$.goodsFilterModeClass = unsafeWindow.x$.filterModes[unsafeWindow.x$.goodsFilterModeIndex]; //init:过滤方式的className

					if (GM_getValue('后排') !== undefined) unsafeWindow.x$.filteredToLastChecked = true; //init:后排设置
				}
				function loadMisc() {
					if (GM_getValue('老爷机不要动画') !== undefined) unsafeWindow.x$.noAnimateChecked = true; //init:关闭动画设置
				}
			}
			//初始化过滤器
			function initAllFilters() {
				for (var i=0; i<jdGoodsFilters.length; ++i) {
					var f = jdGoodsFilters[i];
					if (f.init !== undefined) f.init();
				}
			}
		}
		//向页面添加自营过滤选项
		function uiInitAndLoadAllGoods() {
			var uiPos = $(document.querySelector('.f-feature ul'));
			if (uiPos.length > 0) {
				//改造京东自身过滤器和排序按钮
				hookJdFilters();
				//向页面添加过滤器
				addFiltersParts();
				//分页面情况处理后续是否加载商品
				switch (currentPathname) {
					case '/search':
						if (document.querySelector('div.notice-filter-noresult') !== null) { //搜索没有结果
							updateInfoLog('');
							return;
						}
				}
				//UI 初始化成功，加载所有商品
				loadAllGoods();
			} else setTimeout(uiInitAndLoadAllGoods, timerFreq);

			function hookJdFilters() {
				switch (currentPathname) {
					case '/search':
						//【京东配送】【货到付款】【仅显示有货】【全球配送】【节日促销】按钮重载 searchlog
						uiPos.find('li a[onclick]').each(function() {
							var tagA = $(this);
							if (tagA.attr('onclick').length > 0) this.oldOnClick = this.onclick;
							tagA.removeAttr('onclick');
							tagA.click(function() {
								if (this.oldOnClick !== undefined) {
									this.oldOnClick();
									var waitAjaxLoadGoodsList = function() {
										if (unsafeWindow.SEARCH.loading) setTimeout(waitAjaxLoadGoodsList, timerFreq);
										else runMain();
									};
									setTimeout(waitAjaxLoadGoodsList, timerFreq);
								}
							});
						});

						//【综合】【销量】【评论】【新品】【价格】排序按钮重载
						hookSearchSortHtml();
						//翻页按钮重载
						hookPager();
						//重载搜索排序函数，保存排序选项
						hookSearchSort();

						//【京东配送】【货到付款】【仅显示有货】按钮
						jdFilters.京东配送.aTag = uiPos.find('li a[data-field="wtype"]').first();
						jdFilters.货到付款.aTag = uiPos.find('li a[data-field="cod"]').first();
						jdFilters.仅显示有货.aTag = uiPos.find('li a[data-field="stock"]').first();
						break;

					case '/list.html':
						//【综合】【销量】【价格】【评论】【上架】排序按钮重载，保存排序设置
						$(document.querySelectorAll('#J_filter div.f-sort a:not([id])')).click(function() {
							var aTagSort = $(this);
							setTimeout(function() {
								var sortOpt = aTagSort.attr('href').match(/[&\?]sort=([^&]*)/i);
								if (sortOpt && 2 === sortOpt.length) {
									sortOpt = unescape(sortOpt[1]);
									for (var i=0; i<jdFilters.排序.vals.length; ++i) {
										if (sortOpt === jdFilters.排序.vals[i]) {
											GM_setValue(jdFilters.排序.gm_name, i);
											break;
										}
									}
								} else GM_deleteValue(jdFilters.排序.gm_name);
							}, 0);
						});

						//【京东配送】【货到付款】【仅显示有货】按钮
						switch (location.host) {
							case 'list.jd.com':
								jdFilters.京东配送.aTag = uiPos.find('li#delivery a').first();
								jdFilters.货到付款.aTag = uiPos.find('li#delivery_daofu a').first();
								jdFilters.仅显示有货.aTag = uiPos.find('li#stock a').first();
								break;

							case 'coll.jd.com':
								jdFilters.京东配送.aTag = uiPos.find('li a:contains(京东配送)').first();
								jdFilters.货到付款.aTag = uiPos.find('li a:contains(货到付款)').first();
								jdFilters.仅显示有货.aTag = uiPos.find('li a:contains(仅显示有货)').first();
								break;
						}
						break;
				}
				//【京东配送】按钮保存设置
				jdFilters.京东配送.aTag.click(function() {
					setTimeout(function() {
						if (jdFilters.京东配送.aTag.hasClass('selected') ^ (currentPathname === '/search')) GM_deleteValue(jdFilters.京东配送.gm_name);
						else GM_setValue(jdFilters.京东配送.gm_name, true);
					}, 0);
				});
				//【货到付款】按钮保存设置
				jdFilters.货到付款.aTag.click(function() {
					setTimeout(function() {
						if (jdFilters.货到付款.aTag.hasClass('selected') ^ (currentPathname === '/search')) GM_deleteValue(jdFilters.货到付款.gm_name);
						else GM_setValue(jdFilters.货到付款.gm_name, true);
					}, 0);
				});
				//【仅显示有货】按钮保存设置
				jdFilters.仅显示有货.aTag.click(function() {
					setTimeout(function() {
						if (jdFilters.仅显示有货.aTag.hasClass('selected') ^ (currentPathname === '/search')) GM_deleteValue(jdFilters.仅显示有货.gm_name);
						else GM_setValue(jdFilters.仅显示有货.gm_name, true);
					}, 0);
				});

				function hookSearchSortHtml() {
					if (unsafeWindow.SEARCH !== undefined && unsafeWindow.SEARCH.sort_html !== undefined) {
						if (unsafeWindow.SEARCH.oldFunc_sort_html === undefined) {
							unsafeWindow.SEARCH.oldFunc_sort_html = unsafeWindow.SEARCH.sort_html;
							unsafeWindow.SEARCH.sort_html = function(C) { //重载 SEARCH.sort_html 函数
								unsafeWindow.SEARCH.oldFunc_sort_html(C);
								//在 loadAllGoods 处理 /search 页面的分支中会调用 SEARCH.scroll 来加载商品列表后半页，
								//这会导致 SEARCH.sort_html 被再次调用，如果在重载的函数中再次【直接】【自动】调用 loadAllGoods 会构成递归溢出，
								//因此必须将 loadAllGoods 的调用放在排序按钮的 onclick 事件响应里面，并删除原始的 onclick 属性内联调用
								$(document.querySelectorAll('#J_filter div.f-sort a[onclick]')).each(function() {
									var tagA = $(this);
									if (tagA.attr('onclick').length > 0) this.oldOnClick = this.onclick;
									tagA.removeAttr('onclick');
									tagA.click(function() {
										if (this.oldOnClick !== undefined) {
											this.oldOnClick();
											var waitAjaxLoadGoodsList = function() {
												if (unsafeWindow.SEARCH.loading) setTimeout(waitAjaxLoadGoodsList, timerFreq);
												else loadAllGoods();
											};
											setTimeout(waitAjaxLoadGoodsList, timerFreq);
										}
									});
								});
							};
						}
					} else setTimeout(hookSearchSortHtml, timerFreq);
				}
				function hookPager() {
					if (undefined !== unsafeWindow.SEARCH && undefined !== unsafeWindow.SEARCH.page) {
						if (unsafeWindow.SEARCH.oldFunc_page === undefined) {
							unsafeWindow.SEARCH.oldFunc_page = unsafeWindow.SEARCH.page;
							unsafeWindow.SEARCH.page = function(F, C) { //重载 SEARCH.page 函数
								unsafeWindow.SEARCH.oldFunc_page(F, C);
								//loadAllGoods 不会与 SEARCH.page 发生嵌套循环调用，所以可以在重载函数内直接调用 loadAllGoods
								var waitAjaxLoadGoodsList = function() {
									if (unsafeWindow.SEARCH.loading) setTimeout(waitAjaxLoadGoodsList, timerFreq);
									else loadAllGoods();
								};
								setTimeout(waitAjaxLoadGoodsList, timerFreq);
							};
						}
					} else setTimeout(hookPager, timerFreq);
				}
				function hookSearchSort() {
					if (unsafeWindow.SEARCH !== undefined && unsafeWindow.SEARCH.sort !== undefined) {
						if (unsafeWindow.SEARCH.oldFunc_sort === undefined) {
							unsafeWindow.SEARCH.oldFunc_sort = unsafeWindow.SEARCH.sort;
							unsafeWindow.SEARCH.sort = function(A) { //重载 SEARCH.sort 函数
								unsafeWindow.SEARCH.oldFunc_sort(A);
								setTimeout(function() {
									if (!A) GM_deleteValue(jdFilters.排序.gm_name); else GM_setValue(jdFilters.排序.gm_name, A-1);
								}, 0);
							};
						}
					} else setTimeout(hookSearchSort, timerFreq);
				}
			}
			function addFiltersParts() {
				//向页面添加样式表
				if (document.getElementById('styleGoodsFilters') === null) GM_addStyle(
					//计数器占位符和计数器样式
					'span.goodsCountPlaceholder{width:36px;display:inline-block;}'+
					'span.goodsCount{font-size:10px;color:#fff;background-color:#e23a3a;border-radius:3px;padding:0px 3px;}'+
					//顶级过滤器样式
					'div.f-feature>ul>li>a>span.goodsCount{margin-left:2px;}'+
					//过滤器样式（必须带【.filter .f-feature ul li】前置，否则会被京东自身样式覆盖）
					'.filter .f-feature ul li a{padding-right:8px;}'+
					'.filter .f-feature ul li a.filterN{color:#888;}'+
					'.filter .f-feature ul li a.filterN:hover{color:#e23a3a;}'+
					'.filter .f-feature ul li a.filterN.selected i{border-color:rgba(228,57,60,0.3);}'+
					'.filter .f-feature ul li a.filterN.selected:hover i{border-color:#e4393c;}'+
					'.filter .f-feature ul li a.zeroCountGoods{color:#ccc;}'+
					'.filter .f-feature ul li a.zeroCountGoods.selected i{border-color:#ccc;}'+
					'.filter .f-feature ul li a.zeroCountGoods span.goodsCount{background-color:#ccc;}'+
					'.filter .f-feature ul li a.zeroCountGoods:hover{color:#e23a3a;}'+
					'.filter .f-feature ul li a.zeroCountGoods.selected:hover i{border-color:#e4393c;}'+
					//【下级过滤器】按钮
					'.filter .f-feature ul li.showMoreFilters{padding-right:12px;}'+
					'.filter .f-feature ul li.showMoreFilters a{padding:0 2px;color:#e23a3a;line-height:normal;border:1px solid #e23a3a;border-radius:3px;}'+
					'.filter .f-feature ul li.showMoreFilters a.opened{color:white;background:#e23a3a;}'+
					//过滤器数量蓝点
					'.filter .f-feature ul li.showMoreFilters a #moreFiltersCount{color:white;background:dodgerblue;position:absolute;top:-4px;right:-10px;width:16px;height:16px;line-height:15px;border-radius:8px;font-size:8px;text-align:center;user-select:none;cursor:pointer;}'+
					//过滤器面板
					'#moreFiltersPanel{border:1px solid #E7E3E7;z-index:0;}'+
					'#moreFiltersPanel *{white-space:nowrap;}'+
					//过滤器表格和动作条分割线
					'#moreFiltersPanel hr{margin:0 5px;border:0;border-top:1px solid #E7E3E7;}'+
					//过滤器面板div布局
					'#moreFiltersPanel div{display:flex;justify-content:center;align-items:center;}'+
					//过滤器表格样式
					'table.f-feature{margin:3px 0;border-collapse:collapse;}'+
					'table.f-feature td{padding:0 5px;text-align:center;}'+
					//过滤器组分割线
					'table.f-feature td:nth-child(3n+4){border-left:1px solid #E7E3E7;}'+
					//左侧过滤器样式
					'table.f-feature td:nth-child(3n+1){text-align:right;}'+
					'table.f-feature td:nth-child(3n+1) ul li a{padding:0;}'+
					'table.f-feature td:nth-child(3n+1) ul li a i{margin:0 0 0 4px;position:relative;top:3px;left:auto;right:0;}'+
					//右侧过滤器样式
					'table.f-feature td:nth-child(3n+3){text-align:left;}'+
					'table.f-feature td:nth-child(3n+3) ul li a{padding:0;}'+
					'table.f-feature td:nth-child(3n+3) ul li a i{margin:0 4px 0 0;position:relative;top:3px;left:0;right:auto;}'+
					//右侧过滤器计数样式
					'a.filterN span.goodsCount{background-color:rgba(226,58,58,0.3);}'+
					'a.filterN:hover span.goodsCount{background-color:#e23a3a;}'+
					//自定义匹配
					'#regFilter{margin:0 5px;}'+
					'#regFilter .txt{margin:5px 0;padding:0 2px;width:50%;border:1px solid #E7E3E7;font-size:12px;color:#666;}'+
					'.gl-item .p-name em b{font-weight:normal;}'+
					'.gl-item .p-name em .hl1{background:hsla(0,100%,50%,0.5);}'+
					'.gl-item .p-name em .hl2{background:hsla(200,100%,50%,0.5);}'+
					'.gl-item .p-name em .hl3{background:hsla(40,100%,50%,0.5);}'+
					'.gl-item .p-name em .hl4{background:hsla(240,100%,50%,0.5);}'+
					'.gl-item .p-name em .hl5{background:hsla(80,100%,50%,0.5);}'+
					'.gl-item .p-name em .hl6{background:hsla(280,100%,50%,0.5);}'+
					'.gl-item .p-name em .hl7{background:hsla(120,100%,50%,0.5);}'+
					'.gl-item .p-name em .hl8{background:hsla(320,100%,50%,0.5);}'+
					'.gl-item .p-name em .hl9{background:hsla(160,100%,50%,0.5);}'+
					//动作条按钮
					'#moreFiltersPanel a.btn.btn-default{margin:5px;}'+
					'#moreFiltersPanel a.btn.btn-default.btn-icon{padding:4px 5px;}'+
					'#moreFiltersPanel a.btn-icon{margin:5px;height:25px;}'+
					//动作条checkbox
					'#moreFiltersPanel .ckbox{margin:1px 0 0 6px;}'+
					//动作条图标
					'#actionBar i{display:inline-block;width:25px;height:25px;background:url(https://misc.360buyimg.com/user/passport/1.0.0/widget/login-form-2016-1124/i/qr-coagent.png) no-repeat;}'+
					//动作条提示
					'#actionBar i.info{margin:0 5px;background-position-x:-27px;}'+
					'#actionBar #infoLog{color:blue;font-weight:bold;}'+
					//动作条下拉选择框
					'#actionBar select{padding:0 20px 0 3px;border:1px solid #E7E3E7;font-size:12px;color:#666;-webkit-appearance: none;background:url(//misc.360buyimg.com/product/list/1.0.7/css/i/search.ele.png) no-repeat 78px 5px;}'+
					'#actionBar select:hover{background-position-y:-12px;}'+
					//被过滤商品的样式
					'li.gl-item:hover{filter:none;}'+
					'li.gl-item:hover .gl-i-wrap .p-img{filter:none;}'+
					//样式0：淡化
					'li.akari{background-color:#fff;filter:opacity(10%);}'+
					'li.akari:hover .gl-i-wrap div{filter:opacity(30%);}'+
					'.goods-list-v1 .gl-item.akari:hover{border-color:#ccc;}'+
					'.goods-list-v2 .gl-item.akari:hover .gl-i-wrap {border-color:#ccc;}'+
					//样式1：隐藏
					'li.haruhi{display:none;}'+
					//样式2：边框
					'li.cirno{background-color:#fff;}'+
					'li.cirno:hover .gl-i-wrap div{filter:opacity(30%);}'+
					'.goods-list-v1 .gl-item.cirno{border-color:#000;}'+
					'.goods-list-v1 .gl-item.cirno:hover{border-color:#48f;}'+
					'.goods-list-v2 .gl-item.cirno .gl-i-wrap {border-color:#000;}'+
					'.goods-list-v2 .gl-item.cirno:hover .gl-i-wrap {border-color:#48f;}'+
					//样式3：黑白
					'li.yuno{background-color:#fff;filter:grayscale(100%) brightness(60%);}'+
					'li.yuno:hover .gl-i-wrap div{filter:grayscale(100%);}'+
					'.goods-list-v1 .gl-item.yuno:hover{border-color:#888;}'+
					'.goods-list-v2 .gl-item.yuno:hover .gl-i-wrap {border-color:#888;}'+
					//样式4：转色
					'li.mizuki{background-color:#fff;filter:hue-rotate(180deg);}'+
					'li.mizuki:hover .gl-i-wrap div{filter:hue-rotate(180deg);}'+
					'.goods-list-v1 .gl-item.mizuki:hover{border-color:#3af;}'+
					'.goods-list-v2 .gl-item.mizuki:hover .gl-i-wrap {border-color:#3af;}'+
					//样式5：异端通通烧死
					'li.burnIt{background-color:#fff;filter:sepia(100%);}'+
					'li.burnIt:hover .gl-i-wrap div{filter:sepia(100%);}'+
					'.goods-list-v1 .gl-item.burnIt:hover{border-color:#e85;}'+
					'.goods-list-v2 .gl-item.burnIt:hover .gl-i-wrap {border-color:#e85;}'+
					//样式6：模糊
					'li.succubus{background-color:#fff;filter:blur(5px);}'+
					'li.succubus:hover .gl-i-wrap div{filter:blur(1.2px);}'+
					'.goods-list-v1 .gl-item.succubus:hover{border-color:#f3c;}'+
					'.goods-list-v2 .gl-item.succubus:hover .gl-i-wrap {border-color:#f3c;}'+
					//样式7：反色
					'li.conan{background-color:#fff;filter:invert(100%);}'+
					'li.conan:hover .gl-i-wrap div{filter:invert(100%);}'+
					'.goods-list-v1 .gl-item.conan:hover{border-color:#000;}'+
					'.goods-list-v2 .gl-item.conan:hover .gl-i-wrap {border-color:#000;}'+
					//样式8：暗刻
					'li.hphphp{background-color:#fff;filter:grayscale(10%) contrast(50) sepia(100%) saturate(100) hue-rotate(180deg) invert(100%) blur(1px);}'+
					'li.hphphp:hover .gl-i-wrap div{filter:grayscale(10%) contrast(50) sepia(100%) saturate(100) hue-rotate(180deg) invert(100%) blur(1px);}'+
					'.goods-list-v1 .gl-item.hphphp:hover{border-color:#000;}'+
					'.goods-list-v2 .gl-item.hphphp:hover .gl-i-wrap {border-color:#000;}'+
					''
				).id = 'styleGoodsFilters';
				//生成顶级过滤器HTML
				var uiPrependFilters = '';
				for (var i=0; i<jdGoodsFilters.length; ++i) {
					var f = jdGoodsFilters[i];
					if (f.level !== 0) continue; //剔除不是顶级的

					var checkedClass = f.checked ? 'class="selected"' : '';
					var checkedNClass = f.checkedN ? 'class="filterN selected"' : 'class="filterN"';
					uiPrependFilters +=
						'<li><a '+checkedClass+' href="javascript:;" id="goodsFilter'+f.name+'" filterId="'+i+'">'+
						'<i></i>'+f.name+'<span class="goodsCount" id="goodsCount'+f.name+'">0</span>'+
						'</a></li>'+
						'<li><a '+checkedNClass+' href="javascript:;" id="goodsFilter'+f.nameN+'" filterId="'+i+'">'+
						'<i></i>'+f.nameN+'<span class="goodsCount" id="goodsCount'+f.nameN+'">0</span>'+
						'</a></li>';
				}
				//生成【下级过滤器】按钮HTML
				uiPrependFilters +=
					'<li class="showMoreFilters">'+
					'<a id="showMoreFiltersPanel" href="javascript:;">'+
					'下级过滤器'+
					'<span id="moreFiltersCount" class="zeroFiltersCount" style="display:none;">0</span>'+
					'</a>'+
					'</li>';
				//添加顶级过滤器和【下级过滤器】按钮
				uiPos.first().prepend($(uiPrependFilters));
				//保存控件引用
				unsafeWindow.y$.aShowMoreFiltersPanel = $(document.getElementById('showMoreFiltersPanel'));
				unsafeWindow.y$.spanMoreFiltersCount = $(document.getElementById('moreFiltersCount'));
				//更新过滤器计数
				var spanMoreFiltersCount = updateUsingMoreFiltersCount(); //添加顶级过滤器和【下级过滤器】按钮
				//安装顶级过滤器响应函数
				installFilterClickHandler(0);
				//安装【下级过滤器】按钮响应函数
				unsafeWindow.y$.aShowMoreFiltersPanel.click(function() {
					setTimeout(toggleMoreFiltersPanel, 0);
				});
				//根据保存的设置打开下级过滤器面板
				if (GM_getValue('打开下级过滤器面板') !== undefined) toggleMoreFiltersPanel(true);
				//否则根据计数显示过滤器计数圆点
				else if (!spanMoreFiltersCount.hasClass('zeroFiltersCount')) spanMoreFiltersCount.css('display', ''); //初始化不用动画
				//安装过滤器响应函数
				function installFilterClickHandler(level) {
					for (var i=0; i<jdGoodsFilters.length; ++i) {
						var f = jdGoodsFilters[i];
						if (f.level !== level) continue; //剔除不是传入等级的

						//绑定HTML元素
						f.aFilter = document.getElementById('goodsFilter'+f.name);
						f.spanFilterCount = document.getElementById('goodsCount'+f.name);
						f.aFilterN = document.getElementById('goodsFilter'+f.nameN);
						f.spanFilterNCount = document.getElementById('goodsCount'+f.nameN);
						//初始化标记
						f.created = true;

						//安装点击响应函数
						f.aFilter.addEventListener('click', filterClickHandler);
						f.aFilterN.addEventListener('click', filterClickHandler);
					}
					//过滤器点击响应函数
					function filterClickHandler() {
						if (undefined !== unsafeWindow.z$.currentFilterData) return; //防止重入
						unsafeWindow.z$.currentFilterData = this || event.currentTarget || arguments[0].currentTarget;
						setTimeout(function() {
							var aFilter = unsafeWindow.z$.currentFilterData;
							var cl = aFilter.classList;
							cl.toggle('selected');
							var checked = cl.contains('selected');
							var filterN = cl.contains('filterN');
							var f = jdGoodsFilters[aFilter.getAttribute('filterId')];
							if (filterN) f.checkedN = checked;
							else f.checked = checked;
							if ((filterN ? f.goodsCountFilteredN+f.goodsCountN : f.goodsCountFiltered+f.goodsCount) !== 0) applyGoodsFilters(); //过滤器点击响应
							//更新过滤器计数
							if (f.level === 1) updateUsingMoreFiltersCount(); //过滤器点击响应
							//保存设置
							var valName = filterN ? f.nameN : f.name;
							if (checked) GM_deleteValue(valName); else GM_setValue(valName, true);
							delete unsafeWindow.z$.currentFilterData;
						}, 0);
					}
				}
				//打开/关闭下级过滤器面板
				function toggleMoreFiltersPanel(isInitializing) {
					if (!isInitializing) saveStates();
					var div = unsafeWindow.y$.divMoreFiltersPanel;
					if (div === undefined) {
						setupMoreFiltersPanel();
						div = unsafeWindow.y$.divMoreFiltersPanel;
					}
					var span = unsafeWindow.y$.spanMoreFiltersCount;
					if (unsafeWindow.y$.aShowMoreFiltersPanel.toggleClass('opened').hasClass('opened')) {
						//保存下级过滤器面板打开状态
						GM_setValue('打开下级过滤器面板', true);
						//显示下级过滤器面板
						if (isInitializing || unsafeWindow.x$.noAnimateChecked) { //不允许动画
							div.css('display', '');
							if (!span.hasClass('zeroFiltersCount')) span.css('display', 'none');
						} else {
							div.slideDown('fast');
							if (!span.hasClass('zeroFiltersCount')) span.fadeOut();
						}
					} else {
						//保存下级过滤器面板关闭状态
						GM_deleteValue('打开下级过滤器面板');
						//结束正在执行的提醒动画
						$('#moreFiltersPanel td:has(a[filterId])').finish(); //querySelectorAll 不支持 :has
						//关闭下级过滤器面板
						if (isInitializing || unsafeWindow.x$.noAnimateChecked) { //不允许动画
							div.css('display', 'none');
							if (!span.hasClass('zeroFiltersCount')) span.css('display', '');
						} else {
							div.slideUp('fast');
							if (!span.hasClass('zeroFiltersCount')) span.fadeIn();
						}
					}
					//向页面添加下级过滤器面板
					function setupMoreFiltersPanel() {
						var uiFilters = [];
						//生成过滤器HTML数组
						for (var i=0; i<jdGoodsFilters.length; ++i) {
							var f = jdGoodsFilters[i];
							if (f.level !== 1) continue; //剔除不是下级的

							var checkedClass = f.checked ? 'class="selected"' : '';
							var checkedNClass = f.checkedN ? 'class="filterN selected"' : 'class="filterN"';
							uiFilters.push({
								name: f.name,
								filter: '<li><a '+checkedClass+' href="javascript:;" id="goodsFilter'+f.name+'" filterId="'+i+'" title="【'+f.name+'】商品">'+
								'<span class="goodsCountPlaceholder"><span class="goodsCount" id="goodsCount'+f.name+'">0</span></span><i></i>'+
								'</a></li>',
								filterN: '<li><a '+checkedNClass+' href="javascript:;" id="goodsFilter'+f.nameN+'" filterId="'+i+'" title="【'+f.nameN+'】商品">'+
								'<i></i><span class="goodsCountPlaceholder"><span class="goodsCount" id="goodsCount'+f.nameN+'">0</span></span>'+
								'</a></li>'
							});
						}
						//计算过滤器表格列数
						var cols = 6;
						//生成过滤器表格内容HTML
						var filtersTableRows = '';
						for (var j=0; j<uiFilters.length; j+=cols) {
							filtersTableRows += '<tr>';
							for (var k=0; k<cols; ++k) {
								var l = j + k;
								if (l < uiFilters.length) {
									var m = uiFilters[l];
									filtersTableRows += '<td><ul>'+m.filter+'</ul></td><td>'+m.name+'</td><td><ul>'+m.filterN+'</ul></td>';
								} else filtersTableRows += '<td></td><td></td><td></td>';
							}
							filtersTableRows += '</tr>';
						}
						//向页面添加过滤器表格
						document.getElementById('J_filter').insertAdjacentHTML('beforeend',
							'<div id="moreFiltersPanel" class="filter" style="display:none;">'+
								'<table class="f-feature" style="float:none;">'+filtersTableRows+'</table>'+
								'<hr>'+
								'<div id="regFilter">'+
									'<div style="flex-grow:1;">'+
										'<a target="_blank" href="https://www.bilibili.com/video/av15760606" style="color:transparent;text-shadow:transparent 0 0 0!important;">国际通用手势教程</a>'+
										'</div>'+
									'<div style="flex-grow:1;">'+
										'<label for="goodsPattern" title="过滤商品名【包含指定字串】或【匹配指定正则表达式】的商品">商品名匹配规则：</label><input id="goodsPattern" class="txt" type=text title="键入【回车】或点击【手动更新过滤结果】以应用商品名匹配规则"></input>'+
										'<input class="ckbox" id="useRegex" type="checkbox"><label for="useRegex" title="'+
											'普通模式：\n'+
											'支持搜索多个值，以反引号【`】分隔值列表，\n'+
											'值列表以反引号开头采用同时命中规则（AND），\n'+
											'否则采用任一命中规则（OR）\n'+
											'\n'+
											'正则模式：【程序猿＆攻城狮专用 ◕◡◕✧】\n'+
											'支持 js 正则语法(正斜线分隔)\n'+
											'非正则语法的情况下默认追加 igm 标志'+
											'">正则</label>'+
										'<input class="ckbox" id="highlightGoodsPattern" type="checkbox"><label for="highlightGoodsPattern">高亮</label>'+
										'</div>'+
									'<div style="flex-grow:1;">'+
										'<a target="_blank" href="https://www.bilibili.com/video/av17978378" style="color:transparent;text-shadow:transparent 0 0 0!important;">脸控福利</a>'+
										'</div>'+
									'</div>'+
								'<hr>'+
								'<div id="actionBar">'+
									'<a id="allFiltersReset" class="btn btn-default" href="javascript:;">重置全部过滤器</a>'+
									'<a id="moreFiltersReset" class="btn btn-default" href="javascript:;">重置下级过滤器</a>'+
									'<a id="highlightFilters" class="btn btn-default" href="javascript:;">提醒一下？</a>'+
									'<a id="refreshCount" class="btn btn-default" href="javascript:;" title="'+
										'一般情况下过滤结果都是正确的，但是不排除因为\n'+
										'网络/缓存以及插件本身的 bug 等问题而可能导致\n'+
										'过滤结果不准确或者出现各种莫名其妙的错误，\n'+
										'此时可尝试手动更新过滤结果。'+
										'">手动更新过滤结果</a>'+
									'<div style="flex-grow:1;">'+
										'<div style="display:none;">'+
											'<i class="info"></i><label id="infoLog"></label>'+
											'</div>'+
										'</div>'+
									'<select id="goodsFilterMode">'+
										'<option value="0" selected>淡化</option>'+
										'<option value="1">隐藏</option>'+
										'<option value="2">边框</option>'+
										'<option value="3">黑白</option>'+
										'<option value="4">转色</option>'+
										'<option value="5">异端通通烧死</option>'+
										'<option value="6">模糊</option>'+
										'<option value="7">反色</option>'+
										'<option value="8">暗刻</option>'+
										'</select>'+
									'<div>'+
										'<input id="filteredToLast" class="ckbox" type="checkbox"><label for="filteredToLast" title="o(*￣3￣)o 过滤掉的商品扔到后面去">后排</label>'+
										'<input id="noAnimate" class="ckbox" type="checkbox"><label for="noAnimate" title="囧rz">老爷机不要动画！</label>'+
										'</div>'+
									'<a id="showSettings" class="btn-icon" href="javascript:;" title="一个神秘的按钮……'+
										'\n\n按钮背面刻着一串放荡不羁的狂草，'+
										'\n经过漫漫五千年的悠久岁月，'+
										'\n字迹已经被风化得几乎看不清楚：'+
										'\n【欲点此钮，后果自负 ◕◡◕✧】"><i></i></a>'+
									'</div>'+
								'</div>'
						);
						//保存控件引用
						unsafeWindow.y$.divMoreFiltersPanel = $(document.getElementById('moreFiltersPanel'));
						unsafeWindow.y$.inputGoodsPattern = $(document.getElementById('goodsPattern'));
						unsafeWindow.y$.checkboxUseRegex = $(document.getElementById('useRegex'));
						unsafeWindow.y$.checkboxHighlightGoodsPattern = $(document.getElementById('highlightGoodsPattern'));
						unsafeWindow.y$.aAllFiltersReset = $(document.getElementById('allFiltersReset'));
						unsafeWindow.y$.aMoreFiltersReset = $(document.getElementById('moreFiltersReset'));
						unsafeWindow.y$.aHighlightFilters = $(document.getElementById('highlightFilters'));
						unsafeWindow.y$.aRefreshCount = $(document.getElementById('refreshCount'));
						unsafeWindow.y$.labelInfoLog = $(document.getElementById('infoLog'));
						unsafeWindow.y$.selectGoodsFilterMode = $(document.getElementById('goodsFilterMode'));
						unsafeWindow.y$.checkboxFilteredToLast = $(document.getElementById('filteredToLast'));
						unsafeWindow.y$.checkboxNoAnimate = $(document.getElementById('noAnimate'));
						unsafeWindow.y$.aShowSettings = $(document.getElementById('showSettings'));
						//安装下级过滤器响应函数
						installFilterClickHandler(1);
						//显示下级过滤器面板之前更新计数
						applyGoodsFilters(true); //更新下级过滤器面板计数
						//正则模式
						var inputGoodsPattern = unsafeWindow.y$.inputGoodsPattern;
						if (unsafeWindow.x$.goodsPattern) inputGoodsPattern.val(unsafeWindow.x$.goodsPattern);
						inputGoodsPattern.change(function() {setTimeout(updateGoodsPattern, 0);});
						inputGoodsPattern.blur(function() {setTimeout(updateGoodsPattern, 0);});
						inputGoodsPattern.keypress(function(e) {
							if (e.keyCode === 13) {
								updateInfoLog('计算中……');
								unsafeWindow.y$.inputGoodsPattern.prop('disabled', true);
								setTimeout(function() {
									updateGoodsPattern();
									applyGoodsFilters();
									unsafeWindow.y$.inputGoodsPattern.prop('disabled', false);
									updateInfoLog('');
								}, 0);
							}
						});
						//设置checkbox【正则匹配】值和响应函数
						if (unsafeWindow.x$.useRegexChecked) unsafeWindow.y$.checkboxUseRegex.prop('checked', true);
						unsafeWindow.y$.checkboxUseRegex.change(function() {
							setTimeout(function() {
								if (unsafeWindow.y$.checkboxUseRegex[0].checked) {
									unsafeWindow.x$.useRegexChecked = true; //操作更新
									GM_setValue('商品名匹配正则', true);
								} else {
									delete unsafeWindow.x$.useRegexChecked;
									GM_deleteValue('商品名匹配正则');
								}
								updateGoodsPattern(true);
								applyGoodsFilters();
							}, 0);
						});
						//设置checkbox【高亮匹配】值和响应函数
						if (unsafeWindow.x$.highlightGoodsPattern) unsafeWindow.y$.checkboxHighlightGoodsPattern.prop('checked', true);
						unsafeWindow.y$.checkboxHighlightGoodsPattern.change(function() {
							setTimeout(function() {
								if (unsafeWindow.y$.checkboxHighlightGoodsPattern[0].checked) {
									unsafeWindow.x$.highlightGoodsPattern = true; //操作更新
									GM_deleteValue('商品名匹配不高亮');
								} else {
									delete unsafeWindow.x$.highlightGoodsPattern;
									GM_setValue('商品名匹配不高亮', true);
								}
								applyGoodsFilters();
							}, 0);
						});
						//【重置全部过滤器】按钮响应函数
						unsafeWindow.y$.aAllFiltersReset.click(function() {
							resetGoodsFilters(true);
						});
						//【重置下级过滤器】按钮响应函数
						unsafeWindow.y$.aMoreFiltersReset.click(function() {
							resetGoodsFilters(false);
						});
						//【提醒】按钮响应函数
						unsafeWindow.y$.aHighlightFilters.click(function() {
							var filters = $('#moreFiltersPanel td:has(a[filterId])'); //querySelectorAll 不支持 :has
							var aside = filters.filter(':has(a.selected)');
							var bside = filters.not(':has(a.selected)');
							if (aside.length === 0 || bside.length === 0) return;
							filters.finish();
							(aside.length < bside.length ? aside : bside)
								.animate({backgroundColor:'#0cf'}, 100)
								.animate({backgroundColor:'rgba(0,204,255,0)'}, 5000, function() {
									this.removeAttribute('style');
								});
						});
						//【手动更新过滤结果】按钮响应函数
						unsafeWindow.y$.aRefreshCount.click(function() {
							updateInfoLog('计算中……');
							unsafeWindow.y$.aRefreshCount.prop('disabled', true);
							setTimeout(function() {
								saveStates();
								var t = Date.now();
								var updated = applyGoodsFilters(); //【手动更新过滤结果】按钮响应
								t = Date.now() - t;
								var aTag = unsafeWindow.y$.aRefreshCount;
								var title0 = aTag.attr('title0');
								if (title0 === undefined) {
									title0 = aTag.attr('title');
									aTag.attr('title0', title0);
								}
								var log = '上次计算耗时 '+t/1000+' 秒，'+(updated>0?('更新了 '+updated+' 项数据'):'没有需要更新的数据');
								aTag.attr('title', title0+'\n【'+log+'】');
								aTag.prop('disabled', false);
								updateInfoLog('');
							}, 30);
						});
						//设置infoLog的信息
						updateInfoLog(); //根据预设变量显示/隐藏infoLog
						//设置select值和响应函数
						unsafeWindow.y$.selectGoodsFilterMode.val(unsafeWindow.x$.goodsFilterModeIndex).change(function() {
							unsafeWindow.z$.goodsFilterModeNew = parseInt(event.currentTarget.value);
							if (unsafeWindow.z$.goodsFilterModeNew === unsafeWindow.x$.goodsFilterModeIndex) {
								delete unsafeWindow.z$.goodsFilterModeNew;
							} else setTimeout(function() {
								if (unsafeWindow.z$.goodsFilterModeNew === undefined) return;
								//改变当前过滤商品的样式
								var ca = unsafeWindow.x$.filterModes[unsafeWindow.z$.goodsFilterModeNew];
								var cr = unsafeWindow.x$.goodsFilterModeClass;
								document.querySelectorAll('li.gl-item.'+unsafeWindow.x$.goodsFilterModeClass).forEach(function(e) {
									e.classList.add(ca);
									e.classList.remove(cr);
								});
								//保存设置
								if (unsafeWindow.z$.goodsFilterModeNew === 0) GM_deleteValue('过滤方式');
								else GM_setValue('过滤方式', unsafeWindow.z$.goodsFilterModeNew);
								//更新值
								unsafeWindow.x$.goodsFilterModeIndex = unsafeWindow.z$.goodsFilterModeNew; //操作更新
								delete unsafeWindow.z$.goodsFilterModeNew;
								unsafeWindow.x$.goodsFilterModeClass = unsafeWindow.x$.filterModes[unsafeWindow.x$.goodsFilterModeIndex]; //操作更新
							}, 0);
						});
						//设置checkbox【后排】值和响应函数
						if (unsafeWindow.x$.filteredToLastChecked) unsafeWindow.y$.checkboxFilteredToLast.prop('checked', true);
						unsafeWindow.y$.checkboxFilteredToLast.change(function() {
							setTimeout(function() {
								if (unsafeWindow.y$.checkboxFilteredToLast[0].checked) {
									unsafeWindow.x$.filteredToLastChecked = true; //操作更新
									GM_setValue('后排', true);
									reorderGoodsByFilteredState();
								} else {
									delete unsafeWindow.x$.filteredToLastChecked;
									GM_deleteValue('后排');
									reorderGoodsByOriginalOrder();
								}
							}, 0);
						});
						//设置checkbox【关闭动画】值和响应函数
						if (unsafeWindow.x$.noAnimateChecked) unsafeWindow.y$.checkboxNoAnimate.prop('checked', true);
						unsafeWindow.y$.checkboxNoAnimate.change(function() {
							setTimeout(function() {
								if (unsafeWindow.y$.checkboxNoAnimate[0].checked) {
									unsafeWindow.x$.noAnimateChecked = true; //操作更新
									GM_setValue('老爷机不要动画', true);
								} else {
									delete unsafeWindow.x$.noAnimateChecked;
									GM_deleteValue('老爷机不要动画');
								}
							}, 0);
						});
						//神秘按钮
						unsafeWindow.y$.aShowSettings.click(function() {
							setTimeout(CheckSettings, 0);
						});

						//更新正则模式
						function updateGoodsPattern(modeSwitched) {
							var v = unsafeWindow.y$.inputGoodsPattern[0].value;
							var cond = unsafeWindow.x$.goodsPatternCondition;
							var hasPattern = v.length > 0;
							if (hasPattern) {
								if (!modeSwitched && v === unsafeWindow.x$.goodsPattern) return false;
								if (unsafeWindow.x$.useRegexChecked) {
									var rex = ToRegex(v);
									if (rex !== null) {
										cond.textRex = ToRegex(v);
										delete cond.textAny;
										delete cond.textAll;
									} else hasPattern = false;
								} else {
									var txtCond = ToTextCond(v);
									if (txtCond.txts.length > 0) {
										if (txtCond.allMatch) {
											cond.textAll = txtCond.txts;
											delete cond.textAny;
										} else {
											cond.textAny = txtCond.txts;
											delete cond.textAll;
										}
										delete cond.textRex;
									} else hasPattern = false;
								}
							}
							if (hasPattern) {
								unsafeWindow.x$.goodsPattern = v;
								GM_setValue('商品名匹配规则', v);
							} else {
								delete unsafeWindow.x$.goodsPattern;
								delete cond.textAny;
								delete cond.textAll;
								delete cond.textRex;
								GM_deleteValue('商品名匹配规则');
							}
						}
						//重置过滤器
						function resetGoodsFilters(all) {
							setTimeout(function() {
								for (var i=0; i<jdGoodsFilters.length; ++i) {
									var f = jdGoodsFilters[i];
									if (all ? f.level === undefined : f.level !== 1) continue; //重置全部，剔除未启用的；重置下级，剔除不是下级的

									if (!f.checked) {
										f.checked = true;
										GM_deleteValue(f.name);
									}
									if (!f.checkedN) {
										f.checkedN = true;
										GM_deleteValue(f.nameN);
									}
								}
								//结束正在执行的提醒动画
								$('#moreFiltersPanel td:has(a[filterId])').finish(); //querySelectorAll 不支持 :has
								//重置选中状态
								var n = document.querySelectorAll((all?'':'table')+'.f-feature a[filterId]:not(.selected)');
								for (var j=0; j<n.length; ++j) n[j].classList.add('selected');
								applyGoodsFilters(); //重置过滤器
							}, 0);
						}
					}
				}
				//保存设置
				function saveStates(noPanelState, noFiltersStates, noMisc) {
					//保存过滤器面板打开状态
					if (!noPanelState) {
						saveBoolIfDiff(unsafeWindow.y$.aShowMoreFiltersPanel.hasClass('opened'), '打开下级过滤器面板');
					}
					//保存过滤器状态
					if (!noFiltersStates) {
						for (var i=0; i<jdGoodsFilters.length; ++i) {
							var f = jdGoodsFilters[i];
							var sname = 'level'+f.name;
							if (GM_getValue(sname) !== f.level) {
								if (f.level !== undefined) GM_setValue(sname, f.level);
								else GM_deleteValue(sname);
							}
							if (GM_getValue(f.name)) {
								if (f.checked) GM_deleteValue(f.name);
							} else if (!f.checked) GM_setValue(f.name, true);
							if (GM_getValue(f.nameN)) {
								if (f.checkedN) GM_deleteValue(f.nameN);
							} else if (!f.checkedN) GM_setValue(f.nameN, true);
						}
					}
					//保存其他设置
					if (!noMisc) {
						//过滤方式
						saveIntIfDiff(unsafeWindow.x$.goodsFilterModeIndex, '过滤方式', true);
						//过滤掉的商品扔到后面去
						saveBoolIfDiff(unsafeWindow.x$.filteredToLastChecked, '后排');
						//关闭动画
						saveBoolIfDiff(unsafeWindow.x$.noAnimateChecked, '老爷机不要动画');
					}
					function saveIntIfDiff(i, gm_name, undefMeansZero) {
						var val = GM_getValue(gm_name);
						if (undefMeansZero) {
							if (val === undefined) val = 0;
							if (val !== i) {
								if (val === 0) GM_deleteValue(gm_name);
								else GM_setValue(gm_name, i);
							}
						} else if (val !== i) GM_setValue(gm_name, i);
					}
					function saveBoolIfDiff(b, gm_name) {
						if (GM_getValue(gm_name)) {
							if (!b) GM_deleteValue(gm_name);
						} else if (b) GM_setValue(gm_name, true);
					}
				}
			}
		}
		//更新【下级过滤器】的提示和过滤器计数蓝点
		function updateUsingMoreFiltersCount() {
			var moreFiltersTitle = '';
			var moreFiltersCount = 0;
			for (var i=0; i<jdGoodsFilters.length; ++i) {
				var f = jdGoodsFilters[i];
				if (f.level !== 1) continue; //剔除不是下级的

				if (f.checked === f.checkedN) {
					if (f.checked) continue;
					moreFiltersTitle += '\n同时隐藏了【'+f.name+'】和【'+f.nameN+'】商品所以你啥也看不见了 囧rz';
					moreFiltersCount += 2;
				} else {
					moreFiltersTitle += '\n隐藏【'+(f.checked ? f.nameN : f.name)+'】商品 '+
						(f.checked ?
							(f.goodsCountFilteredN === f.goodsCountN ?
								(f.goodsCountN === 0 ? '' : parentheses(f.goodsCountN)) :
								parentheses(f.goodsCountFilteredN+'/'+f.goodsCountN)) :
							(f.goodsCountFiltered === f.goodsCount ?
								(f.goodsCount === 0 ? '' : parentheses(f.goodsCount)) :
								parentheses(f.goodsCountFiltered+'/'+f.goodsCount)));
					++moreFiltersCount;
				}
			}
			var aShowMoreFiltersPanel = unsafeWindow.y$.aShowMoreFiltersPanel;
			var spanMoreFiltersCount = unsafeWindow.y$.spanMoreFiltersCount;
			if (moreFiltersCount > 0) {
				aShowMoreFiltersPanel.attr('title', '当前下级过滤器（'+moreFiltersCount+'）：'+moreFiltersTitle);
				spanMoreFiltersCount.text(moreFiltersCount);
				if (spanMoreFiltersCount.hasClass('zeroFiltersCount')) spanMoreFiltersCount.removeClass('zeroFiltersCount');
			} else {
				aShowMoreFiltersPanel.attr('title', '当前下级过滤器：无');
				spanMoreFiltersCount.text(0);
				if (!spanMoreFiltersCount.hasClass('zeroFiltersCount')) spanMoreFiltersCount.addClass('zeroFiltersCount');
			}
			return spanMoreFiltersCount;
		}
		//更新【状态栏】
		function updateInfoLog(log) {
			//将传入 log 和 unsafeWindow.x$.infoLogText 同步
			if (undefined === log) {
				log = unsafeWindow.x$.infoLogText;
			} else {
				if (log.length) unsafeWindow.x$.infoLogText = log;
				else delete unsafeWindow.x$.infoLogText;
			}
			//根据 log 的值操作 labelInfoLog
			var labelInfoLog = unsafeWindow.y$.labelInfoLog;
			if (labelInfoLog) {
				if (undefined === log || !log.length) labelInfoLog.parent().css('display', 'none');
				else labelInfoLog.text(log).parent().css('display', '');
			}
		}
		//应用过滤器，计算商品数量
		function applyGoodsFilters(setCountOnly) {
			var allGoods = document.querySelectorAll('li.gl-item');
			//计算商品属性
			calcGoodsProperties();
			//逐个更新过滤器
			var updatedCount = 0;
			for (var i=0; i<jdGoodsFilters.length; ++i) {
				var f = jdGoodsFilters[i];
				if (f.level === undefined) continue; //剔除未启用的
				//计算计数
				var goodsCount = getGoodsCount(f);
				var goodsCountN = allGoods.length - goodsCount;
				var filteredCount = getGoodsCountFiltered(f);
				//更新左侧过滤器
				var updated = updatedCount;
				if (f.goodsCount !== goodsCount) {
					f.goodsCount = goodsCount;
					++updatedCount;
				}
				if (f.goodsCountFiltered !== filteredCount[0]) {
					f.goodsCountFiltered = filteredCount[0];
					++updatedCount;
				}
				if (updatedCount > updated) {
					if (f.aFilter) updateFilterCount(f);
					updated = updatedCount;
				} else if (f.created) updateFilterCount(f);
				//更新右侧过滤器
				if (f.goodsCountN !== goodsCountN) {
					f.goodsCountN = goodsCountN;
					++updatedCount;
				}
				if (f.goodsCountFilteredN !== filteredCount[1]) {
					f.goodsCountFilteredN = filteredCount[1];
					++updatedCount;
				}
				if (updatedCount > updated) {
					if (f.aFilterN) updateFilterNCount(f);
				} else if (f.created) updateFilterNCount(f);
				//删除初始化标志
				if (f.created) delete f.created;
			}
			//更新【下级过滤器】的提示
			updateUsingMoreFiltersCount();
			//执行过滤器
			if (!setCountOnly) applyFilters();

			//返回更新的数据计数
			return updatedCount;

			function calcGoodsProperties() {
				for (var i=0; i<allGoods.length; ++i) {
					var g = allGoods[i];
					for (var j=0; j<jdGoodsFilters.length; ++j) {
						var f = jdGoodsFilters[j];
						if (f.level === undefined) continue; //剔除未启用的

						if (hitFilter(g, f)) g[f.name] = true;
						else delete g[f.name];
					}
				}
				function hitFilter(elem, filter) {
					for (var i=0; i<filter.conditions.length; ++i) {
						var cond = filter.conditions[i];
						if (goodsFilterMap[cond.type](elem, cond) ^ (cond.not !== undefined)) return true;
					}
					return false;
				}
			}
			function getGoodsCount(filter) {
				var count = 0;
				for (var i=0; i<allGoods.length; ++i) {
					if (allGoods[i][filter.name]) ++count;
				}
				return count;
			}
			function getGoodsCountFiltered(filter) {
				var filteredGoods = [];
				fg: for (var i=0; i<allGoods.length; ++i) {
					var g = allGoods[i];
					for (var j=0; j<jdGoodsFilters.length; ++j) {
						var f = jdGoodsFilters[j];
						if (f.level === undefined) continue; //剔除未启用的
						if (filter === f) continue; //剔除正在计数的

						if (f.checked === f.checkedN) {
							if (f.checked) continue; //忽略正反都显示的过滤器
							return [0, 0]; //有正反都不显示的过滤器，直接返回 0
						}

						if (g[f.name] ? f.checked : f.checkedN) continue; //测试通过

						continue fg;
					}
					filteredGoods.push(g);
				}
				var count = 0;
				for (var k=0; k<filteredGoods.length; ++k) {
					if (filteredGoods[k][filter.name]) ++count;
				}
				return [count, filteredGoods.length - count];
			}
			function updateFilterCount(filter) {
				filter.spanFilterCount.textContent = filter.goodsCountFiltered===filter.goodsCount ? filter.goodsCount : filter.goodsCountFiltered+'/'+filter.goodsCount;
				if (filter.goodsCountFiltered === 0) filter.aFilter.classList.add('zeroCountGoods');
				else filter.aFilter.classList.remove('zeroCountGoods');
			}
			function updateFilterNCount(filter) {
				filter.spanFilterNCount.textContent = filter.goodsCountFilteredN===filter.goodsCountN ? filter.goodsCountN : filter.goodsCountFilteredN+'/'+filter.goodsCountN;
				if (filter.goodsCountFilteredN === 0) filter.aFilterN.classList.add('zeroCountGoods');
				else filter.aFilterN.classList.remove('zeroCountGoods');
			}
			function applyFilters() {
				var inGoods = [];
				var outGoods = [];
				fg: for (var i=0; i<allGoods.length; ++i) {
					var g = allGoods[i];
					for (var j=0; j<jdGoodsFilters.length; ++j) {
						var f = jdGoodsFilters[j];
						if (f.level === undefined) continue; //剔除未启用的

						if (g[f.name]) {
							if (f.onPassed) f.onPassed(g);
						} else {
							if (f.onMissed) f.onMissed(g);
						}

						if (f.checked === f.checkedN) {
							if (f.checked) continue; //忽略正反都显示的过滤器
							var cf = unsafeWindow.x$.goodsFilterModeClass;
							for (var k=0; k<allGoods.length; ++k) allGoods[k].classList.add(cf); //正反都隐藏
							return;
						}

						if (g[f.name] ? f.checked : f.checkedN) continue; //测试通过
						//测试失败
						outGoods.push(g);
						continue fg;
					}
					inGoods.push(g);
				}
				var c = unsafeWindow.x$.goodsFilterModeClass;
				if (inGoods.length > 0) for (var l=0; l<inGoods.length; ++l) inGoods[l].classList.remove(c);
				if (outGoods.length > 0) for (var m=0; m<outGoods.length; ++m) outGoods[m].classList.add(c);
				if (unsafeWindow.x$.filteredToLastChecked) reorderGoodsByFilteredState(allGoods);
			}
		}
		//重排商品
		function reorderGoodsByFilteredState(allGoods) {
			if (undefined === allGoods) allGoods = document.querySelectorAll('li.gl-item');
			groupGoods(allGoods, function(x,y) {
				var xx = x.classList.contains(unsafeWindow.x$.goodsFilterModeClass);
				var yy = y.classList.contains(unsafeWindow.x$.goodsFilterModeClass);
				return xx === yy ? x.sortOrder-y.sortOrder : (xx?1:-1);
			});
		}
		function reorderGoodsByOriginalOrder(allGoods) {
			if (undefined === allGoods) allGoods = document.querySelectorAll('li.gl-item');
			groupGoods(allGoods, function(x,y) {
				return x.sortOrder-y.sortOrder;
			});
		}
		//将商品分组并记录原始顺序，然后对商品重新排序
		function groupGoods(allGoods, sortBy) {
			if (allGoods && allGoods.length) {
				var grouped = [];
				//分组
				for (var i=0; i<allGoods.length; ++i) {
					var goods = allGoods[i];
					var parent = goods.parentElement;
					var current = undefined;
					for (var j=0; j<grouped.length; ++j) {
						if (grouped[j].parent === parent) {
							current = grouped[j];
							break;
						}
					}
					if (!current) grouped.push(current = {parent: parent, goods:[]});
					//记录原始顺序
					if (undefined === goods.sortOrder) goods.sortOrder = current.goods.length;
					current.goods.push(goods);
				}
				//对每组商品单独排序
				for (var k=0; k<grouped.length; ++k) {
					var group = grouped[k];
					group.goods.sort(sortBy);
					$(group.parent).append(group.goods);
				}
			}
		}
		//加载所有商品
		function loadAllGoods() {
			if (unsafeWindow.SEARCH !== undefined && unsafeWindow.SEARCH.scroll !== undefined) {
				unsafeWindow.SEARCH.scroll();
				setTimeout(waitAllGoods, timerFreq);
			} else setTimeout(loadAllGoods, timerFreq);
			//等待所有商品加载完成
			function waitAllGoods() {
				if (unsafeWindow.SEARCH.loading) setTimeout(waitAllGoods, timerFreq);
				else processGoodsList();
			}
			//收尾处理
			function processGoodsList() {
				if (document.querySelectorAll('li.gl-item').length) {
					var noResultNotice = document.querySelector('div.notice-filter-noresult');
					if (noResultNotice) noResultNotice.remove();
				}
				forceLoadLazyImgs();
				applyGoodsFiltersOnLoaded();
				//取消图片延迟加载
				function forceLoadLazyImgs() {
					unsafeWindow.z$.forceLoadLazyImgsCount = 0;
					unsafeWindow.z$.forceLoadLazyImgsInterval = setInterval(function() {
						if (unsafeWindow.z$.forceLoadLazyImgsCount++ < 3) {
							var aName = 'data-lazy-img';
							document.querySelectorAll('ul.gl-warp img[data-lazy-img]:not([src])').forEach(function(img) {
								img.setAttribute('src', img.getAttribute(aName));
								img.removeAttribute(aName);
							});
							return;
						}
						if (unsafeWindow.z$.forceLoadLazyImgsInterval) {
							clearInterval(unsafeWindow.z$.forceLoadLazyImgsInterval);
							delete unsafeWindow.z$.forceLoadLazyImgsInterval;
						}
					}, 2000);
				}
				//延时应用过滤器
				function applyGoodsFiltersOnLoaded() {
					//每秒执行一次，前2次仅更新计数，15次后由 applyGoodsFiltersOnAjaxStop 接管，并计划一个10秒后的更新
					unsafeWindow.z$.applyGoodsFiltersOnLoadedCount = 0;
					unsafeWindow.z$.applyGoodsFiltersOnLoadedCountInterval = setInterval(function() {
						if (unsafeWindow.z$.applyGoodsFiltersOnLoadedCount < 15) {
							applyGoodsFilters(unsafeWindow.z$.applyGoodsFiltersOnLoadedCount++ < 2); //延迟收尾
							if (unsafeWindow.z$.applyGoodsFiltersOnLoadedCount === 3) updateInfoLog('');
							return;
						}
						if (unsafeWindow.z$.applyGoodsFiltersOnLoadedCountInterval) {
							clearInterval(unsafeWindow.z$.applyGoodsFiltersOnLoadedCountInterval);
							delete unsafeWindow.z$.applyGoodsFiltersOnLoadedCountInterval;
							setTimeout(applyGoodsFilters, 1000 * 10);
							applyGoodsFiltersOnAjaxStop();
						}
					}, 1000);
				}
				//ajaxStop收尾
				function applyGoodsFiltersOnAjaxStop() {
					//开始计时
					unsafeWindow.z$.goodsLoadedTime = Date.now();
					//注册 ajaxStop 事件
					unsafeWindow.$(document).ajaxStop(function() {
						var t = Date.now() - unsafeWindow.z$.goodsLoadedTime;
						if (t > 1000 * 15) return; //15秒之后不再响应该事件
						//console.log('ajaxStop -> '+t+'ms');

						//对挂起的操作重新计时（清除已有的并重新挂起一个新的延时操作）
						if (unsafeWindow.z$.applyGoodsFiltersTimeout !== undefined) {
							clearTimeout(unsafeWindow.z$.applyGoodsFiltersTimeout);
							delete unsafeWindow.z$.applyGoodsFiltersTimeout;
						}
						unsafeWindow.z$.applyGoodsFiltersTimeout = setTimeout(function() {
							delete unsafeWindow.z$.applyGoodsFiltersTimeout;
							applyGoodsFilters(); //ajaxStop 延时操作
						}, 33);
					});
				}
			}
		}
	}
	//检查保存数据的版本信息
	function CheckSettings(versionCheck) {
		var version = 50102; //每个子版本号占2位 //GM_info.script.version //用GM_info会使每个小版本更新都强行重置所有保存的设置
		if (versionCheck && GM_getValue('插件版本') >= version) return;
		var vals = GM_listValues();
		for (var i=0; i<vals.length; ++i) GM_deleteValue(vals[i]);
		GM_setValue('插件版本', version);
	}

	//圆括号包围字串
	function parentheses(str){return surround(str,'(',')');}
	function surround(str, prefix, suffix){return prefix+str+suffix;}
	//字串检测
	function isAny(str, vals) { //str∈vals
		for (var i=0; i<vals.length; ++i) {
			if (str === vals[i]) return true;
		}
		return false;
	}
	function includesAny(str, vals) { //∃v∈vals，str⊇v
		for (var i=0; i<vals.length; ++i) {
			if (str.includes(vals[i])) return true;
		}
		return false;
	}
	function includesAll(str, vals) { //∀v∈vals，str⊇v
		for (var i=0; i<vals.length; ++i) {
			if (!str.includes(vals[i])) return false;
		}
		return true;
	}
	//字串转 RegExp
	function ToRegex(str) {
		if (str[0] === '/') {
			try {
				var r = eval(str);
				if (r instanceof RegExp) return new RegExp(r); //重新调用一次 RegExp 对字面量进行优化
			} catch(e) {}
		}
		try { return new RegExp(str, 'gim'); } catch(e) {}
		return null;
	}
	//字串转匹配规则，去掉空白串
	function ToTextCond(str) {
		var allMatch = str[0] === '`';
		var vals = str.split('`');
		var txts = [];
		for (var i=allMatch?1:0; i<vals.length; ++i) {
			var txt = vals[i];
			if (txt.length > 0 && (txt = txt.trim()).length > 0) txts.push(txt);
		}
		return {allMatch:allMatch, txts:txts};
	}
	//高亮 HTML (Regex)
	function highlightHtmlUsingRegex(html, rex, hlInfo) {
		var i=0;
		rex.lastIndex = 0;
		html = html.replace(rex, function(m) {
			return m.length > 0 ? hlInfo.tag0[i++%9]+m+hlInfo.tag1 : '';
		});
		return i>0 ? html : null;
	}
	//高亮 HTML (string[])
	function highlightHtmlUsingTexts(html, txts, hlInfo) {
		if (txts.length === 0) return null;
		for (var i=0; i<txts.length; ++i) {
			var txt = txts[i];
			if (html.includes(txt)) html = html.replace(txt, hlInfo.tag0[i%9]+txt+hlInfo.tag1);
		}
		return html;
	}
	//高亮 HTML
	function highlightHtml(html, match, hlInfo) {
		return match instanceof RegExp ? highlightHtmlUsingRegex(html, match, hlInfo) : highlightHtmlUsingTexts(html, match, hlInfo);
	}
	//替换高亮 HTML
	function replaceHighlightHtml(html, match, hlMatch, hlInfo) {
		if (match instanceof RegExp) {
			if (hlMatch instanceof RegExp) { //正则替换正则
				if (match.source === hlMatch.source && match.flags === hlMatch.flags) return null; //相等的正则，跳过处理
			}
			html = unhighlightHtml(html, hlInfo);
			html = highlightHtmlUsingRegex(html, match, hlInfo);
		} else {
			if (hlMatch instanceof RegExp) {
				html = unhighlightHtml(html, hlInfo);
				html = highlightHtmlUsingTexts(html, match, hlInfo);
			} else { //数组替换数组
				var hit = false;
				for (var i=0; i<match.length; ++i) {
					var txt = match[i];
					var ti = i%9;
					if (i < hlMatch.length) {
						var hlTxt = hlMatch[i];
						if (txt === hlTxt) continue; //高亮的位置和内容相等，跳过处理
						html = html.replace(hlInfo.tag0[ti]+hlTxt+hlInfo.tag1, hlTxt); //先取消高亮
					}
					html = html.replace(txt, hlInfo.tag0[ti]+txt+hlInfo.tag1); //重新高亮
					hit = true;
				}
				if (match.length < hlMatch.length) {
					for (var j=match.length; j<hlMatch.length; ++j) {
						var hl = hlMatch[j];
						html = html.replace(hlInfo.tag0[j%9]+hl+hlInfo.tag1, hl);
					}
					hit = true;
				}
				return hit ? html : null;
			}
		}
		return html;
	}
	//取消高亮 HTML
	function unhighlightHtml(html, hlInfo) {
		for (var i=0; i<hlInfo.tag0.length; ++i) {
			html = html.replace(hlInfo.tag0[i], '');
		}
		return html.replace(hlInfo.tag1, '');
	}
}());
