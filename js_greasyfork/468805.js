// ==UserScript==
// @name         校本研修工作室-校本365-教师学习平台-xiaoben365-教师网络学习平台-study.teacheredu.cn
// @namespace    娱乐为主
// @version      0.1
// @description  自动积累时间|时间满了后切课|没时间看的代刷VX：shuake345
// @author       v：shuake345
// @match        *://*.xiaoben365.com/*
// @match        *://*.study.teacheredu.cn
// @icon         https://2022xapxs01061_1.xiaoben365.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468805/%E6%A0%A1%E6%9C%AC%E7%A0%94%E4%BF%AE%E5%B7%A5%E4%BD%9C%E5%AE%A4-%E6%A0%A1%E6%9C%AC365-%E6%95%99%E5%B8%88%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-xiaoben365-%E6%95%99%E5%B8%88%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-studyteachereducn.user.js
// @updateURL https://update.greasyfork.org/scripts/468805/%E6%A0%A1%E6%9C%AC%E7%A0%94%E4%BF%AE%E5%B7%A5%E4%BD%9C%E5%AE%A4-%E6%A0%A1%E6%9C%AC365-%E6%95%99%E5%B8%88%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-xiaoben365-%E6%95%99%E5%B8%88%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0-studyteachereducn.meta.js
// ==/UserScript==
 
(function() {
	'use strict';
 
	// Your code here...
	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
			if (document.URL.search('course') > 1) {
				window.close()
			}
		}
	});
	function zy() {
		if (document.URL.search('elective') > 1) {
			if ($(".step-state")[0].innerText == ' 您已完成本环节！') {
				$(".active")[1].parentNode.nextElementSibling.querySelector('a').click()
			} //点下一个
 
			var imgs = $('li.clearfix')
			console.log('1' + sessionStorage.getItem('key'))
			for (var i = 0; i < imgs.length; i++) {
				if (imgs[i].querySelectorAll('i.ml-20')[0].innerText == '未达标') {
					if (sessionStorage.getItem('key') !== "" + i) {
						console.log(sessionStorage.getItem('key'))
						sessionStorage.setItem('key', "" + i)
						console.log(sessionStorage.getItem('key'))
						imgs[i].querySelectorAll('a.btn')[0].click()
					}
					break;
				}
			}
			setTimeout(function() {
				window.location.reload()
			}, 60000)
		}
	}
	setTimeout(zy, 10000)
 
	function ciye() {
		if (document.URL.search('course') > 1) {
			var d1 = document.getElementsByClassName('main')[0];
			var img = document.createElement("img");
			img.style = "width:230px; height:230px;"
			img.src = "https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
			d1.appendChild(img);
			$(".muti")[0].click()
			$('video')[0].play()
 
 
			/*$(".muti")[1].click()
        $(".muti")[2].click()
        $(".muti")[3].click()*/
		}
	}
	setInterval(ciye, 10000)
	function ciyedianji() {
		$('.section.clearfix.active')[0].nextElementSibling.click()
		//setTimeout(function (){window.location.reload()},543000)
	}
	setTimeout(ciyedianji, 5000)
 
})();