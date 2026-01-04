// ==UserScript==
// @name         Bubble Message
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  【使用前先看介绍/有问题可反馈】气泡信息 (Bubble Message)：能够生成悬浮气泡通知，支持自定义：文字信息、默认文字/气泡/icon颜色、默认淡入/淡出/显示时间，默认气泡宽度。
// @author       cc
// @include      *
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/422854/Bubble%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/422854/Bubble%20Message.meta.js
// ==/UserScript==

(function() {
  'use strict'
  const __version__ = '0.2.4'
  var info_queue = []
  function getStyle (config, ts) {
    let style = document.createElement('style')
    style.id = `bubble-message-style-${ts}`
    style.innerHTML = `
      .bm-info-${ts} {
        width: ${config.width}px;
        background-color: ${config.backgroundColor};
        padding: 10px;
        color: black;
        font-size: 14px;
        border-radius: 5px;
        margin-top: 10px;
        box-shadow: 2px 2px 6px #eeeeee;
        justify-content: space-evenly;
      }
      .bm-info-enter-active-${ts} {
        animation: fade-in-${ts} ${config.fadeInTime / 1000}s forwards;
      }
      .bm-info-leave-active-${ts} {
        animation: fade-out-${ts} ${config.fadeOutTime / 1000}s forwards;
      }
      @keyframes fade-in-${ts} {
        from {
          opacity: 0;
          scale: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          scale: 1;
          transform: translateY(0px);
        }
      }
      @keyframes fade-out-${ts} {
        from {
          opacity: 1;
          transform: translateY(0px);
        }
        to {
          opacity: 1;
          transform: translateY(-20px);
        }
      }
    `
    return style
  }
  class BubbleMessage {
    constructor () {
      this.config = {
        cmap: {
          info: '#909399',
          warning: '#e6a23c',
          error: '#f56c6c',
          success: '#67c23a'
        },
        fadeInTime: 400,
        fadeOutTime: 600,
        duration: 1500,
        width: 300,
        backgroundColor: '#ffffff',
        color: '#000000'
      }
      this.message = function (options) {
        options = options || {}
        options.type = options.type || 'info'
        options.message = options.message || ''
        options.duration = options.duration || this.config.duration
        if (Object.keys(this.config.cmap).indexOf(options.type) < 0) options.type = 'info'
        if (typeof options.message !== 'string') options.message = String(options.message)
        if (typeof options.duration !== 'number' || options.duration < 1000) options.duration = 1000
        let ts = Date.now()
        let info = document.createElement('div')
        info.className = `bm-row-container bm-info-${ts} bm-info-enter-active-${ts}`
        info.innerHTML = `
          <div class="bm-container bm-icon" style="background-color: ${this.config.cmap[options.type]};"> <div> ! </div> </div>
          <div class="bm-text-container" style="width: ${this.config.width - 30 - 16 - 20}px; color: ${this.config.color};"> ${options.message} </div>
          <div class="bm-close-icon"> × </div>
        `
        let style = getStyle(this.config, ts)
        document.body.appendChild(style)
        document.getElementById('')
        document.body.appendChild(info)
        info_queue.push(info)
        let list = document.getElementById('bubble-message-list')
        list.appendChild(info)
        list.style.display = ''
        var readyClose = () => {
          if (document.body.contains(info) && info.className.indexOf('bm-info-leave-active') < 0) {
            info.className = `bm-row-container bm-info-${ts} bm-info-leave-active-${ts}`
            setTimeout(() => {
              info.remove()
              style.remove()
              info_queue.shift()
              if (info_queue.length == 0) list.style.display = 'none'
            }, this.config.fadeOutTime)
          }
        }
        setTimeout(() => {
          readyClose()
        }, this.config.fadeInTime + options.duration)
        info.querySelector('.bm-close-icon').addEventListener('click', () => {
          readyClose()
        })
      }
    }
  }
  BubbleMessage.__version__ = __version__
  function initialize () {
    let style = document.createElement('style')
    style.id = 'bubble-message-basic-style'
    style.innerHTML = `
      .bm-list {
        z-index: 9999;
        position: fixed;
        top: 10px;
        left: 0;
        right: 0;
        margin: auto;
      }
      .bm-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .bm-row-container {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .bm-text-container {
        display: flex;
        flex-direction: row;
        word-break: break-all;
        text-align: left;
        margin-left: 10px;
      }
      .bm-icon {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        color: white;
        font-size: 14px;
        font-weight: bold;
      }
      .bm-close-icon {
        width: 20px;
        font-size: 20px;
        cursor: pointer;
      }
    `
    document.body.appendChild(style)
    let list = document.createElement('div')
    list.id = 'bubble-message-list'
    list.className = 'bm-container bm-list'
    list.style.display = 'none'
    document.body.appendChild(list)
  }
  if (window.BubbleMessage && window.BubbleMessage.__version__ >= __version__) return 0
  initialize()
  window.BubbleMessage = BubbleMessage
  console.log(`Bubble Message version: ${__version__}`)
})();