// ==UserScript==
// @name           龙的天空论坛（旧版）基于关键词屏蔽主题贴
// @namespace      仙圣
// @description    根据关键词，屏蔽主题贴。支持配合翻页工具

// @include        http://www.lkong.net/forum.php?mod=forumdisplay*
// @include        http://www.lkong.net/forum-*.html
// @version        20190406
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/381452/%E9%BE%99%E7%9A%84%E5%A4%A9%E7%A9%BA%E8%AE%BA%E5%9D%9B%EF%BC%88%E6%97%A7%E7%89%88%EF%BC%89%E5%9F%BA%E4%BA%8E%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E4%B8%BB%E9%A2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/381452/%E9%BE%99%E7%9A%84%E5%A4%A9%E7%A9%BA%E8%AE%BA%E5%9D%9B%EF%BC%88%E6%97%A7%E7%89%88%EF%BC%89%E5%9F%BA%E4%BA%8E%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E4%B8%BB%E9%A2%98%E8%B4%B4.meta.js
// ==/UserScript==

blockAll();

var mo = new MutationObserver(function(allmutations) {
    blockAll();
});
mo.observe(document.querySelector('body'), {'childList': true,'characterData':false,'subtree': true});

function blockAll() {
		var dogtitles = new Array("归向","核动力战列舰","皮划艇","位面小蝴蝶","无穷重阻","井口战役",);                        //要屏蔽的标题关键字，写在这行，注意英文引号

		// 主题列表页 针对标题
		for (x in dogtitles) {
			dog = document.evaluate('//table/tbody[tr[1]/th[1]/a[contains(text(),"' + dogtitles[x] + '")]]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			if (dog.snapshotLength) {
				for (var i = 0, c = ""; i < dog.snapshotLength; i++) {
					dog.snapshotItem(i).innerHTML = "";
				}
			}
		}



}