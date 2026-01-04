// ==UserScript==
// @name         linuxdo-hotkeys
// @namespace    http://tampermonkey.net/
// @version      2024-10-28.2
// @description  来源于Musifei佬的信息
// @author       Kubbo
// @match        https://linux.do/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514411/linuxdo-hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/514411/linuxdo-hotkeys.meta.js
// ==/UserScript==

(function () {
  'use strict';
  
  function showHotKeys() {
    const hotKeys = [
      {name: '描述', keys: '快捷键'},
      {name: '最新', keys: 'G+L'},
      {name: '新', keys: 'G+N'},
      {name: '未读', keys: 'G+U'},
      {name: '类别', keys: 'G+C'},
      {name: '热门', keys: 'G+T'},
      {name: '书签', keys: 'G+B'},
      {name: '个人资料', keys: 'G+P'},
      {name: '消息', keys: 'G+M'},
      {name: '草稿', keys: 'G+D'},
    ]
    const table = document.createElement('table')
    table.style.position = 'fixed'
    table.style.top = '50%'
    table.style.transform = 'translateY(-50%)'
    table.style.right = '10px'
    table.style.zIndex = '202403101044'
    table.style.fontSize = '14px'
    table.style.color = 'var(--primary)'
    table.style.borderRadius = '4px'
    hotKeys.forEach(key => {
      const tr = document.createElement('tr')
      const td1 = document.createElement('td')
      const td2 = document.createElement('td')
      td1.style.padding = '4px 10px'
      td1.innerText = key.name
      td2.innerText = key.keys
      tr.appendChild(td1)
      tr.appendChild(td2)
      table.appendChild(tr)
    })
    document.body.appendChild(table)
  }

  showHotKeys()
})();