// ==UserScript==
// @name        砖石社区
// @namespace   https://github.com/jonymei
// @homepageURL https://github.com/jonymei/brickbbs
// @description 自动屏蔽 JG、特短（5字符以内）内容，净化论坛环境。模拟 hash 路由，支持帖子链接直达。
// @match       https://in.iflytek.com/iflyteksns/forum/*
// @match       https://in.iflytek.com/fornt/forum/index
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.2
// @author      maY
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/468987/%E7%A0%96%E7%9F%B3%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/468987/%E7%A0%96%E7%9F%B3%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==

const menu = []
const removeJGId = 'jg'
const removeTDId = 'td'
const injectRouterId = 'router'

function updateMenu() {
  for (const item of menu) {
    GM_unregisterMenuCommand(item)
  }

  const removeJG = GM_getValue(removeJGId, true)
  const removeJGItem = `${removeJG ? '✅' : '🔘'} 屏蔽 JG（积告）`
  menu.push(removeJGItem)
  GM_registerMenuCommand(removeJGItem, () => {
    GM_setValue(removeJGId, !GM_getValue(removeJGId, true))
    updateMenu()
  })

  const removeTD = GM_getValue(removeTDId, true)
  const removeTDItem = `${removeTD ? '✅' : '🔘'} 屏蔽 TD（特短）`
  menu.push(removeTDItem)
  GM_registerMenuCommand(removeTDItem, () => {
    GM_setValue(removeTDId, !GM_getValue(removeTDId, true))
    updateMenu()
  })

  const injectRouter = GM_getValue(injectRouterId, true)
  const injectRouterItem = `${injectRouter ? '✅' : '🔘'} 注入 hash 路由`
  menu.push(injectRouterItem)
  GM_registerMenuCommand(injectRouterItem, () => {
    GM_setValue(injectRouterId, !GM_getValue(injectRouterId, true))
    updateMenu()
  })
}

updateMenu()

function removeSpam() {
  const tables = document.querySelectorAll('table.plate-table')
  tables.forEach((table) => {
    if (table.querySelector('div.title')) {
      return
    }
    const ps = table.querySelectorAll('tbody > tr > td:nth-child(2) > div > p')
    let text = ''
    ps.forEach((p) => {
      text = text + p.innerText
    })
    text = text.trim()
    if (GM_getValue(removeJGId, true) && /^jg$/i.test(text)) {
      table.style.display = 'none'
      return
    }
    if (GM_getValue(removeTDId, true) && text.length < 5) {
      table.style.display = 'none'
    }
  })
}

function handleMain() {
  function updateLocaion() {
    const hash = document.location.hash.substring(1)
    if (!hash) return
    let [hashedPath, hashedSearch] = hash.split('/$/')
    hashedSearch = hashedSearch ? `?${hashedSearch}` : ''
    const href = `${document.location.origin}${hashedPath}${hashedSearch}`
    if (iframe.contentDocument.location.href !== href) {
      iframe.contentDocument.location.href = href
    }
  }
  window.addEventListener('hashchange', () => {
    updateLocaion()
  })
  const iframe = document.getElementById('main_iframe')
  if (!iframe) return
  updateLocaion()
}

function handleIframe() {
  if (document.location.pathname === '/iflyteksns/forum/web/index') return
  let suffix = document.location.search
  if (suffix && suffix.startsWith('?page')) {
    suffix = document.location.search.replace('?', '/$/')
  } else {
    suffix = ''
  }
  window.parent.document.location.hash = `#${document.location.pathname}${suffix}`
}

;(function () {
  updateMenu()
  removeSpam()
  if (GM_getValue(injectRouterId, true)) {
    if (window.parent === window.self) {
      handleMain()
    } else {
      handleIframe()
    }
  }
})()
