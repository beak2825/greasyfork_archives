// ==UserScript==
// @name         我的日志输出面板-测试函数
// @namespace    http://tampermonkey.net/
// @version      2024-08-09
// @description  简单的日志panel
// @author       You
// @include      https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @require      https://update.greasyfork.org/scripts/503097/1424933/VueEntry.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// ==/UserScript==

~(function() {
  class MyPanel {
    constructor() {
      unsafeWindow.VueEntry = VueEntry
      this.saveKey = 'My_Open_Panel_Config'
      this.vueInstance = null
      this._insertPanel()
      this._initPanel()
    }
    template() {
      return  `<div v-show="config.isOpen" id="app-template" style="padding: 15px;">
            <div v-for="(item, index) in config.commitList" v-html="item" :key="index"></div>
          </div>`
    }
    setup() {
      const { reactive, watch } = VueEntry;
      const data = JSON.parse(GM_getValue(this.saveKey, '{}'))
      const config = reactive(Object.assign({
        isOpen: false,
        commitList: []
      }, data))

      const methods = {
        closePanel() {
          config.isOpen = false
        },
        openPanel() {
          config.isOpen = true
        },
        addTitleLog(title, content, titleColor = '#2ac1ff', contentColor = 'white') {
          const colorTable = {
            'default': '#2ac1ff',
            'error': '#ff4a4a',
            'success': '#2dff2d',
            'warn': '#fff71d',
          }
          titleColor = colorTable[titleColor] || titleColor
          contentColor = colorTable[contentColor] || contentColor

          config.commitList.push(`<div style="display: flex">
                 <div style="color: ${titleColor}; font-weight: bold; margin-right: 6px">${title}</div>
                 <div style="color: ${contentColor}">${content}</div>
              </div>`)
        },
        addColorLog(color, text) {
          config.commitList.push(`<div style="color: ${color}">${text}</div>`)
        },
        addHtmlLog(logHtml) {
          config.commitList.push(logHtml)
        },
        clearLog() {
          config.commitList = []
        },
        resetLogAt(logIndex, logHtml) {
          config.commitList[logIndex] = logHtml
        }
      }
      // for(const key in methods) {
      //   this[key] = methods[key]
      // }
      Object.assign(this, methods)

      watch(config, (newVal) => {
        console.log('触发动作了!!')
        GM_setValue(this.saveKey, JSON.stringify(config))
      })

      return {
        config,
        ...methods
      }
    }
    _insertPanel() {
      const insertPanel = document.createElement('div')
      insertPanel.id = 'my-custom-log-panel'
      const position = [
        'position: fixed',
        'top: 10px',
        'right: 15px',
        'width: 200px',
        'height: auto',
      ]
      insertPanel.innerHTML = `<my-component></my-component>`
      insertPanel.style = `postion: fixed; ${position.join(';')}; background-color: rgba(0, 0, 0, 0.5); z-index: 9999; color: white; text-align: left;`
      document.body.appendChild(insertPanel)
    }
    _initPanel() {
      const { createApp } = VueEntry;
      this.vueInstance = createApp({})
      this.vueInstance.component('my-component',  {
        template: this.template(),
        setup: this.setup.bind(this)
      });

      setTimeout(() => {
        this.vueInstance.mount('#my-custom-log-panel');
      }, 500)
    }
    
  }
  unsafeWindow.LogPanel = LogPanel = new MyPanel()
  setTimeout(() => {
    // LogPanel.openPanel()
    // LogPanel.addHtmlLog(`<div>hi</div>`)
    // LogPanel.addTitleLog('购买', '购买成功了')
    // LogPanel.addTitleLog('购买', '购买成功了', 'warn')
    // panel.clearLog()
  }, 1000)
})()
