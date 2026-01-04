// ==UserScript==
// @name         哪里不要点哪里
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  将鼠标放置在不想要的网页内容上然后点击即可去掉，适用于想要将网页保存为pdf时但有不需要内容时的场景
// @author       starrysky
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416756/%E5%93%AA%E9%87%8C%E4%B8%8D%E8%A6%81%E7%82%B9%E5%93%AA%E9%87%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/416756/%E5%93%AA%E9%87%8C%E4%B8%8D%E8%A6%81%E7%82%B9%E5%93%AA%E9%87%8C.meta.js
// ==/UserScript==

(function () {
  'use strict'
  var CACAHE_KEY = 'start_sky_script_wipe'
  var OPERA_MODE = 1 // 1 普通模式 2 存储模式 3 清理缓存
  var PAGE_ALL_DOMS // 全部dom
  var removeDomList = [] // 需要移除的dom
  window.addEventListener('load', registerClearScript)

  function registerClearScript() {
    PAGE_ALL_DOMS = document.querySelectorAll('*')
    removeFromCache()
    createOperaIcon()
  }

  function createOperaIcon() {
    // 容器
    var iconWrap = document.createElement('div')
    iconWrap.style.position = 'fixed'
    iconWrap.style.left = window.innerWidth - 64 + 'px'
    iconWrap.style.top = window.innerHeight - 64 + 'px'
    iconWrap.style.display = 'flex'
    iconWrap.style.width = '40px'
    iconWrap.style.height = '40px'
    iconWrap.style.cursor = 'move'
    iconWrap.style.borderRadius = '50%'
    iconWrap.style.backgroundColor = 'rgba(24, 144, 255, 0.85)'
    iconWrap.style.zIndex = 9999

    // 注册拖拽事件
    var isDrag = false
    var offsetX = 0
    var offsetY = 0
    function handleTouchDown(event) {
      isDrag = true
      offsetX = event.clientX - iconWrap.getBoundingClientRect().left
      offsetY = event.clientY - iconWrap.getBoundingClientRect().top
      if (window.PointerEvent) {
        document.addEventListener('pointermove', handleTouchMove)
      } else {
        document.addEventListener('mousemove', handleTouchMove)
      }
    }
    function handleTouchMove(event) {
      if (!isDrag) {
        return
      }
      iconWrap.style.left = event.x - offsetX + 'px'
      iconWrap.style.top = event.y - offsetY + 'px'
    }
    function handleTouchUp() {
      isDrag = false
      if (window.PointerEvent) {
        document.removeEventListener('pointermove', handleTouchMove)
      } else {
        document.removeEventListener('mousemove', handleTouchMove)
      }
    }
    if (window.PointerEvent) {
      iconWrap.addEventListener('pointerdown', handleTouchDown)
      iconWrap.addEventListener('pointerup', handleTouchUp)
    } else {
      iconWrap.addEventListener('mousedown', handleTouchDown)
      iconWrap.addEventListener('mouseup', handleTouchUp)
    }

    // 图标
    const iconEle = document.createElement('img')
    iconEle.style.width = '24px'
    iconEle.style.height = '24px'
    iconEle.style.margin = 'auto'
    iconEle.src =
      'data:image/png;base64,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'
    iconEle.addEventListener('dragstart', (event) => {
      event.preventDefault()
      return false
    })
    iconWrap.appendChild(iconEle)

    // 选择模式
    const btnWrap = document.createElement('div')
    btnWrap.style.display = 'none'
    btnWrap.style.position = 'absolute'
    btnWrap.style.left = '-100px'
    btnWrap.style.top = '-90px'
    const btnNoraml = document.createElement('button')
    btnNoraml.innerHTML = '普通模式'
    btnNoraml.dataset.code = 1
    const btnStorage = document.createElement('button')
    btnStorage.innerHTML = '存储模式'
    btnStorage.dataset.code = 2
    const btnClear = document.createElement('button')
    btnClear.innerHTML = '清除缓存'
    btnClear.dataset.code = 3
    ;[btnNoraml, btnStorage, btnClear].forEach((ele) => {
      ele.style.display = 'inline-block'
      ele.style.width = '80px'
      ele.style.height = '30px'
      ele.style.margin = '5px 10px'
      ele.style.fontSize = '14px'
      ele.style.cursor = 'pointer'
      ele.onclick = function () {
        OPERA_MODE = parseInt(ele.dataset.code)
        startScript()
        btnWrap.style.display = 'none'
      }
      btnWrap.appendChild(ele)
    })
    iconWrap.addEventListener('mouseenter', function () {
      btnWrap.style.display = 'block'
    })
    iconWrap.addEventListener('mouseleave', function () {
      btnWrap.style.display = 'none'
    })
    iconWrap.appendChild(btnWrap)

    // 注册关闭事件
    iconWrap.addEventListener('dblclick', stopScript)
    document.body.appendChild(iconWrap)
  }

  // 开启
  function startScript() {
    switch (OPERA_MODE) {
      case 1:
      case 2:
        addOperaEvent()
        break
      case 3:
        clearCache()
        break
    }
  }

  // 关闭
  function stopScript() {
    PAGE_ALL_DOMS.forEach((ele) => {
      if (ele.nodeName !== 'HTML' && ele.nodeName !== 'SCRIPT' && ele.nodeName !== 'BODY') {
        if (ele.dataset.backgroundColor) {
          ele.style.backgroundColor = ele.dataset.backgroundColor
        }
        ele.removeEventListener('click', hanldeDomClick)
        ele.removeEventListener('mouseenter', handleDomMouseEnter)
        ele.removeEventListener('mouseout', handleDomMouseOut)
      }
    })
    alert('【哪里不要点哪里】：脚本已关闭')
  }

  // 添加事件
  function addOperaEvent() {
    PAGE_ALL_DOMS.forEach((ele) => {
      if (ele.nodeName !== 'HTML' && ele.nodeName !== 'SCRIPT' && ele.nodeName !== 'BODY') {
        ele.addEventListener('click', hanldeDomClick)
        ele.addEventListener('mouseenter', handleDomMouseEnter)
        ele.addEventListener('mouseout', handleDomMouseOut)
      }
    })
  }

  // dom事件
  function hanldeDomClick(event) {
    var target = event.target || event.srcElement
    if (OPERA_MODE === 2) {
      removeDomList.push(calcCssPath(target))
      localStorage.setItem(CACAHE_KEY, JSON.stringify(removeDomList))
    }
    target && target.remove()
  }
  function handleDomMouseEnter(event) {
    var ele = event.target || event.srcElement
    ele.dataset.backgroundColor = ele.style.backgroundColor
    ele.style.backgroundColor = 'rgba(78,110,242,0.15)'
  }
  function handleDomMouseOut(event) {
    var ele = event.target || event.srcElement
    console.log('1', 111, ele.dataset.backgroundColor)
    if (ele.dataset.backgroundColor) {
      ele.style.backgroundColor = ele.dataset.backgroundColor
    }
  }

  // 计算css路径
  function calcCssPath(el) {
    if (!(el instanceof Element)) {
      return
    }
    var path = []
    while (el.nodeType === Node.ELEMENT_NODE) {
      var selector = el.nodeName.toLowerCase()
      if (el.id) {
        selector += '#' + el.id
        path.unshift(selector)
        break
      } else {
        var sib = el,
          nth = 1
        while ((sib = sib.previousElementSibling)) {
          if (sib.nodeName.toLowerCase() == selector) {
            nth++
          }
        }
        if (nth != 1) {
          selector += ':nth-of-type(' + nth + ')'
        }
      }
      path.unshift(selector)
      el = el.parentNode
    }
    return path.join(' > ')
  }

  // 根据缓存移除内容
  function removeFromCache() {
    var storageInfo = localStorage.getItem(CACAHE_KEY)
    if (storageInfo) {
      try {
        removeDomList = JSON.parse(storageInfo)
        removeDomList.forEach((selector) => {
          var node = document.querySelector(selector)
          node && node.remove()
        })
      } catch (error) {
        console.error('【哪里不要点哪里】：异常错误', error)
      }
    }
  }

  // 清除缓存
  function clearCache() {
    localStorage.removeItem(CACAHE_KEY)
    alert('存储数据已清理！')
  }
})();