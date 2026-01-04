// ==UserScript==
// @name         回到顶部、前往底部
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  自动生成一套【前往底部】和【回到顶部】按钮，补充网站功能
// @author       CoderBen
// @match        *://*/*
// @exclude      *://10.*
// @exclude      http://localhost:*
// @icon         https://cdn3.iconfinder.com/data/icons/leto-space/64/__rocket_spaceship-64.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459651/%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E3%80%81%E5%89%8D%E5%BE%80%E5%BA%95%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/459651/%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E3%80%81%E5%89%8D%E5%BE%80%E5%BA%95%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let menu
    let rightClickedBtnId = ''

    if (window.frames.length === parent.frames.length) {
      createStyle()
      createButtonToTop()
      createButtonToBottom()
      createMenu()

      if (menu) {
        window.addEventListener('click', function() {
            menu?.classList.remove('coderben__active')
        })
      }
    }

    function createStyle() {
      const style = document.createElement('style')
      style.innerHTML = `
          .coderben__menu{
            position: absolute;
            bottom: 50px;
            left: 50px;
            font-size: 14px;
            font-weight: normal;
            background: #eee;
            border: 1px solid #dadce0;
            visibility: hidden;
        }
        .coderben__menu__item {
            min-width: 100px;
            cursor: pointer;
        }
        .coderben__menu__item:hover {
            background-color: #ccc;
        }
        .coderben__active{
            visibility: visible;
        }
      `
      document.head.appendChild(style)
    }

    function getTargetButton() {
      return document.getElementById(rightClickedBtnId)
    }

    function handleHide() {
      const target = getTargetButton()
      if (!target) return
      target.style.display = 'none'
    }

    function checkPosition(x, y) {
      if (x > window.innerWidth - 50) {
        alert('超出屏幕宽度，请重新操作')
        return false
      }
      if (y > window.innerHeight - 50) {
        alert('超出屏幕高度，请重新操作')
        return false
      }
      return true
    }

    function initMenuPosition(x, y) {
      if (!menu) return
      const menuSize = 102
      if (x <= menuSize) {
        menu.style.left = '50px'
        menu.style.right = 'auto'
      }
      if (x >= window.innerWidth - menuSize - 50) {
        menu.style.right = '50px'
        menu.style.left = 'auto'
      }
      if (y <= menuSize) {
        menu.style.top = '50px'
        menu.style.bottom = 'auto'
      }
      if (y >= window.innerHeight - menuSize - 50) {
        menu.style.bottom = '50px'
        menu.style.top = 'auto'
      }
    }

    function handleChangePosition() {
      const target = getTargetButton()
      if (!target) return
      const {right, bottom, width, height, left, top} = target.style
      const l = parseInt(left) || (window.innerWidth - parseInt(right) - parseInt(width))
      const t = parseInt(top) || (window.innerHeight - parseInt(bottom) - parseInt(height))
      const position = window.prompt('请输入要设置的坐标，基于屏幕左上角，以逗号分隔，比如"1000,150"', `${l},${t}`)
      if (!position) return
      let [x, y] = position.split(',')
      x = parseInt(x)
      y = parseInt(y)
      if (Object.is(x, NaN) || Object.is(y, NaN)) {
        alert('坐标格式不正确')
        return
      }
      if (!checkPosition(x, y)) return
      target.style.left = x + 'px'
      target.style.top = y + 'px'

      initMenuPosition(x, y)

      localStorage.setItem('coderben__position_' + rightClickedBtnId, x + ',' + y)
    }

    function createMenu() {
      menu = document.createElement('div')
      menu.id = 'coderben__menu'
      menu.classList.add('coderben__menu')

      const menuItem1 = document.createElement('div')
      menuItem1.innerText = '隐藏按钮'
      menuItem1.classList.add('coderben__menu__item')
      menuItem1.onclick = (e) => {
        e.stopPropagation()
        handleHide()
      }
      menu.appendChild(menuItem1)

      const menuItem2 = document.createElement('div')
      menuItem2.innerText = '设置按钮位置'
      menuItem2.classList.add('coderben__menu__item')
      menuItem2.onclick = (e) => {
        e.stopPropagation()
        menu.classList.remove('coderben__active')
        handleChangePosition()
      }
      menu.appendChild(menuItem2)
    }

    function hanleRightClick(e, btn) {
      e.preventDefault()
      rightClickedBtnId = btn.id

      if (!menu) return
      menu.classList.add('coderben__active')
      menu.remove()
      btn.appendChild(menu)

      initMenuPosition(btn.offsetLeft, btn.offsetTop)
    }

    function loadInitialPosition(btn) {
      const p = localStorage.getItem('coderben__position_' + btn.id)
      if (p) {
        const [x, y] = p.split(',')
        btn.style.left = x + 'px'
        btn.style.top = y + 'px'
      }
    }

    function createButtonToTop() {
      const btn = document.createElement('div')
      btn.id = 'coderben__btn-to-top'
      btn.innerHTML = `
        <img
          width="50px"
          height="50px"
          alt="↑"
          title="回到顶部(右键打开菜单)"
          src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07aGVpZ2h0OiAxZW07dmVydGljYWwtYWxpZ246IG1pZGRsZTtmaWxsOiBjdXJyZW50Q29sb3I7b3ZlcmZsb3c6IGhpZGRlbjsiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwLWlkPSI3ODY1Ij48cGF0aCBkPSJNNzIzLjIgMTMxLjJoLTQ4MGMtMjIuNCAwLTQwLTE3LjYtNDAtNDBzMTcuNi00MCA0MC00MGg0ODBjMjIuNCAwIDQwIDE3LjYgNDAgNDBzLTE3LjYgNDAtNDAgNDB6IiBmaWxsPSIjRTM3RTQzIiBwLWlkPSI3ODY2Ij48L3BhdGg+PHBhdGggZD0iTTgyNS42IDQ0MGwtMjYyLjQtMjI0Yy0xNy42LTIyLjQtNDEuNi0zNS4yLTY1LjYtMzUuMnMtNDkuNiAxMi44LTY1LjYgMzUuMmwtMjYyLjQgMjI0Yy0xNiAxNC40LTE5LjIgNDAtNC44IDU2IDE0LjQgMTcuNiA0MCAxOS4yIDU2IDQuOGwyMzYuOC0yMDEuNnY2ODBjMCAyMi40IDE3LjYgNDAgNDAgNDBzNDAtMTcuNiA0MC00MFYyOTkuMmwyMzYuOCAyMDEuNmM4IDYuNCAxNiA5LjYgMjUuNiA5LjYgMTEuMiAwIDIyLjQtNC44IDMwLjQtMTQuNCAxMi44LTE2IDExLjItNDEuNi00LjgtNTZ6IiBmaWxsPSIjRTc0RDMxIiBwLWlkPSI3ODY3Ij48L3BhdGg+PC9zdmc+"
          />
      `
      btn.style.fontSize = '28px'
      btn.style.fontWeight = 900
      btn.style.textAlign = 'center'
      btn.style.lineHeight = '50px'
      btn.style.cursor = 'pointer'
      btn.style.width = '50px'
      btn.style.height = '50px'
      btn.style.background = 'transparent'
      btn.style.position = 'fixed'
      btn.style.right = '400px'
      btn.style.bottom = '50px'
      loadInitialPosition(btn)
      btn.style.zIndex = 1001
      btn.onclick = () => scrollTo(0, 0)
      btn.oncontextmenu = (e) => hanleRightClick(e, btn)
      document.body.appendChild(btn)
    }

    function createButtonToBottom() {
      const btn = document.createElement('div')
      btn.id = 'coderben__btn-to-bottom'
      btn.innerHTML = `
        <img
          width="50px"
          height="50px"
          alt="↓"
          title="前往底部(右键打开菜单)"
          src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgc3R5bGU9IndpZHRoOiAxZW07aGVpZ2h0OiAxZW07dmVydGljYWwtYWxpZ246IG1pZGRsZTtmaWxsOiBjdXJyZW50Q29sb3I7b3ZlcmZsb3c6IGhpZGRlbjsiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBwLWlkPSI5MjI3Ij48cGF0aCBkPSJNNzIzLjIgOTM5LjJoLTQ4MGMtMjIuNCAwLTQwIDE3LjYtNDAgNDBzMTcuNiA0MCA0MCA0MGg0ODBjMjIuNCAwIDQwLTE3LjYgNDAtNDBzLTE3LjYtNDAtNDAtNDB6IiBmaWxsPSIjRTM3RTQzIiBwLWlkPSI5MjI4Ij48L3BhdGg+PHBhdGggZD0iTTgyNS42IDYyOC44bC0yNjIuNCAyMjRjLTE3LjYgMjIuNC00MS42IDM1LjItNjUuNiAzNS4ycy00OS42LTEyLjgtNjUuNi0zNS4ybC0yNjIuNC0yMjRjLTE2LTE0LjQtMTkuMi00MC00LjgtNTYgMTQuNC0xNy42IDQwLTE5LjIgNTYtNC44bDIzNi44IDIwMS42VjkxLjJjMC0yMi40IDE3LjYtNDAgNDAtNDBzNDAgMTcuNiA0MCA0MHY2ODBsMjM2LjgtMjAxLjZjOC02LjQgMTYtOS42IDI1LjYtOS42IDExLjIgMCAyMi40IDQuOCAzMC40IDE0LjQgMTIuOCAxNC40IDExLjIgNDAtNC44IDU0LjR6IiBmaWxsPSIjRTc0RDMxIiBwLWlkPSI5MjI5Ij48L3BhdGg+PC9zdmc+"/>
      `
      btn.style.fontSize = '28px'
      btn.style.fontWeight = 900
      btn.style.textAlign = 'center'
      btn.style.lineHeight = '50px'
      btn.style.cursor = 'pointer'
      btn.style.width = '50px'
      btn.style.height = '50px'
      btn.style.background = 'transparent'
      btn.style.position = 'fixed'
      btn.style.right = '466px'
      btn.style.bottom = '50px'
      loadInitialPosition(btn)
      btn.style.zIndex = 1001
      btn.onclick = () => scrollTo(0, 9999999999)
      btn.oncontextmenu = (e) => hanleRightClick(e, btn)
      document.body.appendChild(btn)
    }
})();
