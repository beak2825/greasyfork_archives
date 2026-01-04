// ==UserScript==
// @name         -普宁-2022年“心理健康教育教师培训”-自动换课_国家中小学智慧教育平台
// @namespace    国家中小学智慧教育平台
// @version      0.9
// @description  根据shuake345修改
// @author       根据shuake345修改，答题环节默认选第一个选项。
// @license      根据shuake345修改
// @match        *://www.zxx.edu.cn/*
// @match        https://*.zxx.edu.cn/teacherTraining/courseDetail*
// @match        https://*.smartedu.cn/teacherTraining/courseDetail*
// @match        https://basic.smartedu.cn/teacherTraining/courseDetail*
// @icon         https://www.google.com/s2/favicons?domain=zxx.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459360/-%E6%99%AE%E5%AE%81-2022%E5%B9%B4%E2%80%9C%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E2%80%9D-%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%AF%BE_%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/459360/-%E6%99%AE%E5%AE%81-2022%E5%B9%B4%E2%80%9C%E5%BF%83%E7%90%86%E5%81%A5%E5%BA%B7%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E2%80%9D-%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%AF%BE_%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...

    window.onbeforeunload = null
    //window.onbeforeunload='return true'
 //window.onbeforeunload = function(e) {return null}
	document.addEventListener("visibilitychange", function() {
		if (document.visibilityState == "hidden") {} else if (document.visibilityState == "visible") {
			if (document.URL.search('training') > 1) {
				setTimeout(sx, 1000)
			}
		}
	});
    function gb(){
        if (document.URL.search('courseDetail') > 1) {
        window.close()
    }
    }
    setTimeout(gb,600000)

	function sx() {
		window.location.reload()
	}

    function zy1(){
        if (document.URL.search('training') > 1) {
        var Bankuai=document.querySelectorAll('div.fish-tabs-nav-list>div.fish-tabs-tab')
        for (var i = 0; i < Bankuai.length; i++) {
        Bankuai[i].click()
        }
        }
    }
    setTimeout(zy1,2400)
	function zy() {
		if (document.URL.search('training') > 1) {
			var xxnum = document.getElementsByClassName('index-module_process_3RHjg')
			for (var i = 0; i < xxnum.length; i++) {
                if(xxnum[i].children[1].getElementsByTagName('span').length>0){
                    console.log('合格')

                    var yxx = Number(xxnum[i].children[1].getElementsByTagName('span')[0].innerText)

                    var maxd = Number(xxnum[i].children[1].getElementsByTagName('span')[1].innerText)
				//console.log(yxx)

                    console.log(maxd)

                    if (yxx < maxd || yxx==0) {

                        xxnum[i].children[1].getElementsByTagName('span')[1].click()

                        break;
				}
                    }
			}

		}
	}
	setTimeout(zy, 5524)

	function cy() {
		if (document.URL.search('courseIndex') > 1) {
			if (document.getElementsByClassName('CourseIndex-module_course-btn_3Yy4j').length > 0) {
				var xxname = document.getElementsByClassName('CourseIndex-module_course-btn_3Yy4j')
				if (xxname[0].innerText.search('学习') > 0) {
					xxname[0].click()
				}

			}
		}
	}
	setInterval(cy, 8145)

	function sy() {
		if (document.URL.search('courseDetail') > 1) {
            var sps=document.getElementsByTagName('video')[0]
			if (document.getElementsByClassName('course-video-reload').length > 0) {
				if (document.getElementsByClassName('course-video-reload')[0].innerText == '再学一遍') {
					var kec = document.getElementsByClassName('resource-item resource-item-train')
					var kecnum = kec.length
					for (var i = 0; i < kecnum; i++) {
						if (kec[i].className == 'resource-item resource-item-train resource-item-active') {
							if (i < kecnum - 1) {
								kec[i + 1].click();
								break;
							} else if (i == kecnum - 1) {
                                if(document.getElementsByClassName('size').length==0){
								window.close()
                                }
							}
						}
					}
				}
			}
			if (sps.paused == true) {
				sps.play()
				sps.playbackRate = 16
                sps.volume=0
			}else if(sps.playbackRate !== 16){
                sps.playbackRate = 16
                sps.volume=0
            }
			if (document.getElementsByClassName('fish-btn fish-btn-primary').length > 0) {
				if (document.getElementsByClassName('fish-btn fish-btn-primary')[0].innerText == '我知道了') {
					document.getElementsByClassName('fish-btn fish-btn-primary')[0].click()
				}
			}

			/*if(document.getElementsByClassName('fish-btn').length>0){
            if (document.getElementsByClassName('fish-btn')[0].innerText=='继续作答') {
				document.getElementsByClassName('fish-btn')[0].click()
			}else if (document.getElementsByClassName('fish-btn')[1].innerText=='继续作答') {
				document.getElementsByClassName('fish-btn')[1].click()}
            }*/
            

		}
	}
	setInterval(sy,4542)
    function sy2(){
    if (document.URL.search('courseDetail') > 1) {
    if (document.querySelectorAll('div.content>div>div>div>div>div>div>div>div>div').length > 2) {
                if(document.getElementsByClassName('size').length>0){
                document.getElementsByClassName('size')[0].click()
                }
				if (document.getElementsByClassName('fish-btn fish-btn-primary').length > 0) {
                    if(document.getElementsByClassName('fish-btn fish-btn-primary')[0].parentElement.className.search('footer')>10){
                    document.getElementsByClassName('fish-btn fish-btn-primary')[0].click()
                    }else if(document.getElementsByClassName('fish-btn fish-btn-primary').length > 1){
                    if(document.getElementsByClassName('fish-btn fish-btn-primary')[1].parentElement.className.search('footer')>10){
                    document.getElementsByClassName('fish-btn fish-btn-primary')[1].click()
                    }
                    }

				}

			}
    }
    }
    setInterval(sy2,1245)
    function sy1(){
    if(document.querySelectorAll('div.fish-collapse-item>div>i').length>0){
                for (var m = 0; m < document.querySelectorAll('div.fish-collapse-item>div>i').length; m++) {
                document.querySelectorAll('div.fish-collapse-item>div>i')[m].click()
                }
            }
    }
    setInterval(sy1,10542)

})();