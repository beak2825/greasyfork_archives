// ==UserScript==
// @name         idlepoe按键装备改造
// @namespace    http://tampermonkey.net/
// @version      2024-01-11.1
// @description  按键装备改造!
// @author       You
// @match        https://idlepoe.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idlepoe.com
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener

// @run-at       document-end

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/484518/idlepoe%E6%8C%89%E9%94%AE%E8%A3%85%E5%A4%87%E6%94%B9%E9%80%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/484518/idlepoe%E6%8C%89%E9%94%AE%E8%A3%85%E5%A4%87%E6%94%B9%E9%80%A0.meta.js
// ==/UserScript==


(function() {
    'use strict';


const keyMap = new Map([
   ['g', '改造'],
   ['z', '增幅'],
   ['t', '蜕变'],
   ['f', '富豪'],
   ['c', '重铸'],
   ['b', '剥离'],
   ['C', '崇高'],
   ['h', '混沌']
])

let switchFlag = GM_getValue('SWITCH', false)
function createSwitch() {
   if (document.querySelector('.switch-key')) return
   const switchBtn = document.createElement('input')
   const label = document.createElement('label')
   const text = document.createTextNode('按键操作')
   switchBtn.id = 'switch-key'
   switchBtn.type = 'checkbox'
   switchBtn.checked = switchFlag
   switchBtn.classList.add('switch-key')
   switchBtn.style = 'margin-right: 5px'
   label.for = 'switch-key'
   label.style = 'margin-right: auto'
   label.appendChild(switchBtn)
   label.appendChild(text)
   document.querySelector('.confirm-switch-container').insertBefore(label, document.querySelector('.confirm-switch-container button'))
}
function keyListener(event) {
    if (!document.querySelector('.actions')) return
    const actionButtonList = Array.from(document.querySelectorAll('.actions button'))
    const getActionBtnWithText = text => actionButtonList.find(el => el.textContent.includes(text))
    const orb = keyMap.get(event.key)
    if (!orb) return
    const orbButton = getActionBtnWithText(orb)
    orbButton.click()
}
function abserveKey() {
   if (switchFlag) {
       document.addEventListener('keydown', keyListener);
   } else {
       document.removeEventListener('keydown', keyListener);
   }
}
const elementClass = '.confirm-switch-container';

// 创建一个回调函数，当观察到变动时将会执行
const observerCallback = (mutationsList, observer) => {

  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const element = document.querySelector(elementClass);
      if (element) {
        createSwitch()
        //observer.disconnect(); // 断开观察器连接
      }
    }
  }
};
    // 创建一个配置对象，只在子元素变动时触发回调
const observerConfig = { attributes: false, childList: true, subtree: true };

// 创建 MutationObserver 实例并传入回调函数
const observer = new MutationObserver(observerCallback);

// 调用 observe 方法开始观察整个文档树的变动
observer.observe(document.body, {childList: true});

document.addEventListener('change', function(event) {
   if (event.target && event.target.matches('.switch-key')) {
       switchFlag = event.target.checked
       GM_setValue('SWITCH', switchFlag)
   }
})
GM_addValueChangeListener('SWITCH', (key, ov, nv) => {
   if (nv) {
       window.alert('通货按键对应：\ng,改造\nz,增幅\nt,蜕变\nf,富豪\nc,重铸\nb,剥离\nC（大写）,崇高,\nh,混沌')
   }
   abserveKey()
})
abserveKey()
    // Your code here...
})();