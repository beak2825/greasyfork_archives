// ==UserScript==
// @name         掘金读者小助手
// @description  用于掘金社区的小助手，提供屏蔽作者等功能
// @version      0.0.2
// @author       miyuefe
// @namespace    https://github.com/miyuesc
// @match       https://juejin.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496924/%E6%8E%98%E9%87%91%E8%AF%BB%E8%80%85%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/496924/%E6%8E%98%E9%87%91%E8%AF%BB%E8%80%85%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*************************** 公共配置 *************************/
// 1. 节点查找
function loopUntilElementFound(selector, callback, timeStep = 100) {
  const element = document.querySelector(selector)
  if (element) {
    return callback(element)
  }
  setTimeout(() => {
    loopUntilElementFound(selector, callback)
  }, timeStep)
}
// 2. post 请求
const baseUrl = 'https://api.juejin.cn'
const post = async (url, data, config = {}) => {
  const response = await fetch(url, {
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
    method: 'POST',
    credentials: 'include',
    ...config
  })
  return await response.json()
}
// 3. MutationObserver 文档变化监听
const MutationObserver =
  window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
const mutationObserverSupport = !!MutationObserver
const mutationOptions = {
  childList: true
}
// 4. 地址变化监听
const _wr = function (type) {
  const orig = history[type]
  return function () {
    const rv = orig.apply(this, arguments)
    const e = new Event(type)
    e.arguments = arguments
    window.dispatchEvent(e)
    return rv
  }
}
history.pushState = _wr('pushState')
const historyListenerMap = {}
const addHistoryListener = (key, callback) => {
  historyListenerMap[key] = callback
  window.addEventListener('popstate', historyListenerMap[key])
  window.addEventListener('pushState', historyListenerMap[key])
}
const removeHistoryListener = (key) => {
  const listener = historyListenerMap[key]
  if (listener) {
    window.removeEventListener('popstate', listener)
    window.removeEventListener('pushState', listener)
  }
}
// 5. 防抖
function debounce(func, delay = 300) {
  let timerId
  return function (...args) {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
/*************************** Dislike 屏蔽按钮部分 *************************/
const dislikeLinkReg = /juejin\.cn(?!(\/s?post|\/column|\/book|\/collection|\/hot))\S{0,}/g
const dislikeBtnSvg = `<svg width="16" height="16" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="icon-block-user"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.4664 8.925C12.068 8.925 13.3664 7.62663 13.3664 6.025C13.3664 4.42337 12.068 3.125 10.4664 3.125C8.86478 3.125 7.56641 4.42337 7.56641 6.025C7.56641 7.62663 8.86478 8.925 10.4664 8.925ZM10.4664 10.425C12.8965 10.425 14.8664 8.45505 14.8664 6.025C14.8664 3.59495 12.8965 1.625 10.4664 1.625C8.03635 1.625 6.06641 3.59495 6.06641 6.025C6.06641 8.45505 8.03635 10.425 10.4664 10.425ZM7.59632 13.1461C5.57669 13.1461 3.93945 14.7833 3.93945 16.8029C3.93945 16.8437 3.97252 16.8768 4.01332 16.8768H9.6184C10.0326 16.8768 10.3684 17.2126 10.3684 17.6268C10.3684 18.041 10.0326 18.3768 9.6184 18.3768H4.01332C3.1441 18.3768 2.43945 17.6722 2.43945 16.8029C2.43945 13.9549 4.74826 11.6461 7.59632 11.6461H9.6184C10.0326 11.6461 10.3684 11.9819 10.3684 12.3961C10.3684 12.8103 10.0326 13.1461 9.6184 13.1461H7.59632ZM12.4245 12.6581C12.7173 12.3653 13.1922 12.3653 13.4851 12.6581L15.0827 14.2557L16.6782 12.6602C16.9711 12.3673 17.446 12.3673 17.7389 12.6602C18.0318 12.9531 18.0318 13.428 17.7389 13.7209L16.1434 15.3164L17.7278 16.9008C18.0206 17.1937 18.0206 17.6686 17.7278 17.9614C17.4349 18.2543 16.96 18.2543 16.6671 17.9614L15.0827 16.3771L13.4963 17.9635C13.2034 18.2564 12.7285 18.2564 12.4356 17.9635C12.1427 17.6706 12.1427 17.1957 12.4356 16.9029L14.0221 15.3164L12.4245 13.7188C12.1316 13.4259 12.1316 12.951 12.4245 12.6581Z" fill="currentcolor"></path></svg>`

const addDislikeBtn = (node) => {
  const userEl = node.querySelector('ul.action-list .item.meta-container .jj-link.user-message')
  if (!userEl) return
  const dislikeUserId = userEl.getAttribute('href')?.split('/')?.[2]
  if (node.querySelector('a.dislike-wrap')) return

  const btn = document.createElement('a')
  btn.innerHTML = dislikeBtnSvg
  btn.className = 'liked-wrap dislike-wrap'
  btn.setAttribute('title', '屏蔽该用户')
  btn.setAttribute('target', '_blank')
  btn.setAttribute('style', 'margin-left: 10px')
  btn.addEventListener('click', async (event) => {
    event.stopPropagation()
    event.preventDefault()
    if (dislikeUserId) {
      try {
        const { err_no } = await post(`${baseUrl}/recommend_api/v1/dislike/update`, {
          item_ids: [dislikeUserId],
          item_type: 1,
          action: 1,
          dis_type: 1
        })
        if (err_no === 0) {
          window.$nuxt.$alertMsg('屏蔽成功！')
          node.parentNode.removeChild(node)
        } else {
          window.$nuxt.$error('屏蔽操作请求失败')
        }
      } catch (e) {
        console.error(e)
        window.$nuxt.$error('屏蔽操作请求失败')
      }
    }
  })

  const target = node.querySelector('ul.action-list .item.meta-container .footer-divider')
  target.insertAdjacentElement('beforebegin', btn)
  return btn
}
const articleListObserver = new MutationObserver((mutationList) => {
  const addNodes = mutationList.filter((m) => m.type === 'childList').map((mr) => mr.addedNodes[0])
  addNodes.forEach((node) => node && addDislikeBtn(node))
})
const articleWrapObserver = new MutationObserver((mutationList) => {
  initDislikeObserver()
})

const initDislike = () => {
  if (!mutationObserverSupport) return
  if (!dislikeLinkReg.test(location.href)) return
  loopUntilElementFound('main div.entry-list-wrap', (articleList) => {
    articleWrapObserver.observe(articleList, mutationOptions)
    initDislikeObserver()
  })
}
const initDislikeObserver = debounce(() => {
  articleListObserver && articleListObserver.disconnect()

  loopUntilElementFound('main div.entry-list.list', (articleList) => {
    articleList.childNodes?.forEach(addDislikeBtn)
    articleListObserver.observe(articleList, mutationOptions)
  })
})

initDislike()
addHistoryListener('dislike', initDislike)

/*************************** 文章导航栏展开收起按钮 *************************/
const categoryExpandReg = /juejin\.cn\/s?post\/\S{0,}/g
const categoryExpandBtnSvg =
  '<svg style="transform: rotate(180deg)" width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-rotate"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M5.99854 7.93206L10.0644 3.86619C10.162 3.76856 10.3203 3.76856 10.418 3.86619L10.7715 4.21975C10.8691 4.31738 10.8691 4.47567 10.7715 4.5733L6.35209 8.99272C6.15683 9.18798 5.84025 9.18798 5.64498 8.99272L1.22557 4.5733C1.12794 4.47567 1.12794 4.31738 1.22557 4.21975L1.57912 3.86619C1.67675 3.76856 1.83504 3.76856 1.93267 3.86619L5.99854 7.93206Z" fill="#8A919F"></path></g></svg>'

const handleClick = (ul, btn) => {
  if (ul.style.display === 'none') {
    btn.childNodes[0].style.transform = 'rotate(180deg)'
    ul.style.display = 'block'
  } else {
    btn.childNodes[0].style.transform = 'unset'
    ul.style.display = 'none'
  }
}
const createExpandBtn = (item) => {
  const childrenEl = [...(item.children || [])].find((el) => el.tagName === 'UL')
  if (childrenEl != null) {
    const btn = document.createElement('span')
    btn.innerHTML = categoryExpandBtnSvg
    btn.className = 'word icon-rotate'
    btn.setAttribute('style', 'flex-shrink: 0; width: 24px;')
    btn.addEventListener('click', (event) => {
      event.stopPropagation()
      handleClick(childrenEl, btn)
    })

    const parent = childrenEl.parentNode.childNodes[0]
    parent.setAttribute('style', 'display: flex; align-items: center;')
    parent.appendChild(btn)
  }
  return childrenEl
}
const processCategory = (ul) => {
  if (!ul.children) return
  for (const el of ul.children) {
    const childUl = createExpandBtn(el)
    childUl && processCategory(childUl)
  }
}

const initCategoryExpand = () => {
  if (!categoryExpandReg.test(location.href)) return
  loopUntilElementFound('.article-sidebar .article-catalog .catalog-list', (categoryDom) => {
    setTimeout(() => {
      processCategory(categoryDom)
    }, 500)
  })
  loopUntilElementFound('.article-sidebar .catalog-body.unfold', (categoryBody) =>
    setTimeout(() => {
      categoryBody.style.maxHeight = 'calc(100vh - 520px)'
    }, 500)
  )
}

initCategoryExpand()

/***************************  *************************/
