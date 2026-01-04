// ==UserScript==
// @name         2022贵州公需课-自动播放插件
// @include      http://*.gzjxjy.gzsrs.cn/*
// @version      1.0
// @description  autoplay
// @author       hui
// @match        http://*.gzjxjy.gzsrs.cn/*
// @grant        none
// @namespace https://greasyfork.org/users/917475
// @downloadURL https://update.greasyfork.org/scripts/448346/2022%E8%B4%B5%E5%B7%9E%E5%85%AC%E9%9C%80%E8%AF%BE-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/448346/2022%E8%B4%B5%E5%B7%9E%E5%85%AC%E9%9C%80%E8%AF%BE-%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
window.onload = function () {
  try {
    setInterval(() => {
      document.querySelector("video").playbackRate =6;
    }, 3 * 1000);

  } catch (error) {}
};
setInterval(function(){
    var course = document.getElementsByClassName("el-steps el-steps--vertical")[0]
    var list = course.getElementsByTagName("p")
    var i
    for (i = 0; i < list.length; i++){
        //定位当前课程
        if (list[i].className == "title-step" && list[i].innerText.indexOf("目录") == -1){
            //console.log(list[i].innerText)
            //console.log(i)
            var course_action=document.getElementsByClassName("el-step is-vertical active")[0].innerText
            if(list[i].innerText==course_action){
            var current_course = i;
           }
        }
    }
    //当前课程播放完成
    if (list[current_course].innerText.indexOf("已学完") != -1){
        //防止点击章节名
        //if(list[current_course+1].innerText.indexOf("%") == -1){
           // list[current_course+2].click()
       // }else{
            list[current_course+1].click()
       // }
    }
    //自动播放检测
    var oldtime=document.querySelector("video").currentTime
      setTimeout(function(){
      var newtime=document.querySelector("video").currentTime;
      if(newtime==oldtime){
      document.querySelector("video").play();
      }
    },2000)
    //防挂机确定
    var autotrue=document.getElementsByClassName("el-button el-button--primary")[0]
    if(autotrue!=null){
        if(autotrue.innerText=="确 定"){
            autotrue.click();
        }
    }
},8000)
