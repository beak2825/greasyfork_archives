/**
 * UserscriptAPIMessage
 *
 * 依赖于 `UserscriptAPI`，`UserscriptAPIDom`。
 * @version 1.3.1.20220918
 * @author Laster2800
 * @see {@link https://gitee.com/liangjiancang/userscript/tree/master/lib/UserscriptAPI UserscriptAPI}
 */
class UserscriptAPIMessage {
  /**
   * @param {UserscriptAPI} api `UserscriptAPI`
   */
  constructor(api) {
    this.api = api

    api.initModuleStyle(`
      .${api.options.id}-infobox {
        z-index: 100000000;
        background-color: #000000bf;
        font-size: 16px;
        max-width: 24em;
        min-width: 2em;
        color: white;
        padding: 0.5em 1em;
        border-radius: 9.6px;
        opacity: 0;
        transition: opacity ${api.options.fadeTime}ms ease-in-out;
        pointer-events: none;
        text-align: justify;
      }

      .${api.options.id}-infobox .hover-info {
        display: flex;
        align-items: center;
        gap: 1em;
      }

      .${api.options.id}-dialog {
        z-index: 90000000;
        background-color: white;
        font-size: 17px;
        min-width: 18em;
        max-width: 35em;
        border-radius: 4px;
        opacity: 0;
        box-shadow: #000000aa 0px 3px 6px;
        transition: opacity 150ms cubic-bezier(0.68, -0.55, 0.27, 1.55);
      }
      .${api.options.id}-dialog .gm-header {
        padding: 0.5em 1em 0.4em;
        border-bottom: 1px solid #d5d5d5;
      }
      .${api.options.id}-dialog .gm-body {
        padding: 0.8em 1em;
      }
      .${api.options.id}-dialog .gm-bottom {
        padding: 0 1em 0.6em;
        text-align: right;
      }
      .${api.options.id}-dialog .gm-content {
        line-height: 1.6em;
      }
      .${api.options.id}-dialog button.gm-interactive {
        font-size: 0.9em;
        padding: 0.1em 0.6em;
        margin-left: 0.8em;
        cursor: pointer;
        background-color: white;
        border: 1px solid #909090;
        border-radius: 2px;
      }
      .${api.options.id}-dialog button.gm-interactive:hover,
      .${api.options.id}-dialog button.gm-interactive:focus {
        background-color: #ebebeb;
      }
      .${api.options.id}-dialog input.gm-interactive {
        outline: none;
        width: calc(100% - 12px);
        margin-top: 0.6em;
        padding: 4px 6px;
        border: 1px solid #909090;
        border-radius: 2px;
      }
      .${api.options.id}-dialog textarea.gm-interactive {
        outline: none;
        width: calc(100% - 2em);
        margin: 0.6em 0 -0.4em;
        padding: 1em;
        resize: none;
        border: 1px solid #909090;
        border-radius: 2px;
      }
      .${api.options.id}-dialog textarea.gm-interactive::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: transparent;
      }
      .${api.options.id}-dialog textarea.gm-interactive::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background-color: #0000002b;
      }
      .${api.options.id}-dialog textarea.gm-interactive::-webkit-scrollbar-corner {
        background-color: transparent;
      }
    `)
  }

  /**
   * @typedef infoOptions
   * @property {(infobox: HTMLElement) => void} [onOpened] 信息打开后的回调
   * @property {(infobox: HTMLElement) => void} [onClosed] 信息关闭后的回调
   * @property {boolean} [autoClose=true] 是否自动关闭信息，配合 `ms` 使用
   * @property {number} [ms=1500] 显示时间（单位：ms，不含渐显/渐隐时间）
   * @property {boolean} [html=false] 是否将 `msg` 理解为 HTML
   * @property {string} [width] 信息框的宽度；缺省时根据内容决定，但有最小宽度和最大宽度的限制，设为 `auto` 可解除限制
   * @property {{top: string, left: string}} [position] 信息框的位置，必须带单位或以百分号结尾；不设置该项时，相当于设置为 `{ top: '80%', left: '50%' }`
   */
  /**
   * 创建信息
   * @param {string} msg 信息
   * @param {infoOptions | number} [options] 选项 / 显示时间（单位：ms，不含渐显/渐隐时间）
   * @return {HTMLElement} 信息框元素
   */
  info(msg, options) {
    const { api } = this
    if (typeof options === 'number') {
      options = { ms: options }
    }
    options = {
      autoClose: true,
      ms: 1500,
      position: { top: '85%' },
      ...options,
    }

    const infobox = document.createElement('div')
    infobox.className = `${api.options.id}-infobox`
    if (options.width) {
      infobox.style.minWidth = 'auto'
      infobox.style.maxWidth = 'none'
      infobox.style.width = options.width
    }
    if (options.html) {
      infobox.innerHTML = msg
    } else {
      infobox.textContent = msg
    }
    document.body.append(infobox)
    api.dom.setPosition(infobox, options.position)

    api.dom.fade(true, infobox, () => {
      options.onOpened?.(infobox)
      if (options.autoClose) {
        setTimeout(() => {
          this.close(infobox, options.onClosed)
        }, options.ms)
      }
    })
    return infobox
  }

  /**
   * 创建悬浮信息
   *
   * 后续可通过启动元素上的 `hoverInfo` 属性修改悬浮信息设置，也可再次在启动元素上调用该方法修改。
   * @param {HTMLElement} el 启动元素
   * @param {string} msg 信息
   * @param {string} [flag] 标志信息
   * @param {Object} [options] 选项
   * @param {string} [options.flagSize='1.8em'] 标志大小
   * @param {string} [options.width] 信息框的宽度；缺省时根据内容决定，但有最小宽度和最大宽度的限制，设为 `auto` 可解除限制
   * @param {{top: string, left: string}} [options.position] 信息框的位置，不设置该项时，沿用 `api.message.infobox()` 的默认设置
   * @param {() => boolean} [options.disabled] 用于获取是否禁用信息的函数
   */
  hoverInfo(el, msg, flag, options) {
    const created = el.hoverInfo
    el.hoverInfo = { msg, flag, options: { flagSize: '1.8em', ...options } }
    if (!created) {
      /** @type {MutationObserver} */
      let ob = null
      el.addEventListener('mouseenter', () => {
        const opt = el.hoverInfo
        if (opt.options.disabled?.()) return
        const htmlMsg = `
          <div class="hover-info">
            ${opt.flag ? `<div style="font-size:${opt.options.flagSize};line-height:${opt.options.flagSize}">${opt.flag}</div>` : ''}
            <div>${opt.msg}</div>
          </div>
        `
        el.infobox = this.info(htmlMsg, { ...opt.options, html: true, autoClose: false })
        // 避免 el 被移除后悬浮信息无法关闭
        ob ??= new MutationObserver((records => {
          for (const record of records) {
            for (const node of record.removedNodes) {
              if (node === el || node.contains(el)) {
                this.close(el.infobox)
                ob.disconnect()
                ob = null
                return
              }
            }
          }
        }))
        ob.observe(document, { childList: true, subtree: true })
      })
      el.addEventListener('mouseleave', () => {
        this.close(el.infobox)
        ob?.disconnect()
      })
    }
  }

  /**
   * @typedef DialogElement
   * @property {0 | 1 | 2 | 3 | 4} state 状态（初始 | 开启中 | 打开 | 关闭中 | 关闭）
   * @property {HTMLElement[]} interactives 交互元素
   * @property {(callback?: () => void) => void} open 打开对话框
   * @property {(callback?: () => void) => void} close 关闭对话框
   */
  /**
   * 创建对话框
   * @param {string} msg 信息
   * @param {Object} [options] 选项
   * @param {boolean} [options.html] 信息是否为 HTML
   * @param {string} [options.title=api.options.label] 标题
   * @param {boolean} [options.titleHtml] 标题是否为 HTML
   * @param {boolean} [options.lineInput] 是否添加单行输入框
   * @param {boolean} [options.boxInput] 是否添加多行输入框
   * @param {string[]} [options.buttons] 对话框按钮文本
   * @param {string} [options.width] 对话框宽度，不设置的情况下根据内容决定，但有最小宽度和最大宽度的限制
   * @param {{top: string, left: string}} [options.position] 信息框的位置，必须带单位或以百分号结尾；不设置该项时绝对居中
   * @returns {HTMLElement & DialogElement} 对话框元素
   */
  dialog(msg, options) {
    const { api } = this
    options = {
      title: api.options.label,
      position: {
        top: '50%',
        left: '50%',
      },
      ...options,
    }

    const dialog = document.createElement('div')
    dialog.className = `${api.options.id}-dialog`
    if (options.width) {
      dialog.style.minWidth = 'auto'
      dialog.style.maxWidth = 'none'
      dialog.style.width = options.width
    }

    let bottomHtml = ''
    if (options.buttons) {
      for (const button of options.buttons) {
        bottomHtml += `<button class="gm-interactive">${button}</button>`
      }
      if (bottomHtml) {
        bottomHtml = `<div class="gm-bottom">${bottomHtml}</div>`
      }
    }
    dialog.innerHTML = `
      ${options.title ? '<div class="gm-header"></div>' : ''}
      <div class="gm-body">
        <div class="gm-content"></div>
        ${options.lineInput ? '<input type="text" class="gm-interactive">' : ''}
        ${options.boxInput ? '<textarea class="gm-interactive"></textarea>' : ''}
      </div>
      ${bottomHtml}
    `
    if (options.title) {
      const header = dialog.querySelector('.gm-header')
      if (options.titleHtml) {
        header.innerHTML = options.title
      } else {
        header.textContent = options.title
      }
    }
    const content = dialog.querySelector('.gm-content')
    if (options.html) {
      content.innerHTML = msg
    } else {
      content.textContent = msg
    }
    dialog.interactives = dialog.querySelectorAll('.gm-interactive')
    document.body.append(dialog)

    dialog.state = 0
    dialog.fadeOutNoInteractive = true
    dialog.open = callback => {
      dialog.state = 1
      api.dom.setPosition(dialog, options.position)
      api.dom.fade(true, dialog, () => {
        dialog.state = 2
        callback?.()
      })
    }
    dialog.close = callback => {
      dialog.state = 3
      this.close(dialog, () => {
        dialog.state = 4
        callback?.()
      })
    }
    return dialog
  }

  /**
   * 创建提醒对话框
   *
   * 没有引入 `message` 模块时，`UserscriptAPI` 会创建一个基础方法作为本方法的替代。
   * @param {string} msg 信息
   * @param {Object} [options] 选项
   * @param {boolean} [options.primitive] 使用原生组件
   * @param {boolean} [options.html] 信息是否为 HTML
   * @param {string} [options.title=api.options.label] 标题
   * @param {boolean} [options.titleHtml] 标题是否为 HTML
   * @param {string} [options.width] 对话框宽度，不设置的情况下根据内容决定，但有最小宽度和最大宽度的限制
   * @param {{top: string, left: string}} [options.position] 信息框的位置，不设置该项时绝对居中
   * @param {string[]} [options.btnText] 按钮文本
   * @param {Object} [ret] 方法通过该对象将必要数据返回
   * @returns {Promise<void>} 用户输入
   */
  alert(msg, options, ret) {
    return new Promise(resolve => {
      let primitive = !document.body || options?.primitive
      if (!primitive) {
        try {
          const btnText = []
          btnText[0] = options?.btnText?.[0] ?? '确定'
          const dialog = this.dialog(msg, {
            ...options,
            buttons: btnText,
          })
          const confirm = dialog.interactives[0]
          confirm.focus({ preventScroll: true })
          confirm.addEventListener('click', () => {
            dialog.close()
            resolve()
          })
          dialog.open()
          if (ret) {
            ret.dialog = dialog
          }
        } catch { // not true error
          primitive = true
        }
      }
      if (primitive) {
        const { label } = this.api.options
        if (options?.html) {
          const el = document.createElement('div')
          el.innerHTML = msg
          msg = el.textContent
        }
        resolve(alert(`${label ? `${label}\n\n` : ''}${msg}`))
      }
    })
  }

  /**
   * 创建确认对话框
   *
   * 没有引入 `message` 模块时，`UserscriptAPI` 会创建一个基础方法作为本方法的替代。
   * @param {string} msg 信息
   * @param {Object} [options] 选项
   * @param {boolean} [options.primitive] 使用原生组件
   * @param {boolean} [options.html] 信息是否为 HTML
   * @param {string} [options.title=api.options.label] 标题
   * @param {boolean} [options.titleHtml] 标题是否为 HTML
   * @param {string} [options.width] 对话框宽度，不设置的情况下根据内容决定，但有最小宽度和最大宽度的限制
   * @param {{top: string, left: string}} [options.position] 信息框的位置，不设置该项时绝对居中
   * @param {string[]} [options.btnText] 按钮文本
   * @param {Object} [ret] 方法通过该对象将必要数据返回
   * @returns {Promise<boolean>} 用户输入
   */
  confirm(msg, options, ret) {
    return new Promise(resolve => {
      let primitive = !document.body || options?.primitive
      if (!primitive) {
        try {
          const btnText = []
          btnText[0] = options?.btnText?.[0] ?? '确定'
          btnText[1] = options?.btnText?.[1] ?? '取消'
          const dialog = this.dialog(msg, {
            ...options,
            buttons: btnText,
          })
          const [confirm, cancel] = dialog.interactives
          confirm.focus({ preventScroll: true })
          confirm.addEventListener('click', () => {
            dialog.close()
            resolve(true)
          })
          cancel.addEventListener('click', () => {
            dialog.close()
            resolve(false)
          })
          dialog.open()
          if (ret) {
            ret.dialog = dialog
          }
        } catch { // not true error
          primitive = true
        }
      }
      if (primitive) {
        const { label } = this.api.options
        if (options?.html) {
          const el = document.createElement('div')
          el.innerHTML = msg
          msg = el.textContent
        }
        resolve(confirm(`${label ? `${label}\n\n` : ''}${msg}`))
      }
    })
  }

  /**
   * 创建输入对话框
   *
   * 没有引入 `message` 模块时，`UserscriptAPI` 会创建一个基础方法作为本方法的替代。
   * @param {string} msg 信息
   * @param {string} [val] 默认值
   * @param {Object} [options] 选项
   * @param {boolean} [options.primitive] 使用原生组件
   * @param {boolean} [options.html] 信息是否为 HTML
   * @param {string} [options.title=api.options.label] 标题
   * @param {boolean} [options.titleHtml] 标题是否为 HTML
   * @param {string} [options.width] 对话框宽度，不设置的情况下根据内容决定，但有最小宽度和最大宽度的限制
   * @param {{top: string, left: string}} [options.position] 信息框的位置，不设置该项时绝对居中
   * @param {string[]} [options.btnText] 按钮文本
   * @param {Object} [ret] 方法通过该对象将必要数据返回
   * @returns {Promise<string>} 用户输入
   */
  prompt(msg, val, options, ret) {
    return new Promise(resolve => {
      let primitive = !document.body || options?.primitive
      if (!primitive) {
        try {
          const btnText = []
          btnText[0] = options?.btnText?.[0] ?? '确定'
          btnText[1] = options?.btnText?.[1] ?? '取消'
          const dialog = this.dialog(msg, {
            ...options,
            buttons: btnText,
            lineInput: true,
          })
          const [input, confirm, cancel] = dialog.interactives
          if (val) {
            input.value = val
            input.setSelectionRange(0, input.value.length)
          }
          input.focus({ preventScroll: true })
          input.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
              confirm.dispatchEvent(new Event('click'))
            }
          })
          confirm.addEventListener('click', () => {
            dialog.close()
            resolve(input.value)
          })
          cancel.addEventListener('click', () => {
            dialog.close()
            resolve(null)
          })
          dialog.open()
          if (ret) {
            ret.dialog = dialog
          }
        } catch { // not true error
          primitive = true
        }
      }
      if (primitive) {
        const { label } = this.api.options
        if (options?.html) {
          const el = document.createElement('div')
          el.innerHTML = msg
          msg = el.textContent
        }
        resolve(prompt(`${label ? `${label}\n\n` : ''}${msg}`, val))
      }
    })
  }

  /**
   * 关闭信息元素
   * @param {HTMLElement} msgEl 信息元素
   * @param {(msgEl: HTMLElement) => void} [callback] 信息关闭后的回调
   */
  close(msgEl, callback) {
    if (msgEl) {
      this.api.dom.fade(false, msgEl, () => {
        callback?.(msgEl)
        msgEl?.remove()
      })
    }
  }
}

/* global UserscriptAPI */
// eslint-disable-next-line no-lone-blocks
{ UserscriptAPI.registerModule('message', UserscriptAPIMessage) }
