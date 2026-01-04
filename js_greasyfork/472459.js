// ==UserScript==
// @name        【superchutou】【出头科技】九江学院、河北劳动，湘南学院以及所有出头科技自动下一集,自动做作业。
// @namespace    青书学起联大麦能小助手
// @version      1.0
// @description  superchutou.com自动观看所有视频,答题目前已经支持所有学校!
// @author       小助手
// @match       http://*.superchutou.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472459/%E3%80%90superchutou%E3%80%91%E3%80%90%E5%87%BA%E5%A4%B4%E7%A7%91%E6%8A%80%E3%80%91%E4%B9%9D%E6%B1%9F%E5%AD%A6%E9%99%A2%E3%80%81%E6%B2%B3%E5%8C%97%E5%8A%B3%E5%8A%A8%EF%BC%8C%E6%B9%98%E5%8D%97%E5%AD%A6%E9%99%A2%E4%BB%A5%E5%8F%8A%E6%89%80%E6%9C%89%E5%87%BA%E5%A4%B4%E7%A7%91%E6%8A%80%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86%2C%E8%87%AA%E5%8A%A8%E5%81%9A%E4%BD%9C%E4%B8%9A%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/472459/%E3%80%90superchutou%E3%80%91%E3%80%90%E5%87%BA%E5%A4%B4%E7%A7%91%E6%8A%80%E3%80%91%E4%B9%9D%E6%B1%9F%E5%AD%A6%E9%99%A2%E3%80%81%E6%B2%B3%E5%8C%97%E5%8A%B3%E5%8A%A8%EF%BC%8C%E6%B9%98%E5%8D%97%E5%AD%A6%E9%99%A2%E4%BB%A5%E5%8F%8A%E6%89%80%E6%9C%89%E5%87%BA%E5%A4%B4%E7%A7%91%E6%8A%80%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86%2C%E8%87%AA%E5%8A%A8%E5%81%9A%E4%BD%9C%E4%B8%9A%E3%80%82.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
 
    // $('body > div.video_box > div.el_video').html(' ');
 
     setInterval(function () {
        获得看的集数();
        检测播放完毕();
 
    }, 1000);
 
     setInterval(function () {
        点了个继续();
    }, 2000);
 
 
    function 检测播放完毕() {
        var player = $('#CuPlayer>object')[0];
        if (player.j2s_stayInVideoTime() > 0) {
            if (player.j2s_getDuration() > 0) {
                if (player.j2s_getCurrentTime() === 0) {
                    下一个视频();
                    clearInterval(lo);
                }
            }
        }
 
    }
 
    function 点了个继续() {
        $('a.layui-layer-btn0').click();
 
    }
 
 
    function 下一个视频() {
        var 下一集 = (parseInt(localStorage.集数) + 1);
        console.log(下一集);
        $("a:contains('第" +
            下一集 +
            "讲')").click();
    }
 
 
    function 获得看的集数() {
        var 你看的第几集;
        你看的第几集 = $("span[class='stdueing']").parent().find('a').html();
        你看的第几集 = 你看的第几集.split(/[第讲]/)[1];
        if (你看的第几集 !== undefined && 你看的第几集 > 0) {
            localStorage.集数 = 你看的第几集;
        } else return 0;
 
    }
 
 
 
 
 
})();