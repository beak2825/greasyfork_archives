// ==UserScript==
// @name         文字内容替换
// @namespace    https://greasyfork.org/zh-CN/users/76579-%E4%BB%99%E5%9C%A3
// @version      0.5
// @description  替换一些文字，比如谷歌明明有中文名，为什么偏偏不写谷歌要写Google呢？
// @author       仙圣
// @include        *
// @exclude        https://greasyfork.org/zh-CN/scripts/*/versions/new
// @exclude        https://pan.baidu.com/doc/edit*
// @downloadURL https://update.greasyfork.org/scripts/412490/%E6%96%87%E5%AD%97%E5%86%85%E5%AE%B9%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/412490/%E6%96%87%E5%AD%97%E5%86%85%E5%AE%B9%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==
(function() {
	var replaceArry = [
		[/Google/gi, '谷歌'],
	];

	function 文字替换() {
		var numTerms = replaceArry.length;
		var txtWalker = document.createTreeWalker(
			document.body,
			NodeFilter.SHOW_TEXT, {
				acceptNode: function(node) {
					if(node.nodeValue.trim())
						return NodeFilter.FILTER_ACCEPT;

					return NodeFilter.FILTER_SKIP;
				}
			},
			false
		);
		var txtNode = null;


		while(txtNode = txtWalker.nextNode()) {
			var oldTxt = txtNode.nodeValue;

			for(var J = 0; J < numTerms; J++) {
				oldTxt = oldTxt.replace(replaceArry[J][0], replaceArry[J][1]);
			}
			txtNode.nodeValue = oldTxt;
		}
	}
	setTimeout(文字替换, 1000);
	setInterval(function() {
		document.addEventListener("scroll", 文字替换, true);
	}, 3000);
})();