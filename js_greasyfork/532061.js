// ==UserScript==
// @name         订单购买界面大麦萤火虫
// @namespace    http://tampermonkey.net/
// @version      2025-4-7
// @description  代抢
// @author       3432276416
// @match        *.m.damai.cn/*
// @icon        https://img0.baidu.com/it/u=447392558,3405302423&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1066
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532061/%E8%AE%A2%E5%8D%95%E8%B4%AD%E4%B9%B0%E7%95%8C%E9%9D%A2%E5%A4%A7%E9%BA%A6%E8%90%A4%E7%81%AB%E8%99%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/532061/%E8%AE%A2%E5%8D%95%E8%B4%AD%E4%B9%B0%E7%95%8C%E9%9D%A2%E5%A4%A7%E9%BA%A6%E8%90%A4%E7%81%AB%E8%99%AB.meta.js
// ==/UserScript==

function simulateRealClick() {
  const target = document.querySelectorAll('div[view-name="TextView"] span[style*="overflow: hidden"]')[40].parentElement;
  if (!target) return false;

  // 1. 确保元素可见
  target.scrollIntoView({behavior: 'smooth', block: 'center'});

  // 2. 创建并触发完整的鼠标事件序列
  const events = [
    'pointerover', 'mouseover', 'mousedown',
    'pointerup', 'mouseup', 'click'
  ];

  events.forEach(eventType => {
    const event = new MouseEvent(eventType, {
      bubbles: true,
      cancelable: true,
      view: window,
      buttons: 1,
      clientX: target.getBoundingClientRect().x + 10,
      clientY: target.getBoundingClientRect().y + 10
    });
    target.dispatchEvent(event);
  });

  return true;
}

(async function()  {
 await new Promise(resolve => setTimeout(resolve, 1000));
 document.querySelectorAll('.iconfont.icondanxuan-weixuan_')[0].click(); //身份证选项
        await new Promise(resolve => setTimeout(resolve, 500));
 document.querySelector('input').value='13660889941';
    await new Promise(resolve => setTimeout(resolve, 1500));
  // const targetElement=document.querySelectorAll('div[view-name="TextView"] span[style*="overflow: hidden"]')[40].parentElement;
  const target=document.querySelectorAll('div[view-name="TextView"] span[style*="overflow: hidden"]')[40];
})();