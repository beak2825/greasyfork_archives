// ==UserScript==
// @name         Bangumi快捷播放
// @description  首页追番卡片显示中文标题，浮动卡片增加资源搜索，可添加对应集数播放源，浮动卡片状态实时改变无需刷新
// @namespace    https://github.com/RiverYale/Userscripts/
// @homepage     https://riveryale.github.io/Userscripts/
// @version      3.5
// @author       RiverYale
// @match        *://bangumi.tv/
// @match        *://bgm.tv/
// @match        *://chii.in/
// @icon         https://riveryale.github.io/Userscripts/assets/pic/BangumiEasyPlay/icon.png
// @run-at       document-end
// @compatible   chrome
// @compatible   edge
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/436275/Bangumi%E5%BF%AB%E6%8D%B7%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/436275/Bangumi%E5%BF%AB%E6%8D%B7%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

/*================= 更新脚本前注意保存自己修改的内容！ =================*/

var autoMark = true;				// 默认点击链接后自动标记为看过
var authSrc = "";			// 若404则表明未更新资源，全部移除，若无需验证则删除引号中的内容
var src_dict = {					// 网址格式，番剧ID: [资源ID, 播放线路, 总体集数偏移, [集数, 增加偏移]...]
	"AGE动漫": {
		pattern: "https://www.agemys.org/play/${id}/${ch}/${ep}",
		search: "https://www.agemys.org/search?query=${keyword}",
		373247: [20220248, 1, 1],			// 无职转生：到了异世界就拿出真本事 ~ 第二季
		441233: [20230154, 1, 0],			// 总之就是非常可爱 女子高中篇
		376433: [20230138, 1, 0],			// 政宗君的复仇R
		403225: [20230131, 1, -12],			// 打工吧！！魔王大人 2nd Season
		376739: [20220244, 1, -87],			// 进击的巨人 最终季 Part.3
		414461: [20230128, 1, 0],			// 僵尸百分百～变成僵尸之前想做的100件事～
		386809: [20230077, 1, 0],			// 我推的孩子
	},
	"Bimi": {
		pattern: "http://m.dodoge.me/bangumi/${id}/play/${ch}/${ep}/",
		search: "http://m.dodoge.me/vod/search/wd/${keyword}",
	},
	"MX动漫": {
		pattern: "http://www.mxdm9.com/dongmanplay/${id}-${ch}-${ep}.html",
		search: "http://www.mxdm9.com/search/-------------.html?wd=${keyword}",
		373247: [8183, 1, 1],				// 无职转生：到了异世界就拿出真本事 ~ 第二季
		441233: [7112, 1, 12],				// 总之就是非常可爱 女子高中篇
		376433: [7622, 1, 0],				// 政宗君的复仇R
		403225: [8181, 1, -12],				// 打工吧！！魔王大人 2nd Season
		376739: [8049, 1, -87],				// 进击的巨人 最终季 Part.3
		414461: [8169, 1, 0],				// 僵尸百分百～变成僵尸之前想做的100件事～
		386809: [7963, 1, 0],				// 我推的孩子
	},
	"橘子动漫": {
		pattern: "https://www.mgnacg.com/bangumi/${id}-${ch}-${ep}/",
		search: "https://www.mgnacg.com/search/-------------/?wd=${keyword}",
	},
	"樱花动漫": {
		pattern: "https://www.vdm8.com/play/${id}-${ch}-${ep}.html",
		search: "https://www.vdm8.com/search/${keyword}-------------.html",
	},
	"宫下动漫": {
		pattern: "https://arlnigdm.com/vodplay/${id}-${ch}-${ep}.html",
		search: "https://arlnigdm.com/vodsearch/-------------.html?wd=${keyword}",
	},
	"新番组": {
		pattern: "https://bangumi.online",
		search: "https://bangumi.online",
	},
};
/*================= 更新脚本前注意保存自己修改的内容！ =================*/

if($(".loginPanel").length == 1) return;

/* 标题中日文对调 */
var titles_A = Array.from($(".tinyHeader .textTip:not(.prgCheckIn)"))		// 平铺模式
	.concat(Array.from($(".l.textTip")))		// 列表模式右侧
if(titles_A.length == 0) return;
var handleTitle_A = function(title) {
	var text = $(title).text();
	var data_original_title = $(title).attr("data-original-title");
	if(!data_original_title){
		return true;
	}
	$(title).text(data_original_title);
	$(title).attr("data-original-title", text);
}

var titles_B = Array.from($(".subjectItem.title.textTip"))		// 列表模式左侧 - 1, 2, 3
var handleTitle_B = function(title) {
	var text = $(title).find('span').text();
	var data_original_title = $(title).attr("data-original-title");
	if(!data_original_title){
		return true;
	}
	$(title).find('span').text(data_original_title);
	$(title).attr('data-original-title', text);

	var preALink = $(title).prev().prev();
	var preALink_title = $(preALink).attr('data-original-title');
	if (!preALink_title) {
		return true;
	}
	$(preALink).attr('data-original-title', preALink_title.replace(text, data_original_title));
}

/* 生成配置模板 */
var _ul = $('<ul style="display:inline-block; float:right;"></ul>');
var _btn = $('<div style="padding: 3px 12px;margin: 8px 5px 0;;background: #F09199;color: white;border-radius: 50px;font-size: 11px;cursor: pointer;">生成模板</div>');
$(_ul).append(_btn);
$("#prgManagerHeader").append(_ul);
$(_btn).click((e) => {
	var resStr = "";
	document.querySelectorAll('.subjectItem[data-subject-id]').forEach((i) => {
		const id = i.getAttribute("data-subject-id");
		const name = i.getAttribute("data-subject-name-cn");
		resStr += `${id}: [0, 1, 0],			// ${name}\n`;
	})
	let allowCopy = confirm("将复制以下内容到剪切板：\n" + resStr);
	if (allowCopy) {
		navigator.clipboard.writeText(resStr);
		console.log(resStr);
		alert("请自行修改模板方括号内容。如果复制失败，请按F12打开控制台查看输出，手动复制。")
	}
})

/* 点击链接后是否自动标记为[看过] */
var _ul = $('<ul style="display:inline-block; float:right;"></ul>');
var _label = $('<label style="display:block; margin:10px;"></label>');
var _input = $('<input type="checkbox" style="vertical-align:middle;">');
var _span = $('<span style="vertical-align:middle;"> 自动标记</span>');
$(_ul).append(_label);
$(_label).append(_input);
$(_label).append(_span);
$(_label).attr("title", "点击播放链接后自动标记为[看过]");
$("#prgManagerHeader").append(_ul);
$(_input).prop("checked", autoMark);
$(_input).click(() => {
	autoMark = $(_input).prop("checked");
});


/* 为已出集数添加资源链接 */
var epLinkList = Array.from($(".load-epinfo"));
var getSrcHref = function(dict, subid, ep) {
	var value = dict[subid];
	ep = Number(ep);
	if(value.constructor == Array) {
		var pattern = dict["pattern"];
		var resId = value[0];
		var resCh = value[1];
		var resEp = ep + value[2];
		for(let i=3; i<value.length; i++) {
			if(ep >= value[i][0]) {
				resEp += value[i][1];
			}
		}
		return pattern.replace(/\$\{id\}/g, resId).replace(/\$\{ch\}/g, resCh).replace(/\$\{ep\}/g, resEp);
	} else if(value.constructor == String) {
		return value;
	}
	return '';
}
var handleEpLinkList = function(epLink) {
	// 标记该条目下集数的偏移量
	$(epLink.rel).attr("ep_offset", $(epLink).parent().index());

	// 未知集数跳过
	if(epLink.className.indexOf("epBtnNA") > -1) {
		return true;
	}
	var subid = $("#"+epLink.id).attr("subject_id");
	var ep = Number($("#"+epLink.id).text());
	var srcPanel = $("<div><hr class='board'></div>");
	for(let srcName in src_dict) {
		// 根据资源字典添加资源链接
		var dict = src_dict[srcName];
		if(dict[subid] == undefined) {
			var subjectName = $(`[data-subject-id=${subid}][class=textTip]`).text();
			if(dict['search'] == undefined) {
				$(srcPanel).append(`<a href="javascript:alert('未添加搜索地址格式！');" style="margin-right:10px; display:inline-block; color:#555; font-style:italic;">${srcName}</a>`);
			} else {
				var searchHref = dict['search'].replace(/\$\{keyword\}/g, subjectName)
				$(srcPanel).append(`<a href="${searchHref}" style="margin-right:10px; display:inline-block; color:#555; font-style:italic;" target="_blank">${srcName}</a>`);
			}
			continue;
		}
		var srcHref = getSrcHref(dict, subid, ep);
		var alink = $('<a style="margin-right:10px; display:inline-block; font-weight:bold;" target="_blank"></a>');
		$(alink).attr("href", srcHref);
		$(alink).text(srcName);
		$(srcPanel).append(alink);

		// 点击资源链接后标记为[看过]
		$(alink).click(() => {
			var watchedLink = "#Watched_" + epLink.id.slice(4);
			if(autoMark && $(watchedLink).length>0) {
				$(watchedLink).click();
			}
		});

		// 已看集数的不测试资源是否可达
		if(epLink.className.indexOf("epBtnWatched")==-1 && srcName==authSrc) {
			var authHref = srcHref;
		}
	}
	$(epLink.rel).append(srcPanel);

	// 测试资源是否可达
	if(authHref != undefined && authHref != "") {
		var isRunUrl = function(url){
			return new Promise(function (resolve, reject) {
				var dom = document.createElement('link');
				dom.href = url;
				dom.rel = 'stylesheet';
				dom.onload = function () {
					document.head.removeChild(dom);
					resolve();
				}
				dom.onerror = reject;
				document.head.appendChild(dom);
			});
		}
		isRunUrl(authHref).then(data => {}).catch(data => {
			// $(srcPanel).remove();
			$(epLink).css({"color":"red"});
			// $(epLink).css({"color":"#00F", "background-color":"#e0e0e0", "border":"1px solid #b6b6b6"});
		});
	}
}


// 根据状态更新单集进度情况面板
var updataEpStatusTool = function(prg, type) {
	var epid = prg.id.slice(8);
	var gh = $("a:first", prg).attr("href").split('=')[1];
	var epStatusTool = $(".epStatusTool", prg);

	var type_dict = { "看过": 1, "想看": 2, "抛弃": 3, "撤消": 0 };
	var status = type_dict[type];
	var statusLink = $(".epStatusTool a", prg)[0];
	statusLink = $(statusLink).clone(true);

	var epGrid = $(`[rel="#prginfo_${epid}"]`).parent().parent().parent();
	var progressText = $("#prgsPercentNum", epGrid).text();
	var progress = progressText.slice(1,-1).split('/');
	var old_type = $("p", epStatusTool).text();
	var old_status = type_dict[old_type] || 0;
	if((old_status == 1 || old_status == 3) && (status != 1 && status != 3)) {
		progress[0] = Number(progress[0]) - 1;
	} else if((old_status != 1 && old_status != 3) && (status == 1 || status == 3)) {
		progress[0] = Number(progress[0]) + 1;
	}
	$("#prgsPercentNum", epGrid).text(`[${progress[0]}/${progress[1]}]`);

	$(epStatusTool).empty();
	if(status == 0) {
		$(epStatusTool).append(`<p id="epBtnCu_${epid}"></p>`);
	} else {
		$(epStatusTool).append(`<p id="epBtnCu_${epid}" class="epBtnCu">${type}</p>`);
	}
	if(status != 1) {
		var watched = $(statusLink).clone(true);
		$(watched).attr({href: `/subject/ep/${epid}/status/watched?gh=${gh}`, id: `Watched_${epid}`});
		$(watched).text("看过")
		$(epStatusTool).append(watched);

		var watchedTill = $(statusLink).clone(true);
		$(watchedTill).attr({href: `/subject/ep/${epid}/status/watched?gh=${gh}`, id: `WatchedTill_${epid}`});
		$(watchedTill).text("看到")
		$(epStatusTool).append(watchedTill);
	}
	if(status != 2) {
		var queue = $(statusLink).clone(true);
		$(queue).attr({href: `/subject/ep/${epid}/status/queue?gh=${gh}`, id: `Queue_${epid}`});
		$(queue).text("想看")
		$(epStatusTool).append(queue);
	}
	if(status != 3) {
		var drop = $(statusLink).clone(true);
		$(drop).attr({href: `/subject/ep/${epid}/status/drop?gh=${gh}`, id: `Drop_${epid}`});
		$(drop).text("抛弃")
		$(epStatusTool).append(drop);
	}
	if(status != 0) {
		var remove = $(statusLink).clone(true);
		$(remove).attr({href: `/subject/ep/${epid}/status/remove?gh=${gh}`, id: `remove_${epid}`});
		$(remove).text("撤消")
		$(epStatusTool).append(remove);
	}
}


/* 修改进度后实时修改面板状态 */
var prgList = Array.from($("#subject_prg_content").children());
var handleprgList = function(prg) {
	$(".epStatusTool a", prg).click((event) => {
		var type = event.currentTarget.innerText;
		if(type == '看到') {
			var offset = Number($(prg).attr("ep_offset"));
			var curI = $(prg).index();
			while(curI >= 0 && offset >= 0) {
				if (offset == Number($(prgList[curI]).attr("ep_offset"))) {
					if ($(".epStatusTool p", prgList[curI]).text() != '抛弃') {
						updataEpStatusTool(prgList[curI], "看过");
					}
					offset -= 1;
				}
				curI -= 1;
			}
		} else {
			updataEpStatusTool(prg, type);
		}

		// 更新显示的面板
		var prg_new = $(prg).clone(true);
		$(prg_new).css("display", "block");
		$("#cluetip-inner").empty();
		$("#cluetip-inner").append(prg_new);
		return false;
	})
}


/* 功能运行进度指示文本 */
class Task {
	constructor(func, ...args) {
		this.func = func;
		this.args = args;
		this.delayMillsec = 0;
	}
	delay(millsec) {
		if (millsec) this.delayMillsec = millsec;
		return this.delayMillsec;
	}
	execute() {
		return this.func(...this.args);
	}
}

var taskList = [];
titles_A.forEach(title => {
	taskList.push(new Task(handleTitle_A, title));
});
titles_B.forEach(title => {
	taskList.push(new Task(handleTitle_B, title));
});
epLinkList.forEach(epLink => {
	taskList.push(new Task(handleEpLinkList, epLink));
});
prgList.forEach(prg => {
	taskList.push(new Task(handleprgList, prg));
});

var _progressUl = $('<ul style="display:inline-block; float:right; padding:10px"></ul>');
var _progressSpan = $('<span style="vertical-align:middle;">处理中...0%</span>');
if (taskList.length > 0) {
	$("#prgManagerHeader").append(_progressUl);
	$(_progressUl).append(_progressSpan);
	$(_progressSpan).attr("maxVal", taskList.length);
	$(_progressSpan).attr("curVal", 0);
}

var incProgress = function(val = 1) {
	let maxVal = Number($(_progressSpan).attr("maxVal"));
	let curVal = Number($(_progressSpan).attr("curVal"));
	curVal = Math.max(0, Math.min(curVal + val, maxVal));
	let progress = Math.round(curVal / maxVal * 100);
	$(_progressSpan).attr("curVal", curVal);
	$(_progressSpan).text(`处理中...${progress}%`);
	if (curVal == maxVal) {
		setTimeout(() => {
			$(_progressUl).css("transition", "0.5s ease");
			$(_progressUl).css("color", "rgba(0, 0, 0, 0)");
		}, 1000);
	}
}

var executor = function(taskList) {
	if (!taskList || taskList.length < 1) return;
	var task = taskList.shift();
	setTimeout(() => {
		try {
			task.execute();
		} catch (error) {
			console.error(error);
		}
		incProgress();
		executor(taskList);
	}, task.delay());
}
executor(taskList);