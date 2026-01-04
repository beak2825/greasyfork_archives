// ==UserScript==
// @name        上应大健康上报器
// @description 登录后，每天打开 http://xgfy.sit.edu.cn/h5/#/pages/index/report 时，自动检查上报状态，发出上报请求，并刷新页面。
// @namespace   UnKnown
// @author      UnKnown
// @icon        
// @match       http://xgfy.sit.edu.cn/h5/*
// @version     1.2
// @require     https://unpkg.com/js-md5/build/md5.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-idle
// @inject-into auto
// @compatible  脚本运行环境必须支持 GM_getValue() 和 GM_setValue()
// @license     AGPL-3.0-or-later or CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/413250/%E4%B8%8A%E5%BA%94%E5%A4%A7%E5%81%A5%E5%BA%B7%E4%B8%8A%E6%8A%A5%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/413250/%E4%B8%8A%E5%BA%94%E5%A4%A7%E5%81%A5%E5%BA%B7%E4%B8%8A%E6%8A%A5%E5%99%A8.meta.js
// ==/UserScript==

"use strict";

location.hash.startsWith("#/pages/index/jksb") &&
(() => {

// lastTime
// 脚本存储的上次上报时间

// 初始化
GM_getValue("lastTime") === undefined &&
GM_setValue("lastTime", 0); // 1970/1/1

// getLastTime(): date
// 将 lastTime 转换回 Date 对象并返回
// JavaScript 的 Date 对象其实是 DateTime 对象…
const getLastTime = () => new Date(GM_getValue("lastTime"));

// logLastTime()
// 输出 lastTime 的日期
const logLastTime = () => console.log(
	"lastTime: ".concat(getLastTime().toLocaleDateString())
);

// setLastTime()
// 设置 lastTime 并输出其日期
const setLastTime = ( timeStamp = Date.now() ) => {
	GM_setValue( "lastTime", timeStamp );
	logLastTime();
};

// 每次打开页面时，输出一次脚本存储的上次上报时间
logLastTime();

// 页面中的 uni-app 的根属性，具体详见 https://uniapp.dcloud.io/
const uni = unsafeWindow.uni;

// showToast(title, icon, duration)
const showToast = uni

	? (title, icon = "none", duration = 1500) =>
		uni.showToast({ title, icon, duration })

	: (title, icon = "none", duration = 1500) => {

		const background = document.createElement("div");
		background.style =
"display: flex; pointer-events: none;" +
"position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 999";

		const toast = document.createElement("div");
		toast.textContent = title;
		toast.style =
"margin: auto; padding: 10px 20px; border-radius: 5px; font-size: 13px;" +
"color: #fff; background-color: rgba(17, 17, 17, .7);" +
"text-align: center; word-break: break-all; white-space: normal;";

	background.appendChild(toast);
	document.body.appendChild(background);
	setTimeout(
		() => document.body.removeChild(background), duration
	);

};

// isNotToday(date): Boolean
// 判断给出的 Date 对象的日期是否不是今天，返回 true 或 false
// 如果上次上报的日期不是今天，那就要上报喽
const today = new Date();
const isNotToday = date => [
	"getFullYear", "getMonth", "getDate"
].some(
	method => date[method]() !== today[method]()
);

// getElement(selector=...): Element | null
// 尝试获取最新一条上报记录的日期元素
const getElement = (
	selector = '.cu-list.menu-avatar > .cu-item:first-child > .action'
) => document.querySelector(selector);

// 为什么 getElement() 不在 isNotReported() 里面：
// 页面加载完成后，需要先异步获取上报记录，才能生成对应的元素，依网络情况不同，
// 这可能需要几秒，甚至可能失败；所以，在 isNotReported() 之后的代码里，需要
// 用到 getElement() 来进行数次定时尝试。

// 那为啥不用 MutationObserver？
// 依签到天数，可能会同时生成上百条上报记录，不值得。

// ----

// isNotReported(element) : Boolean | null
// 按上报记录中的日期字符串判断是否未上报
const isNotReported = element => {

	// parseElement(element)
	// 将日期元素处理成日期字符串
	const parseElement = element => element.textContent.trim();

	// parseDateString(dateStr)
	// 将形如 19700101 的日期字符串转换为 Date 对象，若无法转换则返回 null
	const parseDateString = dateStr => {

		// dateStr: "19700101"
		// dateArr: [1970, 1, 1]
		if (dateStr.length === 8) {
			const dateArr = [ [0, 1, 2, 3], [4, 5], [6, 7] ].map( 
				indexArr => Number.parseInt(
					indexArr.map( index => dateStr[index] ).join("")
				)
			);
			if ( dateArr.every( num => Number.isInteger(num) && num > 0 ) ) {
				return new Date( // --dateArr[1] : months range from 0 to 11, not 1 to 12
					Date.UTC( dateArr[0], --dateArr[1], dateArr[2] )
				);
			}
			else {
				console.warn("dateArr should contain 3 positive integer");
				return null;
			}
		} else {
			console.warn("the length of dateStr must be 8");
			return null;
		}

	};

	// 按照 Date 对象的可用性与日期，返回结果
	const pageLastTime = parseDateString(parseElement(element));
	if ( pageLastTime !== null ) {
		if ( isNotToday(pageLastTime) ) {
			return true;
		} else {
			// 如果页面中的上报记录为今天，额外提示“今天已经上报过了”
			showToast("今天已经上报过了");
			// 同时，如果脚本存储的上次上报时间不是今天，就更新一下
			isNotToday(getLastTime()) && setLastTime();
			return false;
		}
	} else {
		return null;
	}

};

// report()
// 自动上报
const report = () => {

	// data
	// data 对象，包含所有请求内容，由用户数据和上报信息构成

	// 尝试获取用户数据
	const rawUserInfo = uni
		? uni.getStorageSync("userInfo")
		: localStorage.getItem("userInfo");

	if (!rawUserInfo) {
		console.error("userInfo not found");
		return false;
	}

	// 将 JSON 格式的用户数据解析为对象
	const userInfo = JSON.parse(rawUserInfo);

	// 准备 data 对象
	const data = {

		// 布尔值：{ 否: 0, 是: 1 }

		/* 用户数据 */
		usercode: userInfo.code, // 学号
		username: userInfo.name, // 姓名
		usertype: userInfo.usertype, // 用户类型（数字）学生默认为 2
		jiguan: userInfo.jiguan, // 籍贯 { 武汉: 1, 湖北: 2, 其他: 3 }
		deptno: userInfo.deptno, // 部门/学院代号

		/* 今日身体情况 */
		currentsituation: 3, // 新冠诊断 { 确诊: 1, 疑似: 2, 正常: 3, 无症状感染者: 4 }
		           wendu: 0, // 今日体温 { ≤37.3℃: 0, ＞37.3℃: 1 }
		            ksfl: 0, // 其他症状/咳嗽乏力（布尔值）
		        mjjcqzhz: 0, // 密切接触确诊患者（布尔值）
		     qwhtjzgfxdq: 0, // 14天内前往或途经中高风险地区（布尔值）
		  tzrqwhtjzgfxdq: 0, // 同住人14天内前往或途经中高风险地区（布尔值）

		/* 今日位置 */
		     position: "上海市-市辖区-奉贤区", // 当前位置 "省-市-区县"
		     inschool: "1", // 是否在校（布尔值）
		  szdsfzgfxdq: "0", // 所在地区是否为中高风险地区（布尔值）
		szdssfyzgfxdq: "0", // 所在地市(区)是否有中高风险地区（布尔值）

		/* 今日行程 */
		 mdd: "请选择", // 目的地 "请选择" / "省-市-区县"
		  sy: null,     // 行程事由
		drwf: 0,        // 当日往返（布尔值）
		jtgj: 0,        // 交通工具
		cfsj: "请选择", // 出发时间 "请选择" / "yyyy-MM-dd"
		jtcc: null,     // 航班号/车次号/交通车次

		// 备注     | ID
		remarks: "" , id: 0

	};

	// sign: {decodes, ts}
	// 请求头中必须包含 sign 对象的全部属性，否则服务器不会接受请求
	const sign =
		unsafeWindow.getSign instanceof Function
			? unsafeWindow.getSign(data.usercode)
		: md5 instanceof Function
			? ((str, time) => {
				str = md5( str + "Unifri" + time ).toUpperCase();
				return {
					decodes: str.slice(16) + str.slice(0, 16),
					ts: time
				};
			})( data.usercode, Date.now() )
		: null;

	if (!sign) {
		console.error("Can't create sign");
		return false;
	}

	const confirmReload = (str, error) => {
		console.error(error);
		confirm(
			str + "时发生错误，错误日志已输出至控制台：\n" +
			error + "\n是否刷新页面并重试？"
		) && location.reload();
	};

	// fetch
	// 发出请求，处理相应
	if ( data && sign ) fetch(
		"http://210.35.96.114/report/report/todayReport", {
			method      : "POST",
			mode        : "cors",
			credentials : "omit",
			referrer    : "http://xgfy.sit.edu.cn/h5/",
			headers: Object.assign(
				{ "Content-Type" : "application/json" }, sign
			),
			body: JSON.stringify(data)
		}
	).catch(
		error => confirmReload("请求")
	).then( // 将响应对象中的数据作为 JSON 处理，并转换为对象
		// { "code":0,"msg":null,"data":null }
		response => response.json()
	).catch(
		error => confirmReload("解析响应数据")
	).then( // 上报成功
		jsonObj => {
			console.info(jsonObj); // 输出响应数据
			setLastTime();         // 存储（并输出）上次上报时间
			showToast("上报成功", "success");
			setTimeout( () => showToast("即将刷新页面") , 1750 );
			setTimeout( () => location.reload()         , 2500 );
		}
	);
	else console.error(
		!data ? "data is not ready" :
		!sign ? "sign is not ready" :
		"what"
	);

};

// showHistory(selector=...)
// 自动切到签到历史
const showHistory = (
	selector = '.nav .cu-item[data-id="1"]'
) => {
	const history = document.querySelector(selector);
	history && history.click();
};

// enableButton(selector=...)
const enableButton = (
	selector = 'uni-button[disabled]'
) => document.querySelectorAll(selector).forEach(
	button => button.removeAttribute("disabled")
);

// fallback(message = "发生未知错误")
// 改按 lastTime 判断今天是否没上报。lastTime 不一定准确，所以，lastTime 判定
// 没上报就自动上报，但要是 lastTime 判定上报了，还是弹对话框问一下要不要上报。
const fallback = ( message = "发生未知错误" ) => {
	console.warn( message + "，改用脚本存储的上次上报时间" );
	(
		isNotToday(getLastTime()) ||
		confirm(
			message +
			"，无法获取页面中的上报记录，但脚本存储的上次上报时间为今天。\n" +
			"是否上报并刷新页面？"
		)
	) && report();
};

// ----

// 定时查找页面元素

// 间隔时间（毫秒）
const interval = 500;

// 重试次数
let retry = 30;

const intervalId = setInterval(
	() => {
		enableButton();
		const element = getElement();
		if ( element !== null ) {
			clearInterval(intervalId);
			switch ( isNotReported(element) ) {
				case true: report(); break;
				case false: showHistory(); break;
				case null: fallback("找到了上报记录元素，但无法解析");
			}
		} else if ( --retry <= 0 ) {
			clearInterval(intervalId);
			fallback("找不到上报记录元素");
		}
	}, interval
);

})();
