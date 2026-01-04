// ==UserScript==
// @name         通过鼠标右键获取DOM和元素选择器
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  牛逼ProMaxPlus-2
// @author       Luhuipeng
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460376/%E9%80%9A%E8%BF%87%E9%BC%A0%E6%A0%87%E5%8F%B3%E9%94%AE%E8%8E%B7%E5%8F%96DOM%E5%92%8C%E5%85%83%E7%B4%A0%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/460376/%E9%80%9A%E8%BF%87%E9%BC%A0%E6%A0%87%E5%8F%B3%E9%94%AE%E8%8E%B7%E5%8F%96DOM%E5%92%8C%E5%85%83%E7%B4%A0%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 通过DOM元素获取元素选择器
let selector, x, y, scrollTop, visible = false
function getSelectorRes (el) {
  if (!(el instanceof Element)) return
  const path = []
  while (el.nodeType === Node.ELEMENT_NODE) {
    let selector = el.nodeName.toLowerCase()
    if (el.id) {
      selector += '#' + el.id
      path.unshift(selector)
      break
    } else {
      let sib = el,
        nth = 1
      while ((sib = sib.previousElementSibling)) {
        if (sib.nodeName.toLowerCase() == selector) nth++
      }
      if (nth != 1) selector += ':nth-of-type(' + nth + ')'
    }
    path.unshift(selector)
    el = el.parentNode
  }
  return path.join('>')
}
// 写入剪贴板
function copyToClipboard (text) {
  var input = document.createElement('input');
  input.setAttribute('value', text);
  document.body.appendChild(input);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
  }
  document.body.removeChild(input);
}
// 获取当前鼠标指向的元素
function get_current_element (event) {
  x = event.clientX, y = event.clientY;
  let element = document.elementFromPoint(x, y);
  console.log('x:', x, 'y:', y)
  return element
}
// 鼠标点击事件
function track_mouse (event) {
  if (event.button == 2) {
    if (visible) return
    visible = true
    var elementMouseIsOver = get_current_element(event)
    console.log('当前鼠标指向的元素是：', elementMouseIsOver)
    scrollTop = getScrollTop()
    selector = getSelectorRes(elementMouseIsOver)
    console.log('result:', selector)
    const matchResult = elementMouseIsOver
    if (matchResult) {
      console.log(document.querySelector(selector))
      showConfirm()
    } else {
      // 写入剪贴板
      console.log('未匹配到元素')
    }
  }
  // 鼠标左键点击，不是弹窗区域就关闭弹窗
  if(event.button == 0) {
    var elementMouseIsOver = get_current_element(event)
    const confirm = document.querySelector('#confirm')
    if(confirm){
      if(confirm.contains(elementMouseIsOver)) return
      removeConfirm()
    }
  }
}

// 获取页面滚动条高度
function getScrollTop() {
  var scroll_top = 0;
  if (document.documentElement && document.documentElement.scrollTop) {
      scroll_top = document.documentElement.scrollTop;
  }
  else if (document.body) {
      scroll_top = document.body.scrollTop;
  }
  return scroll_top;
}

// 选择按钮的弹窗
function showConfirm () {
  const confirm = document.createElement('div')
  confirm.id = 'confirm'
  confirm.innerHTML = `
    <div class="confirm">
      <div class="confirm-content">
        <h3 style="text-align: center">当前鼠标选中的值</h3>
        <p>元素选择器 or x/y坐标 or 滚动条高度(scrollTop)？</p>
      </div>
      <div class="confirm-btn">
        <button class="btn confirm-btn-cancel">复制选择器</button>
        <button class="btn confirm-btn-ok">复制x、y坐标</button>
        <button class="btn confirm-btn-scroll">复制scrollTop</button>
      </div>
    </div>
  `
  confirm.style.cssText = `
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #000;
    color: #fff;
    padding: 10px 16px;
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px;
    z-index: 9999;
    opacity: 1;
  `
  document.body.appendChild(confirm)
  const buttonGroup = confirm.querySelector('.confirm-btn')
  const cancel = confirm.querySelector('.confirm-btn-cancel')
  const ok = confirm.querySelector('.confirm-btn-ok')
  const scroll = confirm.querySelector('.confirm-btn-scroll')
  buttonGroup.style.cssText = `
    display: flex;
    justify-content: space-around;  
    gap: 10px;
    margin: 10px;
  `
  for(let i = 0; i < buttonGroup.children.length; i++) {
    buttonGroup.children[i].style.cssText = `
      padding: 5px 10px;
      border-radius: 5px;
      color: #000;
      opacity: 1;
      background: #fff`
  }
  cancel.addEventListener('click', () => {
    copyToClipboard(selector)
    removeConfirm()
  })
  ok.addEventListener('click', () => {
    copyToClipboard(`${x} ${y}`)
    removeConfirm()
  })
  scroll.addEventListener('click', () => {
    copyToClipboard(scrollTop)
    removeConfirm()
  })
}

// 关闭弹窗
function removeConfirm () {
  if(!visible) return
  document.querySelector('#confirm').remove()
  visible = false
}

// 监听键盘esc键
document.onkeydown = function (e) {
  if (e.keyCode === 27){
    removeConfirm()
  }
}

window.oncontextmenu = function (e) {
  e.preventDefault()
}
window.onmousedown = track_mouse
    // Your code here...
})();