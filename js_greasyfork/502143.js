// ==UserScript==
// @name        成都职业培训网络学院-24.1-代刷vx:shuake345
// @namespace    需要代刷++++++v:shuake345      ++++++++
// @version      0.1
// @description  主页点击：课程按钮|自动学习小节|未写自动换课功能|需要代刷+vx:shuake345
// @author       代刷vx:shuake345
// @match        *://*.wlxy.org.cn/*
// @grant        none
// @icon         
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502143/%E6%88%90%E9%83%BD%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-241-%E4%BB%A3%E5%88%B7vx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/502143/%E6%88%90%E9%83%BD%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-241-%E4%BB%A3%E5%88%B7vx%3Ashuake345.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'MyEventList'
	var Chuyurl = 'pages/train'
	var Shuyurl = 'CourseWare'
	var Fhuyurl = '&courseware'

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
        var KkcNum=document.querySelectorAll("#app > div.content > div > div.content > div > div.logs > div.logs-content > div> div > div> span:nth-child(3)")
        for (var i = 0; i < KkcNum.length; i++) {
				if (KkcNum[i].innerText =="未完成" ) {
                     break;
			}
        }
        if (document.getElementsByTagName('video').length == 1) {
			document.getElementsByTagName('video')[0].volume = 0
			document.getElementsByTagName('video')[0].play()
		}
        if(document.querySelectorAll("div > div > div.el-message-box__btns > button").length){//继续播放-确定
          // document.querySelectorAll("div > div > div.el-message-box__btns > button")[1].click()
            if(document.querySelector("#video_container > div.vjs-control-bar > div.vjs-current-time.vjs-time-control.vjs-control > div").innerText==document.querySelector("#video_container > div.vjs-control-bar > div.vjs-duration.vjs-time-control.vjs-control > div").innerText){//播放时间==总时长
            setTimeout(sxrefere,5000)
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
        var d1=document.getElementsByClassName('dbs')[0];
        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";//qitao
         img.src="https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";//xuanchuan
        d1.appendChild(img);
    }
	function Pd() {
		 if (document.URL.search(Chuyurl) > 2) {
			setInterval(Chuy, 3210)
		}
	}
	setTimeout(Pd, 1254)

})();