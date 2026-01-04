// ==UserScript==
// @name         乌兰察布专业技术人员-wlcbswdx
// @namespace    带刷V：shuake345
// @version      0.1
// @description  自动看课程|自动切换课程|无时间代挂可找Vx:shuake345
// @author       Vx---:shuake345
// @match        *://wlcbswdx.dopolo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468807/%E4%B9%8C%E5%85%B0%E5%AF%9F%E5%B8%83%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98-wlcbswdx.user.js
// @updateURL https://update.greasyfork.org/scripts/468807/%E4%B9%8C%E5%85%B0%E5%AF%9F%E5%B8%83%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98-wlcbswdx.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	var Zyurl = 'myclasscoursenew'
	var Cyurl = 'study.htm'
	//    var zKcclick=document.querySelectorAll("li>div>span>span>span > a")
	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {} else if (document.visibilityState == "visible") {
			if (document.URL.search(Zyurl) > 1) {
				setTimeout(sx, 1000)
			}
		}
	});

	function gb() {
		window.close()
	}

	function sx() {
		window.location.reload()
	}

	function Zy() {
		var jd = document.querySelectorAll("li> div > h3")
		var anniua = document.querySelectorAll(" div > span:nth-child(3) > span > span>span>a")
		for (var i = 0; i < jd.length; i++) {
			if (jd[i].innerText !== '100%') {
				anniua[3 * i].click()
				break;
			}
		}
	}

	function kczy() {
		if (document.getElementById('totalRestSeconds').innerText.search('还需') < 2) {
			kc()
		}
	}

	function kc() {
		var zKcjd = document.getElementsByClassName('fr iconfont media-course-icon')
		var zKca = document.querySelectorAll("ul.media-course-list>li> a")
		for (var i = 0; i < zKcjd.length; i++) {
			if (zKcjd[i].className.search('over') < 1 || zKcjd[i].className.search('studying') < -1) {
				zKca[i].click()
				console.log(i)
				break;
			} else if (i == zKcjd.length - 1) {
				gb()
			}
		}
	}

	function QT() {
		document.querySelector('.fl.media-nav-title').innerText = '代刷网课vx:shuake345'
		var d1 = document.getElementsByClassName('de-full-main')[0];
		var img = document.createElement("img");
		img.style = "width:230px; height:230px;"
		img.src = "https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
		d1.appendChild(img);
	}
	setTimeout(QT, 1241)

	function Pd() {
		if (document.URL.search(Cyurl) > 2) {
			setInterval(kczy, 9854)
		} else if (document.URL.search(Zyurl) > 2) {
			setTimeout(Zy, 24)
		}
	}
	setTimeout(Pd, 3254)

})();