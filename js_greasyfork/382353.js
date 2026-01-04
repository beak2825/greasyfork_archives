// ==UserScript==
// @name         bangumi enhancement
// @name:zh-CN   Bangumi 番组计划 - 排序
// @namespace    http://xuefer.win/
// @version      0.3
// @description  group items by day
// @description:zh-CN 按星期顺序分组，高亮显示当前日期
// @author       Xuefer
// @include      http://bangumi.tv/
// @include      https://bangumi.tv/
// @include      http://bgm.tv/
// @include      https://bgm.tv/
// @include      http://chii.in/
// @include      https://chii.in/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/382353/bangumi%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/382353/bangumi%20enhancement.meta.js
// ==/UserScript==

function sortElements(childs, compareFunction) {
	if (!childs.length) {
		return;
	}
	var parent = childs[0].parentNode;
	var sorting = [];
	for (var i = childs.length - 1; i >= 0; --i) {
		sorting.push(childs[i]);
		parent.removeChild(childs[i]);
	}
	sorting.sort(compareFunction);
	for (let child of sorting) {
		parent.appendChild(child);
	}
}

Number.prototype.zeroPad = function(length) {
	var s = (this||"0").toString();
	while (s.length < length) {
		s = "0" + s;
	}
	return s;
};

String.prototype.trim = function() {
	return this.replace(/^[ \t]+|[ \t]+$/g, "");
};

String.prototype.extractDate = function() {
	return (this.match(/(20\d\d-\d{1,2}-\d{1,2})/)||[])[1] || NaN;
};

String.prototype.getPrefix = function() {
	return ((this.match(/^([^(:]*)/)||[])[1] || "").trim();
};

function changeLayout() {
	// wait for element to finish
	var unsafeWindow = self.unsafeWindow||window;
	if (!unsafeWindow.loadXML || !unsafeWindow.$ || !document.getElementById("subject_prg_content") || !document.getElementById("cluetip")) {
		setTimeout(changeLayout, 1);
		return;
	}
	var weekdayLabels = [ '日', '一', '二', '三', '四', '五', '六', '??' ];
	console.log("Changing layout");
	var $ = unsafeWindow.$;

	var now = new Date();
	var oldDate = now.valueOf() - 365 * 24 * 60 * 60 * 1000;

	do {
		let subjects = $("#cloumnSubjectInfo > div:first > div").toArray();
		if (!subjects.length) {
			break;
		}

		var container = subjects[0].parentNode;
		for (let subject of subjects) {
			container.removeChild(subject);
		}
		while (container.lastChild) {
			container.removeChild(container.lastChild);
		}
		var days = [];
		for (let i = 0; i < 8; ++i) {
			let day = container.appendChild(document.createElement("div"));
			day.className = "day";
			day.style.overflow = "auto";
			let caption = day.appendChild(document.createElement("div"));
			caption.appendChild(document.createTextNode("周" + weekdayLabels[i]));
			day.subjects = day.appendChild(document.createElement("div"));
			days.push(day);
		}
		let oldDay = days[7];
		let today = days[new Date().getDay()];

		today.className += " today";
		for (let subject of subjects) {
			let tips = (function() {
				try {
					for (let ep_info of $('.load-epinfo', subject).toArray()) {
						if (!/epBtnDrop|epBtnWatched/.test(ep_info.className)) {
							return $(".tip:first", $(ep_info.rel));
						}
					}
					let ep_info = $('.load-epinfo:last', subject);
					return $(".tip:first", $(ep_info[0].rel));
				} catch (e) {
					console.log(e, subject);
				}
			})();
			if (!tips) {
				subject.sortId = 0;
				oldDay.appendChild(subject);
				continue;
			}

			let date = new Date(tips.text().extractDate());
			let title = $("> a:last", subject)[0].title;
			if (/*date.valueOf() <= oldDate ||*/ isNaN(date.valueOf())) {
				subject.sortId = title.getPrefix() + "-" + date.getYear().zeroPad(3) + date.getMonth().zeroPad(2) + "-" + title;
				if (isNaN(date.valueOf())) {
					subject.appendChild(document.createTextNode("Missing On Air Date"));
				}
				oldDay.appendChild(subject);
			}
			else {
				subject.sortId = title.getPrefix();
				days[date.getDay()].subjects.appendChild(subject);
			}
		}
		for (let day of days) {
			let nodes = day.subjects.childNodes;
			sortElements(nodes, function(a, b) {
				return a.sortId.localeCompare(b.sortId);
			});

			for (var i = 0; i < nodes.length; ++i) {
				var $obj = $(nodes[i]);
				if (i % 2 === 0) {
					$obj.removeClass('even');
					$obj.addClass('odd');
				}
				else {
					$obj.removeClass('odd');
					$obj.addClass('even');
				}
			}
		}
	} while (0);

	{
		let subjects = $("#prgSubjectList > li").toArray();
		for (let i in subjects) {
			subjects[i].sortId = $('> a:last', subjects[i])[0].title;
		}
		sortElements(subjects, function localeCompare(a, b) {
			return a.sortId.localeCompare(b.sortId);
		});
	}

	var within_24hours = now.valueOf() - 60 * 60 * 24 * 1000;
	var within_48hours = now.valueOf() - 60 * 60 * 48 * 1000;
	$.each($(".epBtnAir"), function(i, o) {
		var airDate = new Date($(".tip:first", $(o.rel)).text().extractDate()).valueOf();
		if (isNaN(airDate)) {
			$(o).removeClass("epBtnAir");
			$(o).addClass("epBtnUnknown");
		}
		else if (airDate >= within_48hours) {
			$(o).addClass(airDate >= within_24hours ? "epBtnAirNewDay1" : "epBtnAirNewDay2");
		}
	});
}

changeLayout();
