// ==UserScript==
// @name         中国干部网络学院_自动-新疆干部网络学院-四川干部网络学院-秒刷+VX:shuake345-广西干部网络学院-北海领导干部在线教育-代刷+VX:shuake345
// @namespace    代刷VX:shuake345
// @version      0.3
// @description  自动看|自动切换|进入课程后点击继续学习，秒刷示意图：https://uploader.shimo.im/f/dB36N0CbYUE8zWJZ.gif
// @author       VX:shuake345
// @match        *://cela.gwypx.com.cn/*
// @match        *://cela.e-celap.com/dsfa/nc/pc/special/views/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-celap.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488668/%E4%B8%AD%E5%9B%BD%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2_%E8%87%AA%E5%8A%A8-%E6%96%B0%E7%96%86%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E5%9B%9B%E5%B7%9D%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E7%A7%92%E5%88%B7%2BVX%3Ashuake345-%E5%B9%BF%E8%A5%BF%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E5%8C%97%E6%B5%B7%E9%A2%86%E5%AF%BC%E5%B9%B2%E9%83%A8%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B2-%E4%BB%A3%E5%88%B7%2BVX%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/488668/%E4%B8%AD%E5%9B%BD%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2_%E8%87%AA%E5%8A%A8-%E6%96%B0%E7%96%86%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E5%9B%9B%E5%B7%9D%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E7%A7%92%E5%88%B7%2BVX%3Ashuake345-%E5%B9%BF%E8%A5%BF%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2-%E5%8C%97%E6%B5%B7%E9%A2%86%E5%AF%BC%E5%B9%B2%E9%83%A8%E5%9C%A8%E7%BA%BF%E6%95%99%E8%82%B2-%E4%BB%A3%E5%88%B7%2BVX%3Ashuake345.meta.js
// ==/UserScript==

(function() {
	'use strict';

	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}

	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "visible") {
			if (document.URL.search('specialDetail') > 1) {
				setTimeout(Zy, 1000)
			}
		}
	});

	function gb() {
		window.close()
	}

	function sx() {
		window.location.reload()
	}

	function dk() {
		var i = 0
		while (i < $('.icon-zk.toggleSj').length) {
			$('.icon-zk.toggleSj')[i].click()
			i++
		}
		i = 0
		while (i < $('.icon-zk').length) {
			$('.icon-zk')[i].click()
			i++
		}
	}
	// setTimeout(dk,2000)
	function pdbf() {
		var sel = document.getElementsByClassName('selConListItem kcAllow')
		var jindu = sel[0].querySelector('canvas').attributes['data-percent'].textContent

		if (parseFloat(jindu)>=100) {
            if(sel[0].nextSibling.innerText!==undefined){
            sel[0].nextSibling.click()
        }else{
            localStorage.setItem('Kcname',localStorage.getItem('Kcname')+document.getElementsByClassName('head-title')[0].innerText)
			setTimeout(gb, 1142)
            }
		}
	}
	

	function bf() {
        if(document.getElementsByTagName('video').length==1){
            //setTimeout(sx,600000)
        if(document.getElementsByTagName('video')[0].paused){
            document.getElementsByTagName('video')[0].play()
            if(document.getElementsByClassName('pv-time-current')[0].innerText==document.getElementsByClassName('pv-time-duration')[0].innerText){
            setTimeout(pdbf,100)
                setTimeout(function (){
                if(document.getElementsByClassName('pv-time-current')[0].innerText=='00:00'){
                setTimeout(sx,1000)
                }
                },6000)
            }
        
        }
            
        }
	}
	

	function Zy() {
		if (localStorage.getItem('Kcname') == null) {
			localStorage.setItem('Kcname', "")
		}
		var KCend = localStorage.getItem('Kcname')
		var KC = document.getElementsByClassName('-item-title')
		for (var i = 0; i < KC.length; i++) {
			if (KCend.search(KC[i].innerText) < 0) { //没看过
				KC[i].click()
				break;
			}
		}
	}

    function Pd(){
    if(document.URL.search('course.html')>2){
        setTimeout(function(){
        if(document.getElementsByClassName('pv-icon-btn-play pv-iconfont')[0].style[0]=='display'){
            document.getElementsByClassName('pv-icon-btn-play pv-iconfont')[0].click()
            }
        },1520)
       setInterval(pdbf, 5000)
        setInterval(bf, 4100)
    }else if(document.URL.search('specialDetail')>2){
        setTimeout(Zy, 100)
    }
    }
    setTimeout(Pd,3254)

})();