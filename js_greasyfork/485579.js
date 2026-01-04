// ==UserScript==
// @name         传智播客预习
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  可以完成传智播客预习的视频，题目暂时不可以
// @author       2454988619@qq.com
// @match        https://stu.ityxb.com/preview/detail/*
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/485579/%E4%BC%A0%E6%99%BA%E6%92%AD%E5%AE%A2%E9%A2%84%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/485579/%E4%BC%A0%E6%99%BA%E6%92%AD%E5%AE%A2%E9%A2%84%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.addEventListener('load', function() {
    let video = $(".point-item-box")
let sum = video.length //总共节点
let cur = $(".playing-status").parent().index() //进入先获取当前位置

let cName = document.querySelector('#videoPlayer div div').className.split('controlbgbar')[1]

$(`.playbackratep${cName} p`)[0].click() //二倍速
$(`.mute${cName}`).click() // 静音

//依次点击视频节点
let timer = null
timer = setInterval(a, 2000)


//判断章节是否完成
function a () {
  video[cur].click()
  cName = document.querySelector('#videoPlayer div div').className.split('controlbgbar')[1]

  if (video[cur].querySelector('.point-progress-box').innerHTML == '100%') {

  } else if ($(`.play${cName}`)[0].style.display == 'block') { //点击播放  为true暂停
    setTimeout(() => {
      $(`.mute${cName}`).click() // 静音
      $(`.play${cName}`).click() // 播放
    }, 1000)
    clearInterval(timer)
    ifResult()
  }
  cur++
  if (cur == sum) {
    clearInterval(timer)
  }
}


//判断视频是否看完
let pass = null
function ifResult () {
  pass = setInterval(() => {
    let timeList = document.querySelector(`.timetext${cName}`).innerHTML.split('/')
    console.log('正在观看');
    if (timeList[0].trim() == timeList[1].trim() && timeList[0].trim() != '00:00' && timeList[0].trim() != '00:00') {
      console.log('下个视频');
      clearInterval(pass)
      timer = setInterval(a, 2000)
    }
  }, 1000)
}

// 点击切换章节
$('.point-item-box .point-name-box').click(function (e) {
  cur = $(e.target).parents('.point-item-box').index() //重置当前位置
  console.log(cur);
  // 重置定时器
  clearInterval(pass)
  clearInterval(timer)
  timer = setInterval(a, 2000)
})
}, false);
})();