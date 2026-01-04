// ==UserScript==
// @name         Google翻譯自動繁英互換
// @description  自動切換輸出語言
// @version      1
// @author       snow
// @license      Unlicense
// @match        *://translate.google.com/*
// @match        *://translate.google.com.tw/*
// @namespace https://greasyfork.org/users/564644
// @downloadURL https://update.greasyfork.org/scripts/403660/Google%E7%BF%BB%E8%AD%AF%E8%87%AA%E5%8B%95%E7%B9%81%E8%8B%B1%E4%BA%92%E6%8F%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/403660/Google%E7%BF%BB%E8%AD%AF%E8%87%AA%E5%8B%95%E7%B9%81%E8%8B%B1%E4%BA%92%E6%8F%9B.meta.js
// ==/UserScript==
'use strict'

const sourceTextInputBox = document.querySelector('#source')
const sourceLangSelector = document.querySelector('.sl-selector a')
window.location.hash = '#view=home&op=translate&sl=auto&tl=en&text=' + sourceTextInputBox.value
autoSwitchLanguage()
new window.MutationObserver(autoSwitchLanguage).observe(sourceLangSelector, { childList: true })

function autoSwitchLanguage () {
  if (sourceTextInputBox.value === '') return
  const sourceLangIsEnglish = /英文|English/.test(sourceLangSelector.textContent)
  const targetLang = sourceLangIsEnglish ? 'zh-TW' : 'en'
  window.location.hash = window.location.hash.replace(/&tl=[^&]+/, '&tl=' + targetLang)
  window.dispatchEvent(new window.HashChangeEvent('hashchange'))
}
