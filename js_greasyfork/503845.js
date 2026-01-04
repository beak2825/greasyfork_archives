// ==UserScript==
// @name         “大学习”-公共卫生与预防医学继续教育平台-service.cpma秒刷v:shuake345
// @namespace    秒刷+++v:shuake345++++++++
// @version      v:shuake345
// @description  秒刷图：https://wan.51img1.com/image/20240821/f0d96ad045126278aa29fcd4b3a89f609635.jpg
// @author       vx:shuake345
// @match        *://*.cpma.org.cn/edu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cpma.org.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503845/%E2%80%9C%E5%A4%A7%E5%AD%A6%E4%B9%A0%E2%80%9D-%E5%85%AC%E5%85%B1%E5%8D%AB%E7%94%9F%E4%B8%8E%E9%A2%84%E9%98%B2%E5%8C%BB%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-servicecpma%E7%A7%92%E5%88%B7v%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/503845/%E2%80%9C%E5%A4%A7%E5%AD%A6%E4%B9%A0%E2%80%9D-%E5%85%AC%E5%85%B1%E5%8D%AB%E7%94%9F%E4%B8%8E%E9%A2%84%E9%98%B2%E5%8C%BB%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-servicecpma%E7%A7%92%E5%88%B7v%3Ashuake345.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'brand/detail/'
	var Chuyurl = 'detailCourse'
	var Shuyurl = 'courseDetails'
	var Fhuyurl = 'onlineStudy'

	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
        //yincang
        } else if (document.visibilityState == "visible") {
			if (document.URL.search(Zhuyurl) > 1 ) {
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
		var KC = document.querySelectorAll('.item>ul>li>a') //[0].href
		var KCjd = document.querySelectorAll('.item>ul>li>i') //[0].innerText
		for (var i = 0; i < KCjd.length; i++) {
			if (KCjd[i].innerText == '[未完成]') {
				window.open(KC[i].href)
				break;
			}
		}
	}

	function Chuy() {
		if(parseInt(localStorage.getItem('key'))==NaN){
            localStorage.setItem('key',0)
        }
        var Lookdpage = parseInt(localStorage.getItem('key'))
		var zKC = document.querySelectorAll('tbody>tr>td>a')
        var zKCnum=zKC.length-1//2num kc
        if(Lookdpage<zKCnum){
            localStorage.setItem('key',Lookdpage+1)
            zKC[Lookdpage].click()
           }else{
           localStorage.setItem('key',0)
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
		if (document.URL.search(Fhuyurl) > 2) {
			setTimeout(QT,20)
			setInterval(Fhuy, 5520)
            setTimeout(function(){
            window.location.replace(localStorage.getItem('Surl'))
            },61245*10)
		} else if (document.URL.search(Chuyurl) > 2) {
			setInterval(Chuy, 1210)
		} else if (document.URL.search(Zhuyurl) > 2) {
			setTimeout(Zhuy, 24)
		}
	}
	setTimeout(Pd, 1254)

})();