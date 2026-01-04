// ==UserScript==
// @name         停止QQ空间的音乐
// @namespace    https://853lab.com
// @version      1.0.1
// @description  超烦。。。
// @author       Sonic853
// @match        *://user.qzone.qq.com/*
// @match        *://qzone.qq.com/*
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/383592/%E5%81%9C%E6%AD%A2QQ%E7%A9%BA%E9%97%B4%E7%9A%84%E9%9F%B3%E4%B9%90.user.js
// @updateURL https://update.greasyfork.org/scripts/383592/%E5%81%9C%E6%AD%A2QQ%E7%A9%BA%E9%97%B4%E7%9A%84%E9%9F%B3%E4%B9%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
setTimeout(function(){
var interval = setInterval(function(){
    var music = document.getElementById("tb_music_li");
    var musicbtn = music.getElementsByClassName("music-play")[0];
    if(musicbtn.getElementsByClassName("ui-icon")[0].classList.contains("ico-music-stop")){
        musicbtn.click();
        clearInterval(interval);
    }else{
        musicbtn.click();
    }
}, 1000);
}, 2000);
})();