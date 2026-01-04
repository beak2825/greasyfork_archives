// ==UserScript==
// @name        改背景、复制
// @license MIT
// @namespace   Violentmonkey Scripts
// @match       https://www.enjing.net/*
// @grant       none
// @version     1.0
// @author      -
// @description 2024/8/20 09:32:56
// @downloadURL https://update.greasyfork.org/scripts/504459/%E6%94%B9%E8%83%8C%E6%99%AF%E3%80%81%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/504459/%E6%94%B9%E8%83%8C%E6%99%AF%E3%80%81%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==


nr_body.style.background = "RGB(199, 237, 204)"
pagewrap.style.background = "RGB(199, 237, 204)"
pagewrap.style.color = "#333333"


createButton('复制本章节').addEventListener('click', getTexts);;


function getTexts(){
  let container= document.querySelector('#nr1');
  if(!container) throw new Error("停止查询，未找到dom元素");
  let content = '';
  let allTextDom = container.querySelectorAll('p');
  allTextDom.forEach((el,i)=>{
    content+=el.innerText;
  })
  navigator.clipboard.writeText(content);
  showMessage("复制小说内容成功");
  return content;
};


function getRemarks(){
  let container= document.querySelector('#nr1');
  if(!container) throw new Error("停止查询，未找到dom元素");
  let content = '';
  let allTextDom = container.querySelectorAll('p');
  allTextDom.forEach((el,i)=>{
    content+=el.innerText;
  })
  navigator.clipboard.writeText(content);
  showMessage("复制小说内容成功");
  return content;
};


function createButton(text,top,right){
  let container= document.querySelector('#nr1');
  let oCopyDiv = document.querySelector('#copyDiv');
  if(oCopyDiv) return;

  if(!container) throw new Error("停止查询，未找到dom元素");
  container.style.position = 'relative';
   const copyDiv = document.createElement('div');
    copyDiv.id = 'copy';
    copyDiv.textContent = text;
    copyDiv.style.cssText = `
      position: absolute; /* 设置为绝对定位 */
      top: -100px; /* 距离顶部50像素 */
      right: -100px; /* 距离左边50像素 */
      padding: 10px;
      border-radius:5px;
      z-index:999;
      color:#fff;
      background-color: #40b572; /* 背景颜色 */
      cursor: pointer; /* 鼠标悬停时显示手型 */
    `
    container.appendChild(copyDiv);
     return copyDiv;

}


function showMessage(text, duration = 3000) {
        // 创建消息提示框
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px; /* 距离顶部20像素 */
            right: 20px; /* 距离右边20像素 */
            padding: 15px 20px;
            background-color: #f0f9eb; /* 背景颜色 */
            color: #67c23a; /* 字体颜色 */
            border: 1px solid #e2f0d9; /* 边框 */
            border-radius: 4px; /* 圆角 */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 阴影 */
            z-index: 1000; /* 确保在最上层 */
            opacity: 0; /* 初始透明度 */
            transition: opacity 0.5s; /* 透明度过渡效果 */

        `;
        messageDiv.textContent = text;

        // 将消息添加到文档中
        document.body.appendChild(messageDiv);
        // 显示消息
        setTimeout(() => {
            messageDiv.style.opacity = 1;
        }, 10);

        // 设置定时器以在指定时间后移除消息
        setTimeout(() => {
            // 在过渡结束后移除消息元素
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 500); // 过渡时间与 CSS 中的过渡时间一致
        }, duration);
    }