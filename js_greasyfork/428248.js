// ==UserScript==
// @name         智播客课程助手
// @namespace    yu.com
// @version      0.1
// @description  一键跳过视频播放，适用于传智播客的在线课程视频
// @author       hhyygg2009
// @match        http://stu.ityxb.com/preview/detail/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/428248/%E6%99%BA%E6%92%AD%E5%AE%A2%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/428248/%E6%99%BA%E6%92%AD%E5%AE%A2%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function skip() {
        const video = document.getElementsByTagName('video')[0]
        if (video != null) {            
            video.play()
            video.currentTime = video.duration - 6
        } else {
            GM_log("找不到视频")
        }
    }

    function addBtn() {
        GM_log("自动跳过已就绪")
        var button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("value", '跳过')
        button.addEventListener('click', skip)
        //document.body.appendChild(button)
        document.getElementsByClassName("course-name")[0].appendChild(button)
    }
    addBtn()

})();