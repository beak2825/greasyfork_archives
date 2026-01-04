// ==UserScript==
// @name         河南科技大全自动版本
// @namespace    https://greasyfork.org
// @version     4.0
// @description  河南科技大刷客
// @author      666
// @match       http://hngc.zyk.haust.edu.cn/*     
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/392305/%E6%B2%B3%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%85%A8%E8%87%AA%E5%8A%A8%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/392305/%E6%B2%B3%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%85%A8%E8%87%AA%E5%8A%A8%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
         	 var course = document.getElementsByClassName("rightnav cursor-p")[0]
			    var list = course.getElementsByTagName("li")
			    var i
			    setInterval(function(){
			        for (i = 0; i < list.length; i++){
			            if (list[i].className == "clearfix active"){
			                console.log(list[i].innerText)
			                var current_course = i
			                }
			        }
			        //当前课程播放完成
			        if (list[current_course].innerText.indexOf("100%") != -1){
			            if(list[current_course+1].innerText.indexOf("%") == -1){
			                list[current_course+2].click()
			            }else{
			                list[current_course+1].click()
			            }
			           location.reload();
			        }
					var video = document.querySelector('.pv-video');
			        video.play();
			    },1000)
})();