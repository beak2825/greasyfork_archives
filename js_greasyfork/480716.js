// ==UserScript==
// @name         51CTO打印课程目录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  51CTO打印课程目录与内容详情
// @author       小明
// @match        https://edu.51cto.com/course/*
// @icon         https://edu.51cto.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480716/51CTO%E6%89%93%E5%8D%B0%E8%AF%BE%E7%A8%8B%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/480716/51CTO%E6%89%93%E5%8D%B0%E8%AF%BE%E7%A8%8B%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

//打印函数
function pp(){
	var str = '' + '\n';
	var fstr = '本节课，老师要讲解如下这些内容：';
	var arr = document.querySelectorAll('.mylesson-title a');
	for (let x of arr){
		let a = x.parentNode.previousElementSibling.innerText;
		let b = x.innerText;
		str += '\n\n\n' + '## ' + a + b + '\n';

		if(x.nextElementSibling){
			//console.info(x.nextElementSibling.children[0].innerText)
			let c = x.nextElementSibling.children[0].innerText;
			c = c.replaceAll(fstr,'');
			str += c;
		}

	}
	console.info(str);
}


	//展开课程目录
    setTimeout(function(){
		document.querySelector('#lessonFile .icon-down').click();

    },3000)

	//调用打印函数
	 setTimeout(function(){
        pp();
    },5000)

})();