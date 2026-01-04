// ==UserScript==
// @name         s1新版麻将脸显示脚本
// @namespace    s1newmjfacejioben
// @version      1.4
// @description  将新增的麻将脸代码转换成图片
// @author       a simple s1 user
// @match        https://bbs.saraba1st.com/2b/*.html?**
// @match        https://bbs.saraba1st.com/2b/forum.php?mod=viewthread&tid=*?**
// @downloadURL https://update.greasyfork.org/scripts/372459/s1%E6%96%B0%E7%89%88%E9%BA%BB%E5%B0%86%E8%84%B8%E6%98%BE%E7%A4%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/372459/s1%E6%96%B0%E7%89%88%E9%BA%BB%E5%B0%86%E8%84%B8%E6%98%BE%E7%A4%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
function replace(search,replacement){
	var xpathResult = document.evaluate(
		"//*/text()",
		document,
		null,
		XPathResult.ORDERED_NODE_ITERATOR_TYPE,
		null
	);
	var results = [];
	// We store the result in an array because if the DOM mutates
	// during iteration, the iteration becomes invalid.
	while(res = xpathResult.iterateNext()) {
		results.push(res);
	}
	results.forEach(function(res){
		res.textContent = res.textContent.replace(search,replacement);
	})
}
    //上面那一段我也不懂什么意思，作用应该就是让replace仅限于可见文本。代码来源：http://bit.ly/2PR7uDG



replace(/\{:1465_/g,'::mjlf')
//这一段是普通分类的


    window.onload = function () {


    for (var i=0;i<12;i++){
		var id = 1691 + i;
		var zhengze = new RegExp("::mjlf" + id + ":}","g")
		var img = "<img src =\"http://mahjongface.tk/smiley/face/" + id + "\">";
		document.body.innerHTML = document.body.innerHTML.replace(zhengze, img);
	}//这一段是普通分类的


    document.body.innerHTML = document.body.innerHTML.replace(/\[f:215]/g, '<img src =\"http://mahjongface.tk/smiley/face/1696\">');
	document.body.innerHTML = document.body.innerHTML.replace(/\[f:214]/g, '<img src =\"http://mahjongface.tk/smiley/face/1699\">');
}

})();