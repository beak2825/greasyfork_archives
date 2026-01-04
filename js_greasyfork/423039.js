
// ==UserScript==
// @name         神策埋点解析
// @namespace    https://greasyfork.org/zh-CN/scripts/423039-%E7%A5%9E%E7%AD%96%E5%9F%8B%E7%82%B9%E8%A7%A3%E6%9E%90
// @version      1.0.1
// @description  用于生产环境中实时查看埋点数据的插件
// @author       阿炸克斯
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423039/%E7%A5%9E%E7%AD%96%E5%9F%8B%E7%82%B9%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/423039/%E7%A5%9E%E7%AD%96%E5%9F%8B%E7%82%B9%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

;(function () {
  function init() {
    if (document.querySelector('.tdp-wrap')) return
    console.log(`==== 神策埋点数据解析工具 ====`)
    /** 初始化样式 */
    function initStyle() {
      const styleStr = `.tdp-wrap {
    position: relative;
    z-index: 9999999;
  }

  .tdp-wrap .tdp-btn {
    position: fixed;
    right: 0;
    top: 100px;
    transition: none;
    border-radius: 0;
    padding:5px;
  }
  .tdp-wrap .tdp-operate{
    top: 150px;
    padding:0;
    display: none;
  }
  .tdp-wrap .tdp-operate .ant-btn{
    transition: none;
    border-radius: 0;
    padding:5px;
  }
  .tdp-wrap .tdp-list .ant-card {
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
  }

  .tdp-wrap .tdp-list {
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    background: #fff;
    border-left: 1px solid #ccc;
    overflow-x: hidden;
    width: 400px;
  }`
      const style = document.createElement('style')
      style.innerHTML = styleStr
      document.head.appendChild(style)
    }
    /** 初始化容器 */
    function initView() {
      const viewStr = `<div class="tdp-wrap">
  <button id="TdpTrigger" class="tdp-btn ant-btn ant-btn-primary">展开</button>
  <div class="tdp-operate tdp-btn">
    <button id="ClearListBtn" class="ant-btn ant-btn-primary">清空</button>
  </div>
  <div class="tdp-list" show="false"></div>
</div>`
      const div = document.createElement('div')
      div.innerHTML = viewStr
      document.body.appendChild(div)
    }
    /** 初始化脚本 */
    function initScript() {
      const btn = document.querySelector('#TdpTrigger')
      const list = document.querySelector('.tdp-list')
      const operateMenu = document.querySelector('.tdp-operate')
      const clearListBtn = document.querySelector('#ClearListBtn')

      function listShow() {
        list.style.display = 'block'
        btn.style.right = '400px'
        operateMenu.style.right = '400px'
        operateMenu.style.display = 'block'
        btn.innerHTML = '收起'
        list.setAttribute('show', true)
      }
      function listHide() {
        list.style.display = 'none'
        btn.style.right = '0'
        btn.innerHTML = '展开'
        operateMenu.style.right = '0'
        operateMenu.style.display = 'none'
        list.setAttribute('show', false)
      }
      /** 向列表中添加 item */
      function listAppendItem(data) {
        const item = document.createElement('div')
        item.innerHTML = `<div class="ant-card ant-card-small">
      <div class="ant-card-head">
        <div class="ant-card-head-wrapper">
          <div class="ant-card-head-title">
            <span>事件名称: ${data.event}</span>
            <button class="delete ant-btn ant-btn-dangerous ant-btn-sm">删除</button>
            <button class="trigger ant-btn ant-btn-primary ant-btn-sm">折叠</button>
          </div>
        </div>
      </div>
      <div class="ant-card-body">
        <pre>${JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>`
        list.appendChild(item)
      }

      /** 控制列表显示隐藏 */
      btn.addEventListener('click', (e) => {
        if (list.getAttribute('show') === 'true') {
          listHide()
        } else {
          listShow()
        }
      })
      /** 删除，折叠操作 */
      list.addEventListener('click', (e) => {
        if (e.target.className.includes('delete')) {
          e.target.parentNode.parentNode.parentNode.parentNode.remove()
        }
        if (e.target.className.includes('trigger')) {
          const parent = e.target.parentNode.parentNode.parentNode.parentNode
          const body = parent.querySelector('.ant-card-body')
          if (body.style.display === 'none') {
            body.style.display = ''
            e.target.innerHTML = '折叠'
          } else {
            body.style.display = 'none'
            e.target.innerHTML = '展开'
          }
        }
      })
      /** 情况列表 */
      clearListBtn.addEventListener('click', (e) => {
        list.innerHTML = ''
      })
      /**
       * 拦截 createElement 方法
       */
      const originCreateElement = document.createElement
      document.createElement = function (...args) {
        const a = args[0]
        const dom = originCreateElement.apply(this, args)
        if (a === 'img') {
          /** 解析 url */
          const logger = (src) => {
            const s = new URLSearchParams(src.split('?')[1])
            const data = s.get('data')
            const value = decodeURIComponent(
              escape(atob(decodeURIComponent(data)))
            )
            const valueObj = JSON.parse(value)
            listAppendItem(valueObj)
            console.group(`=== ${valueObj.event} ===`)
            console.log(JSON.stringify(valueObj, null, 2))
            console.groupEnd(`=== end ===`)
          }
          /** 监听 img 元素的 src 变化 */
          const mutationObserver = new MutationObserver((mutationsList) => {
            for (let { attributeName, target } of mutationsList) {
              if (attributeName === 'src') {
                const src = target.src
                if (src.includes('sa.gif')) {
                  logger(src)
                }
              }
            }
          })
          mutationObserver.observe(dom, { attributes: true })
        }
        return dom
      }
    }
    initStyle()
    initView()
    initScript()
  }

  window.addEventListener('load', () => {
    if (!window.sensorsdata) return;
    init();
  })
})()

