// ==UserScript==
// @name         广东人才继续教育网-rcjxjy-代刷+vx:shuake345
// @namespace    需要代刷++++++v:shuake345++++++++
// @version      0.1
// @description  主页点击：课程按钮|自动学习小节自动换课功能|需要代刷+vx:shuake345
// @author       vx:shuake345
// @match        *://*.rcjxjy.com/*
// @grant        none
// @icon         http://r.forteacher.cn/Images/logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506432/%E5%B9%BF%E4%B8%9C%E4%BA%BA%E6%89%8D%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91-rcjxjy-%E4%BB%A3%E5%88%B7%2Bvx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/506432/%E5%B9%BF%E4%B8%9C%E4%BA%BA%E6%89%8D%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91-rcjxjy-%E4%BB%A3%E5%88%B7%2Bvx%3Ashuake345.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'train/study-jxjy'
	var Chuyurl = 'train/play.html'
	var Shuyurl = 'CourseWare'
	var Fhuyurl = '&courseware'
    function ZTTS(){
        if (document.URL.search('train/index') > 2) {
        if(document.querySelectorAll('.u-btn.primary.larger').length>0){
            document.querySelectorAll('.u-btn.primary.larger')[1].click()
        }
        }
    }
    setTimeout(ZTTS,5421)

    function XC(){
        document.querySelector("#flendlyList > li > a > div.list-img > img").src='https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg'
        document.querySelector("#flendlyList > li > a > div.list-img > img").style="width:230px; height:230px;"
        document.querySelector("#flendlyList > li > a > div.list-info").remove()
    }
    setTimeout(XC,3000)
	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
        //yincang
        } else if (document.visibilityState == "visible") {
			if (document.URL.search(Zhuyurl) > 1 ) {
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
        var KCupdown=document.querySelectorAll('[class="u-btn primary btn-continue-study"]')//拉伸框
		var KC = document.querySelectorAll('.item>ul>li>a') //[0].href
		var KCjd = document.querySelectorAll("#list > li > div > span:nth-child(2)")//[0].innerText
		for (var i = 0; i < KCupdown.length; i++) {
				KCupdown[i].click()
		}
        if(KCjd.length==0){
            setTimeout(Zhuy,2000)
        }
            for (var l = 0; l < 20; l++) {
                if(KCjd[l].innerText!=='播放完成'){
                    document.querySelectorAll("#list > li > div > span:nth-child(5)")
                    document.querySelectorAll("#list > li > div > span:nth-child(5)>a")[l].click()
                }
        }
	}

	function Chuy() {
        if (document.getElementsByTagName('video').length == 1) {
			document.getElementsByTagName('video')[0].volume = 0
			document.getElementsByTagName('video')[0].play()
            document.getElementsByTagName('video')[0].playbackRate=0.8

		}
				setTimeout(fhback,600000)

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
	}

	function Pd() {
		 if (document.URL.search(Chuyurl) > 2) {
			setInterval(Chuy, 6210)
		} else if (document.URL.search(Zhuyurl) > 2) {
			setInterval(Zhuy, 224)
		}
	}
	setTimeout(Pd, 2254)

})();