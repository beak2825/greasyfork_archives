// ==UserScript==
// @name         添加备注
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  添加商品备注
// @author       大头肥猫
// @match        https://fxg.jinritemai.com/ffa/morder/order/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        none
// @license      MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @require      https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/481037/%E6%B7%BB%E5%8A%A0%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/481037/%E6%B7%BB%E5%8A%A0%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==
;(function () {
  'use strict'
  // Your code here...

  waitForElementToAppear(
    '.auxo-table-tbody',
    () => {
      if ($('#fileInput').length == 0) {
        addButton('.index_batchOpWrap__paous')
      }

    },
    2000
  )
})()

const addButton = parent => {
  const attrElement = $(parent)
  const btn = $('<button class="upload-excel">填写备注</button>')
  const input = $('<input type="file" id="fileInput" />')

  attrElement.append(input)
  attrElement.append(btn)

  input.css('margin-left', '10px')
  btn.css('margin-left', '10px')

  btn.click(event => {
    event.stopPropagation()
    event.preventDefault()
    start()
  })
}

const start = async () => {
  let fileInput = $('#fileInput')[0]

  if (fileInput.files.length > 0) {
    let file = fileInput.files[0]

    let reader = new FileReader()
    reader.onload = function (e) {
      let data = new Uint8Array(e.target.result)
      let workbook = XLSX.read(data, { type: 'array' })

      // 假设 Excel 文件只有一个表格，获取第一个表格的数据
      let sheetName = workbook.SheetNames[0]
      let worksheet = workbook.Sheets[sheetName]

      // 解析数据
      let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      analyzeData(jsonData)
      // 打印解析后的数据
      console.log(jsonData)
    }

    reader.readAsArrayBuffer(file)
  } else {
    console.log('请选择Excel文件')
  }

}

const analyzeData = jsonData => {
  let keyMap = new Map()
  let transitMap = new Map()

  jsonData.forEach(item => {
    const address = item[21]
    const trackNum = item[18]
    const transitWay = item[22] //0中转仓 1拼多多
    if (address && trackNum) {
      const orderId = address.match(/\d+/g) || ['']
      if (keyMap.get(orderId[0])) {
        keyMap.set(orderId[0], keyMap.get(orderId[0]) + ',' + trackNum)
      } else {
        keyMap.set(orderId[0], trackNum)
      }
      transitMap.set(orderId[0], transitWay)
    }
  })
  setRemarks(keyMap, transitMap)
}

const setRemarks = async (keyMap, transitMap)=> {
  const orderElements = Array.from($('.auxo-table-row-level-0'))
  for (let i = 0; i < orderElements.length; i++) {
    const element = orderElements[i]
    const orderID = $(element).attr('data-row-key')
    const remarkBtns = $('div[data-guide="flag"]')
    
    const trackNum = keyMap.get(String(orderID), '')

    if (trackNum && trackNum != '查询失败') {
      console.log(orderID, trackNum, transitMap.get(String(orderID)))
      remarkBtns[i].click()
      const textAreaEle = $('#seller_words')
      const textAreaValue = $('#seller_words').val()

      const saveBtn = $('.auxo-modal-content .auxo-btn')[1]
      const cancelBtn = $('.auxo-modal-content .auxo-btn')[0]

      if (textAreaValue.search(trackNum) != -1) {
        cancelBtn.click()
      } else {
        if (transitMap.get(String(orderID)) == 0) {
          $('.auxo-radio-input[value="3"]').parent().click() //绿标
        } else {
          $('.auxo-radio-input[value="1"]').parent().click() //紫标
        }
        changeReactInputValue(textAreaEle[0], trackNum)
        saveBtn.click()
      }
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('complete')
    }
  }
  alert('已完成')
}

//调用下面这个函数可以给框架包装过的input框赋值
function changeReactInputValue(inputDom, newText) {
  let lastValue = inputDom.value
  inputDom.value = newText
  let event = new Event('input', { bubbles: true })
  event.simulated = true
  let tracker = inputDom._valueTracker
  if (tracker) {
    tracker.setValue(lastValue)
  }
  inputDom.dispatchEvent(event)
}

// 检查某个元素是否出现
function waitForElementToAppear(elementSelector, callback, intervalMs) {
  let checkInterval = setInterval(function () {
    let element = $(elementSelector)
    if (element.length > 0) {
      callback(element)
      // clearInterval(checkInterval)
    }
  }, intervalMs)
}
