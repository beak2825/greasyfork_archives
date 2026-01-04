// ==UserScript==
// @name         全自动国开刷课脚本
// @namespace    
// @version      1.1
// @description  国家开放大学自动刷课脚本
// @author       kangyl
// @match        *://*.ouchn.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419706/%E5%85%A8%E8%87%AA%E5%8A%A8%E5%9B%BD%E5%BC%80%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/419706/%E5%85%A8%E8%87%AA%E5%8A%A8%E5%9B%BD%E5%BC%80%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var script = document.createElement('script');
script.src = "http://code.jquery.com/jquery-migrate-1.2.1.min.js";
document.head.appendChild(script);

(function() {
   'use strict';
   setTimeout(function(){
        var zxkch = document.getElementById("zaixuekecheng");
        if (zxkch) {
            var inStudyList = document.getElementsByClassName('btn bg-primary');
            for (let i in inStudyList){
                setTimeout(function(){
                    (inStudyList[i]).click();
                }, 1000*i);
            }
        }
     }, 3000);
    

    var href = location.href
    if(href.indexOf("sectionid=")!=-1){
        //获取当前课件
        var current = document.getElementsByClassName("act")[0]
        //console.log(current)
        //是文本的话直接跳到下一个课件

        var list = document.getElementsByTagName('li')
        var listlen = document.getElementsByTagName('li').length
        var arrlist = document.getElementsByClassName('hidden-sm-down')[0].lastElementChild.querySelectorAll('a')
        var itemcheck = document.getElementsByClassName('hidden-sm-down')[0].firstElementChild.innerText
        var clickindex
        var lastli = list[listlen-1]
        var index
        var v = $('video')[0]
        console.log(v)

		//获取当前页面的li
		for(let i = 0;i<listlen;i++){
			if(document.getElementsByTagName("li")[i].className == "act"){
				if($("video")[0]){
					videoplay()
				}else if(i == listlen-1){
					for (let i = 0;i<arrlist.length;i++){
						if(itemcheck == arrlist[i].innerHTML.replace(/\s+/g,' ')){
							console.log(arrlist[i].innerHTML)
							clickindex = i+1
						}
					}
					arrlist[clickindex].click()
					console.log(itemcheck)
				}else{
				  	document.getElementsByTagName("li")[i+1].click()
				   	break
				}
			}
		}
	}
	// 视频播放函数
	function videoplay() {
		autoPlay();
		//播放完成后自动下一课件
		setInterval(function(){
		    //if(video.ended){
		        for(var i = 0; i < document.getElementsByTagName("li").length; i++){
		            if(document.getElementsByTagName("li")[i].className == "act"){
		                document.getElementsByTagName("li")[i+1].click()
		                setTimeout(function(){
		                    autoPlay();
		                },2000)
		                break;
		            }
		       // }
		    }
		},2000)
	}
    
	function autoPlay() {
		var videoArr = document.getElementsByTagName("video")
		var video = videoArr[0]

		video.playbackRate = 16
		video.play()
	}
	
})();