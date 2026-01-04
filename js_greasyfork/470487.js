// ==UserScript==
// @name        newhopedairy
// @namespace   Violentmonkey Scripts
// @match       https://fhgouat-manage.newhopedairy.cn/**
// @grant       none
// @version     1.0
// @author      -
// @description 2023/7/9 20:35:21
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470487/newhopedairy.user.js
// @updateURL https://update.greasyfork.org/scripts/470487/newhopedairy.meta.js
// ==/UserScript==
// @ts-check

let btn

function setCopyBtn() {
  btn = document.createElement('button')
  btn.classList.add('ant-btn', 'ant-btn-primary')
  btn.style.cssText += 'position: absolute;top: 0;left: 350px;z-index:999;'
  btn.textContent = '设置复制'
  btn.onclick = setCopy
  document.body.appendChild(btn)
}

const reg = /(.*)\((.+)\)/

function setCopy() {
  document.querySelectorAll('td.ant-table-cell').forEach((el) => {
    el.addEventListener('click', () => {
      let text = el.textContent
      if (text) {
        if (reg.test(text)) {
          text = text.replace(reg, (m, p1, p2) => p2)
        }
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = '设置复制<' + text + '>复制成功'
        })
      }
    })
  })
}

window.onload = () => {
  console.log('use sc')
  setCopyBtn()
}
