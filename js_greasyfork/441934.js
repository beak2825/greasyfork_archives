// ==UserScript==
// @name         music_163_Playlist_Cumulative_duration
// @namespace    jarzhen@163.com
// @version      1.0
// @description  PC网页登录网易云音乐，点开歌单，点击歌单列表中[时长]列标题，网页弹出该歌单累计时长。设计初衷是睡前歌单要完整的听完一个歌单，奈何手机播放歌曲时没有【列表一遍】的选项，只有【单曲循环】、【随机播放】、【列表循环】三个选项，有了这个歌单的累计时长再加上一个倒计时播放，即可实现【列表一遍】的播放享受。
// @author       jiazhen
// @require      http://cdn.jsdelivr.net/npm/jquery@3.4.1
// @match        *://music.163.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441934/music_163_Playlist_Cumulative_duration.user.js
// @updateURL https://update.greasyfork.org/scripts/441934/music_163_Playlist_Cumulative_duration.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.onload = function(){
        function calc(){
          var arr = [];
          $(window.top.document.getElementById('g_iframe').contentWindow.document.body).find("tr span.u-dur.candel").each(function(i){
            arr.push($(this).text());
          })
          var min = 0;
          var sec = 0;
          for (let t in arr){
            min+=Number(arr[t].split(":")[0]);
            sec+=Number(arr[t].split(":")[1]);
          }
          if(sec>=60){
            min+=parseInt(sec/60);
            sec=sec%60;
          }
          window.alert("歌单累计时长[分:秒]:["+min+":"+sec+"]");
        }
        $(window.top.document.getElementById('g_iframe').contentWindow.document.body).find("div.wp.af1").parent("th").on("click", calc);
    }
})();