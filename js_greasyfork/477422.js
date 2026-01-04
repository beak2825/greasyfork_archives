// ==UserScript==
// @name         DY市继续教育公需科目培训-自动看课
// @namespace    需要代刷++++++v:shuake345      ++++++++
// @version      0.3
// @description  主页自动学习|自动换课|需配合软件秒刷|代刷vx:shuake345
// @author       vx:shuake345
// @match        *://px.dyhrsc.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dyhrsc.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477422/DY%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%9F%B9%E8%AE%AD-%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/477422/DY%E5%B8%82%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%9F%B9%E8%AE%AD-%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'studyDetail'
	var Chuyurl = 'liveStudy'
	var Shuyurl = 'xxx'
	var Fhuyurl = '&xxx'

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

    function FHs(){
        if(document.getElementsByTagName('video')[0]!==undefined){
            if(document.getElementsByTagName('video')[0].volume!==0){
            document.querySelector("body > div.rootDiv > div > div.homeContent > div > div.videoHead > span.backToBtn").click()
            }
        }
    }
    setInterval(FHs,5121)
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
		var KCjd = document.querySelectorAll("body > div.rootDiv > div > div.homeContent > div > div > div.contentArea > div.contentInfos > ul > li > div > div.el-progress__text")//[120].innerText
		var KC = document.querySelectorAll("body > div.rootDiv > div > div.homeContent > div > div > div.contentArea > div.contentInfos > ul > li > button > span") //[0].innerText
		for (var i = 0; i < KCjd.length; i++) {
			if (KCjd[i].innerText !== '100%') {
				KC[i].click()
				break;
			}
		}
	}

	function Chuy() {
        if(document.getElementsByTagName('video')[0]!==undefined){
            document.getElementsByTagName('video')[0].play()
            document.querySelector("body > div.rootDiv > div > div.homeContent > div > div.videoHead > span.backToBtn").click()
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
        var d1=document.getElementsByClassName('dbs')[0];
        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
        d1.appendChild(img);
    }
	function Pd() {
		if (document.URL.search(Chuyurl) > 2) {
			setInterval(Chuy, 2210)
		} else if (document.URL.search(Zhuyurl) > 2) {
			setInterval(Zhuy, 3124)
		}
	}
	setTimeout(Pd, 1254)

})();