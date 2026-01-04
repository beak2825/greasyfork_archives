// ==UserScript==
// @name         教师研修助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  适用于教师研修网，暂停时自动继续播放，完成时自动切换下一视频，2021.05.26亲测有效
// @author       Ccc
// @icon         http://i.yanxiu.com/favicon.ico
// @match        *://i.yanxiu.com/uft/course/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427033/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/427033/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var playButton = document.getElementsByClassName('vjs-control-bar')[0].childNodes[0];
    setInterval(function() {
        //检测视频是否暂停播放并自动继续播放
        if (playButton && playButton.title === 'Play')
		{
			playButton.click()
		}
        //检查是否播放完毕，完毕则切换下一个视频
        if (playButton && playButton.title === 'Replay')
		{
            var videos = document.getElementsByClassName('doc_tit video');
            var currentVideo = document.getElementsByClassName('doc_tit video click video_focus');
            var currentIndex = 0;
            var video;
            var index;

          for(var i= 0;i< videos.length;i++)
          {
               if(videos[i].getAttribute("href") === currentVideo[0].getAttribute("href"))
            {
                    currentIndex = i;
                    break;

            }

          }


            currentIndex++;
            currentIndex = currentIndex < videos.length ? currentIndex : 0;
            videos[currentIndex].click();
        }
    }, 5000);
})();