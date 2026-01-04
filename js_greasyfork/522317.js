// ==UserScript==
// @name         facebook 广告号工具
// @namespace    http://tampermonkey.net/
// @version      2024-11-31
// @description  获取facebook广告号
// @author       zsynuting
// @match        https://adsmanager.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522317/facebook%20%E5%B9%BF%E5%91%8A%E5%8F%B7%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/522317/facebook%20%E5%B9%BF%E5%91%8A%E5%8F%B7%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // 是否继续detect
  const addElement = (parent, tag, id, style) => {
      let el = undefined;
      if (id) {
          el = document.getElementById(id)
      }
      if (!el){
          el = document.createElement(tag)
          el.id = id
          if (style) {
              el.style = style
          }
          parent = parent || document.body
          parent.append(el)
      }
      return el;
  }
  const panel = addElement(undefined, 'div', 'panel', 'position:fixed; right: 100px; top: 100px; z-index: 9999; background: #fff; border: 1px solid red; max-height: 600px; overflow-y: auto;')
  let detecting = false;
  const adIdListDivId = 'ad-id-list-div'
  const adAccountMap = new Map()
  let keywords = []

  const urlObj = new URL(document.location.href)
  const businessId = urlObj.searchParams.get('business_id')
  const actId = urlObj.searchParams.get('act')
  console.log('business id', businessId, 'act', actId)

  const getFilteredAccounts = () => {
      return Array.from(adAccountMap.keys()).filter((id) => {
          if (keywords.length) {
              const account = adAccountMap.get(id)
              return keywords.includes(id) || keywords.some(keyword => account.name.includes(keyword))
          } else {
              return true
          }
      }).map((id, index) => {
          const account = adAccountMap.get(id)
          return account
      })
  }

  const loadAdAccountMap = () => {
      const str = localStorage.getItem(`${businessId}-ad-accounts`)
      const adAccounts = JSON.parse(str)
      if (adAccounts) {
          adAccounts.forEach(account => account.id && adAccountMap.set(account.id, account))
      }
  }

  const storeAdAccounts = () => {
      const adAccounts = Array.from(adAccountMap.values())
      localStorage.setItem(`${businessId}-ad-accounts`, JSON.stringify(adAccounts))
  }

  const replaceAdId = (adId) => {
      const url = document.location.href.replace(/act=\w+/, `act=${adId}`)
      return url
  }

  loadAdAccountMap()

  const addSelect = () => {
      let oldSelect = document.getElementById('ad-account-selector')
      const select = addElement(panel, 'select', 'ad-account-selector')
      select.replaceChildren()
      const accounts = getFilteredAccounts()
      select.value = actId
      if (accounts.length) {
          accounts.forEach(account => {
              const option = document.createElement('option');
              option.innerText = account.id;
              option.value = account.id;
              select.append(option);
          })
         !oldSelect && select.addEventListener('change', function(e) {
              const adId = e.target.value;
              if (adId) {
                  const url = replaceAdId(adId)
                  document.location.href = url;
              }
          });
      }
  }

  const loopingDetect = () => {
      if (!detecting) {
          return
      } else {
          console.log('---获取ad id list---')
          Array.from(document.querySelectorAll('div [role=row]')).forEach((div) => {
              const divText = div.innerText
              console.log('divText', divText)
              const matches = divText.match(/(.+)\n.+[:：]\s?(\d+)/i)
              if (matches) {
                  const name = matches[1]
                  const id = matches[2]
                  if (id) {
                      adAccountMap.set(id, { name, id })
                  }
              }
          })
           Array.from(document.querySelectorAll('div [role=menu] li')).forEach((div) => {
              const divText = div.innerText
              console.log('divText', divText)
              const matches = divText.match(/(.+)\n.+[:：]\s?(\d+)/i)
              if (matches) {
                  const name = matches[1]
                  const id = matches[2]
                  if (id) {
                      adAccountMap.set(id, { name, id })
                  }
              }
          })
          showAdAccounts()
          setTimeout(loopingDetect, 1000)
      }
  }

  const addDetectButton = () => {
      const button = document.createElement('button')
      button.innerText = '开始获取广告号'
      button.addEventListener('click', function (e) {
          if (detecting) {
              detecting = false
              button.innerText = '开始获取广告号'
              storeAdAccounts()
              addSelect()
          } else {
              button.innerText = '停止获取广告号'
              detecting = true
              loopingDetect()
          }
      }, true)
      panel.append(button)
  }

  const showAdAccounts = () => {
      let div = document.getElementById(adIdListDivId)
      if (!div) {
          div = addElement(panel, 'div', adIdListDivId, '')
      }
      div.innerHTML = getFilteredAccounts().map((account,index) => {
          return `<div>${index+1} - <a href="${replaceAdId(account.id)}" target="_blank">${account.name}: ${account.id}</a></div>`
      }).join('')
  }

  const addCopyButton = () => {
      const button = addElement(panel, 'button')
      button.innerText = '复制'
      button.addEventListener('click', function(e) {
          const str = getFilteredAccounts().map(account => account.id).join('\n')
          navigator.clipboard.writeText(str)
      })
  }

  const addClearButton = () => {
      const button = addElement(panel, 'button')
      button.innerText = '清空'
      button.addEventListener('click', function(e) {
          adAccountMap.clear()
          storeAdAccounts()
          document.location.reload()
      })
  }

  const addShowButton = () => {
      const button = addElement(panel, 'button', 'show-button')
      button.innerText = '显示'
      let show = false
      button.addEventListener('click', function(e) {
          const div = document.getElementById(adIdListDivId)
          if (show) {
              button.innerText = '显示'
              if (div) {
                  div.style.display = 'none'
              }
          } else {
              button.innerText = '隐藏'
              showAdAccounts()
              if (div) {
                  div.style.display = ''
              }
          }
          show = !show
      })
  }

  const addOpenButton = () => {
      const button = addElement(panel, 'button', 'open-button')
      button.innerText = '打开'

      button.addEventListener('click', function(e) {
          Array.from(adAccountMap.keys()).forEach(id => {
              window.open(replaceAdId(id), '_blank')
          })
      })
  }

  const addSearchInput = () => {
      const div = addElement(panel, 'div')
      const searchInput = addElement(div, 'textarea', 'search')
      searchInput.placeholder="查询"
      searchInput.style.width="80%"
      searchInput.addEventListener('change', function(e) {
          const searchText = e.target.value;
          keywords = searchText.split(/\s/).map(word => word.trim())
          showAdAccounts()
          addSelect()
      })
  }

    addDetectButton()
    addShowButton()
    addOpenButton()
    addCopyButton()
    addClearButton()
    addSelect()
    addSearchInput()
})();