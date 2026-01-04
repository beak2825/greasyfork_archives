// ==UserScript==
// @name         chinahrt类专技-四川创联-通杀扫残版代刷vx:shuake345
// @namespace    需要代刷++++++v:shuake345      ++++++++
// @version      0.1
// @description  自动学习小节|未写自动换课功能|需要代刷+vx:shuake345
// @author       vx:shuake345
// @match        *://edu.chinahrt.com/151/*
// @match        *://videoadmin.chinahrt.com/videoPlay/*
// @grant        none
// @icon         http://r.forteacher.cn/Images/logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502883/chinahrt%E7%B1%BB%E4%B8%93%E6%8A%80-%E5%9B%9B%E5%B7%9D%E5%88%9B%E8%81%94-%E9%80%9A%E6%9D%80%E6%89%AB%E6%AE%8B%E7%89%88%E4%BB%A3%E5%88%B7vx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/502883/chinahrt%E7%B1%BB%E4%B8%93%E6%8A%80-%E5%9B%9B%E5%B7%9D%E5%88%9B%E8%81%94-%E9%80%9A%E6%9D%80%E6%89%AB%E6%AE%8B%E7%89%88%E4%BB%A3%E5%88%B7vx%3Ashuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';
 //配置参数界面

 //
       function oneJM(){
           if(document.URL.search('web.chinahrt.com/index.html#/v_selected_course')!==-1){
            console.log('vx:shuake345')
             var kc1=document.querySelectorAll('div.progress-line>span')
            for (var i = 0;i < kc1.length;i++){
                if(kc1[i].innerText=="0%"){
                 console.log('进入未学课程')
              document.getElementsByClassName('bg pa tc')[i].click()
                break;
             }
          }
       }else if(document.URL.search('web.chinahrt.com/index.html#/v_courseDetails')!==-1){
           console.log('发现次页')
           var kc2=document.querySelectorAll('a.button.fr.mt10.mr20.border-public.tc.f14.titlecolor')
           var sm= Number(kc2.length)
            for (var l = 0;l < kc2.length;l++){
                if(kc2[l].innerText.search('00:00')>0){
                    console.log('发现未学的'+l)
                    kc2[l].click()
                    window.location.reload()
                    break;
             }else if (kc2.length-1==l){
                 alert('初扫以完成，细扫请联系shuake345')
             window.history.go(-1)
             }
           }
       }//console.log('啥都没做')
    }
      function sxx(){
          if(document.URL.search('web.chinahrt.com/index.html#/v_courseDetails')!==-1){
           sx()
          }
 }
setInterval(sxx,20000)

    function openURL(){
        if(document.querySelector('iframe').src!==""){
            window.location.replace(document.querySelector('iframe').src)
           }else if(document.URL.search('videoadmin.chinahrt.com')>0){
               document.getElementsByTagName('video')[0].playbackRate=16
           document.getElementsByTagName('video')[0].play();
            player.videoMute();
           }
        }
    setInterval(openURL,5000)

    function closewindow(){
    if(document.URL.search('web.chinahrt.com/index.html#/v_proxy')>0){
    window.close()
    }
    }
    setInterval(closewindow,11000)

    function sx(){
        window.location.reload()
    }
    function ss(){
    if(document.visibilityState=='visible'){
        oneJM()
        console.log('zxjb')
    }
    }
    setInterval(ss,6000)
    window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'plan_course'
	var Chuyurl = 'trainplan_detail'
	var Shuyurl = 'play_video'
    var Foururl='videoPlay'

	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
        //yincang
        } else if (document.visibilityState == "visible") {
			if (document.URL.search(Chuyurl) > 1 ) {
                window.location.replace(K主页)
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
		var KC = document.querySelectorAll("#__nuxt > div > div.body > main > div > div:nth-child(2) > div > div > div:nth-child(4) > div > div > div > div > div> div > img") //[0].href
		var KCjd = document.querySelectorAll("#__nuxt > div > div.body > main > div > div:nth-child(2) > div > div > div:nth-child(4) > div> div > div> div > span:nth-child(4) ")//[0].innerText
		for (var i = 0; i < KCjd.length; i++) {
			if (KCjd[i].innerText !== '100%') {
				KC[i].click()
				break;
			}
		}
	}

	function Chuy() {
        if (document.visibilityState == "visible") {
        //yincang
        var Lookzhuangtai =document.querySelectorAll("#__nuxt > div > div.body > main > div > div > div > div > div > div > div> div > div > div > div > div> div > div > div > div:nth-child(2) > div > div > span")//[0].innerHTML
		for (var i = 0; i < Lookzhuangtai.length; i++) {
			if (Lookzhuangtai[i].innerText !== '已学完') {
				Lookzhuangtai[i].click()
				break;
			}
		}
    }
        }



	function Pd() {
		if (document.URL.search(Chuyurl) > 2) {
			setTimeout(Chuy, 210)
		} else if (document.URL.search(Zhuyurl) > 2) {
			setTimeout(Zhuy, 224)
		}
	}
	setInterval(Pd, 4254)

})();