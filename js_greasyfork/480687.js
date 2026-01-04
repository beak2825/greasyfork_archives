// ==UserScript==
// @name         西南交大中国精神刷课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  西南交大慕课中国精神自动播放!
// @author       fdm
// @match        http://yz.swjtu.edu.cn/mooc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swjtu.edu.cn
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/480687/%E8%A5%BF%E5%8D%97%E4%BA%A4%E5%A4%A7%E4%B8%AD%E5%9B%BD%E7%B2%BE%E7%A5%9E%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/480687/%E8%A5%BF%E5%8D%97%E4%BA%A4%E5%A4%A7%E4%B8%AD%E5%9B%BD%E7%B2%BE%E7%A5%9E%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function timeout1() {
        if ($(".prism-big-play-btn").length) {
            $("#courseTitle").append('<button id="btn1">自动刷课</button>').click(mains).css('color', '#fab')
             setTimeout(mains, 1000)
        } else { setTimeout(timeout1, 500) }
    }
    function mains() {
        $("#btn1").click(function () {})
        $("#courseTitle button").text("自动刷课中。。。")
        $(".prism-big-play-btn:not(.playing)").click()
        $(".prism-setting-item .setting-title").click()
        $(".prism-speed-selector > ul.selector-list li:last span").click()
        setTimeout(timeout2, 3000)
        let i = $("div.player-wrapper div.info > span > p ").index($("p").parent(":not([style *= 'display:none'])").children("p[style *= '#ffffff']"))
            console.log("一共" + $("div.player-wrapper div.info > span > p ").size())
            console.log("当前" + i)
    }
    function timeout2() {
        if ($(".prism-big-play-btn.pause").length) {
            let i = $("div.player-wrapper div.info > span > p ").index($("p").parent(":not([style *= 'display:none'])").children("p[style *= '#ffffff']"))
            if (i + 1 == $("div.player-wrapper div.info > span > p ").size()){
                console.log('搞完了')
            }else{$("div.player-wrapper div.info > span > p:eq("+ (i + 1) +") span").click()}
        } else { setTimeout(timeout2, 1000) }
    }
    timeout1()
    return 111
})();