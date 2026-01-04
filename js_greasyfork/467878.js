// ==UserScript==
// @name         成都大学专业技术人员继续教育公共服务平台武侯区学习入口-自动看课，需要答题代刷++++++v:shuake345      ++++++++
// @match        *://*.lllnet.cn/*
// @match        *://*.lllnet.cn/media/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lllnet.cn
// @grant        none
// @namespace    需要代刷++++++v:shuake345      ++++++++
// @version      0.3
// @description  主页点击：课程按钮|自动学习小节|未写自动换课功能|需要代刷+vx:shuake345
// @author       vx:shuake345
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467878/%E6%88%90%E9%83%BD%E5%A4%A7%E5%AD%A6%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%E6%AD%A6%E4%BE%AF%E5%8C%BA%E5%AD%A6%E4%B9%A0%E5%85%A5%E5%8F%A3-%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE%EF%BC%8C%E9%9C%80%E8%A6%81%E7%AD%94%E9%A2%98%E4%BB%A3%E5%88%B7%2B%2B%2B%2B%2B%2Bv%3Ashuake345%20%20%20%20%20%20%2B%2B%2B%2B%2B%2B%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/467878/%E6%88%90%E9%83%BD%E5%A4%A7%E5%AD%A6%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%E6%AD%A6%E4%BE%AF%E5%8C%BA%E5%AD%A6%E4%B9%A0%E5%85%A5%E5%8F%A3-%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE%EF%BC%8C%E9%9C%80%E8%A6%81%E7%AD%94%E9%A2%98%E4%BB%A3%E5%88%B7%2B%2B%2B%2B%2B%2Bv%3Ashuake345%20%20%20%20%20%20%2B%2B%2B%2B%2B%2B%2B%2B.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'accessCourseInfo'

	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
			//yincang
		} else if (document.visibilityState == "visible") {
			if (document.URL.search(Zhuyurl) > 1) {
				setTimeout(sxrefere, 1000)
			}
		}
	});

	

	function fhback() {
		window.history.go(-1)
	}

	function gbclose() {
		window.close()
	}

	function sxrefere() {
		window.location.reload()
	}

	function Zhuy() {
		var KC = document.querySelectorAll("div.list>ul>li>a")
		if (document.getElementsByClassName("current")[0].querySelector('div').className == "yuanbox1") { //课程ing完成了
			for (var i = 0; i < KC.length; i++) {
				if (KC[i].querySelector('div') !== null) { //看过的，是否看完
					if (KC[i].querySelector('div').className !== "yuanbox1") { //未完成
						KC[i].click()
						break;
					}
				} else {
					KC[i].click()
					break;
				}

			}
		}
	}

	function Chuy() {
		if (parseInt(localStorage.getItem('key')) == NaN) {
			localStorage.setItem('key', 0)
		}
		var Lookdpage = parseInt(localStorage.getItem('key'))
		var zKC = document.querySelectorAll('tbody>tr>td>a')
		var zKCnum = zKC.length - 1 //2num kc
		if (Lookdpage < zKCnum) {
			localStorage.setItem('key', Lookdpage + 1)
			zKC[Lookdpage].click()
		} else {
			localStorage.setItem('key', 0)
		}
	}

	function Shuy() {
		if (document.URL.search('1212sssd') > 2) {
			var zzKC = document.querySelectorAll('tbody>tr>td>span')
			var zzKCurl = document.querySelectorAll('tbody>tr>td>a')
			for (var i = 0; i < zzKC.length; i++) {
				if (zzKC[i].innerText == '未学完' || zzKC[i].innerText == '未开始') {
					localStorage.setItem('Surl', window.location.href)
					window.location.replace(zzKCurl[i].href)
					break;
				} else if (i == zzKC.length - 1) {
					setTimeout(gbclose, 1104)
				}
			}
		}
	}
	setInterval(Shuy, 3124)

	function Fhuy() {
		if (document.getElementsByTagName('video').length == 1) {
			document.getElementsByTagName('video')[0].volume = 0
			document.getElementsByTagName('video')[0].play()
		}
		if (document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-currtime').innerText == document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-totaltime').innerText) {
			window.location.replace(localStorage.getItem('Surl'))
		}
	}

	function QT() {
		document.querySelector('div#container').style = "width:530px; height:530px;"
		var d1 = document.getElementsByClassName('play_box')[0];
		var img = document.createElement("img");
		img.style = "width:230px; height:230px;"
		img.src = "https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
		d1.appendChild(img);
	}

	function Pd() {
		if (document.URL.search(Zhuyurl) > 2) {
			setTimeout(Zhuy, 24)
			setTimeout(QT, 120)
		}
	}
	setTimeout(Pd, 1254)

	

})();