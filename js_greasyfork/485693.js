// ==UserScript==
// @name        抢单定制脚本
// @namespace    https://kuajing.pinduoduo.com/main/order-manage
// @version      0.1
// @description  简单的描述信息
// @author       You
// @match        https://kuajing.pinduoduo.com/main/order-manage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pinduoduo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485693/%E6%8A%A2%E5%8D%95%E5%AE%9A%E5%88%B6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/485693/%E6%8A%A2%E5%8D%95%E5%AE%9A%E5%88%B6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
   // window.onload = async () => {
        // 创建一个 style 元素
        const styleElement = document.createElement('style');

        // 设置 style 元素的内容
        styleElement.textContent = `
  #myDiv {
    background-color: pink;
    padding: 10px;
    z-index: 5;
  }

  #myDiv textarea {
    display: inline-block;
    width: 100%;
  }

  #myDiv button#start {
    display: inline-block;
    margin-right: 20px;
    margin-top: 20px;
  }

  #myDiv button#stop {
    display: inline-block;
    margin-top: 20px;
  }
`;

        // 将 style 元素添加到文档的 head 中
        document.head.appendChild(styleElement);

        // 创建一个 div 元素
        const myDiv = document.createElement('div');
        myDiv.id = 'myDiv';

        const toggleButton = document.createElement('button');
        let isShow = false;
        toggleButton.textContent = '显示/隐藏-----------------抢单小助手v1.0';
        myDiv.appendChild(toggleButton);

        const div2 = document.createElement('div');
        div2.style.display = 'none';
        myDiv.appendChild(div2);

        toggleButton.addEventListener('click', function() {
            if (isShow) {
                div2.style.display = 'none';
            } else {
                div2.style.display = 'block';
            }
            isShow = !isShow;
        });


        // 创建一个 span 元素
        const spanHint = document.createElement('span');
        spanHint.textContent = '多个单号用逗号分开';
        div2.appendChild(spanHint);

        // 创建一个 textarea 元素
        const textareaElement = document.createElement('textarea');
        textareaElement.rows = 5;
        div2.appendChild(textareaElement);

        // 创建一个 button 元素
        const buttonStart = document.createElement('button');
        buttonStart.textContent = '开始';
        buttonStart.id='start';
        div2.appendChild(buttonStart);


        const buttonStop = document.createElement('button');
        buttonStop.textContent = '结束';
        buttonStop.id='stop';
        buttonStop.disabled = true;
        div2.appendChild(buttonStop);

        const span抢单间隔 = document.createElement('span');
        span抢单间隔.textContent = '抢单间隔（秒）：';
        span抢单间隔.style['margin-left']='30px';
        div2.appendChild(span抢单间隔);

        const inputTime = document.createElement('input');
        inputTime.placeholder='秒';
        inputTime.value='5';
        div2.appendChild(inputTime);


        const spanCount = document.createElement('span');
        spanCount.textContent = '';
        spanCount.style['margin-left']='30px';
        div2.appendChild(spanCount);

        // 将整个 div 元素添加到文档的 body 中
        // document.body.appendChild(myDiv);

        const timeId = setInterval(() => {
           const div = document.querySelector('div.index-module__flex-0-0___I-d-v');
           if (div) {
             div.appendChild(myDiv);
             clearInterval(timeId);
           }
        }, 500);

        // 点击开始按钮
        let index = 0;
        let count = 0;
        let startTimeId = null;
        let confirmTimeId = null;
        let numberArr = null;
        buttonStart.addEventListener('click', function() {
            const second = parseInt(inputTime.value) || 5;
            console.log('间隔', second, parseInt(inputTime.value));
            const numberText = textareaElement.value.replaceAll('，', ',');
            numberArr = numberText.split(',').map(v => v.trim()).filter(v => v.length === 14);
            if (!numberArr?.length) {
               alert('输入的内容有误！');
                return;
            }


            index = 0;
            count = 0;

            const fun = () => {
                const curIndex = index % numberArr.length;
                const number = numberArr[curIndex];
                clickOrdersSend(number);
                index++;
                spanCount.textContent = `抢单次数: ${index}`;
            };
            buttonStart.disabled = true;
            buttonStop.disabled = false;
            inputTime.disabled = true;
            textareaElement.disabled = true;
            fun();
            startTimeId = setInterval(fun, second * 1000);
            confirmTimeId = setInterval(() => {
              clickElement('div.PP_popoverContent_5-80-0 button.BTN_primary_5-80-0');
              clickElement('button[data-tracking-id="P9U-HBAwQwA8DSPl');
            }, 500);
        });

        buttonStop.addEventListener('click', function() {
            clearInterval(startTimeId);
            clearInterval(confirmTimeId);
            buttonStart.disabled = false;
            buttonStop.disabled = true;
            inputTime.disabled = false;
            textareaElement.disabled = false;
            spanCount.textContent = '';
        });
    //}

})();

function clickOrdersSend(number) {
  // 示例：查找包含内容为 'WB240121036442' 的 tr 元素
    const result = findTRWithContent(number);
    //console.log(text + '===', result); // 输出: 包含 'WB240121036442' 的 tr 元素
    if (result) {
        const span = findSpan加入发货台(result);
        //console.log('span', span);
        if (span) span.click();
    }
}

function findSpan加入发货台(parent) {
  const list = parent.querySelectorAll('span');
  if (list?.length) {
    for(const item of list) {
      if(item.innerHTML==='加入发货台') {
        return item;
      }
    }
  }
}

// 查找包含指定内容的 tr 元素
function findTRWithContent(content) {
  const trs = document.querySelectorAll('tr');
  if (!trs?.length) return null;
    for(const tr of trs) {
      if (tr.textContent.includes(content)) return tr;
    }

  return null; // 没有找到匹配的 tr 元素
}

async function start11() {
    clickElement('.CBX_square_5-72-0.CBX_groupDisabled_5-72-0.CBX_hasCheckSquare_5-72-0');
    await delay(2000);
    clickElement('button[data-tracking-id="8o3X0Dsmc2YlETJE"]');
    await delay(2000);
    clickElement('button[data-tracking-id="MQTlOBUftb9W4uux"]');
    await delay(3000);
    clickElement('button[data-tracking-id="8uQ-E7D74DAeEsa2');
    await delay(2000);
}

function clickElement(selector) {
    const ele = document.querySelector(selector);
    if (ele) {
        ele.click();
        return true;
    } else {
        return false;
    }
}

async function delay(ms) {
    return new Promise(resolve => {
        setTimeout(() => resolve(true), ms);
    })
}