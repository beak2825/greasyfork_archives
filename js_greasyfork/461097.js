// ==UserScript==
// @name         jQuery-Extensions-freeDragJS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  jQuery-Extensions-freeDragJS是一个非常简单的jQuery 拖拽扩展，同时兼容移动设备与pc设备
// @author       tutu辣么可爱(greasyfork)/IcedWatermelonJuice(github)
// @grant        none
// ==/UserScript==
(function() {
	const aboutFreeDragJS = {
		"name": "jQuery-Extensions-freeDragJS",
		"version": "1.0",
		"description": "jQuery-Extensions-freeDragJS是一个非常简单的jQuery 拖拽扩展，同时兼容移动设备与pc设备",
		"author": "tutu辣么可爱(greasyfork)/IcedWatermelonJuice(github)",
		"dependency": {
			"_cpr_version": (a, b) => {
				function toNum(a) {
					var a = a.toString();
					//也可以这样写 var c=a.split(/\./);
					var c = a.split('.');
					var num_place = ["", "0", "00", "000", "0000"],
						r = num_place.reverse();
					for (var i = 0; i < c.length; i++) {
						var len = c[i].length;
						c[i] = r[len] + c[i];
					}
					var res = c.join('');
					return res;
				}
				var _a = toNum(a),
					_b = toNum(b);
				if (_a == _b) return 0;
				if (_a > _b) return 1;
				if (_a < _b) return -1;
			},
			"jQuery": "3.4.1",
			"jQuery-Extensions-touchJS": "1.7"
		}
	};
	var cpr_version=aboutFreeDragJS.dependency["_cpr_version"];
	if (typeof $ !== "function" && typeof jQuery !== "function") {
		console.error(`${aboutFreeDragJS.name} 缺少jQuery依赖`)
		return false;
	}
	if (typeof $.fn.touch !== "function") {
		console.error(`${aboutFreeDragJS.name} 缺少jQuery-Extensions-touchJS依赖`)
		return false;
	}
	if (cpr_version(aboutFreeDragJS.dependency["jQuery"], $.fn.jquery) > 0) {
		console.error(
			`${aboutFreeDragJS.name}要求jQuery版本至少为${aboutFreeDragJS.dependency["jQuery"]}，当前为${$.fn.jquery}。请升级jQuery`
		)
		return false;
	}
	if (cpr_version(aboutFreeDragJS.dependency["jQuery-Extensions-touchJS"], $.fn.aboutTouch("version")) > 0) {
		console.error(
			`${aboutFreeDragJS.name}要求jQuery-Extensions-touchJS版本至少为${aboutFreeDragJS.dependency["jQuery-Extensions-touchJS"]}，当前为${$.fn.aboutTouch("version")}。请升级jQuery-Extensions-touchJS`
		)
		return false;
	}
	if ($.fn.jquery && $.fn.touch)
		$.fn.freeDrag = function(container = $("body"), params = {}) {
			container = $(container);
			var target = this,
				fn0 = typeof params.start === "function" ? params.start : () => {},
				fn1 = typeof params.move === "function" ? params.move : () => {},
				fn2 = typeof params.end === "function" ? params.end : () => {}
			if (!/relative|absolute/i.test(container.css("position"))) {
				container.css("position", "relative");
			}
			var enable = false,
				pos = {};

			target.touch({
				start: (e) => {
					enable = true;
					pos = {
						x: e[0].x,
						y: e[0].y
					}
					fn0({
						state: "start",
						container: container,
						target: target,
						original: pos
					})
				},
				end: (e) => {
					enable = false;
					fn2({
						state: "end",
						container: container,
						target: target,
						original: pos
					})
					pos = {};
				}
			})
			container.touch("swipe", (e) => {
				var $e = target;
				if (!enable) return false
				var newPos = {
						x: e[1].x,
						y: e[1].y
					},
					realPos = {
						x: $e.position().left + newPos.x - pos.x,
						y: $e.position().top + newPos.y - pos.y
					};
				fn1({
					state: "move",
					container: container,
					target: target,
					original: pos,
					new: newPos,
					real: realPos
				});
				$e.css({
					"top": `${realPos.y}px`,
					"left": `${realPos.x}px`,
				})
				pos = newPos;
			})
			container.has(target) || container.append(target);
		}
	$.fn.aboutFreeDrag = (query) => {
		return aboutFreeDragJS[query] ? aboutFreeDragJS[query] : aboutFreeDragJS
	}
})(jQuery);
