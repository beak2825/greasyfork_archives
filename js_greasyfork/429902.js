// ==UserScript==
// @name         自动播放插件
// @include      http://www.gzjxjy.gzsrs.cn
// @include      https://www.gzjxjy.gzsrs.cn
// @version      1.2
// @description  autoplay
// @author       Jos
// @match        http://www.gzjxjy.gzsrs.cn/personback/#/learning?id=1409765570891055105
// @match        http://www.gzjxjy.gzsrs.cn/personback/#/learning?id=1409765570891055105
// @match        https://www.gzjxjy.gzsrs.cn/personback/#/learning?id=1409765570891055105
// @match        https://www.gzjxjy.gzsrs.cn/personback/#/learning?id=1409765570891055105
// @grant        none
// @namespace http://www.gzjxjy.gzsrs.cn/personback/#/learning?id=1409765570891055105
// @downloadURL https://update.greasyfork.org/scripts/429902/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/429902/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


var course = document.getElementsByClassName("rightnav cursor-p")[0]
var list = course.getElementsByTagName("li")
var i
setInterval(function(){
    for (i = 0; i < list.length; i++){
        //定位当前课程
        if (list[i].className == "active" && list[i].innerText.indexOf("目录") == -1){
            console.log(list[i].innerText)
            console.log(i)
            var current_course = i
        }
    }
    //当前课程播放完成
    if (list[current_course].innerText.indexOf("100%") != -1){
        //防止点击章节名
        if(list[current_course+1].innerText.indexOf("%") == -1){
            list[current_course+2].click()
        }else{
            list[current_course+1].click()
        }
    }
},2000)
