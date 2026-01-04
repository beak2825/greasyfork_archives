// ==UserScript==
// @name         PlanView
// @namespace    https://github.com/liammmliu/
// @version      0.1
// @description  B2B Dev Planview
// @author       Liam.Liu
// @match        https://deckers.pvcloud.com/planview/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pvcloud.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464743/PlanView.user.js
// @updateURL https://update.greasyfork.org/scripts/464743/PlanView.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {


//  B2B Requirements / Planning / Retros to timesheetB2B Requirements / Planning / Retros => input id = 15263
const planIds = [
  '15263\\#\\#\\#daily\\#2',
  '15263\\#\\#\\#daily\\#3',
  '15263\\#\\#\\#daily\\#4',
  '15263\\#\\#\\#daily\\#5',
  '15263\\#\\#\\#daily\\#6',
]

//  B2B Requirements / Planning / Retros to timesheetB2B Requirements / Planning / Retros => input id = 15264
const reviewIds = [
  '15264\\#\\#\\#daily\\#2',
  '15264\\#\\#\\#daily\\#3',
  '15264\\#\\#\\#daily\\#4',
  '15264\\#\\#\\#daily\\#5',
  '15264\\#\\#\\#daily\\#6',
]

const fistWeekPlan = [0, 0, 2, 0, 0]
const secondWeekPlan = [0, 0, 0, 2, 0]

function apply(weekPlaning) {
  for (let i = 0; i < weekPlaning.length; i++) {
    const planingVal = weekPlaning[i]
    const planingInput = $(`#${planIds[i]}`)
    planingInput.val(planingVal > 0 ? planingVal : '')
    planingInput.trigger('change')

    const reviewVal = 8 - planingVal
    const reviewInput = $(`#${reviewIds[i]}`)
    reviewInput.val(reviewVal > 0 ? reviewVal : '')
    reviewInput.trigger('change')
  }
}

// apply(fistWeekPlan)

// 创建第一个按钮元素
const btn1 = document.createElement('button');
btn1.textContent = '第一周';
document.body.appendChild(btn1);

// 创建第二个按钮元素
const btn2 = document.createElement('button');
btn2.textContent = '第二周';
document.body.appendChild(btn2);

// 设置按钮的样式
const btnStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  borderRadius: '4px',
  border: 'none',
  padding: '8px 16px',
  cursor: 'pointer',
  position: 'fixed',
  bottom: '20px',
  right: '20px'
};

// 应用样式到按钮元素
Object.assign(btn1.style, btnStyle);
Object.assign(btn2.style, btnStyle);
btn1.style.right = '120px';

// 添加点击事件处理程序到按钮
btn1.addEventListener('click', handleFirstWeekClick);
btn2.addEventListener('click', handleSecondWeekClick);

// // 处理按钮点击事件
function handleFirstWeekClick(event) {
  apply(fistWeekPlan)
}
function handleSecondWeekClick(event) {
  apply(secondWeekPlan)
}


    }, 1000);


})();