// ==UserScript==
// @name        superchutou出头科技 九江学院、九江科技学院，湘潭大学,湖南农业大学以及所有出头科技自动下一集,协议版本支持自动做作业!
// @namespace    superchutou
// @version      1.0
// @description  superchutou.com自动观看所有视频,协议版本支持目前已经支持所有学校!
// @author       superchutou
// @match       http://*.superchutou.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/512015/superchutou%E5%87%BA%E5%A4%B4%E7%A7%91%E6%8A%80%20%E4%B9%9D%E6%B1%9F%E5%AD%A6%E9%99%A2%E3%80%81%E4%B9%9D%E6%B1%9F%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%EF%BC%8C%E6%B9%98%E6%BD%AD%E5%A4%A7%E5%AD%A6%2C%E6%B9%96%E5%8D%97%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E4%BB%A5%E5%8F%8A%E6%89%80%E6%9C%89%E5%87%BA%E5%A4%B4%E7%A7%91%E6%8A%80%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86%2C%E5%8D%8F%E8%AE%AE%E7%89%88%E6%9C%AC%E6%94%AF%E6%8C%81%E8%87%AA%E5%8A%A8%E5%81%9A%E4%BD%9C%E4%B8%9A%21.user.js
// @updateURL https://update.greasyfork.org/scripts/512015/superchutou%E5%87%BA%E5%A4%B4%E7%A7%91%E6%8A%80%20%E4%B9%9D%E6%B1%9F%E5%AD%A6%E9%99%A2%E3%80%81%E4%B9%9D%E6%B1%9F%E7%A7%91%E6%8A%80%E5%AD%A6%E9%99%A2%EF%BC%8C%E6%B9%98%E6%BD%AD%E5%A4%A7%E5%AD%A6%2C%E6%B9%96%E5%8D%97%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E4%BB%A5%E5%8F%8A%E6%89%80%E6%9C%89%E5%87%BA%E5%A4%B4%E7%A7%91%E6%8A%80%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86%2C%E5%8D%8F%E8%AE%AE%E7%89%88%E6%9C%AC%E6%94%AF%E6%8C%81%E8%87%AA%E5%8A%A8%E5%81%9A%E4%BD%9C%E4%B8%9A%21.meta.js
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