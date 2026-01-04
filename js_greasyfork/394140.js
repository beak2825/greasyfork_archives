// ==UserScript==
// @name         山西临汾专业技术人员继续教育平台刷课-自动下一节
// @namespace
// @version      0.1
// @description  山西临汾专技在线脚本
// @author       雪上蓝冰
// @match        *://*.zgzjzj.com/*

// @grant        none
// @namespace https://greasyfork.org/users/399821
// @downloadURL https://update.greasyfork.org/scripts/394140/%E5%B1%B1%E8%A5%BF%E4%B8%B4%E6%B1%BE%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE-%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/394140/%E5%B1%B1%E8%A5%BF%E4%B8%B4%E6%B1%BE%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE-%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82.meta.js
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
                console.log(i)
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
        }
    },2000)


})();