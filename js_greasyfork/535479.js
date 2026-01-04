// ==UserScript==
// @name         PTT论坛排版优化
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  强化回复区块的视觉呈现
// @author     chatchat
// @match        https://www.ptt.cc/*
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535479/PTT%E8%AE%BA%E5%9D%9B%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/535479/PTT%E8%AE%BA%E5%9D%9B%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

GM_addStyle(`
/* 增强型回复区块设计 */
.push {
  margin: 15px 0 !important;
  padding: 15px !important;
  background: #fff !important;
  border: 1px solid #e4e6eb !important;
  border-radius: 6px !important;
  position: relative;
  transition: all 0.2s;
}

/* 用户信息强化 */
.push .f3 {
  display: inline-block !important;
  font-weight: bold !important;
  color: #3385ff !important;
  margin-right: 15px !important;
  min-width: 80px;
}

.push .f2 {
  color: #666 !important;
  font-size: 12px !important;
  background: #f5f5f5 !important;
  padding: 3px 8px !important;
  border-radius: 3px !important;
  margin-left: 10px !important;
}

/* 交互状态优化 */
.push:hover {
  transform: translateX(5px);
  box-shadow: 0 3px 12px rgba(0,0,0,0.1);
}

/* 不同类型回复标识 */
.push.push-tag:before {
  content: '';
  position: absolute;
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 70%;
  background: #3385ff;
  border-radius: 2px;
}

.push.boo-tag:before {
  background: #ff4444;
}

/* 回复内容排版 */
.push-content {
  margin: 10px 0 0 0 !important;
  padding-left: 15px !important;
  border-left: 2px solid #eee;
  color: #444 !important;
  line-height: 1.7 !important;
}

/* 楼层编号强化 */
.push-number {
  position: absolute !important;
  right: 15px !important;
  top: 15px !important;
  color: #999 !important;
  font-family: monospace;
}

/* 手机版适配 */
@media (max-width: 768px) {
  .push {
    margin: 10px 0 !important;
    padding: 12px !important;
  }
  
  .push .f3 {
    display: block !important;
    margin-bottom: 8px !important;
  }
}
`);

// 动态增强回复结构
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.push').forEach((push, index) => {
    // 添加楼层编号
    const number = document.createElement('span');
    number.className = 'push-number';
    number.textContent = `#${index + 1}`;
    push.prepend(number);
    
    // 包裹回复内容
    const content = push.querySelector('.f3 + .f3') || push.querySelector('.f3 + span');
    if (content) {
      content.classList.add('push-content');
    }
  });
});