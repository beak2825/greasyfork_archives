// ==UserScript==
// @name         libs
// @description  JavaScript 库函数，以便调用
// @namespace    essence/libs
// @version      0.4
// @grant        GM_addStyle
// ==/UserScript==

// 等待
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 等待指定元素出现后，执行回调
 * @param selector 元素选择器。参考`document.querySelector`
 * @param callback 需要执行的回调。传递的参数为目标元素
 */
const waitElem = (selector, callback) => {
  const observer = new MutationObserver(() => {
    const element = document.querySelector(selector)
    if (element) {
      callback(element)
      observer.disconnect()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

/**
 * 读取网站存储到 localStorage 的所有值
 * @param excludeRegexp 不读取的键的正则。如 /^Hm_lvt/
 * @return {string} JSON 文本
 */
const readLocalStorageValues = (excludeRegexp = undefined) => {
  const result = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (excludeRegexp && excludeRegexp.test(key)) {
      continue
    }

    result[key] = localStorage.getItem(key)
  }

  return JSON.stringify(result)
}

/**
 * 恢复数据到网站的 localStorage
 * @param {string} json
 */
const restoreLocalStorageValues = (json) => {
  const data = JSON.parse(json)

  Object.keys(data).forEach(key => localStorage.setItem(key, data[key]))
}

/**
 * 让容器以 flex row 显示子元素
 * @param elem {HTMLElement} 容器元素
 * @param gap {string} 子元素的间隔。默认"8px"
 * @param alignItems {string} 子元素垂直对齐。默认"center"
 */
const containerToRow = (elem, gap = "8px", alignItems = "center") => {
  elem.style.display = "flex"
  elem.style.flexDirection = "row"
  elem.style.justifyContent = "space-between"
  elem.style.gap = gap
  elem.style.alignItems = alignItems
}

/**
 * 发送通知。可使用 Toast 实例快捷发送消息
 * @param message {string} 消息
 * @param color {string} 消息类型。可选："default" | "primary" | "success" | warning" | "danger"
 * @param element 右侧操作按钮
 * @param disappear 持续时长（毫秒）
 */
const toast = (message, color = 'primary', element = null, disappear = 5000) => {
  // 创建通知元素
  const toast = document.createElement('div')

  // 设置消息文本
  toast.textContent = message

  // 如果提供了操作按钮元素，添加到通知
  if (element) {
    toast.appendChild(element)
  }

  // 根据消息的类型设置颜色，并显示
  toast.classList.add("toast", "essenceX", color)

  // 将通知元素添加到页面
  document.body.appendChild(toast)

  // 显示 toast
  setTimeout(() => toast.classList.add("show"), 10)

  // toast 在 N 秒后消失
  setTimeout(() => {
    toast.classList.remove("show")
    toast.classList.add("hide")

    // 在消失动画完成后，从页面移除通知元素
    toast.addEventListener('transitionend', () => toast.remove())
  }, disappear)
}

/**
 * 快捷发送通知
 */
const Toast = {
  default: (message, element = null, disappear = 5000) => toast(message, "default", element, disappear),
  primary: (message, element = null, disappear = 5000) => toast(message, "primary", element, disappear),
  success: (message, element = null, disappear = 5000) => toast(message, "success", element, disappear),
  warning: (message, element = null, disappear = 5000) => toast(message, "warning", element, disappear),
  danger: (message, element = null, disappear = 5000) => toast(message, "danger", element, disappear)
}

const removeDialog = (dialog) => {
  dialog.classList.remove("show")
  dialog.classList.add("hide")

  // 在消失动画完成后，从页面移除通知元素
  dialog.addEventListener('transitionend', () => dialog.remove())
}

/**
 * 显示对话框
 * @param title {string} 标题
 * @param body {Element} 内容
 * @param isModel {boolean} 是否为模态对话框
 * @return {HTMLElement} 返回对话框实例，以便 remove()
 */
const showDialog = (title, body, isModel = false) => {
  const dialog = document.createElement('div')
  const content = document.createElement('div')
  const header = document.createElement('div')
  const dialogBody = document.createElement('div')

  dialog.classList.add("dialog", "essenceX")
  content.classList.add("dialog-content", "essenceX")
  header.classList.add("dialog-header", "essenceX")
  dialogBody.classList.add("dialog-body", "essenceX")

  header.textContent = title
  dialogBody.appendChild(body)

  content.append(header, dialogBody)

  dialog.appendChild(content)

  document.body.appendChild(dialog)

  // 使用动画显示对话框
  setTimeout(() => dialog.classList.add("show"), 10)

  // 不是模态对话框时，点击外部即取消
  if (!isModel) {
    window.addEventListener("click", event => {
      if (event.target === dialog) {
        removeDialog(dialog)
      }
    })
  }

  return dialog
}