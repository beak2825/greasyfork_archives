// ==UserScript==
// @name         B站视频倍速调整0.05±
// @namespace    chutung
// @version      1.0
// @description  调整B站视频播放速度(支持0.05间隔)
// @author       chutung
// @match        https://www.bilibili.com/*
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/medialist/play/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/537526/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%B0%83%E6%95%B4005%C2%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/537526/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%B0%83%E6%95%B4005%C2%B1.meta.js
// ==/UserScript==

var controller = (function () {
    var timeId;
    var speed = GM_getValue('bilibili_custom_speed', 1.0); // 从存储中读取倍速，默认1.0
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
            if (speed < 16) {
                speed = speed + 0.05;
                speed = roundFun(speed, 2);
                updateSpeed(speed);
            }
        } else if (e.key == "-") {
            if (speed > 0.05) { // 最低0.05倍速
                speed = speed - 0.05;
                speed = roundFun(speed, 2);
                updateSpeed(speed);
            }
        }

        if(flag){
            if(videos != null && videos.length > 0 || fjvideos != null && fjvideos.length > 0){
                observer.observe(videowrap, config);
                flag = false;
            }
        }
    }

    function updateSpeed(newSpeed) {
        var str = "播放速度：" + newSpeed + "x";
        addAndDelTil(whichVideo, "div", str);
        whichVideo.playbackRate = newSpeed;
        GM_setValue('bilibili_custom_speed', newSpeed); // 保存倍速到本地存储
    }

    document.body.removeEventListener('keydown', keyd);
    document.body.addEventListener('keydown', keyd);

    function hasFrame(){
        whichVideo = document.querySelector('bwp-video') != null ? document.querySelector('bwp-video') : document.querySelector('video');
        return whichVideo;
    }

    function hasFrame1(){
        var oldpara = document.getElementById("speedshownow");
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
        para.style.opacity = "0.8";
        para.style.fontFamily = "-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif";
        para.style.left = "1%";
        para.style.top = "1%";
        para.style.zIndex = 99999;
        element.parentNode.insertBefore(para,element);
        timeId = setTimeout(function () {
            var oldpara = hasFrame1();
            if(oldpara) oldpara.remove();
            clearTimeout(timeId);
        }, 2000);
        timeIds.push(timeId);
    }
	// Your code here...
})();