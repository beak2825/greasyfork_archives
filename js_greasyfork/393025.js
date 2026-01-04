// ==UserScript==
// @name         敷衍
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.51moot.net/*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/393025/%E6%95%B7%E8%A1%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/393025/%E6%95%B7%E8%A1%8D.meta.js
// ==/UserScript==】】】

 window.onblur = function () {
                  	console.log('1')
                             }
 //目录
  var mulu=document.getElementsByClassName("vedio-play-conts-left-chapter-list-play");
var i=0;

                setInterval(function(){
//	播放时长
              var count=player.j2s_getCurrentTime();
                    //视频时长
                    console.log(count);
                    	var sumcount=player.j2s_getDuration();
                    console.log(sumcount);
                        if(count==sumcount){
                    		i++;
                    		mulu[i].click();
                    	}
                },10000)

