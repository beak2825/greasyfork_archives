// ==UserScript==
// @name         小鹅通
// @namespace    需要代刷++++++v:shuake345++++++++
// @version      0.1
// @description  主页点击：课程按钮|自动学习小节|未写自动换课功能|需要代刷+vx:shuake345
// @author       vx:shuake345
// @match        *://*.h5.xiaoeknow.com/p/*
// @grant        none
// @icon         http://r.forteacher.cn/Images/logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480526/%E5%B0%8F%E9%B9%85%E9%80%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/480526/%E5%B0%8F%E9%B9%85%E9%80%9A.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'column'
	var Chuyurl = 'course/video'
	var Shuyurl = 'CourseWare'
	var Fhuyurl = '&courseware'

	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
        //yincang
        } else if (document.visibilityState == "visible") {
			if (document.URL.search(Zhuyurl) > 1 || document.URL.search(Shuyurl) > 1) {
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
		var KC = document.querySelectorAll("div > div.content-info > div.content-status") //[0].href
		var KCjd = document.querySelectorAll('.item>ul>li>i') //[0].innerText
		for (var i = 0; i < KC.length; i++) {
			if (KC[i].innerText.search('已学完')<0) {
                KC[i].click()
                break;
			}
		}
	}

	function Chuy() {
        if(document.getElementsByTagName('video')[0].paused){
        document.querySelector("#app-layout > div.last-page > span").click()
        }
        document.getElementsByTagName('video')[0].volume = 0
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
			setInterval(Chuy, 4210)
            document.getElementsByTagName('video')[0].volume = 0
		} else if (document.URL.search(Zhuyurl) > 2) {
            setInterval(function (){
            window.scrollTo(0, document.body.scrollHeight);
            },800)
			setTimeout(Zhuy, 4224)
		}
	}
	setTimeout(Pd, 1254)

})();