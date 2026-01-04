// ==UserScript==
// @name         湖南省干部教育培训网络学院-hngbjy
// @namespace    需要代刷++++++v:shuake345      ++++++++
// @version      0.2
// @description  主页点击：课程按钮|自动学习小节|未写自动换课功能|需要代刷+vx:shuake345
// @author       vx:shuake345
// @match        *://*.hngbjy.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hngbjy.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489616/%E6%B9%96%E5%8D%97%E7%9C%81%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-hngbjy.user.js
// @updateURL https://update.greasyfork.org/scripts/489616/%E6%B9%96%E5%8D%97%E7%9C%81%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-hngbjy.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'hngbjy'
	var Chuyurl = 'hngbjy'
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
		var KC = document.querySelector("div.personal-center-top > ul > li:nth-child(1)")
        if(KC!==null){
        document.querySelector("div.personal-center-top > ul > li:nth-child(1)").click()
            setTimeout(function(){
                document.querySelector(" div.left-box > div.course-name > span.course-name-link").click()
            },1211)
        }
	}

	function Chuy() {
        document.getElementsByTagName('video')[0].volume=0
		if(document.getElementsByTagName('video')[0].paused){
            setTimeout(gbclose,1212)
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
        var d1=document.getElementsByClassName('dbs')[0];
        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";//qitao
         img.src="https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";//xuanchuan
        d1.appendChild(img);
    }
	function Pd() {
		if (document.URL.search(Fhuyurl) > 2) {
			setTimeout(QT,20)
			setInterval(Fhuy, 5520)
            setTimeout(function(){
            window.location.replace(localStorage.getItem('Surl'))
            },61245*10)
		} else if (document.URL.search(Chuyurl) > 2 && document.getElementsByTagName('video').length==1) {
 window.scrollTo(0, document.body.scrollHeight);
            if(document.getElementsByTagName('video')[0].paused){
            document.getElementsByTagName('video')[0].play()
            }
			setInterval(Chuy, 10210)
		} else if (document.URL.search(Zhuyurl) > 2) {
			setTimeout(Zhuy, 1224)
		}
	}
	setTimeout(Pd, 1254)

})();