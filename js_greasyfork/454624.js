// ==UserScript==
// @name         react中文文档目录补全
// @version      0.0.6
// @description  展示react中文文档右侧目录，支持2、3、4级目录
// @author       jade qiu
// @match        https://zh-hans.reactjs.org/docs/*
// @match        https://react.docschina.org/docs/*
// @icon         https://zh-hans.reactjs.org/favicon.ico
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment.min.js
// @license      MIT
// @namespace    https://greasyfork.org/users/909394
// @downloadURL https://update.greasyfork.org/scripts/454624/react%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3%E7%9B%AE%E5%BD%95%E8%A1%A5%E5%85%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/454624/react%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3%E7%9B%AE%E5%BD%95%E8%A1%A5%E5%85%A8.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const style = `
          .custom-ul {
              padding: 10px 0 10px 20px;
              font-size: 10px;
              
              background: #dadada;
          }
          .custom-li {
            font-family: source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace;
            font-size: 14px;
            font-weight: 100;
            min-width: 36em;
            padding-top: 3px;
          }
          .custom-li-h3 {
            padding-left: 20px;
          }
          .custom-li-h4 {
            padding-left: 20px;
          }
          .custom-li:hover {
            backgound-color: #61dafb;
          }
          .custom-li:first-child {
            padding-top: 0;
          }
          `

  GM_addStyle(style)

  let timer = null

  const insertMenus = (subMenus, target) => {
    const ul = document.createElement('ul')
    ul.classList.add('custom-ul')
    subMenus.map((second) => {
      const co = second.cloneNode(true)
      co.classList.add('custom-li', 'custom-li-' + co.nodeName.toLowerCase())
      ul.appendChild(co)
    })
    if (target.parentNode.children.length >= 2) {
      target.parentNode.removeChild(target.parentNode.childNodes[1])
    }
    target.parentNode.appendChild(ul)
    console.log(ul, target.parentNode)
    return true
  }

  const render = function (target) {
    let a = 0
    timer = setInterval(() => {
      a++
      if (a === 2) {
        clearInterval(timer)
        return false
      }
      const currentPageTitle = document.querySelector('article header h1')
      const allPageTitle = Array.from(document.querySelectorAll('ul[id^="section_"] a'))
      const currentPageSecondLevelTitle = Array.from(
        document.querySelectorAll('article>div>div>h2,article>div>div>h3,article>div>div>h4')
      )
      // if (target) {
      //   insertMenus(currentPageSecondLevelTitle, target)
      //   return true
      // }
      allPageTitle.map((page) => {
        const pageInnerText = page.innerText.replace(/^[0-9]{1,2}\.\s/, '')
        let run = undefined
        if (target && page.innerText === target.innerText) {
          run = true
        } else if (pageInnerText === 'React' && currentPageTitle.innerText === 'React 顶层 API') {
          run = true
        } else if (pageInnerText === currentPageTitle.innerText) {
          run = true
        }

        if (run) {
          insertMenus(currentPageSecondLevelTitle, page)
        }
      })
    }, 200)
  }

  // 监听浏览器的返回上一页事件
  window.addEventListener('popstate', function () {
    clearInterval(timer)
    render()
  })

  window.addEventListener('load', function () {
    clearInterval(timer)
    render()
  })

  window.addEventListener('click', (e, a) => {
    const isA = e.path.find((path) => path.nodeName === 'A')
    if (!isA) {
      return true
    }
    console.log(e, 'e')
    clearInterval(timer)
    render(e.target)
  })
})()
