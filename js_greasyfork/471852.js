// ==UserScript==
// @name         智慧团建组织关系审批自动搜索 auto-search-names-in-managetransferprocessdo-at-zhtj.youth.cn
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  在智慧团建网站的组织关系审批页面中自动完成姓名搜索和数据收集
// @author       PDLi
// @match        https://zhtj.youth.cn/*
// @icon         https://zhtj.youth.cn/zhtj/static/img/web_logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471852/%E6%99%BA%E6%85%A7%E5%9B%A2%E5%BB%BA%E7%BB%84%E7%BB%87%E5%85%B3%E7%B3%BB%E5%AE%A1%E6%89%B9%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%20auto-search-names-in-managetransferprocessdo-at-zhtjyouthcn.user.js
// @updateURL https://update.greasyfork.org/scripts/471852/%E6%99%BA%E6%85%A7%E5%9B%A2%E5%BB%BA%E7%BB%84%E7%BB%87%E5%85%B3%E7%B3%BB%E5%AE%A1%E6%89%B9%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%20auto-search-names-in-managetransferprocessdo-at-zhtjyouthcn.meta.js
// ==/UserScript==

(function () {
  'use strict'

  let inputName
  let searchButton

  const keys = ['姓名', '申请时间', '完成时间', '转出团组织', '转入团组织', '处理状态', '操作']

  let sleepTime = 1000
  let names = []
  let result = []
  let jsonResult = ''
  let csvResult = ''

  function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
  }

  function createWindow() {
    const floatWindowWithButton = document.createElement('div')
    floatWindowWithButton.id = 'float-window-with-button'
    floatWindowWithButton.style.display = 'none'

    const floatWindow = document.createElement('div')
    floatWindow.style.width = '300px'
    floatWindow.style.height = '500px'
    floatWindow.style.background = 'white'
    floatWindow.style.color = 'black'
    floatWindow.style.position = 'fixed'
    floatWindow.style.bottom = '1px'
    floatWindow.style.right = '0px'
    floatWindow.style.padding = '30px'
    floatWindow.style.fontSize = '5px'
    floatWindow.style.display = 'block'
    floatWindow.style.border = '1px solid black'
    floatWindow.style.fontFamily = '黑体'
    floatWindow.id = 'float-window'

    const minButton = document.createElement('button')
    minButton.style.position = 'absolute'
    minButton.style.height = '20px'
    minButton.style.width = '30px'
    minButton.style.bottom = '481px'
    minButton.style.right = '0px'
    minButton.style.fontSize = '2px'
    minButton.style.fontWeight = '700'
    minButton.style.fontFamily = '黑体'
    minButton.innerText = '折叠'
    minButton.id = 'min-button'
    minButton.addEventListener('click', () => {
      let dispaly = floatWindow.style.display
      if (dispaly === 'block') {
        floatWindow.style.display = 'none'
        minButton.innerText = '展开'
      } else {
        floatWindow.style.display = 'block'
        minButton.innerText = '折叠'
      }
    })

    const floatWindowInner = document.createElement('div')
    floatWindowInner.id = 'float-window-inner'

    const controllers = document.createElement('div')
    controllers.id = 'controller'

    const floatWindowTextContainer = document.createElement('div')
    floatWindowTextContainer.id = 'float-window-text-container'
    floatWindowTextContainer.style.marginTop = '40px'

    const beforeTextGrid = document.createElement('div')
    beforeTextGrid.style.display = 'grid'
    beforeTextGrid.style.gridTemplateColumns = '54% 16% 30%'

    const formatSelectorLabel = document.createElement('div')
    formatSelectorLabel.innerText = '格式：'
    formatSelectorLabel.style.fontWeight = '700'

    const formatSelector = document.createElement('select')
    formatSelector.id = 'format-selector'
    const optionJson = document.createElement('option')
    optionJson.text = 'JSON'
    optionJson.value = 'JSON'
    const optionCsv = document.createElement('option')
    optionCsv.text = 'CSV'
    optionCsv.value = 'CSV'
    formatSelector.add(optionJson)
    formatSelector.add(optionCsv)
    formatSelector.addEventListener('change', () => {
      displayResult()
    })

    const floatWindowTextLabel = document.createElement('div')
    floatWindowTextLabel.innerText = '搜索结果：'
    floatWindowTextLabel.style.fontWeight = '700'

    const floatWindowText = document.createElement('div')
    floatWindowText.id = 'float-window-text'
    floatWindowText.style.width = '240px'
    floatWindowText.style.height = '200px'
    floatWindowText.style.padding = '2px 5px'
    floatWindowText.style.overflow = 'auto'
    floatWindowText.style.border = '1px solid black'
    floatWindowText.style.marginTop = '3px'

    const sleepTimeControllerLabel = document.createElement('label')
    sleepTimeControllerLabel.innerText = '每次搜索间隔时间（毫秒）：'

    const sleepTimeController = document.createElement('input')
    sleepTimeController.id = 'sleep-time-controller'
    sleepTimeController.type = 'number'
    sleepTimeController.value = sleepTime
    sleepTimeController.addEventListener('change', () => {
      sleepTime = sleepTimeController.value
    })

    const namesInputLabel = document.createElement('label')
    namesInputLabel.innerText = '要被搜索的姓名（以空白字符分隔）：'
    namesInputLabel.style.marginBottom = '0'

    const namesInput = document.createElement('textarea')
    namesInput.id = 'names-input'
    namesInput.rows = '5'
    namesInput.style.resize = 'none'
    namesInput.style.width = '100%'
    namesInput.style.fontWeight = '500'
    namesInput.style.lineHeight = '12px'
    namesInput.style.padding = '2px 5px'

    const StartSearchButton = document.createElement('button')
    StartSearchButton.innerText = '开始搜索'
    StartSearchButton.style.margin = '-2px 0px'
    StartSearchButton.style.color = 'black'
    StartSearchButton.style.position = 'absolute'
    StartSearchButton.style.right = '30px'
    StartSearchButton.style.fontWeight = '700'
    StartSearchButton.addEventListener('click', async () => {
      inputName = document.querySelector("#pane-first > div.row > div:nth-child(3) > div > div > input")
      searchButton = document.querySelector("#pane-first > div.row > div.col-sm-1.floatright > button")
      result = []
      names = namesInput.value.split(/\s+/)
      names = names.filter(x => x !== '')
      await doSearch()
      jsonResult = JSON.stringify(result)
      generateCsvResult()
      displayResult()
    })

    const fileInputLabel = document.createElement('label')
    fileInputLabel.innerText = '从txt文件读取'
    fileInputLabel.style.cursor = 'pointer'
    fileInputLabel.style.color = 'blue'
    fileInputLabel.addEventListener('mouseover', () => {
      fileInputLabel.style.textDecoration = 'underline'
    })
    fileInputLabel.addEventListener('mouseleave', () => {
      fileInputLabel.style.textDecoration = 'none'
    })

    const fileInput = document.createElement('input')
    fileInput.id = 'names-file-input'
    fileInput.type = 'file'
    fileInput.accept = '.txt'
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0]
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        namesInput.value = reader.result
      }
    })

    const exportButtonsGrid = document.createElement('div')
    exportButtonsGrid.style.display = 'grid'
    exportButtonsGrid.style.gridAutoFlow = 'column'
    exportButtonsGrid.style.justifyContent = 'end'
    exportButtonsGrid.style.marginTop = '5px'
    exportButtonsGrid.style.fontWeight = '700'

    const exportJsonButton = document.createElement('button')
    exportJsonButton.innerText = '导出为JSON'
    exportJsonButton.style.marginLeft = '5px'
    exportJsonButton.addEventListener('click', () => {
      const blob = new Blob([jsonResult], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = new Date().toLocaleString().replace(/\s+/g, '-').replace(/[:/]/g, '-') + '.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    })

    const exportCsvButton = document.createElement('button')
    exportCsvButton.innerText = '导出为CSV'
    exportCsvButton.style.marginLeft = '5px'
    exportCsvButton.addEventListener('click', () => {
      const url = 'data:application/csv;charset=utf-8,\ufeff' + encodeURIComponent(csvResult)
      const a = document.createElement('a')
      a.href = url
      a.download = new Date().toLocaleString().replace(/\s+/g, '-').replace(/[:/]/g, '-') + '.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    })

    sleepTimeControllerLabel.appendChild(sleepTimeController)
    controllers.appendChild(sleepTimeControllerLabel)
    namesInputLabel.appendChild(namesInput)
    controllers.appendChild(namesInputLabel)
    fileInputLabel.appendChild(fileInput)
    controllers.appendChild(fileInputLabel)
    controllers.appendChild(StartSearchButton)
    floatWindowInner.appendChild(controllers)
    beforeTextGrid.appendChild(floatWindowTextLabel)
    beforeTextGrid.appendChild(formatSelectorLabel)
    beforeTextGrid.appendChild(formatSelector)
    exportButtonsGrid.appendChild(exportJsonButton)
    exportButtonsGrid.appendChild(exportCsvButton)
    floatWindowTextContainer.appendChild(beforeTextGrid)
    floatWindowTextContainer.appendChild(floatWindowText)
    floatWindowTextContainer.appendChild(exportButtonsGrid)
    floatWindowInner.appendChild(floatWindowTextContainer)
    floatWindow.appendChild(floatWindowInner)
    floatWindowWithButton.appendChild(floatWindow)
    floatWindowWithButton.appendChild(minButton)
    document.body.appendChild(floatWindowWithButton)

    function displayResult() {
      switch (formatSelector.value) {
        case 'JSON':
          floatWindowText.innerText = jsonResult
          break
        case 'CSV':
          floatWindowText.innerText = csvResult
          break
      }
    }
  }

  function changeName(name) {
    const events = {
      foucs: new Event('focus'),
      input: new Event('input'),
      change: new Event('change'),
      blur: new Event('blur')
    }
    inputName.value = name
    inputName.dispatchEvent(events.foucs)
    inputName.dispatchEvent(events.input)
    inputName.dispatchEvent(events.change)
    inputName.dispatchEvent(events.blur)
  }

  async function search(name) {
    let res = []
    changeName(name)
    searchButton.click()
    await sleep(sleepTime)
    const cells = document.querySelectorAll("#pane-first > div:nth-child(2) > div > div.el-table__body-wrapper.is-scrolling-none > table > tbody tr td")
    if (cells.length === 0) {
      res.push({
        姓名: name,
        查询成功: '否',
      })
      keys.forEach(key => {
        if (key !== '姓名') {
          res[0][key] = ''
        }
      })
    }
    cells.forEach((cell, i) => {
      if (i % 7 === 0) res.push({})
      res[parseInt(i / 7)][keys[i % 7]] = cell.innerText
      if (i % 7 === 0) res[parseInt(i / 7)]['查询成功'] = '是'
    })
    res = res.filter(r => r['姓名'] === name)
    res.forEach(r => result.push(r))
  }

  async function doSearch() {
    for (let i = 0; i < names.length; i++) {
      let name = names[i]
      await search(name)
    }
  }

  function generateCsvResult() {
    csvResult = ''
    let header = {
      姓名: '姓名',
      查询成功: '查询成功'
    }
    for (let i = 1; i < keys.length; i++) {
      header[keys[i]] = keys[i]
    }
    let resultCopy = JSON.parse(JSON.stringify(result))
    resultCopy.unshift(header)
    resultCopy.map(item => {
      Object.keys(header).map(key => {
        csvResult += item[key] + ','
      })
      csvResult += '\r\n'
    })
  }

  createWindow()

  setInterval(() => {
    const url = window.location.href
    if (url === 'https://zhtj.youth.cn/zhtj/center/manage/managetransferprocessdo') {
      document.getElementById('float-window-with-button').style.display = 'block'
    } else {
      document.getElementById('float-window-with-button').style.display = 'none'
    }
  }
  ,500)
})()
