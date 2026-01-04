// ==UserScript==
// @name         yapi typescript interface
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  generate Typescript Interface from Yapi-Api
// @author       🐸
// @include      /^(https|http)://yapi\s*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopcider.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447275/yapi%20typescript%20interface.user.js
// @updateURL https://update.greasyfork.org/scripts/447275/yapi%20typescript%20interface.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const recurse = (properties, currentDeep = 0) => {
    const ident = ' '.repeat((currentDeep+1) * 2)
    const result = Object.entries(properties).reduce((accu, [key, val]) => {
      let s = accu
      val?.description && (s += `\n${ident}//${val?.description}`)
      if (val.type === 'array' && val.items) {
        s += `\n${ident}${key}: Array<`
        if (val.items.type === 'array') {
          s += 'any[]'
        } else if (val.items.type === 'object' && val.items.properties) {
          s += recurse(val.items.properties, currentDeep + 1)
        } else {
          s += val.items.type
        }
        s += '>'
      } else if (val.type === 'object' && val?.properties) {
        s += `\n${ident}${key}: ${recurse(val.properties, currentDeep + 1)}`
      } else {
        s += `\n${ident}${key}: ${val.type}`
      }
      return s + ','
    }, '{')

    return result + `\n${' '.repeat(currentDeep * 2)}}`
  }

  function clipboardCopy (text) {
    const input = document.createElement('textarea')
    input.value = text
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }

  // 通过properties生成interface字符串
  const makeInterfaceStr = (properties) => {
    return 'interface ResInterface' + recurse(properties).replace(/,$/, '')
  }

  const fetchInterface = () => {
    const id = location.pathname.match(/\d+$/)[0]
    fetch(`http://yapi.shopcider.cn/api/interface/get?id=${id}`).then(response => response.json()).then(res => {
      const { properties } = JSON.parse(res.data.res_body)
      const interfaceStr = makeInterfaceStr(properties)
      clipboardCopy(interfaceStr)
    })
  }

  // 提示气泡
  const tipEl = document.createElement('div')
  const styleAttr = document.createAttribute("style")
  styleAttr.value = `
    display: none;
    position: fixed;
    top: 100px;
    left: 50%;
    font-size: 26px;
    line-height: 1;
    color: #2fc29f;
    padding: 8px;
    background: #6fc4b66b;
  }
  `
  tipEl.attributes.setNamedItem(styleAttr)
  tipEl.innerText = '已复制到剪切板'
  document.querySelector('body').appendChild(tipEl)
  let tipTimer = null

  // 添加按钮
  const styleEl = document.createElement('style')
  styleEl.innerText = `
    .interface-content .caseContainer .interface-title:last-of-type:after {
      content: '生成响应体interface';
      display: inline-block;
      margin-left: 20px;
      padding: 0 10px;
      border: 1px solid #b922f6;
      color: #b922f6;
      cursor: pointer;
    }
`
  document.querySelector('body').appendChild(styleEl)

  document.querySelector('body').addEventListener('click', (event) => {
    if(event.target === document.querySelector(`.interface-content .caseContainer .interface-title:last-of-type`)) {
      fetchInterface()
      // 显示提示气泡
      clearInterval(tipTimer)
      tipEl.style.display = 'block'
      tipTimer = setTimeout(() => {
        tipEl.style.display = 'none'
      }, 1500)
    }
  }, true)

})()






