
  // ==UserScript==
// @name         【学习公社】学习中心视频自动打卡继续观看
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  学习公社学习中心，检测打卡弹窗并点击，检测继续观看弹窗并点击
// @author       SimpleZ
// @icon         none
// @match        *://www.ttcdw.cn/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488597/%E3%80%90%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E3%80%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E5%BF%83%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1%E7%BB%A7%E7%BB%AD%E8%A7%82%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/488597/%E3%80%90%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE%E3%80%91%E5%AD%A6%E4%B9%A0%E4%B8%AD%E5%BF%83%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1%E7%BB%A7%E7%BB%AD%E8%A7%82%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
     let inputValue = localStorage.getItem('urlList') || ''
    let urlArray = inputValue.replace(/[\n\s]/g, '').split(',') || []

    //创建一个控制网址栏显示的按钮
    var controlButton = document.createElement('button')
    controlButton.innerHTML = '学习范围'
    controlButton.style.width = '80px'
    controlButton.style.height = '80px'
    controlButton.style.backgroundColor = '#1252cc'
    controlButton.style.color = '#ffffff'
    controlButton.style.borderRadius = '48px'
     controlButton.style.position = 'fixed'
    controlButton.style.top = '100px'
    controlButton.style.right = '50px'

    //创建一个可控div
    const containerDiv = document.createElement('div')
    containerDiv.style.width = '400px'
    containerDiv.style.height = '500px'
    containerDiv.style.display = 'none'
    containerDiv.style.position = 'fixed'
    containerDiv.style.top = '200px'
    containerDiv.style.right = '50px'
    containerDiv.style.zIndex = '999'

   // 创建一个 div 元素
    const divElement = document.createElement('div')
    divElement.style.width = '400px'
    divElement.style.height = '500px'
    divElement.style.backgroundColor = '#f0f0f0'
    divElement.style.border = '1px solid #ccc'
    divElement.style.padding = '10px'
    divElement.style.display = 'flex'
    divElement.style.flexDirection = 'column'
    divElement.style.alignItems = 'center'

    // 创建一个输入框元素
    const textareaElement = document.createElement('textarea')
    textareaElement.style.width = '350px'
    textareaElement.style.height = '450px'
    textareaElement.setAttribute('type', 'text')
    textareaElement.setAttribute('id', 'myInput')
    textareaElement.value = inputValue

    //创建一个控制按钮
    const buttonElement = document.createElement('button')
    buttonElement.innerHTML = '开始学习'
    buttonElement.style.width = '100px'
    buttonElement.style.height = '30px'
    buttonElement.style.backgroundColor = '#1252cc'
    buttonElement.style.color = '#ffffff'
    buttonElement.style.marginTop = '10px'

    //将输入框所在div包裹在可控div中
    containerDiv.appendChild(divElement)

    // 将输入框添加到 div 元素中
    divElement.appendChild(textareaElement)
    divElement.appendChild(buttonElement)

    // 将 div 元素和控制显隐的按钮添加到页面的 body 元素中
    document.body.appendChild(containerDiv)
    document.body.appendChild(controlButton)

    //显示按钮的控制逻辑
    controlButton.addEventListener('click', function() {
        if (containerDiv.style.display === 'none') {
            containerDiv.style.display = 'block'
        } else {
            containerDiv.style.display = 'none'
        }
    })
    // 添加事件监听器，当用户输入内容时执行相应的操作
    textareaElement.addEventListener('input', function() {
        // 获取输入框中的内容
       inputValue = textareaElement.value
    })
    //把输入框的内容存在localStorage中并跳转到第一个链接
    buttonElement.addEventListener('click', function() {
         localStorage.setItem('urlList', inputValue)
        window.location.href = urlArray[0]
    })

  setInterval(function() {
    //30s一次检测是否有打卡弹窗并关闭
      if ($('.layui-layer-title').text() === '随堂打卡') {
          const button = $('.question-wrapper-face button#comfirmClock')
          if (button) {
              button.trigger('click')
              if (button.text() === '确定打卡') console.log('已打卡')
              else console.log('继续学习')
              return
          }
      }
    //30s一次检测当前页面视频是否播放完毕
       if ($('.xgplayer-replay').css('display') !== 'none' && $('.xgplayer-replay').prop('tagName') === 'XG-REPLAY'){
          console.log('已播放完毕')
          const index = urlArray.indexOf($(location).attr('href'))
          if (index !== -1 && index < urlArray.length) {
              window.location.href = urlArray[index + 1]
          }
           return
      }
  }, 30000)
})()