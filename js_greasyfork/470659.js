// ==UserScript==
// @name        fhgo
// @namespace   Violentmonkey Scripts
// @match       https://fhgo-manage.newhopedairy.cn/**
// @grant       none
// @version     1.1
// @author      -
// @description 2023/7/12 20:07:08
//  @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470659/fhgo.user.js
// @updateURL https://update.greasyfork.org/scripts/470659/fhgo.meta.js
// ==/UserScript==
// @ts-check

let btn

function setCopyBtn() {
  btn = document.createElement('button')
  btn.classList.add('ant-btn', 'ant-btn-primary')
  btn.style.cssText +=
    'position: absolute;top: 0;left: 400px;z-index:999;background-color: rgb(9, 58, 158);color: rgb(232, 230, 227);padding:8px 20px;'
  btn.textContent = '设置复制'
  btn.onclick = setCopy
  document.body.appendChild(btn)
}

const reg = /(.*)\((.+)\)/

function setCopy() {
  document.querySelectorAll('.ant-spin-container span').forEach((el) => {
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
  document.querySelectorAll('td.newhope-table-cell').forEach((el) => {
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
  btn.textContent = '设置复制成功'
}

window.onload = () => {
  console.log('use sc')
  setCopyBtn()
}
