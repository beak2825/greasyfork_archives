// ==UserScript==
// @name         B站视频倍速控制器脚本
// @namespace    https://github.com/csXLJ/bzplayer/
// @version      6.0
// @description  自定义调整B站所有视频播放速度并记忆倍速，不包括赛事，游戏中心，直播
// @author       csXLJ
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @match        https://www.bilibili.com/*
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/439301/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/439301/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var controller = (function () {
	var timeId;
	var speed = 1.0;
	var whichVideo;
        var timeIds = [];
	const config = {
		subtree: true,
		childList: true,
		attributes: true,
		attributeFilter: ['src'],
		attributeOldValue: true
	};

    const callback = function(mutationsList, observer) {
		for(let mutation of mutationsList) {
			if (mutation.type === 'childList') {
				var nodelist = mutation.addedNodes;
                if(nodelist != null && nodelist.length > 0){
                    var tagname = nodelist[0].tagName;
                    if("VIDEO" == tagname || "BWP-VIDEO" == tagname){
                        var str = "播放速度："+speed + "x";
                        whichVideo = document.querySelector('bwp-video') != null ? document.querySelector('bwp-video') : document.querySelector('video');
                        addAndDelTil(whichVideo, "div", str);
                        whichVideo.playbackRate = speed;
                        break;
                    }
                }
			}
			else if (mutation.type === 'attributes') {
                var str1 = "播放速度："+speed + "x";
                whichVideo.playbackRate = speed;
                addAndDelTil(whichVideo, "div", str1);
                break;
			}
		}
	};
    const observer = new MutationObserver(callback);
    var flag = true;
	function keyd(e) {
        whichVideo = hasFrame();
		speed = whichVideo.playbackRate;
        var videos = document.getElementsByClassName('cur-page');
        var fjvideos = document.getElementsByClassName('ep-list-progress');
        var videowrap = document.querySelector('.bpx-player-video-wrap');
		if (e.key == "+") {
			if (speed == 16) {
				speed = 16;
			} else {
				speed = speed + 0.1;
				speed = roundFun(speed, 1);
			}
			var str = "播放速度："+speed + "x";
			addAndDelTil(whichVideo, "div", str);
			whichVideo.playbackRate = speed;
            if(flag){
                if(videos != null && videos.length > 0 || fjvideos != null && fjvideos.length > 0){
                    observer.observe(videowrap, config);
                    flag = false;
                }
            }
		} else if (e.key == "-") {
			if (speed == 0) {
				speed = 0;
			} else {
				speed = speed - 0.1;
				speed = roundFun(speed, 1);
			}
            var str1 = "播放速度："+speed + "x";
			addAndDelTil(whichVideo, "div", str1);
			whichVideo.playbackRate = speed;
            if(flag){
                if(videos != null && videos.length > 0 || fjvideos != null && fjvideos.length > 0){
                    observer.observe(videowrap, config);
                    flag = false;
                }
            }
		}
	}

	document.body.removeEventListener('keydown', keyd);
	document.body.addEventListener('keydown', keyd);

    function hasFrame(){
        /**var iframe = document.querySelector('iframe');
        if(iframe == null){*/
            whichVideo = document.querySelector('bwp-video') != null ? document.querySelector('bwp-video') : document.querySelector('video');
        /**}else {
            whichVideo = iframe.contentWindow.document.body.querySelector('bwp-video') != null ? iframe.contentWindow.document.body.querySelector('bwp-video') : iframe.contentWindow.document.body.querySelector('video');
        }*/
        return whichVideo;
    }

    function hasFrame1(){
        var oldpara;
        /**var iframe = document.querySelector('iframe');
        if(iframe == null){*/
            oldpara = document.getElementById("speedshownow");
        /**}else {
            oldpara = iframe.contentWindow.document.body.getElementById("speedshownow");
        }*/
        return oldpara;
    }

	function roundFun(value, n) {
		return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
	}

	function addAndDelTil(element, tab, str) {
        var oldpara = hasFrame1();
        if(oldpara != null){
            oldpara.remove();
        }
		if (timeIds != null && timeIds.length > 0) {
            for(let timeid of timeIds) {
                clearTimeout(timeid);
            }
		}
		var para = document.createElement(tab);
        para.setAttribute("id","speedshownow")
		var node = document.createTextNode(str);
		para.appendChild(node);
		para.style.position = "absolute";
		para.style.color = "white";
		para.style.fontWeight = "bold";
		para.style.borderRadius = "15px";
		para.style.border = "2px solid #00a1d6";
		para.style.backgroundColor = "#00a1d6";
		para.style.padding = "1px";
		//可自行调整显示速度透明度0 - 1
		para.style.opacity = "0.8";
		para.style.fontFamily = "-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif";
		para.style.left = "1%";
		para.style.top = "1%";
		para.style.zIndex = 99999;
		element.parentNode.insertBefore(para,element);
		timeId = setTimeout(function () {
            var oldpara = hasFrame1();
            oldpara.remove();
            clearTimeout(timeId);
		}, 2000);
        timeIds.push(timeId);
	}
	// Your code here...
})();