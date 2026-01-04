// ==UserScript==
// @name                auto-click-checkbox-when-debug-mi 
// @name:zh-CN          调试设备时自动选择对应checkbox
// @namespace           http://tampermonkey.net/
// @version             0.0.1
// @description         调试米家虚拟设备时，修改对应属性值，自动勾选上前面的checkbox
// @description:zh-CN   调试米家虚拟设备时，修改对应属性值，自动勾选上前面的checkbox
// @author              kkopite
// @match               https://iot.mi.com/fe-op/productCenter/config/extension/debugger
// @require             https://code.jquery.com/jquery-3.6.0.slim.min.js
// @icon                https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/483654/auto-click-checkbox-when-debug-mi.user.js
// @updateURL https://update.greasyfork.org/scripts/483654/auto-click-checkbox-when-debug-mi.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const map = new Map()

  const observe = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach(mu => {
      if (mu.type === 'characterData') {
        const text = mu.target
        // 这里观察的是文字节点变化，需要去找到对应的父节点
        const parent = text.parentElement.closest('.ant-select')
        const label = map.get(parent)
        selectLable(label)
      } else if (mu.type === 'attributes') {
        if (mu.attributeName === 'value'
          || mu.attributeName === 'aria-checked') {
          const label = map.get(mu.target)
          selectLable(label)
        }
      }
    })
  })

  function selectLable(label) {
    if (label.classList.contains('ant-checkbox-wrapper-checked')) return
    label.click()
  }

  function init() {
    const eles = document.querySelectorAll('.ant-table-row');
    if (eles.length === 0) {
      setTimeout(() => {
        init()
      }, 1000)
      return
    }
    [...eles].forEach(ele => {
      const label = ele.querySelector('.ant-checkbox-wrapper')
      const target = ele.querySelector('.ant-switch')
        || ele.querySelector('.ant-select')
        || ele.querySelector('.ant-input')
        || ele.querySelector('.ant-input-number-input')
      map.set(target, label)
      if (target.classList.contains('ant-select')) {
        observe.observe(target, {
          characterData: true,
          subtree: true
        })
      } else {
        observe.observe(target, {
          attributes: true
        })
      }
    })
  }

  init()

})()