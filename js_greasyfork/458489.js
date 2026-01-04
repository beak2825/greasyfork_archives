// ==UserScript==
// @name         sousouwan
// @namespace    sousouwan
// @version      0.1
// @description  sousouwan1
// @author       You
// @match        *://www.zxx.edu.cn/*
// @grant        none
// @license      You
// @downloadURL https://update.greasyfork.org/scripts/458489/sousouwan.user.js
// @updateURL https://update.greasyfork.org/scripts/458489/sousouwan.meta.js
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
    /*function sy2(){
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
    setInterval(sy2,1245)*/
    function sy1(){
        if(document.querySelectorAll('div.fish-collapse-item>div>i').length>0){
            for (var m = 0; m < document.querySelectorAll('div.fish-collapse-item>div>i').length; m++) {
                document.querySelectorAll('div.fish-collapse-item>div>i')[m].click()
            }
        }
    }
    setInterval(sy1,10542)

})();