// ==UserScript==
// @name         DisableScrollScript
// @namespace    http://tampermonkey.net/
// @version      2024.11.18.4
// @description  禁止滚动
// @author       荷塘月色
// @include      *://*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517777/DisableScrollScript.user.js
// @updateURL https://update.greasyfork.org/scripts/517777/DisableScrollScript.meta.js
// ==/UserScript==

(function() {
  const wrapper = document.createElement('div')
  document.body.appendChild(wrapper)
  wrapper.classList.add('custom-wrapper')
  const dragEl = document.createElement('div')
  dragEl.classList.add('custom-drag-element')
  const defaultStyleClass = document.createElement('style')
  const hiddenStyleClass = document.createElement('style')
  const button = document.createElement('button')
  wrapper.appendChild(button)
  wrapper.appendChild(dragEl)
  document.head.appendChild(defaultStyleClass)
  button.innerText = '锁定'
  button.classList.add('custom-button')

  const offset = { x: 0, y: 0 }
  let isDragging = false

  dragEl.addEventListener('touchstart', e => {
    isDragging = true
    const touch = e.touches[0] // 获取第一个触摸点
    offset.x = touch.clientX - wrapper.getBoundingClientRect().left
    offset.y = touch.clientY - wrapper.getBoundingClientRect().top
    e.preventDefault()
  })

  dragEl.addEventListener('mousedown', (ev) => {
    isDragging = true
    offset.x = ev.clientX - wrapper.getBoundingClientRect().left
    offset.y = ev.clientY - wrapper.getBoundingClientRect().top
  })

  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      wrapper.style.left = (e.clientX - offset.x) + 'px'
      wrapper.style.top = (e.clientY - offset.y) + 'px'
    }
  })

  document.addEventListener('mouseup', function() {
    isDragging = false
  })

  document.addEventListener('touchmove', function(e) {
    if (isDragging) {
      const touch = e.touches[0] // 获取第一个触摸点
      wrapper.style.left = (touch.clientX - offset.x) + 'px'
      wrapper.style.top = (touch.clientY - offset.y) + 'px'
    }
  })

  document.addEventListener('touchend', function() {
    isDragging = false
  })

  button.addEventListener('click', () => {
    if (document.head.contains(hiddenStyleClass)) {
      document.head.removeChild(hiddenStyleClass)
      button.innerText = '锁定'
    } else {
      document.head.appendChild(hiddenStyleClass)
      button.innerText = '解锁'
    }
  })

  function Camel2Kebab(string) {
    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  }

  /* 通用 JSON 转 CSS 方法 */
  function Json2Css(complexStyleObject) {
    let cssString = ''

    for (const selector in complexStyleObject) {
      if (selector.startsWith('@')) { /* 处理媒体查询和其他@规则 */
        cssString += `${selector} { `
        for (const innerSelector in complexStyleObject[selector]) {
          cssString += `${innerSelector} { `
          const styles = complexStyleObject[selector][innerSelector]
          for (const prop in styles) {
            cssString += `${Camel2Kebab(prop)}: ${styles[prop]}; `
          }
          cssString += '} '
        }
        cssString += '} '
      } else {
        cssString += `${selector} { `
        const styles = complexStyleObject[selector]
        for (const prop in styles) {
          cssString += `${Camel2Kebab(prop)}: ${styles[prop]}; `
        }
        cssString += '} '
      }
    }

    return cssString
  }

  const hiddenStylesJSON = {
    '*': {
      // 'overflow': 'hidden !important',
      // 'touch-action': 'none'
    }
  }
  hiddenStyleClass.innerHTML = `${Json2Css(hiddenStylesJSON)}`

  const defaultStylesJSON = {
    '.custom-wrapper': {
      'zIndex': '10000',
      'position': 'fixed',
      'top': '10px',
      'left': '10px',
      'padding': '4px',
      'display': 'flex',
      'flexDirection': 'column',
      'gap': '4px',
      'background': 'rgb(255,255,255)',
      'border-radius': '2px',
      'border': '1px solid #666',
      'box-sizing': 'border-box',
    },
    '.custom-button': {
      'padding': '0.25em 1em',
      // 'border-radius': '4px 4px 0 0',
      'border-radius': '2px',
      'border': '1px solid #666',
      'cursor': 'pointer',
      'color': '#333',
      'font-size': '0.875em',
      'box-sizing': 'border-box',
    },
    '.custom-drag-element': {
      'width': '100%',
      'height': '6px',
      'background': 'rgba(0,0,0,0.25)',
      'border': '1px solid #666',
      // 'border-radius': '0 0 4px 4px',
      'border-radius': '2px',
      'cursor': 'pointer',
      'box-sizing': 'border-box',
    }
  }
  defaultStyleClass.innerHTML = `${Json2Css(defaultStylesJSON)}`

  function preventScroll(e) {
    if (document.head.contains(hiddenStyleClass))
      e.preventDefault()
  }

  window.addEventListener('wheel', preventScroll, { passive: false }) // 鼠标滚轮
  window.addEventListener('touchmove', preventScroll, { passive: false }) // 移动设备触摸滑动

  // 确保按钮能在页面里
  setInterval(() => {
    if (!document.body.contains(wrapper)) {
      document.body.appendChild(wrapper)
    }
  }, 100)
})()