// ==UserScript==
// @name         Coinlist Script for Registration
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  NULL
// @author       cc
// @match        https://coinlist.co/*
// @downloadURL https://update.greasyfork.org/scripts/426610/Coinlist%20Script%20for%20Registration.user.js
// @updateURL https://update.greasyfork.org/scripts/426610/Coinlist%20Script%20for%20Registration.meta.js
// ==/UserScript==

// 状态页面
var status_url = 'https://coinlist.co/account/previous-deals'
// 按照优先检测顺序的链接
var url_list = [
  'https://coinlist.co/centrifuge-option-1',
  'https://coinlist.co/centrifuge-option-2',
  'https://coinlist.co/vega-option-1',
  'https://coinlist.co/vega-option-2',
  'https://coinlist.co/vega-option-3',
]
// 按照优先检测顺序的文字
var name_list = [
  'Centrifuge Option 1',
  'Centrifuge Option 2',
  'Vega - Option 1 Sale',
  'Vega - Option 2',
  'Vega - Option 3 Sale',
]
// 后续不用修改
function matchUrl () {
  if (location.href === status_url) {
    console.warn('匹配 status 页面')
    let els = Array.from(document.querySelectorAll('.js-name'))
    if (els.length) {
      let el_names = els.map(el => el.innerText)
      for (let i = 0; i < name_list.length; i++) {
        let name = name_list[i]
        if (!el_names.includes(name)) {
          location.href = `${url_list[i]}/new`
          break
        }
      }
    } else {
      location.href = `${url_list[0]}/new`
    }
  } else {
    for (let i = 0; i < url_list.length; i++) {
      if (location.href.includes(url_list[i])) {
        if (location.href.endsWith('/new')) {
          console.warn('匹配 new 页面')
          document.querySelector('a.js-submit_existing_entity').click()
        } else if (location.href.endsWith('/residence')) {
          console.warn('匹配 residence 页面')
          let select = document.querySelector('.js-country')
          Array.from(select.options).find(option => option.value === 'HK').selected = true
          document.getElementById('forms_offerings_participants_residence_residence_signature').checked = true
          document.querySelector('.js-submit ').click()
        } else if (location.href.endsWith('/additional_info')) {
          console.warn('匹配 additional_info 页面')
          Array.from(document.querySelectorAll('.c-input--radio')).find(el => el.value.includes('virtual currencies')).checked = true
          document.querySelector('.js-submit').click()
        } else {
          console.warn('尝试匹配 完成 页面')
          let code = location.href.slice(location.href.lastIndexOf('/') + 1)
          if (code.match(/-/) && code.match(/\d/) && code.match(/[a-z]/)) {
            console.warn('匹配 完成 页面')
            location.href = status_url
          }
        }
        break
      }
    }
  }
}
// 页面加载完成
window.onload = function () {
  console.warn('脚本加载完成')
  matchUrl()
}