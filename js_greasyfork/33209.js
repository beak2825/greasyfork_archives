// ==UserScript==
// @name                MicrosoftDocLanguageSwitchButton
// @name:zh-CN          微软文档语言切换按钮
// @name:zh-TW          微軟文檔語言切換按鈕
// @description         fix the language switch button in Microsoft Docs, set your expected language in the script data manually
// @description:zh-CN   修复微软文档中的语言切换按钮，在脚本数据中手动设置你期望的语言
// @description:zh-TW   修復微軟文檔中的語言切換按鈕，在腳本數據中手動設置你期望的語言
// @author              ladit
// @version             1.2.2
// @namespace           https://greasyfork.org/zh-CN/scripts/33209
// @homepageURL         https://github.com/ladit/Userscripts
// @supportURL          https://github.com/ladit/Userscripts

// @grant               GM.setValue
// @grant               GM.getValue
// @match               http*://learn.microsoft.com/en-us/*
// @downloadURL https://update.greasyfork.org/scripts/33209/MicrosoftDocLanguageSwitchButton.user.js
// @updateURL https://update.greasyfork.org/scripts/33209/MicrosoftDocLanguageSwitchButton.meta.js
// ==/UserScript==

(async () => {
  let userLanguage = await GM.getValue('language')
  if (!userLanguage) {
    userLanguage = navigator.language || navigator.userLanguage
    await GM.setValue('language', userLanguage)
  }

  const button = document.querySelector('#lang-link-tablet')
  const url = button.getAttribute('href').replace(/\/en-us\//, `/${userLanguage.toLowerCase()}/`)
  button.setAttribute('href', url)
  button.querySelector('.is-visually-hidden').textContent = `Read in ${userLanguage}`
  button.removeAttribute('hidden')
})()
