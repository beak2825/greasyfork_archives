// ==UserScript==
// @name         柏油云课堂自动播放
// @namespace    https://*.yuketang.cn/
// @version      2024-09-21
// @description  可自动播放、换下一课、设置静音，但必须维持在前台，且需要在第一个视频位置启动脚本
// @author       yyn
// @match        https://*.yuketang.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509467/%E6%9F%8F%E6%B2%B9%E4%BA%91%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/509467/%E6%9F%8F%E6%B2%B9%E4%BA%91%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
window.onload = function(){

	function x(n){
		return document.querySelector(n);
	}

	function h(dom){
		dom.style.display = 'none'
	 }

    function r(dom){
        dom.remove()
    }

	 function vi(){
		x("video").play()
		//x("video").muted = true      //无效
		//x("video").playbackRate = 2  //无效
	 }

    function incrementLastDigitInUrl() {
        var url = window.location.href;
        var match = url.match(/(\d+)$/); // 正则表达式匹配URL末尾的数字
        if (match) {
            var number = parseInt(match[0], 10); // 将匹配到的数字字符串转换为数字
            var newNumber = number + 1; // 加一
            var newUrl = url.slice(0, -match[0].length) + newNumber; // 拼接新的URL
            window.location.href = newUrl; // 更新当前页面的URL
        } else {
            window.location.href = url + '1'; // 如果没有数字，在URL后加`1`
        }
    }


	function autoPlay() {
			let v = x('video');
            //let nextbtn = document.getElementsByClassName("iconfont icon--danjiantouxiangyou color-9b")
            //let nextbtn = document.getElementsByClassName("f14 color6")
            let is_vedio = document.getElementsByClassName("log-detail") // 获取“详情”按钮，只有vedio才有该按钮
            if (is_vedio[0]) {
                let mute_btn = document.getElementsByClassName("xt_video_player_common_icon") //获取静音按钮
                mute_btn[0].click() //静音
			    x('video').addEventListener('pause', function () {

					vi()
					r(x('#playTopic-dialog'))
					r(x('.v-modal'))
                    r(x('.dialog'))

		    	})

			    x('video').addEventListener('ended', function () {
					 setTimeout(() => {
                             incrementLastDigitInUrl()
                             //location.reload()
							 //nextbtn[1].click()
                             //nextbtn[1].style.backgroundColor = "yellow"

					         }, 500)

			     })
            } else {
            incrementLastDigitInUrl()}
	}

    	 setTimeout(() => {
             //let nextbtn = document.getElementsByClassName("iconfont icon--danjiantouxiangyou color-9b")
             //console.log(nextbtn[0])
            // console.log(nextbtn[0].click())
            // nextbtn[0].click()

			 autoPlay()
			 vi()
             //r(x('.dialog'))
	 }, 3000);


	 setInterval(() => {
			let t = x("#playTopic-dialog");

			if(t != null){
				if(t.style.display != 'none'){
					r(t);
					r(x(".v-modal"))
					setTimeout(() => {
						vi()
					}, 100);
				}
			}

	 }, 500);



	}

})();