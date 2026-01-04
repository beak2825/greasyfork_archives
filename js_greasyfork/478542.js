// ==UserScript==
// @name         Custom UI
// @namespace    http://your.namespace.com
// @version      1.0
// @description  Create a custom user interface using Tampermonkey
// @author       Your Name
// @match        *://qianchuan.jinritemai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478542/Custom%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/478542/Custom%20UI.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  initUI()
})()

function initUI() {
  // 创建一个容器用于自定义界面
  var customUI = document.createElement('div')
  customUI.style.color = 'white'
  customUI.style.zIndex = 9999
  customUI.style.position = 'fixed'
  customUI.style.top = '50px'
  customUI.style.right = '10px'
  customUI.style.backgroundColor = '#1A99EF'
  customUI.style.padding = '20px'
  customUI.style.border = '1px solid #ccc'
  customUI.style.display = 'block'
  //获取初始化数据
  var jk = localStorage.getItem('jiankong')
  var shutCost = localStorage.getItem('shutCost')
  var shutRoi = localStorage.getItem('shutRoi')
  var shutCost2 = localStorage.getItem('shutCost2')
  var shutRoi2 = localStorage.getItem('shutRoi2')
  // 添加一些内容到自定义界面
  customUI.innerHTML = `
       <h2>千川助手</h2>
       <span>--------计划监控区-------<span>

       <div class="input-row">
       <label for="condition1">条件1：</label>
       <input style="width:50px"   id="costInput1" placeholder="消耗">
       <input style="width:50px"   id="roiInput1" placeholder="roi">
        </div>

       <div class="input-row">
       <label for="condition2">条件2：</label>
       <input style="width:50px"   id="costInput2" placeholder="消耗">
       <input style="width:50px"   id="roiInput2" placeholder="roi">
       </div>

        <div class="button-row">
        <button id="startAuto">开始监控</button>
        <button id="endAuto">停止监控</button>
        </div>

        <div class="jkStatusRow">
         <span>监控状态：</span>
         <span>${jk}</span>
        </div>

        <span>---------------------------</span>
 `
  customUI.querySelector('h2').style.textAlign = 'center'
  customUI.querySelector('h2').style.fontWeight = 'bold'
  customUI.querySelector('.button-row').style.margin = '5px'
  customUI.querySelector('.button-row').style.display = 'flex'
  customUI.querySelector('.button-row').style.justifyContent = 'space-between'

  // 将自定义界面添加到文档中
  document.body.appendChild(customUI)

  customUI.querySelector('#costInput1').value = shutCost
  customUI.querySelector('#roiInput1').value = shutRoi
  customUI.querySelector('#costInput2').value = shutCost2
  customUI.querySelector('#roiInput2').value = shutRoi2

  // 开始监控
  var startBtn = customUI.querySelector('#startAuto')
  startBtn.addEventListener('click', () => {
    localStorage.setItem('shutCost', customUI.querySelector('#costInput1').value)
    localStorage.setItem('shutRoi', customUI.querySelector('#roiInput1').value)
    localStorage.setItem('shutCost2', customUI.querySelector('#costInput2').value)
    localStorage.setItem('shutRoi2', customUI.querySelector('#roiInput2').value)
    localStorage.setItem('jiankong', '监控中')
    customUI.querySelector('.jkStatusRow span:nth-child(2)').textContent = '监控中'
  })

  // 停止监控
  var endBtn = customUI.querySelector('#endAuto')
  endBtn.addEventListener('click', () => {
    customUI.querySelector('.jkStatusRow span:nth-child(2)').textContent = '未监控'
    localStorage.setItem('jiankong', '未监控')
  })
}
