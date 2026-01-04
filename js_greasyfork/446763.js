// ==UserScript==
// @name         湖南师范公需科目学习助手
// @namespace    https://www.ejxjy.com/
// @version      0.6
// @description  无
// @author       hui
// @match        https://www.ejxjy.com/a/sys/portal/myCourseDetail.html?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446763/%E6%B9%96%E5%8D%97%E5%B8%88%E8%8C%83%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446763/%E6%B9%96%E5%8D%97%E5%B8%88%E8%8C%83%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //自动获取所有课程链接
    var links = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.ejxjy.com/a/sys/portal/person");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var text = xhr.responseText.replace(/\s/g,""); //去除特殊符号
            text = text.match(/con_a_2.+con_a_3/g); //待学习
            links = text[0].match(/myCourseDetail\.html\?courseId=.{32}/g); //匹配网址
            console.log(links.toString(),links.length);
        }
    }

    //定时执行
    window.setInterval(function() {

        var Video = document.getElementsByTagName("video")[0]; //选择video对象
        //课程完成弹窗，播放时间完成
        if (document.getElementsByClassName("jbox-border").length > 0 || Video.duration <= Video.currentTime) {
            var url = window.location.href.match(/myCourseDetail\.html\?courseId=.{32}/g)[0]; //当前URL去除后缀
            var dl = document.getElementsByTagName("dl"); //视频列表，根据背景颜色，判断列表是否已播放
            if (dl[dl.length - 1].outerHTML.indexOf("background-color:#21c703;") > -1 && links.length > 0) {
                url = links[links.indexOf(url) + 1]; //取当前url在links中的下一个
            }
            //window.location.reload() //刷新页面
            window.location.href ="https://www.ejxjy.com/a/sys/portal/" + url;
        }else {
            console.log(new Date().toTimeString(), Video.currentTime, Video.duration); //打印信息
            document.getElementById("one1").click(); //点击（保持页面活动）
        }

    }, 20000)

})();