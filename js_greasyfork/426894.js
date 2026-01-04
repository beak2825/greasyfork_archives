// ==UserScript==
// @name         我的南京专业课【自动播放】
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  打开视频播放页面后即可自动完成所有课程
// @author       艾思继续教育
// @match        http://180.101.236.114:8283/rsrczxpx/tec/play/player?cpcwid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426894/%E6%88%91%E7%9A%84%E5%8D%97%E4%BA%AC%E4%B8%93%E4%B8%9A%E8%AF%BE%E3%80%90%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/426894/%E6%88%91%E7%9A%84%E5%8D%97%E4%BA%AC%E4%B8%93%E4%B8%9A%E8%AF%BE%E3%80%90%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E3%80%91.meta.js
// ==/UserScript==

//公需课考试工具 http://www.51shuake.top/?p=398
setTimeout(function(){
  var per = $('.learnpercent').text().trim();
  if(per == "学习进度：已完成"){
    next();
  }
},5000);


  function next() { 
                    var n = document.querySelectorAll(".append-plugin-tip a")[1]
                    if (n) {
                        n.click()
                    } else {
                        alert("全部看完了")
                    }
                }