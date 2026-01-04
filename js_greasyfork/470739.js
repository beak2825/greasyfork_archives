// ==UserScript==
// @name         为 Eslint 在线运行添加修复按钮
// @license      GPL-3.0 License
// @namespace    https://github.com/QIUZAIYOU/AddFixButtonToESLintOnlinePlayground/tree/main
// @version      0.3
// @description  为 ESLint 在线运行（中英文官网）添加修复按钮
// @author       QIAN
// @match        https://eslint.nodejs.cn/play/
// @match        https://eslint.org/play/
// @icon         https://eslint.nodejs.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470739/%E4%B8%BA%20Eslint%20%E5%9C%A8%E7%BA%BF%E8%BF%90%E8%A1%8C%E6%B7%BB%E5%8A%A0%E4%BF%AE%E5%A4%8D%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/470739/%E4%B8%BA%20Eslint%20%E5%9C%A8%E7%BA%BF%E8%BF%90%E8%A1%8C%E6%B7%BB%E5%8A%A0%E4%BF%AE%E5%A4%8D%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
  'use strict'
  const documentLangIsChinese = () => {
    const lang = document.documentElement.lang
    return lang === 'zh-CN'
  }
  const isChinese = documentLangIsChinese()
  const addButtonToConfigOptions = () => {
    const button = document.createElement('button')
    const cssCode = '#handleFixButton{width:calc(100% - 20px);height:60px;background:#4b32c3;color:#fff;margin:10px;box-sizing:border-box;border-radius:4px;font-size:20px;}#handleFixButton.disabled{opacity:0.6;cursor:not-allowed;}#problems{display:flex;gap:20px;align-items:center;justify-content:space-between;width:calc(100% - 20px);margin: 10px;box-sizing:border-box;border:1px solid #667085;padding:10px;color:#D0D5DD;border-radius:4px;}#problems>span{width:100%;text-align:center;}#problems>em{display:block;width:1px;height:20px;background:#667085;}'
    const styleElement = document.createElement('style')
    styleElement.textContent = cssCode
    button.textContent = isChinese ? '修复' : 'Fix'
    button.id = 'handleFixButton'
    const problems = document.createElement('div')
    problems.id = 'problems'
    problems.innerHTML = `<span id="total">${isChinese ? '待修复：' : 'issues: '}0</span><em></em><span id="solved">${isChinese ? '已修复：' : 'fixed: '}0</span>`
    const configOptions = document.querySelector('.playground__config-options__sections')
    if (configOptions.firstChild) {
      configOptions.insertBefore(button, configOptions.firstChild)
      configOptions.insertBefore(problems, configOptions.firstChild)
      configOptions.insertBefore(styleElement, configOptions.firstChild)
    } else {
      configOptions.appendChild(button)
      configOptions.appendChild(problems)
      configOptions.appendChild(styleElement)
    }
  }
  const handleFix = () => {
    let times = 0
    refreshProblemsData()
    handleFixButton.addEventListener('click', function () {
      const problemsTotal = refreshProblemsData()
      handleFixButton.disabled = true
      handleFixButton.classList.add('disabled')
      const setIntervalID = setInterval(function () {
        if (times < problemsTotal) {
          const fixButton = document.querySelector('button.alert__fix-btn')
          fixButton.click()
          times++
          document.querySelector('#solved').textContent = `${isChinese ? '已修复：' : 'fixed: '}${times}`
          console.log(isChinese ? '已修复' : 'fixed')
        } else {
          clearInterval(setIntervalID)
          alert(isChinese ? '修复完毕！' : 'complate!')
          handleFixButton.disabled = false
          handleFixButton.classList.remove('disabled')
        }
      }, 100)
    })
  }
  const refreshProblemsData = () => {
    const fixButtons = document.querySelectorAll('button.alert__fix-btn')
    document.querySelector('#total').textContent = `${isChinese ? '待修复：' : 'issues: '}${fixButtons.length}`
    return fixButtons.length
  }

  addButtonToConfigOptions()
  handleFix()
})()
