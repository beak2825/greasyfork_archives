// ==UserScript==
// @name         98定位资源位置
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  在页面上添加一个按钮，点击后连续滚动到定位资源位置
// @author       bbbyqq
// @match        *://*/forum.php?mod=viewthread*
// @license      bbbyqq
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/523451/98%E5%AE%9A%E4%BD%8D%E8%B5%84%E6%BA%90%E4%BD%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/523451/98%E5%AE%9A%E4%BD%8D%E8%B5%84%E6%BA%90%E4%BD%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // 判断是PC端还是手机端
  var isMobile = ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone'].some(device => navigator.userAgent.includes(device))

  // 创建一个按钮并添加到页面上
  if (isMobile) {  // 手机端
    // 获取目标元素
    var threadBtnBar = document.getElementById('thread_btn_bar')
    // 创建一个新的 <a> 元素
    var locationBtn = document.createElement('a')
    locationBtn.id = 'location_btn'
    locationBtn.className = 'btn js-req'
    locationBtn.style.cssText = 'display: flex; align-items: center; justify-content: center; flex-direction: column; margin-top: 2px;'
    locationBtn.innerHTML = `<svg viewBox="0 0 1024 1024" width="20" height="20">
                                    <path d="M927.282215 479.83544l-83.4629 0c-15.068184-158.75777-141.389194-285.078781-300.146964-300.146964L543.67235 95.835695c0-17.622356-14.285355-31.907711-31.907711-31.907711-17.622356 0-31.907711 14.285355-31.907711 31.907711l0 83.85278c-158.75777 15.068184-285.078781 141.389194-300.146964 300.146964l-83.826174 0c-17.622356 0-31.907711 14.285355-31.907711 31.907711 0 17.622356 14.285355 31.907711 31.907711 31.907711l83.826174 0c15.068184 158.75777 141.389194 285.078781 300.146964 300.146964l0 83.946924c0 17.622356 14.285355 31.907711 31.907711 31.907711 17.622356 0 31.907711-14.285355 31.907711-31.907711l0-83.946924c158.75777-15.068184 285.078781-141.389194 300.146964-300.146964l83.4629 0c17.622356 0 31.907711-14.285355 31.907711-31.907711C959.189925 494.120794 944.904571 479.83544 927.282215 479.83544zM511.76464 793.112446c-155.396209 0-281.369296-125.973086-281.369296-281.369296s125.973086-281.369296 281.369296-281.369296 281.369296 125.973086 281.369296 281.369296S667.159826 793.112446 511.76464 793.112446z" fill="#0086ce" p-id="4182"></path><path d="M511.76464 511.74315m-69.616544 0a68.031 68.031 0 1 0 139.233088 0 68.031 68.031 0 1 0-139.233088 0Z" fill="#0086ce" p-id="4183"></path>
                                </svg>
                                <span>资源位置</span>`
    threadBtnBar.appendChild(locationBtn)
  } else { // pc端
    var button = document.createElement('button')
    button.innerHTML = `<button id="location_btn" style="position: fixed; top: 10px; right: 10px; z-index: 9999; background-color: #4CAF50; color: white; border: none; padding: 5px 10px; text-align: center; cursor: pointer; font-size: 14px; border-radius: 5px;">
                                定位资源位置
                            </button>`
    document.body.appendChild(button)
  }

  // 定义资源类型数组
  var resourceTypes = [
    '复制代码',
    '.txt',
    '.zip',
    '.rar',
    '.7z',
    '本主题需向作者支付'
  ]

  // 存储找到的资源位置
  var resourcePositions = []
  // 当前资源位置索引
  var currentIndex = 0

  // 检查节点是否为script标签或其子节点
  function isScriptOrChild(node) {
    while (node) {
      if (node.tagName === 'SCRIPT') {
        return true
      }
      node = node.parentNode
    }
    return false
  }

  // 为按钮添加点击事件
  document.querySelector('#location_btn').addEventListener('click', function () {
    // 如果是第一次点击或者资源位置列表为空，重新查找资源
    if (currentIndex === 0 || resourcePositions.length === 0) {
      resourcePositions = [] // 清空之前的资源位置
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false)
      var node
      while ((node = walker.nextNode())) {
        // 跳过script标签及其子节点
        if (isScriptOrChild(node)) {
          continue
        }
        var text = node.nodeValue.toLowerCase()
        // 检查文本是否包含数组中的任何一个资源类型
        resourceTypes.forEach(function (type) {
          if (text.includes(type)) {
            console.log('匹配文本:', text)
            // 如果找到资源，存储父节点位置
            resourcePositions.push(node.parentNode)
          }
        })
      }
    }

    // 如果找到资源位置，滚动到下一个资源位置
    if (resourcePositions.length > 0) {
      // 更新当前资源位置索引
      currentIndex = (currentIndex + 1) % resourcePositions.length
      var nextResource = resourcePositions[currentIndex]
      // 滚动到资源位置
      if (isMobile) { // 手机端
        document.querySelector('#mescroll').scrollBy({
          top: nextResource.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 2),
          behavior: 'smooth'
        })
      } else { // PC端
        console.log(nextResource.getBoundingClientRect().top)
        window.scrollTo({
          top: nextResource.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 2),
          behavior: 'smooth'
        })
      }
      blinkElement(nextResource, 2)
    } else {
      showAlert('没有找到资源！', 2000)
    }
  })

  // 高亮闪烁元素
  function blinkElement(element, blinkCount) {
    // 如果元素已经在闪烁，则先停止之前的闪烁
    if (element.blinkTimeoutId) {
      clearTimeout(element.blinkTimeoutId)
      element.style.backgroundColor = element.originalBackgroundColor
    }

    var blinkColor = '#ffbd64' // 设置闪烁颜色
    var blinkTimes = 0 // 记录闪烁次数
    var interval = 300 // 设置闪烁间隔时间，单位为毫秒

    // 保存原始背景色
    element.originalBackgroundColor = element.style.backgroundColor

    function doBlink() {
      // 切换背景色以实现闪烁效果
      element.style.backgroundColor = blinkTimes % 2 ? element.originalBackgroundColor : blinkColor

      blinkTimes++

      // 如果闪烁次数未达到指定的闪烁次数的两倍，则继续闪烁
      if (blinkTimes < blinkCount * 2) {
        element.blinkTimeoutId = setTimeout(doBlink, interval)
      } else {
        // 闪烁完成，恢复原始背景色
        element.style.backgroundColor = element.originalBackgroundColor
        delete element.blinkTimeoutId // 清除定时器引用
      }
    }

    // 开始闪烁
    doBlink()
  }

  // 创建一个消息弹窗并添加到页面上
  var customAlert = document.createElement('div')
  customAlert.id = 'customAlert'
  customAlert.className = 'custom-alert'
  customAlert.style.cssText = `position: fixed;top: 1%;left: 50%;transform: translate(-50%, 0px);padding: 5px 20px;z-index: 1000;border-radius: 3px;box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 10px;width: ${isMobile ? '40%' : '30%'};font-size: 14px;background: #fef0f0;color: #f56c6c;display: flex;display: none;`
  customAlert.innerHTML = `<div style="display:flex;align-items: center;">
                                <svg style="margin-right: 10px;" viewBox="0 0 1024 1024" width="20" height="20"><path d="M511.18289 884.372939c-207.708646 0-376.086517-168.379918-376.086517-376.09675 0-207.707622 168.376848-376.085494 376.086517-376.085494 207.709669 0 376.087541 168.377872 376.087541 376.085494C887.270431 715.993021 718.889489 884.372939 511.18289 884.372939L511.18289 884.372939zM676.379303 378.785999c3.394307-3.38612 3.394307-8.891508 0-12.273535l-6.136767-6.138814c-3.387144-3.39533-8.881274-3.39533-12.273535 0L519.811408 498.516918 383.257336 361.975125c-3.373841-3.377934-8.850575-3.377934-12.224416 0l-6.113231 6.115278c-3.373841 3.377934-3.373841 8.847505 0 12.224416l136.547933 136.546909L363.275235 655.067416c-3.391237 3.391237-3.391237 8.890484 0 12.273535l6.142907 6.138814c3.391237 3.39533 8.884344 3.39533 12.273535 0l138.197502-138.202619 138.472771 138.484028c3.377934 3.377934 8.846482 3.377934 12.223393 0l6.115278-6.117324c3.377934-3.375887 3.377934-8.847505 0-12.224416l-138.473795-138.481981L676.379303 378.785999 676.379303 378.785999zM676.379303 378.785999" fill="#f56c6c" p-id="4511"></path></svg>
                                <p></p>
                            </div>`
  document.body.appendChild(customAlert)

  // 显示自定义消息弹窗
  function showAlert(message, duration) {
    var alertBox = document.getElementById('customAlert')
    document.querySelector('#customAlert p').innerText = message
    alertBox.style.display = 'block'
    setTimeout(function () {
      alertBox.style.display = 'none'
    }, duration)
  }
})()
