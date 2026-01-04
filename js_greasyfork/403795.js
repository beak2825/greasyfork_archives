// ==UserScript==
// @name         信阳专业课
// @namespace    http://123.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        http://xyzj.zyk.ghlearning.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403795/%E4%BF%A1%E9%98%B3%E4%B8%93%E4%B8%9A%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/403795/%E4%BF%A1%E9%98%B3%E4%B8%93%E4%B8%9A%E8%AF%BE.meta.js
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