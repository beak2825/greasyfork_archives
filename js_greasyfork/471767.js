// ==UserScript==
// @name         查找简体字中的繁体字（或繁体字中的简体字）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  查找简体字中的繁体字（或繁体字中的简体字），我找了很久，都是繁体简体之间的转换，却没有一个是“查找”，没法找到哪个字是繁体，所以依托https://s2t.buyaocha.com/这个网站写了个小脚本
// @author       You
// @match        https://s2t.buyaocha.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=buyaocha.com
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/471767/%E6%9F%A5%E6%89%BE%E7%AE%80%E4%BD%93%E5%AD%97%E4%B8%AD%E7%9A%84%E7%B9%81%E4%BD%93%E5%AD%97%EF%BC%88%E6%88%96%E7%B9%81%E4%BD%93%E5%AD%97%E4%B8%AD%E7%9A%84%E7%AE%80%E4%BD%93%E5%AD%97%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/471767/%E6%9F%A5%E6%89%BE%E7%AE%80%E4%BD%93%E5%AD%97%E4%B8%AD%E7%9A%84%E7%B9%81%E4%BD%93%E5%AD%97%EF%BC%88%E6%88%96%E7%B9%81%E4%BD%93%E5%AD%97%E4%B8%AD%E7%9A%84%E7%AE%80%E4%BD%93%E5%AD%97%EF%BC%89.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Your code here...
})();




function getDifference(a, b) {
	var i = 0;
	var j = 0;
	var result = "";

	while (j < b.length) {
		if (a[i] != b[j])
			result += a[i];
		i++;
		j++;
	}
	return result;
}


document.querySelector("#decode").addEventListener("click", ()=>{
	let aa = document.querySelector("#content").value
	let bb = document.querySelector("#result").value
	setTimeout(() => {
		console.log(getDifference(aa,bb))
		document.querySelector("div.page-header.border-bottom > h1 > small").innerHTML = '查找结果：'+getDifference(aa,bb)
	}, 500);
	
});