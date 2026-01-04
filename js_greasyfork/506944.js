// ==UserScript==
// @name         华夏思源心理网-24.1一代++vX:shuake345
// @namespace    需要一一代一一vX:shuake345++++++++
// @version      0.1
// @description  主页点击：课程按钮|自动学习小节|未写自动换课功能|需要代一一vX:shuake345+++
// @author       vx:shuake345
// @match        *://*.siyuanren.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506944/%E5%8D%8E%E5%A4%8F%E6%80%9D%E6%BA%90%E5%BF%83%E7%90%86%E7%BD%91-241%E4%B8%80%E4%BB%A3%2B%2BvX%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/506944/%E5%8D%8E%E5%A4%8F%E6%80%9D%E6%BA%90%E5%BF%83%E7%90%86%E7%BD%91-241%E4%B8%80%E4%BB%A3%2B%2BvX%3Ashuake345.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
    var ZY='http://www.siyuanren.com/personCenter/personCenter/courserCenter/buyCourse/'
	var Zhuyurl = 'buyCourse'
	var Chuyurl = 'subCourse'
	var Fhuyurl = '&courseware'

	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
        //yincang
        } else if (document.visibilityState == "visible") {
			if (document.URL.search(Zhuyurl) > 1) {
				//setTimeout(sxrefere, 1000)
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
		var KC = document.querySelectorAll('.item>ul>li>a') //[0].href
		var KCjd = document.querySelectorAll('[class="progressValue"]')//parseFloat(document.querySelectorAll('[class="progressValue"]')[0].innerText)
		for (var i = 0; i < KCjd.length; i++) {
			if (parseFloat(KCjd[i].innerText)<30) {
				KCjd[i].click()
				break;
			}
		}
	}

	function Chuy() {
        var KCjd = document.querySelectorAll('[class="progressValue"]')
				KCjd[0].click()
	}

	function Shuy() {
            var zzKC =document.querySelectorAll('[class="leftInfo"]')
			var zzKCurl = document.querySelectorAll('tbody>tr>td>a')
			for (var i = 0; i < zzKC.length; i++) {
				if (zzKC[i].nextElementSibling.innerText!== "已学完" ) {
					zzKC[i].click()
					break;
				}
			}
	}
	

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
        var img =document.createElement("img");
var img1=document.createElement("img");
img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
img.style.position = 'fixed';
img.style.top = '0';
img1.style.right = '200';
img.style.zIndex = '999';
img.style="width:230px; height:230px;"
document.body.appendChild(img);
img1.src="https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";
img1.style="width:230px; height:230px;"
img1.style.position = 'fixed';
img1.style.top = '0';
img1.style.right = '0';
img1.style.zIndex = '9999';
document.body.appendChild(img1);
    }
    setTimeout(QT,5421)
	function Pd() {
		if (document.URL.search(Shuyurl) > 2) {
			setTimeout(Shuy,9920)
			setTimeout(function(){window.location.replace(ZY)}, 600000)
		} else if (document.URL.search(Chuyurl) > 2) {
			setTimeout(Chuy, 210)
		} else if (document.URL.search(Zhuyurl) > 2) {
			setTimeout(Zhuy, 24)
		}
	}
	setInterval(Pd, 3254)

})();