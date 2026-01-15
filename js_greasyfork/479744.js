// ==UserScript==
// @name         吾爱后台管理全选
// @namespace    https://greasyfork.org/zh-CN/scripts/479744
// @version      1.1.2
// @description  吾爱后台管理全选(除第一个)
// @author       冰冻大西瓜
// @match        https://www.52pojie.cn/forum.php?mod=modcp&action=thread&op=post*
// @license      AGPL-3.0-only
// @grant        GM_addStyle
// @note         2024年6月14日 更新分表样式,提高管理效率
// @note         2026年1月11日 显示全部分表按钮并修改查询时间为2008-03-13
// @downloadURL https://update.greasyfork.org/scripts/479744/%E5%90%BE%E7%88%B1%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E5%85%A8%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/479744/%E5%90%BE%E7%88%B1%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E5%85%A8%E9%80%89.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // ==================== 样式定义 ====================
  GM_addStyle(`
    #posttableid_ctrl {
      display: none;
    }
    .table-btn-active {
      background-color: #ffbd10;
    }
    .table-btn-container {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      flex-wrap: wrap;
    }
    .table-btn-container button {
      font-family: monospace !important;
      width: 80px;
      margin: 3px 5px;
    }
    .table-btn-left {
      display: flex;
      flex-direction: column;
      gap: 5px;
      flex-shrink: 0;
      background: #a3d0ed;
      border-radius: 5px;
    }
    .table-btn-right {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(2, auto);
      gap: 5px;
      flex: 1;
    }
    .table-btn-right button:nth-child(n+6):nth-child(-n+10) {
      grid-row: 2;
    }
      /* 定义排列顺序 */
    .table-btn-right button:nth-child(6) { grid-column: 5; }
    .table-btn-right button:nth-child(7) { grid-column: 4; }
    .table-btn-right button:nth-child(8) { grid-column: 3; }
    .table-btn-right button:nth-child(9) { grid-column: 2; }
    .table-btn-right button:nth-child(10) { grid-column: 1; }
  `)

  // 全局绑定提交按钮
  const searchSubmit = document.querySelector('#searchsubmit')
  // ==================== 工具函数 ====================
  /**
   * 创建按钮
   * @param {string} text - 按钮文本
   * @param {Function} onClick - 点击事件处理函数
   * @returns {HTMLButtonElement}
   */
  function createButton(text, onClick) {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = text
    button.style.margin = '0 10px'
    button.onclick = onClick
    return button
  }

  // ==================== 功能1: 全选和删除按钮 ====================
  function initSelectAllAndDeleteButtons() {
    const target = document.querySelector('.mtm.mbm')
    if (!target) return

    // 创建"除第一条全选"按钮
    const selectAllBtn = createButton('除第一条 全选', () => {
      const inputs = document.querySelectorAll('input[name="delete[]"]')
      inputs.forEach((item, index) => {
        if (index !== 0) {
          item.checked = true
        }
      })
    })
    target.appendChild(selectAllBtn)

    // 创建"删除"按钮
    const originalDeleteBtn = document.querySelector('#deletesubmit')
    if (originalDeleteBtn) {
      const deleteBtn = createButton('删除', () => {
        originalDeleteBtn.click()
      })
      target.appendChild(deleteBtn)
    }
  }

  // ==================== 功能2: 帖子分表优化 ====================
  function initTableSelector() {
    const table = document.querySelector('td[colspan="3"]>span.ftid')
    if (!table) return

    const select = table.querySelector('#posttableid')

    const menuItems = Array.from(document.querySelectorAll('#posttableid_ctrl_menu ul li'))

    if (!select || !searchSubmit || menuItems.length === 0) return

    // 创建容器
    const container = document.createElement('div')
    container.className = 'table-btn-container'

    const leftBox = document.createElement('div')
    leftBox.className = 'table-btn-left'

    const rightBox = document.createElement('div')
    rightBox.className = 'table-btn-right'

    // 创建所有分表按钮
    const allButtons = []
    menuItems.forEach((item, index) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = item.textContent
      button.dataset.index = index
      allButtons.push(button)

      // 第一个和最后一个放左边，其他放右边
      if (index === 0 || index === menuItems.length - 1) {
        leftBox.appendChild(button)
      } else {
        rightBox.appendChild(button)
      }
    })

    // 高亮当前选中的分表按钮
    const currentSelectedValue = select.value
    const highlightIndex = menuItems.findIndex(item => {
      const tableName = item.textContent.split('post_')[1]
      return tableName === currentSelectedValue
    })
    if (highlightIndex !== -1) {
      allButtons[highlightIndex].classList.add('table-btn-active')
    }

    // 添加点击事件委托
    container.addEventListener('click', event => {
      if (event.target.nodeName !== 'BUTTON') return

      // 移除所有按钮的高亮
      allButtons.forEach(btn => btn.classList.remove('table-btn-active'))

      // 高亮当前点击的按钮
      event.target.classList.add('table-btn-active')

      // 更新选择器并提交搜索
      const tableName = event.target.textContent.split('post_')[1]
      select.querySelector('option').value = tableName
      searchSubmit.click()
    })

    container.appendChild(leftBox)
    container.appendChild(rightBox)
    table.appendChild(container)
  }

  // ==================== 功能3: 修改默认查询时间 ====================
  function initDefaultStartTime() {
    const startTimeInput = document.querySelector('input[name="starttime"]')
    if (!startTimeInput) return
    if (startTimeInput.value !== '2008-03-13') {
      startTimeInput.value = '2008-03-13'

      // 触发事件，确保页面响应变化
      startTimeInput.dispatchEvent(new Event('change', { bubbles: true }))
      startTimeInput.dispatchEvent(new Event('input', { bubbles: true }))
      // 提交一次保证时间切换生效
      searchSubmit.click()
    }
  }

  // ==================== 主函数 ====================
  function init() {
    initSelectAllAndDeleteButtons()
    initTableSelector()
    initDefaultStartTime()
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
