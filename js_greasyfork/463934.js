// ==UserScript==
// @name                 Zhubai Toolbox 🧰
// @name:zh-CN           竹白工具箱 🧰
// @namespace            https://github.com/utags/zhubai-toolbox
// @homepage             https://github.com/utags/zhubai-toolbox#readme
// @supportURL           https://github.com/utags/zhubai-toolbox/issues
// @version              0.1.2
// @description          Tools for Zhubai creators and readers. 为竹白（zhubai.love）创作者与阅读者的浏览器扩展、油猴脚本，包括详情页显示文章目录，详情页显示网站目录大纲（TOC），订阅者信息导出，Markdown 编辑器等功能。更多功能欢迎交流。
// @description:zh-CN    为竹白（zhubai.love）创作者与阅读者的浏览器扩展、油猴脚本，包括详情页显示文章目录，详情页显示网站目录大纲（TOC），订阅者信息导出，Markdown 编辑器等功能。更多功能欢迎交流。
// @icon                 https://zhubai.love/favicon.png
// @author               Pipecraft
// @license              MIT
// @match                https://*.zhubai.love/*
// @connect              zhubai.love
// @grant                GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/463934/Zhubai%20Toolbox%20%F0%9F%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/463934/Zhubai%20Toolbox%20%F0%9F%A7%B0.meta.js
// ==/UserScript==
//
//// Recent Updates
//// - 0.1.2 2023.05.05
////    - 修改上一期，下一期按钮，修复 Violentmonkey, Greasemonkey(Firefox), Userscripts(Safari) 的兼容性问题
//// - 0.1.1 2023.04.28
////    - 详情页右侧栏显示网站目录大纲（TOC）与工具栏
//// - 0.1.0 2023.04.27
////    - 详情页左侧栏显示文章目录功能
////
;(() => {
  "use strict"
  var doc = document
  var $ = (selectors, element) => (element || doc).querySelector(selectors)
  var $$ = (selectors, element) => [
    ...(element || doc).querySelectorAll(selectors),
  ]
  var createElement = (tagName, attributes) =>
    setAttributes(doc.createElement(tagName), attributes)
  var addElement = (parentNode, tagName, attributes) => {
    if (!parentNode) {
      return
    }
    if (typeof parentNode === "string") {
      attributes = tagName
      tagName = parentNode
      parentNode = doc.head
    }
    if (typeof tagName === "string") {
      const element = createElement(tagName, attributes)
      parentNode.append(element)
      return element
    }
    setAttributes(tagName, attributes)
    parentNode.append(tagName)
    return tagName
  }
  var addEventListener = (element, type, listener, options) => {
    if (!element) {
      return
    }
    if (typeof type === "object") {
      for (const type1 in type) {
        if (Object.hasOwn(type, type1)) {
          element.addEventListener(type1, type[type1])
        }
      }
    } else if (typeof type === "string" && typeof listener === "function") {
      element.addEventListener(type, listener, options)
    }
  }
  var setAttribute = (element, name, value) =>
    element ? element.setAttribute(name, value) : void 0
  var setAttributes = (element, attributes) => {
    if (element && attributes) {
      for (const name in attributes) {
        if (Object.hasOwn(attributes, name)) {
          const value = attributes[name]
          if (value === void 0) {
            continue
          }
          if (/^(value|textContent|innerText|innerHTML)$/.test(name)) {
            element[name] = value
          } else if (name === "style") {
            setStyle(element, value, true)
          } else if (/on\w+/.test(name)) {
            const type = name.slice(2)
            addEventListener(element, type, value)
          } else {
            setAttribute(element, name, value)
          }
        }
      }
    }
    return element
  }
  var setStyle = (element, values, overwrite) => {
    if (!element) {
      return
    }
    const style = element.style
    if (typeof values === "string") {
      style.cssText = overwrite ? values : style.cssText + ";" + values
      return
    }
    if (overwrite) {
      style.cssText = ""
    }
    for (const key in values) {
      if (Object.hasOwn(values, key)) {
        style[key] = values[key].replace("!important", "")
      }
    }
  }
  if (typeof Object.hasOwn !== "function") {
    Object.hasOwn = (instance, prop) =>
      Object.prototype.hasOwnProperty.call(instance, prop)
  }
  var addElement2 =
    typeof GM_addElement === "function"
      ? (parentNode, tagName, attributes) => {
          if (typeof parentNode === "string" || typeof tagName === "string") {
            const element = GM_addElement(parentNode, tagName)
            setAttributes(element, attributes)
            return element
          }
          setAttributes(tagName, attributes)
          parentNode.append(tagName)
          return tagName
        }
      : addElement
  var content_default =
    ".zbtb{width:100%;height:100%;position:fixed;top:72px;left:30px;padding:10px;background-color:#fff;font-weight:600;font-size:16px;color:#060e4b}.zbtb button{font-weight:600;font-size:16px;color:#060e4b}.zbtb button:disabled{opacity:40%}.zbtb textarea{width:90%;height:40%;padding:5px}#left_aside,#right_aside{display:none}html[data-zbtb=posts-entry]{--aside-width: 300px;margin-left:var(--aside-width);margin-right:var(--aside-width)}html[data-zbtb=posts-entry] nav{left:0}html[data-zbtb=posts-entry] #left_aside,html[data-zbtb=posts-entry] #right_aside{display:block;position:fixed;top:72px;left:0;padding:0 0 72px;height:100%;max-width:var(--aside-width);overflow:hidden;box-sizing:border-box}html[data-zbtb=posts-entry] #left_aside .container,html[data-zbtb=posts-entry] #right_aside .container{padding:20px;height:100%;overflow:auto;box-sizing:border-box}html[data-zbtb=posts-entry] #left_aside .item,html[data-zbtb=posts-entry] #right_aside .item{display:block;text-decoration:none;margin-bottom:20px;cursor:pointer}html[data-zbtb=posts-entry] #left_aside .title,html[data-zbtb=posts-entry] #right_aside .title{margin:0;font-weight:600;font-size:14px;line-height:20px;color:#1a1a1a;word-wrap:break-word;overflow-wrap:break-word}html[data-zbtb=posts-entry] #left_aside .item.current .title,html[data-zbtb=posts-entry] #right_aside .item.current .title{color:var(--theme-primary-color)}html[data-zbtb=posts-entry] #right_aside{left:unset;right:0;padding:0 0 122px}html[data-zbtb=posts-entry] #right_aside h2{padding-left:20px}html[data-zbtb=posts-entry] #right_aside h3{padding-left:40px}html[data-zbtb=posts-entry] #right_aside .toolbar{display:flex;justify-content:space-around;align-items:center;overflow:hidden;box-sizing:border-box;width:var(--aside-width);height:50px}html[data-zbtb=posts-entry] #right_aside .toolbar .button{height:24px;width:24px;background:none;border:none;outline:none;border-radius:4px;font-family:inherit;-webkit-tap-highlight-color:rgba(0,0,0,0);padding:10px;color:#060e4b}html[data-zbtb=posts-entry] #right_aside .toolbar .button:hover{background:rgba(0,0,0,.05);opacity:.8}html[data-zbtb=posts-entry] #right_aside .toolbar .button.disabled{opacity:.4;background:none;cursor:not-allowed}@media(max-width: 1000px){html[data-zbtb=posts-entry]{--aside-width: 200px}}@media(max-width: 767px){html[data-zbtb=posts-entry]{--aside-width: 0}html[data-zbtb=posts-entry] #left_aside,html[data-zbtb=posts-entry] #right_aside{display:none}}"
  var listeners = {}
  var prefix = "extension."
  var getNamespacedKey = (key) => prefix + key
  var getUnnamespacedKey = (key) => key.slice(prefix.length)
  var _getValue = (key) => localStorage.getItem(key)
  var _setValue = (key, value) => {
    const oldValue = localStorage.getItem(key)
    if (oldValue === value) return
    localStorage.setItem(key, value)
    if (listeners[key]) {
      for (const func of listeners[key]) {
        func(getUnnamespacedKey(key), oldValue, value)
      }
    }
  }
  var _addValueChangeListener = (key, func) => {
    listeners[key] = listeners[key] || []
    listeners[key].push(func)
    return () => {
      if (listeners[key] && listeners[key].length > 0) {
        for (let i = listeners[key].length - 1; i >= 0; i--) {
          if (listeners[key][i] === func) {
            listeners[key].splice(i, 1)
          }
        }
      }
    }
  }
  var getValue = (key) => {
    const value = _getValue(getNamespacedKey(key))
    return value && value !== "undefined" ? JSON.parse(value) : void 0
  }
  var setValue = (key, value) => {
    if (value !== void 0)
      _setValue(getNamespacedKey(key), JSON.stringify(value))
  }
  var addValueChangeListener = (key, func) =>
    _addValueChangeListener(getNamespacedKey(key), func)
  var storageKey = "zhubai.posts"
  var nextUrl = ""
  var page = 0
  async function fetchPostList(url) {
    if (!url) {
      return
    }
    page++
    const response = await fetch(url, {})
    console.log("Fetched page", page)
    if (response.status !== 200) {
      console.warn(response)
      return
    }
    const data = await response.json()
    return data
  }
  async function updatePostList(url, updateAll = false) {
    var _a, _b, _c
    const data = await fetchPostList(url)
    if (!data) {
      return
    }
    const newList =
      (_a = data.data) == null
        ? void 0
        : _a.map((post) => ({
            id: post.id,
            title: post.title,
          }))
    nextUrl = (_b = data.pagination) == null ? void 0 : _b.next
    const hasNext = (_c = data.pagination) == null ? void 0 : _c.has_next
    if (newList) {
      const ids = new Set(newList.map((post) => post.id))
      const oldList = (await getValue(storageKey)) || []
      for (const post of oldList) {
        if (!ids.has(post.id)) {
          newList.push(post)
        }
      }
      newList.sort((a, b) => {
        return b.id - a.id
      })
      await setValue(storageKey, newList)
      if (page === 1) {
        await setValue("first_page_updated_at", Date.now())
      }
      if (hasNext === false) {
        await setValue("last_page_updated_at", Date.now())
      }
    }
    if (updateAll && nextUrl) {
      await updatePostList(nextUrl, updateAll)
    }
  }
  async function getAllPostListFromCache() {
    const posts = (await getValue(storageKey)) || []
    return posts
  }
  async function init(token, valueChangeListener) {
    nextUrl = `https://${token}.zhubai.love/api/publications/${token}/posts?publication_id_type=token`
    page = 0
    const now = Date.now()
    const lastPageUpdatedAt = await getValue("last_page_updated_at")
    const firstPageUpdatedAt = await getValue("first_page_updated_at")
    if (
      !lastPageUpdatedAt ||
      now - lastPageUpdatedAt > 10 * 24 * 60 * 60 * 1e3
    ) {
      setTimeout(async () => updatePostList(nextUrl, true), 100)
    } else if (now - firstPageUpdatedAt > 10 * 60 * 1e3) {
      setTimeout(async () => updatePostList(nextUrl, false), 100)
    }
    addValueChangeListener(storageKey, valueChangeListener)
  }
  async function showPostList() {
    const aside =
      $("#left_aside") ||
      addElement2(document.body, "aside", {
        id: "left_aside",
      })
    const container =
      $("#left_aside .container") ||
      addElement2(aside, "div", {
        class: "container",
      })
    container.innerHTML = ""
    const currentId = (/posts\/(\d+)/.exec(location.pathname) || [])[1]
    const postList = await getAllPostListFromCache()
    for (const post of postList) {
      const a = addElement2(container, "a", {
        class: currentId === post.id ? "item current" : "item",
        href: "/posts/" + post.id,
      })
      if (currentId === post.id) {
        setTimeout(() => {
          a.scrollIntoView({ block: "nearest" })
        }, 1)
      }
      addElement2(a, "h2", {
        class: "title",
        textContent: post.title,
      })
    }
  }
  async function showToolbar() {
    const aside =
      $("#right_aside") ||
      addElement2(document.body, "aside", {
        id: "right_aside",
      })
    const container =
      $("#right_aside .toolbar") ||
      addElement2(aside, "div", {
        class: "toolbar",
      })
    container.innerHTML = ""
    const currentId = (/posts\/(\d+)/.exec(location.pathname) || [])[1]
    let previousId
    let nextId
    const postList = await getAllPostListFromCache()
    for (let i = 0; i < postList.length; i++) {
      const post = postList[i]
      if (post.id === currentId) {
        if (i > 0) {
          nextId = postList[i - 1].id
        }
        if (i < postList.length - 1) {
          previousId = postList[i + 1].id
        }
      }
    }
    addElement2(container, "a", {
      class: previousId ? "button" : "button disabled",
      href: previousId ? "/posts/" + previousId : "",
      title: "\u4E0A\u4E00\u671F",
      innerHTML: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.4699 5.45621C11.136 5.03993 11.9999 5.51878 11.9999 6.30421V11.5353C12.0782 11.3852 12.1972 11.2517 12.3567 11.152L21.4699 5.45621C22.136 5.03993 22.9999 5.51878 22.9999 6.30421V17.6957C22.9999 18.4811 22.136 18.96 21.4699 18.5437L12.3567 12.848C12.1972 12.7482 12.0782 12.6147 11.9999 12.4647V17.6957C11.9999 18.4811 11.136 18.96 10.4699 18.5437L1.35672 12.848C0.730053 12.4563 0.730051 11.5436 1.35672 11.152L10.4699 5.45621ZM3.77351 12L9.99991 8.10845V15.8915L3.77351 12ZM20.9999 8.10845L14.7735 12L20.9999 15.8915V8.10845Z" fill="black"/>
</svg>`,
      onclick(event) {
        if (!previousId) {
          event.preventDefault()
        }
      },
    })
    addElement2(container, "a", {
      class: nextId ? "button" : "button disabled",
      href: nextId ? "/posts/" + nextId : "",
      title: "\u4E0B\u4E00\u671F",
      innerHTML: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.53 18.5437C1.86395 18.96 1 18.4811 1 17.6957V6.30421C1 5.51878 1.86395 5.03993 2.53 5.45621L11.6432 11.152C11.8028 11.2517 11.9217 11.3852 12 11.5353V6.30421C12 5.51878 12.864 5.03993 13.53 5.45621L22.6432 11.152C23.2699 11.5436 23.2699 12.4563 22.6432 12.848L13.53 18.5437C12.864 18.96 12 18.4811 12 17.6957V12.4647C11.9217 12.6147 11.8028 12.7482 11.6432 12.848L2.53 18.5437ZM9.22641 12L3 15.8915V8.10846L9.22641 12ZM14 15.8915L20.2264 12L14 8.10846V15.8915Z" fill="black"/>
    </svg>
    `,
      onclick(event) {
        if (!nextId) {
          event.preventDefault()
        }
      },
    })
    addElement2(container, "a", {
      class: "button",
      title: "\u56DE\u5230\u9876\u90E8",
      innerHTML: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.48967 20.617L12.0002 17L18.5107 20.617C19.3368 21.0759 20.2797 20.2388 19.9219 19.3642L12.9257 2.26248C12.5868 1.43399 11.4136 1.43399 11.0746 2.26248L4.07848 19.3642C3.72069 20.2388 4.66363 21.0759 5.48967 20.617ZM7.00787 17.4856L12.0002 5.28219L16.9925 17.4856L12.9715 15.2517C12.3674 14.9161 11.6329 14.9161 11.0289 15.2517L7.00787 17.4856Z" fill="black"/>
</svg>`,
      onclick() {
        var _a
        ;(_a = document.scrollingElement) == null
          ? void 0
          : _a.scrollTo({
              top: 0,
            })
      },
    })
    addElement2(container, "a", {
      class: "button disabled",
      title:
        "\u8BBE\u7F6E\uFF08\u4E0B\u4E2A\u7248\u672C\u63A8\u51FA\u6B64\u529F\u80FD\uFF09",
      innerHTML: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.0002 16C14.2094 16 16.0002 14.2091 16.0002 12C16.0002 9.79086 14.2094 8 12.0002 8C9.79109 8 8.00023 9.79086 8.00023 12C8.00023 14.2091 9.79109 16 12.0002 16ZM12.0002 14C13.1048 14 14.0002 13.1046 14.0002 12C14.0002 10.8954 13.1048 10 12.0002 10C10.8957 10 10.0002 10.8954 10.0002 12C10.0002 13.1046 10.8957 14 12.0002 14Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.1182 1.86489L15.5203 4.81406C15.8475 4.97464 16.1621 5.1569 16.4623 5.35898L19.2185 4.23223C19.6814 4.043 20.2129 4.2248 20.463 4.65787L22.5901 8.34213C22.8401 8.77521 22.7318 9.3264 22.3365 9.63266L19.9821 11.4566C19.9941 11.6362 20.0002 11.8174 20.0002 12C20.0002 12.1826 19.9941 12.3638 19.9821 12.5434L22.3365 14.3673C22.7318 14.6736 22.8401 15.2248 22.5901 15.6579L20.463 19.3421C20.2129 19.7752 19.6814 19.957 19.2185 19.7678L16.4623 18.641C16.1621 18.8431 15.8475 19.0254 15.5203 19.1859L15.1182 22.1351C15.0506 22.6306 14.6274 23 14.1273 23H9.87313C9.37306 23 8.94987 22.6306 8.8823 22.1351L8.48014 19.1859C8.15296 19.0254 7.83835 18.8431 7.53818 18.641L4.78195 19.7678C4.31907 19.957 3.78756 19.7752 3.53752 19.3421L1.41042 15.6579C1.16038 15.2248 1.26869 14.6736 1.66401 14.3673L4.01841 12.5434C4.00636 12.3638 4.00025 12.1826 4.00025 12C4.00025 11.8174 4.00636 11.6362 4.01841 11.4566L1.66401 9.63266C1.26869 9.3264 1.16038 8.77521 1.41041 8.34213L3.53752 4.65787C3.78755 4.2248 4.31906 4.043 4.78195 4.23223L7.53818 5.35898C7.83835 5.1569 8.15296 4.97464 8.48014 4.81406L8.8823 1.86489C8.94987 1.3694 9.37306 1 9.87313 1H14.1273C14.6274 1 15.0506 1.3694 15.1182 1.86489ZM13.6826 6.14004L14.6392 6.60948C14.8842 6.72975 15.1201 6.86639 15.3454 7.01805L16.231 7.61423L19.1674 6.41382L20.4216 8.58619L17.9153 10.5278L17.9866 11.5905C17.9956 11.7255 18.0002 11.8621 18.0002 12C18.0002 12.1379 17.9956 12.2745 17.9866 12.4095L17.9153 13.4722L20.4216 15.4138L19.1674 17.5862L16.231 16.3858L15.3454 16.982C15.1201 17.1336 14.8842 17.2702 14.6392 17.3905L13.6826 17.86L13.2545 21H10.746L10.3178 17.86L9.36131 17.3905C9.11626 17.2702 8.88037 17.1336 8.6551 16.982L7.76954 16.3858L4.83313 17.5862L3.57891 15.4138L6.0852 13.4722L6.01392 12.4095C6.00487 12.2745 6.00024 12.1379 6.00024 12C6.00024 11.8621 6.00487 11.7255 6.01392 11.5905L6.0852 10.5278L3.57891 8.58619L4.83312 6.41382L7.76953 7.61423L8.6551 7.01805C8.88037 6.86639 9.11625 6.72976 9.36131 6.60949L10.3178 6.14004L10.746 3H13.2545L13.6826 6.14004Z" fill="black"/>
</svg>`,
      onclick() {},
    })
    if (
      !postList ||
      postList.length === 0 ||
      (postList.length > 1 && !previousId && !nextId)
    ) {
      setTimeout(showToolbar, 100)
    }
  }
  function showTOC() {
    var _a
    const aside =
      $("#right_aside") ||
      addElement2(document.body, "aside", {
        id: "right_aside",
      })
    const container =
      $("#right_aside .container") ||
      addElement2(aside, "div", {
        class: "container",
      })
    container.innerHTML = ""
    let skippedFirst = false
    for (const heading of $$("#root h1, #root h2, #root h3")) {
      if (!skippedFirst) {
        skippedFirst = true
        continue
      }
      const a = addElement2(container, "a", {
        class: "item",
        onclick() {
          setTimeout(() => {
            heading.scrollIntoView({ block: "start" })
            setTimeout(() => {
              var _a2
              ;(_a2 = document.scrollingElement) == null
                ? void 0
                : _a2.scrollBy({
                    top: -92,
                  })
            }, 1)
          })
        },
      })
      addElement2(a, heading.tagName.toLowerCase(), {
        class: "title",
        textContent:
          (_a = heading.textContent) == null
            ? void 0
            : _a.replace(/(↗|→)$/, ""),
      })
    }
    if (!skippedFirst) {
      setTimeout(showTOC, 100)
    }
  }
  var config = {
    matches: ["https://*.zhubai.love/*"],
    world: "MAIN",
  }
  async function fetchZhubaiSubscriptions(
    page2,
    subscriberEmailSet,
    subscribers
  ) {
    page2 = page2 || 1
    const url = `https://zhubai.love/api/dashboard/subscriptions?limit=20&page=${page2}`
    const response = await fetch(url, {})
    console.log("Fetched page", page2)
    if (response.status !== 200) {
      console.warn(response)
      return
    }
    const data = await response.json()
    for (const subscriber of data.data) {
      subscribers.push(subscriber)
      if (subscriber.subscriber_email) {
        subscriberEmailSet.add(subscriber.subscriber_email)
      }
    }
    const limit = data.pagination.limit
    const total = data.pagination.total_count
    return { limit, total }
  }
  async function main() {
    const subscriberEmailSet = /* @__PURE__ */ new Set()
    const subscribers = []
    let page2 = 1
    let isRunning = false
    let paused = false
    const modal = addElement2(document.body, "div", {
      class: "zbtb",
    })
    const toolbar = addElement2(modal, "div", {
      style: "display: flex;",
    })
    const pauseButton = addElement2(toolbar, "button", {
      textContent: "\u6682\u505C \u23F8\uFE0F",
      async onclick(event) {
        paused = !paused
        event.target.textContent = paused
          ? "\u7EE7\u7EED \u25B6\uFE0F"
          : "\u6682\u505C \u23F8\uFE0F"
        if (!paused) {
          await run()
        }
      },
    })
    const message = addElement2(modal, "p", {
      textContent: "\u{1F680} \u6B63\u5728\u5BFC\u51FA\u6570\u636E ...",
    })
    addElement2(modal, "p", {
      textContent: "\u{1F4EE} \u90AE\u7BB1\u8BA2\u9605\u5217\u8868",
    })
    const textarea = addElement2(modal, "textarea")
    addElement2(modal, "p", {
      textContent:
        "\u{1F4D6} \u8BE6\u7EC6\u8BA2\u9605\u7528\u6237\u6570\u636E\uFF0C\u5305\u542B\u90AE\u7BB1\u8BA2\u9605\u548C\u5FAE\u4FE1\u8BA2\u9605",
    })
    const textarea2 = addElement2(modal, "textarea")
    const run = async () => {
      if (isRunning) {
        return
      }
      try {
        isRunning = true
        while (isRunning) {
          const result = await fetchZhubaiSubscriptions(
            page2,
            subscriberEmailSet,
            subscribers
          )
          const total = result.total
          const limit = result.limit
          message.textContent = `\u{1F697} \u6B63\u5728\u83B7\u53D6\u6570\u636E: ${page2} / ${Math.round(
            total / 20
          )}`
          if (subscribers.length > 0) {
            textarea.value = JSON.stringify([...subscriberEmailSet], null, 2)
            textarea2.value = JSON.stringify(subscribers, null, 2)
          }
          if (limit * page2 < total) {
            page2++
            if (paused) {
              message.textContent = `\u23F8\uFE0F \u6682\u505C\u4E2D\u3002\u5DF2\u83B7\u53D6\u6570\u636E: ${
                page2 - 1
              } / ${Math.round(total / 20)}`
              isRunning = false
            }
          } else {
            message.textContent = `\u{1F389} \u6570\u636E\u5BFC\u51FA\u5B8C\u6BD5\u3002\u8BF7\u590D\u5236\u4E0B\u9762\u7684\u6570\u636E\uFF0C\u505A\u597D\u5907\u4EFD\u3002`
            isRunning = false
            pauseButton.disabled = true
          }
        }
      } catch (error) {
        console.error(error)
        message.innerHTML = `\u6570\u636E\u5BFC\u51FA\u5931\u8D25\uFF0C\u6709\u95EE\u9898\u8BF7\u5728 <a href="https://github.com/utags/zhubai-toolbox/issues" target="_blank">GitHub</a> \u6216 <a href="https://greasyfork.org/scripts/463934" target="_blank">Greasy Fork</a> \u53CD\u9988\u3002`
      }
    }
    await run()
  }
  async function main2() {
    if (!$("#zbtb_style")) {
      addElement2(document.head, "style", {
        id: "zbtb_style",
        textContent: content_default,
      })
    }
    const url = location.href
    if (
      /^https:\/\/\w+\.zhubai\.love\/posts\//.test(url) &&
      !location.pathname.includes("edit")
    ) {
      document.documentElement.dataset.zbtb = "posts-entry"
      const token = location.hostname.split(".")[0]
      await init(token, showPostList)
      await showPostList()
      showTOC()
      await showToolbar()
    } else if (url.includes("https://zhubai.love/creator/subscribers")) {
      const intervalId = setInterval(() => {
        const button = document.querySelector("th:nth-of-type(6) button")
        if (button && button.textContent === "\u5BFC\u5165/\u5BFC\u51FA") {
          const newButton = createElement("button", {
            textContent: "\u5BFC\u5165/\u5BFC\u51FA",
            class: "Button_button__2Ce79 Button_defaultButton__1bbUl",
          })
          button.after(newButton)
          button.remove()
          newButton.addEventListener("click", async (event) => {
            await main()
            event.preventDefault()
          })
          clearInterval(intervalId)
        }
      }, 1e3)
    } else {
      document.documentElement.dataset.zbtb = "0"
    }
  }
  main2()
  addEventListener(window, "popstate", main2)
  var _pushState = history.pushState
  history.pushState = function (o, a, u) {
    _pushState.call(history, o, a, u)
    main2()
  }
})()
