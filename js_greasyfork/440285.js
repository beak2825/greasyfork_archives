// ==UserScript==
// @name         keylol-history
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  给Keylol增加历史浏览记录功能
// @author       yuyinws
// @include      https://keylol.com/*
// @icon         https://keylol.com/favicon.ico
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440285/keylol-history.user.js
// @updateURL https://update.greasyfork.org/scripts/440285/keylol-history.meta.js
// ==/UserScript==

// URL参数获取
function GetQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  var context = ''
  if (r != null) context = decodeURIComponent(r[2])
  reg = null
  r = null
  return context == null || context == '' || context == 'undefined'
    ? ''
    : context
}
class History {
  constructor(url) {
    this.history = JSON.parse(window.localStorage.getItem('history')) || []
    if (url.indexOf('https://keylol.com/t') > -1) {
      this.tID = url.split('t')[3].split('-')[0]
      this.tTitle = document.querySelector('#thread_subject').title
      this.add()
    } else if (GetQueryString('tid')) {
      this.tID = GetQueryString('tid')
      this.tTitle = document.querySelector('#thread_subject').title
      this.add()
    }
  }

  add() {
    this.history.forEach((item, index) => {
      if (item.tID === this.tID) {
        this.history.splice(index, 1)
        return
      }
    })

    this.history.unshift({
      tID: this.tID,
      tTitle: this.tTitle,
    })

    window.localStorage.setItem('history', JSON.stringify(this.history))
  }

  get() {
    return this.history
  }
}

// 渲染卡片样式
const renderPanel = (_hisList) => {
  let ref = document.querySelector('.list-inline').childNodes[4]
  let father = document.querySelector('.list-inline')
  let historyDom = document.createElement('div')
  let historyCard = document.createElement('div')
  let clearHistory = document.createElement('button')
  let historyWrapper = document.createElement('div')
  let historyInput = document.createElement('input')

  historyInput.placeholder = '搜索历史记录'
  historyInput.id = 'history-input'
  historyWrapper.id = 'history-wrapper'

  clearHistory.id = 'clearHistory'
  clearHistory.innerHTML = '清空记录'

  historyInput.style.display = 'block'
  historyInput.style.marginLeft = '5px'
  historyInput.style.width = '200px'
  historyInput.style.borderRadius = '3px'
  historyInput.style.border = '1px solid #D1D5DB'
  
  clearHistory.style.margin = '4px 0 4px 5px'
  clearHistory.style.padding = '4px 8px'
  clearHistory.style.background = '#74bcff'
  clearHistory.style.border = 'none'
  clearHistory.style.color = '#fff'
  clearHistory.style.borderRadius = '4px'
  clearHistory.style.cursor = 'pointer'

  historyDom.style.position = 'relative'
  historyDom.id = 'history'
  historyDom.style.height = '30px'
  historyDom.style.lineHeight = '27px'
  historyDom.style.display = 'inline-block'
  historyDom.style.padding = '0 10px'

  historyCard.id = 'historyCard'
  historyCard.style.width = '250px'
  historyCard.style.minHeight = '50px'
  historyCard.style.maxHeight = '200px'
  historyCard.style.overflowY = 'auto'
  historyCard.style.border = '1px solid #D1D5DB'
  historyCard.style.position = 'absolute'
  historyCard.style.left = '-70px'
  historyCard.style.zIndex = '999'
  historyCard.style.backgroundColor = '#fff'
  historyCard.style.display = 'none'

  historyDom.innerHTML =
    '<span id="historyText" style="cursor: pointer;">历史记录</span>'
  father.insertBefore(historyDom, ref)
  historyDom.appendChild(historyCard)
  historyCard.appendChild(clearHistory)
  historyCard.appendChild(historyInput)
  historyCard.appendChild(historyWrapper)

  historyDom.addEventListener('mouseover', () => {
    historyCard.style.display = 'block'
  })
  historyDom.addEventListener('mouseout', () => {
    historyCard.style.display = 'none'
  })

  historyInput.addEventListener('input', (e) => {
    const filterdHisList = _hisList.filter((item) => {
      if (item.tTitle.indexOf(e.target.value) > -1) {
        return true
      }
    })
    renderHistory(filterdHisList)
  })

  let historyText = document.querySelector('#historyText')
  historyText.addEventListener('mouseover', () => {
    historyDom.style.backgroundColor = '#74bcff'
    historyText.style.color = '#fff'
  })
  historyText.addEventListener('mouseout', () => {
    historyDom.style.backgroundColor = '#f7f7f7'
    historyText.style.color = '#000'
  })

  clearHistory.addEventListener('click', () => {
    window.localStorage.removeItem('history')
    historyWrapper.innerHTML = '<p style="text-align: center;">暂无历史记录</p>'
  })
}

// 渲染历史记录
const renderHistory = (_hisList) => {
  let historyWrapper = document.querySelector('#history-wrapper')
  historyWrapper.innerHTML = ''
  if (_hisList.length === 0) {
    historyWrapper.innerHTML = '<p style="text-align: center;">暂无历史记录</p>'
    return
  }
  _hisList.forEach((item) => {
    let historyCardItem = document.createElement('div')
    historyCardItem.style.padding = '5px'
    historyCardItem.style.cursor = 'pointer'
    historyCardItem.style.borderBottom = '1px solid #D1D5DB'
    historyCardItem.style.fontSize = '12px'
    historyCardItem.style.color = '#000'
    historyCardItem.style.lineHeight = '20px'
    historyCardItem.innerHTML = `<a id="aTag" href="https://keylol.com/t${item.tID}-1-1">${item.tTitle}</a>`
    historyWrapper.appendChild(historyCardItem)
  })
}

;(() => {
  const history = new History(window.location.href)
  renderPanel(history.get())
  renderHistory(history.get())
})()
