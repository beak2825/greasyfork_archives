// ==UserScript==
// @name         Logo Changer
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Change logo and title of the website
// @author       You
// @match        https://www.mindskip.net:7002
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477180/Logo%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/477180/Logo%20Changer.meta.js
// ==/UserScript==

;(function () {
  // test6
  setTimeout(() => {
    const imageUrl =
      'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
    const targetlogo = document.querySelector('.sidebar-logo')
    const targettitle = document.querySelector('.sidebar-title')
    const menu = document.querySelector('.nest-menu')

    if (targetlogo) {
      targetlogo.src = imageUrl
    }

    if (targettitle) {
      targettitle.innerHTML = '百度'
    }

    // 获取包含学生列表的父容器元素
    const nestMenu = document.querySelector('.nest-menu')

    // 创建新的菜单项
    const newItem = document.createElement('li')

    newItem.setAttribute('id', 'myListItem')
    newItem.classList.add('el-menu-item')
    newItem.textContent = '灵曼科技'

    // 将菜单项添加到父容器中
    nestMenu.appendChild(newItem)

    // 获取菜单项元素
    const menuItem = document.querySelector('#myListItem')

    // 创建 iframe 元素
    const iframe = document.createElement('iframe')
    iframe.src = 'https://app.lingman.tech'
    iframe.style.width = '80%'
    iframe.style.height = '80%'

    // 点击事件处理程序
    menuItem.addEventListener('click', function () {
      // 弹出 iframe
      const modal = document.createElement('div')
      modal.style.position = 'fixed'
      modal.style.top = '0'
      modal.style.left = '0'
      modal.style.width = '100%'
      modal.style.height = '100%'
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
      modal.style.zIndex = '9999'

      // 添加 iframe 到 modal
      modal.appendChild(iframe)

      // 将 modal 添加到页面
      document.body.appendChild(modal)
    })
  }, 200)
})()
