// ==UserScript==
// @name         Bug评审
// @namespace    http://www.akuvox.com/
// @version      0.0.3
// @description  Bug Review Assistant JS
// @author       liuchaoming
// @match        http://192.168.10.17/zentao/bug-view-*.html*
// @match        http://zentao.akuvox.local/zentao/bug-view-*.html*
// @grant        GM_addStyle
// @connect      *
// @run-at       document-end
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/520277/Bug%E8%AF%84%E5%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/520277/Bug%E8%AF%84%E5%AE%A1.meta.js
// ==/UserScript==

;(async function () {
  'use strict'
  let reviewDialog = null
  let continueButton = null
  let floatButton = null
  let selectedValues = []
  let participants = []
  let reviewTypes = []
  // 获取标题
  function getTitle() {
    return new Promise(async (resolve, reject) => {
      const bugId = document.querySelector('#titlebar span strong').textContent
      const result = await fetch(`http://192.168.10.52:43382/bug_review/${bugId}`, {
        method: 'GET'
      })
      try {
        const res = await result.json()
        resolve(res)
      } catch (e) {
        reject(e)
      }
    })
  }
  //debugger
  async function setTitle() {
    const resTitle = await getTitle()
    if (resTitle?.success && resTitle?.data?.bugTitle) {
      const dom = document.querySelector('#titlebar > .heading > :nth-child(2)')
      if (dom) {
        document.querySelector('#titlebar > .heading > :nth-child(2)').innerText =
          resTitle.data.bugTitle
      }
    }
  }
  setTitle()

  // 获取评审类型数据（模拟API请求）
  function getReviewTypes() {
    return new Promise(async (resolve, reject) => {
      const result = await fetch('http://192.168.10.52:43382/review_types', {
        method: 'GET'
      })
      try {
        const res = await result.json()
        resolve(res)
      } catch (e) {
        reject(e)
      }
    })
  }
  getReviewTypes()
    .then((res) => {
      if (res?.success) {
        reviewTypes = res.data || []
      }
    })
    .catch((error) => {
      console.error('Error fetching review types:', error)
    })
  // debugger
  // 获取项目数据（模拟API请求）
  function getProjects() {
    return new Promise(async (resolve, reject) => {
      const result = await fetch('http://192.168.10.52:43382/zt_project', {
        method: 'GET'
      })
      try {
        const res = await result.json()
        resolve(res)
      } catch (e) {
        reject(e)
      }
    })
  }

  // 获取参会人员数据（模拟API请求）
  function getParticipants() {
    return new Promise(async (resolve, reject) => {
      const result = await fetch('http://192.168.10.52:43382/sf_terminal_member', {
        method: 'GET'
      })
      try {
        const res = await result.json()
        resolve(res)
      } catch (e) {
        reject(e)
      }
    })
  }

  // 获取负责产品数据（模拟API请求）
  function getProducts() {
    return new Promise(async (resolve, reject) => {
      const result = await fetch('http://192.168.10.52:43382/sf_product_member', {
        method: 'GET'
      })
      try {
        const res = await result.json()
        resolve(res)
      } catch (e) {
        reject(e)
      }
    })
  }
  // 获取负责产品数据（模拟API请求）
  function postAddBugReview(data) {
    return new Promise(async (resolve, reject) => {
      const result = await fetch('http://192.168.10.52:43382/bug_review/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      try {
        const res = await result.json()
        resolve(res)
      } catch (e) {
        reject(e)
      }
    })
  }
  GM_addStyle(`#notification {
                          position: fixed;
                          top: 20px;
                          left: 50%;
                          transform: translateX(-50%);
                          background-color: #7b7b7b;
                          color: #fff;
                          padding: 15px;
                          border-radius: 5px;
                          display: none;
                          z-index: 1000;
                          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                          opacity: 0;
                          transition: opacity 0.5s ease-in-out;
                      }`)
  GM_addStyle(`
                #tampermonkey-loading {
                  display: none; /* Initially hidden */
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background: rgba(255, 255, 255, 0.9); /* Semi-transparent white background */
                  z-index: 10000; /* High z-index to cover other elements */
                  justify-content: center;
                  align-items: center;
                }
  
                #tampermonkey-loading .spinner {
                  display: inline-block;
                  width: 64px;
                  height: 64px;
                  border: 5px solid rgba(0, 0, 0, 0.1);
                  border-radius: 50%;
                  border-top-color: #409EFF;
                  animation: spin 1s ease-in-out infinite;
                }
  
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `)
  function cLoad() {
    // 添加HTML结构
    const loadingDiv = document.createElement('div')
    loadingDiv.id = 'tampermonkey-loading'
    loadingDiv.innerHTML = '<div class="spinner"></div>'
    document.body.appendChild(loadingDiv)

    // 提供控制函数
    const loadingController = {
      show: function () {
        loadingDiv.style.display = 'flex'
      },
      hide: function () {
        loadingDiv.style.display = 'none'
      }
    }

    // 将控制函数挂载到全局命名空间
    window.TMLoading = loadingController
  }

  function cNotification() {
    const notificationdom = document.createElement('div')
    notificationdom.id = 'notification'
    document.body.appendChild(notificationdom)
  }
  cNotification()

  // 提示
  function showNotification(message, duration = 1800) {
    const notification = document.getElementById('notification')
    // debugger
    notification.textContent = message
    notification.style.display = 'block'

    // 触发重绘以应用 CSS transition
    requestAnimationFrame(() => {
      notification.style.opacity = '1'
    })

    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => {
        notification.style.display = 'none'
      }, 500) // 这里的 500 毫秒与 CSS 中的 transition 时间相匹配
    }, duration)
  }
  // 添加悬浮按钮
  function addFloatButton() {
    if (!floatButton && !continueButton) {
      floatButton = createButton('开始Bug评审', '45%', '10px', '#007bff')
      document.body.appendChild(floatButton)
      floatButton.addEventListener('click', showReviewDialog)
    }
  }

  // 创建按钮
  function createButton(text, top, right, bgColor) {
    const button = document.createElement('button')
    button.innerText = text
    button.style.position = 'fixed'
    button.style.top = top
    button.style.right = right
    button.style.zIndex = '9999'
    button.style.backgroundColor = bgColor
    button.style.color = '#fff'
    button.style.border = 'none'
    button.style.padding = '10px 20px'
    button.style.borderRadius = '5px'
    button.style.cursor = 'pointer'
    return button
  }

  // 显示评审弹窗
  async function showReviewDialog() {
    console.log('reviewTypes:', reviewTypes)
    if (reviewDialog) return // 防止重复弹窗
    reviewDialog = document.createElement('div')
    reviewDialog.style.position = 'fixed'
    reviewDialog.style.top = '50%'
    reviewDialog.style.left = '50%'
    reviewDialog.style.transform = 'translate(-50%, -50%)'
    reviewDialog.style.zIndex = '10000'
    reviewDialog.style.backgroundColor = '#fff'
    reviewDialog.style.border = '1px solid #ccc'
    reviewDialog.style.padding = '20px'
    reviewDialog.style.borderRadius = '10px'
    reviewDialog.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)'
    reviewDialog.style.minWidth = '412px'
    reviewDialog.style.cursor = 'default' // 改为默认光标
    reviewDialog.innerHTML = `
                          <h3 style='cursor: move;'>Bug 评审</h3>
                          <label for="reviewType">评审类型:</label>
                          <select id="reviewType" required>
                              <option value="">请选择</option>
                              ${reviewTypes
                                .map((item) => `<option value="${item.id}">${item.type}</option>`)
                                .join('')}
                          </select>
                          <br/><br/>
                          <label for="reviewRemarks">评审备注:</label>
                          <textarea id="reviewRemarks" rows="4" cols="50" style="resize: vertical; width: 100%;"></textarea>
                          <br/><br/>
                          <button id="completeCurrentReview">完成当前Bug评审</button>
                          <button id="completeAllReviews">完成所有评审</button>
                          <button id="closeReview">关闭</button>
                      `
    document.body.appendChild(reviewDialog)

    // 使弹窗可拖动
    makeElementDraggable(reviewDialog)

    // 添加事件监听
    document
      .getElementById('completeCurrentReview')
      .addEventListener('click', completeCurrentReview)
    document.getElementById('completeAllReviews').addEventListener('click', async () => {
      await completeAllReviews()
    })
    document.getElementById('closeReview').addEventListener('click', closeReviewDialog)

    if (floatButton) {
      floatButton.style.display = 'none'
    }
  }

  // 使元素可拖动
  function makeElementDraggable(el) {
    let offsetX = 0,
      offsetY = 0,
      mouseX = 0,
      mouseY = 0

    // 仅在标题部分拖动
    el.onmousedown = function (e) {
      if (e.target.tagName !== 'H3') return // 仅允许标题部分拖动
      e.preventDefault()
      mouseX = e.clientX
      mouseY = e.clientY
      document.onmousemove = elementDrag
      document.onmouseup = stopElementDrag
    }

    function elementDrag(e) {
      e.preventDefault()
      offsetX = mouseX - e.clientX
      offsetY = mouseY - e.clientY
      mouseX = e.clientX
      mouseY = e.clientY
      el.style.top = el.offsetTop - offsetY + 'px'
      el.style.left = el.offsetLeft - offsetX + 'px'
    }

    function stopElementDrag() {
      document.onmousemove = null
      document.onmouseup = null
    }
  }

  // 关闭评审弹窗
  function closeReviewDialog(delay) {
    if (reviewDialog) {
      reviewDialog.remove()
      reviewDialog = null
      if (delay !== 'delay') {
        showContinueButton()
      }
    }
  }

  // 显示继续评审按钮
  function showContinueButton() {
    if (continueButton) return // 防止重复按钮

    continueButton = createButton('继续评审', '45%', '10px', '#28a745')
    document.body.appendChild(continueButton)

    continueButton.addEventListener('click', () => {
      continueButton.remove()
      continueButton = null
      showReviewDialog()
    })
  }
  // 找到移除
  function removeMatchingBug(bug, bugArray) {
    // 使用 filter 方法返回一个新数组，排除掉 bugId 匹配的对象
    return bugArray.filter((item) => item.bugId !== bug.bugId)
  }
  // 还原title
  function calTitleOri(title) {
    const keywords = []
    // 定义要去除的关键字数组
    reviewTypes.forEach((item) => {
      keywords.push(`【${item.type}】`)
    })

    // 将关键字数组转换为正则表达式模式
    const pattern = new RegExp(keywords.join('|'), 'g')

    // 使用正则表达式替换匹配的关键字为空字符串
    return title.replace(pattern, '').trim()
  }
  // 完成当前Bug评审
  function completeCurrentReview(type) {
    // debugger
    const reviewType = document.getElementById('reviewType').value
    const reviewRemarks = document.getElementById('reviewRemarks').value

    if (!reviewType) {
      alert('评审类型不能为空')
      return 'stop'
    }
    const bugId = document.querySelector('#titlebar span strong').textContent
    const testorName = document.querySelector('#userMenu > :nth-child(1)').textContent?.trim()
    let bugTitle = document.querySelector('#titlebar > .heading > :nth-child(2)').textContent
    const originBugTitle = calTitleOri(bugTitle)
    const reviewTypeObj = reviewTypes.find((item) => {
      return item.id === +reviewType
    })
    bugTitle = `【${reviewTypeObj.type}】` + originBugTitle
    const bugGrade = document.querySelector('[class^="severity"]').textContent
    // const bugTitle = document.querySelector('#titlebar span strong').textContent
    const bugReview = {
      reviewType,
      reviewRemarks,
      bugId,
      bugTitle,
      originBugTitle,
      bugGrade,
      bugUrl: window.location.href,
      testorName
    }

    let reviews = JSON.parse(localStorage.getItem('bugReviews') || '[]')
    reviews = removeMatchingBug(bugReview, reviews)
    reviews.push(bugReview)
    localStorage.setItem('bugReviews', JSON.stringify(reviews))
    if (type === 1) return

    setTimeout(() => {
      window.TMLoading.hide()
    }, 3000)
    const nextDom = document.querySelector('.icon-chevron-right')
    if (nextDom) {
      cLoad()
      window.TMLoading.show()
      showNotification('请稍后，正在跳转...')
      closeReviewDialog('delay')
      nextDom.click()
    } else {
      completeAllReviews(1)
    }
  }
  // 完成所有评审
  async function completeAllReviews(type) {
    if (type !== 1) {
      const a = completeCurrentReview(1)
      if (a === 'stop') return
    }

    const res_projects = await getProjects()
    let projects = []
    if (res_projects?.success) {
      projects = res_projects.data || []
    }
    const res_participants = await getParticipants()
    if (res_projects?.success) {
      participants = res_participants.data || []
    }
    const res_products = await getProducts()
    let products = []
    if (res_products?.success) {
      products = res_products.data || []
    }
    const finalDialog = document.createElement('div')
    finalDialog.style.position = 'fixed'
    finalDialog.style.top = '50%'
    finalDialog.style.left = '50%'
    finalDialog.style.transform = 'translate(-50%, -50%)'
    finalDialog.style.zIndex = '10000'
    finalDialog.style.backgroundColor = '#fff'
    finalDialog.style.border = '1px solid #ccc'
    finalDialog.style.padding = '20px'
    finalDialog.style.borderRadius = '10px'
    finalDialog.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)'
    finalDialog.style.minWidth = '412px'
    finalDialog.style.cursor = 'move'
    finalDialog.innerHTML = `
                          <h3>提交评审信息</h3>
                          <label for="reviewTitle">标题:</label>
                          <input type="text" id="reviewTitle" style='height: 20px' required/>
  
                          <br/><br/>
                          <label for="reviewProject">项目:</label>
                          <select id="reviewProject">
                              <option value="">请选择</option>
                              ${projects
                                .map(
                                  (project) =>
                                    `<option value="${project.id}">${project.name}</option>`
                                )
                                .join('')}
                          </select>
  
                          <br/><br/>
                          <label for="reviewParticipants">参会人员:</label>
                          <div id="reviewParticipants" class="dropdown">
                              <div class="dropdown-button">请选择</div>
                              <div class="dropdown-content" id="mySelect">
                                  <div class="search-container">
                                  <input type="text" class="search-input" placeholder="搜索..." />
                                  </div>
                                  <div class="options-container">
                                      ${participants
                                        .map(
                                          (participant) =>
                                            `<div class="option" participant-id="${participant.id}">${participant.username}</div>`
                                        )
                                        .join('')}
                                  </div>
                              </div>
                          </div>
  
                          <br/><br/>
                          <label for="reviewProduct">负责产品:</label>
                          <select id="reviewProduct">
                          <option value="">请选择</option>
                              ${products
                                .map(
                                  (product) =>
                                    `<option value="${product.id}">${product.username}</option>`
                                )
                                .join('')}
                          </select>
                          <br/><br/>
                          <button id="submitReview">完成</button>
                          <button id="closeFinalDialog">关闭</button>
                      `
    document.body.appendChild(finalDialog)
    cLoad()
    makeElementDraggable(finalDialog)
    doS()
    document.getElementById('submitReview').addEventListener('click', async () => {
      const reviewTitle = document.getElementById('reviewTitle').value
      const reviewProject = document.getElementById('reviewProject').value
      const reviewProduct = document.getElementById('reviewProduct').value
      console.log('reviewProduct:', reviewProduct)
      if (!reviewTitle) {
        alert('标题不能为空')
        return
      }
      if (!reviewProject) {
        alert('项目不能为空')
        return
      }
      if (!selectedValues?.length) {
        alert('参会人员不能为空')
        return
      }
      if (!reviewProduct) {
        alert('负责产品不能为空')
        return
      }
      let reviews = JSON.parse(localStorage.getItem('bugReviews') || '[]')
      let list = []
      reviews.forEach((item) => {
        list.push({
          ...item,
          title: reviewTitle,
          project: reviewProject,
          usernames: selectedValues,
          productor: reviewProduct
        })
      })

      // 提交数据到后端
      console.log('提交的数据:', list)
      try {
        window.TMLoading.show()
        const res = await postAddBugReview(list)
        window.TMLoading.hide()
        if (res?.success) {
          console.log('postAddBugReview:', res)
          // 这里可以加入实际的API请求逻辑
          // alert('评审信息已提交')
          showNotification('评审信息已提交')

          localStorage.removeItem('bugReviews')
          finalDialog.remove()
          cleanUpReviewDialog() // 移除评审弹窗
          setTitle()
        }
      } catch (e) {
        window.TMLoading.hide()
      }
    })

    document.getElementById('closeFinalDialog').addEventListener('click', () => {
      finalDialog.remove()
      showContinueButton()
    })

    // 移除原来的评审弹窗并显示新的提交评审信息弹窗
    if (reviewDialog) {
      reviewDialog.remove()
      reviewDialog = null
    }
  }

  function doS() {
    GM_addStyle(`.dropdown {
                          position: relative;
                          display: inline-block;
                          min-width: 200px;
                          }
                          .dropdown-button {
                          width: 100%;
                          border: 1px solid #000;
                          border-radius: 2px;
                          cursor: pointer;
                          text-align: left;
                          box-sizing: border-box; /* Ensure padding and border are included in the element's total width and height */
                          }
                          .dropdown-content {
                          display: none;
                          position: absolute;
                          background-color: #fff;
                          border: 1px solid #ccc;
                          border-radius: 4px;
                          z-index: 1;
                          max-height: 215px;
                          width: auto;
                          box-sizing: border-box; /* Ensure padding and border are included in the element's total width and height */
                          }
                          .search-container {
                          padding: 10px;
                          border-bottom: 1px solid #ccc;
                          background-color: #fff;
                          position: sticky;
                          top: 0;
                          z-index: 2;
                          }
                          .search-input {
                          width: 100%;
                          padding: 5px;
                          border: 1px solid #ccc;
                          border-radius: 4px;
                          box-sizing: border-box;
                          }
                          .options-container {
                          max-height: 160px;
                          overflow-y: auto;
                          }
                          .option {
                          padding: 10px;
                          cursor: pointer;
                          white-space: nowrap; /* Prevent text from wrapping */
                          }
                          .option:hover {
                          background-color: #f1f1f1;
                          }
                          .selected {
                          background-color: #007bff;
                          color: white;
                          }`)
    const dropdownButton = document.querySelector('.dropdown-button')
    const dropdownContent = document.getElementById('mySelect')
    const optionsContainer = dropdownContent.querySelector('.options-container')
    const options = optionsContainer.getElementsByClassName('option')
    const searchInput = dropdownContent.querySelector('.search-input')

    // 切换下拉框显示状态
    dropdownButton.addEventListener('click', () => {
      dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block'
      searchInput.value = ''
      filterOptions('') // 清空搜索框时显示所有选项
      adjustDropdownWidth() // 调整下拉框宽度
    })

    // 调整下拉框宽度
    function adjustDropdownWidth() {
      dropdownContent.style.width = 'auto' // 先设置为 auto 以获取内容的宽度
      const contentWidth = dropdownContent.offsetWidth
      const buttonWidth = dropdownButton.offsetWidth
      dropdownContent.style.width = `${Math.max(contentWidth, buttonWidth)}px`
    }
    // 移除已存在的人
    function removeP(currentId) {
      return selectedValues.filter((item) => {
        return item.id !== currentId
      })
    }
    // 是否存在已经选中的人
    function findP(currentId) {
      return selectedValues.find((item) => {
        return item.id === currentId
      })
    }
    // 点击选项时的处理函数
    function toggleOption(event) {
      const option = event.target
      const currentId = Number(option.getAttribute('participant-id'))
      console.log('currentId:', currentId)
      let names = []
      // 切换选中状态
      const findedOne = findP(currentId)
      if (findedOne) {
        selectedValues = removeP(currentId)
        option.classList.remove('selected')
      } else {
        const obj = participants.find((item) => {
          return item.id === currentId
        })
        selectedValues.push(obj)
        option.classList.add('selected')
      }
      selectedValues.forEach((item) => {
        names.push(item.username)
      })
      //console.log('names:', names)
      // 更新按钮文本
      dropdownButton.innerText = names.length > 0 ? names.join(', ') : '请选择'

      console.log('selectedValues:', selectedValues) // 输出选中的值
    }

    // 为每个选项添加点击事件监听器
    Array.from(options).forEach((option) => {
      option.addEventListener('click', toggleOption)
    })

    // 点击外部关闭下拉框
    window.addEventListener('click', (event) => {
      if (!event.target.closest('.dropdown')) {
        dropdownContent.style.display = 'none'
      }
    })

    // 搜索框输入事件
    searchInput.addEventListener('input', (event) => {
      filterOptions(event.target.value)
    })

    // 过滤选项
    function filterOptions(query) {
      Array.from(options).forEach((option) => {
        const text = option.textContent.toLowerCase()
        const match = text.includes(query.toLowerCase())
        option.style.display = match ? 'block' : 'none'
      })
    }
  }

  // 清理评审弹窗
  function cleanUpReviewDialog() {
    if (reviewDialog) {
      reviewDialog.remove()
      reviewDialog = null
    }

    // if (floatButton) {
    //   floatButton.style.display = 'block'
    // }
  }

  window.addEventListener('load', () => {
    const reviews = JSON.parse(localStorage.getItem('bugReviews') || '[]')
    if (reviews?.length) {
      showContinueButton()
    } else {
      addFloatButton()
    }
  })
})()
