// ==UserScript==
// @name         智慧树自动播放
// @namespace    https://studyvideoh5.zhihuishu.com/
// @version      1.0
// @description  智慧树、知到自动播放并跳过答题
// @author       Td
// @match        https://studyvideoh5.zhihuishu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476400/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/476400/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
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
		x("video").muted = true;
		x("video").playbackRate = 1.25;
	 }

	function autoPlay() {
			let v = x('video');
			let nextbtn = x('#nextBtn')

			x('video').addEventListener('pause', function () {

					vi()
					r(x('#playTopic-dialog'))
					r(x('.v-modal'))
                    r(x('.dialog'))

			})

			x('video').addEventListener('ended', function () {
					 setTimeout(() => {
							 location.reload()
							 nextbtn.click()
					 }, 500)

			 })
	}

	 setTimeout(() => {
			 vi()
			 autoPlay()
             r(x('.dialog'))
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