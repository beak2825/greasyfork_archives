// ==UserScript==
// @name         Copy title
// @name:zh-CN   便捷复制页签 title
// @namespace    http://tampermonkey.net/Henry
// @version      1.0.3
// @description  use Ctrl + q copy title; Alt + q copy title and url, create markdown
// @description:zh-CN   Ctrl + q 复制页签标题；Alt + q 复制页签标题及链接，生成 markdown 格式
// @author       Henry
// @icon         https://tsz.netlify.app/img/favicon.png
// @match        http*://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462372/Copy%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/462372/Copy%20title.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  let messageComponent = null
  document.addEventListener('keydown', listener, false)

  function listener(event) {
    const { keyCode, ctrlKey, altKey } = event
    if (keyCode === 81 && ctrlKey) {
      event.preventDefault()
      event.stopPropagation()
      copyTextToClipboard(document.title)
      return false
    }
    if (keyCode === 81 && altKey) {
      event.preventDefault()
      event.stopPropagation()
      copyTextToClipboard(`[${document.title}](${location.href})`)
      return false
    }
  }

  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text)
      return
    }
    navigator.clipboard.writeText(text).then(
      function () {
        wrapperMsg(`Copying: ${text}`, window.MessageType.SUCCESS)
      },
      function (err) {
        console.log('copyTextToClipboard ~ err:', err)
        wrapperMsg('Oops, unable to copy', window.MessageType.ERROR)
      }
    )
  }

  function wrapperMsg(content, type) {
    // 初始化绑定
    if (!messageComponent) {
      messageComponent = new window.MessageControl()
    }
    // 调用
    messageComponent.message({ content, type })
  }

  function fallbackCopyTextToClipboard(text) {
    let textArea = document.createElement('textarea')
    textArea.value = text

    // Avoid scrolling to bottom
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      var successful = document.execCommand('copy')
      var msg = successful ? text : ''
      wrapperMsg(`Copying: ${msg}`, window.MessageType.SUCCESS)
    } catch (err) {
      console.log('fallbackCopyTextToClipboard ~ err:', err)
      wrapperMsg('Oops, unable to copy', window.MessageType.ERROR)
    }

    document.body.removeChild(textArea)
  }
})()
;(function () {
  // 消息类型
  const MessageType = {
    MESSAGE: 'message', // 普通
    SUCCESS: 'success', // 成功
    ERROR: 'error', // 错误
    WARNING: 'warning' // 警告
  }

  // 状态对应的主色
  const MessageTypeColor = {
    MESSAGE: '#909399',
    SUCCESS: '#67c23a',
    ERROR: '#f56c6c',
    WARNING: '#e6a23c'
  }

  // 创建DOM
  const createDom = ({ isId = false, name = '', tag = 'div' }) => {
    if (!tag) {
      return null
    }
    const ele = document.createElement(tag)
    if (name) {
      if (isId) {
        ele.id = name
      } else {
        ele.className = name
      }
    }
    return ele
  }

  // 获取类型对应的背景色
  const getTypeBGColor = type => {
    let bgColor = ''
    switch (type) {
      case MessageType.SUCCESS:
        bgColor = 'background-color: #f0f9eb'
        break
      case MessageType.ERROR:
        bgColor = 'background-color: #f0f9eb'
        break
      case MessageType.WARNING:
        bgColor = 'background-color: #f0f9eb'
        break
      default:
        bgColor = 'background-color: #edf2fc'
        break
    }
    return bgColor
  }

  // 获取类型对应的背景色、文字颜色
  const getTypeDomCss = type => {
    let cssStr = ''
    let commonCss = ''
    switch (type) {
      case MessageType.SUCCESS:
        cssStr = commonCss + `${getTypeBGColor(type)};color: ${MessageTypeColor.SUCCESS};`
        break
      case MessageType.ERROR:
        cssStr = commonCss + `${getTypeBGColor(type)};color: ${MessageTypeColor.ERROR};`
        break
      case MessageType.WARNING:
        cssStr = commonCss + `${getTypeBGColor(type)};color: ${MessageTypeColor.WARNING};`
        break
      default:
        cssStr = commonCss + `${getTypeBGColor(type)};color: ${MessageTypeColor.MESSAGE};`
        break
    }
    return cssStr
  }

  const createMessage = (
    { type, content, duration, delay, againBtn, minWidth, maxWidth },
    mainContainer
  ) => {
    if (!mainContainer) {
      console.error('主容器不存在，查看调用流程，确保doucument.body已生成!')
      return
    }
    /**随机的key */
    const randomKey = Math.floor(Math.random() * (99999 - 10002)) + 10002

    /**属性配置 */
    const config = {
      isRemove: false, // 是否被移除了
      type: type || MessageType.MESSAGE, // 类型 message success error warning
      content: content || '', // 提示内容
      duration: duration || 3000, // 显示时间
      delay: delay || 0, // 弹出延迟
      timeout: null, // 计时器事件
      againBtn: againBtn || false // 是否需要显示 不再提示 按钮
    }
    // #region 生成DOM、样式、关系
    const messageContainer = createDom({ name: `message-${randomKey}`, tag: 'div' })
    messageContainer.style = `
  min-width: ${minWidth}px;
  max-width:${maxWidth}px;
  padding: 12px 12px;
  margin-top: -20px;
  border-radius: 4px;
  box-shadow: -5px 5px 12px 0 rgba(204, 204, 204, 0.8);
  ${getTypeBGColor(config.type)};
  animation: all cubic-bezier(0.18, 0.89, 0.32, 1.28) 0.4s;
  transition: all .4s;
  pointer-events: auto;
  overflow:hidden;
  `
    /**内容区域 */
    const messageTypeDom = createDom({ tag: 'div' })
    messageTypeDom.style = getTypeDomCss(config.type)
    /**文本内容 */
    const messageTypeText = createDom({ tag: 'span' })
    messageTypeText.style = 'font-size: 14px;line-height: 20px;'
    messageTypeText.innerHTML = config.content
    /**建立html树关系 */
    messageTypeDom.appendChild(messageTypeText)
    messageContainer.appendChild(messageTypeDom)
    /**不再提示的按钮 */
    if (config.againBtn) {
      const messageAgainDiv = createDom({ name: 'message-again-btn', tag: 'div' })
      messageAgainDiv.style = `margin-top: 5px;text-align: right;`
      const messageAgainBtnText = createDom({ name: 'message-again-text', tag: 'span' })
      messageAgainBtnText.innerHTML = '不再提示'
      messageAgainBtnText.style = `
      font-size: 12px;
      color: rgb(204, 201, 201);
      border-bottom: 1px solid rgb(204, 201, 201);
      cursor: pointer;
      `
      // 鼠标移入
      messageAgainBtnText.onmouseover = () => {
        messageAgainBtnText.style.color = '#fdb906'
        messageAgainBtnText.style.borderBottom = '1px solid #fdb906'
      }
      // 鼠标移出
      messageAgainBtnText.onmouseout = () => {
        messageAgainBtnText.style.color = 'rgb(204, 201, 201)'
        messageAgainBtnText.style.borderBottom = '1px solid rgb(204, 201, 201)'
      }
      messageAgainDiv.appendChild(messageAgainBtnText)
      messageContainer.appendChild(messageAgainDiv)
      config.elsAgainBtn = messageAgainBtnText
    }
    mainContainer.appendChild(messageContainer)

    /**绑定DOM、销毁事件，以便进行控制内容与状态 */
    config.els = messageContainer
    config.destory = destory.bind(this)
    function destory(mainContainer, isClick) {
      if (!config.els || !mainContainer || config.isRemove) {
        // 不存在，或已经移除，则不再继续
        return
      }
      config.els.style.marginTop = '-20px' // 为了过渡效果
      config.els.style.opacity = '0' // 为了过渡效果
      config.isRemove = true
      if (isClick) {
        mainContainer.removeChild(messageContainer)
        _resetMianPosition(mainContainer)
        free()
      } else {
        setTimeout(() => {
          mainContainer.removeChild(messageContainer)
          _resetMianPosition(mainContainer)
          free()
        }, 400)
      }
    }

    // 销毁重置绑定
    function free() {
      config.els = null
      config.elsAgainBtn = null
      config.destory = null
    }

    return config
  }

  function _toBindEvents(domConfig, _self) {
    if (!domConfig) {
      return
    }
    // 不再提示按钮的事件绑定
    if (domConfig.againBtn && domConfig.elsAgainBtn) {
      // 鼠标点击：将内容记录下来，下次就不显示同内容的弹框
      domConfig.elsAgainBtn.onclick = () => {
        clearTimeout(domConfig.timeout)
        let sessionJson = sessionStorage.getItem('MESSAGE_DONT_REMIND_AGAIN')
        let tempArr = sessionJson ? JSON.parse(sessionJson) : []
        let dontRemindAgainList = Array.isArray(tempArr) ? tempArr : []
        dontRemindAgainList.push(domConfig.content)
        sessionStorage.setItem(_self.sessionStorageName, JSON.stringify(dontRemindAgainList))
        domConfig.destory(_self.mainContainer, true)
      }
    }

    // 鼠标移入：对销毁计时器进行销毁
    domConfig.els.onmouseover = () => {
      clearTimeout(domConfig.timeout)
    }
    // 鼠标移出： 一秒后销毁当前message
    domConfig.els.onmouseout = () => {
      domConfig.timeout = setTimeout(() => {
        domConfig.destory(_self.mainContainer)
        clearTimeout(domConfig.timeout)
      }, 1000)
    }

    // 延时隐藏
    domConfig.timeout = setTimeout(() => {
      domConfig.destory(_self.mainContainer)
      clearTimeout(domConfig.timeout)
    }, domConfig.duration)
  }

  function _resetMianPosition(mainContainer) {
    if (!mainContainer) {
      return
    }
    mainContainer.style.left = `calc(50vw - ${mainContainer.scrollWidth / 2}px)`
  }

  class MessageControl {
    constructor() {
      this.minWidth = 380 // 内容显示宽度：最小值
      this.maxWidth = 800 // 内容显示宽度：最大值
      this.top = 45 // 整体的最顶部距离
      this.zIndex = 999 // 层级
      this.mainContainerIdName = 'selfDefine-message-box' // 主体DOM的id名
      this.sessionStorageName = 'MESSAGE_DONT_REMIND_AGAIN' // 存储session信息的key
      /**生成主体DOM、样式容器 */
      let mainDom = document.getElementById(this.mainContainerIdName)
      if (mainDom) {
        document.body.removeChild(mainDom)
      }
      this.mainContainer = createDom({ isId: true, name: this.mainContainerIdName, tag: 'div' })
      this.mainContainer.style = `
    pointer-events:none;
    position:fixed;
    top:${this.top}px;
    left:calc(50vw - ${this.minWidth / 2}px);
    z-index:${this.zIndex};
    display: flex;
    flex-direction: column;
    align-items:center;
    `
      document.body.appendChild(this.mainContainer)
    }

    /**
     * 消息提示
     * @param {String} type 类型 | 必传 | 可选值：message success error warning
     * @param {String} content 内容 | 必传 | ''
     * @param {Number} duration 显示时间 | 非必传 | 默认3000毫秒
     * @param {Number} delay 出现的延时 | 非必传 | 默认0
     * @param {Boolean} againBtn 是否显示 不再提示 按钮 | 非必传 | 默认false
     */
    message(config = {}) {
      // 不再提示（相同文字内容）的存储与判断逻辑待优化
      let sessionJson = sessionStorage.getItem(this.sessionStorageName)
      let dontRemindAgainList = sessionJson ? JSON.parse(sessionJson) : null
      // 需要显示不再提示按钮，且内容有效，且不再提示的记录数组中包含本次内容，则不提示
      if (
        config.againBtn &&
        config.content &&
        dontRemindAgainList &&
        Array.isArray(dontRemindAgainList) &&
        dontRemindAgainList.includes(config.content)
      ) {
        return
      }

      const domConfig = createMessage(
        {
          type: config.type,
          content: config.content,
          duration: config.duration,
          delay: config.delay,
          againBtn: config.againBtn,
          minWidth: this.minWidth,
          maxWidth: this.maxWidth
        },
        this.mainContainer
      )
      this.mainContainer.appendChild(domConfig.els)
      domConfig.els.style.marginTop = '20px' // 为了过渡效果
      _resetMianPosition(this.mainContainer)
      _toBindEvents(domConfig, this)
    }

    beforeDestory() {
      if (this.mainContainer && this.mainContainer.remove) {
        this.mainContainer.remove()
      } else {
        document.body.removeChild(this.mainContainer)
      }
      this.mainContainer = null
    }
  }

  if (!window.MessageType) {
    window.MessageType = MessageType
  }

  if (!window.MessageControl) {
    window.MessageControl = MessageControl
  }
})()