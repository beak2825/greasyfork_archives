// ==UserScript==
// @name         广工校园网自动登录
// @namespace    som_why
// @version      v2.0
// @description  自动填写登录信息并提交
// @author       索姆歪
// @match        http://10.0.3.6/*
// @icon         https://utqm.gdut.edu.cn/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493365/%E5%B9%BF%E5%B7%A5%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/493365/%E5%B9%BF%E5%B7%A5%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

const yhm=document.querySelector
("#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(3)");
//改为具体网站的账号元素
    const psw=document.querySelector
("#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(4)");
//改为具体网站的密码元素
    const submit=document.querySelector
("#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(1)");
//改为具体网站的提交按钮元素
  yhm.value="";//引号内填入你的账号
    psw.value="";//引号内填入你的密码
    function mouseClick (element) {
  // 创建事件
  let event = document.createEvent('MouseEvents')
  // 定义事件 参数： type, bubbles, cancelable
  event.initEvent('click', true, true)
  // 触发对象可以是任何元素或其他事件目标
  element.dispatchEvent(event)
}
mouseClick(submit);
})();