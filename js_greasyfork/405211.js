// ==UserScript==
// @name         太和县人力资源和社会保障局平台刷课脚本
// @namespace    https://greasyfork.org/zh-CN/scripts/405210-%E5%A4%AA%E5%92%8C%E5%8E%BF%E4%BA%BA%E5%8A%9B%E8%B5%84%E6%BA%90%E5%92%8C%E7%A4%BE%E4%BC%9A%E4%BF%9D%E9%9A%9C%E5%B1%80%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC
// @version      0.2
// @description  这是一个 太和县人力资源和社会保障局继续教育平台 自动刷课的小脚本，主要代码就几行
// @author       Allen
// @match        *://*.59iedu.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/405211/%E5%A4%AA%E5%92%8C%E5%8E%BF%E4%BA%BA%E5%8A%9B%E8%B5%84%E6%BA%90%E5%92%8C%E7%A4%BE%E4%BC%9A%E4%BF%9D%E9%9A%9C%E5%B1%80%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/405211/%E5%A4%AA%E5%92%8C%E5%8E%BF%E4%BA%BA%E5%8A%9B%E8%B5%84%E6%BA%90%E5%92%8C%E7%A4%BE%E4%BC%9A%E4%BF%9D%E9%9A%9C%E5%B1%80%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var confirm = function () {
        return true;
    };
    window.confirm = function () {
        return true;
    };
    var lists = new Array();
    var ssss = "";
    if (window.location.href.indexOf("http://xy.59iedu.com/Course/MyCourse/Index") != -1) {
        var chapters = document.getElementsByTagName("img")
        for (var i = 0; i < chapters.length; i++) {
            if (chapters[i].src.indexOf("xkarrowone.gif") != -1) {
                chapters[i].click()
            }
        }
        //在课程学习页面，获取所有链接
        window.setTimeout(function () {
            var links = document.getElementById("tabsLearning").getElementsByTagName("a")
            for (let i = 0; i < links.length; i++) {
                var url = links[i].getAttribute("href");
                if (url.indexOf("medId") != -1 && url != null){
                    console.log('正在采集学习网址：' + url);
                    lists.push(url)
                }
                //alert(lists)
            }
            GM_setValue('lists', lists);

            var new_url = lists[0];
            console.log('即将开始学习：' + new_url);
            window.location.href = "http://xy.59iedu.com" + lists[0];


        }, 3000);

    }

    window.setTimeout(function () {
        setInterval(function () {
            //判断是否需要 跳转到下一节
            var current_course
            var current_medId

            var lists = GM_getValue('lists',[]);
            var progress = document.getElementById("div_ProgressBar_value").innerHTML;
            console.log('当前学习网址：' + window.location.href + ' 当前学习进度：' + progress);

            if (progress == "100%") {
                var now_id = window.location.href.split("&medId=")[1]
                console.log('当前学习课程号：' + now_id);
                console.log(lists);

                for (var i =0; i < lists.length;i++){
                    var s = lists[i];
                    if (s == null) {
                        continue;
                    }
                    console.log('正在检测学习网址：' + s);
                    var index = s.indexOf(now_id)
                    console.log('当前学习网址索引：' + index);
                    if (index >= 0){
                        delete lists[i];
                        GM_setValue('lists', lists);
                        console.log('删除当前学习网址：' + window.location.href);
                        break
                    }

                }


                for (var j=0;j<lists.length;j++){
                    var ss = lists[j];
                    if (ss != null){
                        console.log('跳转到新的学习网址：'+ ss);
                        window.location.href = "http://xy.59iedu.com" + ss;
                        break;
                    }
                }


            }
        }, 2000)
    }, 4000);

})();