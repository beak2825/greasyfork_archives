// ==UserScript==
// @name         郑州专业技术-vip版本
// @namespace    www.163.com
// @version      0.1
// @description  郑州专业技术-刷课
// @author       111
// @match        *://*.hnhhlearning.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391288/%E9%83%91%E5%B7%9E%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF-vip%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/391288/%E9%83%91%E5%B7%9E%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF-vip%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var course = document.getElementsByClassName("rightnav cursor-p")[0]
    var list = course.getElementsByTagName("li")
    var i
    setInterval(function(){
        for (i = 0; i < list.length; i++){
            if (list[i].className == "active" && list[i].innerText.indexOf("目录") == -1){
                console.log(list[i].innerText)
                var current_course = i
                }
        }
        //当前课程播放完成
        if (list[current_course].innerText.indexOf("100%") != -1){
            if(list[current_course+1].innerText.indexOf("%") == -1){
                list[current_course+2].click()
            }else{
                list[current_course+1].click()
            }
            location.reload();
        }
        window.s2j_onVideoPlay()
    },1000)
})();