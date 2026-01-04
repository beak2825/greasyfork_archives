// ==UserScript==
// @name         通用文本替换工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动替换网页文本，支持正则、快捷键控制、导入导出规则。仅在设置中指定的网站生效
// @author       233YUZI
// @match        *://www.shitouxs.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537708/%E9%80%9A%E7%94%A8%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/537708/%E9%80%9A%E7%94%A8%E6%96%87%E6%9C%AC%E6%9B%BF%E6%8D%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const shortcutKey = 'm'
  const shortcutCtrl = true
  const panelId = 'replace-text-panel'
  const domain = location.hostname
  let allRules = GM_getValue('replace_rules', {})

  function parseRuleFrom(raw) {
    const regMatch = raw.match(/^\/(.+)\/([gimsuy]*)$/)
    if (regMatch) {
      try {
        return { type: 'regex', value: new RegExp(regMatch[1], regMatch[2]) }
      } catch {
        alert('无效的正则表达式')
        return null
      }
    } else {
      return { type: 'text', value: raw }
    }
  }

  function getCurrentDomainRules() {
    return allRules[domain] || []
  }

  function saveRules(domainKey, rules) {
    allRules[domainKey] = rules
    GM_setValue('replace_rules', allRules)
  }

  function addRule(toAll, from, to) {
    if (!from) return
    const newRule = { from, to }
    if (toAll) {
      for (const d of Object.keys(allRules)) {
        allRules[d].push(newRule)
      }
    } else {
      if (!allRules[domain]) allRules[domain] = []
      allRules[domain].push(newRule)
    }
    GM_setValue('replace_rules', allRules)
    alert('添加成功，刷新页面生效')
  }

  function deleteRule(index) {
    if (!allRules[domain]) return
    allRules[domain].splice(index, 1)
    GM_setValue('replace_rules', allRules)
    alert('删除成功，刷新页面生效')
  }

  function replaceText(rules) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false)
    const textNodes = []
    while (walker.nextNode()) textNodes.push(walker.currentNode)

    for (const node of textNodes) {
      let text = node.nodeValue
      for (const { from, to } of rules) {
        const parsed = parseRuleFrom(from)
        if (!parsed) continue
        text = parsed.type === 'regex' ? text.replace(parsed.value, to) : text.split(parsed.value).join(to)
      }
      node.nodeValue = text
    }
  }

  function createPanel() {
    if (document.getElementById(panelId)) return

    const panel = document.createElement('div')
    panel.id = panelId
    panel.style = `
      position: fixed;
      top: 100px;
      right: 100px;
      z-index: 9999;
      background: white;
      border: 1px solid black;
      padding: 10px;
      font-size: 14px;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      max-width: 350px;
    `
    panel.innerHTML = `
      <div>
        <strong>当前域名：${domain}</strong><br><br>
        <input id="input-from" placeholder="要替换的文本或正则" style="width: 100%; margin-bottom: 5px;"><br>
        <input id="input-to" placeholder="替换后的文本" style="width: 100%; margin-bottom: 5px;"><br>
        <button id="btn-current">仅当前网站生效</button>
        <button id="btn-all">所有网站生效</button>
        <hr>
        <select id="rule-list" size="5" style="width: 100%; margin-top: 5px;"></select><br>
        <button id="btn-delete" disabled>删除选中规则</button>
        <hr>
        <button id="btn-export">导出规则</button>
        <button id="btn-import">导入规则</button><br>
        <textarea id="import-text" placeholder="在此粘贴导入JSON" style="width: 100%; height: 60px; margin-top: 5px;"></textarea><br>
        <button id="btn-close" style="float:right;">关闭</button>
      </div>
    `
    document.body.appendChild(panel)

    const ruleList = document.getElementById('rule-list')
    const deleteBtn = document.getElementById('btn-delete')

    function refreshList() {
      ruleList.innerHTML = ''
      const rules = getCurrentDomainRules()
      rules.forEach((r, i) => {
        const option = document.createElement('option')
        option.value = i
        option.textContent = `替换：${r.from} → ${r.to}`
        ruleList.appendChild(option)
      })
      deleteBtn.disabled = true
    }

    ruleList.addEventListener('change', () => {
      deleteBtn.disabled = ruleList.selectedIndex === -1
    })

    document.getElementById('btn-current').onclick = () => {
      const from = document.getElementById('input-from').value.trim()
      const to = document.getElementById('input-to').value
      if (parseRuleFrom(from)) {
        addRule(false, from, to)
        refreshList()
      }
    }

    document.getElementById('btn-all').onclick = () => {
      const from = document.getElementById('input-from').value.trim()
      const to = document.getElementById('input-to').value
      if (parseRuleFrom(from)) {
        addRule(true, from, to)
        refreshList()
      }
    }

    deleteBtn.onclick = () => {
      const index = ruleList.selectedIndex
      if (index > -1) {
        deleteRule(index)
        refreshList()
      }
    }

    document.getElementById('btn-close').onclick = () => panel.remove()

    document.getElementById('btn-export').onclick = () => {
      const json = JSON.stringify(allRules, null, 2)
      navigator.clipboard.writeText(json)
      alert('规则已复制到剪贴板')
    }

    document.getElementById('btn-import').onclick = () => {
      const json = document.getElementById('import-text').value
      try {
        const imported = JSON.parse(json)
        for (const key in imported) {
          if (!allRules[key]) allRules[key] = []
          allRules[key].push(...imported[key])
        }
        GM_setValue('replace_rules', allRules)
        alert('导入成功，刷新页面后生效')
        refreshList()
      } catch {
        alert('导入失败：格式错误')
      }
    }

    refreshList()
  }

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === shortcutKey && e.ctrlKey === shortcutCtrl) {
      const panel = document.getElementById(panelId)
      if (panel) panel.remove()
      else createPanel()
    }
  })

  replaceText(getCurrentDomainRules())
})()
