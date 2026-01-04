// ==UserScript==
// @name         四川创联-chinahrt自动看-2025.1-须改主页
// @namespace    需要代刷++++++v:shuake345      ++++++++
// @version      0.1
// @description  主页点击：课程按钮|自动学习小节|未写自动换课功能|需要代刷+vx:shuake345
// @author       vx:shuake345
// @match        *://edu.chinahrt.com/151/*
// @match        *://videoadmin.chinahrt.com/videoPlay/*
// @match        *://gp.chinahrt.com/*
// @grant        none
// @icon         http://r.forteacher.cn/Images/logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546796/%E5%9B%9B%E5%B7%9D%E5%88%9B%E8%81%94-chinahrt%E8%87%AA%E5%8A%A8%E7%9C%8B-20251-%E9%A1%BB%E6%94%B9%E4%B8%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/546796/%E5%9B%9B%E5%B7%9D%E5%88%9B%E8%81%94-chinahrt%E8%87%AA%E5%8A%A8%E7%9C%8B-20251-%E9%A1%BB%E6%94%B9%E4%B8%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
    var K主页='https://edu.chinahrt.com/151/learning_center/plan_course/3fc370eb4a37420fab9fc8951fbfa978'//这个链接就是课程主页
	var Zhuyurl = 'plan_course'
	var Chuyurl = 'trainplan_detail'
	var Shuyurl = 'play_video'

	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
        //yincang
            if (document.URL.search(Chuyurl) > 1 ) {
                setTimeout(gbclose, 6000)
			}
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
		var KC =document.querySelectorAll("div.body > main > div > div:nth-child(2) > div > div > div > div> div > div> div > div> div > img")
		var KCjd = document.querySelectorAll(" div.body > main > div > div:nth-child(2) > div > div > div > div> div > div> div > span.n-text.__text-q8o5bu-d.lbl-progress")


		for (var i = 0; i < KCjd.length; i++) {
			if (KCjd[i].innerText !== '100%') {
				KC[i].click()
				break;
			}else if(i==KCjd.length-1){//看完了。下一页
                document.querySelectorAll("#__nuxt > div > div.body > main > div > div:nth-child(2) > div > div > div> div> div > div > div> div > div > i")[1].click()
            }
		}
	}

	function Chuy() {
        if (document.visibilityState == "visible") {
        //xianshi
        var Lookzhuangtai =document.querySelectorAll("#__nuxt > div > div.body > main > div > div > div > div > div > div > div> div > div > div > div > div> div > div > div > div:nth-child(2) > div > div > span")//[0].innerHTML
		for (var i = 0; i < Lookzhuangtai.length; i++) {
			if (Lookzhuangtai[i].innerText !== '已学完') {
				Lookzhuangtai[i].click()
				break;
			}
		}
    }
        }
    function Sany(){
        if(document.getElementsByClassName('n-space chapter-list chapter-active')[0].querySelector('div>div>div>div>svg.svg-icon')!==null){//看完了。有勾了
            var zhengzaikan=document.getElementsByClassName('n-space chapter-list chapter-active')[0]
            if(zhengzaikan.parentElement.nextElementSibling!==null){//不是最后一门课。那就点击x一门课
                zhengzaikan.parentElement.nextElementSibling.querySelector('div>div>div').click()
            }else{//最后一门课了。跳转主页
                T跳主页()
            }
        }
        setTimeout(sxrefere,400000)

    }
    function Fhuy(){
        console.log(document.querySelector("#video-container > div.video-complete > div > div > div:nth-child(1) > div").innerText)
        if(document.querySelector("#video-container > div.video-complete > div > div > div:nth-child(1) > div").innerText=="培训计划课程学习已完成"){//
            setTimeout(T跳主页, 1212)
        }
    }
    setInterval(Fhuy, 5200)
    function T跳主页(){
        window.location.replace(K主页)
    }

	function Pd() {
		if (document.URL.search(Shuyurl) > 2) {
            setInterval(Sany, 9200)
		} else if (document.URL.search(Chuyurl) > 2) {
			setTimeout(Chuy, 210)
            setTimeout(gbclose,6000)
		} else if (document.URL.search(Zhuyurl) > 2) {
			setTimeout(Zhuy, 224)
		}
	}
	setInterval(Pd, 4254)

})();