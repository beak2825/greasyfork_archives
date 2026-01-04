// ==UserScript==
// @name         驻马店专业课
// @namespace    https://greasyfork.org
// @version     11.0
// @description  驻马店专业
// @author      666
// @match        http://zmdzj.zyk.ghlearning.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411382/%E9%A9%BB%E9%A9%AC%E5%BA%97%E4%B8%93%E4%B8%9A%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/411382/%E9%A9%BB%E9%A9%AC%E5%BA%97%E4%B8%93%E4%B8%9A%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
	 var course = document.getElementsByClassName("rightnav cursor-p")[0]
			    var list = course.getElementsByTagName("li")
			    var i
			    setInterval(function(){
			        for (i = 0; i < list.length; i++){
			            if (list[i].className == "clearfix videoLi active"){
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