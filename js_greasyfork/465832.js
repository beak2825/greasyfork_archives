// ==UserScript==
// @name         继续教育
// @namespace    http://tampermonkey.net/Mr_sun
// @version      0.2
// @description   你好
// @author       You
// @match        https://edu.kxjzpt.cn/student/watch-package/88*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kxjzpt.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465832/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/465832/%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.baseURI=="https://edu.kxjzpt.cn/"){
        //  var videoS = document.getElementsByTagName("video");



        //获取当前课程
        var tabEle = document.getElementById("home");
        var className =tabEle.getElementsByTagName("div")[0].innerText ;
        var LiArr = document.getElementsByTagName("li");
        var classIndex ;
        for(var i=1;i<=LiArr.length;i++){
            classIndex = i;
            var finishIcon = LiArr[i].getElementsByTagName("img")[0];
            if(finishIcon==undefined){
                finishIcon = LiArr[i].getElementsByTagName("a")[0].getElementsByTagName("img")[0];
            }

            var isFinish =finishIcon.src=="https://edu.kxjzpt.cn/resources/images/wancheng.png";
            if(isFinish){
                continue;
            }else{
                if(className=="当前课程："+LiArr[i].getElementsByTagName("div")[0].getElementsByTagName("span")[0].innerText){
                    console.log("正在播放最新"+LiArr[i].getElementsByTagName("div")[0].getElementsByTagName("span")[0].innerText);
                    document.getElementById("player-con").getElementsByTagName("video")[0].volume=0;
                    //当前播放时间
                    var timeA = document.getElementById("player-con").getElementsByTagName("video")[0].currentTime ;

                    document.getElementById("player-con").getElementsByTagName("video")[0].addEventListener("loadeddata",function(){

                        var timeB = document.getElementById("player-con").getElementsByTagName("video")[0].duration;
                    //       if(timeA<(timeB-180)){
                        //document.getElementById("player-con").getElementsByTagName("video")[0].play();
                  //      console.log(1);
                  //      document.getElementById("player-con").getElementsByTagName("video")[0].currentTime=timeB-180;
                  //  }

                    });

                    break;
                }else{
                    LiArr[i].getElementsByTagName("img")[0].click();
                    break;
                }

            }


        }




        window.onload = function(){
            console.log("加载完了");
            document.getElementById("player-con").getElementsByTagName("video")[0].addEventListener('ended', function(){
                console.log('视频已经播放完成');
                LiArr[classIndex+1].getElementsByTagName("img")[0].click();
            },false);

            document.getElementById("player-con").getElementsByTagName("video")[0].addEventListener('pause', function () {//暂停开始执行的函数
                console.log("暂停播放");
                document.getElementById("player-con").getElementsByTagName("video")[0].play();
            });
            document.addEventListener("keydown ",function(){});
            window.onresize = function () {
		}
            document.onkeydown = function(e){

		}
            window.onkeydown = window.onkeyup = window.onkeypress = function () {
			window.event.returnValue = true;
			return true;
		}

        }



    }

    // Your code here...
})();