/*!
// ==UserScript==
// @name          ChatGPT Quick Prompts 
// @namespace     https://github.com/Liugq5713/quick-prompt
// @version       0.0.8
// @description   ChatGPT 智能 Prompts 可以为你带来更好的使用体验助你训练好用的ChatGPT
// @author        lynden
// @match         *://chatgpt.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/496619/ChatGPT%20Quick%20Prompts.user.js
// @updateURL https://update.greasyfork.org/scripts/496619/ChatGPT%20Quick%20Prompts.meta.js
// ==/UserScript==
*/
;(function () {
  'use strict'
  if (document.querySelector('#chatgptHelper')) {
    return
  }
  var SHORTCUTS = {
    english: [
      ['sentence', '请将下面句子改写, 并且输出他的中文翻译'],
      ['word', '请给出下面这个单词的含义， 造句，反义词等等，帮助人理解'],
      ['grammar', '分析这个句子的词法结构，并给出中文解释，试图教会我'],
      ['chinese', '请给出这个句子的英文翻译，并且给出句子的解释'],
    ],
    // [ '',``]
    code: [
      ['fe engineer', '你是一个前端高级工程师，请回答下面的问题'],
      ['format-label-value', '请将下面结构体变成 {label,value}的数组， 请给出完整的产物'],
    ],
  }
  var rootEle = document.createElement('div')
  rootEle.id = 'chatgptHelper'
  const formattedHTML = `
  <div id="chatgptHelperOpen" class="fixed top-1/2 right-1 z-50 p-3 rounded-md transition-colors duration-200 text-white cursor-pointer border border-white/20 bg-gray-900 hover:bg-gray-700 -translate-y-1/2">
    快<br>捷<br>指<br>令
  </div>
  <div id="chatgptHelperMain" class="fixed top-0 right-0 bottom-0 z-50 flex flex-col px-3 w-96 text-gray-100 bg-gray-900" style="transform: translateX(0); transition: transform 0.2s;">
    <div class="py-4 pl-2">
    <h2>
      <a href="https://github.com/Liugq5713/quick-prompt" target="_blank">Quick Prompt</a>
    </h2>

    </div>

<ul>
${Object.keys(SHORTCUTS)
  .map(group => {
    return `<div class="border-b border-white/20">
      <h4 class="ml-2 mt-3 text-lg" style="color: #ffffff33">${group}</h4>
      <ul class="flex flex-1 overflow-y-auto py-4  text-sm" style="flex-wrap: wrap">
      ${SHORTCUTS[group]
        .map(
          ([label, value]) => `
        <li class="mr-2 mb-2 py-1 px-3 rounded-md hover:bg-gray-700 cursor-pointer" data-value="${encodeURI(value)}">
          ${label}
        </li>
      `,
        )
        .join('')}
    </ul>
    </div>`
  })
  .join('')}
</ul>
   <div class="flex items-center py-4 absolute bottom-0">
      <div id="chatgptHelperClose" class="py-2 px-3 rounded-md cursor-pointer hover:bg-gray-700">
        关闭
      </div>
      <div class="flex-1 pr-3 text-right text-sm items-center">
        <label class="flex items-center cursor-pointer" style="display: inline-block;">
          <input type="checkbox" checked="true" id="isPain" style="border-radius: 20px; margin-bottom: 3px;">
          <span>是否固定面板</span>
        </label>
        <label class="flex items-center ml-2 cursor-pointer" style="display: inline-block;">
          <input type="checkbox" id="isAutoSend" style="border-radius: 20px; margin-bottom: 3px;">
          <span>是否自动发送</span>
        </label>
      </div>
    </div>
  </div>
`

  console.log('formattedHTML', formattedHTML)

  rootEle.innerHTML = formattedHTML

  // 创建一个新的 KeyboardEvent 事件对象
  const keyEvent = new KeyboardEvent('keydown', {
    key: 'Enter',
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  })
  rootEle.querySelector('ul').addEventListener('click', function (event) {
    var target = event.target
    const isAutoSend = document.getElementById('isAutoSend').checked
    const isPain = document.getElementById('isPain').checked
    if (target.nodeName === 'LI') {
      var value = target.getAttribute('data-value')
      if (value) {
        var textareaEle_1 = document.querySelector('textarea')
        textareaEle_1.value = decodeURI(value)
        console.log('---', textareaEle_1.value)
        textareaEle_1.dispatchEvent(new Event('input', { bubbles: true }))
        setTimeout(function () {
          if (isAutoSend) {
            textareaEle_1.dispatchEvent(keyEvent)
          } else {
            textareaEle_1.focus()
          }
        }, 1e3)
      }
      if (!isPain) {
        chatgptHelperMain.style.transform = 'translateX(100%)'
      }
    }
  })
  document.body.appendChild(rootEle)
  var chatgptHelperMain = document.querySelector('#chatgptHelperMain')
  document.querySelector('#chatgptHelperOpen').addEventListener('click', function () {
    chatgptHelperMain.style.transform = 'translateX(0)'
  })
  document.querySelector('#chatgptHelperClose').addEventListener('click', function () {
    chatgptHelperMain.style.transform = 'translateX(100%)'
  })
})()
