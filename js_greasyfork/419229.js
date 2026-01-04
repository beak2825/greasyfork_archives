// ==UserScript==
// @name         ZJOOC自动播放完全版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ZJOOC自动播放视频和完成文档点击
// @author       阿鸡
// @match        *://www.zjooc.cn/ucenter/student/course/study/*/plan/detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419229/ZJOOC%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%AE%8C%E5%85%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/419229/ZJOOC%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%AE%8C%E5%85%A8%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var startTime=15000;//第一次脚本开始时间（毫秒），在这个时间之前需要确保完成课程选择和课程加载，否则会报错
    var playInterval=5000;//课程播放间隔时间（毫秒），在这个时间之前需要确保完成课程加载，否则会报错或者错误跳过
    var speedIndex = 0; // 速度，0：4倍速，1：2倍速，2：1.5倍速，3：1.25倍速，4：正常，5：0.5倍速
    var muteFlag = true; //是否静音
    var time1;
    var flag = true;//判断是图片还是视频-------视频/true    图片/false；

    var addr,getSumClass,getSumClassName;


    var nextVideoFunc=function(){


    	/*
    	 * 当右边的东西都执行完之后再去执行这行代码。
    	 * 所以需要做一个判断，当右边的nextSibling==null的时候再去执行这一行代码。
    	 * 所以来之前我们先判断以下哪个是带有 el-tabs__item is-top is-active的。
    	 * 然后通过nextSibling执行下一个代码
    	 */

    	var currentSum = document.getElementsByClassName("el-tabs__item is-top is-active")[1];

    	var nextSum = currentSum.nextSibling;

    	if(nextSum == null){
    		var currentClass=document.getElementsByClassName("el-menu-item is-active")[1];
	        var nextClass=currentClass.nextSibling;
	        if(nextClass==null){
	            currentClass.parentNode.parentNode.nextSibling.childNodes[0].click();
	            nextClass=currentClass.parentNode.parentNode.nextSibling.childNodes[1].childNodes[1];
	        }
	        if(nextClass==null){
	            alert("所有课程已经学习完毕。");
	        }
	        nextClass.click();

	        addr = document.getElementsByClassName("el-tabs__item is-top is-active")[1];

    		getSumClass = addr.childNodes[0].childNodes[0];

    		getSumClassName = getSumClass.className;

    		if(getSumClassName.search("iconset") != -1){
    			flag = false;
                if(time1){clearInterval(time1);}
    		}else{
    			flag = true;
                time1 = window.setInterval(detectiveFunc,playInterval);
    		}

	        if(flag == true){
	        	window.setTimeout(playVideoFunc,7000);
	        }else{
	        	window.setTimeout(playImg,7000);
	        }

    }else{

    	//因为是div所以不可以click。那么我们就添加和删除类的方式来实现
    	currentSum.classList.remove("is-active");
    	nextSum.classList.add("is-active");

    	addr = document.getElementsByClassName("el-tabs__item is-top is-active")[1];

    	getSumClass = addr.childNodes[0].childNodes[0];

    	getSumClass.click()

    	getSumClassName = getSumClass.className;

    		if(getSumClassName.search("iconset") != -1){
    			flag = false;
                if(time1){clearInterval(time1);}
    		}else{
    			flag = true;
                time1 = window.setInterval(detectiveFunc,playInterval);
    		}


	        if(flag == true){
	        	window.setTimeout(playVideoFunc,7000);
	        }else{
	        	window.setTimeout(playImg,7000);
	        }
    	}


    }
    var playVideoFunc=function(){
        var vidf=document.getElementsByTagName("video")[0];
        var spd = vidf.parentElement.children[8];
        var cbf=vidf.parentNode.childNodes[2];
        var playLayerf=cbf.childNodes[0];
        /*速度*/
        spd.children[speedIndex].click();
        /*音量*/
        if(muteFlag){
            cbf.children[18].click();
        }
        window.setTimeout(function(){
            var vidf=document.getElementsByTagName("video")[0];
            var spd = vidf.parentElement.children[8];
            var cbf=vidf.parentNode.childNodes[2];
            var playLayerf=cbf.childNodes[0];
            /*速度*/
            spd.children[speedIndex].click();
            /*音量*/
            if(muteFlag){
            cbf.children[18].click();
        }
            playLayerf.click();
        },playInterval);
    };

	var playImg = function(){
		var btn = document.getElementsByTagName("button")[2];
		btn.click();
		window.setTimeout(nextVideoFunc,7000);

	}

    var detectiveFunc=function(){
        var vid=document.getElementsByTagName("video")[0];
        var cb=vid.parentNode.childNodes[2];
        var playLayer=cb.childNodes[0];
        var processBar=cb.childNodes[7];
        var processText;
        //结束，用/分割时间，如果左边的时间等于右边的时间就可以播放下一集了
        processText=processBar.innerText;
        var pctime=processText.split('/');
        var ctime=pctime[0].trim();
        var etime=pctime[1].trim();
        if(ctime==etime){
        	if(time1){clearTimeout(time1);}
                window.setTimeout(nextVideoFunc,7000);
        }
    };
    var ScritpFunc=function(){

    	addr = document.getElementsByClassName("el-tabs__item is-top is-active")[1];

    	getSumClass = addr.childNodes[0].childNodes[0].className;

    	//如果是图片的话，就去调用图片的完成方法
    	//否则就调用视频的完成方法
		if(getSumClass.search("iconset") != -1){
			flag = false;
			playImg();
		}else{
			flag = true;
			playVideoFunc();
        	time1 = window.setInterval(detectiveFunc,playInterval);
		}

    }
    //开始load之后，过startTime后执行图片或者是视频
    window.setTimeout(ScritpFunc,startTime);
})();