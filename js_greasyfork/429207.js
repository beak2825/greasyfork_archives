// ==UserScript==
// @name         电子科技大学教务助手
// @namespace    http://shawroger.gitee.io/
// @version      0.1.3
// @description  电子科技大学教务助手帮你更便捷地使用教务系统
// @author       shawroger
// @match        *://eams.uestc.edu.cn/eams/*
// @require   	 https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require   	 https://cdn.bootcdn.net/ajax/libs/highcharts/9.1.2/highcharts.min.js
// @icon         https://www.uestc.edu.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/429207/%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/429207/%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/**
 * 获取用户数据
 * 只用于数据处理
 */
const user = {
	id: "", // 学号
	name: "", // 姓名
	home: "http://eams.uestc.edu.cn/eams",
};

/**
 * 配置全局定时器时间间隔
 */
const itv = {
	app: 500,
	toHome: 0,
	crasher: 500,
	renderPlan: 400,
	renderScore: 500,
	crasherForTable: 800,
};

/**
 * 配置 window.localStorage 参数
 */
const storage = [
	/**
	 *  配置 是否显示顶部栏目
	 */
	{
		key: "UESTC_STUDYSYS_HELPER_SHOWBAR_ALL",
		defaultVal: 1,
		val: 1,
	},
	/**
	 * 配置 是否显示成绩图表
	 */
	{
		key: "UESTC_STUDYSYS_HELPER_SHOW_SCORE_CHART",
		defaultVal: 1,
		val: 1,
	},
];

/**
 * 配置 是否继续循环
 */
const loop = {
	/**
	 * 循环监听渲染 计划页面
	 */
	renderPlan: true,
	/**
	 * 循环监听渲染 成绩页面
	 */
	renderScore: true,
};

/**
 * 配置首页导航
 */
const navs = [
	{
		text: "查询平时成绩",
		img: "https://pic.imgdb.cn/item/60ead7fd5132923bf8f5b136.png",
		href: "http://eams.uestc.edu.cn/eams/teach/grade/usual/usual-grade-std.action",
	},
	{
		text: "查询我的成绩",
		img: "https://pic.imgdb.cn/item/60ead77f5132923bf8f3f56b.png",
		href: "http://eams.uestc.edu.cn/eams/teach/grade/course/person.action",
	},
	{
		text: "查询我的计划",
		img: "https://pic.imgdb.cn/item/60eadacf5132923bf8ffcca2.png",
		href: "http://eams.uestc.edu.cn/eams/myPlanCompl.action",
	},
];

/**
 * 配置成绩表格背景颜色
 * 以分数段染色
 */
const scoreColors = [
	{
		range: [85, 101],
		background: "LightSeaGreen",
		color: "",
		level: 1,
	},
	{
		range: [70, 85],
		background: "LawnGreen",
		color: "",
		level: 2,
	},
	{
		range: [60, 70],
		background: "NavajoWhite",
		color: "",
		level: 3,
	},
	{
		range: [-1, 60],
		background: "IndianRed",
		color: "white",
		level: 4,
	},
];

/**
 * 配置成绩表格背景颜色
 * 以关键词染色
 */
const keywColors = [
	{
		words: ["P", "A", "通过"],
		background: "LightSeaGreen",
		color: "",
		index: -3,
		level: 1,
	},
	{
		words: ["否"],
		background: "IndianRed",
		color: "white",
		index: -2,
		level: 4,
	},
];

/**
 *  成绩记录类
 *  由于生成图表
 */
class Recorder {
	constructor() {
		this.v1 = 0; // 第一等级
		this.v2 = 0; // 第二等级
		this.v3 = 0; // 第三等级
		this.bad = 0; // 未合格
	}

	/**
	 * 对成绩等级进行计数
	 * @param {number} 配置的 level
	 */
	add(level) {
		if (level === 1) {
			this.v1++;
		} else if (level === 2) {
			this.v2++;
		} else if (level === 3) {
			this.v3++;
		} else if (level === 4) {
			this.bad++;
		}

		if (this.onChange) {
			this.onChange();
		}
	}

	/**
	 * 生成 highchart 图表配置数据
	 * @returns
	 */
	chart() {
		const text = function () {
			if (includeUrl("myPlanCompl.action")) {
				return "计划完成分布图";
			} else if (includeUrl("teach/grade/usual")) {
				return "平时成绩分布图";
			} else if (includeUrl("teach/grade/course/person!historyCourseGrade")) {
				return "所有成绩分布图";
			} else {
				return "成绩分布图";
			}
		};
		const config = {
			title: {
				text: `${user.name.length > 0 ? user.name + "的" : ""}${text()}`,
			},
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				backgroundColor: "#f2f2f2",
			},
			tooltip: {
				pointFormat: "共 {point.y} 门课程 {point.percentage:.1f}%",
			},
		};

		const plotOptions = {
			pie: {
				allowPointSelect: true,
				cursor: "pointer",
				dataLabels: {
					enabled: true,
					format: "{point.name} {point.percentage:.1f} %",
					style: {
						color:
							(Highcharts.theme && Highcharts.theme.contrastTextColor) ||
							"black",
					},
				},
			},
		};

		const series = [
			{
				type: "pie",
				data: [
					["优秀", this.v1],
					["较好", this.v2],
					["一般", this.v3],
					["未完成", this.bad],
				],
			},
		];

		config.series = series;
		config.plotOptions = plotOptions;

		return config;
	}

	/**
	 * 读取成绩所在行的信息
	 * @param {any} tr 成绩所在行
	 * @param {string} text 成绩数据文字
	 */
	info() {
		// todo
		// waiting for v0.1.x
	}
}

/**
 * 判断指定元素是否 `不存在`
 * @param {string | object} selector 选择器
 * @returns
 */
function notfound(selector) {
	if (typeof selector === "string") {
		return $(selector).length === 0;
	}

	return selector.length === 0;
}

/**
 * 初始化全局数据
 */
function initUser() {
	const userdom = $("a[title=查看登录记录]").text();
	const index = userdom.indexOf("(");
	user.name = userdom.slice(0, index);
	user.id = userdom.slice(index + 1, userdom.length - 1);
}

/**
 *
 * @returns  返回localStorage配置列表
 */
function initStorage() {
	const parse = (key) => {
		const val = window.localStorage.getItem(key);
		if (typeof val === "number") {
			// Maybe NaN itself
			return val;
		} else if (typeof val === "string") {
			return Number(val);
		} else {
			return NaN;
		}
	};

	for (let i = 0; i < storage.length; i++) {
		const { key, defaultVal } = storage[i];
		const v = parse(key);
		if (isNaN(v)) {
			storage[i].val = defaultVal;
			window.localStorage.setItem(key, String(defaultVal));
		} else {
			storage[i].val = v;
		}
	}
}

/**
 *
 * @param {string | string[]} address 地址栏关键词
 * @returns 当前地址是否包含指定字符串
 */
function includeUrl(address) {
	if (typeof address === "string") {
		return window.location.href.includes(address);
	}
	for (const url of address) {
		if (window.location.href.includes(url)) {
			return true;
		}
	}
	return false;
}

/**
 * 直接跳转首页
 */
function toHome(interv) {
	if (!interv || interv < 100) {
		window.location.href = user.home;
		return;
	}

	setTimeout(() => (window.location.href = user.home), interv);
}

/**
 * 注入全局 CSS 样式
 */
function injectCSS() {
	const head = $("head");
	const css = `
	<style type="text/css">
		.uestc-helper-box {
			padding: 5px 10px;
			background: whiteSmoke;
			display: flex;
			justify-content: space-between;
			border-bottom: solid grey thin;
		}

		.btn-group button {
			margin-right: 15px;
		}

		#helper-text {
			font-size: 16px;
			padding-left: 10px;
		}

		.list_box_1 ul .li_1 {
			margin-bottom: 20px;
		}

		.btn-group {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 5px;
		}

		#ush_chart_box {
			width: 100%;
			height: auto;
			background: #f2f2f2;
		}

		#BottomBg a {
			color: orange
		}
	</style>`;
	head.append(css);
}

/**
 * 绑定全局按钮事件
 */
function injectEvent() {
	$("span.secondMenu a").click(() => {
		$("#ush_chart_box").hide();
	});

	$("a[href='/eams/home!index.action']").click(() => {
		$("#ush_chart_box").hide();
	});

	$("#reset_btn").click(() => {
		storage.forEach(({ key, defaultVal }) => {
			window.localStorage.setItem(key, JSON.stringify(defaultVal));
		});
		window.location.reload();
	});

	$("#show_btn").click(() => {
		$(".uestc-helper-box").show();
		window.localStorage.setItem(storage[0].key, "1");
		toHome(itv.toHome);
	});

	$("#close_btn").click(() => {
		$(".uestc-helper-box").hide();
		window.localStorage.setItem(storage[0].key, "0");
		toHome(itv.toHome);
	});

	$("#chart_btn").click(() => {
		window.localStorage.setItem(storage[1].key, storage[1].val > 0 ? "0" : "1");
		toHome(itv.toHome);
	});

	$("#position_bar span.secondMenu a").click(() => {
		$("#ush_chart_box").hide();
		loop.renderScore = true;
	});

	$(".toolbar-item-ge0 toolbar-item").click(() => {
		renderScore();
		loop.renderScore = true;
	});

	$("input[value='切换学期']").click(() => {
		renderScore();
		loop.renderScore = true;
	});
}

/**
 * 注入 HTML 代码
 */
function injectHTML() {
	if (notfound("#ush_chart_box")) {
		$("#main").before(`<div id="ush_chart_box"></div>`);
	}

	if (storage[0].val > 0) {
		const html = `
		<div class="uestc-helper-box">
			<p id="helper-text">欢迎使用<a
			target="_blank"
			href="https://greasyfork.org/zh-CN/scripts/429207-%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E5%8A%A9%E6%89%8B">
			电子科技大学教务助手
		</a></p>
			<div class="btn-group">
				<button id="chart_btn">图表功能：${storage[1].val > 0 ? "开" : "关"}</button>
				<button id="reset_btn">重置助手</button>
				<button id="close_btn">隐藏</button>
			</div>
		</div>`;

		if (notfound(".uestc-helper-box")) {
			$("body").prepend(html);
		}
	} else {
		const html = `<input type="button" id="show_btn" value="显示助手">`;
		if (notfound("input#show_btn")) {
			$("form[action='/eams/home.action']").append(html);
		}
	}
}

/**
 * 报错自动回到首页
 * @param {string | undefined } text 报错信息
 */
function errMsg(text) {
	if (!text) {
		text = "教务系统页面显示异常，即将自动重置";
	}
	$("#helper-text").text(text);
	$("#helper-text").css("color", "red");
	// 等待跳回
	setTimeout(toHome, itv.crasher);
}

/**
 * 监听教务系统
 * 出现异常直接跳转首页
 */
function crasher() {
	if (
		includeUrl([
			"stdElectCourse",
			"security/my.action",
			"teach/grade/usual/usual-grade-std!usualInfo.action",
		])
	) {
		return;
	}

	// 检查关键 dom 是否存在

	if (notfound("#position_bar") && notfound("#Nav_bar")) {
		errMsg();
	}
}

/**
 * 调整首页布局
 */
function injectLayout() {
	$("img[src = '/eams/avatar/my.action']").hide();
	if (includeUrl("home!submenus.action?")) {
		const node = $("div.list_box_1 li.li_1").last().clone(true);

		navs.forEach(({ text, img, href }) => {
			node.find("h3").text(text);
			node.find("a").attr("href", href);
			node.find("div").css("background", `url("${img}")  no-repeat 50% 50%`);

			$("div.list_box_1 li.li_1")
				.last()
				.parent()
				.append(`<li class="li_1">` + node.html() + `</li>`);
		});
	}
}

/**
 * 加入 footer 内容
 */
function injectFooter() {
	if (notfound("#helper_link")) {
		$("#BottomBg").append(
			`<br/><br/>
				页面启用了
					<a
						id="helper_link"
						target="_blank"
						href="https://greasyfork.org/zh-CN/scripts/429207-%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E5%8A%A9%E6%89%8B">
						电子科技大学教务助手
					</a> by shawroger`
		);
	}
}

/**
 * 通过分数区间来染色
 * @param {Recorder} recorder
 * @param {any} tr
 * @param {string} text
 * @returns void
 */
function paintScore(recorder, tr, text) {
	const score = parseInt(text);

	for (const { color, range, background, level } of scoreColors) {
		if (range[0] <= score && score < range[1]) {
			recorder.add(level);
			recorder.info(tr, text);
			tr.css("background", background);

			if (color.length > 1) {
				tr.find("td").each((_, e) => {
					$(e).css("color", color);
					if ($(e).children("a").length > 0) {
						$(e).children("a").css("color", color);
					}
				});
			}

			return true;
		}
	}

	return false;
}

/**
 * 通过关键词来染色
 * @param {Recorder} recorder
 * @param {any} tr
 * @param {string} text
 * @returns void
 */
function paintKeywd(recorder, tr, text) {
	function t_(words, text) {
		for (const word of words) {
			if (text === word) {
				return true;
			}
		}
		return false;
	}
	for (const { color, words, background, index, level } of keywColors) {
		if (t_(words, text || tr.find("td").eq(index).text().trim())) {
			recorder.add(level);
			recorder.info(tr, text);
			tr.css("background", background);

			if (color.length > 1) {
				tr.find("td").each((_, e) => {
					$(e).css("color", color);
					if ($(e).children("font").length > 0) {
						$(e).children("font").attr("color", color);
					}

					if ($(e).children("a").length > 0) {
						$(e).children("a").css("color", color);
					}
				});
			}

			return true;
		}
	}

	return false;
}

/**
 * 快捷修改表格内容
 * @param {any} dom 目标元素
 * @param {any} i 序号
 * @param {any} val 赋值
 * @returns
 */
function $text(dom, i, val) {
	if (val !== undefined) {
		$(dom).find("td").eq(i).text(val);
	}

	return $(dom).find("td").eq(i).text().trim();
}

/**
 * 修正我的计划英语部分
 * @param {any} table 表格元素
 */
function planCheckEnglish(table) {
	const cols = [];

	table.find("tr").each((_, e) => {
		const tr = $(e);

		if (
			$text(tr, 0).includes("外语(所有子项均应满足要求)") ||
			$text(tr, 0).includes("通用英语") ||
			$text(tr, 2).includes("通用英语")
		) {
			cols.push(tr[0]);
		}
	});

	if ($text(cols[0], 1) === $text(cols[0], 2)) {
		$text(cols[0], 4, "是");
		cols.splice(0, 1);
	}

	if ($text(cols[0], 1) === $text(cols[0], 2)) {
		$text(cols[0], 4, "是");
		cols.splice(0, 1);

		for (let i = 0; i < cols.length; i++) {
			if ($text(cols[i], -1) === "在读课程" || $text(cols[i], -2) === "是") {
				$text(cols[i], 0, "1");
			} else {
				$text(cols[i], -2, "");
				$(cols[i]).hide();
			}
		}
	}
}

/**
 * 渲染 计划完成情况 页面
 * @returns
 */
function renderPlan() {
	if (!includeUrl("myPlanCompl.action")) {
		return;
	}

	if (includeUrl("myPlanCompl.action") && notfound("span.secondMenu a")) {
		$("#position_bar").html(
			'您的当前位置：<a href="/eams/home!index.action">首页</a><span class="secondMenu">&nbsp;&gt;&nbsp;<a href="/eams/home!childmenus.action?menu.id=844">课程管理</a></span><span class="fontMenu">&nbsp;&gt;&nbsp;计划完成情况</span>'
		);
	}

	$("#ush_chart_box").show();
	const table = $("table.formTable");

	planCheckEnglish(table);

	const recordBook = new Recorder();

	table.find("tr").each((_, e) => {
		const tr = $(e);
		const text = $text(tr, -3);

		if (!paintScore(recordBook, tr, text)) {
			paintKeywd(recordBook, tr);
		}
	});

	// 停止监听

	setTimeout(() => {
		loop.renderPlan = false;
		if (!notfound(table)) {
			$("#ush_chart_box").highcharts(recordBook.chart());
			$(".highcharts-credits").hide();
		}
	}, itv.renderPlan);
}

/**
 * 渲染 我的成绩 页面
 * @returns
 */
function renderScore() {
	if (!includeUrl(["teach/grade/course/person", "teach/grade/usual"])) {
		return;
	}

	if (includeUrl("teach/grade/usual") && notfound("span.secondMenu a")) {
		$("#position_bar").html(
			'您的当前位置：<a href="/eams/home!index.action">首页</a><span class="secondMenu">&nbsp;&gt;&nbsp;<a href="/eams/home!childmenus.action?menu.id=844">课程管理</a></span><span class="fontMenu">&nbsp;&gt;&nbsp;平时成绩查询</span>'
		);
	} else if (
		includeUrl("teach/grade/course/person") &&
		notfound("span.secondMenu a")
	) {
		$("#position_bar").html(
			'您的当前位置：<a href="/eams/home!index.action">首页</a><span class="secondMenu">&nbsp;&gt;&nbsp;<a href="/eams/home!childmenus.action?menu.id=844">课程管理</a></span><span class="fontMenu">&nbsp;&gt;&nbsp;我的成绩</span>'
		);
	}

	$("#ush_chart_box").show();

	$("div[title='所有学期成绩']").click(() => {
		loop.renderScore = true;
	});

	const recordBook = new Recorder();

	const table = $("table.gridtable").last();

	table.find("tr").each((_, e) => {
		const tr = $(e);
		const text = includeUrl("historyCourseGrade")
			? $text(tr, -1)
			: $text(tr, -2);
		if (!paintScore(recordBook, tr, text)) {
			paintKeywd(recordBook, tr, text);
		}
	});

	// 停止监听
	if (storage[1].val > 0 && !notfound(table)) {
		setTimeout(() => {
			loop.renderScore = false;
			$("#ush_chart_box").highcharts(recordBook.chart());
			$(".highcharts-credits").hide();
		}, itv.renderScore);
	}
}

/**
 *  定义任务
 */
const task = {
	/**
	 * 页面加载完成后执行任务
	 */
	main() {
		// 初始化数据
		initUser();
		initStorage();

		// 初始 DOM 部分
		injectCSS();
		injectHTML();
		injectLayout();
		injectFooter();

		// 初始 事件部分
		crasher();
		renderPlan();
		renderScore();

		/**
		 * 配置 Highcharts 的主颜色
		 */
		Highcharts.setOptions({
			colors: scoreColors.map(({ background }) => background),
		});
	},

	/**
	 * 循环监听任务
	 */
	loop() {
		crasher();
		injectEvent();

		if (loop.renderPlan) {
			renderPlan();
		}

		if (loop.renderScore) {
			renderScore();
		}
	},
};

(function () {
	$(document).ready(task.main);
	setInterval(task.loop, itv.app);
})();
