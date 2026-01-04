// ==UserScript==
// @name         auto-run-script-for-every-task
// @namespace    https://x181.cn
// @version      0.1
// @description  try to take over the world!
// @author       tt
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/412310/auto-run-script-for-every-task.user.js
// @updateURL https://update.greasyfork.org/scripts/412310/auto-run-script-for-every-task.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // next: 'once'
  const scripts = [
    {
      match: /https:\/\/mp\.weixin\.qq\.com\/s.*/,
      script: weixinScriptTask,
      once: stopImmediatePropagation,
    },
    {
      match: 'http://uz.yurixu.com/',
      script: yurixuTask,
      interval: 0.2
    },
    {
      match: 'https://www.flickr.com/photos/',
      script: removeFlickerZoomLayerTask,
    },
    {
      match: 'https://helloacm.com/',
      script: removeRemovedAdBlockerModal
    },
    {
      match: 'link.zhihu.com',
      script: zhihuAutoRedirectTask,
      interval: 'once'
    },
    {
      match: /^https?:\/\/.*?\.zhihu\.com/,
      script: zhihuConvertLinkTask,
    },
    {
      match: /t\.cn/i,
      script: weiboLinkTask,
    }
  ]

  function weiboLinkTask() {
    let node = document.querySelector('.link')
    let text = node.innerText.trim()
    if (/https?:\/\//i.test(text)) {
      location.href = text
      return;
    }
  }

  function zhihuConvertLinkTask() {
    let links = document.querySelectorAll('a[href^="https://link.zhihu.com/"], a[href^="http://link.zhihu.com/"]')
    Array.from(links).forEach(node => {
      let href = node.href
      let url = new URL(href)
      let search = new URLSearchParams(url.search)
      let target = search.get('target')
      node.href = decodeURIComponent(target)
    })
  }

  function zhihuAutoRedirectTask() {
    if (location.host === 'link.zhihu.com') {
      let search = new URLSearchParams(location.search)
      let target = search.get('target')
      location.href = decodeURIComponent(target)
    }
  }

  function removeRemovedAdBlockerModal() {
    let nodes = document.querySelectorAll('cloudflare-app')
    Array.from(nodes).forEach(node => {
      let style = window.getComputedStyle(node, null)
      let zIndex = style.getPropertyValue('z-index') // style.zIndex
      if (zIndex >= 400) {
        node.style.display = 'none'
      }
    })
  }

  function removeFlickerZoomLayerTask() {
    let selectors = [
      '.facade-of-protection-zoom'
    ]
    selectors.forEach(selector => {
      let nodes = document.querySelectorAll(selector)
      nodes.forEach(node => {
        node.style.display = 'none';
      })
    })
  }

  // 微信公众号文章支持超链接
  function weixinScriptTask() {
    if (document.body == null) {
      return sleep(0.2).then(() => {
        return nextTick(weixinScriptTask)
      })
    }
    let walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: node => {
          let p = node.parentNode
          while(p && (['A', 'SCRIPT', 'STYLE'].indexOf(p.nodeName) === -1)) {
            p = p.parentNode
          }
          if (p) return NodeFilter.FILTER_SKIP
          let text = node.data
          if (/https?:\/\//i.test(text)) {
            return NodeFilter.FILTER_ACCEPT
          }
        }
      },
      true
    )

    let links = []
    while(walker.nextNode()) {
      let node = walker.currentNode
      let text = node.data.toLowerCase()
      let offset = text.indexOf('http')
      let linkTextNode = node.splitText(offset)
      let spaceOffset = linkTextNode.nodeValue.search(/\s/)
      let linkNode = linkTextNode
      if (spaceOffset > -1) {
        linkNode =linkTextNode.splitText(spaceOffset).previousSibling
      }
      let a = document.createElement('a')
      a.href = linkNode.nodeValue
      a.setAttribute('target', '_blank')
      linkNode.parentNode.insertBefore(a, linkNode)
      a.appendChild(linkNode)
      links.push(a)
    }
    if (links.length) {
      suptolink(links)
    }
  }

  function suptolink(links) {
    let sups = document.querySelectorAll('sup');
    let lastFindedNode = null;
    [...sups].reverse().forEach(sup => {
      let text = sup.innerText.trim()
      if (text === '') return
      // Todo. 判定是 [1] 形式.
      let link = findLinkByText(text, lastFindedNode || links[links.length - 1])
      if (link == null) return
      console.log('find.end:', link)
      lastFindedNode = link
      let a = document.createElement('a')
      a.href = link.href
      a.setAttribute('target', '_blank')
      sup.parentNode.insertBefore(a, sup)
      a.appendChild(sup)
    })
  }

  function findLinkByText(text, link) {
    let find
    let node = link.previousSibling || link.parentNode
    while(node && (node.nodeType == 1 || node.nodeType === 3)) {
      let t = node.innerText || node.nodeValue || ''
      if (node.nodeType === 1) {
        if (node.nodeName === 'A') link = node
        else {
          let a = node.querySelector('a')
          if (a) link = a
        }
      }
      if (t.indexOf(text) > -1) {
        find = link
        break
      }
      node = node.previousSibling || node.parentNode
    }
    return find
  }

  function stopImmediatePropagation() {
    ['click'].forEach(name => {
      document.addEventListener(name, function (e) {
        e.stopImmediatePropagation()
      }, true)
    })
  }

  // 租房
  function yurixuTask() {
    var links = document.querySelectorAll('a');
    [...links].forEach(link => {
      if (link.protocol === 'http:' && link.host === 'www.newsmth.net') {
        link.href = link.href.replace(/^http:/i, 'https:')
      }
    })
  }

  async function run(task, n = 0) {
    console.log('start run task = ', task.name || 'an')
    if ('function' === typeof task.once) {
      task.once(task)
      task.once = null
    }
    if ('function' === typeof task.prescript) task.prescript(task)
    if ('function' === typeof task.script) task.script(task)
    if ('function' === typeof task.postscript) task.postscript(task)

    let interval = task.interval
    if (interval === 'once') return
    // 默认策略
    if (interval === 'exponential' || interval == null) {
      await sleep(Math.pow(2, n))
      run(task, ++n)
      return
    }
    if (typeof interval === 'number') {
      await sleep(interval)
      run(task, ++n)
      return
    }
    if (typeof interval === 'function') {
      interval(() => run(task))
      return
    }
  }

  function init() {
    let url = location.href
    let tasks = scripts.filter(task => match(task.match, url))
    for (let i = 0; i < tasks.length; ++i) {
      run(tasks[i])
    }
  }

  init()

  function sleep(n) {
    return new Promise(function (resolve) {
      setTimeout(resolve, n * 1000)
    })
  }

  function match(rule, url) {
    if (typeof rule === 'boolean') return rule
    if (typeof rule === 'string') return url.includes(rule)
    if (rule.test) return rule.test(url)
    if (rule.sort) return rule.every(m => match(m, url))
    if (typeof rule === 'function') return rule(url)
    return false
  }

  function nextTick(fn) {
    let p = Promise.resolve()
    p.then(fn)
  }
})();