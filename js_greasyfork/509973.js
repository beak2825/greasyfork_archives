// ==UserScript==
// @name         北京干部网络学院-代刷vx-shuake345-不可多开课程
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  代刷vx-shuake345
// @author       You
// @match        *://bjce.bjdj.gov.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509973/%E5%8C%97%E4%BA%AC%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E4%BB%A3%E5%88%B7vx-shuake345-%E4%B8%8D%E5%8F%AF%E5%A4%9A%E5%BC%80%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/509973/%E5%8C%97%E4%BA%AC%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E4%BB%A3%E5%88%B7vx-shuake345-%E4%B8%8D%E5%8F%AF%E5%A4%9A%E5%BC%80%E8%AF%BE%E7%A8%8B.meta.js
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
    setTimeout(sxrefere,1200000)

     function QD确定播放(){document.querySelector("div > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary > span").click()
                     }
    setInterval(QD确定播放,2999)
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
document.querySelector("#app > div.content > div > div.content > div > div.logs > div.logs-content > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)").remove()//这个视频看不了，删掉
        if(document.querySelector('[style="display: inline-block; width: 200px; color: rgb(0, 119, 199);"]').nextElementSibling.innerText!=="未完成"){
                    var KkcNum=document.querySelectorAll("#app > div.content > div > div.content > div > div.logs > div.logs-content > div> div > div> span:nth-child(3)")
            for (var i = 0; 1 < i < KkcNum.length; i++) {
                if(i!==1){
				if (KkcNum[i].innerText =="未完成"||KkcNum[i].innerText =="未尝试") {
                    KkcNum[i].click()
                    break;
			}
                    }
        }
        }else if(document.querySelectorAll("div > div > div.el-message-box__btns > button").length){//继续播放-确定
          // document.querySelectorAll("div > div > div.el-message-box__btns > button")[1].click()
            if(document.querySelector("#video_container > div.vjs-control-bar > div.vjs-current-time.vjs-time-control.vjs-control > div").innerText==document.querySelector("#video_container > div.vjs-control-bar > div.vjs-duration.vjs-time-control.vjs-control > div").innerText){//播放时间==总时长
            setTimeout(sxrefere,5000)
            }
    }
        if (document.getElementsByTagName('video').length == 1) {
			document.getElementsByTagName('video')[0].volume = 0
			document.getElementsByTagName('video')[0].play()
		}

    }
    setInterval(Chuy, 3210)

})();