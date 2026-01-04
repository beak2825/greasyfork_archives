// ==UserScript==
// @name        yapi-gen-code - seevin.com
// @namespace   Violentmonkey Scripts
// @match       *://api.seevin.com/*
// @grant       GM_setClipboard
// @version     1.0
// @author      Gorvey
// @description 2024/12/29 14:44:23
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js
// @resource css https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/default.min.css
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522259/yapi-gen-code%20-%20seevincom.user.js
// @updateURL https://update.greasyfork.org/scripts/522259/yapi-gen-code%20-%20seevincom.meta.js
// ==/UserScript==

abduct()

function abduct() {
  const xhrOPen = XMLHttpRequest.prototype.open

  XMLHttpRequest.prototype.open = function () {
    const xhr = this

    if (arguments[1].includes('/api/interface/get?id=')) {
      const getterText = Object.getOwnPropertyDescriptor(
        XMLHttpRequest.prototype,
        'responseText'
      ).get

      Object.defineProperty(xhr, 'responseText', {
        get: () => {
          let result = getterText.call(xhr)
          setTimeout(() => {
            sessionStorage.setItem('result', result)
            renderInDocument()
          }, 500)
          return result
        },
      })
    }

    return xhrOPen.apply(xhr, arguments)
  }
}

function insertAfter(newNode, existingNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling)
}

window.renderInDocument = renderInDocument

const createCopyButton = ({ data }) => {
  const button = document.createElement('button')
  button.textContent = '复制接口定义'
  button.className = 'copy-interface-button'
  button.style.cssText = `
    padding: 5px 10px;
    cursor: pointer;
    background: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    z-index: 9999;
  `

  let resBody = JSON.parse(data.res_body)
  const interfaces = generateTypeScriptInterfaces(resBody)
  console.log(data, resBody, interfaces)
  button.addEventListener('click', async () => {
    if (!interfaces) {
      return window.alert('接口未设置返回数据')
    }
    const updateButtonText = (text, duration = 2000) => {
      button.textContent = text
      setTimeout(() => {
        button.textContent = '复制接口定义'
      }, duration)
    }

    try {
      GM_setClipboard(interfaces)
      updateButtonText('复制成功!')
    } catch (err) {
      updateButtonText('复制失败')
      console.error('复制出错:', err)
    }
  })

  return button
}


const generateTypeScriptInterfaces = (schema, parentName = '') => {
  let result = ''
  let subInterfaces = ''

  if (schema.type === 'object') {
    const interfaceName = parentName || 'ResponseData'
    result += `interface ${interfaceName} {\n`

    for (const [key, prop] of Object.entries(schema.properties)) {
      // 移除对 code 和 msg 的跳过，因为这些也是接口的一部分
      const description = prop.description ?
        `  /** ${prop.description} */\n` : ''

      if (prop.type === 'object') {
        const newInterfaceName = `${interfaceName}${capitalize(key)}`
        const { main, sub } = generateNestedInterfaces(prop, newInterfaceName)
        subInterfaces += sub
        result += `${description}  ${key}: ${newInterfaceName}\n`
      } else if (prop.type === 'array') {
        if (prop.items.type === 'object') {
          const newInterfaceName = `${interfaceName}${capitalize(key)}Item`
          const { main, sub } = generateNestedInterfaces(prop.items, newInterfaceName)
          subInterfaces += sub
          result += `${description}  ${key}: ${newInterfaceName}[]\n`
        } else {
          result += `${description}  ${key}: ${getTsType(prop.items)}[]\n`
        }
      } else {
        result += `${description}  ${key}: ${getTsType(prop)}\n`
      }
    }

    result += '}\n\n'
  }

  return subInterfaces + result
}

const generateNestedInterfaces = (schema, interfaceName) => {
  let main = ''
  let sub = ''

  if (schema.type === 'object') {
    main += `interface ${interfaceName} {\n`

    for (const [key, prop] of Object.entries(schema.properties || {})) {
      const description = prop.description ?
        `  /** ${prop.description} */\n` : ''

      if (prop.type === 'object') {
        const newInterfaceName = `${interfaceName}${capitalize(key)}`
        const { main: nestedMain, sub: nestedSub } = generateNestedInterfaces(prop, newInterfaceName)
        sub += nestedSub
        main += `${description}  ${key}: ${newInterfaceName}\n`
      } else if (prop.type === 'array') {
        if (prop.items && prop.items.type === 'object') {
          const newInterfaceName = `${interfaceName}${capitalize(key)}Item`
          const { main: nestedMain, sub: nestedSub } = generateNestedInterfaces(prop.items, newInterfaceName)
          sub += nestedSub
          main += `${description}  ${key}: ${newInterfaceName}[]\n`
        } else {
          main += `${description}  ${key}: ${getTsType(prop.items)}[]\n`
        }
      } else {
        main += `${description}  ${key}: ${getTsType(prop)}\n`
      }
    }

    main += '}\n\n'
  }

  return { main, sub: sub + main }
}


const getTsType = (prop) => {
  const typeMap = {
    'integer': 'number',
    'string': 'string',
    'boolean': 'boolean',
    'number': 'number'
  }
  return typeMap[prop.type] || 'any'
}

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function renderInDocument(section = '') {
  if (section) {
    sessionStorage.setItem('api-section', section)
  } else {
    section = sessionStorage.getItem('api-section')
  }
  let result = JSON.parse(sessionStorage.getItem('result'))

  if (result.errcode != 0) return

  // 清除已存在的按钮
  document.querySelectorAll('.copy-interface-button').forEach(btn => btn.remove())

  let panelNode = document.querySelector('.panel-view')
  let node = document.querySelector('.caseContainer > div:nth-last-child(2) > .interface-title')
  const copyButton = createCopyButton(result)
  const copyButton2 = createCopyButton(result)
  insertAfter(copyButton, panelNode)
  insertAfter(copyButton2, node)
}
