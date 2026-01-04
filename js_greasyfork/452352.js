// ==UserScript==
// @name         自动点击天猫主图视频关闭按钮
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  点击视频关闭按钮，以跳过视频自动播放
// @author       xingyu
// @match        https://detail.tmall.com/*
// @icon         https://www.google.com/s2/favicons?domain=taobao.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/452352/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%A4%A9%E7%8C%AB%E4%B8%BB%E5%9B%BE%E8%A7%86%E9%A2%91%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/452352/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%A4%A9%E7%8C%AB%E4%B8%BB%E5%9B%BE%E8%A7%86%E9%A2%91%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $(() => {
        console.log("引入完成")
        var i = 0
        //定义变量jiance，设置循环延迟，每500毫秒检测一次答题卡是否出现
        let jiance = setInterval(() => {

            //循环20次，20次后还未找到，则退出循环
            i++;
            console.log("第" + i + "次检测")
            if (i > 19) {
                //清除延迟
                clearInterval(jiance)
            }



            var btn_gb = $('#J_DetailMeta > div.tm-clear > div.tb-gallery > div.tb-booth > i.tm-video-stop.J_stopVideo > s');
            //判断关闭按钮是否存在
            console.log("视频关闭按钮" + btn_gb.length);
            //如果按钮不=0，则清除延迟，进行点击

            if (btn_gb.length > 0) {
                //清除延迟
                clearInterval(jiance)
                document.querySelector('#J_DetailMeta > div.tm-clear > div.tb-gallery > div.tb-booth > i.tm-video-stop.J_stopVideo > s').click();
                console.log("点击关闭按钮完成");
            }

            //点击第二张主图以跳过视频自动播放
            var btn_gb2 = $('div.BasicContent--mainPic--2v9ooiI > div > ul > li:nth-child(2)');
            //判断关闭按钮是否存在
            console.log("第二张主图" + btn_gb2.length);
            //如果按钮不=0，则清除延迟，进行点击

            if (btn_gb2.length > 0) {
                //清除延迟
                clearInterval(jiance)
                document.querySelector('div.BasicContent--mainPic--2v9ooiI > div > ul > li:nth-child(2)').click();
                console.log("点击第二张主图完成");
            }
        }, 500);
    })
    // Your code here...
})
();