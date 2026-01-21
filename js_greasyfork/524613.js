// ==UserScript==
// @name         98手机网页浏览助手
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  只适用于手机网页版的98手机网页浏览助手
// @author       bbbyqq
// @license      MIT
// @match        *://*/portal.php*
// @match        *://*/forum.php*
// @match        *://*/home.php*
// @match        *://*/plugin.php*
// @match        *://*/member.php*
// @match        *://*/search.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/524613/98%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/524613/98%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict'

  /**
   * 自定义消息弹窗
   *
   * @author: bbbyqq
   * @date: 2025-01-05
   * @description: 封装自定义消息弹窗
   */

  let showAlert = {
    success: function (message, duration = 2000) {
      this._show('success', message, duration)
    },
    error: function (message, duration = 2000) {
      this._show('error', message, duration)
    },
    _show: function (type, message, duration) {
      // 样式配置
      const styleConfig = {
        success: {
          bgColor: '#f0f9eb',
          textColor: '#67c23a',
          icon: `<svg viewBox="0 0 1024 1024" width="15" height="15"><path d="M512 0c282.784 0 512 229.216 512 512s-229.216 512-512 512S0 794.784 0 512 229.216 0 512 0z m236.32 294.144L408.896 633.536 259.84 484.544 192 552.416l216.896 216.928 407.296-407.296-67.872-67.904z" fill="#67c23a"/></svg>`
        },
        error: {
          bgColor: '#fef0f0',
          textColor: '#f56d6d',
          icon: `<svg viewBox="0 0 1024 1024" width="15" height="15"><path d="M509.262713 5.474574c281.272162 0 509.262713 228.02238 509.262713 509.262713 0 281.272162-227.990551 509.262713-509.262713 509.262713s-509.262713-227.990551-509.262713-509.262713c0-281.240333 227.990551-509.262713 509.262713-509.262713z m135.050106 278.725849L509.262713 419.250528l-135.050106-135.050105-90.012184 90.012184L419.186871 509.262713l-135.018277 135.081935 90.012184 90.012184L509.262713 599.274897l135.050106 135.050106 90.012184-90.012184L599.274897 509.262713l135.050106-135.050106-90.012184-90.012184z" fill="#f56d6d"/></path></svg>`
        }
      }

      // 获取或创建弹窗元素
      let alertEl = document.getElementById('customAlert')
      if (!alertEl) {
        alertEl = document.createElement('div')
        alertEl.id = 'customAlert'
        document.body.appendChild(alertEl)

        // 添加全局样式
        const style = document.createElement('style')
        style.textContent = `
                #customAlert {
                    position: fixed;
                    top: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 9999;
                    max-width: 90%;
                    min-width: fit-content;
                    padding: 10px 20px;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    transition: all 0.3s ease;
                    opacity: 0;
                    visibility: hidden;
                }
                #customAlert.show {
                    opacity: 1;
                    visibility: visible;
                }
                #customAlert .alert-content {
                    display: flex;
                    align-items: center;
                    width: 100%;
                }
                #customAlert .alert-icon {
                    margin-right: 10px;
                    flex-shrink: 0;
                    line-height: 0;
                }
                #customAlert .alert-message {
                    flex: 1;
                    line-height: 1.5;
                    word-break: break-word;
                    overflow-wrap: break-word;
                    text-align: justify;
                }
            `
        document.head.appendChild(style)
      }

      // 设置弹窗内容和样式
      const config = styleConfig[type]
      alertEl.innerHTML = `
            <div class="alert-content">
                <div class="alert-icon">${config.icon}</div>
                <div class="alert-message">${message}</div>
            </div>
        `
      alertEl.style.backgroundColor = config.bgColor
      alertEl.style.color = config.textColor

      // 显示弹窗
      alertEl.classList.add('show')

      // 自动隐藏
      clearTimeout(alertEl.timeout)
      alertEl.timeout = setTimeout(() => {
        alertEl.classList.remove('show')
      }, duration)
    }
  }

  /**
   * 自定义复制函数
   *
   * @author: bbbyqq
   * @date: 2025-01-21
   * @description: 自定义复制函数，解决GM_setClipboard在Safari浏览器上不生效的bug
   */

  function copyContent(text) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  /**
   * 98手机网页版 - 首页添加按钮
   *
   * @author: bbbyqq
   * @date: 2025-05-07
   * @description: 115Cookie设置、搜索排除关键字、资源定位关键字、自动登录设置、自动签到
   */

  // 只在首页生效
  if (location.href.includes('portal.php')) {
    // 创建按钮容器
    const createButtonContainer = () => {
      const parent = document.querySelector('.n5_jujiao')
      if (!parent) return

      // 移除现有的按钮容器（如果存在）
      const existingContainer = document.querySelector('.btn-container')
      if (existingContainer) {
        parent.removeChild(existingContainer)
      }

      // 创建新的按钮容器 - 使用innerHTML设置样式
      const container = document.createElement('div')
      container.className = 'btn-container'
      container.innerHTML = `
        <style>
          .btn-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 5px;
            margin-bottom: 10px;
          }
          .custom-btn {
            color: white;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
            flex: 1;
            min-width: 100px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
        </style>
      `
      parent.insertBefore(container, parent.firstChild)

      // 隐藏轮播图
      const carousel = document.querySelector('#n5_mohd')
      if (carousel) carousel.style.display = 'none'

      return container
    }

    // 创建按钮函数 - 使用innerHTML设置样式
    const createButton = (container, id, text, color, onClick) => {
      const button = document.createElement('div')
      button.id = id
      button.className = 'custom-btn'
      button.innerHTML = `
        <style>
          #${id} {
            background: ${color};
          }
          #${id}:hover {
            opacity: 0.9;
          }
        </style>
        ${text}
      `
      button.addEventListener('click', onClick)
      container.appendChild(button)
    }

    // 创建所有按钮（保持不变）
    const initButtons = () => {
      const container = createButtonContainer()
      if (!container) return

      // 搜索排除关键字设置按钮
      createButton(container, 'filter_keywords', '搜索排除关键字', '#67c23a', () => {
        let newKeywords = prompt("请输入搜索时要排除的关键词，用逗号分隔：", GM_getValue('search_keywords', ['求', '约定', 'SHA1']).join(','))
        if (newKeywords !== null) {
          const arr = newKeywords.split(',').map(k => k.trim()).filter(k => k)
          GM_setValue('search_keywords', arr)
          showAlert.success('搜索排除关键字设置成功', 2000)
        }
      })

      // 资源定位关键字设置按钮
      createButton(container, 'resource_keywords', '资源定位关键字', '#67c23a', () => {
        let newKeywords = prompt("请输入资源定位时要查找的关键词，用逗号分隔：", GM_getValue('resource_keywords', ['复制代码', '.txt', '.zip', '.rar', '.7z', '本主题需向作者支付', '.torrent']).join(','))
        if (newKeywords !== null) {
          const arr = newKeywords.split(',').map(k => k.trim()).filter(k => k)
          GM_setValue('resource_keywords', arr)
          showAlert.success('资源定位关键字设置成功', 2000)
        }
      })

      // 配置自动登录按钮
      createButton(container, 'auto_login', '自动登录设置', '#67c23a', () => {
        // 加载保存的配置
        let config = {
          username: GM_getValue('username', ''),
          password: GM_getValue('password', ''),
          questionValue: GM_getValue('questionValue', 0),
          answer: GM_getValue('answer', ''),
          autoLogin: GM_getValue('autoLogin', false)
        }

        // 安全问题列表
        const questionList = [
          "安全提问(未设置请忽略)",
          "母亲的名字",
          "爷爷的名字",
          "父亲出生的城市",
          "您其中一位老师的名字",
          "您个人计算机的型号",
          "您最喜欢的餐馆名称",
          "驾驶执照最后四位数字"
        ]

        // 配置用户名
        const newUsername = prompt('请输入用户名:', config.username)
        if (newUsername !== null) {
          config.username = newUsername
          GM_setValue('username', newUsername)
        }

        // 配置密码
        const newPassword = prompt('请输入密码:', config.password)
        if (newPassword !== null) {
          config.password = newPassword
          GM_setValue('password', newPassword)
        }

        // 配置安全问题
        const questionText = questionList.map((q, i) => `${i}: ${q}`).join('\n')
        const newQuestion = prompt(`请选择安全问题(输入数字):\n${questionText}`, config.questionValue)
        if (newQuestion !== null && !isNaN(newQuestion)) {
          config.questionValue = parseInt(newQuestion)
          GM_setValue('questionValue', config.questionValue)
        }

        // 配置安全问题答案
        const newAnswer = prompt('请输入安全问题的答案:', config.answer)
        if (newAnswer !== null) {
          config.answer = newAnswer
          GM_setValue('answer', newAnswer)
        }

        // 配置自动登录
        const autoLoginConfirm = confirm('是否启用自动登录功能？\n\n当前状态: ' + (config.autoLogin ? '已启用' : '已禁用') + '\n\n点击"确定"启用，点击"取消"禁用')
        config.autoLogin = autoLoginConfirm
        GM_setValue('autoLogin', autoLoginConfirm)

        showAlert.success('自动登录配置已保存', 2000)
      })

      // 自动签到按钮
      createButton(container, 'auto_sign', '自动签到', '#fe1414', () => {
        GM_setValue('autoSign', true)
        GM_setValue('isReply', false)
        if (!GM_getValue('isTips', false)) {
          alert('每点击一次自动签到，都会自动去国产原创区发送一条"感谢分享"的评论，如因评论过多被封号，本人概不负责！')
          GM_setValue('isTips', true)
        }
        document.querySelector('.footer_menu ul li:nth-child(2) a').click()
      })
    }

    // 初始化按钮
    initButtons()
  }

  /**
   * 98手机网页版 - 复制代码增强
   *
   * @author: bbbyqq
   * @date: 2024-04-23
   * @description: 解决98手机网页版复制代码只复制第一行问题
   */

  // 只在帖子页面生效
  if (location.href.includes('forum.php')) {
    document.querySelectorAll('.blockbtn').forEach(btn => {
      const targetId = btn.getAttribute('data-clipboard-target')
      const targetEl = document.querySelector(targetId)
      const container = targetEl.parentNode

      // ===== 页面加载时就判断 li a 是否存在 =====
      let linkList = container.querySelectorAll('li a')

      // ===== 如果不存在，则给每个 li 补 a 标签 =====
      if (!linkList || linkList.length === 0) {
        container.querySelectorAll('li').forEach(li => {
          const text = li.innerText.trim()
          if (!text) return

          const a = document.createElement('a')
          a.href = text
          a.innerText = text
          a.style.cssText = `
            color: inherit;
            text-decoration: none;
          `

          li.innerHTML = ''
          li.appendChild(a)
        })
      }

      // ===== 点击复制 =====
      btn.addEventListener('click', () => {
        const code = []
        container.querySelectorAll('li a').forEach(item => {
          code.push(item.innerText)
        })

        const codeText = code.join('\n')

        setTimeout(() => {
          copyContent(codeText)
        }, 500)
      })
    })
  }

  /**
   * 98手机网页版 - 搜索助手
   *
   * @author: bbbyqq
   * @date: 2024-04-12
   * @description: 在搜索页面、个人主页页面中添加排除关键词checkbox
   */

  // 只在搜索、我的页面生效
  if (location.href.includes('search.php') || location.href.includes('home.php')) {

    const excludes = {
      description: '排除关键词',
      keywords: GM_getValue('search_keywords', ['求', '约定', 'SHA1'])
    }

    // 从浏览器缓存中获取勾选状态
    let checkedList = GM_getValue('checkedList') || []

    createExcludesWrapper()
    removeNodes()

    // 添加排除关键字div
    function createExcludesWrapper() {
      let excludesWrapper = document.createElement('div')
      excludesWrapper.className = 'excludes-wrapper'
      excludesWrapper.style.cssText = 'font-size: 20px;display: flex;align-items: center;font-weight: 700;flex-wrap: wrap;'
      excludesWrapper.innerHTML = `<span>${excludes.description}：</span>`
      document.querySelector('#searchform')?.append(excludesWrapper)
      document.querySelector('.threadlist')?.prepend(excludesWrapper)
      removeSearchResult()

      excludes.keywords.forEach(item => {
        const excludes = document.querySelector('.excludes-wrapper')
        const label = document.createElement('label')
        label.className = 'excludes-item'
        label.style.cssText = 'margin-right: 10px;'
        label.innerHTML = `<input type="checkbox" style="margin-right: 5px;" value="${item}" ${checkedList.some(val => item === val) ? 'checked' : ''}/>${item}`
        excludes?.appendChild(label)
      })
    }

    // 删除重复元素
    function removeNodes() {
      const wrapperNodeList = document.querySelectorAll('.excludes-wrapper')
      if (wrapperNodeList.length > 1) {
        for (let i = 1; i < wrapperNodeList.length; i++) {
          wrapperNodeList[i].parentNode.removeChild(wrapperNodeList[i])
        }
      }
    }

    // 监听勾选状态
    document.querySelectorAll('.excludes-item input[type="checkbox"]').forEach((checkbox) => {
      checkbox?.addEventListener('change', (e) => {
        const isChecked = e.target.checked
        const checkedValue = e.target.value
        if (isChecked) {
          checkedList.push(checkedValue)
        } else {
          checkedList = checkedList.filter(val => val !== checkedValue)
        }
        // 数组去重
        checkedList = Array.from(new Set(checkedList))
        // 浏览器缓存保存勾选状态
        GM_setValue('checkedList', checkedList)
        removeSearchResult()
      })
    })

    // 隐藏拥有关键词的元素
    function removeSearchResult() {
      const searchList = document.querySelectorAll('.threadlist ul li')
      searchList.forEach(item => {
        if (checkedList.some(val => item.innerHTML.toLowerCase().includes(val.toLowerCase()))) {
          item.style.display = 'none'
        } else {
          item.style.removeProperty('display')
        }
      })
    }
  }

  /**
   * 98手机网页版 - 自动签到
   *
   * @author: bbbyqq
   * @date: 2025-01-12
   * @description: 在首页上添加一个按钮，点击实现自动签到
   */

  const autoSign = GM_getValue('autoSign') || false
  const isReply = GM_getValue('isReply') || false

  try {
    // 论坛
    if (location.href.includes('forum.php') && autoSign && !isReply) {
      // 论坛分类页面
      if (document.querySelector('#sub_forum_1')) {
        // 点击国产原创
        document.querySelector('#sub_forum_1 ul li:nth-child(1) a').click()
      }
      // 国产原创页面
      if (document.querySelector('.threadlist')) {
        // 点击第一个有图片的帖子
        document.querySelectorAll('.threadlist .n5_htmk .ztyzjj a')[0].click()
      }
      // 帖子详情页面
      if (document.querySelector('#thread_btn_bar')) {
        // 点击参与回复
        document.querySelector('#thread_btn_bar a.reply').click()
      }
      // 回复主题页面
      if (document.querySelector('#postform')) {
        // 输入'感谢分享'，点击回复
        document.querySelector('#needmessage').value = '感谢分享'
        document.querySelector('#postsubmit').className = 'btn_pn btn_pn_blue'
        document.querySelector('#postsubmit').setAttribute('disable', false)
        document.querySelector('#postsubmit').click()
        GM_setValue('isReply', true)
      }
    }

    // 我的
    if (autoSign && isReply) {
      // 回复完，自动跳转帖子详情最后一页
      if (document.querySelector('#thread_btn_bar')) {
        // 点击右上角，跳转我的页面
        document.querySelector('.n5_tbys .txbz').click()
      }
      // 我的页面
      if (document.querySelector('.dd_sign_icon')) {
        // 点击每日签到
        document.querySelector('.dd_sign_icon').click()
      }
      // 今日未签到页面
      if (document.querySelector('.ddpc_sign_btn_red')) {
        // 点击签到
        document.querySelector('.ddpc_sign_btn_red').click()
      }
      // 每日签到-计算输入答案页面
      if (document.querySelector('.seccheck')) {
        let result = 0
        // 减法运算
        if (document.querySelector('.seccheck .xg2').innerText.includes('-')) {
          result = document.querySelector('.seccheck .xg2').innerText.split('-').map(item => {
            return Number(item.replace(/[^\d]/g, ''))
          }).reduce(function (prev, curr) {
            return prev - curr
          })
        }
        // 加法运算
        if (document.querySelector('.seccheck .xg2').innerText.includes('+')) {
          result = document.querySelector('.seccheck .xg2').innerText.split('+').map(item => {
            return Number(item.replace(/[^\d]/g, ''))
          }).reduce(function (prev, curr) {
            return prev + curr
          })
        }
        document.querySelector('input[name="secanswer"]').value = result
        document.querySelector('.btn_login .formdialog').click()
      }
      // 今日已签到页面
      if (document.querySelector('.ddpc_sign_btn_grey')) {
        GM_setValue('autoSign', false)
        showAlert.success('今日已签到', 2000)
      }
    }

    // 会员登录
    if (autoSign) {
      if (document.querySelector('#loginform .btn_login') && document.querySelector('.dqym').innerText === '会员登录') {
        showAlert.error('请先登录', 2000)
        GM_setValue('autoSign', false)
      }
    }
  } catch (e) {
    console.error(e)
    GM_setValue('autoSign', false)
    GM_setValue('isReply', false)
  }

  /**
   * 98手机网页版 - 一键评分
   *
   * @author: bbbyqq
   * @date: 2025-01-15
   * @description: 修改帖子底部的评分按钮，实现自动评分
   */

  // 只在帖子页面生效
  if (location.href.includes('forum.php')) {
    if (document.querySelector('#thread_btn_bar .btn:nth-child(4) span')?.innerText === '评分') {
      document.querySelector('#thread_btn_bar .btn:nth-child(4) span').innerText = '一键评分'
    }

    if (document.querySelector('#thread_btn_bar .btn:nth-child(4) span')?.innerText.includes('评分')) {
      // 为一键评分按钮添加点击事件
      document.querySelector('#thread_btn_bar .btn:nth-child(4)')?.addEventListener('click', function () {
        let attempts = 0
        let maxAttempts = 200
        let interval = setInterval(() => {
          const scoreElement = document.querySelector('#ntcmsg_popmenu #score8')
          // 元素存在，获取评分区间最大值，进行赋值操作
          if (scoreElement) {
            clearInterval(interval)
            scoreElement.value = Number(document.querySelector('#ntcmsg_popmenu table tr:nth-child(2) td:nth-child(3)').innerText.replace(/[^\d]/g, ''))
            document.querySelector('#ntcmsg_popmenu .pop_btn input[type=submit]').click()
          } else {
            attempts++
            if (attempts >= maxAttempts) {
              // 20秒还是检查不到元素，停止一键评分
              clearInterval(interval)
            }
          }
        }, 100)
      })
    }
  }

  /**
   * 98手机网页版 - 定位资源位置
   *
   * @author: bbbyqq
   * @date: 2025-01-11
   * @description: 在页面上添加一个按钮，点击后连续滚动到定位资源位置
   */

  // 只在帖子页面生效
  if (location.href.includes('forum.php')) {
    // 判断是PC端还是手机端
    const isMobile = ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone'].some(device => navigator.userAgent.includes(device))

    // 定义资源类型数组
    const resourceTypes = GM_getValue('resource_keywords', [
      '复制代码',
      '.txt',
      '.zip',
      '.rar',
      '.7z',
      '本主题需向作者支付',
      '.torrent'
    ])

    createLocationBtn()

    // 创建一个按钮并添加到页面上
    function createLocationBtn() {
      if (isMobile) {  // 手机端
        // 获取目标元素
        const threadBtnBar = document.getElementById('thread_btn_bar')
        // 创建一个新的 <a> 元素
        const locationBtn = document.createElement('a')
        locationBtn.id = 'location_btn'
        locationBtn.className = 'btn js-req'
        locationBtn.style.cssText = 'display: flex; align-items: center; justify-content: center; flex-direction: column; margin-top: 2px;'
        locationBtn.innerHTML = `<svg viewBox="0 0 1024 1024" width="20" height="20">
                                    <path d="M927.282215 479.83544l-83.4629 0c-15.068184-158.75777-141.389194-285.078781-300.146964-300.146964L543.67235 95.835695c0-17.622356-14.285355-31.907711-31.907711-31.907711-17.622356 0-31.907711 14.285355-31.907711 31.907711l0 83.85278c-158.75777 15.068184-285.078781 141.389194-300.146964 300.146964l-83.826174 0c-17.622356 0-31.907711 14.285355-31.907711 31.907711 0 17.622356 14.285355 31.907711 31.907711 31.907711l83.826174 0c15.068184 158.75777 141.389194 285.078781 300.146964 300.146964l0 83.946924c0 17.622356 14.285355 31.907711 31.907711 31.907711 17.622356 0 31.907711-14.285355 31.907711-31.907711l0-83.946924c158.75777-15.068184 285.078781-141.389194 300.146964-300.146964l83.4629 0c17.622356 0 31.907711-14.285355 31.907711-31.907711C959.189925 494.120794 944.904571 479.83544 927.282215 479.83544zM511.76464 793.112446c-155.396209 0-281.369296-125.973086-281.369296-281.369296s125.973086-281.369296 281.369296-281.369296 281.369296 125.973086 281.369296 281.369296S667.159826 793.112446 511.76464 793.112446z" fill="#0086ce" p-id="4182"></path><path d="M511.76464 511.74315m-69.616544 0a68.031 68.031 0 1 0 139.233088 0 68.031 68.031 0 1 0-139.233088 0Z" fill="#0086ce" p-id="4183"></path>
                                </svg>
                                <span>资源位置</span>`
        threadBtnBar?.appendChild(locationBtn)
        // 设置flex布局，解决小屏手机看不到按钮的bug
        if (document.querySelector('#thread_btn_bar')) {
          document.querySelector('#thread_btn_bar').style.display = 'flex'
          document.querySelector('#thread_btn_bar').style.justifyContent = 'space-between'
          document.querySelector('#thread_btn_bar').style.flexDirection = 'row-reverse'
          document.querySelector('#thread_btn_bar .reply').style.order = '1'
        }
      } else { // pc端
        const button = document.createElement('button')
        button.innerHTML = `<button id="location_btn" style="position: fixed; top: 10px; right: 10px; z-index: 9999; background-color: #4CAF50; color: white; border: none; padding: 5px 10px; text-align: center; cursor: pointer; font-size: 14px; border-radius: 5px;">
                                定位资源位置
                            </button>`
        document.body?.appendChild(button)
      }
    }

    // 存储找到的资源位置
    let resourcePositions = []
    // 当前资源位置索引
    let currentIndex = 0

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
    document.querySelector('#location_btn')?.addEventListener('click', function () {
      // 如果是第一次点击或者资源位置列表为空，重新查找资源
      if (currentIndex === 0 || resourcePositions.length === 0) {
        resourcePositions = [] // 清空之前的资源位置
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false)
        let node
        while ((node = walker.nextNode())) {
          // 跳过script标签及其子节点
          if (isScriptOrChild(node)) {
            continue
          }
          const text = node.nodeValue.toLowerCase()
          // 检查文本是否包含数组中的任何一个资源类型
          resourceTypes.forEach(function (type) {
            if (text.includes(type)) {
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
        const nextResource = resourcePositions[currentIndex]
        // 滚动到资源位置
        if (isMobile) { // 手机端
          document.querySelector('#mescroll').scrollBy({
            top: nextResource.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 2),
            behavior: 'smooth'
          })
        } else { // PC端
          window.scrollTo({
            top: nextResource.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 2),
            behavior: 'smooth'
          })
        }
        blinkElement(nextResource, 2)
      } else {
        showAlert.error('没有找到资源', 2000)
      }
    })

    // 高亮闪烁元素
    function blinkElement(element, blinkCount) {
      // 如果元素已经在闪烁，则先停止之前的闪烁
      if (element.blinkTimeoutId) {
        clearTimeout(element.blinkTimeoutId)
        element.style.backgroundColor = element.originalBackgroundColor
      }

      const blinkColor = '#ffbd64' // 设置闪烁颜色
      let blinkTimes = 0 // 记录闪烁次数
      const interval = 300 // 设置闪烁间隔时间，单位为毫秒

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
  }

  /**
   * 98手机网页版 - 配置自动登录
   *
   * @author: bbbyqq
   * @date: 2025-05-07
   * @description: 配置自动登录，可保存用户名、密码、安全问题、答案和是否自动登录
   */

    // 默认配置
  const defaultConfig = {
      username: '',
      password: '',
      questionValue: 0,
      answer: '',
      autoLogin: false
    }

  // 加载保存的配置
  let config = {
    username: GM_getValue('username', defaultConfig.username),
    password: GM_getValue('password', defaultConfig.password),
    questionValue: GM_getValue('questionValue', defaultConfig.questionValue),
    answer: GM_getValue('answer', defaultConfig.answer),
    autoLogin: GM_getValue('autoLogin', defaultConfig.autoLogin)
  }

  // 只在登录页面生效
  if (location.href.includes('member.php')) {
    // 填写用户名
    const usernameInput = document.querySelector('.login_from input[name="username"]')
    if (usernameInput) {
      usernameInput.value = config.username
      usernameInput.dispatchEvent(new Event('input', {bubbles: true}))
    }

    // 填写密码
    const passwordInput = document.querySelector('.login_from input[name="password"]')
    if (passwordInput) {
      passwordInput.value = config.password
      passwordInput.dispatchEvent(new Event('input', {bubbles: true}))
    }

    // 设置安全问题
    const selectElement = document.querySelector('.login_from .sel_list')
    if (selectElement) {
      selectElement.value = config.questionValue
      selectElement.dispatchEvent(new Event('change', {bubbles: true}))
    }

    // 填写答案
    const answerInput = document.querySelector('.login_from .answerli input')
    if (answerInput) {
      answerInput.value = config.answer
      answerInput.dispatchEvent(new Event('input', {bubbles: true}))
    }

    // 自动点击登录（如果启用）
    if (config.autoLogin) {
      const loginButton = document.querySelector('.btn_login button')
      if (loginButton) {
        // 添加1秒延迟确保表单已更新
        setTimeout(() => {
          loginButton.click()
        }, 1000)
      }
    }
  }

  /**
   * 98手机网页版 - 置顶按钮修复
   *
   * @author: bbbyqq
   * @date: 2026-01-21
   * @description: 解决98手机网页版浏览帖子页面置顶按钮失效问题
   */

  // 只在帖子页面生效
  if (location.href.includes('forum.php')) {
    document.addEventListener('click', e => {
      const btn = e.target.closest('a.scrolltop')
      if (!btn) return

      // 阻止原站点的点击逻辑
      e.preventDefault()
      e.stopPropagation()

      // 返回顶部
      if (!btn.classList.contains('bottom')) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
      // 返回底部
      else {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        })
      }
    }, true)
  }

})()
