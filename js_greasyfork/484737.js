// ==UserScript==
// @name         colab 自动重连 / make colab keep alive
// @name:zh      colab 自动重连
// @name:en      colab keep alive
// @name:zh-CN   colab 自动重连
// @name:ja      colab アクティブに保存
// @namespace    https://colab.research.google.com
// @version      1.0.4.3
// @description:zh  让colab保持活跃，自动检查是否掉线，掉线后自动重连，去掉谷歌人机校验
// @description:en  make colab keep alive
// @description:zh-CN   让 colab 保存活跃
// @description:ja   Google colab アクティブに保存
// @author       木木(mumu)
// @match        *://colab.research.google.com/*
// @grant        none
// @license       MIT
// @description make colab keep alive
// @downloadURL https://update.greasyfork.org/scripts/484737/colab%20%E8%87%AA%E5%8A%A8%E9%87%8D%E8%BF%9E%20%20make%20colab%20keep%20alive.user.js
// @updateURL https://update.greasyfork.org/scripts/484737/colab%20%E8%87%AA%E5%8A%A8%E9%87%8D%E8%BF%9E%20%20make%20colab%20keep%20alive.meta.js
// ==/UserScript==
var nameSpace = 'mumu-'
var timeout = 1000 * 60 * 1  // 默认1分钟检查一次连接状态
// var timeRefresh = 1000 * 60 * 10  // 默认10分钟没有重连上刷新页面（实际是关闭当前页面打开新页面，因为刷新有alert提示，js没法关闭）

// 是否开启保持活跃功能，默认关闭
var isActive = false;

var timer = null

var timeConnectedCount = 0 // 重连计时
var reConnectedCount = 0 // 重连次数计时

// 向页面添加功能按钮，默认开启保持活跃功能
function setButton () {
  // 创建 button 元素
  var button = document.createElement('button');
  button.id = nameSpace + 'floating-button';
  button.innerText = '自动重连';
  if(isActive) {
    button.className = nameSpace + 'active'
  }


  // 创建 style 标签，设置样式
  var style = document.createElement('style');
  style.innerHTML = `
    #${nameSpace}floating-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 100px;
      height: 35px;
      background-color: #e07171;
      color: #fff;
      border-radius: 8px;
      text-align: center;
      line-height: 20px;
      cursor: pointer;
      border: none;
      z-index: 999;
    }

    #${nameSpace}floating-button.${nameSpace}active {
      background-color: #007bff;
    }
  `;

  document.body.appendChild(button);
  document.head.appendChild(style);
  console.log(nameSpace+"添加完成")

  button.addEventListener('mousedown', function(event) {
    var offsetX = event.clientX - button.offsetLeft;
    var offsetY = event.clientY - button.offsetTop;

    function moveButton(event) {
        button.style.left = (event.clientX - offsetX) + 'px';
        button.style.top = (event.clientY - offsetY) + 'px';
    }

    document.addEventListener('mousemove', moveButton);

    button.addEventListener('mouseup', function() {
        document.removeEventListener('mousemove', moveButton);
    });
  });

  button.addEventListener('click', function() {
    isActive = !isActive;
    if (isActive) {
        button.classList.add(nameSpace+'active');
    } else {
        button.innerText = '自动重连'
        button.classList.remove(nameSpace+'active');
    }
    checkRunningTimerHandle()
  });
}

// 去掉谷歌验证
function removeGoogleRecaptcha () {
  if(document.getElementById('comments')){
    document.getElementById('comments').click()
    document.getElementById('comments').click()
  }
  document.querySelectorAll('script[src*="recaptcha"]').forEach(el=> {
    el.remove()
  })
  removeEl('.grecaptcha-badge')
  removeEl('colab-recaptcha-dialog')
  removeEl('mwc-dialog')
  console.log(nameSpace+'去掉谷歌验证')
}

function removeEl (selector) {
  var el = document.querySelector(selector)
  if(el) {
    el.remove()
  }
}

// 检查是否运行中
function checkRunning () {
  removeGoogleRecaptcha()
  var els = document.querySelectorAll('.running')
  if(els.length > 0) {
    return true
  } else {
    console.log(nameSpace +'连接已中断' + new Date().toLocaleString())
    return false
  }
}

// 定时运行检查处理函数
function checkRunningTimerHandle () {
  if(isActive && !timer) {
    timer = setInterval(() => {
      if(!checkRunning()) {
        setActive()
      }
    },timeout)
    setActive()
  } else {
    timer && clearInterval(timer)
    timer = null
  }
}

// 重新连接
function setActive() {
  // 如果有提示弹窗就关闭
  if(document.querySelector('mwc-button')) {
    document.querySelector('mwc-button').click()
  }

  document.querySelectorAll('colab-run-button').forEach((el) => {
    el.click()
  })
  reConnectedCount = reConnectedCount+1
  console.log(nameSpace+'运行重新连接-' + reConnectedCount + '：' + new Date().toLocaleString())
}

window.addEventListener('load', () => {
  setButton()
    // 5s后校验是否在运行
    setTimeout(() => {
      checkRunningTimerHandle()
    },1000 * 5)
})