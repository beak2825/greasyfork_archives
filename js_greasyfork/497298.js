// ==UserScript==
// @name         国资e学-慢速自动-代刷加vx:shuake345
// @namespace    代刷vx:shuake345
// @version      0.1
// @description  自动看课程|自动切换|秒刷vx:shuake345
// @author       代刷vx:shuake345
// @match        *://elearning.tcsasac.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497298/%E5%9B%BD%E8%B5%84e%E5%AD%A6-%E6%85%A2%E9%80%9F%E8%87%AA%E5%8A%A8-%E4%BB%A3%E5%88%B7%E5%8A%A0vx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/497298/%E5%9B%BD%E8%B5%84e%E5%AD%A6-%E6%85%A2%E9%80%9F%E8%87%AA%E5%8A%A8-%E4%BB%A3%E5%88%B7%E5%8A%A0vx%3Ashuake345.meta.js
// ==/UserScript==




(function() {
	'use strict';

	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'myTrainingCourseList'
	var Chuyurl = 'courseDetail'

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
            var 去学习btn=document.querySelectorAll(" div> div > div > div > div> div> div > span")//[13].innerText "去学习"
		for (var i = 0; i < 去学习btn.length; i++) {
			if (去学习btn[i].innerText == "去学习") {
                去学习btn[i].click()
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
	setInterval(Shuy, 3124)


	function QT(){
        var d1=document.querySelectorAll("#root > div > div> div > div > div> div > div > div> div> div")[1]
        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";//qitao
         img.src="https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";//xuanchuan
        d1.appendChild(img);
    }
	function Pd() {if (document.URL.search(Zhuyurl) > 2) {
			    setTimeout(Zhuy,2222)
		}else if (document.URL.search(Chuyurl) > 2) {
			    setTimeout(QT,2222)
		}
	}
	setTimeout(Pd, 1254)

})();