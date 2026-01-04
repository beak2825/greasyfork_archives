// ==UserScript==
// @name         中国大学MOOC视频中题目自动跳过
// @namespace    https://gitee.com/Kaiter-Plus/TampermonkeyScript/tree/master/MOOCSkipQuestion
// @version      0.1
// @description  中国大学MOOC,icourse163视频中题目自动跳过，移除弹题元素，防止暂停（本脚本仅供学习使用，请在下载后24小时内删除！）
// @author       Kaiter
// @match        *://www.icourse163.org/learn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404472/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%E8%A7%86%E9%A2%91%E4%B8%AD%E9%A2%98%E7%9B%AE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/404472/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%E8%A7%86%E9%A2%91%E4%B8%AD%E9%A2%98%E7%9B%AE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87.meta.js
// ==/UserScript==

(function() {
  setInterval(function(){
    let question = document.querySelector('.u-btn.u-btn-default.cont.j-continue')
    if (question) {
      question.parentNode.remove()
    }
    let video = document.querySelector('video')
    console.log(video.paused)
    if (video.paused) {
      video.play()
    }
  }, 5000)
})();