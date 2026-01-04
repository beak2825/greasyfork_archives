// ==UserScript==
// @name        NTP专升本自动刷课
// @namespace   Violentmonkey Scripts
// @match       http://www.zjnep.com/lms/web/course/*
// @match       http://zjnep.com/lms/web/course/*
// @grant       none
// @version     1.1
// @author      -
// @description 2021/12/16 上午10:19:46
// @downloadURL https://update.greasyfork.org/scripts/437122/NTP%E4%B8%93%E5%8D%87%E6%9C%AC%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/437122/NTP%E4%B8%93%E5%8D%87%E6%9C%AC%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
window.onload = function(){
    console.log("脚本开始执行")
            document.querySelectorAll("video")[0].muted = true;
  function jt(){
      if(document.getElementById("job_mask").getAttribute("style") != "display: block;"){
          console.log("没有触发");
          //自动点击下一章
          //自动点击开始播放
          document.getElementById("job_nextvideo_btn").click();
          document.getElementsByClassName("vjs-big-play-button")[0].click();
      }else{
          console.log("触发啦!");
          clearInterval(time1);
          //开始答题
          let all_radio  = document.getElementsByClassName("radio");
          for(let i =0;i<all_radio.length;i++){
              let find_dom = all_radio[i];
              if(find_dom.getAttribute("class").indexOf("gray") == -1){
                  find_child = find_dom.firstElementChild;
                  
                  if(find_child.getAttribute("flag") == "Y"){
                      console.log(find_child)
                      find_child.click()
                  }
              }
          }
  
          let all_check   = document.getElementsByClassName("check");
          for(let i =0;i<all_check.length;i++){
              let find_dom = all_check[i];
              if(find_dom.getAttribute("class").indexOf("gray") == -1){
                  find_child = find_dom.firstElementChild;
                  if(find_child.getAttribute("flag") == "Y"){
                      console.log(find_child)
                      find_child.click()
                  }
              }
          }
          //提交
          document.getElementById("job_quizsub").click();
          document.getElementById("job_quizfinish").click();
          //继续监听
          time1 = setInterval(jt,3000)
      }
      
  }
  let time1 = setInterval(jt,3000)
  }
  