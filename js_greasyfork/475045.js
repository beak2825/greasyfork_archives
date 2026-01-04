// ==UserScript==
// @name        湖南法网-12348-如法网
// @namespace    需要代刷++++++v:shuake345      ++++++++
// @version      0.1
// @description  进入课程后自动点击未答题课程按钮|自动学习小节|自动考试|++++秒刷++++需要代刷+vx:shuake345 ++++++++
// @author       vx:shuake345
// @match        http://hn.12348.gov.cn/fxmain/subpage/legalpublicity/*
// @grant        none
// @icon         http://hn.12348.gov.cn/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475045/%E6%B9%96%E5%8D%97%E6%B3%95%E7%BD%91-12348-%E5%A6%82%E6%B3%95%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/475045/%E6%B9%96%E5%8D%97%E6%B3%95%E7%BD%91-12348-%E5%A6%82%E6%B3%95%E7%BD%91.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'legalpublicity'
	var Chuyurl = 'MyjoinEvent'
	var Shuyurl = 'CourseWare'
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
		var TM = document.querySelectorAll('[value="A"]')//.click()
        if(TM.length>0){//有答题
                for (var i = 0; i < TM.length; i++) {
                TM[i].click()


            }
            document.querySelector("#btn_code").click()
                setTimeout(sxrefere, 6000)

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
        var d1=document.getElementsByClassName('dbs')[0];
        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
        d1.appendChild(img);
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
            document.querySelector('[style="color:red;"]').click()
			setTimeout(Zhuy, 1224)
		}
	}
	setTimeout(Pd, 1254)

})();