// ==UserScript==
// @name         一键到顶/到底
// @namespace    http://tampermonkey.net/
// @version      0.1.28
// @description  页面到顶
// @author       ljk
// @match        *://*/*

// @exclude    *player.bilibili*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/454337/%E4%B8%80%E9%94%AE%E5%88%B0%E9%A1%B6%E5%88%B0%E5%BA%95.user.js
// @updateURL https://update.greasyfork.org/scripts/454337/%E4%B8%80%E9%94%AE%E5%88%B0%E9%A1%B6%E5%88%B0%E5%BA%95.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const style = document.createElement("style")
  style.innerHTML = `
  .L-btn {
    background-color: rgba(125, 125, 125, 0.8);
    width:32px;
    border:none;
    height:32px;
    border-radius: 50%;
    position: fixed;
    right: 1em;
    bottom: 70px;
    z-index: 9999;
    display:flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select:none;
    color:#fff;
  }

  .L-btn:focus {
    outline: none;
  }

  .down {
    right: 1em;
    bottom: 30px;
  }
`

  const body = document.querySelector("body")
  body.appendChild(style)

  function createButton(text, classes) {
    const button = document.createElement('div')
    button.className = classes.join(' ')
    button.innerHTML = text
    button.setAttribute("contenteditable", false)

    return button
  }

  // 获取主体
  const mainDom = ['main', 'div.body-inner']
  const main = document.querySelector(mainDom.find(x => document.querySelector(x)))

  // 到顶
  const up = createButton('&#x1F446;', ['L-btn', 'up'])

  up.addEventListener("click", function () {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
    main && main.scrollTo({ top: 0, left: 0, behavior: "smooth" })
  })

  // 到底
  const down = createButton('&#x1F447', ['L-btn', 'down'])

  down.addEventListener("click", function () {
    const height = main?.scrollHeight || document.documentElement.scrollHeight

    window.scrollTo({ top: document.documentElement.scrollHeight, left: 0, behavior: "smooth" })
    main && main.scrollTo({ top: height, left: 0, behavior: "smooth" })
  })

  body.appendChild(up)
  body.appendChild(down)
})();
