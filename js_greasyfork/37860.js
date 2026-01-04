// ==UserScript==
// @name         MeiziTuAutoLoad
// @namespace    //tampermonkey.net/
// @version      0.2.0
// @description  MeiziTuAutoLoad!
// @author       cuzfinal
// @match        http*://www.mzitu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37860/MeiziTuAutoLoad.user.js
// @updateURL https://update.greasyfork.org/scripts/37860/MeiziTuAutoLoad.meta.js
// ==/UserScript==
let loadInterval
const config = {
  hostName: location.hostname,
  interval: 200,   // 发起一次请求后200ms内不再发起
  isInterval: 0,
  overSet: document.documentElement.clientHeight * 0.2    // 分页导航距离屏幕底部大于屏幕高度20%时触发加载
}
const defaultParams = {
  method: 'GET',
}

const hostRegular = {
  'www.mzitu.com': {
    container: '.main-image',
    pageUrl() { return `/${this.articleId}/${++this.page}` },
    page: location.href.match(/\/\d(\d)?$/) && location.href.match(/\/(\d(\d)?)$/)[1] || 1,
    articleId: location.href.match(/com\/(\d+)/)[1],
    hideNodes: null,
    nav: '.pagenavi',
    isOver(next) {
      return next.nav.lastElementChild.textContent === "下一组»"
    },
    extra: () => { }
  }
}

const current = hostRegular[config.hostName]
const box = document.querySelector(current.container)
let pageNav = getNav()
const io = new IntersectionObserver(loadNext)

function getNav() {
  return document.querySelector(current.nav)
}

function getTitle(node) {
  if (node.tagName === 'TITLE') {
    return node.outerText
  }
}

function parseNextPage(dom) {
  let content, nav, title
  content = current.next ? dom.querySelectorAll(current.next) : [...dom.querySelector(current.container).children]
  nav = dom.querySelector(current.nav)
  const result = { content, nav, title }
  current.isOver && current.isOver(result, dom)
  return result
}

async function loadNext(entries) {
  if(!entries[0].isIntersecting) return
  io.unobserve(pageNav)

  const nextUrl = current.pageUrl()
  try {
    const resp = await fetch(nextUrl, current.params || defaultParams)
    const parser = new DOMParser()
    const dom = parser.parseFromString(await resp.text(), 'text/html')
    const next = parseNextPage(dom)
    if (resp.status === 404) {
      loadOver()
    } else {
      next.content.forEach(el => box.appendChild(el))
      if (next.nav) {
        pageNav.parentNode.replaceChild(next.nav, pageNav)
        pageNav = getNav()
        io.observe(pageNav)
      }
      if (next.title) {
        document.title = next.title
      }
    }
    current.isOver(next, dom) && (loadOver())
  } catch (e) {
    loadOver()
    console.log(e)
  }
}

function hideURL() {
  [...document.querySelectorAll(current.hideNodes)].forEach(el => el.style.display = "none")
}

function loadOver() {
  io.disconnect()
  hideURL()
  current.extra && current.extra()
  console.log('Preload loaded!')
}

(function () {
  // Your code here...
  current.beforeLoad && current.beforeLoad()
  window.addEventListener("load", () => io.observe(pageNav))
  console.log('Preload loading...')
})();