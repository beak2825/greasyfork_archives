// ==UserScript==
// @name        自动下一集
// @namespace    http://pansx.net/
// @version      1.0
// @description  自动下一个视频!
// @author       pansx
// @match       http://www2.hunan.superchutou.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38880/%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/38880/%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // $('body > div.video_box > div.el_video').html(' ');

    var lo = setInterval(function () {
        获得看的集数();
        检测播放完毕();

    }, 1000);

    var lo2 = setInterval(function () {
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
            console.log(你看的第几集);
            localStorage.集数 = 你看的第几集;
        } else return 0;

    }




    
    
})();