// ==UserScript==
// @name        易用云
// @namespace   让易搭云更易用！好用到爆炸！(云生集团-研发专用版)
// @version     0.3.1
// @match       https://web.yidayun.com/*
// @icon        https://www.yidayun.com/images/favicon.png
// @grant       none
// @author       Jack.Chan (971546@qq.com)
// @namespace    http://fulicat.com
// @url          https://greasyfork.org/zh-CN/scripts/480426
// @license MIT
// @description 2025/7/7 13:01:43
// @downloadURL https://update.greasyfork.org/scripts/480426/%E6%98%93%E7%94%A8%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/480426/%E6%98%93%E7%94%A8%E4%BA%91.meta.js
// ==/UserScript==


(function() {

	var VERSION = {
		CODE: '0.3.1',
		TIMESTAMP: 1751864503017
	};
	// new Date().getTime()
	// new Date().toLocaleString('zh-CN', { hour12: false })
	// ((d)=>{console.log(d.getTime(), d.toLocaleString('zh-CN', { hour12: false }));})(new Date());

	// https://raw.githubusercontent.com/zfdang/chinese-lunar-calendar-for-mac/master/WanNianLi/WanNianLi/Resources/vendors/holidays.js
	// Version: 20241112
	// 国务院公布的假期调整方案
	// 一般不需要手工修改此文件，这个文件会在日历自动更新时被新版的内容覆盖
	// 假日为"+"，工作日为"-"
	var HOLIDAYADJUSTMENT = {
		// https://www.gov.cn/zhengce/content/202411/content_6986382.htm
		// 一、元旦：1月1日（周三）放假1天，不调休。
		"20250101": "+",
		// 二、春节：1月28日（农历除夕、周二）至2月4日（农历正月初七、周二）放假调休，共8天。1月26日（周日）、2月8日（周六）上班
		"20250126": "-",
		"20250128": "+",
		"20250129": "+",
		"20250130": "+",
		"20250131": "+",
		"20250201": "+",
		"20250202": "+",
		"20250203": "+",
		"20250204": "+",
		"20250208": "-",
		// 三、清明节：4月4日（周五）至6日（周日）放假，共3天。
		"20250404": "+",
		"20250405": "+",
		"20250406": "+",
		// 四、劳动节：5月1日（周四）至5日（周一）放假调休，共5天。4月27日（周日）上班。
		"20250427": "-",
		"20250501": "+",
		"20250502": "+",
		"20250503": "+",
		"20250504": "+",
		"20250505": "+",
		// 五、端午节：5月31日（周六）至6月2日（周一）放假，共3天。
		"20250531": "+",
		"20250601": "+",
		"20250602": "+",
		// 六、国庆节、中秋节：10月1日（周三）至8日（周三）放假调休，共8天。9月28日（周日）、10月11日（周六）上班。
		"20250928": "-",
		"20251001": "+",
		"20251002": "+",
		"20251003": "+",
		"20251004": "+",
		"20251005": "+",
		"20251006": "+",
		"20251007": "+",
		"20251008": "+",
		"20251011": "-",

		// https://www.gov.cn/zhengce/content/202310/content_6911527.htm
		// 一、元旦：1月1日放假，与周末连休。
		"20240101": "+",
		// 二、春节：2月10日至17日放假调休，共8天。2月4日（星期日）、2月18日（星期日）上班。鼓励各单位结合带薪年休假等制度落实，安排职工在除夕（2月9日）休息。
		"20240204": "-",
		"20240210": "+",
		"20240211": "+",
		"20240212": "+",
		"20240213": "+",
		"20240214": "+",
		"20240215": "+",
		"20240216": "+",
		"20240217": "+",
		"20240218": "-",
		// 三、清明节：4月4日至6日放假调休，共3天。4月7日（星期日）上班。
		"20240404": "+",
		"20240405": "+",
		"20240406": "+",
		"20240407": "-",
		// 四、劳动节：5月1日至5日放假调休，共5天。4月28日（星期日）、5月11日（星期六）上班。
		"20240428": "-",
		"20240501": "+",
		"20240502": "+",
		"20240503": "+",
		"20240504": "+",
		"20240505": "+",
		"20240511": "-",
		// 五、端午节：6月10日放假，与周末连休。
		"20240610": "+",
		// 六、中秋节：9月15日至17日放假调休，共3天。9月14日（星期六）上班。
		"20240914": "-",
		"20240915": "+",
		"20240916": "+",
		"20240917": "+",
		// 七、国庆节：10月1日至7日放假调休，共7天。9月29日（星期日）、10月12日（星期六）上班。
		"20240929": "-",
		"20241001": "+",
		"20241002": "+",
		"20241003": "+",
		"20241004": "+",
		"20241005": "+",
		"20241006": "+",
		"20241007": "+",
		"20241012": "-",

		// http://www.gov.cn/zhengce/content/2022-12/08/content_5730844.htm
		// 一、元旦：2022年12月31日至2023年1月2日放假调休，共3天。
		"20221231": "+",
		"20230101": "+",
		"20230102": "+",
		// 二、春节：1月21日至27日放假调休，共7天。1月28日（星期六）、1月29日（星期日）上班。
		"20230121": "+",
		"20230122": "+",
		"20230123": "+",
		"20230124": "+",
		"20230125": "+",
		"20230126": "+",
		"20230127": "+",
		"20230128": "-",
		"20230129": "-",
		// 三、清明节：4月5日放假，共1天。
		"20230405": "+",
		// 四、劳动节：4月29日至5月3日放假调休，共5天。4月23日（星期日）、5月6日（星期六）上班。
		"20230423": "-",
		"20230429": "+",
		"20230430": "+",
		"20230501": "+",
		"20230502": "+",
		"20230503": "+",
		"20230506": "-",
		// 五、端午节：6月22日至24日放假调休，共3天。6月25日（星期日）上班。
		"20230622": "+",
		"20230623": "+",
		"20230624": "+",
		"20230625": "-",
		// 六、中秋节、国庆节：9月29日至10月6日放假调休，共8天。10月7日（星期六）、10月8日（星期日）上班。
		"20230929": "+",
		"20230930": "+",
		"20231001": "+",
		"20231002": "+",
		"20231003": "+",
		"20231004": "+",
		"20231005": "+",
		"20231006": "+",
		"20231007": "-",
		"20231008": "-",

		// http://www.gov.cn/zhengce/content/2021-10/25/content_5644835.htm
		// 一、元旦：2022年1月1日至3日放假，共3天。
		"20220101": "+",
		"20220102": "+",
		"20220103": "+",
		// 二、春节：1月31日至2月6日放假调休，共7天。1月29日（星期六）、1月30日（星期日）上班。
		"20220129": "-",
		"20220130": "-",
		"20220131": "+",
		"20220201": "+",
		"20220202": "+",
		"20220203": "+",
		"20220204": "+",
		"20220205": "+",
		"20220206": "+",
		// 三、清明节：4月3日至5日放假调休，共3天。4月2日（星期六）上班。
		"20220402": "-",
		"20220403": "+",
		"20220404": "+",
		"20220405": "+",
		// 四、劳动节：4月30日至5月4日放假调休，共5天。4月24日（星期日）、5月7日（星期六）上班。
		"20220424": "-",
		"20220430": "+",
		"20220501": "+",
		"20220502": "+",
		"20220503": "+",
		"20220504": "+",
		"20220507": "-",
		// 五、端午节：6月3日至5日放假，共3天。
		"20220603": "+",
		"20220604": "+",
		"20220605": "+",
		// 六、中秋节：9月10日至12日放假，共3天。
		"20220910": "+",
		"20220911": "+",
		"20220912": "+",
		// 七、国庆节：10月1日至7日放假调休，共7天。10月8日（星期六）、10月9日（星期日）上班。
		"20221001": "+",
		"20221002": "+",
		"20221003": "+",
		"20221004": "+",
		"20221005": "+",
		"20221006": "+",
		"20221007": "+",
		"20221008": "-",
		"20221009": "-",

		// http://www.gov.cn/zhengce/content/2020-11/25/content_5564127.htm
		// 一、元旦：2021年1月1日至3日放假，共3天。
		"20210101": "+",
		"20210102": "+",
		"20210103": "+",
		// 二、春节：2月11日至17日放假调休，共7天。2月7日（星期日）、2月20日（星期六）上班。
		"20210207": "-",
		"20210211": "+",
		"20210212": "+",
		"20210213": "+",
		"20210214": "+",
		"20210215": "+",
		"20210216": "+",
		"20210217": "+",
		"20210220": "-",
		// 三、清明节：4月3日至5日放假调休，共3天。
		"20210405": "+",
		// 四、劳动节：5月1日至5日放假调休，共5天。4月25日（星期日）、5月8日（星期六）上班。
		"20210425": "-",
		"20210501": "+",
		"20210502": "+",
		"20210503": "+",
		"20210504": "+",
		"20210505": "+",
		"20210508": "-",
		// 五、端午节：6月12日至14日放假，共3天。
		"20210614": "+",
		// 六、中秋节：9月19日至21日放假调休，共3天。9月18日（星期六）上班。
		"20210918": "-",
		"20210919": "+",
		"20210920": "+",
		"20210921": "+",
		// 七、国庆节：10月1日至7日放假调休，共7天。9月26日（星期日）、10月9日（星期六）上班。
		"20210926": "-",
		"20211001": "+",
		"20211002": "+",
		"20211003": "+",
		"20211004": "+",
		"20211005": "+",
		"20211006": "+",
		"20211007": "+",
		"20211009": "-",
		// http://www.gov.cn/zhengce/content/2020-01/27/content_5472352.htm
		// 延长2020年春节假期至2月2日（农历正月初九，星期日），2月3日（星期一）起正常上班
		"20200131": "+",
		// 2020年假期调整计划
		// http://www.gov.cn/zhengce/content/2019-11/21/content_5454164.htm
		// 一、元旦：2020年1月1日放假，共1天。
		"20200101": "+",
		// 二、春节：1月24日至30日放假调休，共7天。1月19日（星期日）、2月1日（星期六）上班。
		"20200119": "-",
		"20200124": "+",
		"20200127": "+",
		"20200128": "+",
		"20200129": "+",
		"20200130": "+",
		"20200201": "-",
		// 三、清明节：4月4日至6日放假调休，共3天。
		"20200406": "+",
		// 四、劳动节：5月1日至5日放假调休，共5天。4月26日（星期日）、5月9日（星期六）上班。
		"20200426": "-",
		"20200501": "+",
		"20200504": "+",
		"20200505": "+",
		"20200509": "-",
		// 五、端午节：6月25日至27日放假调休，共3天。6月28日（星期日）上班。
		"20200625": "+",
		"20200626": "+",
		"20200628": "-",
		// 六、国庆节、中秋节：10月1日至8日放假调休，共8天。9月27日（星期日）、10月10日（星期六）上班。
		"20200927": "-",
		"20201001": "+",
		"20201002": "+",
		"20201005": "+",
		"20201006": "+",
		"20201007": "+",
		"20201008": "+",
		"20201010": "-",

	};





	// 忽略注入类型
	if (document.contentType !== 'text/html' || (/\w+\.{1,1}\w+/.test(location.pathname) && !/\w+\.{1,1}html/.test(location.pathname) ) || /\w+\.{2,}\w+/.test(location.pathname) || /^\/(r|preview)\//.test(location.pathname)) {
		console.warn(`不支持在此类型文档中注入，`, document.contentType);
		return false;
	}

	// html类型 + 非iframe嵌套时 清空 body
	if (/\w+\.{1,1}html/.test(location.pathname) && window.top === window) {
		document.body.innerHTML = '';
	}


	// 图标
	const ICONS = {
		close: `
<svg width="16px" height="16px" viewBox="0 0 10 10" version="1.1">
	<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
		<path d="M8.95969723,0.897476866 C9.21843425,1.15582278 9.24028631,1.56159861 9.02504921,1.84484482 L8.96046978,1.91885304 L5.91916574,4.96548241 C5.92235682,5.00422322 5.92243302,5.04317194 5.91939467,5.08192184 L8.95969664,8.1196985 C9.21843396,8.37804412 9.24028649,8.78381992 9.02504971,9.06706638 L8.96047037,9.14107467 C8.70212475,9.399812 8.29634895,9.42166452 8.01310249,9.20642774 L7.9390942,9.1418484 L5.01806209,6.22532901 L2.09858553,9.1418484 L2.02457724,9.20642774 C1.74133078,9.42166452 1.33555498,9.399812 1.07720936,9.14107467 L1.07720936,9.14107467 L1.01263002,9.06706638 C0.797393239,8.78381992 0.819245764,8.37804412 1.07798309,8.1196985 L1.07798309,8.1196985 L4.11828506,5.08192184 C4.1152467,5.04317194 4.11532291,5.00422322 4.11851399,4.96548241 L1.07720994,1.91885304 L1.01263052,1.84484482 C0.797393414,1.56159861 0.819245474,1.15582278 1.0779825,0.897476866 C1.36024108,0.615644961 1.81752677,0.615990848 2.09935867,0.898249425 L2.09935867,0.898249425 L5.01906209,3.82132901 L7.93832106,0.898249425 C8.22015296,0.615990848 8.67743865,0.615644961 8.95969723,0.897476866 Z" fill="currentColor" fill-rule="nonzero"></path>
	</g>
</svg>
`.trim(),
		star: `
<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="svg-icon svg-icon-star">
	<path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path>
</svg>
`.trim(),
		starred: `
<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="svg-icon svg-icon-star-fill svg-icon-starred">
	<path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
</svg>
`.trim(),
		pin: `
<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="svg-icon svg-icon-pin">
	<path d="m11.294.984 3.722 3.722a1.75 1.75 0 0 1-.504 2.826l-1.327.613a3.089 3.089 0 0 0-1.707 2.084l-.584 2.454c-.317 1.332-1.972 1.8-2.94.832L5.75 11.311 1.78 15.28a.749.749 0 1 1-1.06-1.06l3.969-3.97-2.204-2.204c-.968-.968-.5-2.623.832-2.94l2.454-.584a3.08 3.08 0 0 0 2.084-1.707l.613-1.327a1.75 1.75 0 0 1 2.826-.504ZM6.283 9.723l2.732 2.731a.25.25 0 0 0 .42-.119l.584-2.454a4.586 4.586 0 0 1 2.537-3.098l1.328-.613a.25.25 0 0 0 .072-.404l-3.722-3.722a.25.25 0 0 0-.404.072l-.613 1.328a4.584 4.584 0 0 1-3.098 2.537l-2.454.584a.25.25 0 0 0-.119.42l2.731 2.732Z"></path>
</svg>
`.trim(),
		copy: `
<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="svg-icon svg-icon-copy">
	<path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
</svg>
`.trim(),
		check: `
<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" class="svg-icon svg-icon-check">
	<path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
</svg>
`.trim(),
	};


	String.prototype.trimHTML = function() {
		var html = this.trim();
		html = html.replace(/<!--[\s\S]*?-->/g, '');
		// html = html.replace(/>\s+</g, '><');
		html = html.replace(/>\s</g, '><');
		html = html.replace(/>\t</g, '><');
		html = html.replace(/>\n</g, '><');
		html = html.replace(/>\n\t+</g, '><');
		return html;
	}

	const formatDate = (timestamp) => {
		if (timestamp) {
			return new Date(timestamp).toLocaleString();
		}
		return '';
	}

	const copyElementContents = (el) => {
		return new Promise((resolve, reject) => {
			if (!el) {
				return reject(new Error('el not found'));
			}
			if (this.timer_copy) {
				clearTimeout(this.timer_copy);
				this.timer_copy = null;
			}
			var body = document.body, range, sel;
			if (document.createRange && window.getSelection) {
				range = document.createRange();
				sel = window.getSelection();
				sel.removeAllRanges();
				try {
					range.selectNodeContents(el);
					sel.addRange(range);
				} catch (e) {
					range.selectNode(el);
					sel.addRange(range);
				}
			} else if (body.createTextRange) {
				range = body.createTextRange();
				range.moveToElementText(el);
				range.select();
			}
			document.execCommand('Copy');

			this.timer_copy = setTimeout(() => {
				window.getSelection().empty();
				resolve();
			}, 250);
		});
	}

	const renderLinkHref = (data) => {
		const view = {
			type: 'windowAction',
			target: 'tab',
			object: data.object,
			name: (data.title || (data.project + data.name)).substr(0, 50),
			resId: data.resId,
			viewNumber: data.viewNumber,
	  mode: 'readonly',
			// context: { flowFlag: true }
		};
		if (data.context) {
			view.context = data.context;
		}
		return `https://web.yidayun.com/home?view=${ encodeURIComponent(JSON.stringify(view)) }`;
	};

	const renderPlayers = (players) => {
		if (!players) {
			return '';
		}
		try {
			players = JSON.parse(players);
			players = Array.isArray(players) ? players.join('、') : JSON.stringify(players);
		} catch (ex) {
			// console.warn(ex);
		}
		return players;
	};

	const renderField = (value) => {
		// console.log('v:', value);
		if (value === undefined || value === null) {
			value = '';
		}
		if (typeof value === 'string') {
			value = value.trim();
		}
		return value;
	}

	const trimObject = (object) => {
		if (object === undefined || object === null) {
			return '';
		}
		if (typeof object === 'string') {
			return object.trim();
		}
		if (typeof object === 'object') {
			if (Array.isArray(object)) {
				return object.map((item) => {
					return trimObject(item);
				});
			}
			for (var key in object) {
				if (object[key] === undefined || object[key] === null) {
					object[key] = '';
				} else if (typeof object[key] === 'string') {
					object[key] = trimObject(object[key]);
				}
			}
			return object;
		}
		return object;
	}

	const doCopy = (text) => {
		return new Promise((resolve, reject) => {
			if (typeof text !== 'string') {
				return resolve('');
			}
			text = text.trim();
			var $text = document.createElement('textarea');
			$text.setAttribute('readonly', 'readonly');
			$text.style.cssText = 'width: 10px;height: 10px;position: fixed;top:-999px;left:-999px;';
			$text.value = text;
			document.body.appendChild($text);
			$text.select();
			if (this.timer_copy) {
				clearTimeout(this.timer_copy);
				this.timer_copy = null;
			}
			this.timer_copy = setTimeout(() => {
				if (document.execCommand('copy')) {
					resolve(text);
				} else {
					reject(text);
				}
				this.timer_copy = setTimeout(() => {
					this.timer_copy = null;
					document.body.removeChild($text);
				}, 100);
			}, 250);
		});
	}


	// @ request
	const $fetch = (url, data, options) => {
		const baseURL = 'https://web.yidayun.com/api';
		options = { method: 'POST', mode: 'cors', timeout: 30000, credentials: 'omit', baseURL, ...options };
		options.headers = { 'content-type': 'application/json', ...options.headers };
		options.headers['Accept'] = 'application/json, text/plain, */*';
		options.headers['X-Session'] = document.cookie;
		if (data) {
			if (options.method.toUpperCase() === 'GET' || options.method.toUpperCase() === 'HEAD') {
				url+= (url.indexOf('?') > -1 ? '&' : '?') + (new URLSearchParams(data)).toString();
			} else {
				options.body = typeof data === 'object' ? JSON.stringify(data) : data;
			}
		}
		if (typeof options.baseURL == 'string' && options.baseURL.trim().length && /^(http:||https:)?\/\/\w{1,}/i.test(options.baseURL)) {
			url = options.baseURL + url;
		}
		return new Promise((resolve, reject) => {
			fetch(url, options, options.timeout).then((res) => res.json()).then((res) => {
				if (res.errorCode === 0 && res.success) {
					resolve(res);
				} else {
					console.error('[ERR]', url, options, res);
					reject(res);
				}
			}).catch((err) => {
				reject(err);
			});
		});
	}

	// 用户信息
	var USER_INFO = {
		data: {},
		set(data) {
			this.data = data;
		},
		get(key) {
			if(key) {
				return this.data[key];
			}
			return this.data;
		}
	}

	class BTN_SHARE {

		get name() {
			return '分享按钮';
		}

		#root = null;

		#btnClassName = 'y-app-link-btn-share';
		// #btnSelector = '.y-app-link-btn-share';
		#btnSelector = '.'+ this.#btnClassName;

		constructor() {
			console.log(`[OK] 初始化 ${ this.name } ...`);

			this.init();
		}

		getShareLink(params) {
			if (typeof params !== 'object' || !params.objectNumber || !params.dataId) {
				console.warn(`[WARN] 参数错误`, params);
				return Promise.reject('params error');
			}
			return $fetch('/share/getShareLink', {
				context: {},
				params: { objectNumber: params.objectNumber, dataId: params.dataId }
			}).then((res) => {
				console.log('getShareLink:', res.data);
				if (typeof res.data === 'object') {
					params.url = res.data.privateLink || res.data.publicLink || JSON.stringify(res.data);
				} else {
					params.url = res.data;
				}
				return { ...params, ...res.data };
			}).catch((err) => {
				console.warn('[WARN]', err);
				return err;
			});
		}

		inject($el) {
			// $el is current tab
			if (!$el) {
				return;
			}
			if ($el.querySelector(this.#btnSelector)) {
				return console.warn(`[WARN] 已注入 ${ this.name }`);
			}
			$el.$btnShare = this.createBtn($el);
			$el.$btngroup.insertBefore($el.$btnShare, $el.$btngroup.childNodes[0]);

			$el.$btnToSearch = this.createBtnToSearch($el);
			$el.$btngroup.insertBefore($el.$btnToSearch, $el.$btngroup.childNodes[0]);

			$el.dataset.injected = true;
		}

		// 查找目标元素
		findTarget(next) {
			if (!this.$root) {
				return;
			}
			// var $el = this.$root.querySelector('.ant-tabs-tabpane.ant-tabs-tabpane-active.eb-home-tabs-tab.eb-home-tabs-tab-viewForm .eb-view-toolbar-form-head>.ant-space.ant-formily-button-group');
			var $el = this.$root.querySelector('.ant-tabs-tabpane.ant-tabs-tabpane-active.eb-home-tabs-tab.eb-home-tabs-tab-viewForm');
			$el = $el || this.$root.querySelector('.eb-share-form-view');
			if (!$el) {
				if (typeof next === 'function') {
					next($el);
				}
				return false;
			}
			$el.$btngroup = $el.querySelector('.eb-view-toolbar-form-head>.ant-space.ant-formily-button-group');
			if (!$el.$btngroup) {
				if (typeof next === 'function') {
					next($el);
				}
				return false;
			}
			if ($el.querySelector(this.#btnSelector)) {
				console.warn(`[WARN] 已注入 ${ this.name }`);
				return false;
			}

			this.inject($el);
			return $el;
		}

		// 获取当前 tab 信息
		getTabInfo(tabId) {
			if (!tabId) {
				return console.error('[ERR]', `tabId is ${ tabId }`);
			}
			var info = null;
			var tabs = window.sessionStorage.getItem(USER_INFO.get('keyTabs'));
			try {
				tabs = JSON.parse(tabs);
				if (tabs && tabs.length) {
					tabs = tabs.filter((item) => item.id === tabId);
					if (tabs.length) {
						info = tabs[0];
					}
				}
			} catch (ex) {
				console.error(ex);
			}
			return info;
		}

		// 获取详情页字段信息
		getDetailfields($el) {
			var fields = {};
			// $el is current tab
			if (!$el) {
				return fields;
			}
			var $gridItems = $el.querySelectorAll('.ant-formily-grid-layout>.ant-formily-item');
			$gridItems.forEach((item) => {
				var text = item.innerText.replace(/\n/g, '');
				if (text.startsWith('标题:') || text.startsWith('需求标题:') || text.startsWith('缺陷标题:') || text.startsWith('部门任务名称:') || text.startsWith('研发任务名称:')) {
					// console.log('标题 item', item);
					fields.title = text.split(':').pop();
				}
				if (text.startsWith('所属项目:')) {
					fields.project = text.split(':').pop();
				}
			});
			return fields;
		}

		createBtn($el) {
			// $el is current tab
			if (!$el) {
				return;
			}
			var $btn = document.createElement('div');
			$btn.className = 'ant-space-item';
			$btn.innerHTML = `<a class="${ this.#btnClassName }" target="_blank" rel="opener" href="javascript:void(0)" title="复制分享链接">分享</a>`;
			$btn.$link = $btn.querySelector(this.#btnSelector);
			$btn.$link.addEventListener('click', this.onBtnClick($el));
			return $btn;
		}

		createBtnToSearch($el) {
			// $el is current tab
			if (!$el) {
				return;
			}
			const data = this.getDetailfields($el);
			// console.log('createBtnToSearch.data', data);
			var $btn = document.createElement('div');
			$btn.className = 'ant-space-item';
			$btn.innerHTML = `<a class="${ this.#btnClassName }" target="_top" rel="opener" href="/home.html#/search?keyword=${ encodeURIComponent(data.title) }" title="快速搜索">&nbsp;&nbsp;&nbsp;#&nbsp;&nbsp;&nbsp;</a>`;
			$btn.$link = $btn.querySelector(this.#btnSelector);
			$btn.$link.addEventListener('click', () => {
				window.top.$Y.search(data.title);
			});
			return $btn;
		}

		doCopy(event, data) {
			doCopy(`${ (data.project ? `【${ data.project }】 ` : '') }${ data.title } \n${ data.url }`).then(() => {
				event.target.innerText = '复制成功';
			}).finally(() => {
				setTimeout(() => {
					event.target.innerText = '分享';
				}, 3000);
			});
		}

		onBtnClick($el) {

			let data = null;
			let loading = false;
			let canShare = true;

			return (event) => {
				event.stopPropagation();
				if (!event.ctrlKey || event.target.getAttribute('href').includes('javascript:void(0)') || data) {
					event.preventDefault();

					// console.log('data:', data);
					if (data && data.url) {
						return this.doCopy(event, data);
					}

					// 分享详情页
					if ($el.classList.contains('eb-share-form-view')) {
						data = this.getDetailfields($el);

						/*if (data.title && window.parent.$Y && window.parent.$Y.$app && window.parent.$Y.$app.$search) {
							window.parent.$Y.$app.$search.$keyword.value = data.title;
						}
						*/
						if (window.location.hash.startsWith('#/share/form?number=')) {
							data.url = location.hash.substr(1);
						}
						if ((window.location.pathname + window.location.search).startsWith('/share/form?number=')) {
							data.url = window.location.pathname + window.location.search;
						}
						if (data.url) {
							data.url = data.url.split('&callback')[0];
						}
						if (data.url) {
							data.url = `https://web.yidayun.com${ data.url }`;
							event.target.setAttribute('href', data.url);
							// console.log('share.data:', data);
							this.doCopy(event, data);
							return false;
						}
						// console.log('share.data:', data);
						canShare = false;
						event.target.innerText = '无法分享';
						event.target.title = '解析异常了';
						return false;
					}

					// 详情页
					if (!canShare || loading) {
						return false;
					}
					var tabId = $el.id.split('-panel-').pop();
					if (!tabId) {
						return console.warn(`找不到 对应的 tabId`, tabId);
					}
					var tabInfo = this.getTabInfo(tabId);
					if (!tabInfo) {
						return console.warn(`找不到 对应的 tab`, tabId, tabInfo);
					}
					data = this.getDetailfields($el);
					// console.log('share.data:', data);

					// 请求数据
					event.target.innerText = '获取中...';
					this.getShareLink({objectNumber: tabInfo.object, dataId: tabInfo.resId}).then((res) => {
						data = { ...data, ...res };
						// console.log('data:', data);
						if (data.url) {
							event.target.setAttribute('href', data.url);
							this.doCopy(event, data);
						} else {
							canShare = false;
							event.target.innerText = '无法分享';
							event.target.title = '易搭云不支持';
						}
					}).finally(() => {
						loading = false;
					});
					return false;
				}
			}
		}

		watchEvents() {

			const findEl = () => {
				if (this.timer_finder) {
					clearTimeout(this.timer_finder);
					this.timer_finder = null;
				}
				this.timer_finder = setTimeout(() => {
					this.findTarget(($el) => {
						this.timer_finder = null;
						if ($el && $el.dataset.injected !== 'true') {
							this.timer_finder = setTimeout(() => {
								this.timer_finder = null;
								this.findTarget();
							}, 600);
						}
					});

				}, 600);
			}

			// 监听 查找 可以分享的页面
			this.$root.addEventListener('click', (event) => {
				if (!event.clientX && !event.clientY) {
					return false;
				}
				findEl();
				// console.log('body.clicked', event);
			});

			setTimeout(() => {
				findEl();
		setTimeout(() => {
		  findEl();
		}, 1200);
			}, 2200);

			console.log(`[OK] 初始化 ${ this.name } 监听事件`);
		}

		init() {
			if (this.inited) {
				return console.warn(`[WARN] 已经初始化过了`);
			}

			this.$root = document.querySelector('#root');
			// this.$root = document.body;
			if (!this.$root) {
				return console.error(`[ERROR] 监控父元素未找到`);
			}

			this.watchEvents();

			this.inited = true;
		}

	}

	class PLAYERS {

		name = '参与人选择器';

		#key = 'y-app-players';

		#separator = ',';

		$root = null;

		constructor() {

			console.log(`[OK] 初始化 参与人选择器 ...`);

			this.init();

		}

		parserArray(str) {
			str = (str || '').toString().trim();
			str = str.replace(/(，|,|;|\s)+/ig, this.#separator);
			str = str.split(this.#separator);
			str = str.filter((item, index, array) => {
				return item.trim().length && array.indexOf(item) === index;
			});
			return str;
		}

		get() {
			let data = window.localStorage.getItem(this.#key);
			return this.parserArray(data);
		}

		set(data) {
			if (typeof data === 'object') {
				data = data.join(this.#separator);
			}
			if (typeof data === 'string') {
				data = data.trim();
				window.localStorage.setItem(this.#key, data);
			}
		}

		clear() {
			window.localStorage.removeItem(this.#key);
		}

		// 注入样式
		injectStyle() {
			const cssRules = () => {
				return `
	.y-app-players{
		&>.ant-space{
			width: 100%;
		}

		.y-app-players__editor{
			display: none;
		}
		.y-app-players__selector{

		}

		&.y-app-players__editing{
			.y-app-players__editor{
				display: flex;
			}
			.y-app-players__selector{
				display: none;
			}
		}

		.y-app-players__list,
		.y-app-players__actions{
			padding-top: 3px;
			padding-bottom: 3px;
		}
		.y-app-players__list{
			flex: 1;
		}
		.y-app-players__item,
		.y-app-players__placeholder,
		.y-app-players__btn{
			display: inline-block;
		}
		.y-app-players__btn,
		.y-app-players__item{
			min-width: 30px;
			text-align: center;
			padding: 2px 6px;
			border-radius: 3px;

			&:hover{
				background: #f5f5f5;
			}
			&:active{
				background: #e5e5e5;
			}
		}
		.y-app-players__item{
			margin-right: 5px;
			margin-bottom: 4px;
		}
		.y-app-players__item-selected{
			color: #fff;
			background: #247fff;

			&:hover{
				background: #4b96ff;
			}
			&:active{
				background: #146eed;
			}
		}

		.y-app-players__placeholder{
			color: #999;
			padding: 2px 6px;
		}
		.y-app-players__btn-clear{
			color: red;
		}
	}

	div.ant-tabs-tabpane-active[id^="rc-tabs"][id$="-panel-person"]{

		.eb-index-list-bar,
		.eb-selector-modal-person-index{
			display: none !important;
		}
		.eb-index-list-container{
			margin-top: -20px !important;
		}
	}
	`.trim();
			};
			const $style = document.createElement('style');
			$style.setAttribute('id', 'y-app-style-players');
			$style.setAttribute('type', 'text/css');
			$style.innerHTML = cssRules();
			document.head.appendChild($style);
			console.log(`[OK] 初始化 参与人选择器 已注入`);
		}

		inject($el) {
			if (!$el) return false;

			var render = (data, defaultValue) => {
				var html = [];
				var hasSelected = false;
				var selectedList = $el.getSelectedList();
				// console.log(selectedList, data);
				if (Array.isArray(data) && data.length) {
					data.forEach((item, index) => {
						// hasSelected = selectedList.includes(item);
						hasSelected = selectedList.filter((dd) => dd == item).length;
						html.push(`<a class="y-app-players__item${ hasSelected ? ' y-app-players__item-selected' : '' }" title="左键单击：选择&#13;右键单击：前移&#13;左键长按：移除" data-index="${ index }">${ item }</a>`);
					});
				} else {
					defaultValue = defaultValue || `<span class="y-app-players__placeholder">搜索后将添加常联系的，多个用空格隔开</span>`;
					if (defaultValue) {
						html.push(defaultValue);
					}
				}
				return html.join('');
			}

			// 获取已选择的
			$el.getSelectedList = () => {
				var ret = $el.$selectedList ? $el.$selectedList.innerText : '';
				ret = ret.split('\n');
				ret = ret.filter((item) => item.trim());
				return ret;
			}
			// 自动选择
			$el.autoSelect = (next) => {
				if ($el.timer_search) {
					clearTimeout($el.timer_search);
					$el.timer_search = null;
				}
				if ($el.timer_search_render) {
					clearTimeout($el.timer_search_render);
					$el.timer_search_render = null;
				}
				$el.timer_search = setTimeout(() => {
					$el.$results = $el.$content.querySelectorAll('.eb-selector-modal-person-item');

					// 有搜索结果时，保存数据、更新视图
					if ($el.$results.length) {
						 // 只有一个结果时自动选中
						if ($el.$results.length === 1) {
							$el.$results[0].click();
						}

						$el.timer_search_render = setTimeout(() => {
							if (typeof next === 'function') {
								next($el.$results);
							}

							// 保存数据
							this.set($el.data);
							// 更新视图
							$el.$players.$list.innerHTML = render($el.data).trimHTML();

						}, 200);
					}
				}, 500);
			}


			// $el.$content = $el.parentNode.parentNode.parentNode.parentNode;
			// $el.$body = $el.$content.parentNode;
			$el.$content = $el.querySelector('.ant-modal-content');
			$el.$body = $el.$content.querySelector('.ant-modal-body');

			// 展开已选择
			$el.doExpand = () => {
				//$el.$btnHasSelected = $el.$content.querySelector('a.ant-typography[direction="ltr"]');
				$el.$btnHasSelected = $el.$content.querySelector('.eb-selector-modal-footer .ant-space-item>.ant-typography');
				if ($el.$btnHasSelected) {
					if ($el.classList.contains('eb-selector-modal--open')) {
						// console.warn('已经展开');
						// 已经展开
						return false;
					} else {
						// 点击展开已选择
						$el.$btnHasSelected.click();
					}
					setTimeout(() => {
						$el.$players.$list.innerHTML = render($el.data).trimHTML();
					}, 1200);
				}
			}

			// 自动展开已选择
			$el.doExpand();

			if ($el.$body) {
				$el.$body.addEventListener('click', (event) => {
					// event.stopPropagation();
					return false;
				});
				$el.$selectedList = $el.$body.querySelector('.eb-selector-modal-drawer-content>.eb-menu-sm');
				$el.$selectedList.addEventListener('click', function() {
					if ($el.$selectedList.timer_click) {
						clearTimeout($el.$selectedList.timer_click);
						$el.$selectedList.timer_click = null;
					}
					$el.$selectedList.timer_click = setTimeout(() => {
						$el.$players.$list.innerHTML = render($el.data).trimHTML();
					}, 300);
				})
			}

			// console.log('b:', $el.$body, $el.$selectedList);
			$el.$tree = $el.querySelector('.eb-selector-modal-tree');
			$el.$input = $el.querySelector('input.ant-input[type="text"]');
			// 输入
			$el.doInput = (value, next) => {
				// 赋值给输入框
				var lastValue = $el.$input.value;
				$el.$input.value = value;
				$el.$input.setAttribute('value', value);
				var eventInput = new Event('input', { target: $el.$input, bubbles: true });
				eventInput.simulated = true;
				var tracker = $el.$input._valueTracker;
				if (tracker) {
					tracker.setValue(lastValue);
				}
				$el.$input.dispatchEvent(eventInput);

				if (typeof next === 'function') {
					next();
				}
			}

			// 搜索
			$el.doSearch = (next) => {
				// 执行搜索
				var eventEnter = new KeyboardEvent('keydown', {
					code: 'Enter',
					key: 'Enter',
					charCode: 13,
					keyCode: 13,
					view: window,
					bubbles: true
				});
				$el.$input.dispatchEvent(eventEnter);

				if (typeof next === 'function') {
					next();
				}
			}

			// 输入空格组织 垃圾转圈
			$el.doInput('　', () => {
				$el.doSearch(() => {
					$el.doInput('');
				});
			});

			$el.data = this.get();
			$el.$players = document.createElement('div');
			$el.$players.className = 'ant-space-item y-app-players';
			var html = `
		<div class="ant-space y-app-players__tip"><span class="y-app-players__placeholder">左键单击选择，左键长按2秒删除，右键移至最前</span></div>
		<div class="ant-space y-app-players__selector">
			<div class="ant-space-item y-app-players__list"></div>
			<div class="ant-space-item y-app-players__actions">
				<a class="y-app-players-btn y-app-players__btn-clear" title="三思 ！！！&#13;&#13;清空保存的历史&#13;&#13;左键长按姓名也可删除">清空</a>
			</div>
		</div>
		`.trim();
			$el.$players.innerHTML = html.trimHTML();
			$el.$players.$list = $el.$players.querySelector('.y-app-players__list');
			$el.$players.$list.innerHTML = render($el.data).trimHTML();

			// 双击 复制全部常联系的
			$el.$players.$list.addEventListener('dblclick', (event) => {
				event.preventDefault();
				event.stopPropagation();
				if (event.target.tagName === 'A') {
					return false;
				}
				var value = $el.data.join(' ');
				doCopy(value).then(() => {
					console.log(`常联系的 复制成功`);
					console.log(value);
				});
			});
			// 右键 排序
			$el.$players.$list.addEventListener('contextmenu', (event) => {
				event.preventDefault();
				event.stopPropagation();
				if (event.target.tagName !== 'A' && event.target.dataset.index === undefined) {
					return false;
				}
				var index = Number(event.target.dataset.index);
				if (isNaN(index)) {
					// console.warn(`index isNaN`, event.target.dataset.index);
					return false;
				}
				// 移动至第一
				var value = $el.data.splice(index, 1);
				$el.data.unshift(value);
				this.set($el.data);
				$el.$players.$list.innerHTML = render($el.data).trimHTML();

			});
			// 长按2秒 移除
			$el.$players.$list.addEventListener('mousedown', (event) => {
				event.preventDefault();
				event.stopPropagation();
				if (event.target.tagName !== 'A' && event.target.dataset.index === undefined) {
					return false;
				}
				if (event.button !== 0) {
					return false;
				}
				var index = Number(event.target.dataset.index);
				if (isNaN(index)) {
					// console.warn(`index isNaN`, event.target.dataset.index);
					return false;
				}
				var value = $el.data[index];
				if (!value) {
					return false;
				}
				if ($el.$players.$list.timer_mousedown) {
					clearTimeout($el.$players.$list.timer_mousedown);
					$el.$players.$list.timer_mousedown = null;
				}
				$el.$players.$list.dataset.mousedowned = true;
				$el.$players.$list.timer_mousedown = setTimeout(() => {
					// 移除
					$el.data.splice(index, 1);
					this.set($el.data);
					$el.$players.$list.innerHTML = render($el.data).trimHTML();
				}, 2000);
			});
			$el.$players.$list.addEventListener('mouseup', (event) => {
				if ($el.$players.$list.timer_mousedown) {
					clearTimeout($el.$players.$list.timer_mousedown);
					$el.$players.$list.timer_mousedown = null;
				}
			});

			// 左键 选择
			$el.$players.$list.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();
				if (event.target.tagName !== 'A' && event.target.dataset.index === undefined) {
					return false;
				}
				if (event.button !== 0) {
					return false;
				}
				var index = Number(event.target.dataset.index);
				if (isNaN(index)) {
					// console.warn(`index isNaN`, event.target.dataset.index);
					return false;
				}
				var value = $el.data[index];
				if (!value) {
					return false;
				}

				$el.doInput(value, $el.doSearch);

				// 自动选择
				$el.autoSelect(() => {
					// 最近点击的插入到最前排
					// value = $el.data.splice(index, 1);
					// $el.data.unshift(value);
				});

			});

			// 清空 按钮
			$el.$players.$clear = $el.$players.querySelector('.y-app-players__btn-clear');
			$el.$players.$clear.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();
				$el.data = [];
				// window.localStorage.removeItem('y-app-players');
				this.clear();
				$el.$players.$list.innerHTML = render($el.data).trimHTML();
			});
			$el.$tree.insertBefore($el.$players, $el.$tree.childNodes[0]);

			// 搜索框 事件
			$el.$input.addEventListener('keyup', (event) => {
				if (event.key !== 'Enter') {
					return false;
				}
				var value = $el.$input.value.trim();
				if (!value) {
					return false;
				}
				var currentValue = value;
				value = this.parserArray(value);
				value = value.concat($el.data);
				value = this.parserArray(value.join(','));
				$el.data = value;
				$el.$players.$list.innerHTML = render(value).trimHTML();
				this.set($el.data);

				// 自动选择
				$el.autoSelect();

			});

			// 标记元素已经找到
			$el.dataset.injected = true;

			return $el;
		}

		findModal(next) {
			// var $el = document.querySelector('div.ant-tabs-tabpane-active[id^="rc-tabs"][id$="-panel-person"]');
			var $el = document.querySelector('.ant-modal-wrap:not([style*="none"])>.ant-modal.eb-selector-modal');
			if (!$el) {
				if (typeof next === 'function') {
					next($el);
				}
				return false;
			}
	  // 如有 eb-grid ，就不是参与人选择器
	  if ($el.querySelector('.eb-grid')) {
		return false;
	  }
			if ($el.querySelector('.y-app-players')) {
				console.warn(`[WARN] 已注入 参与人选择器`);
				if ($el.doExpand) {
					$el.doExpand();
				}
				return false;
			}
			this.inject($el);
			return $el;
		}

		watchEvents() {
			// 监听 查找 参与人选择 弹窗
			this.$root.addEventListener('click', (event) => {
				if (this.timer_finder) {
					clearTimeout(this.timer_finder);
					this.timer_finder = null;
				}
				if (!event.clientX && !event.clientY) {
					return false;
				}
				this.timer_finder = setTimeout(() => {
					this.findModal(($el) => {
						this.timer_finder = null;
						if ($el && $el.dataset.injected !== 'true') {
							this.timer_finder = setTimeout(() => {
								this.timer_finder = null;
								this.findModal();
							}, 600);
						}
					});

				}, 600);
				// console.log('body.clicked', event);
			});
			console.log(`[OK] 初始化 参与人选择器 监听事件`);
		}

		init() {
			if (this.inited) {
				return console.warn(`[WARN] 参与人选择器 已经初始化过了`);
			}

			// this.$root = document.querySelector('#root');
			this.$root = document.body;
			if (!this.$root) {
				return console.error(`[ERROR] 监控父元素未找到`);
			}

			this.watchEvents();

			this.injectStyle();

			this.inited = true;
		}

	}


	class BOOKMARKS {

		name = '收藏夹';

		#key = 'y-app-bookmarks';

		#DB = {};

		constructor() {
			console.log(`[OK] 初始化 收藏夹 ...`);

			this.#load();
		}

		#check = (data) => {
			if (!data || typeof data !== 'object') {
				console.warn(`[WARN] 参数错误, 类型错误, 只接受简单对象`, data)
				return false;
			}
			if (!data.object) {
				console.warn(`[WARN] 参数错误, 缺少object`, data.object)
				return false;
			}
			if (!data.resId) {
				console.warn(`[WARN] 参数错误, 缺少resId`, data.resId)
				return false;
			}
			return true;
		}

		#load = () => {
			let DB = window.localStorage.getItem(this.#key);
			if (!DB) {
				return;
			}
			try {
				DB = JSON.parse(DB);
				if (typeof DB === 'object') {
					for (var object in DB) {
						if (Array.isArray(DB[object]) && DB[object].length) {
							DB[object].forEach((item, index) => {
								((_item, _index) => {
									if (_item.resId) {
										DB[object][_item.resId] = DB[object][_index];
									}
								})(item, index);
							});
						}
					}
					this.#DB = DB;
				}
			} catch (ex) {
				console.error(`[ERROR] 加载&解析数据出错`, ex);
			}
		}

		#save = () => {
			window.localStorage.setItem(this.#key, JSON.stringify(this.#DB));
		}

		get length() {
			const DB = this.#DB;
			let count = 0;
			for (var object in DB) {
				count = count + parseInt(DB[object].length);
			}
			return count;
		}

		get get() {
			return (viewObject, index) => {
				if (typeof viewObject === 'string' && viewObject) {
					const viewData = this.#DB[viewObject];
					// console.log('viewData:', viewData)
					if (viewData && index !== undefined) {
						return viewData[index];
					}
					return viewData;
				}
				return this.#DB;
			}
		}

		get getById() {
			return (viewObject, resId) => {
				if (typeof viewObject === 'string' && viewObject) {
					const viewData = this.#DB[viewObject];
					if (viewData && resId !== undefined) {
						const result = viewData.filter((item) => item.resId === resId);
						if (result.length) {
							return result[0];
						}
					}
				}
			}
		}

		get add() {
			return (data, callback) => {
				if (!this.#check(data)) {
					return false;
				}
				const DB = this.#DB;
				if (!Array.isArray(DB[data.object])) {
					DB[data.object] = [];
				}
				if (this.has(data)) {
					this.remove(data, callback);
				} else {
					delete data.bookmark;
					DB[data.object].unshift(data);
					DB[data.object][data.resId] = DB[data.object][0];
					if (typeof callback === 'function') {
						callback({ type: 'add', data, index: 0 });
					}
					this.#save();
				}
			}
		}

		get has() {
			return (data) => {
				if (!this.#check(data)) {
					return false;
				}
				const DB = this.#DB;
				if (Array.isArray(DB[data.object]) && DB[data.object][data.resId]) {
					return true;
				}
				return false;
			}
		}

		get remove() {
			return (data, callback) => {
				if (!this.#check(data)) {
					return false;
				}
				if (!this.has(data)) {
					return false;
				}
				const DB = this.#DB;
				DB[data.object].some((item, index) => {
					if (data.resId === item.resId) {
						DB[data.object].splice(index, 1);
						delete DB[data.object][data.resId];
						if (typeof callback === 'function') {
							callback({ type: 'remove', data: item, index });
						}
						this.#save();
						return true;
					}
				});
			}
		}

	}



	class Y {

		#KEY = {
			state: 'y-app-state'
		};

		get name() {
			return '易用云';
		}

		get desc() {
			return '让易搭云更易用';
		}

		get author() {
			return 'Jack.Chan';
		}

		get path() {
			return window.location.pathname + window.location.search;
		}

		get query() {
			//return new URLSearchParams(window.location.search.substr(1));
			return new URLSearchParams(window.location.search.substr(1) +'&'+ (window.location.hash.split('?')[1] || ''));
		}

		#STATE = {
			pagesize: 5,
			worktime: '9:30',
			involved: false,
			types: {}
		};

		get state() {
			return this.#STATE;
		}

		set state(state) {
			return this.#STATE = { ...state };
		}

		get saveState() {
			return () => {
				window.localStorage.setItem(this.#KEY.state, JSON.stringify(this.state));
			}
		}

		get loadState() {
			return () => {
				let state = window.localStorage.getItem(this.#KEY.state);
				if (state) {
					try {
						state = JSON.parse(state);
						if (typeof state !== 'object') {
							state = {};
						}
					} catch (ex) {
						console.warn(ex);
					}
				} else {
					state = {};
				}
				this.state = { ...this.state, ...state };
				return state;
			}
		}

		get setState() {
			return (state, callback) => {
				if (typeof state === 'object') {
					Object.keys(state).forEach((key) => {
						this.state.types[key] = state[key];
					});
				}
				if (typeof callback === 'function') {
					callback(state);
				}
			}
		}

		get USER() {
			return USER_INFO.get();
		}

		$app = null;

		$fetch = $fetch;

		// QUICK NAV
		#NAVS = {
			render() {
				const navs = [
					{
						text: '流程中心',
						value: `view=${ encodeURIComponent(JSON.stringify({"name":"流程中心","context":{"flowMenuKey":"doing"},"tag":"ProcessCenter","type":"pageAction"})) }&workspace=U3VZYR`
					},
					{
						text: '产品线',
						value: 'rootMenu=9959e9c7253340ad9f3cfbc80f05302d&menu=ias8ps5cdm6'
					},
					{
						text: '项目立项',
						value: 'rootMenu=9959e9c7253340ad9f3cfbc80f05302d&menu=c8ynvsupd5b'
					},
					{
						text: '发版记录',
						value: 'rootMenu=9959e9c7253340ad9f3cfbc80f05302d&menu=cdumw3k4xqc'
					},
					{
						text: '需求',
						value: 'rootMenu=9959e9c7253340ad9f3cfbc80f05302d&menu=ftrx43n3g8y'
					},
					{
						text: '研发任务',
						value: 'rootMenu=9959e9c7253340ad9f3cfbc80f05302d&menu=vzbycr4u6ka'
					},
					{
						text: '部门任务',
						value: 'rootMenu=9959e9c7253340ad9f3cfbc80f05302d&menu=vzbycr4u6ka'
					},
					{
						text: '缺陷',
						value: 'rootMenu=9959e9c7253340ad9f3cfbc80f05302d&menu=pia9dfzpjtk'
					},
					{
						text: '登记工时',
						value: 'rootMenu=9959e9c7253340ad9f3cfbc80f05302d&menu=c4x9y67hvrq'
					},
					{
						text: '项目月度工时审批',
						value: 'rootMenu=9959e9c7253340ad9f3cfbc80f05302d&menu=mtthhhkguwt'
					},
					{
						text: '研发月度工时审批',
						value: 'rootMenu=9959e9c7253340ad9f3cfbc80f05302d&menu=scbvpqcicvh'
					},
					{
						text: '成员工时统计',
						value: 'rootMenu=9959e9c7253340ad9f3cfbc80f05302d&menu=uzbqewzki9w'
					},
					{
						text: '项目工时统计',
						value: 'rootMenu=9959e9c7253340ad9f3cfbc80f05302d&menu=ytgcs54t2kr'
					},
					{
						text: '项目成员工时统计',
						value: 'rootMenu=9959e9c7253340ad9f3cfbc80f05302d&menu=hryqnct76hf'
					},
					{
						text: 'OA审批',
						value: 'rootMenu=d27b033dede44c8a9d477041e9edb35d&menu=b5b5yeennmf'
					},
					{
						text: 'BOSS',
						value: 'rootMenu=188eebdafa2e411ead5bc02b07a73589&menu=xv6xg7jxhkj'
					},
					{
						text: '销冠合同审批',
						value: 'rootMenu=860b3fef58a64bf2aae43343ed6c61ee&menu=jy86kvtiyh3'
					},
					{
						text: '通讯录',
						value: 'rootMenu=00360e47fc474f74a814fc270a66b415&menu=eyvuzzuk7k8'
					},
					{
						text: '易搭云支持平台',
						value: 'rootMenu=e65fd0c54a0148feb7cbcd85ad3d2297&menu=sfeaduyrta5'
					}
				];
				return `
<ul class="y-app-quick-nav">
${ navs.map((item, index) => {
	return `<li class="y-app-quick-nav__item"><a class="y-app-btn y-app-btn__small" primary href="#/home?${ item.value }">${ item.text }</a></li>`;
}).join('') }
</ul>
`.trim();
			}
		}


		// 收藏夹
		BOOKMARKS = null;

		// 参与人选择器
		PLAYERS = null;

		// 分享按钮
		BTN_SHARE = null;

		// 分页
		#PAGE_SIZES = [
			{ value: 5, selected: true },
			{ value: 10 },
			{ value: 20 },
			{ value: 30 },
			{ value: 50 },
			{ value: 100 },
			{ value: 200 }
		];

		// 视图: 对象名、视图编号、查询参数、模板渲染器、数据
		#VIEWS = [
			{
				name: '需求',
				object: 'eg68i5r43aq',
				viewNumber: 'baz6tzfuvkf',
				// 审批流
				context: { flowFlag: true },
				checked: true,
				records: [],
				render: (view, records, options) => {
					options = { from: 'search', ...options };
					if (!view || !records || !records.length) {
						return '';
					}
					return `
<table class="y-app-table">
	<caption class="y-app-table__caption">${ view.name }</caption>
	<colgroup>
		<col style="width: 40px;" />
		<col style="width: 40px;" />
		<col style="width: 67px;" />
		<col style="width: 80px;" />
		<col style="width: auto;min-width: 400px;max-width: 900px;" />
		<col style="width: 160px;" />
		<col style="width: 140px;" />
		<col style="width: 1%;" />
	</colgroup>
	${ records.map((item, index) => {
		if (!item.bookmark && !item.object) {
			item.bookmark = {
				object: view.object,
				viewNumber: view.viewNumber,
				project: item[view.object +'Header_f_zc8nx8Name'],
				name: item[view.object +'Header_f_h8bqqj'] || item[view.object +'Header_name'],
				resId: item[view.object +'Header_id'],
				creator: item[view.object +'Header_creatorName'],
				players: renderPlayers(item[view.object +'Header_f_b7vp4dName']),
				createTime: formatDate(item[view.object +'Header_createTime']),
				updateTime: formatDate(item[view.object +'Header_updateTime']),
				devStatus: item[view.object +'Header_f_giqar8Name'],
				priority: item[view.object +'Header_f_d37i79Name'],
			};
			item.bookmark = trimObject(item.bookmark);
			if (view.context) {
				item.bookmark.context = view.context;
			}
			item.bookmark.title = (item.bookmark.project ? `【${ item.bookmark.project }】` : '') + item.bookmark.name;
			item.bookmark.url = renderLinkHref(item.bookmark);
			for (var prop in item.bookmark) {
				item[prop] = item.bookmark[prop];
			}
		};
		item.starred = this.BOOKMARKS.has(item);
		return `
<tr>
	<td>
		<a class="y-app-btn y-app-btn-icon y-app-action" data-from="${ options.from }" data-action="prevent.star" data-object="${ view.object }" data-index="${ index }" data-id="${ item.resId }" title="${ item.starred ? '取消收藏' : '收藏' }">${ ICONS[item.starred ? 'starred' : 'star'] }</a>
	</td>
	<td>
		<a target="_blank" href="${ item.url }" class="y-app-btn y-app-btn-icon y-app-action" data-action="prevent.copy" data-project="${ item.project }" data-name="${ item.name }" data-title="${ item.title }" title="复制链接">${ ICONS.copy }</a>
	</td>
	<td><span class="text-ellipsis" title="创建人：${ item.creator }&#13;参与人：${ item.players }"><a href="#/search?keyword=${ encodeURIComponent(item.creator) }" title="创建人：${ item.creator }&#13;参与人：${ item.players }&#13;&#13;点击搜索“${ item.creator }”创建的需求">${ item.creator }</a></span></td>
	<td><span class="text-ellipsis" title="需求状态：${ item.devStatus }">${ item.devStatus }</span></td>
	<td>
		<a target="_blank" href="${ item.url }" class="y-app-link y-app-action" data-from="${ options.from }" data-action="prevent.openDrawer" data-object="${ view.object }" data-index="${ index }" data-id="${ item.resId }">${ item.title }</a>
	</td>
	<td><span title="创建时间：${ item.createTime }&#13;更新时间：${ item.updateTime }">${ item.updateTime }</span></td>
	<td><span title="优先级：${ item.priority }">${ item.priority }</span></td>
	<td>&nbsp;</td>
</tr>
`.trim();
	}).join('') }
</table>
`.trim();
				},
				status() {
					return [
						{
							"value": "rs3rh8da323",
							"label": "未激活",
						},
						{
							"value": "5bn9ayf0sgk",
							"label": "产品调研",
						},
						{
							"value": "e0vnqk6rvy5",
							"label": "MRD设计",
						},
						{
							"value": "56g8zm7gkdo",
							"label": "PRD/UED设计",
						},
						{
							"value": "zbs0i8e1hdz",
							"label": "研发中",
						},
						{
							"value": "o49jkiqkmnv",
							"label": "测试中",
						},
						{
							"value": "9sme879pbvo",
							"label": "已验收",
						},
						{
							"value": "3gb5v85bprv",
							"label": "试运行",
						},
						{
							"value": "w7t6sisqu31",
							"label": "正常结束",
						},
						{
							"value": "j767kv6svsf",
							"label": "关闭",
						}
					];
				},
				params: (() => {
					const that = this;
					return function params(query) {
						const { state } = that;

						const params = {
							"params": {
								"object": "eg68i5r43aq",
								"viewType": "viewList",
								"size": query.size || 50,
								"page": query.page || 1,
								"search": {
									"type": "every",
									"fields": [
										"eg68i5r43aqHeaderName",
										"moch002vze6",
										"fnse19vmu5t",
										"s0nvbqzlu58",
										"g8qcmno34ix",
										"7h90amrzdhu",
										"kntb9eao69o",
										"k3979lviw8g",
										"ejnq8nbp1ks",
										"eg68i5r43aqHeaderStatus"
									],
									"value": query.keyword || ''
								},
								"fields": [
									"eg68i5r43aqHeaderName",
									"moch002vze6",
									"fnse19vmu5t",
									"s0nvbqzlu58",
									"5fftccbn4vn",
									"g8qcmno34ix",
									"7h90amrzdhu",
									"kntb9eao69o",
									"k3979lviw8g",
									"4i4hooso8xw",
									"9i7p66yp7hj",
									"prpqzpxifvy",
									"ejnq8nbp1ks",
									"eg68i5r43aqHeaderStatus"
								],
								"filter": {
									"rel": "and",
									"rules": []
								},
								"summary": [],
								"sort": [
									{
										"field": "eg68i5r43aqHeaderCreateTime",
										"number": "m81dt0b9u16",
										"order": "descend",
										"orderType": "DESC"
									}
								],
								"mobileOptions": null,
								"context": {}
							},
							"context": {}
						};

						// 与我有关的
						if (state.involved) {
							params.params.filter.rules.push({
								"number": "w0j1vpyrui4",
								"rel": "or",
								"rules": [
									{
										"number": "ybugz2uwya6",
										"lType": "field",
										"lValue": [
											"eg68i5r43aqHeader",
											"fnse19vmu5t"
										],
										"op": "in",
										"rType": "constant",
										"rValue": [
											{
												"value": USER_INFO.get('id'),
												"number": USER_INFO.get('number'),
												"label": USER_INFO.get('name'),
												"objectNumber": "sysUser"
											}
										]
									},
									{
										"number": "ztg1twd9r02",
										"lType": "field",
										"lValue": [
											"eg68i5r43aqHeader",
											"7ft4nvinhbs"
										],
										"op": "contains",
										"rType": "constant",
										"rValue": [
											{
												"value": USER_INFO.get('id'),
												"number": USER_INFO.get('number'),
												"label": USER_INFO.get('name'),
												"objectNumber": "sysUser"
											}
										]
									},
									{
										"number": "am4fq8ostla",
										"lType": "field",
										"lValue": [
											"eg68i5r43aqHeader",
											"eg68i5r43aqHeaderCreator"
										],
										"op": "in",
										"rType": "constant",
										"rValue": [
											// "1594888324594606163"
											USER_INFO.get('id')
										]
									}
								]
							});
						}

						// 状态筛选
						if (state.status) {
							const settingStatus = Object.keys(state[`setting.status.${ this.object }`] || {});
							if (settingStatus.length) {
								params.params.filter.rules.push({
									"number": "lva1dayvzg7",
									"rel": "and",
									"rules": [
										{
											"number": "x29396d8gal",
											"lType": "field",
											"lValue": [
												"eg68i5r43aqHeader",
												"k3979lviw8g"
											],
											"op": "in",
											"rType": "constant",
											"rValue": settingStatus
										}
									]
								});
							}
						}

						return params;
					}
				})(),
			},
			{
				name: '缺陷',
				object: 'jkubb5t4pj7',
				viewNumber: 'prgp74dayd5',
				context: { flowFlag: true },
				checked: true,
				render: (view, records, options) => {
					options = { from: 'search', ...options };
					if (!view || !records || !records.length) {
						return '';
					}
					return `
<table class="y-app-table">
	<caption class="y-app-table__caption">${ this.#VIEWS[view.object].name }</caption>
	<colgroup>
		<col style="width: 40px;" />
		<col style="width: 40px;" />
		<col style="width: 67px;" />
		<col style="width: 80px;" />
		<col style="width: auto;min-width: 400px;max-width: 900px;" />
		<col style="width: 160px;" />
		<col style="width: 140px;" />
		<col style="width: 1%;" />
	</colgroup>
	${ records.map((item, index) => {
		if (!item.bookmark && !item.object) {
			item.bookmark = {
				object: view.object,
				viewNumber: view.viewNumber,
				project: item[view.object +'Header_f_tavfi9Name'],
				name: item[view.object +'Header_f_k8qz5t'] || item[view.object +'Header_name'],
				resId: item[view.object +'Header_id'],
				creator: item[view.object +'Header_creatorName'],
				players: renderPlayers(item[view.object +'Header_f_tx98jjName']),
				createTime: formatDate(item[view.object +'Header_createTime']),
				updateTime: formatDate(item[view.object +'Header_updateTime']),
				devStatus: item[view.object +'Header_f_etietbName'],
				priority: item[view.object +'Header_f_bw7iwcName'],
			};
			item.bookmark = trimObject(item.bookmark);
			if (view.context) {
				item.bookmark.context = view.context;
			}
			item.bookmark.title = (item.bookmark.project ? `【${ item.bookmark.project }】` : '') + item.bookmark.name;
			item.bookmark.url = renderLinkHref(item.bookmark);
			for (var prop in item.bookmark) {
				item[prop] = item.bookmark[prop];
			}
		};
		item.starred = this.BOOKMARKS.has(item);
		return `
<tr>
	<td>
		<a class="y-app-btn y-app-btn-icon y-app-action" data-from="${ options.from }" data-action="prevent.star" data-object="${ view.object }" data-index="${ index }" data-id="${ item.resId }" title="${ item.starred ? '取消收藏' : '收藏' }">${ ICONS[item.starred ? 'starred' : 'star'] }</a>
	</td>
	<td>
		<a target="_blank" href="${ item.url }" class="y-app-btn y-app-btn-icon y-app-action" data-action="prevent.copy" data-project="${ item.project }" data-name="${ item.name }" data-title="${ item.title }" title="复制链接">${ ICONS.copy }</a>
	</td>
	<td><span class="text-ellipsis" title="创建人：${ item.creator }&#13;参与人：${ item.players }"><a href="#/search?keyword=${ encodeURIComponent(item.creator) }" title="创建人：${ item.creator }&#13;参与人：${ item.players }&#13;&#13;点击搜索“${ item.creator }”创建的缺陷">${ item.creator }</a></span></td>
	<td><span class="text-ellipsis" title="缺陷状态：${ item.devStatus }">${ item.devStatus }</span></td>
	<td>
		<a target="_blank" href="${ item.url }" class="y-app-link y-app-action" data-from="${ options.from }" data-action="prevent.openDrawer" data-object="${ view.object }" data-index="${ index }" data-id="${ item.resId }">${ item.title }</a>
	</td>
	<td><span title="创建时间：${ item.createTime }&#13;更新时间：${ item.updateTime }">${ item.updateTime }</span></td>
	<td><span title="优先级：${ item.priority }">${ item.priority }</span></td>
	<td>&nbsp;</td>
</tr>
`.trim();
	}).join('') }
</table>
`.trim();
				},
				status() {
					return [
						{
							"value": "lvwjsakiu6v",
							"label": "打开",
						},
						{
							"value": "yha99te9o7j",
							"label": "已确认",
						},
						{
							"value": "99gbf8mrn0j",
							"label": "修复中",
						},
						{
							"value": "hyreb65tq3l",
							"label": "已解决",
						},
						{
							"value": "lahf9eis5sz",
							"label": "正常结束",
						},
						{
							"value": "hovq5gukui3",
							"label": "挂起",
						},
						{
							"value": "vzepofld5n8",
							"label": "已关闭",
						}
					];
				},
				params: (() => {
					const that = this;
					return function params(query) {
						const { state } = that;

						const params = {
							"params": {
								"object": "jkubb5t4pj7",
								"viewType": "viewList",
								"size": query.size || 50,
								"page": query.page || 1,
								"search": {
									"type": "every",
									"fields": [
										"jkubb5t4pj7HeaderName",
										"zii2oihcraf",
										"xjlih2lj64m",
										"vypueddzbhy",
										"6s6pnhzilf3",
										"m36tbpsfc5c",
										"pvyyhl6kemy",
										"n3ej7s7ksuq",
										"anefrl25i1a"
									],
									"value": query.keyword || ''
								},
								"fields": [
									"jkubb5t4pj7HeaderName",
									"zii2oihcraf",
									"xjlih2lj64m",
									"vypueddzbhy",
									"6s6pnhzilf3",
									"q9dit1j2dn3",
									"vi2a5y4q3uc",
									"m36tbpsfc5c",
									"pvyyhl6kemy",
									"n3ej7s7ksuq",
									"anefrl25i1a",
									"792mgjv12e4"
								],
								"filter": {
									"rel": "and",
									"rules": []
								},
								"summary": [],
								"sort": [
									{
										"field": "jkubb5t4pj7HeaderCreateTime",
										"number": "mj2e3fjgeyu",
										"order": "descend",
										"orderType": "DESC"
									}
								],
								"mobileOptions": null,
								"context": {}
							},
							"context": {}
						};

						// 与我有关的 缺陷
						if (state.involved) {
							params.params.filter.rules.push({
								"number": "gyzggqlk5u1",
								"rel": "or",
								"rules": [
									{
										"number": "gjvcsiln78q",
										"lType": "field",
										"lValue": [
											"jkubb5t4pj7Header",
											"jkubb5t4pj7HeaderCreator"
										],
										"op": "in",
										"rType": "constant",
										"rValue": [
											// "1594888324594606163"
											USER_INFO.get('id')
										]
									},
									{
										"number": "maq433j9400",
										"lType": "field",
										"lValue": [
											"jkubb5t4pj7Header",
											"anefrl25i1a"
										],
										"op": "contains",
										"rType": "constant",
										"rValue": [
											{
												"value": USER_INFO.get('id'),
												"number": USER_INFO.get('number'),
												"label": USER_INFO.get('name'),
												"objectNumber": "sysUser"
											}
										]
									},
									{
										"number": "mwzmb66egcc",
										"lType": "field",
										"lValue": [
											"jkubb5t4pj7Header",
											"xjlih2lj64m"
										],
										"op": "in",
										"rType": "constant",
										"rValue": [
											{
												"value": USER_INFO.get('id'),
												"number": USER_INFO.get('number'),
												"label": USER_INFO.get('name'),
												"objectNumber": "sysUser"
											}
										]
									}
								]
							});
						}

						// 状态筛选
						if (state.status) {
							const settingStatus = Object.keys(state[`setting.status.${ this.object }`]);
							if (settingStatus.length) {
								params.params.filter.rules.push({
									"number": "35a5b8esisp",
									"rel": "and",
									"rules": [
										{
											"number": "rc9md2gbyb5",
											"lType": "field",
											"lValue": [
												"jkubb5t4pj7Header",
												"zii2oihcraf"
											],
											"op": "in",
											"rType": "constant",
											"rValue": settingStatus
										}
									]
								});
							}
						}

						return params;
					}
				})(),
			},
			{
				name: '研发任务',
				object: 'uzze6x8nxxz',
				viewNumber: 'zgezk76v77m',
				// context: { flowFlag: true },
				checked: true,
				render: (view, records, options) => {
					options = { from: 'search', ...options };
					if (!view || !records || !records.length) {
						return '';
					}
					return `
<table class="y-app-table">
	<caption class="y-app-table__caption">${ view.name }</caption>
	<colgroup>
		<col style="width: 40px;" />
		<col style="width: 40px;" />
		<col style="width: 67px;" />
		<col style="width: 80px;" />
		<col style="width: auto;min-width: 400px;max-width: 900px;" />
		<col style="width: 160px;" />
		<col style="width: 140px;" />
		<col style="width: 1%;" />
	</colgroup>
	${ records.map((item, index) => {
		if (!item.bookmark && !item.object) {
			item.bookmark = {
				object: view.object,
				viewNumber: view.viewNumber,
				project: item[view.object +'Header_f_x6k7veName'],
				name: item[view.object +'Header_name'] || item[view.object +'Header_f_qg8xig'],
				resId: item[view.object +'Header_id'],
				creator: item[view.object +'Header_creatorName'],
				players: renderPlayers(item[view.object +'Header_f_uqukrwName']),
				createTime: formatDate(item[view.object +'Header_createTime']),
				updateTime: formatDate(item[view.object +'Header_updateTime']),
				devStatus: item[view.object +'Header_f_r876g4Name'],
				priority: item[view.object +'Header_f_w2wqevName'],
			};
			item.bookmark = trimObject(item.bookmark);
			if (view.context) {
				item.bookmark.context = view.context;
			}
			item.bookmark.title = (item.bookmark.project ? `【${ item.bookmark.project }】` : '') + item.bookmark.name;
			item.bookmark.url = renderLinkHref(item.bookmark);
			for (var prop in item.bookmark) {
				item[prop] = item.bookmark[prop];
			}
		};
		item.starred = this.BOOKMARKS.has(item);
		return `
<tr>
	<td>
		<a class="y-app-btn y-app-btn-icon y-app-action" data-from="${ options.from }" data-action="prevent.star" data-object="${ view.object }" data-index="${ index }" data-id="${ item.resId }" title="${ item.starred ? '取消收藏' : '收藏' }">${ ICONS[item.starred ? 'starred' : 'star'] }</a>
	</td>
	<td>
		<a target="_blank" href="${ item.url }" class="y-app-btn y-app-btn-icon y-app-action" data-action="prevent.copy" data-project="${ item.project }" data-name="${ item.name }" data-title="${ item.title }" title="复制链接">${ ICONS.copy }</a>
	</td>
	<td><span class="text-ellipsis" title="创建人：${ item.creator }&#13;参与人：${ item.players }"><a href="#/search?keyword=${ encodeURIComponent(item.creator) }" title="创建人：${ item.creator }&#13;参与人：${ item.players }&#13;&#13;点击搜索“${ item.creator }”创建的任务">${ item.creator }</a></span></td>
	<td><span class="text-ellipsis" title="任务状态：${ item.devStatus }">${ item.devStatus }</span></td>
	<td>
		<a target="_blank" href="${ item.url }" class="y-app-link y-app-action" data-from="${ options.from }" data-action="prevent.openDrawer" data-object="${ view.object }" data-index="${ index }" data-id="${ item.resId }">${ item.title }</a>
	</td>
	<td><span title="创建时间：${ item.createTime }&#13;更新时间：${ item.updateTime }">${ item.updateTime }</span></td>
	<td><span title="优先级：${ item.priority }">${ item.priority }</span></td>
	<td>&nbsp;</td>
</tr>
`.trim();
	}).join('') }
</table>
`.trim();
				},
				status() {
					return [
						{
							"value": "i4hz50jso38",
							"label": "未开始",
						},
						{
							"value": "upuidb76ls8",
							"number": "8vh5hlrkuwo",
							"label": "进行中",
						},
						{
							"value": "kjhop9uygpk",
							"label": "已完成",
						},
						{
							"value": "eys7uzw07vl",
							"label": "关闭",
						},
						{
							"value": "012j1zkzcb1",
							"label": "长期任务",
						}
					];
				},
				params: (() => {
					const that = this;
					return function params(query) {
						const { state } = that;

						const params = {
							"params": {
								"object": "uzze6x8nxxz",
								"viewType": "viewList",
								"size": query.size || 50,
								"page": query.page || 1,
								"search": {
									"type": "every",
									"fields": [
										"uzze6x8nxxzHeaderName",
										"885kt2czitt",
										"l6veducif7d",
										"pkegrllxfey",
										"j0v1yxq1l5y",
										"0wqxezfjh9u"
									],
									"value": query.keyword || ''
								},
								"fields": [
									"uzze6x8nxxzHeaderName",
									"885kt2czitt",
									"l6veducif7d",
									"pkegrllxfey",
									"j0v1yxq1l5y",
									"09gjeiurugq",
									"q93c6g227n6",
									"e567nznurog",
									"0wqxezfjh9u"
								],
								"filter": {
									"rel": "and",
									"rules": []
								},
								"summary": [
									{
										"field": "uzze6x8nxxzHeaderName",
										"summary": "all"
									},
									{
										"field": "e567nznurog",
										"summary": "sum"
									}
								],
								"sort": [
									{
										"field": "uzze6x8nxxzHeaderCreateTime",
										"number": "jl5fu6lbna2",
										"order": "descend",
										"orderType": "DESC"
									}
								],
								"mobileOptions": null,
								"context": {}
							},
							"context": {
								"lang": null
							}
						};

						// 与我有关的 研发任务
						if (state.involved) {
							params.params.filter.rules.push({
								"number": "x17ylktt0za",
								"rel": "or",
								"rules": [
									{
										"number": "bqy2lv1swwr",
										"lType": "field",
										"lValue": [
											"uzze6x8nxxzHeader",
											"l6veducif7d"
										],
										"op": "in",
										"rType": "constant",
										"rValue": [
											{
												"value": USER_INFO.get('id'),
												"number": USER_INFO.get('number'),
												"label": USER_INFO.get('name'),
												"objectNumber": "sysUser"
											}
										]
									},
									{
										"number": "w63dar6u7rc",
										"lType": "field",
										"lValue": [
											"uzze6x8nxxzHeader",
											"ydc3y16bjzw"
										],
										"op": "contains",
										"rType": "constant",
										"rValue": [
											{
												"value": USER_INFO.get('id'),
												"number": USER_INFO.get('number'),
												"label": USER_INFO.get('name'),
												"objectNumber": "sysUser"
											}
										]
									},
									{
										"number": "92o07r5w4ki",
										"lType": "field",
										"lValue": [
											"uzze6x8nxxzHeader",
											"uzze6x8nxxzHeaderCreator"
										],
										"op": "in",
										"rType": "constant",
										"rValue": [
											// "1594888324594606163"
											USER_INFO.get('id')
										]
									}
								]
							});
						}

						// 状态筛选
						if (state.status) {
							const settingStatus = Object.keys(state[`setting.status.${ this.object }`]);
							if (settingStatus.length) {
								params.params.filter.rules.push({
									"number": "nzu45djw3nr",
									"rel": "and",
									"rules": [
										{
											"number": "lcuyzo8ytvm",
											"lType": "field",
											"lValue": [
												"uzze6x8nxxzHeader",
												"885kt2czitt"
											],
											"op": "in",
											"rType": "constant",
											"rValue": settingStatus
										}
									]
								});
							}
						}

						return params;
					}
				})(),
			},
			{
				name: '部门任务',
				object: 'heemdyu3ggi',
				viewNumber: 'jjh9bh45jea',
				// context: { flowFlag: true },
				checked: false,
				render: (view, records, options) => {
					options = { from: 'search', ...options };
					if (!view || !records || !records.length) {
						return '';
					}
					return `
<table class="y-app-table">
	<caption class="y-app-table__caption">${ view.name }</caption>
	<colgroup>
		<col style="width: 40px;" />
		<col style="width: 40px;" />
		<col style="width: 67px;" />
		<col style="width: 80px;" />
		<col style="width: auto;min-width: 400px;max-width: 900px;" />
		<col style="width: 160px;" />
		<col style="width: 140px;" />
		<col style="width: 1%;" />
	</colgroup>
	${ records.map((item, index) => {
		if (!item.bookmark && !item.object) {
			item.bookmark = {
				object: view.object,
				viewNumber: view.viewNumber,
				project: '',
				name: item[view.object +'Header_f_bq54vn'] || item[view.object +'Header_name'],
				resId: item[view.object +'Header_id'],
				creator: item[view.object +'Header_creatorName'],
				players: renderPlayers(item[view.object +'Header_f_axzi2cName']),
				createTime: formatDate(item[view.object +'Header_createTime']),
				updateTime: formatDate(item[view.object +'Header_updateTime']),
				devStatus: item[view.object +'Header_f_bjzbdaName'],
				type: item[view.object +'Header_f_retjgaName'],
				priority: item[view.object +'Header_f_ft8ivjName'],
			};
			item.bookmark = trimObject(item.bookmark);
			if (view.context) {
				item.bookmark.context = view.context;
			}
			item.bookmark.title = (item.bookmark.project ? `【${ item.bookmark.project }】` : '') + item.bookmark.name;
			item.bookmark.url = renderLinkHref(item.bookmark);
			for (var prop in item.bookmark) {
				item[prop] = item.bookmark[prop];
			}
		};
		item.starred = this.BOOKMARKS.has(item);
		return `
<tr>
	<td>
		<a class="y-app-btn y-app-btn-icon y-app-action" data-from="${ options.from }" data-action="prevent.star" data-object="${ view.object }" data-index="${ index }" data-id="${ item.resId }" title="${ item.starred ? '取消收藏' : '收藏' }">${ ICONS[item.starred ? 'starred' : 'star'] }</a>
	</td>
	<td>
		<a target="_blank" href="${ item.url }" class="y-app-btn y-app-btn-icon y-app-action" data-action="prevent.copy" data-project="${ item.project }" data-name="${ item.name }" data-title="${ item.title }" title="复制链接">${ ICONS.copy }</a>
	</td>
	<td><span class="text-ellipsis" title="创建人：${ item.creator }&#13;参与人：${ item.players }"><a href="#/search?keyword=${ encodeURIComponent(item.creator) }" title="创建人：${ item.creator }&#13;参与人：${ item.players }&#13;&#13;点击搜索“${ item.creator }”创建的任务">${ item.creator }</a></span></td>
	<td><span class="text-ellipsis" title="任务状态：${ item.devStatus }">${ item.devStatus }</span></td>
	<td>
		<a target="_blank" href="${ item.url }" class="y-app-link y-app-action" data-from="${ options.from }" data-action="prevent.openDrawer" data-object="${ view.object }" data-index="${ index }" data-id="${ item.resId }">${ item.name }</a>
	</td>
	<td><span title="创建时间：${ item.createTime }&#13;更新时间：${ item.updateTime }">${ item.updateTime }</span></td>
	<td><span title="优先级：${ item.priority }">${ item.priority }</span></td>
	<td>&nbsp;</td>
</tr>
`.trim();
	}).join('') }
</table>
`.trim();
				},
				status() {
					return [
						{
							"value": "fu91fdhi7rp",
							"label": "未开始",
						},
						{
							"value": "zjrwyaws59s",
							"label": "进行中",
						},
						{
							"value": "5lnbqpwb8gc",
							"label": "已完成",
						},
						{
							"value": "c34tyj26wvk",
							"label": "关闭",
						},
						{
							"value": "z1dkt4efztx",
							"label": "长期任务",
						}
					];
				},
				params: (() => {
					const that = this;
					return function params(query) {
						const { state } = that;

						const params = {
							"params": {
								"object": "heemdyu3ggi",
								"viewType": "viewList",
								"size": query.size || 50,
								"page": query.page || 1,
								"search": {
									"type": "every",
									"fields": [
										"heemdyu3ggiHeaderName",
										"epi1wxmdd04",
										"yypr9li882x",
										"uk5x29bns2z",
										"trde6pekcxt",
										"n6abi2jey2b",
										"heemdyu3ggiHeaderCreator",
										"wd2ipbnksc1"

									],
									"value": query.keyword || ''
								},
								"fields": [
									"dmp03a0i2r4",
									"epi1wxmdd04",
									"yypr9li882x",
									"uk5x29bns2z",
									"trde6pekcxt",
									"4sjyfqn7n11",
									"n6abi2jey2b",
									"heemdyu3ggiHeaderCreator",
									"heemdyu3ggiHeaderCreateTime",
									"wd2ipbnksc1"
								],
								"filter": {
									"rel": "and",
									"rules": []
								},
								"summary": [],
								"sort": [],
								"mobileOptions": null,
								"context": {}
							},
							"context": {}
						};

						// 与我有关的 部门任务
						if (state.involved) {
							params.params.filter.rules.push({
								"number": "vr6sdxlcgud",
								"rel": "or",
								"rules": [
									{
										"number": "bb3s2x055g0",
										"lType": "field",
										"lValue": [
											"heemdyu3ggiHeader",
											"yypr9li882x"
										],
										"op": "in",
										"rType": "constant",
										"rValue": [
											{
												"value": USER_INFO.get('id'),
												"number": USER_INFO.get('number'),
												"label": USER_INFO.get('name'),
												"objectNumber": "sysUser"
											}
										]
									},
									{
										"number": "twjnqnq5m1q",
										"lType": "field",
										"lValue": [
											"heemdyu3ggiHeader",
											"heemdyu3ggiHeaderCreator"
										],
										"op": "in",
										"rType": "constant",
										"rValue": [
											// "1594888324594606163"
											USER_INFO.get('id')
										]
									},
									{
										"number": "s442b89do2x",
										"lType": "field",
										"lValue": [
											"heemdyu3ggiHeader",
											"zqybtgx4h1f"
										],
										"op": "contains",
										"rType": "constant",
										"rValue": [
											{
												"value": USER_INFO.get('id'),
												"number": USER_INFO.get('number'),
												"label": USER_INFO.get('name'),
												"objectNumber": "sysUser"
											}
										]
									}
								]
							});
						}

						// 状态筛选
						if (state.status) {
							const settingStatus = Object.keys(state[`setting.status.${ this.object }`]);
							if (settingStatus.length) {
								params.params.filter.rules.push({
									"number": "f7e1v2oja5i",
									"rel": "and",
									"rules": [
										{
											"number": "pc9y1rs4thh",
											"lType": "field",
											"lValue": [
												"heemdyu3ggiHeader",
												"epi1wxmdd04"
											],
											"op": "in",
											"rType": "constant",
											"rValue": settingStatus
										}
									]
								});
							}
						}

						return params;
					}
				})(),
			},
			{
				name: '工时',
				object: 'wttvmb5t6aj',
				viewNumber: 'dyvk29qcvan',
				// context: { flowFlag: true },
				checked: false,
				render: (view, records, options) => {
					options = { from: 'search', ...options };
					if (!view || !records || !records.length) {
						return '';
					}
					return `
<table class="y-app-table">
	<caption class="y-app-table__caption">${ view.name }</caption>
	<colgroup>
		<col style="width: 40px;" />
		<col style="width: 40px;" />
		<col style="width: 67px;" />
		<col style="width: 80px;" />
		<col style="width: auto;min-width: 400px;max-width: 900px;" />
		<col style="width: 160px;" />
		<col style="width: 140px;" />
		<col style="width: 1%;" />
	</colgroup>
	${ records.map((item, index) => {
		if (!item.bookmark && !item.object) {
			item.bookmark = {
				object: view.object,
				viewNumber: view.viewNumber,
				project: item[view.object +'Header_f_umxhcwName'],
				name: item[view.object +'Header_f_j5uc3d'] || item[view.object +'Header_name'],
				resId: item[view.object +'Header_id'],
				creator: item[view.object +'Header_creatorName'],
				createTime: formatDate(item[view.object +'Header_createTime']),
				updateTime: formatDate(item[view.object +'Header_updateTime']),
				// 工作类别
				type: item[view.object +'Header_f_yk7nu6Name'],
				// 任务类别
				taskType: item[view.object +'Header_f_vxrv3uName'],
				// 工作时长
				duration: item[view.object +'Header_f_nssifb'],
			};
			item.bookmark = trimObject(item.bookmark);
			if (view.context) {
				item.bookmark.context = view.context;
			}
			item.bookmark.title = (item.bookmark.project ? `【${ item.bookmark.project }】` : '') + item.bookmark.name;
			item.bookmark.url = renderLinkHref(item.bookmark);
			for (var prop in item.bookmark) {
				item[prop] = item.bookmark[prop];
			}
		};
		item.starred = this.BOOKMARKS.has(item);
		return `
<tr>
	<td>
		<a class="y-app-btn y-app-btn-icon y-app-action" data-from="${ options.from }" data-action="prevent.star" data-object="${ view.object }" data-index="${ index }" data-id="${ item.resId }" title="${ item.starred ? '取消收藏' : '收藏' }">${ ICONS[item.starred ? 'starred' : 'star'] }</a>
	</td>
	<td>
		<a target="_blank" href="${ item.url }" class="y-app-btn y-app-btn-icon y-app-action" data-action="prevent.copy" data-project="${ item.project }" data-name="${ item.name }" data-title="${ item.title }" title="复制链接">${ ICONS.copy }</a>
	</td>
	<td><span class="text-ellipsis" title="登记人：${ item.creator }"><a href="#/search?keyword=${ encodeURIComponent(item.creator) }" title="登记人：${ item.creator }&#13;&#13;点击搜索“${ item.creator }”登记的工时">${ item.creator }</a>${ item.creator }</span></td>
	<td><span class="text-ellipsis" title="登记时长：${ item.duration }&#13;登记时间：${ item.createTime }&#13;登记内容：${ item.name }">${ item.duration }</span></td>
	<td>
		<a target="_blank" href="${ item.url }" class="y-app-link y-app-action" data-from="${ options.from }" data-action="prevent.openDrawer" data-object="${ view.object }" data-index="${ index }" data-id="${ item.resId }">${ item.title }</a>
	</td>
	<td><span title="登记时间：${ item.createTime }&#13;更新时间：${ item.updateTime }">${ item.createTime }</span></td>
	<td><span title="工作类别：${ item.type }">${ item.type }</span></td>
<!-- 	<td><span title="任务类别：${ item.taskType }">${ item.taskType }</span></td> -->
	<td>&nbsp;</td>
</tr>
`.trim();
	}).join('') }
</table>
`.trim();
				},
				params: (() => {
					const that = this;
					return function params(query) {
						const { state } = that;

						const params = {
							"params": {
								"object": "wttvmb5t6aj",
								"viewType": "viewList",
								"size": query.size || 50,
								"page": query.page || 1,
								"search": {
									"type": "every",
									"fields": [
										"dpz01mdgyt0",
										"3t7v5gnb2ex",
										"l377kywr283",
										"hivk18of39l",
										"77aqr706vif",
										"krmlj1gyytz",
										"9sgsp65lb5l"
									],
									"value": query.keyword || ''
								},
								"fields": [
									"s3yq11rqfg8",
									"dpz01mdgyt0",
									"3t7v5gnb2ex",
									"l377kywr283",
									"p7gyupeuiu4",
									"hivk18of39l",
									"77aqr706vif",
									"krmlj1gyytz",
									"9sgsp65lb5l",
									"8rj5nj8ixbo",
									"egwokhoyckf"
								],
								"filter": {
									"rel": "and",
									"rules": []
								},
								"summary": [],
								"sort": [
									{
										"field": "s3yq11rqfg8",
										"number": "umcedfwmj0k",
										"order": "descend",
										"orderType": "DESC"
									}
								],
								"mobileOptions": null,
								"context": {}
							},
							"context": {}
						};

						// 与我有关的 我登记的
						if (state.involved) {
							params.params.filter.rules.push({
								"number": "flqvdo4ufwo",
								"rel": "and",
								"rules": [
									{
										"number": "tozq0jfutr8",
										"lType": "field",
										"lValue": [
											"wttvmb5t6ajHeader",
											"dpz01mdgyt0"
										],
										"op": "in",
										"rType": "constant",
										"rValue": [
											{
												"value": USER_INFO.get('id'),
												"number": USER_INFO.get('number'),
												"label": USER_INFO.get('name'),
												"objectNumber": "sysUser"
											}
										]
									}
								]
							});
						}

						return params;
					}
				})(),
			}
		];

		// 工时视图
		#VIEW_MANHOUR = {
			object: 'wttvmb5t6aj',
			name: '工时',
			params(query) {
				return {
					"params": {
						"object": "wttvmb5t6aj",
						"viewType": "viewList",
						"size": query.size || 50,
						"page": query.page || 1,
						"search": {
								"type": "every",
								"fields": [
										"dpz01mdgyt0"
								],
								"value": query.userName || ''
						},
						"fields": [
								"wttvmb5t6ajNumber",
								"s3yq11rqfg8",
						],
						"filter": {
								"rel": "and",
								"rules": []
						},
						"sort": [
								{
										"field": "s3yq11rqfg8",
										"number": "umcedfwmj0k",
										"order": "descend",
										"orderType": "DESC"
								}
						],
					}
				};
			},
			render(data) {
				data = {today: 0, yestoday: 0, now: '', duration: '', ...data };
				data.now = (new Date()).toLocaleString('zh-CN', { hour12: false });
				return `
<li title="今日登记工时">今日：${ data.today }小时 <span class="y-app-manhour__countdown" title="刷新倒计时">${ data.countdown }s</span></li>
<li title="昨日登记工时">昨日：${ data.yestoday }小时</li>
<li title="当前上班时长">${ data.duration }</li>
<li title="当前时间">时间：${ data.now }</li>
`.trim();
			}
		};

		// 成员工时统计视图
		#VIEW_MANHOUR_MEMBER = {
			Users: null,
			async getUsers() {
				const parse = (data) => {
					var users = [];


					// 3位
					// 上海研发
					users['3_deptId_277'] = '上海'; // 上海 UED组 （雷凯）

					users['3_deptId_596'] = '上海'; // 上海 设计部
					users['3_deptId_570'] = '上海'; // 上海 产品一组
					users['3_deptId_571'] = '上海'; // 上海 产品二组
					users['3_deptId_600'] = '上海'; // 上海 产品三组
					users['3_deptId_572'] = '上海'; // 上海 产品运营组
					users['3_deptId_574'] = '上海'; // 上海 数据组
					users['3_deptId_575'] = '上海'; // 上海 运维组
					users['3_deptId_272'] = '上海'; // 上海 研发一部
					users['3_deptId_273'] = '上海'; // 上海 研发二部
					users['3_deptId_274'] = '上海'; // 上海 前端开发部

					// 苏州研发
					users['3_deptId_306'] = '苏州'; // 苏州 研发中心
					users['3_deptId_308'] = '苏州'; // 苏州 技术部
					users['3_deptId_440'] = '苏州'; // 苏州 后端组
					users['3_deptId_441'] = '苏州'; // 苏州 前端组
					users['3_deptId_307'] = '苏州'; // 苏州 产品组

					// 深圳 易搭云
					users['3_deptId_699'] = '深圳'; // 深圳 易搭云 技术组
					users['3_deptId_700'] = '深圳'; // 深圳 易搭云 技术组

					// 6位
					// 上海研发
					users['6_deptId_166897'] = '上海'; // 上海 UED组 （雷凯）

					users['6_deptId_299686'] = '上海'; // 上海 设计部
					// users['6_deptId_570'] = '上海'; // 上海 产品一组 // 特殊
					users['6_deptId_290390'] = '上海'; // 上海 产品一组
					users['6_deptId_290391'] = '上海'; // 上海 产品二组
					users['6_deptId_309064'] = '上海'; // 上海 产品三组
					users['6_deptId_290392'] = '上海'; // 上海 产品运营组
					users['6_deptId_290386'] = '上海'; // 上海 数据组
					users['6_deptId_290387'] = '上海'; // 上海 运维组
					users['6_deptId_166892'] = '上海'; // 上海 研发一部
					users['6_deptId_166893'] = '上海'; // 上海 研发二部
					users['6_deptId_166894'] = '上海'; // 上海 前端开发部

					// 苏州研发
					users['6_deptId_117148'] = '苏州'; // 苏州 研发中心
					users['6_deptId_117377'] = '苏州'; // 苏州 技术部
					users['6_deptId_216505'] = '苏州'; // 苏州 后端组
					users['6_deptId_216507'] = '苏州'; // 苏州 前端组
					users['6_deptId_117376'] = '苏州'; // 苏州 产品组




					var locale = null;
					var user = null;
					var tmp = [];

					// console.log('data::', data)
					// 6位
					data.forEach((item) => {

						// item.sysUserHeader_name = item.wttvmb5t6ajHeader_f_er3q3jName;
						// item.sysUserHeader_userState = item.wttvmb5t6ajHeader_f_ivhrcy;

						// console.log('x:', item.sysUserHeader_mainDeptName, item.sysUserHeader_mainDeptNumber)
						// /if (item.sysUserHeader_userStateNumber !== 'sys_user_state_deactivate') {
						// if (item.sysUserHeader_userStateName !== '已停用') {
						// console.log('user:', item.sysUserHeader_name, item.sysUserHeader_mainDeptNumber);
						if (item.sysUserHeader_userState && item.sysUserHeader_userState.number !== 'sys_user_state_deactivate') {
						// if (item.sysUserHeader_userState && item.sysUserHeader_userState.value === 'sys_user_state_active') {
							locale = users['6_deptId_'+ item.sysUserHeader_mainDeptNumber];
							if (locale) {
								user = {
									id: item.id,
									name: item.sysUserHeader_name,
									number: item.sysUserHeader_number,
									deptName: item.sysUserHeader_mainDeptName,
									deptNumber: item.sysUserHeader_mainDeptNumber,
									locale
								};
								tmp.push(user);
								users.push(user);

								// group of current user
								users['user_'+ user.name] = users['user_'+ user.name] || [];
								users['user_'+ user.name]['user_'+ user.name]= user;
								users['user_'+ user.name].push(user);

								// group of mainDeptName
								users[locale +'_'+ user.deptName] = users[locale +'_'+ user.deptName] || [];
								users[locale +'_'+ user.deptName]['user_'+ user.name]= user;
								users[locale +'_'+ user.deptName].push(user);

								// group of locale
								users[locale] = users[locale] || [];
								users[locale]['user_'+ user.name]= user;
								users[locale].push(user);
							}
						}
					});

					if (tmp.length) {
						return users;
					}

					// 3位
					data.forEach((item) => {
						// console.log('x:', item.sysUserHeader_mainDeptName, item.sysUserHeader_mainDeptNumber)
						// /if (item.sysUserHeader_userStateNumber !== 'sys_user_state_deactivate') {
						// if (item.sysUserHeader_userStateName !== '已停用') {
						if (item.sysUserHeader_userState && item.sysUserHeader_userState.number !== 'sys_user_state_deactivate') {
						// if (item.sysUserHeader_userState && item.sysUserHeader_userState.value === 'sys_user_state_active') {
							locale = users['3_deptId_'+ item.sysUserHeader_mainDeptNumber];
							if (locale) {
								user = {
									id: item.id,
									name: item.sysUserHeader_name,
									number: item.sysUserHeader_number,
									deptName: item.sysUserHeader_mainDeptName,
									deptNumber: item.sysUserHeader_mainDeptNumber,
									locale
								};
								tmp.push(user);
								users.push(user);

								// group of current user
								users['user_'+ user.name] = users['user_'+ user.name] || [];
								users['user_'+ user.name]['user_'+ user.name]= user;
								users['user_'+ user.name].push(user);

								// group of mainDeptName
								users[locale +'_'+ user.deptName] = users[locale +'_'+ user.deptName] || [];
								users[locale +'_'+ user.deptName]['user_'+ user.name]= user;
								users[locale +'_'+ user.deptName].push(user);

								// group of locale
								users[locale] = users[locale] || [];
								users[locale]['user_'+ user.name]= user;
								users[locale].push(user);
							}
						}
					});

					return users;
				};

				if (this.Users && this.Users.length) {
					return Promise.resolve(this.Users);
				}

				const params = {
					"params": {
						"object": "sysUser",
						"fields": [
							"sysUserHeaderName",
							"sysUserHeaderDept",
							"sysUserHeaderPhone",
							"sysUserHeaderEmail",
							"sysUserHeaderAvatar",
							"sysUserHeaderSurnameFirstChar",
							"sysUserHeaderId",
							"sysUserHeaderNumber"
						],
						"page": 1,
						"size": 90000,
						"sort": [
							{
								"field": "sysUserHeaderSurnameFirstChar",
								"order": "ascend"
							}
						],
						"context": {
							"originId": "1928463392407048192",
							"originObject": "wttvmb5t6aj",
							"originEntryId": null,
							"originEntryField": null
						}
					},
					"context": {
						"originId": "1928463392407048192",
						"originObject": "wttvmb5t6aj",
						"originEntryId": null,
						"originEntryField": null,
						"lang": null
					}
				};



				return await $fetch('/runtime/getList', params).then((res)=>{
					// console.log(res.data);
					this.Users = parse(res.data.records);
					//console.log('this.Users:', this.Users)
					return this.Users;
				}).catch((ex) => {
					console.error(`[ERROR]`, ex)
					return ex;
				});
			},
			async getManhours(groupby, monthRange) {
				await this.getUsers();

				if (groupby === 'me') {
					groupby = 'user_'+ USER_INFO.get('name');
				}
				if (groupby === 'all') {
					groupby = '';
				}
				const users = groupby ? this.Users[groupby] : this.Users;
				if (!users || !users.length) {
					console.error(`[ERROR]`, `可能是部门id调整变更`, { groupby, monthRange, users });
					return;
				}

				monthRange = monthRange || [ new Date('2024/11/1 00:00:00').getTime(), new Date('2023/12/31 23:59:59').getTime() ];

				const params = {
					"params": {
						"chartType": "cross_pivot",
						"chartSchema": {
							"dataSource": "wttvmb5t6aj",
							"dataSourceType": "form",
							"xDimension": [
								{
									"name": "登记人",
									// "number": "x1c52gfh2hi",
									"number": "name",
									"fieldType": "fieldString",
									"modelNumber": "wttvmb5t6ajHeader",
									"required": true,
									"options": {
										"listFlag": false
									},
									"field": [
										"wttvmb5t6ajHeader",
										"dpz01mdgyt0Name"
									]
								}
								/*,
								{
									"name": "工号",
									"number": "empno",
									"fieldType": "fieldString",
									"modelNumber": "wttvmb5t6ajHeader",
									"required": true,
									"options": {
										"listFlag": false
									},
									"field": [
										"wttvmb5t6ajHeader",
										"f_ghw77eNumber"
									]
								}*/
							],
							"yDimension": [
								{
									"name": "工作日期",
									// "number": "yubsrcxz2d1",
									"number": "date",
									"fieldType": "fieldDatetime",
									"modelNumber": "wttvmb5t6ajHeader",
									"required": true,
									"options": {
										"listFlag": true
									},
									"field": [
										"wttvmb5t6ajHeader",
										"s3yq11rqfg8"
									],
									"group": "date-day"
								}
							],
							"target": [
								{
									"name": "工时",
									// "number": "ts0ltoz3dkr",
									"number": "duration",
									"fieldType": "fieldInt",
									"modelNumber": "wttvmb5t6ajHeader",
									"required": false,
									"field": [
										"wttvmb5t6ajHeader",
										"p7gyupeuiu4"
									],
									"summaryType": "sum",
									"caculate": "noneCaculate",
									"formatter": {
										"format": "number",
										"chartType": "cross_pivot",
										"decimalUnit": 2,
										"quantityUnit": "none",
										"unitSuffix": "",
										"thousandSeparator": false
									}
								}
							],
							"sort": [
								{
									// "field": "yubsrcxz2d1",
									"field": "date",
									"order": "ascend",
									"sortType": "char",
									"number": "f6jrvfcdu7y"
								}
							],
							"globalFilter": {
								"number": "39nj4tcpcqj",
								"rel": "and",
								"rules": [
									{
										"lType": "field",
										"lValue": [
											"wttvmb5t6ajHeader",
											"s3yq11rqfg8"
										],
										"number": "skipeho6wr1",
										"op": "bt",
										"rType": "constant",
										rValue: monthRange,
										/*"rValue": [
											// 1696089600000,
											// 1698767999999
											// new Date('2023/10/1 00:00:00').getTime(),
											// new Date('2023/10/31 00:00:00').getTime(),
											new Date('2023/12/1 00:00:00').getTime(),
											new Date('2023/12/30 00:00:00').getTime(),
										]*/
									}
								]
							},
							"relatedConfig": {
								"targets": []
							},
							"filterNullFlag": true,
							"totalCol": true,
							"totalColConfig": {
								// "ts0ltoz3dkr": "SUM"
								"duration": "SUM"
							},
							"totalRow": false,
							"totalRowConfig": {
								// "ts0ltoz3dkr": "SUM"
								"duration": "SUM"
							},
							"showSubTotals": false,
							"computedFields": [],
							"computedTargets": []
						}
					},
					"context": {}
				};
				return await $fetch('/report/previewChart', params).then((res) => {
					const data = {
						users,
						dates: {},
						manhours: {},
						totals: {}
					};
					res.data.totalData.forEach((item) => {
						data.totals[item.name] = item;
					});
					res.data.chartData.forEach((item) => {
						data.dates[item.date] = item.date;
						if (users['user_'+ item.name]) {
							data.manhours[item.name +'_'+ item.date] = item;
						}
					});
					// console.log(data);
					return data;
				});
			},
			render(data) {
				if (!data || !Array.isArray(data.users) || !data.dates || !data.totals) {
					return '';
				}
				// console.log('data.dates:', data.dates);

				var item = null;
				var table = [];
				var thead = [];
				var tbody = [];
				const users = [ ...data.users ];
				// 分组排序
				users.sort((a, b) => {
					return (a.locale + a.deptName).localeCompare((b.locale + b.deptName));
				});
				users.forEach((user, rowIndex) => {
					user.duration = data.totals[user.name] ? data.totals[user.name].duration || '-' : '-';

					// 统计登记工时的天数
					user.days = 0;
					for (var date in data.dates) {
						item = data.manhours[user.name +'_'+ date]
						if (item && item.duration !== undefined) {
							user.days++;
						}
					}

					if (rowIndex === 0) {
						thead.push(`<tr class="y-app-table__manhour-sticky y-app-table__manhour-row-0">`);
						thead.push(`<th class="y-app-table__manhour-sticky y-app-table__manhour-col-0"><div class="y-app-table__manhour-cell">姓名</div></th>`);
						thead.push(`<th class="y-app-table__manhour-sticky y-app-table__manhour-col-1"><div class="y-app-table__manhour-cell">地点</div></th>`);
						thead.push(`<th class="y-app-table__manhour-sticky y-app-table__manhour-col-2"><div class="y-app-table__manhour-cell">部门/组</div></th>`);
						thead.push(`<th class="y-app-table__manhour-sticky y-app-table__manhour-col-3"><div class="y-app-table__manhour-cell" title="有登记工时天数的合计">天数</div></th>`);
						thead.push(`<th class="y-app-table__manhour-sticky y-app-table__manhour-col-4"><div class="y-app-table__manhour-cell" title="工时合计">工时</div></th>`);
					}
					tbody.push(`<tr>`);
					tbody.push(`<td class="y-app-table__manhour-sticky y-app-table__manhour-col-0"><div class="y-app-table__manhour-cell" title="${ (rowIndex + 1) }">${ USER_INFO.get('name') === user.name ? `<b>${ user.name }</b>` : user.name }</div></td>`);
					tbody.push(`<td class="y-app-table__manhour-sticky y-app-table__manhour-col-1"><div class="y-app-table__manhour-cell">${ user.locale }</div></td>`);
					tbody.push(`<td class="y-app-table__manhour-sticky y-app-table__manhour-col-2"><div class="y-app-table__manhour-cell">${ user.deptName }</div></td>`);
					tbody.push(`<td class="y-app-table__manhour-sticky y-app-table__manhour-col-3"><div class="y-app-table__manhour-cell">${ user.days }</div></td>`);
					tbody.push(`<td class="y-app-table__manhour-sticky y-app-table__manhour-col-4"><div class="y-app-table__manhour-cell">${ user.duration }</div></td>`);

					for (var date in data.dates) {
						item = data.manhours[user.name +'_'+ date] || {};
						item.d = new Date(date.replace(/-/g, '/'));
						item.dStr = date;
						item.str = date.replace(/-|\//g, '');
						// HOLIDAYADJUSTMENT
						item.date = item.d.getDate();
						item.dateStr = item.date.toString().padStart(2, 0);
						item.month = item.d.getMonth() + 1;
						item.monthStr = item.month.toString().padStart(2, 0);
						item.year = item.d.getFullYear();
						item.day = item.d.getDay();
						item.dayStr = ['日','一','二','三','四','五','六'][item.day];
						item.isWeekend = item.day === 0 || item.day === 6;

						item.isPatch = false;
						item.isHoliday = false;
						item.classList = [];

						if (HOLIDAYADJUSTMENT[item.str]) {
							if (HOLIDAYADJUSTMENT[item.str] === '+') {
								item.isHoliday = true;
								item.classList.push('is-holiday');
								// console.log(`item.isHoliday: ${ item.str }`);
							}
							if (HOLIDAYADJUSTMENT[item.str] === '-') {
								item.isPatch = true;
								item.classList.push('is-patch');
								// console.log(`item.isPatch: ${ item.str }`);
							}
						} else {
							if (item.isWeekend) {
								item.isHoliday = true;
								// console.log(`item.isWeekend: ${ item.str }`);
								item.classList.push('is-weekend');
							}
						}

						item.duration = item.duration || '-';
						item.unqualified = false;
						if (!item.isHoliday && (item.duration === '-' || item.duration !== '-' && parseFloat(item.duration) < 8) ) {
							item.unqualified = true;
						}

						if (rowIndex === 0) {
							thead.push(`<th class="${ item.classList.join(' ') }"><div class="y-app-table__manhour-cell" title="${ item.year }年${ item.month }月${ item.date }日 (星期${ item.dayStr })">${ item.dStr }</div></th>`);
						}

						tbody.push(`<td class="${ item.classList.join(' ') }${ item.unqualified ? ' is-unqualified' : '' }"><div class="y-app-table__manhour-cell" title="${ item.year }年${ item.month }月${ item.date }日 (星期${ item.dayStr })">${ item.duration }</div></td>`);

						// console.log('item:', item);
					}

					if (rowIndex === 0) {
						thead.push(`<\/tr>`);
					}
					tbody.push(`<\/tr>`);
				});

				if (thead.length) {
					thead.unshift('<thead>');
					thead.push('</thead>');
					table.push(thead.join(''));
				}

				if (tbody.length) {
					tbody.unshift('<tbody>');
					tbody.push('</tbody>');
					table.push(tbody.join(''));
				}
				if (table.length) {
					table.unshift('<table class="y-app-table__manhour y-app-table__manhour-striped">');
					table.push('</table>');
				}

				return table.join('');
			}
		};

		constructor() {

			console.log(`[OK] 初始化 ...`);

			this.#VIEWS.forEach((item) => {
				this.#VIEWS[item.object] = item;
				this.setState({[item.object]: item.checked});
			});

			this.loadState();

			this.init();

			this.BOOKMARKS = new BOOKMARKS();

			if (window.top !== window) {
				this.PLAYERS = new PLAYERS();

				this.BTN_SHARE = new BTN_SHARE();
			}

		}

// @ api
		getUserInfo(success) {
			return new Promise((resolve, reject) => {
				// $fetch('https://api.yidayun.com/account/get-session-info', {
				// $fetch('https://web.yidayun.com/api/account/get-session-info', {
				$fetch('/account/get-session-info', {
					context: {},
					params: {}
				}).then((res) => {
					const data = res.data ? res.data : res;
					if (data && data.account) {
						data.id = data.user.id;
						data.name = data.user.name;
						data.number = data.user.number;
						data.phone = data.user.phone;
						data.companyName = data.workspace.name;
						data.key = `${ data.workspace.number }-${ data.token }`;
						data.keyTab = `${ data.key }-CUR_TAB`;
						data.keyTabs = `${ data.key }-TABS`;
						USER_INFO.set(data);
						if (typeof success === 'function') {
							success(data, res);
						}
						resolve(data);
					} else {
						console.error(`account info error`, res);
						reject(res);
					}
				}).catch((err) => {
					console.warn('[WARN]', err);
					reject(err);
				});
			});
		}

		getManhour() {
			return new Promise((resolve, reject) => {
				const userName = USER_INFO.get('name');
				const userNumber = USER_INFO.get('number');

				const view = this.#VIEW_MANHOUR;

				const now = new Date();

				const data = {
					userName,
					userNumber,
					today: 0,
					yestoday: 0
				};

				// data.todayTime = `${ now.getFullYear() }${ (now.getMonth()+1).toString().padStart(2, 0) }${ now.getDate().toString().padStart(2, 0) }`;
				data.todayTime = `${ now.getFullYear() }${ (now.getMonth()+1) }${ now.getDate() }`;
				now.setDate(now.getDate()-1);
				// data.yestodayTime = `${ now.getFullYear() }${ (now.getMonth()+1).toString().padStart(2, 0) }${ now.getDate().toString().padStart(2, 0) }`;
				data.yestodayTime = `${ now.getFullYear() }${ (now.getMonth()+1) }${ now.getDate() }`;

				$fetch('/runtime/getList', view.params({ userName })).then((res) => {
					const records = res.data?.records || [];
					let userNumber = '';
					let workdate = '';
					records.forEach((item) => {
						userNumber = item[view.object +'Header_creatorNumber'];
						if (data.userNumber === userNumber) {
							workdate = new Date(item[view.object +'Header_f_g29exe']).toLocaleString('zh-CN', {hour12: false}).replace(/\//g,'').split(' ')[0];
							// console.log('workdate', item[view.object +'Header_f_g29exe'], workdate, 'Header_f_nssifb', item[view.object +'Header_f_nssifb']);
							if (workdate === data.todayTime) {
								data.today = parseFloat(data.today) + parseFloat(item[view.object +'Header_f_nssifb']);
							}
							if (workdate === data.yestodayTime) {
								data.yestoday = parseFloat(data.yestoday) + parseFloat(item[view.object +'Header_f_nssifb']);
							}
						}
					});
					// console.log('manhour:', data);
					resolve(data);
				}).catch((error) => {
					console.error('[ERROR]', error);
					reject(data);
				});
			});
		}

		getShareLink(query) {
			if (typeof query !== 'object') {
				return Promise.reject('params error');
			}
			return $fetch('/share/getShareLink', {
				context: {},
				params: { objectNumber: query.object, dataId: query.resId }
			}).then((res) => {
				console.log('getShareLink:', res.data);
				if (typeof res.data === 'object') {
					query.url = res.data.privateLink || res.data.publicLink || JSON.stringify(res.data);
				} else {
					query.url = res.data;
				}
				query.resId = query.resId;
				query.objectNumber = query.object;
				return query;
			}).catch((err) => {
				console.warn('[WARN]', err);
				return err;
			})
		}

// @ utils

		getRecordByElement = ($el, success, error) => {
			const VIEWS = this.#VIEWS;

			const BOOKMARKS = this.BOOKMARKS;

			const getRecord = ($el) => {
				const data = { status: true, message: 'ok' };
				if (!$el) {
					data.status = false;
					data.message = '[ERROR] element not found';
					console.error(data.message);
					return data;
				}
				data.resId = $el.dataset.resId || $el.dataset.id;
				data.via = $el.dataset.via;
				data.from = $el.dataset.from;
				data.action = $el.dataset.action;
				if (data.action.indexOf('.') > -1) {
					data.action = data.action.split('.')[1] || '';
				}
				data.object = $el.dataset.object;
				data.index = $el.dataset.index;
				if (data.index !== undefined) {
					data.index = parseInt(data.index);
				}
				// console.log('y-app-action:', data);
				if (data.object === undefined || data.index === undefined) {
					data.status = false;
					data.message = `[ERROR] 参数异常： object: ${ data.object }, index: ${ data.index }`;
					console.error(data.message);
					return data;
				}
				if (data.from === 'search') {
					data.record = VIEWS[data.object].records[data.index];
				}
				if (!data.record && data.resId) {
					// data.record = BOOKMARKS.get(data.object, data.index);
					data.record = BOOKMARKS.getById(data.object, data.resId);
				}
				// console.log('data.record:', data.record, data);
				data.record = data.record || { resId: data.resId };
				if (data.record) {
					if (data.record.bookmark) {
						data.record.starred = data.record.bookmark.starred || data.record.starred;
					}
					data.record.via = data.record.via || data.via;
					data.record.from = data.record.from || data.from;
					data.record.index = data.record.index || data.index;
					data.record.object = data.record.object || data.object;
				}
				return data;
			}

			if (typeof success === 'function') {
				const data = getRecord($el);
				if (data.status) {
					success(data);
				} else {
					if (typeof error === 'function') {
						error(data);
					}
				}
				return data;
			} else {
				return new Promise((resolve, reject) => {
					const data = getRecord($el);
					if (data.status) {
						resolve(data);
					} else {
						reject(data);
					}
				});
			}

			return new Promise((resolve, reject) => {
				let message = 'record not found';
				let record = null;
				const from = $el.dataset.from;
				const action = $el.dataset.action;
				const object = $el.dataset.object;
				let index = $el.dataset.index;
				if (index !== undefined) {
					index = parseInt(index);
				}
				let resId = $el.dataset.resId || $el.dataset.id;
				// console.log('y-app-action:', from, action, object, index);
				if (object === undefined || index === undefined) {
					message = `[ERROR] 参数异常： object: ${ object }, index: ${ index } `
					console.error(message);
					return reject({ message });
				}
				if (from === 'search') {
					record = VIEWS[object].records[index];
				} else {
					record = BOOKMARKS.getById(object, resId) || BOOKMARKS.get(object, index);
				}
				if (typeof record === 'object') {
					if (typeof callback === 'function') {
						callback(record);
					}
					return resolve(record);
				}
				return reject({ message });
			});
		}

		getWorkingHours(options) {
			const defaultOptions = {
				interval: 0,
				prefix: undefined,
				duration: '',
				before() {},
				after() {}
			}
			options = Object.assign({}, defaultOptions, options);

			const base = new Date();
			base.setHours(9);
			base.setMinutes(0);
			base.setSeconds(0);
			base.setMilliseconds(0);

			const getNow = () => {
				return new Date();
				// return new Date('2023/10/19 13:10:12');
				// return new Date('2023/10/19 12:30:12');
			}

			const current = new Date();
			if (base.getHours() - current.getHours() > 2) {
				base.setDate(base.getDate()-1);
			}

			const calc = function() {
				if (typeof options.before === 'function') {
					options.before(options, this);
				}
				const now = getNow();
				const start = new Date(base.getTime());
				// reset start time
				start.setMinutes(0);
				start.setSeconds(0);
				start.setMilliseconds(0);

				// 9点 上班
				if (options.start == '9:00') {
					start.setMinutes(0);
				}

				// 9点30分 上班
				if (options.start == '9:30') {
					start.setMinutes(30);
				}

				// 午餐时间 不计时
				if (now.getHours() == 12) {
					now.setHours(12);
					now.setMinutes(0);
					now.setSeconds(0);
					now.setMilliseconds(0);
				}

				// 13点开始上班，减去 午餐时间 1小时
				if (now.getHours() > 12) {
					now.setMinutes(now.getMinutes() - 60);
				}

				let diffText = [];
				if (start < now) {
					var diff = now.getTime() - start.getTime();
					const days = Math.floor(diff / (24 * 3600 * 1000));
					// 时
					diff = diff % (24 * 3600 * 1000);
					const hours = Math.floor(diff / (3600 * 1000));
					// 分
					diff = diff % (3600 * 1000);
					const minutes = Math.floor(diff / (60 * 1000));
					// 秒
					diff = diff % (60*1000);
					const seconds = Math.round(diff / 1000);

					diffText.push(hours +'小时');
					diffText.push(minutes +'分钟');
					diffText.push(seconds +'秒');
					diffText = `${ (options.prefix || '') }${ diffText.join(' ') }`;
				} else {
					diffText = '上班时间：'+ start.toLocaleTimeString();
				}
				options.duration = diffText;
				if (typeof options.after === 'function') {
					options.after(options, this);
				}
			}

			calc();
			if (options.interval) {
				setInterval(function() {
					calc();
				}, options.interval);
			}
		}

// @ methods

		// 注入全局样式
		injectGlobalStyle() {
			const cssRules = () => {
				return `
body>svg{
	position: absolute;
	width: 0px;
	height: 0px;
	overflow: hidden;
}

/* reset layout */
#y-app ~ #root{
	padding-top: 80px;
}
#y-app ~ #root .ant-pro-sider.ant-layout-sider.ant-pro-sider-fixed{
	top: 80px !important;
}

/* 调整分享详情页 高度 */
#y-app ~ #root .eb-share-form-container{
	height: calc(100vh - 80px) !important;
}
/* 调整左侧菜单高度 */
#y-app ~ #root .ant-pro-sider.ant-layout-sider.ant-pro-sider-fixed{
	height: calc(100vh - 80px) !important;
}



${ window.top !== window ? `

/* iframe 嵌入时 */
${ window.location.search.indexOf('sb=0') > 0 ? `

/* 调整 容器 背景色 */
#root .ant-pro-basicLayout>.ant-layout .eb-layout-container{
	background-color: #fff !important;
}

/* 隐藏侧边栏 */
#root .ant-pro-basicLayout>.ant-layout>.ant-layout-sider,
#root .ant-pro-basicLayout>.ant-layout>div:not(.ant-layout){
	display: none !important;
}

/* 顶部导航 */
#root header.ant-layout-header{
	display: none !important;
}


/* 顶部标签 */

/* 隐藏右键菜单 关闭所有标签 */
.ant-dropdown-menu-item-only-child[data-menu-id^="rc-menu-uuid-"][data-menu-id$="-closeAll"]{
	display: none;
}

/* 隐藏首页 tab 标签 */
.eb-layout-container-section>.ant-tabs>.ant-tabs-nav .ant-tabs-tab:not(.ant-tabs-tab-with-remove){
	border: 1px solid red;
	display: none !important;
}
/* 隐藏首页 tab 内容 */
.ant-tabs-tabpane[id$="-panel-tabhome"][id^="rc-tabs-"]{
	display: none !important;
}

 /* 隐藏 tab 标签 LOGO */
#root .eb-home-tabs>.ant-tabs-nav .ant-tabs-extra-content .ant-pro-sider-logo{
	display: none;
}
` : ''}



/* 调整 右侧主题内容 内边距 */
#root .ant-pro-basicLayout>.ant-layout .eb-layout-container-section{
	margin: 20px 10px 10px 10px;
}

/* 调整 tab 标签页内容 内边距 */
#root .ant-pro-basicLayout>.ant-layout .eb-home-tabs-tab{
	padding: 0 0 20px 0 !important;
}

/* 调整 tab 标签 上边距 */
#root .eb-home-tabs>.ant-tabs-nav .ant-tabs-nav-wrap{
	padding-top: 3px;
}


/* 详情页 调整右侧边栏宽度 */
#root .eb-view-wrapper .eb-view-sider-right{
	flex: 0 0 300px;
	width: 300px;
	margin-right: 10px;
}

/* 详情页 调整 右侧审批流 外左边距  */
#root .eb-view-wrapper .eb-view-sider-right .eb-flow{
	margin-left: -10px;
}

/* 详情页 调整 内容部分 内边距 */
#root .eb-view-wrapper>.eb-view-form-wrapper>.eb-view-form>.eb-view-content,
#root .eb-view-wrapper>.eb-view-form-wrapper>.eb-view-form>.eb-view-list-wrapper{
	padding: 0 10px;
}

/* 详情页 调整 tab 内边距 */
#root .eb-view-wrapper>.eb-view-form-wrapper>.eb-view-form>.eb-view-toolbar{
	margin-left: 0;
	margin-right: 0;
	padding-left: 10px;
	padding-right: 10px;
}

/* 详情页 隐藏 上查、下查 */
#root .eb-view-toolbar.eb-view-toolbar-form-head>.ant-space.ant-formily-button-group>.ant-space-item>.ant-space.ant-space-horizontal{
	display: none !important;
}


/* 调整 列表页 顶部 试图切换 tab 大小 */
.rc-overflow.eb-view-plans .eb-view-plans-item{
	padding-top: 2px !important;
	padding-bottom: 2px !important;
	margin-bottom: 0 !important;
}

` : '' }


	/* 重置按钮文字 字重 */
	.ant-btn{
		font-weight: 500 !important;
	}

	/* 重置详情页 当前激活标签样式 */
	.ant-tabs-content-top .ant-tabs-tab{
		padding-top: 6px !important;
		padding-bottom: 6px !important;
		padding-left: 10px !important;
		padding-right: 10px !important;
	}
	.eb-view-toolbar-tabs.ant-tabs>.ant-tabs-nav .ant-tabs-ink-bar{
		height: 4px !important;
		bottom: 0px !important;
	}
	.eb-view-toolbar-tabs.ant-tabs>.ant-tabs-nav .ant-tabs-tab+.ant-tabs-tab {
		margin: 0 0 0 15px !important;
	}
	.eb-view-toolbar-tabs.ant-tabs>.ant-tabs-nav .ant-tabs-tab-active{
		font-size: 14px !important;
	}

	.ant-pro-sider-logo{
		align-items: start !important;
	}
	/* 重置详情页表单label */
	.eb-view-form .ant-formily-item-layout-vertical .ant-formily-item-label{
		color: #666 !important;
		margin-bottom:1px !important;
	}
	/* 详情页富文本内容预览/编辑器行高 */
	.form-html-editor-preview p,
	.form-html-editor.form-html-editor-edit .w-e-text-container>.w-e-scroll>div>p{
		margin: 0 0 2px 0 !important;
		line-height: 1.5;
	}
	/* 详情页右侧流程 标题文字大小调整 */
	.eb-flow-item-node-title .ant-typography-ellipsis,
	.eb-flow-item-node-title-assign{
		font-size: inherit !important;
	}
	/* 评论和日志字重调整 */
	.eb-comment-list-item-content,
	.eb-form-sider-log-item-time,
	.eb-form-sider-log-item-content{
		font-weight: inherit !important;
	}
	/* 日志 */
	.eb-form-sider-log-item{
		padding-top: 5px !important;
		padding-bottom: 5px !important;
	}
	.eb-form-sider-log-item-time{
		padding-bottom: 0 !important;
	}
	.eb-form-sider-log-item-content{
		margin-bottom: 0 !important;
	}

	/* textarea 最小高度调整 */
	.ant-formily-item textarea.ant-input{
		min-height: 180px;
	}


	/* 重置详情页底部操作按钮位置，改到左边展示 */
	.eb-view-toolbar--bottom .eb-view-toolbar-group{
			direction: ltr !important;
	}
	.eb-view-toolbar--bottom .eb-view-toolbar-group .eb-view-toolbar-overflow-right{
			justify-content: left !important;
	}

	/* 消息列表样式 */
	.eb-message-center-list-item .ant-list-item-meta-title{
		margin-bottom: 0 !important;
	}
	.eb-message-center-list-item-time{
		margin-bottom: 0 !important;
		margin-top: 0 !important;
		font-weight: inherit !important;
	}
	.eb-message-center-list-item .ant-list-item-meta-description .ant-typography{
		font-weight: inherit !important;
	}


	/* 移除 联系人左边的小图标 */
	.eb-perview-option-tag>.ant-typography-ellipsis{
		max-width: none !important;
		margin-left: auto !important;
	}
	.eb-perview-option-tag>.anticon{
		display: none !important;
	}

`.trim();
			};
			const $style = document.createElement('style');
			$style.setAttribute('id', 'y-app-style-global');
			$style.setAttribute('type', 'text/css');
			$style.innerHTML = cssRules();
			document.head.appendChild($style);

			console.log(`[OK] 初始化 注入全局样式`);
		}

		// 初始化主视图
		initMainView(callback) {

			const state = this.state;

			const NAVS = this.#NAVS;
			const VIEWS = this.#VIEWS;
			const PAGE_SIZES = this.#PAGE_SIZES;
			const BOOKMARKS = this.BOOKMARKS;

			const styles = () => {
				return `
<style type="text/css">
	.y-app-root,
	.y-app-root *,
	.y-app-root *:before,
	.y-app-root *:after{
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
	.y-app-root{
		--font-family: -apple-system,"PingFang SC","Microsoft YaHei","Helvetica Neue",Helvetica,BlinkMacSystemFont,"Segoe UI","Hiragino Sans GB",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
		--font-size: 75%;

		--color: #333;

		--background: #fff;
		--background-hover: #F6F6F6;
		--background-active: #F2F5F9;

		--link-color: #348fe4;

		--h2-background: #F1F1F1;

		--button-border-color: #e8e8e8;
		--button-border-color-hover: #e8e8e8;
		--button-background: #fff;
		--button-background-hover: #f5f5f5;

/* 		--head-height: 80px; */
		--head-height: 103px;
		--sidebar-width: 220px;
		--bookmarks-width: 220px;
		--link-color: #348fe4;
	}

	a{
		color: var(--link-color);
		text-decoration: none;
	}
	a:hover{
		text-decoration: underline;
	}

	.y-app-hidden{
		display: none !important;
	}
	.y-app-hidden-v{
		visibility: hidden !important;
	}

	a.y-app-btn,
	a.y-app-btn:hover,
	a.y-app-btn:focus,
	a.y-app-btn:active{
		text-decoration: none;
	}

	.y-app-btn{
		display: inline-block;
		border-width: 1px;
		border-style: solid;
		border-color: var(--button-border-color);
		background-color: var(--button-background);
		color: var(--color);
		padding: 5px 15px;
		border-radius: 3px;
		cursor: pointer;
		font-size: inherit;

		& + .y-app-btn{
			margin-left: 8px;
		}

	&.y-app-btn__small{
		padding: 2px 8px;
		height: 26px;
		line-height: 20px;
	}

		&:hover{
			box-shadow: 0 3px 8px 0 rgba(0,0,0, 0.06);
			border-color: var(--button-border-color-hover);
			background: var(--button-background-hover);
		}
		&:active{
			box-shadow: 0 2px 4px 0 rgba(0,0,0, 0.06);
			background: rgba(0, 0, 0, 0.06);
		}

		&[primary]{
			color: #5186f0;
		}

		&[warn]{
			color: #f98e1b;
		}

		&[danger]{
			color: #f52743;
		}

		&.active{
			color: #fff;
			background-color: #5186f0;
		}

		&.success{
			color: #fff;
			background-color: #5eba7d;
		}

		/* y-app-btn-icon */
		&.y-app-btn-icon{
			border: 0;
			box-shadow: none;
			padding: 4px 5px;
			height: auto;
			line-height: 0;
			text-align: center;
			display: inline-block;
			vertical-align: middle;

			& svg {
				pointer-events: none;
				fill: #595959;

				&.svg-icon-starred{
					fill: #eac54f;
				}

				&.svg-icon-check{
					fill: #28c940;
				}
			}
		}
	}

	.text-center{
		text-align: center;
	}
  .text-ellipsis{
	display: block;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
  }

	.pull-left{
		float: left;
	}
	.pull-right{
		float: right;
	}

	.y-app-root{
		margin: 0;
		color: rgba(0,0,0,.85);
		font-size: 14px;
		font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
		font-variant: tabular-nums;
		line-height: 1.5715;
		background-color: #fff;
		font-feature-settings: "tnum";
	}
	.y-app-head{
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		z-index: 999;
		height: var(--head-height);
		background-color: #fff;

		background: rgba(255,255,255,0.85);
		background: #f9f9f9;
		border-bottom: 1px solid #d5d5d5;
		box-shadow: 0 2px 10px rgba(0,0,0,.15);
	}
	.y-app-main{
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		z-index: 888;
	}

	.y-app-padded{
		padding: 10px;
	}

	.y-app-logo{
		position: absolute;
		top: 0;
		left: 0;
		margin: 0;
		padding: 2px 0 0 10px;
	}
	.y-app-search{
		display: inline-block;
		vertical-align: top;
		margin: 0;
		padding-top: 10px;
		padding-left: 15px;
		position: absolute;
		left: 100px;
		top: 5px;
		padding-top: 0;

		.y-app-search__input{
			min-width: 467px;
		}
		.y-app-search__submit{
			margin-left: 10px;
		}
		.y-app-search__options{
			padding-top: 6px;
			padding-right: 20px;
			display: inline-block;
			vertical-align: top;
		}
	}

	.y-app-input,
	.y-app-btn{
		display: inline-block;
		vertical-align: middle;
	}

	.y-app-input{
		height: 32px;
		line-height: 32px;
		padding: 0 5px;
		border: 1px solid #ccc;
	}
	.y-app-btn{
		height: 32px;
		line-height: 32px;
		padding: 0 15px;
		cursor: pointer;
		border-radius: 3px;
		border: 1px solid #ccc;
	}

	.y-app-checkbox,
	.y-app-checkbox__input,
	.y-app-checkbox__text
	.y-app-radio,
	.y-app-radio__input,
	.y-app-radio__text{
		display: inline-block;
	}
	.y-app-checkbox,
	.y-app-radio{
		padding-right: 10px;
	}
	.y-app-checkbox__input,
	.y-app-checkbox__text,
	.y-app-radio__input,
	.y-app-radio__text{
		vertical-align: middle;
	}
	.y-app-checkbox__text,
	.y-app-radio__text{
		padding-left: 1px;
	}
	.y-app-radio__input{
		margin: 3px 2px 3px 3px;
	}

	.y-app-action .y-app-checkbox__input,
	.y-app-action .y-app-checkbox__text,
	.y-app-action .y-app-radio__input,
	.y-app-action .y-app-radio__text{
		pointer-events: none;
	}


	@keyframes drawerFadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.y-app-drawer{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 999;

		&.active{

			.y-app-drawer__backdrop{
				height: 100%;
				opacity: 1;
				-webkit-transition: none;
				transition: none;
				-webkit-animation: drawerFadeIn .3s cubic-bezier(.23,1,.32,1);
				animation: drawerFadeIn .3s cubic-bezier(.23,1,.32,1);
			}
			.y-app-drawer__container{
				-webkit-transform: translateX(0);
				transform: translateX(0);
			}
		}

		.y-app-drawer__backdrop{
			height: 0;
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 55;
			background: rgba(0,0,0,.45);
			opacity: 0;
			-webkit-transition: opacity .3s linear,height 0s ease .3s;
			transition: opacity .3s linear,height 0s ease .3s;
		}
		.y-app-drawer__container{
			box-shadow: -6px 0 16px -8px rgba(0,0,0,.08), -9px 0 28px rgba(0,0,0,.05), -12px 0 48px 16px rgba(0,0,0,.03);
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			z-index: 99;
			width: 80%;
			max-width: 1200px;
			min-width: 980px;
			-webkit-transform: translateX(100%);
			transform: translateX(110%);
			-webkit-transition: box-shadow .3s cubic-bezier(.23,1,.32,1),-webkit-transform .3s cubic-bezier(.23,1,.32,1);
			transition: box-shadow .3s cubic-bezier(.23,1,.32,1),-webkit-transform .3s cubic-bezier(.23,1,.32,1);
			transition: transform .3s cubic-bezier(.23,1,.32,1),box-shadow .3s cubic-bezier(.23,1,.32,1);
			transition: transform .3s cubic-bezier(.23,1,.32,1),box-shadow .3s cubic-bezier(.23,1,.32,1),-webkit-transform .3s cubic-bezier(.23,1,.32,1);
		}
		.y-app-drawer__head{
			height: 50px;
			background-color: #efeff4;
			position: relative;
			z-index: 77;
		}
		.y-app-drawer__title{
			font-size: 14px;
			margin: 0;
			padding-left: 140px;
			padding-top: 15px;
			display: inline-block;
			text-overflow: ellipsis;
			overflow: hidden;
			max-width: 95%;
			word-break: keep-all;
			white-space: nowrap;
		}
		.y-app-drawer__btn-close{
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			border: 0;
			border-radius: 0;
			padding-left: 8px;
			padding-right: 8px;
			min-height: 50px;
			min-width: 54px;
			line-height: normal;
		}
	.y-app-btn__star,
	.y-app-btn__copy{
	  position: absolute;
			top: 50%;
	  transform: translateY(-50%);
	}
	.y-app-btn__star{
	  left: 60px;
	}
		.y-app-btn__copy{
			left: 100px;
		}
		.y-app-drawer__main{
			position: relative;
			z-index: 77;
			background: #fff;
			height: calc(100vh - 50px);
		}
		.y-app-drawer__iframe{
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}


	.y-app-search__bookmarks{
		position: fixed;
		top: var(--head-height);
		bottom: 0;
		left: 0;
		z-index: 9;
		width: var(--bookmarks-width);
		background: #eee;
		overflow: hidden;

		&:hover{
			width: 560px;
			overflow: visible;
		}

	}
	.y-app-search__bookmarks-container{
		min-width: 1200px;
		overflow: auto;
		background: #fff;
	}

	.y-app-search__result{
/* 		margin-left: var(--bookmarks-width); */
		padding: 15px;
	}

	/* 工时筛选 */
	.y-app-manhour__filter{
		position: fixed;
		top: var(--head-height);
		left: 0;
		right: 0;
		z-index: 9;
		height: 60px;
		padding-top: 18px;
		padding-left: 20px;
		padding-right: 20px;
		background: #fff;
	}
	.y-app-manhour__filter-item{
		display: inline-block;
		vertical-align: middle;
		padding-right: 15px;
	}
	.y-app-manhour__filter-item.pull-right
		float: right;
	}
	.y-app-manhour__filter-item .y-app-radio{
		padding-right: 0;
	}
	.y-app-manhour__filter-item > .y-app-manhour__filter-item{
		display: none;
	}
	.y-app-manhour__filter-item.active > .y-app-manhour__filter-item{
		display: inline-block;
	}
	.y-app-manhour__result{
		position: relative;
		z-index: 3;
		margin-top: 60px;
		padding: 0 20px 20px 20px;
	}


	/* 工时表格 */
	.y-app-table__manhour{
		table-layout: fixed;
		border-collapse: collapse;
		border-spacing: 0;
		font-size: 14px;
	}
	.y-app-table__manhour,
	.y-app-table__manhour th,
	.y-app-table__manhour td{
		padding: 0;
	}
	.y-app-table__manhour th,
	.y-app-table__manhour td{
		white-space: nowrap;
		min-width: 40px;
		line-height: 20px;
	}
	.y-app-table__manhour th small,
	.y-app-table__manhour td small{
		font-weight: normal;
	}
	.y-app-table__manhour th:not(:first-child),
	.y-app-table__manhour td:not(:first-child){
		text-align: center;
	}
	.y-app-table__manhour th{
		background-color: #eee;
		white-space: normal;
		width: 52px;
		height: 40px;
		line-height: 16px;
	}
	.y-app-table__manhour td{
		background-color: #fff;
	}
	.y-app-table__manhour tr:hover td{
		background-color: #fff1c9 !important;
	}
	.y-app-table__manhour-cell{
		padding: 3px 5px 2px 5px;
		border: 1px solid #ccc;
		margin: -1px 0 0 -1px;
		height: inherit;
	}
	.y-app-table__manhour-cell:hover{
		position: relative;
		z-index: 19;
		box-shadow: 0 0 1px 1px blue inset;
	}

	.y-app-table__manhour-striped > tbody > tr:nth-child(even) > td {
		background-color: #fafafa;
	}

	.y-app-table__manhour-sticky{
		position: sticky;
	}
	.y-app-table__manhour-sticky.y-app-table__manhour-row-0{
		top: 81px;
		top: 0px;
		top: 60px;
		z-index: 7;
	}

	.y-app-table__manhour-sticky.y-app-table__manhour-col-0{
		left: 21px;
		left: 1px;
		min-width: 70px;
		max-width: 70px;
	}
	.y-app-table__manhour-sticky.y-app-table__manhour-col-1{
		left: 21px;
		left: 71px;
		min-width: 46px;
		max-width: 46px;
	}
	.y-app-table__manhour-sticky.y-app-table__manhour-col-2{
		left: 91px;
		left: 117px;
		min-width: 100px;
		max-width: 100px;
		text-align: left !important;
	}
	.y-app-table__manhour-sticky.y-app-table__manhour-col-3{
		left: 222px;
		left: 202px;
		min-width: 60px;
		max-width: 60px;
	}
	.y-app-table__manhour-sticky.y-app-table__manhour-col-4{
		left: 222px;
		left: 262px;
		min-width: 60px;
		max-width: 60px;
	}

	.y-app-table__manhour-col-3,
	.y-app-table__manhour-striped th.y-app-table__manhour-col-3,
	.y-app-table__manhour-striped td.y-app-table__manhour-col-3,
	.y-app-table__manhour-striped > tbody > tr:nth-child(even) > td.y-app-table__manhour-col-3{
		background-color: #ffeed4;
		background-color: #d8eeff;
	}

	.y-app-table__manhour-col-4,
	.y-app-table__manhour-striped th.y-app-table__manhour-col-4,
	.y-app-table__manhour-striped td.y-app-table__manhour-col-4,
	.y-app-table__manhour-striped > tbody > tr:nth-child(even) > td.y-app-table__manhour-col-4{
		background-color: #ffeed4;
		background-color: #ffeaca;
	}

	.y-app-legend .y-app-legend__item{
		display: inline-block;
		padding: 1px 2px;
		background-color: #eee;
		text-align: center;
		min-width: 26px;
		color: #666;
	}
	.y-app-legend .is-weekend,
	.y-app-table__manhour .is-weekend,
	.y-app-table__manhour-striped > tbody > tr:nth-child(even) > td.is-weekend{
		/*background-color: #d1ffd1;*/
		background-color: #e2ffe2;
	}

	.y-app-legend .is-holiday,
	.y-app-table__manhour .is-holiday,
	.y-app-table__manhour-striped > tbody > tr:nth-child(even) > td.is-holiday{
		background-color: #b6f7b6;
	}

	.y-app-legend .is-patch,
	.y-app-table__manhour .is-patch,
	.y-app-table__manhour-striped > tbody > tr:nth-child(even) > td.is-patch{
		/*background-color: #ffbdd3;*/
		background-color: #ffd9e6;
	}
	.y-app-table__manhour .is-unqualified{
		color: red;
		font-weight: bold;
	}

	.y-app-table__manhour tr.y-app-table__manhour-row-selected td,
	.y-app-table__manhour tr.y-app-table__manhour-row-selected:hover td{
		background-color: #ffdf9b !important;
	}

	/* 设置 视图 */
	.y-app-setting__title{}
	.y-app-setting__list,
	.y-app-setting__list-title,
	.y-app-setting__list-content{
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.y-app-setting__list{

	}
	.y-app-setting__list-title{
		font-weight: bold;
		font-size: 14px;
		background: rgba(241,241,241, 0.88);
		padding: 5px 10px;
		margin-bottom: 5px;
		text-align: left;
	}
	.y-app-setting__list-content{
		padding: 10px 10px 35px 10px;
	}

	.y-app-table{
		width: 100%;
		border-collapse: collapse;
		font-size: inherit;
		table-layout: fixed;
	}
	.y-app-table + .y-app-table{
		margin-top: 25px;
	}
	.y-app-table__caption{
		font-weight: bold;
		font-size: 14px;
		background: #F1F1F1;
		background: rgba(241,241,241, 0.88);
		padding: 5px 10px;
		margin-bottom: 5px;
		text-align: left;
		position: sticky;
		top: 0;
	}
	.y-app-table tr:hover>td{
		background: var(--background-hover);
	}
	.y-app-table tr:active>td{
		background: var(--background-active);
	}
	.y-app-table th,
	.y-app-table td {
		padding: 3px 5px;
	}

	.y-app-quick-nav,
	.y-app-quick-nav__item{
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.y-app-quick-nav{
		padding: 10px 10px 0 10px;
	}
	.y-app-quick-nav__item{
		display: inline-block;
		margin-right: 5px;
		margin-bottom: 5px;
	}

	/* y-app-view */
	.y-app-view{
		position: absolute;
		top: 0;
		padding-top: var(--head-height);
		right: 0;
		bottom: 0;
		left: 0;
		min-height: 100vh;
		z-index: 888;
		overflow: auto;
		background: #fff;
		display: none;

		&.active{
			display: block;
		}

	}
	.y-app-view:not(.y-app-view__home) {
		padding-bottom: 30px;
	}
	.y-app-view__container{
		height: 100%;
	}
	.y-app-view__iframe{
		width: 100%;
		height: 100%;
	}

	.y-app-nav{
		display: inline-block;
		vertical-align: top;
		padding-top: 48px;
		padding-top: 71px;

		.y-app-nav__item{
			display: inline-block;
			padding: 5px 10px;
			min-width: 80px;
			text-align: center;
			border-radius: 3px 3px 0 0;

			&:hover{
				background: rgba(0,0,0,.05);
				text-decoration: none;
			}
			&:active{
				background: rgba(0,0,0,.1);
				text-decoration: none;
			}

			&.active{
				color: #fff;
				background: #0075ff;
				background: #2b90ff;
			}
		}
	}

	/* 右上角工时 */
	.y-app-manhour{
		position: fixed;
		top: -1px;
		right: 0;
		/* height: var(--head-height); */
		height: calc(var(--head-height) - 23px);
		z-index: 1999;
		overflow: hidden;
		min-width: 228px;
		padding: 4px 10px 10px 10px;
		background: rgba(255,255,255, 0.88);
		background: #f9f9f9;
		background: rgba(249,249,249, 0.9);
		border-bottom: 1px solid transparent;
		border-left: 1px solid transparent;
		transition: all .3s cubic-bezier(.23,1,.32,1);
	}
	.y-app-manhour:hover{
		height: auto;
		overflow: visible;
		background: inherit;
		box-shadow: -6px 0 16px -8px rgba(0,0,0,.08), -9px 0 28px rgba(0,0,0,.05), -12px 0 48px 16px rgba(0,0,0,.03);
		border-bottom: 1px solid #d5d5d5;
		border-left: 1px solid #d5d5d5;
		box-shadow: 0 2px 10px rgba(0,0,0,.15);
	}
	.y-app-manhour__detail,
	.y-app-manhour__detail>li{
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.y-app-manhour__countdown{
		float: right;
	}
	.y-app-manhour__detail{
		line-height: 18px;
	}
	.y-app-manhour__extra{
		display: none;
	}
	.y-app-manhour__extra,
	.y-app-manhour__extra>dt,
	.y-app-manhour__extra>dd{
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.y-app-manhour__extra{
		padding-top: 10px;
	}
	.y-app-manhour__extra>dt{
		font-weight: bold;
	}
	.y-app-manhour:hover>.y-app-manhour__extra{
		display: block;
	}

	.y-app-h2{
		font-size: 32px;
		padding: 50px 0;
		text-align: center;
		color: #666;
	}
	.y-app-italic{
		font-style: italic;
	}
</style>
`.trim();
			};

			const template = () => {
				let homeQuery = this.query.toString();
				homeQuery = homeQuery ? '?'+ homeQuery : '';

				const startYear = 2022;
				const currentYear = new Date().getFullYear();
				const currentMonth = new Date().getMonth() + 1;
				return `
${ styles() }
<div class="y-app-head">
	<h2 class="y-app-logo"><a href="/home.html">易用云</a></h2>
	<nav class="y-app-nav" id="y-app-nav">
		<a href="#/home${ homeQuery }" class="y-app-nav__item y-app-action" data-action="prevent.switchView" data-view="home${ homeQuery }">易搭云</a>
		<a href="#/bookmarks" class="y-app-nav__item y-app-action" data-action="prevent.switchView" data-view="bookmarks">收藏夹</a>
		<a href="#/search" class="y-app-nav__item y-app-action" data-action="prevent.switchView" data-view="search">需求/缺陷/任务</a>
		<a href="#/manhour" class="y-app-nav__item y-app-action" data-action="prevent.switchView" data-view="manhour">工时</a>
		<a href="#/setting" class="y-app-nav__item y-app-action" data-action="prevent.switchView" data-view="setting">设置</a>
	</nav>
	<form class="y-app-search" id="y-app-search-form" onsubmit="return false">
		<div class="y-app-search__inputbox">
			<input type="text" id="y-app-search-keyword" class="y-app-input y-app-search__input" placeholder="需求/缺陷/任务关键字 或 姓名">
			<button type="submit" class="y-app-btn y-app-search__submit" primary>搜索</button>
		</div>
		<div class="y-app-search__options">
			${ VIEWS.map((item) => {
				return `
<label class="y-app-checkbox y-app-action" data-action="checkbox" data-group="types" data-key="${ item.object }">
	<input type="checkbox" name="y-app-search-types" class="y-app-checkbox__input" value="${ item.object }" ${ state.types[item.object] ? ` checked` : '' }>
	<span class="y-app-checkbox__text">${ item.name }</span>
</label>`;
			}).join('') }
		</div>
		<div class="y-app-search__options">
			<label class="y-app-checkbox y-app-action" data-action="checkbox" data-key="involved" title="我创建/负责/参与的">
				<input type="checkbox" class="y-app-checkbox__input" value="involved" ${ state.involved ? ` checked` : '' }>
				<span class="y-app-checkbox__text">与我有关</span>
			</label>
			<label class="y-app-checkbox y-app-action" data-action="checkbox" data-key="status" title="自定义筛选 需求/缺陷/任务状态&#13;在下面“设置”页设置">
				<input type="checkbox" class="y-app-checkbox__input" value="status" ${ state.status ? ` checked` : '' }>
				<span class="y-app-checkbox__text">状态筛选</span>
			</label>
		</div>
		<!--
		<div class="y-app-search__options">
			<select id="y-app-search-size">
				${ PAGE_SIZES.map((item) => {
					return `<option value="${ item.value }" ${ state.pagesize == item.value ? ` selected="selected"` : '' }>${ item.value }条</option>`.trim();
				}).join('') }
			</select>
		</div>
		-->
	</form>
</div>
<div class="y-app-manhour" id="y-app-manhour">
	<ul class="y-app-manhour__detail"></ul>
	<dl class="y-app-manhour__extra">
		<dt>设置</dt>
		<dd>上班时间：
			<label title="上午 9点" class="y-app-radio y-app-action" data-action="prevent.setWorkTime" data-value="9:00">
				<input type="radio" class="y-app-radio__input" name="y-app-manhour-time" value="9:00" ${ state.worktime == '9:00' ? ` checked="checked"` : '' }>
				<span class="y-app-radio__text">9:00</span>
			</label>
			<label title="上午 9点30分" class="y-app-radio y-app-action" data-action="prevent.setWorkTime" data-value="9:30">
				<input type="radio" class="y-app-radio__input" name="y-app-manhour-time" value="9:30" ${ !state.worktime || state.worktime == '9:30' ? ` checked="checked"` : '' }>
				<span class="y-app-radio__text">9:30</span>
			</label>
		</dd>
	</dl>
	<dl class="y-app-manhour__extra">
		<dt>时长计算说明</dt>
		<dd>13点后 减去午餐时间 1小时</dd>
	</dl>
	<dl class="y-app-manhour__extra">
		<dt>版本</dt>
		<dd>v${ VERSION.CODE }&nbsp;<small title="${ VERSION.TIMESTAMP }">${ formatDate(VERSION.TIMESTAMP) }</small></dd>
	</dl>
</div>
<div class="y-app-main">

	<div class="y-app-view y-app-view__search" data-view="bookmarks">
	${ NAVS.render() }
		<div class="y-app-search__result" id="y-app-bookmarks">
		</div>
	</div>
	<div class="y-app-view y-app-view__search" data-view="search">
	${ NAVS.render() }
		<div class="y-app-search__result" id="y-app-search-result">
			<h2 class="y-app-h2 y-app-italic"> SUBLIME / SIMPLE / SMART </h2>
			<p class="text-center">
				<button type="button" class="y-app-btn y-app-action" data-action="prevent.load" primary>瞧一瞧 ~</button>
			</p>
		</div>
	</div>
	<div class="y-app-view y-app-view__manhour" data-view="manhour">
		<div class="y-app-manhour__filter">
			<span class="y-app-manhour__filter-item">
				<select id="y-app-manhour-year" title="起始年">
					${ ((options) => {
						for (var i=currentYear; i >= startYear; i--) {
							options.push(`<option value="${ i }"${ currentYear == i ? ` selected` : '' }>${ i }年</option>`);
						}
						return options.join('');
					})([]) }
				</select>
			</span>
			<span class="y-app-manhour__filter-item">
				<select id="y-app-manhour-month" title="起始月">
					${ [12,11,10,9,8,7,6,5,4,3,2,1].map((item) => {
return `<option value="${ item }"${ currentMonth == item ? ` selected` : '' }>${ item }月</option>`;
				}).join('') }
				</select>
			</span>
			<span class="y-app-manhour__filter-item">
				<label class="y-app-checkbox y-app-action" data-action="checkbox-manhour-range" title="至">
					<input type="checkbox" class="y-app-checkbox__input" id="y-app-manhour-range" value="range">
					<span class="y-app-checkbox__text">~</span>
				</label>
				<span class="y-app-manhour__filter-item">
					<select id="y-app-manhour-end-year" title="截止年">
						${ ((options) => {
							for (var i=currentYear; i >= startYear; i--) {
								options.push(`<option value="${ i }"${ currentYear == i ? ` selected` : '' }>${ i }年</option>`);
							}
							return options.join('');
						})([]) }
					</select>
				</span>
				<span class="y-app-manhour__filter-item">
					<select id="y-app-manhour-end-month" title="截止月">
						${ [12,11,10,9,8,7,6,5,4,3,2,1].map((item) => {
	return `<option value="${ item }"${ currentMonth == item ? ` selected` : '' }>${ item }月</option>`;
					}).join('') }
					</select>
				</span>
			</span>
			<span class="y-app-manhour__filter-item">
				<label class="y-app-radio" data-action="getManhour">
					<input type="radio" class="y-app-radio__input" name="y-app-manhour-group-by" value="me" checked>
					<span class="y-app-radio__text">我的</span>
				</label>
			</span>
			<span class="y-app-manhour__filter-item">
				<label class="y-app-radio">
					<input type="radio" class="y-app-radio__input" name="y-app-manhour-group-by" value="all">
					<span class="y-app-radio__text">全部</span>
				</label>
			</span>
			<span class="y-app-manhour__filter-item">
				<label class="y-app-radio">
					<input type="radio" class="y-app-radio__input" name="y-app-manhour-group-by" value="上海">
					<span class="y-app-radio__text">上海</span>
				</label>
			</span>
			<span class="y-app-manhour__filter-item">
				<label class="y-app-radio">
					<input type="radio" class="y-app-radio__input" name="y-app-manhour-group-by" value="苏州">
					<span class="y-app-radio__text">苏州</span>
				</label>
			</span>
			<span class="y-app-manhour__filter-item">
				<label class="y-app-radio">
					<input type="radio" class="y-app-radio__input" name="y-app-manhour-group-by" value="深圳">
					<span class="y-app-radio__text">深圳</span>
				</label>
			</span>
			<span class="y-app-manhour__filter-item">
				<button type="button" class="y-app-btn y-app-action" primary data-action="prevent.viewManhours">查看</button>
			</span>
			<span class="y-app-manhour__filter-item">
				<button type="button" class="y-app-btn y-app-action" data-action="prevent.copyManhours" title="复制报表">复制</button>
			</span>
			<span class="y-app-manhour__filter-item y-app-legend">
				<span class="y-app-legend__item is-holiday">节假日</span><span class="y-app-legend__item is-weekend">周末</span><span class="y-app-legend__item is-patch">补班</span><span class="y-app-legend__item">班</span>
			</span>
		</div>
		<div class="y-app-manhour__result" id="y-app-manhour-result">
			<h2 class="y-app-h2 y-app-italic"> 成员工时统计 </h2>
		</div>
	</div>
	<div class="y-app-view y-app-view__search" data-view="setting">
		<div class="y-app-search__result" id="y-app-setting">

			<h3 class="y-app-setting__title">设置</h3>
			<dl class="y-app-setting__list">
				<dt class="y-app-setting__list-title">搜索结果显示条数</dt>
				<dd class="y-app-setting__list-content">
					<div class="y-app-search__options">
						<select id="y-app-search-size">
							${ PAGE_SIZES.map((item) => {
								return `<option value="${ item.value }" ${ state.pagesize == item.value ? ` selected="selected"` : '' }>${ item.value }条</option>`.trim();
							}).join('') }
						</select>
					</div>
				</dd>
			${ (() => {
			const html = [];
			let dataGroup = null;
			let settingStatus = [];
			VIEWS.forEach((view) => {
				if (view.status) {
					html.push(`<dt class="y-app-setting__list-title">${ view.name }状态</dt>`);
					html.push(`<dd class="y-app-setting__list-content">`);
					dataGroup = `setting.status.${ view.object }`;
					settingStatus = state[dataGroup] || {};
					view.status().forEach((item) => {
						html.push(`<label class="y-app-checkbox y-app-action" data-action="checkbox" data-group="${ dataGroup }" data-key="${ item.value }">`);
						html.push(`<input type="checkbox" class="y-app-checkbox__input" value="${ item.value }" ${ settingStatus[item.value] ? ` checked` : '' } \/>`);
						html.push(`<span class="y-app-checkbox__text">${ item.label }<\/span>`);
						html.push(`<\/label>`);
					});
					html.push(`<\/dd>`);
				}

			});
			return html.join('');
			})() }
			</dl>

		</div>
	</div>
</div>
`.trim();
			}

			var $app = document.createElement('y-app');
			$app.setAttribute('id', 'y-app');
			if (document.body.children.length) {
				document.body.insertBefore($app, document.body.children[0]);
			} else {
				document.body.appendChild($app);
			}
			$app.$shadow = $app.attachShadow({ mode: 'open' });
			$app.$root = document.createElement('div');
			$app.$root.className = 'y-app-root';
			$app.$root.innerHTML = template().trimHTML();
			// $app.$root.addEventListener('click', (event) => {
			// 	event.stopPropagation();
			// });

			// 工时报表视图
			$app.$manhourYear = $app.$root.querySelector('#y-app-manhour-year');
			$app.$manhourMonth = $app.$root.querySelector('#y-app-manhour-month');
			$app.$manhourRange = $app.$root.querySelector('#y-app-manhour-range');
			$app.$manhourEndYear = $app.$root.querySelector('#y-app-manhour-end-year');
			$app.$manhourEndMonth = $app.$root.querySelector('#y-app-manhour-end-month');
			$app.$manhourResult = $app.$root.querySelector('#y-app-manhour-result');
			$app.getManhoursFormData = () => {
				const data = {};
				data.year = $app.$manhourYear.value;
				data.month = $app.$manhourMonth.value;
				data.range = $app.$manhourRange.checked;
				data.endYear = data.year;
				data.endMonth = data.month;
				if (data.range) {
					data.endYear = $app.$manhourEndYear.value;
					data.endMonth = $app.$manhourEndMonth.value;
				}
				data.groupby = $app.$root.querySelector('input[type="radio"][name="y-app-manhour-group-by"]:checked')?.value;
				// console.log('getManhoursFormData:', data);
				return data;
			}

			// 工时
			$app.$manhour = $app.$root.querySelector('#y-app-manhour');
			$app.$manhour.$detail = $app.$manhour.querySelector('.y-app-manhour__detail');
			$app.updateManhour = () => {
				const VIEW_MANHOUR = this.#VIEW_MANHOUR;
				const countdownValue = 30; // 30秒倒计时 循环

				const data = {
					countdown: countdownValue,
					today: 0,
					yestoday: 0,
					now: '',
					duration: '',
				};

				// 拉取已登记的工时
				const getManhour = () => {
					this.getManhour().then((res) => {
						// console.log('getManhour:', res);
						data.today = res.today;
						data.yestoday = res.yestoday;
						$app.$manhour.$detail.innerHTML = VIEW_MANHOUR.render(data);
					});
				}

				// 计算上班时长
				this.getWorkingHours({
					interval: 1000,
					prefix: '时长：',
					before: (options) => {
						// console.log('countdown:', data.countdown);
						data.countdown--;
						options.start = state.worktime || '9:30';
						const $radio = $app.$manhour.querySelector(`.y-app-radio__input[name="y-app-manhour-time"][value="${ options.start }"]`);
						if ($radio) {
							$radio.click();
						}
					},
					after: (options) => {
						data.duration = options.duration;
						$app.$manhour.$detail.innerHTML = VIEW_MANHOUR.render(data).trimHTML();
						if (data.countdown < 1) {
							data.countdown = countdownValue;
							getManhour();
						}
					}
				});

				getManhour();

				console.log(`[OK] 初始化 工时统计`);
			}

			$app.$nav = $app.$root.querySelector('#y-app-nav');
			$app.$navs = $app.$nav.querySelectorAll('.y-app-nav__item');
			$app.$main = $app.$root.querySelector('.y-app-main');
			$app.$views = $app.$root.querySelectorAll('.y-app-view');

			// 书签
			$app.$bookmarks = $app.$root.querySelector('#y-app-bookmarks');

			// 设置
			$app.$setting = $app.$root.querySelector('#y-app-setting');

			// 搜索器
			$app.$search = $app.$root.querySelector('#y-app-search-form');
			$app.$search.$keyword = $app.$root.querySelector('#y-app-search-keyword');
			$app.$search.$keyword.value = this.query.get('keyword');
			$app.$search.$result = $app.$root.querySelector('#y-app-search-result');
			$app.$search.$size = $app.$root.querySelector('#y-app-search-size');

			// 搜索
			$app.$search.trim = (keyword) => {
				keyword = (keyword || '').toString().trim();
				keyword = keyword.replace(/^【(.*?)】/, '').split('https://')[0].trim();
				return keyword;
			};

			$app.$search.search = (keyword, isUpdateInputValue) => {
				keyword = $app.$search.trim(keyword);

				// 是否更新搜索关键字
				if (isUpdateInputValue) {
					$app.$search.$keyword.value = keyword;
				}

				var query = {
					// 搜索关键字
					keyword,
					// 每页显示条数
					size: parseInt($app.$search.$size.value),
					// 与我有关的
					// involved: state.involved,
					// 状态筛选
					// status: state.status,
				}

				var $types = $app.$search.querySelectorAll('input[name="y-app-search-types"]:checked');
				// console.log('$types:', $types);
				var $fetchs = [];
				$types.forEach((item) => {
					((object) => {
						if (VIEWS[object]) {
							// console.log('=>>', VIEWS[object]);
							$fetchs.push($fetch('/runtime/getList', VIEWS[object].params(query)).then((res) => {
								VIEWS[object].records = res.data.records;
								VIEWS[object].html = VIEWS[object].render(VIEWS[object], res.data.records);
								return VIEWS[object];
							}));
						}
					})(item.value);
				});

				Promise.all($fetchs).then((results) => {
					var html_result = `${ results.map((item) => item.html).join('') }`.trim();
					$app.$search.$result.innerHTML = html_result.trimHTML();
					// console.log(results);
				});

			}
			// 搜索按钮
			$app.$search.addEventListener('submit', (event) => {
				event.preventDefault();
				const keyword = $app.$search.trim($app.$search.$keyword.value);
				this.search(keyword, true);
				return false;
			});
			// 页码切换
			$app.$search.$size.addEventListener('change', (event) => {
				// console.log('$app.$search.$size', $app.$search.$size.value);
				this.state.pagesize = parseInt($app.$search.$size.value);
				this.saveState();
			});

			// 抽屉: 打开
			$app.openDrawer = (data) => {
				data = { title: '', url: '', ...data };
				// console.log('openDrawer data:', data);
				if ($app.$drawer) {
					$app.$root.removeChild($app.$drawer);
					$app.$drawer = null;
				}
				$app.$drawer = document.createElement('div');
				$app.$drawer.className = 'y-app-drawer';
				$app.$drawer.tabIndex = 0;
				$app.$drawer.innerHTML = `
<div class="y-app-drawer__backdrop"></div>
<div class="y-app-drawer__container">
	<div class="y-app-drawer__head">
		<button type="button" class="y-app-btn y-app-drawer__btn-close">${ ICONS.close }</button>

		<a class="y-app-btn y-app-btn-icon y-app-btn__star y-app-action" data-via="drawer" data-from="${ data.from }" data-action="prevent.star" data-object="${ data.object }" data-index="${ data.index }" data-id="${ data.resId }" title="${ data.starred ? '取消收藏' : '收藏' }">${ ICONS[data.starred ? 'starred' : 'star'] }</a>

		<a class="y-app-btn y-app-btn-icon y-app-btn__copy y-app-action" target="_blank" href="${ data.url || 'javascript:void(0)' }"data-action="prevent.copy" data-project="${ data.project }" data-name="${ data.name }" data-title="${ data.title }" title="复制链接">${ ICONS.copy }</a>
		<h3 class="y-app-drawer__title">${ data.title }</h3>
	</div>
	<div class="y-app-drawer__main">
		<iframe class="y-app-drawer__iframe" frameborder="0" scrolling="no" src="${ data.url }&sb=0"></div>
	</div>
</div>
`.trim().trimHTML();
				$app.$drawer.addEventListener('keydown', (event) => {
					event.stopPropagation();
					console.log('drawer.keydown', event);
					if (event.keyCode === 27) {
						$app.closeDrawer();
					}
				});
				$app.$drawer.$backdrop = $app.$drawer.querySelector('.y-app-drawer__backdrop');
				$app.$drawer.$backdrop.addEventListener('click', (event) => {
					event.preventDefault();
					// event.stopPropagation();
					$app.closeDrawer();
				});
				$app.$drawer.$container = $app.$drawer.querySelector('.y-app-drawer__container');
				$app.$drawer.$container.addEventListener('click', (event) => {
					event.preventDefault();
					// event.stopPropagation();
				});
				$app.$drawer.$btnClose = $app.$drawer.querySelector('.y-app-drawer__btn-close');
				$app.$drawer.$btnClose.addEventListener('click', (event) => {
					event.preventDefault();
					event.stopPropagation();
					$app.closeDrawer();
				});

				// get current userTabs
				this.userTabs = window.sessionStorage.getItem(USER_INFO.get('keyTabs'));
				try {
					this.userTabs = JSON.parse(this.userTabs);
					if (Array.isArray(this.userTabs)) {
						// backup to localStorage
						window.localStorage.setItem(USER_INFO.get('keyTabs'), JSON.stringify(this.userTabs));
						// remove tabs
						window.sessionStorage.removeItem(USER_INFO.get('keyTabs'));
					} else {
						this.userTabs = null;
					}
				} catch (ex) {
					console.error(ex);
				}

				$app.$root.appendChild($app.$drawer);


				setTimeout(() => {
					$app.$drawer.classList.add('active');
					$app.$drawer.focus();
				}, 10);
			}
			// 抽屉: 关闭
			$app.closeDrawer = () => {
				if (!$app.$drawer) {
					return;
				}

				// restore tabs
				if (this.userTabs && Array.isArray(this.userTabs)) {
					let currentTabs = window.sessionStorage.getItem(USER_INFO.get('keyTabs'));
					// merge tabs
					try {
						currentTabs = JSON.parse(currentTabs);
						if (Array.isArray(this.userTabs) && Array.isArray(currentTabs)) {
							currentTabs = this.userTabs.concat(currentTabs);
							// console.log('before', currentTabs);
							// 去除重复标签
							let lastResId = null;
							currentTabs = currentTabs.filter((item) => {
								if (item.resId !== lastResId) {
									lastResId = item.resId;
									return true;
								}
								return false;
							});
							// console.log('after', currentTabs);
						}
					} catch (ex) {
						console.warn(ex);
					}
					// save tabs
					if (Array.isArray(currentTabs)) {
						this.userTabs = JSON.stringify(currentTabs);
						window.localStorage.setItem(USER_INFO.get('keyTabs'), this.userTabs);
						window.sessionStorage.setItem(USER_INFO.get('keyTabs'), this.userTabs);
					}
				}

				$app.$drawer.classList.remove('active');
				setTimeout(() => {
					$app.$root.removeChild($app.$drawer);
					$app.$drawer = null;
				}, 350);
			}

			const bookmarksCache = {};

			// 事件处理器
			$app.$root.addEventListener('click', (event) => {
				event.stopPropagation();

				const $el = event.target;
				if ($el && $app.$root.contains($el) && $el.classList.contains('y-app-action')) {
					let action = $el.dataset.action;
					if (!action) {
						return false;
					}
					// console.log('action:', action);
					if (action.startsWith('prevent.')) {
						event.preventDefault();
					}
					if (action.indexOf('.') > -1) {
						action = action.split('.')[1] || '';
					}
					switch (action) {
						case 'openDrawer':
							this.getRecordByElement($el).then((data) => {
								// console.log('openDrawer.data:', data);
								$app.openDrawer(data.record);
							});
							break;
						case 'star':
							this.getRecordByElement($el).then((data) => {
								// console.log('star.data:', data);
								var record = data.record.bookmark || data.record;
								if (data.from === 'bookmark') {
									if (!bookmarksCache[data.record.resId]) {
										bookmarksCache[data.record.resId] = record;
									}
									record = bookmarksCache[data.record.resId];
								}
								if (data.from === 'bookmark' || data.from === 'search') {
									BOOKMARKS.add(record, ({ type }) => {
										$el.innerHTML = ICONS[type === 'add' ? 'starred' : 'star'];
										$el.title = type === 'add' ? '取消收藏' : '收藏';
										$app.$bookmarks.update();
										if (data.via === 'drawer') {
										  $app.$bookmarks[type === 'add' ? 'star' : 'unstar'](record.resId);
										}
									});
								} else {
									$app.$bookmarks.unstar(record.resId);
									BOOKMARKS.remove(record, ({ type }) => {
										$app.$bookmarks.update();
									});
								}
							});
							break;
						case 'copy':
							let data = { project: '', name: '', url: '', title: '' };
							data.project = $el.dataset.project || '';
							data.name = $el.dataset.name || '';
							data.url = $el.dataset.url || $el.getAttribute('href') || '';
							data.title = $el.dataset.title || (data.project ? `【${ data.project }】` : '') + data.name;
							doCopy(`${ data.title } \n${ data.url }`).then(() => {
								$el.innerHTML = ICONS.check;
								setTimeout(() => {
									$el.innerHTML = ICONS.copy;
								}, 3000);
							});
							break;
						case 'setWorkTime':
							$el.$input = $el.querySelector('input[type="radio"]');
							if ($el.$input) {
								setTimeout(() => {
									// console.log('setWorkTime', $el.$input.value);
									this.state.worktime = $el.$input.value;
									this.saveState();
								}, 50);
							}
							break;
						case 'checkbox':
							$el.$input = $el.querySelector('input[type="checkbox"]');
							$el.dataKey = $el.dataset.key;
							$el.dataGroup = $el.dataset.group;
							if ($el.$input) {
								// $el.$input.checked = $el.$input.checked;
								setTimeout(() => {
									// console.log('$input', $el.$input.checked, $el.$input.value);
									if ($el.dataKey) {
										if ($el.dataGroup) {
											this.state[$el.dataGroup] = this.state[$el.dataGroup] || {};
											this.state[$el.dataGroup][$el.$input.value] = $el.$input.checked;
											if (!$el.$input.checked) {
												delete this.state[$el.dataGroup][$el.$input.value];
												if (!Object.keys(this.state[$el.dataGroup]).length) {
													delete this.state[$el.dataGroup];
												}
											}
										} else {
											this.state[$el.dataKey] = $el.$input.checked;
											if (!$el.$input.checked) {
												delete this.state[$el.dataKey];
											}
										}
										this.saveState();
									}
									/*
									// 与我有关的 checkbox
									if ($el.$input.value === 'involved') {
										this.state.involved = $el.$input.checked;
									} else {
										this.state.types = this.state.types || {};
										this.state.types[$el.$input.value] = $el.$input.checked;
									}

									this.saveState();*/
								}, 50);
							}
							break;
						case 'checkbox-manhour-range':
							$el.$input = $el.querySelector('input[type="checkbox"]');
							if ($el.$input) {
								setTimeout(() => {
									if ($el.$input.checked) {
										$el.$input.parentNode.parentNode.classList.add('active');
									} else {
										$el.$input.parentNode.parentNode.classList.remove('active');
									}
								}, 50);
							}
							break;
						case 'switchView':
							// console.log('switchView:', this.$route, this.$route.path);
							// console.log('Q:', this.query.toString());
							if ($el.dataset.view.startsWith('home') && this.$route.path.startsWith('/home')) {
								this.$router.push(window.location.hash.substring(1));
								$el.hash = window.location.hash;
								$el.dataset.view = window.location.hash.substring(2);
								this.homeViewURL = window.location.hash.substring(1);
								// console.log('homeViewURL:', this.homeViewURL);
								return;
							}
							this.$router.push('/'+ $el.dataset.view);
							break;
						case 'load':
							// console.log('r:', this.$router);
							$app.$search.search()
							break;
						case 'copyManhours':
							var $table = $app.$manhourResult.querySelector('table');
							if (!$table) {
								return;
							}
							$el.setAttribute('disabled', 'disabled');
							copyElementContents($table).then(() => {
								$el.innerText = '复制成功';
								setTimeout(() => {
									$el.innerText = '复制';
									$el.removeAttribute('disabled');
								}, 3000);
							}).catch(() => {
								$el.removeAttribute('disabled');
							});
							break;
						case 'viewManhours':
							if (this.#VIEW_MANHOUR_MEMBER.loading) {
								return false;
							}
							var fd = $app.getManhoursFormData();
							// console.log('fd:', fd);
							fd.start = new Date(`${ fd.year }/${ fd.month }/1 00:00:00`);
							// fd.end = new Date(`${ fd.year }/${ fd.month }/1 23:59:59`);
							fd.end = new Date(`${ fd.endYear }/${ fd.endMonth }/1 23:59:59`);
							fd.end.setMonth(fd.end.getMonth() + 1);
							fd.end.setDate(0);
							// console.log('manhour range:', { start: new Date(fd.start).toLocaleString('zh-CN', { hour12: false }), end: new Date(fd.end).toLocaleString('zh-CN', { hour12: false }) });
							fd.monthRange = [];
							fd.monthRange.push(fd.start.getTime());
							fd.monthRange.push(fd.end.getTime());
							// console.log('fd:', fd);
							// console.log('fd:', fd.start.toLocaleString(), ' -> ', fd.end.toLocaleString());
							this.#VIEW_MANHOUR_MEMBER.loading = true;
							$el.innerText = '加载中...';
							$app.$manhourResult.innerHTML = `<h2 class="y-app-h2 y-app-italic"> 加载中... </h2>`;
							this.#VIEW_MANHOUR_MEMBER.getManhours(fd.groupby, fd.monthRange).then((data) => {
								$app.$manhourResult.innerHTML = this.#VIEW_MANHOUR_MEMBER.render(data);
								$app.$manhourResult.classNameRowSelected = 'y-app-table__manhour-row-selected';
								$app.$manhourResult.$trs = $app.$manhourResult.querySelectorAll('tbody>tr');
								$app.$manhourResult.$trs.forEach((item) => {
									((tr) => {
										tr.addEventListener('click', (event) => {
											if (tr.classList.contains($app.$manhourResult.classNameRowSelected)) {
												return tr.classList.remove($app.$manhourResult.classNameRowSelected);
											}
											$app.$manhourResult.$trs.forEach((_tr) => {
												_tr && _tr.classList.remove($app.$manhourResult.classNameRowSelected);
											});
											tr.classList.add($app.$manhourResult.classNameRowSelected);
										});
									})(item);
								});
								// console.log('trs', $app.$manhourResult.$trs);
							}).catch((ex) => {
								console.error(`[ERROR]`, ex);
								$app.$manhourResult.innerHTML = `<h2 class="y-app-h2 y-app-italic">出错了, 请重试</h2>`
							}).finally(() => {
								$el.innerText = '查看';
								this.#VIEW_MANHOUR_MEMBER.loading = false;
							});
							break;
						default:
							break;
					}

				}
			});

			$app.$bookmarks.star = (resId) => {
				let $el = $app.$search.$result.querySelector(`.y-app-btn-icon[data-id="${ resId }"]`);
				if ($el) {
					$el.innerHTML = ICONS.starred;
					$el.title = '取消收藏';
				}
			}
			$app.$bookmarks.unstar = (resId) => {
				let $el = $app.$search.$result.querySelector(`.y-app-btn-icon[data-id="${ resId }"]`);
				if ($el) {
					$el.innerHTML = ICONS.star;
					$el.title = '收藏';
				}
			}
			$app.$bookmarks.update = () => {
				const html = VIEWS.map((view) => {
					return view.render(view, BOOKMARKS.get(view.object), { from: 'bookmark' });
				}).join('');
				$app.$bookmarks.innerHTML = html.trimHTML() || `<h2 class="y-app-h2"> ~(^_^)~ </h2>`;
			}
			$app.$bookmarks.update();

			// favicon
			$app.$fav = document.createElement('link');
			$app.$fav.setAttribute('rel', 'icon');
			$app.$fav.setAttribute('href', 'https://www.yidayun.com/images/favicon.png');
			document.head.appendChild($app.$fav);

			// mounted
			$app.$shadow.appendChild($app.$root);
			this.$app = $app;

			this.trigger('beforeMount');

			console.log(`[OK] 初始化 易用云 主界面`);

			if (typeof callback === 'function') {
				callback();
			}
		}

		get search() {
			return (keyword, isUpdateInputValue) => {
				const { $app } = this;
				if (!$app) {
					return console.warn(`$app is undefined`);
				}
				keyword = (keyword || '').toString().trim();
				$app.$search.$keyword.value = keyword;
				$app.$search.search(keyword, isUpdateInputValue);
				if (this.$router) {
					const query = {};
					if (keyword) {
						query.keyword = keyword;
					}
					this.$router.push({ path: '/search', query });
				}
			}
		}

		get createHomeView() {
			return (path) => {
				const { $app } = this;
				if (!$app) {
					return;
				}
				path = path || '/home';
				// path = path + (path.indexOf('?') > 1 ? '&' : '?');
				path = `https://web.yidayun.com${ path || '/home' }`;
				if (path && path === this.homeViewURL) {
					console.log('URL 无变化');
					return;
				}
				if ($app.$homeView) {
					$app.$main.removeChild($app.$homeView);
				}
				this.homeViewURL = path;
				// console.log('https://web.yidayun.com/home?rootMenu=d27b033dede44c8a9d477041e9edb35d&menu=b5b5yeennmf')
				// console.log(path)
				// path = 'https://web.yidayun.com/home?rootMenu=d27b033dede44c8a9d477041e9edb35d&menu=b5b5yeennmf'
				//$app.$homeNav = $app.$navs[0];
				//$app.$homeNav.classList.add('active');
				$app.$homeView = document.createElement('div');
				$app.$homeView.className = 'y-app-view y-app-view__home active';
				$app.$homeView.dataset.view = 'home';
				$app.$homeView.innerHTML = `
<div class="y-app-view__container">
	<iframe class="y-app-view__iframe" src="${ path }" frameborder="0" scrolling="no"></iframe>
</div>
`.trimHTML();
				$app.$homeView.$frame = $app.$homeView.querySelector('iframe');
				$app.$homeView.$frame.addEventListener('load', () => {
					// this.homeViewURL = path;
					console.log('iframe loaded', this.homeViewURL);
				});
				$app.$main.appendChild($app.$homeView);
			}
		}

		get switchView() {
			return (view) => {
				const { $app } = this;
				// console.log('@@@', view)
				if (!$app) {
					return;
				}
				// $app.$navs = $app.$nav.querySelectorAll('.y-app-nav__item');
				$app.$views = $app.$root.querySelectorAll('.y-app-view');
				let $nav, $view;
				$app.$navs.forEach((item) => {
					item.classList.remove('active');
					(($el) => {
						if ($el.dataset.view.split('?')[0] === view) {
							$nav = $el;
						}
					})(item);
				});
				$app.$views.forEach((item) => {
					item.classList.remove('active');
					(($el) => {
						if ($el.dataset.view.split('?')[0] === view) {
							$view = $el;
						}
					})(item);
				});
				if ($nav) {
					$nav.classList.add('active');
				}
				if ($view) {
					$view.classList.add('active');
				}
				// console.log('@@@', view, $view, $nav)
			}
		}

		// 标签页备份器
		tabsBackuper() {
			let tab = null;
			let tabs = null;

			const keyTab = USER_INFO.get('keyTab');
			const keyTabs = USER_INFO.get('keyTabs');

			// remove theme_local_storage_key
			window.localStorage.removeItem('theme_local_storage_key');

			// restore to sessionStorage
			tab = window.localStorage.getItem('y-app-CUR_TAB');
			tabs = window.localStorage.getItem('y-app-TABS');
			if (tabs) {
				window.sessionStorage.setItem(keyTab, tab);
				window.sessionStorage.setItem(keyTabs, tabs);
			}

			// loop backup to localStorage
			this.timer_backuper = setInterval(() => {
				tab = window.sessionStorage.getItem(keyTab);
				tabs = window.sessionStorage.getItem(keyTabs);
				if (tabs) {
					window.localStorage.setItem('y-app-CUR_TAB', tab);
					window.localStorage.setItem('y-app-TABS', tabs);
				}
			}, 1500);

			console.log(`[OK] 初始化 标签页备份器`);
		}


		// 屏蔽日志监控&垃圾
		block_something_bad() {
			var block_it = function() {
				// baidu
				if (window._agl && window._agl.stop) {
					// window._agl.push = () => {};
					// window._agl.ext._v = '9.9.6';
					// window._agl.ext._s = '996';
					// window._agl.ext.xAngeliaLogid = '996';
					window._agl.stop();
				}

				// aliyun
				if (window.__bl && window.__bl.removeHook) {
					window.__bl.removeHook();
					if (window.__bl._conf) {
						window.__bl._conf.debug = true;
						window.__bl._conf.enableSPA = false;
						window.__bl._conf.environment = 'dev';
						window.__bl._conf.imgUrl = '';
						window.__bl._conf.ignoreUrlPath = '/';
					}
				}
			}

			setInterval(() => {
				block_it();
			}, 500);
			block_it();

			var clean_it = function() {
				window.sessionStorage.removeItem('_bl_sid');
				for (var key in window.localStorage) {
					if (key && key.startsWith('fclog_')) {
						window.localStorage.removeItem(key);
					}
				}
			}

			setInterval(() => {
				clean_it();
			}, 1000 * 3);
			clean_it();

			console.log(`[OK] 初始化 屏蔽垃圾监控请求`);
		}

		get use() {
			const that = this;
			return function(plugin) {
				const args = [ ...arguments ];
				args[0] = that;
				if (plugin && typeof plugin.install === 'function') {
					// console.log('..', args);
					plugin.install.apply(that, args);
				}
			}
		}

		// 事件
		#EVENTS = {};

		get on() {
			const that = this
			const EVENTS = this.#EVENTS;
			return (eventType, handler) => {
				if (typeof eventType !== 'string' || typeof handler !== 'function') {
					return;
				}
				EVENTS[eventType] = EVENTS[eventType] || [];
				EVENTS[eventType].push(handler);
			}
		}

		get off() {
			const that = this
			const EVENTS = this.#EVENTS;
			return (eventType, handler) => {
				if (typeof eventType !== 'string' || !Array.isArray(EVENTS[eventType])) {
					return;
				}
				if (typeof handler === 'function') {
					EVENTS[eventType] = EVENTS[eventType].map((item) => {
						return item !== handler;
					});
					return;
				}
				if (handler === undefined) {
					delete EVENTS[eventType];
				}
			}
		}

		get trigger() {
			const that = this
			const EVENTS = this.#EVENTS;
			return function(eventType) {
				const args = [ ...arguments ];
				args[0] = { type: eventType, target: that };
				// args.splice(0, 1);
				if (typeof eventType !== 'string' || !Array.isArray(EVENTS[eventType])) {
					return;
				}
				EVENTS[eventType].forEach((item) => {
					((handler) => {
						// console.log('trigger.handler', handler, args);
						handler.apply(that, args);
					})(item);
				});
			}
		}

		init() {
			if (this.inited) {
				return console.warn(`[WARN] 已经初始化过了`);
			}

			this.block_something_bad();

			this.injectGlobalStyle();

			this.getUserInfo().then((data) => {

				// 非iframe 才初始化 易用云 主视图
				if (window.top === window) {

					// 回到极速版
					const pathname = window.location.pathname;
					if (pathname == '/' || pathname.endsWith('/home') || pathname.endsWith('/share/form') || pathname.endsWith('/designer/form') || pathname.endsWith('/app-market')) {
						window.location.href = window.location.href.replace(/^https\:\/\/web\.yidayun\.com\//, '/home.html#/');
						return false;
					}

					this.initMainView(() => {

						// this.tabsBackuper();

						this.trigger('mounted');

						// 定时更新工时
						this.$app.updateManhour();

					});
				}

			}).catch((err) => {
				console.error(err);
				const pathname = window.location.pathname;
				if (pathname.startsWith('/login') || pathname.startsWith('/share/form')) {
					return false;
				}
				const $message = document.createElement('div');
				$message.innerHTML = `
<center><h1>${ err.errorMessage }</h1></center><hr><center>错误码 (${ err.errorCode })</center>
${ err.errorCode === 403 ? `<center><h3>会话失效，<a rel="opener" style="color:#247fff;" href="https://web.yidayun.com/login?callback=${ encodeURIComponent(window.location.href) }" title="会话失效，需重新登录">重新登录</a></h3></center>` : '' }
`.trimHTML();
				document.body.insertBefore($message, document.body.childNodes[0]);
			});

			this.inited = true;
		}

	}


	class ROUTER {

		#OPTIONS = {
			base: '',
			history: false, // hash
			route: null,
			routes: [],
			routesMap: {},
			beforeEach: (to, from, next) => {
				if (typeof next === 'function') {
					next();
				}
			},
			afterEach: (to, from) => {}
		};

		#POPSTATE = [];

		pushState = ((fn) => {
			const OPTIONS = this.#OPTIONS;
			return function(state, title, url) {
				if (typeof state === 'object') {
					state = JSON.parse(JSON.stringify(state));
					arguments[0] = state;
				}
				if (OPTIONS.history) {
					fn.apply(window.history, arguments);
				} else {
					OPTIONS.isForward = true;
					window.location.hash = url;
					setTimeout(() => {
						delete OPTIONS.isForward;
					}, 100)
				}
			}
		})(window.history.__proto__.pushState);

		replaceState = ((fn) => {
			const OPTIONS = this.#OPTIONS;
			return function(state, title, url) {
				if (typeof state === 'object') {
					state = JSON.parse(JSON.stringify(state));
					arguments[0] = state;
				}
				if (OPTIONS.history) {
					fn.apply(window.history, arguments);
				} else {
					OPTIONS.isForward = true;
					window.location.replace('#'+ url);
					setTimeout(() => {
						delete OPTIONS.isForward;
					}, 100)
				}
			}
		})(window.history.__proto__.replaceState);


		constructor(options) {
			options = { ...options };

			if (options.base) {
				this.#OPTIONS.base = options.base;
			}

			if (options.history) {
				this.#OPTIONS.history = options.history;
			}

			if (options.routes) {
				this.add(options.routes);
			}

			if (options.beforeEach) {
				this.beforeEach(options.beforeEach);
			}

			if (options.afterEach) {
				this.afterEach(options.afterEach);
			}

			console.log(`[OK] 初始化 路由 ...`);
		}

		get path() {
			const OPTIONS = this.#OPTIONS;
			let path = '';
			if (OPTIONS.history) {
				path = window.location.pathname;
			} else {
				path = window.location.hash.substr(1).split('?')[0];
			}
			path = path.substr(OPTIONS.base.length);
			return path;
		}

		get query() {
			const OPTIONS = this.#OPTIONS;
			let query = '';
			if (OPTIONS.history) {
				query = window.location.search.substr(1);
			} else {
				query = window.location.hash.split('?')[1] || '';
			}
			query = new URLSearchParams(query);
			// const qs = query.toString();
			query = Object.fromEntries(query);
			Object.defineProperty(query, 'toString', {
				get() {
					return () => {
						// return qs;
						return new URLSearchParams(query).toString();
					}
				}
			});
			return query;
		}

		dispatch() {
			const OPTIONS = this.#OPTIONS;
			const { beforeEach, afterEach } = OPTIONS;

			const onChange = (event) => {
				// console.log('onChange', event);

				if (event.type === 'hashchange' && OPTIONS.isForward) {
					// console.error('[isForward]', OPTIONS.isForward);
					delete OPTIONS.isForward;
					return;
				}

				const form = OPTIONS.route;
				const to = OPTIONS.routesMap[this.path];
				// console.log('onChange.meta', to.meta);
				// console.log('change.to', to, form)
				if (to && to.path && to.handler) {

					to.meta = { ...to.meta };
					to.query = this.query;
					to.qs = to.query.toString();
					if (form) {
						form.meta = { ...form.meta };
					}

					const next = () => {
						this.#OPTIONS.route = to;
						to.handler();
						if (typeof afterEach === 'function') {
							afterEach(form, to);
						}
					}
					if (typeof beforeEach === 'function') {
						beforeEach(to, form, next);
					} else {
						next();
					}
				}

			}


			// bind event
			if (OPTIONS.history) {
				window.addEventListener('popstate', onChange);
			} else {
				window.addEventListener('hashchange', onChange);
			}

			// start
			const { routes, routesMap } = OPTIONS;
			const to = { meta: {}, query: this.query };
			let currentRoute = null;
			if (routesMap[this.path]) {
				currentRoute = routesMap[this.path];
			} else {
				if (routes.length) {
					currentRoute = routes[0];
				}
			}
			if (currentRoute) {
				to.path = currentRoute.path;
				to.meta = currentRoute.meta || to.meta;
			}
			this.push(to);

			console.log(`[OK] 初始化 路由 开始监听`);
		}

		get beforeEach() {
			return (fn) => {
				if (typeof fn === 'function') {
					this.#OPTIONS.beforeEach = fn;
				}
			}
		}

		get afterEach() {
			return (fn) => {
				if (typeof fn === 'function') {
					this.#OPTIONS.afterEach = fn;
				}
			}
		}

		get options() {
			return this.#OPTIONS;
		}

		get add() {
			return (route, handler) => {
				if (Array.isArray(route)) {
					route.forEach((item) => {
						((_route) => {
							this.add(_route, handler);
						})(item);
					});
					return;
				}
				if (typeof route === 'string' && route.length) {
					route = { path: route };
				}
				if (typeof route === 'object' && typeof handler === 'function') {
					route.handler = handler || route.handler;
				}
				if (typeof route.path === 'string' && route.path.length && typeof route.handler === 'function') {
					// route.path = this.#OPTIONS.base + route.path;
					route.meta = { ...route.meta };
					if (this.#OPTIONS.routesMap[route.path]) {
						return console.warn(`[WARN] route has existed`);
					}
					this.#OPTIONS.routesMap[route.path] = route;
					this.#OPTIONS.routes.push(route);
				}
			}
		}

		get $route() {
			return this.#OPTIONS.route;
		}

		get $routes() {
			return this.#OPTIONS.routes;
		}

		get $router() {
			return this;
		}

		get parse() {
			return (route) => {
				if (typeof route === 'string' && route.length) {
					route = { path: route };
				}
				if (typeof route === 'object' && typeof route.path === 'string' && route.path.length) {
					route.path = route.path.split('?');
					route.qs = route.path[1] || '';
					route.path = route.path[0];
					route.qs = new URLSearchParams(route.qs).toString();
					if (route.query instanceof URLSearchParams) {
						route.query = route.query.toString();
					} else {
						route.query = new URLSearchParams(route.query).toString();
					}
					route.qs+= (route.qs.length && route.query.length ? '&' : '') + route.query;
					route.query = Object.fromEntries(new URLSearchParams(route.qs));
					// route.qs = (route.qs.length ? '?' : '') + route.qs;
					Object.defineProperty(route.query, 'toString', {
						get() {
							return () => {
								return route.qs;
							}
						}
					});
					return route;
				}
			}
		}

		get push() {
			return (to) => {
				to = this.parse(to);
				if (!to || !to.path) {
					return console.log(`[ERROR] route path error`);
				}
				const { base, route, routesMap, beforeEach, afterEach } = this.#OPTIONS;
				if (route && route.path === to.path && route.qs === to.qs) {
					return;
				}
				const currentRoute = routesMap[to.path];
				if (currentRoute && currentRoute.path && currentRoute.handler) {
					const form = route;

					to.meta = { ...currentRoute.meta };
					// console.log('push.meta', to.meta);
					to.handler = currentRoute.handler;
					if (form) {
						form.meta ={ ...form.meta };
					}

					const next = () => {
						this.pushState(to, form, base + to.path + (to.qs ? '?' : '') + to.qs);
						this.#OPTIONS.route = to;
						to.handler();
						if (typeof afterEach === 'function') {
							afterEach(form, to);
						}
					}

					if (typeof beforeEach === 'function') {
						beforeEach(to, form, next);
					} else {
						next();
					}

				}
			}
		}

		get replace() {
			return (to) => {
				to = this.parse(to);
				if (!to || !to.path) {
					return console.log(`[ERROR] route path error`);
				}
				const { base, route, routesMap, beforeEach, afterEach } = this.#OPTIONS;
				if (route && route.path === to.path && route.qs === to.qs) {
					return;
				}
				const currentRoute = routesMap[to.path];
				if (currentRoute && currentRoute.path && currentRoute.handler) {
					const form = route;

					to.meta = { ...currentRoute.meta };
					// console.log('replace.meta', to.meta);
					to.handler = currentRoute.handler;
					if (form) {
						form.meta ={ ...form.meta };
					}

					const next = () => {
						this.replaceState(to, form, base + to.path + (to.qs ? '?' : '') + to.qs);
						this.#OPTIONS.route = to;
						to.handler();
						if (typeof afterEach === 'function') {
							afterEach(form, to);
						}
					}

					if (typeof beforeEach === 'function') {
						beforeEach(to, form, next);
					} else {
						next();
					}

				}
			}
		}

		get back() {
			return () => {
				window.history.back();
			}
		}

		get reload() {
			return () => {
				window.location.reload();
			}
		}

		get install() {
			return (app) => {
				// console.log('install.app', app);
				if (app && typeof app.use === 'function') {
					Object.defineProperties(app, {
						$route: {
							get: () => {
								return this.$route
							}
						},
						$routes: {
							get: () => {
								return this.$routes
							}
						},
						$router: {
							get: () => {
								return this.$router
							}
						}
					});

					app.on('beforeMount', () => {
						this.dispatch();
					});
				}
			}
		}

	}

	// html 时才注入
	if (document.contentType === 'text/html') {

		const router = new ROUTER({
			base: '',
			routes: [
				{
					path: '/home',
					meta: {
						title: ''
					},
					handler() {
						if (this.query.view) {
							$Y.createHomeView('/home?view='+ encodeURIComponent(this.query.view) );
							//console.log('view:', this.query.view);
						} else {
							const qs = this.query.toString();
							if (qs.length > 4) {
								$Y.createHomeView('/home?'+ qs);
							} else {
								$Y.createHomeView();
							}
						}
						$Y.switchView('home');
					}
				},
				{
					path: '/share/form',
					meta: {
						title: ''
					},
					handler() {
						if (this.query.number) {
							$Y.createHomeView('/share/form?number='+ encodeURIComponent(this.query.number) );
						}
						$Y.switchView('home');
					}
				},
				{
					path: '/share/form/private',
					meta: {
						title: ''
					},
					handler() {
						if (this.query.number) {
							$Y.createHomeView('/share/form/private?number='+ encodeURIComponent(this.query.number) );
						}
						$Y.switchView('home');
					}
				},
				{
					path: '/designer/form',
					meta: {
						title: ''
					},
					handler() {
						if (this.query.object) {
							$Y.createHomeView('/designer/form?object='+ encodeURIComponent(this.query.object) );
						}
						$Y.switchView('home');
					}
				},
				{
					path: '/app-market',
					meta: {
						title: ''
					},
					handler() {
						$Y.createHomeView('/app-market?'+ this.qs);
						$Y.switchView('home');
					}
				},
				{
					path: '/bookmarks',
					meta: {
						title: '收藏夹'
					},
					handler() {
						$Y.switchView('bookmarks');
					}
				},
				{
					path: '/search',
					meta: {
						title: '需求/任务/工时'
					},
					handler() {
						$Y.switchView('search');
						if (this.query.keyword && this.query.keyword.length) {
							$Y.search(this.query.keyword);
						}
					}
				},
				{
					path: '/manhour',
					meta: {
						title: '工时'
					},
					handler() {
						$Y.switchView('manhour');
					}
				},
				{
					path: '/setting',
					meta: {
						title: '设置'
					},
					handler() {
						$Y.switchView('setting');
					}
				},
			]
		});
		router.beforeEach((to, from, next) => {
			// console.log('beforeEach:', { to, from, next });
			// console.log('beforeEach.meta:', to.meta);
			document.title = (to.meta.title ? to.meta.title +' - ' : '') + $Y.name;
			next();
		});
		/*router.afterEach((to, from) => {
			console.log('afterEach:', { to, from });
		});*/


		const $Y = new Y();

		if (window.top === window) {
			$Y.use(router);
			$Y.on('mounted', (event) => {
				// const app = event.target;

				if ($Y.path.startsWith('/home?view=')) {
					window.location.replace('/home.html#/home'+ window.location.search);
					return;
				}
				if ($Y.path.startsWith('/share/form?number=')) {
					window.location.replace('/home.html#/share/form'+ window.location.search);
					return;
				}
				if ($Y.path.startsWith('/share/form/private?number=')) {
					window.location.replace('/home.html#/share/form'+ window.location.search);
					return;
				}

				// event.target
				// console.log('>>>s', this, $Y.path);
				const keyword = $Y.$route.query.keyword;
				if (keyword) {
					$Y.search(keyword, true);
				}
			});
		}


		window.$Y = $Y;
	}
})();