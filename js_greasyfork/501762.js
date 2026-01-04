// ==UserScript==
// @name        石大云培_常速_需要秒刷+v:shuake345
// @namespace    需要秒刷+v:shuake345
// @version      0.1
// @description  主页点击：课程按钮|自动学习小节|未写自动换课功能|需要代刷+vx:shuake345
// @author       vx:shuake345
// @match        *://*.upc.edu.cn/*
// @grant        none
// @icon         http://r.forteacher.cn/Images/logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501762/%E7%9F%B3%E5%A4%A7%E4%BA%91%E5%9F%B9_%E5%B8%B8%E9%80%9F_%E9%9C%80%E8%A6%81%E7%A7%92%E5%88%B7%2Bv%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/501762/%E7%9F%B3%E5%A4%A7%E4%BA%91%E5%9F%B9_%E5%B8%B8%E9%80%9F_%E9%9C%80%E8%A6%81%E7%A7%92%E5%88%B7%2Bv%3Ashuake345.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'cn/study'
	var Chuyurl = 'courseplay'
	var Shuyurl = 'CourseWare'
	var Fhuyurl = '&courseware'

	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
        //yincang
        } else if (document.visibilityState == "visible") {
			if (document.URL.search(Zhuyurl) > 1 && document.URL.search(Chuyurl) < 1) {
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
		var KC = document.querySelectorAll("div.mainDiv > div > div> div > div > div > div > div > button")
		var KCjd = document.querySelectorAll("div.mainDiv > div > div> div > div > div > div > div> span > span") //[0].innerText
		for (var i = 0; i < KCjd.length; i++) {//是否进度完成
			if (KCjd[i].innerText !== '100%') {
				KC[i].click()
				break;
			}
		}
	}

	function Chuy() {
        var Lookdpage = document.querySelectorAll("div.muluDetail")//[共多少小课程
        for (var i = 0; i < Lookdpage.length; i++) {//是否进度完成
			if (Lookdpage[i].querySelector("div > div> div > span:nth-child(4)")!==null) {
				Lookdpage[i].click()
				break;
			}
		}
	}

	function Shuy() {
		if (document.URL.search(Shuyurl) > 2) {
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
	function QT(){
        var d1=document.getElementsByClassName('main main-note-scroll')[0];
        var img=document.createElement("img");
        var img1=document.createElement("img");
        img.style="width:230px; height:230px;"
        img1.style="width:230px; height:230px;"
        img1.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";//qitao
         img.src="https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";//xuanchuan
        d1.appendChild(img);
        d1.appendChild(img1);
    }
	function Pd() {
		if (document.URL.search(Chuyurl) > 2) {
			setTimeout(Chuy, 210)
		} else if (document.URL.search(Zhuyurl) > 2) {
			setTimeout(Zhuy, 24)
		}
	}
	setInterval(Pd, 3254)

})();