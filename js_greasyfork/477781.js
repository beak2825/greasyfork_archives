// ==UserScript==
// @name         华中师范大学教师研修平台-zhihuiteacher-发布
// @namespace    需要代刷++++++v:shuake345      ++++++++
// @version      0.1
// @description  自动学习小节|自动换课功能|需要代刷+vx:shuake345
// @author       vx:shuake345
// @match        *://*.zhihuiteacher.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihuiteacher.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477781/%E5%8D%8E%E4%B8%AD%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E5%B9%B3%E5%8F%B0-zhihuiteacher-%E5%8F%91%E5%B8%83.user.js
// @updateURL https://update.greasyfork.org/scripts/477781/%E5%8D%8E%E4%B8%AD%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E5%B9%B3%E5%8F%B0-zhihuiteacher-%E5%8F%91%E5%B8%83.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'online'
	var Fhuyurl = '&courseware'

	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
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
        if(document.querySelector("div.courseMessage > div.toStudy")!==null){
        document.querySelector("div.courseMessage > div.toStudy").click()
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


	function Fhuy() {

		if (document.getElementsByTagName('video').length == 1) {
			document.getElementsByTagName('video')[0].volume = 0
			document.getElementsByTagName('video')[0].play()
		}
		/*if (document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-currtime').innerText == document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-totaltime').innerText) {
			window.location.replace(localStorage.getItem('Surl'))*/
	}
    setTimeout(Fhuy,5214)
	function QT(){
        var d1=document.querySelector("body > div.connet > div.right > dl")
        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";
        d1.appendChild(img);
    }
    setTimeout(QT,4010)
	function Pd() {
		if (document.URL.search(Fhuyurl) > 2) {
			setTimeout(QT,20)
			setInterval(Fhuy, 5520)
            setTimeout(function(){
            window.location.replace(localStorage.getItem('Surl'))
            },61245*10)
		} else if (document.URL.search(Zhuyurl) > 2) {
			setTimeout(Zhuy, 24)
		}
	}
	setTimeout(Pd, 2254)

})();