// ==UserScript==
// @name         HTML5自动播放视频(Video Autoplay)
// @version      0.2
// @description  模拟Youtube效果，访问页面时自动播放<video>视频。
// @author       DKing
// @match        http://*/*
// @match        https://*/*
// @include      http://*/*
// @include      https://*/*
// @grant        none
// @namespace dking.com
// @downloadURL https://update.greasyfork.org/scripts/32560/HTML5%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%28Video%20Autoplay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/32560/HTML5%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%28Video%20Autoplay%29.meta.js
// ==/UserScript==

var videos = document.getElementsByTagName('video');

var wait4load = setInterval(function(){
        if(document.visibilityState == 'visible' && videos.length > 0){
            clearInterval(wait4load);
            for(var idx =0;i++;i< videos.length){
                videos[idx].play();
            }
        }
},200);
