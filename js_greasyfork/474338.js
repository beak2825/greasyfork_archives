// ==UserScript==
// @name        🔥🔥贵州省专业技术人员继续教育平台终极版刷课脚本|10倍速刷课时脚本|自动跳过已完成的视频|解除防挂机提示|静音播放|超稳定
// @namespace   🔥🔥自动跳过已经学完的视频，自动点击防挂机提示，直至刷完课程，全程自动化。
// @match       http://www.gzjxjy.gzsrs.cn/*
// @match       https://www.gzjxjy.gzsrs.cn/*
// @version     1.1
// @author      Be brave
// @license     
// @description 贵州省专业技术人员继续教育全自动刷课时脚本
// @downloadURL https://update.greasyfork.org/scripts/474338/%F0%9F%94%A5%F0%9F%94%A5%E8%B4%B5%E5%B7%9E%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E7%BB%88%E6%9E%81%E7%89%88%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%7C10%E5%80%8D%E9%80%9F%E5%88%B7%E8%AF%BE%E6%97%B6%E8%84%9A%E6%9C%AC%7C%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B7%B2%E5%AE%8C%E6%88%90%E7%9A%84%E8%A7%86%E9%A2%91%7C%E8%A7%A3%E9%99%A4%E9%98%B2%E6%8C%82%E6%9C%BA%E6%8F%90%E7%A4%BA%7C%E9%9D%99%E9%9F%B3%E6%92%AD%E6%94%BE%7C%E8%B6%85%E7%A8%B3%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/474338/%F0%9F%94%A5%F0%9F%94%A5%E8%B4%B5%E5%B7%9E%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E7%BB%88%E6%9E%81%E7%89%88%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%7C10%E5%80%8D%E9%80%9F%E5%88%B7%E8%AF%BE%E6%97%B6%E8%84%9A%E6%9C%AC%7C%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B7%B2%E5%AE%8C%E6%88%90%E7%9A%84%E8%A7%86%E9%A2%91%7C%E8%A7%A3%E9%99%A4%E9%98%B2%E6%8C%82%E6%9C%BA%E6%8F%90%E7%A4%BA%7C%E9%9D%99%E9%9F%B3%E6%92%AD%E6%94%BE%7C%E8%B6%85%E7%A8%B3%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //window.onload = function(){//所有DOM元素加载完成后执行

    let videoIndex = 0; 
    
    //播放视频，添加倍数，破解防挂机提示
    function playVideo() {
        let videoTitles = document.querySelectorAll('.step-title');
        if (videoTitles.length > 0 && videoIndex < videoTitles.length) {
			if (!videoTitles[videoIndex].nextSibling.className){
				videoTitles[videoIndex].click();
			}
			else{
				if (videoIndex < videoTitles.length){
					videoIndex += 1;
					playVideo();
				}
				else {
					videoIndex = 0;
                    playVideo();
				}
			}
            setTimeout(function() {
                let videos = document.getElementsByTagName('video');
                for (let i = 0; i < videos.length; i++) {
                    videos[i].playbackRate = 10; 
                    videos[i].onended = function() {
                        videoIndex += 1;
                        if (videoIndex < videoTitles.length) {
                            playVideo();
                        } else {
                            videoIndex = 0;
                            playVideo();
                        }
                    }
                    if (videos[i].paused) {
                        videos[i].play();
                    }
                }
            }, 2000);

			setTimeout(function(){
				let isButton = document.getElementsByClassName("el-dialog__wrapper");
				if (isButton[0]){
					isButton[0].getElementsByTagName("button")[0].click();
				}
			},2000)

        }
    }

    //添加视频控件
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                var videos = document.getElementsByTagName('video');
                for (var i = 0; i < videos.length; i++) {
                    var video = videos[i];
                    video.setAttribute('autoplay', true);
                    video.setAttribute('muted', true); 
                    video.muted = true;
                    video.addEventListener('visibilitychange', function() {
                        if (document.visibilityState === 'hidden') {
                            video.play();
                        }
                    }, false);
                }
            }
        });
    });

    observer.observe(document, { childList: true, subtree: true });
    //2秒后执行
    setTimeout(playVideo, 2000);
//}
})();