// ==UserScript==
// @name            纸墨模式
// @name:zh-CN      纸墨模式
// @name:en         NewsPaper Mode
// @version         0.1
// @description     简单地模拟报纸阅读模式，将背景颜色改为更柔和的颜色。
// @description:en  Easy NewsPaper Mode, Reduce Background Color.
// @author          RunningCheese
// @namespace       https://www.runningcheese.com
// @license         MIT
// @match           *://*/*
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAAA0VXHyAAAAVUlEQVQ4EWNgoBAwIun/j8QmhgnWy4Ks8vXri8hcnGxRUX24HIoBIFFkSbgqKAObBRgGYFOEbhAyH8OAURcM1ljAF7UY0YhPMXL8w9gU5wWYQQNHAwA59SFyGEDyYwAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/471884/%E7%BA%B8%E5%A2%A8%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/471884/%E7%BA%B8%E5%A2%A8%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==


(function() {
	function getRGBColor(node, prop) {
		var rgb = getComputedStyle(node, null)
			.getPropertyValue(prop);
		var r, g, b;
		if (/rgb\((\d+),\s(\d+),\s(\d+)\)/.exec(rgb)) {
			r = parseInt(RegExp.$1, 10);
			g = parseInt(RegExp.$2, 10);
			b = parseInt(RegExp.$3, 10);
			return [r / 255, g / 255, b / 255];
		}
		return rgb;
	}
	R(document.documentElement);

	function R(n) {
		var i, x, color;
		if (n.nodeType == Node.ELEMENT_NODE && n.tagName.toLowerCase() != 'input' && n.tagName.toLowerCase() != 'select' && n.tagName.toLowerCase != 'textarea') {
			for (i = 0; x = n.childNodes[i]; ++i) R(x);
			color = getRGBColor(n, 'background-color');
			if ((typeof(color) != 'string' && color[0] + color[1] + color[2] >= 2.8) || (n == document.documentElement && color == 'transparent')) {
				n.style.backgroundColor = '#f5f5f5';
				n.style.setProperty('background-color', '#f5f5f5', 'important');
			}
		}
	}
})()