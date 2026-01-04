// ==UserScript==
// @name         全自动风纪委(改)
// @description  进入评价界面自动开始提交风纪委评价
// @namespace    http://tampermonkey.net
// @supportURL   https://github.com/inory121/tamperscript
// @version      1.0
// @author       hiiro
// @match        https://www.bilibili.com/judgement*
// @match        https://www.limestart.cn/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://raw.githubusercontent.com/the1812/Bilibili-Evolved/preview/images/logo-small.png
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471620/%E5%85%A8%E8%87%AA%E5%8A%A8%E9%A3%8E%E7%BA%AA%E5%A7%94%28%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/471620/%E5%85%A8%E8%87%AA%E5%8A%A8%E9%A3%8E%E7%BA%AA%E5%A7%94%28%E6%94%B9%29.meta.js
// ==/UserScript==

/* 原理：DOM操作模拟点击，不会被检测异常 */
/* 使用方法：修改@match匹配你自己的浏览器首页或者手动打开风纪页面(https://www.bilibili.com/judgement)或者点击"打开风纪页面"选项，然后解放双手(每天运行一次，如果想再次运行，点击油猴本脚本设置选项的"清除本地存储"或者手动删除localStorage里面的'BL-SCRIPT-LAST-RUN')，如果已经在风纪页面但没有反应，点击油猴"重新运行脚本"选项" */
/* 仅供学习交流使用，安装后请于24小时内删除 */
$(function () {
  'use strict';
  
  // 添加菜单项
  GM_registerMenuCommand('清除本地存储', removeDateStore);
  GM_registerMenuCommand('重新运行脚本', rerun);
  GM_registerMenuCommand('打开风纪页面', openJudgePage);

  // 检查当前网站
  const currentSite = window.location.hostname;
  const isBLPage = (currentSite === 'www.bilibili.com');
  const date = new Date().getDate();
  
  function openJudgePage() {
    window.open('https://www.bilibili.com/judgement');
  }

  function rerun() {
    localStorage.removeItem('BL-SCRIPT-LAST-RUN');
    if (isBLPage) {
      judge();
    } else {
      console.log('当前网站不支持自动评价功能');
    }
  }

  function SetDateStore() {
    localStorage.setItem('BL-SCRIPT-LAST-RUN', date);
  }

  function CompareDateStore() {
    return localStorage.getItem('BL-SCRIPT-LAST-RUN') == date;
  }

  function removeDateStore() {
    localStorage.removeItem('BL-SCRIPT-LAST-RUN');
    if (!isBLPage) {
      window.location.href = 'https://www.bilibili.com/judgement';
    } else {
      console.log('当前网站不支持自动评价功能');
    }
  }

  const CONFIG = {
    是否合适: 0, // 0合适 好 | 1一般 普通 | 2不合适 差 | 3无法判断 无法判断
    会观看吗: 1, // 0会观看 | 1不会观看
    是否匿名: true // true匿名 | false非匿名
  }

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  const sleep = async (timeout) => {
    timeout += randInt(500, 1000) // 随机延迟
    return new Promise((resolve) => {
      setTimeout(resolve, timeout)
    })
  }

  const btnClick = (selector, index = 0) => $(selector)[index]?.click()

  const callBackFn = async () => {
      if($('.b-tag').text=='已结束'){
      removeDateStore()
    }
    // TODO: 添加跳出递归的条件
    return await sleep(2000)
      .then(() => {
        btnClick('.vote-btns .btn-group button', CONFIG['是否合适'])
        btnClick('.vote-btns .will-you-watch button', CONFIG['会观看吗'])
        btnClick('.vote-anonymous .v-check-box__label', CONFIG['是否匿名'])
      })
      .then(() => btnClick('.vote-submit button')) // 提交
      .then(() => sleep(5000))
      .then(() => {
        if ($('.vote-result button')) {
          btnClick('.vote-result button')
        } else {
          removeDateStore()
        }

      }) // 跳转下一题
      .then(() => callBackFn())
      .catch((err) => confirm(`[全自动风纪委] 出错: ${err}, 点击确定刷新`) && location.reload())
  }

  function judge() {
    if (CompareDateStore()) {
      return
    } else {
      if (!isBLPage) {
        SetDateStore()
        window.open('https://www.bilibili.com/judgement')
      }

      let text = $('.item-button')[0]?.innerText
      if (text === '投票次数已用完' || text === '无新任务' || text === '审核中') {
        console.log('[风纪自动投票]没有众议次数');
        return
      } else if (text === '开始众议') {
        btnClick('.item-button button', [0])
        callBackFn()
      } else if (text === '申请连任') {
        btnClick('.item-button button', [0])
        return
      }
    }
  }
  judge()
})