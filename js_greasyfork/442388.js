// ==UserScript==
// @name         腾讯课堂自动签到
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  我不是作者，作者见链接。请先使用腾讯课堂极速版开课进行测试，无问题后再使用，避免脚本无效，造成惨重后果！已对脚本进行升级。
// @author       https://blog.csdn.net/qq_31254489/article/details/106344562
// @match        https://ke.qq.com/webcourse/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442388/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/442388/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
//腾讯课堂界面好像没有jq，界面引入jq
var jq = document.createElement('script');
jq.setAttribute('src', 'https://libs.baidu.com/jquery/1.9.0/jquery.js');
document.body.append(jq);

//设置每秒检测弹窗，如果有弹窗，过1秒点击签到，再过1秒点击确定，控制台可查询签到记录。
var x = 0
setTimeout(() => {
  setInterval(() => {

    console.log("自动签到中....");

    if ($('.s-btn.s-btn--primary.s-btn--m').length != 0) {
      setTimeout(() => {
        $('.s-btn.s-btn--primary.s-btn--m').click();
      }, 1000);
      x = x + 0.333
      let t = new Date().toLocaleString()
      console.log("签到成功，时间:",t)
      console.log("已完成的签到次数（取约数）:",x)
    }
  }, 1000);

}, 1000);


// Your code here...