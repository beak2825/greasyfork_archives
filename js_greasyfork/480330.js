// ==UserScript==
// @name         城市科技学院仓辉实训视频自动播放脚本（已增加倍速功能，默认设置2倍）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  仅供学习js脚本的基本操作，请勿用于其他用途！！！
// @author       tui
// @match        https://kkzxsx.cqcst.edu.cn/course/*
// @icon         https://pic.imgdb.cn/item/655acdf2c458853aef774c74.png
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480330/%E5%9F%8E%E5%B8%82%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%E4%BB%93%E8%BE%89%E5%AE%9E%E8%AE%AD%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC%EF%BC%88%E5%B7%B2%E5%A2%9E%E5%8A%A0%E5%80%8D%E9%80%9F%E5%8A%9F%E8%83%BD%EF%BC%8C%E9%BB%98%E8%AE%A4%E8%AE%BE%E7%BD%AE2%E5%80%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/480330/%E5%9F%8E%E5%B8%82%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%E4%BB%93%E8%BE%89%E5%AE%9E%E8%AE%AD%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC%EF%BC%88%E5%B7%B2%E5%A2%9E%E5%8A%A0%E5%80%8D%E9%80%9F%E5%8A%9F%E8%83%BD%EF%BC%8C%E9%BB%98%E8%AE%A4%E8%AE%BE%E7%BD%AE2%E5%80%8D%EF%BC%89.meta.js
// ==/UserScript==

(function() {
     console.log('进入 **自动播放/静音/后台播放** 油猴脚本');
     setInterval(function(){
         var speed = 2.0;//设置倍数，当倍数过高可能导致进度无法记录，谨慎设置！！！
		 var target_play;
		 var divs = document.getElementsByClassName('item flex-row');
		 var i,i_active;
		 var video = document.getElementsByClassName("vjs-tech")[0];
         video.muted = true;
         var sta = 0;
		 for(i=0;i<divs.length;i++){
			let i_play = divs[i].childElementCount;
			if(i_play==2&&sta==0){
				i_active = i+1;
				divs[i].click();
				video.muted = true;
                sta = 1;
			}
		 }
         if(sta == 0){
             divs[i-1].click();
             console.log("所有视频播放完成！！！");
             video.pause();
         }else{
             console.log("当前视频进度："+((video.currentTime/video.duration)*100).toFixed(2)+"%");
             target_play = divs[i_active];
             if(video.currentTime==video.duration&&target_play){
                 if(i_active==divs.length){
                     console.log("视频播放完成！！！");
                 }else{
                     target_play.click();
                 }
             }else if(video.currentTime<video.duration){
                 if(video.paused){
                     video.muted = true;
                     video.playbackRate = speed;
                     video.play(1);
                     console.log("视频播放中！");
                 }
             }
         }
     }, 4000);
})();