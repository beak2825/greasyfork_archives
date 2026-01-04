// ==UserScript==
// @name         掘金沸点过滤器
// @version      0.2.5
// @description  过滤掉那些看起来很睿智的沸点和伙计
// @author       睿智的河水
// @match        *://juejin.im/*
// @namespace    https://greasyfork.org/scripts/388549
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388549/%E6%8E%98%E9%87%91%E6%B2%B8%E7%82%B9%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/388549/%E6%8E%98%E9%87%91%E6%B2%B8%E7%82%B9%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
  'use strict'

  const jjStyle = key => {
    if (key.substring(0, 1) === 'V') {
      key = `v-${key.substring(1)}`
    }
    return `
      .jj-block-dialog {
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.25);
      }
      .jj-block-dialog-box {
        position: relative;
        width: 520px;
        background: #fff;
        padding: 20px;
        margin: 8% auto 0;
        border-radius: 5px;
      }
      .jj-block-dialog-box .close {
        position: absolute;
        right: -15px;
        top: -15px;
        width: 26px;
        height: 26px;
        font-size: 26px;
        text-align: center;
        line-height: 26px;
        color: #666;
        background: #fff;
        border-radius: 50%;
        border: 1px solid #ccc;
        transform: rotateZ(45deg);
        cursor: pointer;
        user-select: none;
      }
      .jj-block-dialog-box .label {
        font-size: 14px;
      }
      .jj-block-dialog-box .textarea {
        height: 80px;
        margin: 12px 0;
        padding: 6px;
        color: #333;
      }
      .jj-block-dialog-box .textarea:focus {
        border-color: #007fff;
      }
      .jj-block-dialog-box .button {
        width: 80px;
      }
      .jj-block-dialog-box .tip {
        color: #888;
        margin-left: 12px;
      }
      .block-action[data-${key}] .action-title-box[data-${key}] {
        flex: 1;
        height: 100%;
        font-size: 13px;
        color: #8a93a0;
      }
      .block-panel[data-${key}] {
        position: absolute;
        top: 100%;
        left: 50%;
        margin: 0 0 0 -5.5rem;
        width: 11rem;
        background-color: #fff;
        border: 1px solid #ebebeb;
        border-radius: 2px;
        z-index: 101;
      }
      .block-panel[data-${key}]:after,
      .block-panel[data-${key}]:before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
      }
      .block-panel[data-${key}]:before {
        margin: -7px 0 0 -7px;
        border: 7px solid transparent;
        border-top: none;
        border-bottom: 7px solid #ebebeb;
      }
      .block-panel[data-${key}]:after {
        margin: -6px 0 0 -6px;
        border: 6px solid transparent;
        border-top: none;
        border-bottom: 6px solid #fff;
      }
      .block-panel[data-${key}] .block-item[data-${key}] {
        font-size: 13px;
        color: #8a93a0;
        text-align: center;
        padding: 0.5rem 0.9rem;
      }
      .block-panel[data-${key}] .block-item[data-${key}]:not(:last-child) {
        border-bottom: 1px solid #ebebeb;
      }
      .block-panel[data-${key}] .block-item[data-${key}]:hover {
        background-color: #fdfdfd;
      }
    `
  }

  /**
   * 拿到vue
   */
  const JJ = document.querySelector('#juejin').__vue__

  /**
   * 清除空值
   */
  const cleanArray = arr => {
    if (Array.isArray(arr)) {
      return arr.filter(v => v && v.trim())
    }
    return arr
  }

  /**
   * 获取缓存数据
   */
  const getLocal = key => {
    return cleanArray(JSON.parse(localStorage.getItem(key)))
  }

  /**
   * 设置缓存数据
   */
  const setLocal = (key, val) => {
    return localStorage.setItem(key, JSON.stringify(val))
  }

  /**
   * 过滤列表数据
   */
  const filterList = () => {
    const pinItem = document.querySelectorAll('.pin')
    let blockList = getLocal('BLOCK_LIST') || []
    let blockUser = getLocal('BLOCK_USER') || []

    // 遍历当前沸点列表
    for (const v of Array.from(pinItem)) {
      const vInfo = v.__vue__.pin

      if (
        blockList.includes(vInfo.id) ||
        blockUser.includes(vInfo.user.id)
      ) {
        v.classList.add('hidden')
        continue
      }

      v.classList.remove('hidden')

      const action = v.querySelector('.action-box')

      // 注入屏蔽代码
      if (action && !action.classList.contains('is-append')) {
        const blockEl = document.createElement('div')
        const bKey = Object.keys(action.firstElementChild.dataset)[0]
        blockEl.dataset[bKey] = ''
        blockEl.classList = 'block-action action'
        action.appendChild(blockEl)

        const blockTitle = document.createElement('div')
        blockTitle.textContent = '✞ 屏蔽'
        blockTitle.dataset[bKey] = ''
        blockTitle.classList = 'action-title-box'
        blockEl.appendChild(blockTitle)

        const blockPanel = document.createElement('div')
        blockPanel.dataset[bKey] = ''
        blockPanel.classList = 'block-panel shadow hidden'
        blockEl.appendChild(blockPanel)

        blockTitle.onclick = () => {
          blockPanel.classList.toggle('hidden')
        }

        const addElement = (label, cb) => {
          const el = document.createElement('div')
          el.textContent = label
          el.dataset[bKey] = ''
          el.classList = 'block-item'
          el.onclick = cb
          blockPanel.appendChild(el)
        }

        addElement('屏蔽此条', () => {
          blockList.push(vInfo.id)
          setLocal('BLOCK_LIST', blockList)
          v.classList.add('hidden')
        })
        addElement('屏蔽此人', () => {
          blockUser.push(vInfo.user.user_id)
          setLocal('BLOCK_USER', blockUser)
          v.classList.add('hidden')
          filterList()
        })
        addElement('查看已屏蔽', () => {
          blockList = getLocal('BLOCK_LIST') || []
          blockUser = getLocal('BLOCK_USER') || []
          let dialog = document.querySelector('.jj-block-dialog')
          if (dialog) {
            document.body.removeChild(dialog)
          }
          dialog = document.createElement('div')
          dialog.classList = 'jj-block-dialog'
          dialog.innerHTML = `
            <div class="jj-block-dialog-box">
              <span id="jj-block-close" class="close">+</span>
              <label class="label">已屏蔽的沸点</label>
              <textarea id="jj-block-list" class="textarea">${blockList.join(',')}</textarea>
              <label class="label">已屏蔽的用户</label>
              <textarea id="jj-block-user" class="textarea">${blockUser.join(',')}</textarea>
              <button id="jj-block-update" class="button">更新</button>
              <span class="tip">多条数据用逗号(,)隔开，留空则不屏蔽任何沸点和用户</span>
            </div>
          `
          document.body.append(dialog)
          const _ = el => document.querySelector(el) || null
          _('#jj-block-close').onclick = () => {
            document.body.removeChild(dialog)
          }
          _('#jj-block-update').onclick = () => {
            const blockList = _('#jj-block-list').value.split(',')
            const blockUser = _('#jj-block-user').value.split(',')
            setLocal('BLOCK_LIST', blockList)
            setLocal('BLOCK_USER', blockUser)
            document.body.removeChild(dialog)
            filterList()
            JJ.$alertMsg('屏蔽列表已更新')
          }
        })

        if (!document.getElementById('jj-style')) {
          const style = document.createElement('style')
          style.textContent = jjStyle(bKey)
          style.id = 'jj-style'
          document.head.append(style)
        }

        action.classList.add('is-append')
      }
    }
  }

  /**
   * 监听并过滤
   */
  const watchPin = () => {
    const target = document.querySelector('.pin-list-view, .pin-content')
    const config = { childList: true, subtree: true }
    const observer = new MutationObserver(() => {
      filterList()
    })

    if (target) {
      observer.observe(target, config)
    }
  }
  JJ.$router.afterEach(() => {
    watchPin()
  })
  watchPin()
})()
