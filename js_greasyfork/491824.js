// ==UserScript==
// @name         dybz
// @description  增强第一版主小说网站的功能，详情请看脚本页面的介绍（另含去除广告的说明）
// @author       Essence
// @namespace    essence/dybz
// @version      0.16
// @icon         https://www.44yydstxt426.com/images/wap_logo.png
// @match        https://*/*
// @require      https://update.greasyfork.org/scripts/491997/1356799/baseStyles.js
// @require      https://update.greasyfork.org/scripts/491971/1356787/libs.js
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491824/dybz.user.js
// @updateURL https://update.greasyfork.org/scripts/491824/dybz.meta.js
// ==/UserScript==

// 站点名。域名经常变动，没有更好的判断方法
// https://diyibanzhu.org/
const SITE_NAME = "歪歪蒂艾斯"

const TAG = "[第一版主]"

// 持久存储到篡改猴数据中的键
const V_DYBZ_HISTORY = "DYBZ_HISTORY"

// =========================== 函数 =========================== //

/**
 * 创建单手操作面板
 * @return {HTMLDivElement}
 */
const createOneHandPanel = () => {
  // 事件
  const gotoNextPage = () => {
    const nextLink = document.querySelector("a.curr")?.nextElementSibling ||
      document.querySelector("a.next")

    if (nextLink) {
      nextLink.click()
    }
  }
  const gotoTop = () => window.scrollTo({top: 0, behavior: "smooth"})

  // 创建按钮
  const bnNextPage = document.createElement('button')
  bnNextPage.textContent = "下页"
  bnNextPage.addEventListener('click', gotoNextPage)

  const bnTop = document.createElement('button')
  bnTop.textContent = "顶部"
  bnTop.addEventListener('click', gotoTop)

  // 创建扩展面板
  const oneHandPanel = document.createElement('div')
  containerToRow(oneHandPanel)

  // 向扩展面板添加上面的组件
  oneHandPanel.append(bnNextPage, bnTop)

  return oneHandPanel
}

/**
 * 创建设置面板
 * @return {HTMLDivElement}
 */
const createSettingsPanel = () => {
  // 备份
  const bnBackupHistory = document.createElement("button")
  bnBackupHistory.textContent = "备份 历史阅读记录"
  bnBackupHistory.classList.add("primary", "essenceX")
  bnBackupHistory.onclick = () => {
    console.log(TAG, "保存历史阅读记录到篡改猴")
    saveHistoryBooks()
    Toast.success("已备份 历史阅读记录")
  }

  // 恢复
  const bnRestoreHistory = document.createElement("button")
  bnRestoreHistory.textContent = "恢复 历史阅读记录"
  bnRestoreHistory.classList.add("primary", "essenceX")
  bnRestoreHistory.onclick = () => {
    const values = GM_getValue(V_DYBZ_HISTORY)
    console.log(TAG, "恢复的历史阅读记录：", values)
    restoreLocalStorageValues(values)
    Toast.success("已恢复 历史阅读记录")
  }

  const panel = document.createElement("div")
  containerToRow(panel)

  panel.append(bnBackupHistory, bnRestoreHistory)

  return panel
}

// =========================== 脚本页面 =========================== //

/**
 * 脚本页面：阅读页面，预加载下一页
 */
const prefetchNextPage = () => {
  // 依次找到"下一页"的元素：优先“下一页”，其次“下一章”
  const nextLink = document.querySelector("a.curr")?.nextElementSibling ||
    document.querySelector("a.next")

  console.log(TAG, "脚本将预加载下一页", nextLink, nextLink?.href)

  // 存在链接
  if (nextLink && nextLink.href) {
    // 通过"link prefetching"实现预加载下一页
    const link = document.createElement("link")

    // 注意：最后第一版主网站的章中最后的一页的 URL 的 href 是以"javascript:"开头，其它页是正常的 URL
    let href = nextLink.href
    if (href.startsWith("javascript:")) {
      const params = href.match(/\d+/g)
      href = "/" + params.slice(0, -1).join("/") + "_" + params.slice(-1) + ".html"
    }

    link.href = href
    link.rel = "prefetch"
    document.head.appendChild(link)
  }
}

/**
 * 脚本页面： 阅读页面，单手操作面板
 */
const oneHand = () => {
  const root = document.querySelector("div#ChapterView div.bd div.page-content")
  if (!root) {
    console.log(TAG, "'div.page-content'根元素为空")
    return
  }

  const panel = document.createElement("div")
  containerToRow(panel, "0px")
  panel.style.marginTop = "50px"

  // 注意 `elem.cloneNode(true)`不能复制`事件`，所以要直接创建 2 个，左右各一个
  const oneHandPanel1 = createOneHandPanel()
  const oneHandPanel2 = createOneHandPanel()

  // 章节页面元素，存在的话放在中间
  const chapterPages = document.querySelector(".chapterPages")

  if (chapterPages) {
    // 修正原样式
    chapterPages.style.marginTop = "auto"
    chapterPages.style.lineHeight = "auto"

    panel.append(oneHandPanel1, chapterPages, oneHandPanel2)
  } else {
    panel.append(oneHandPanel1, oneHandPanel2)
  }

  root.append(panel)
}

/**
 * 脚本页面：准许复制文本
 */
const enableCopyText = () => {
  document.querySelector("body").oncontextmenu = null

  const chapterBody = document.querySelector("body.chapter")
  if (chapterBody) {
    chapterBody.style.webkitUserSelect = "auto"
  }
}

/**
 * 脚本页面：额外显著表示当前阅读的页
 */
const markCurrPage = () => {
  let curr = document.querySelector("a.curr")
  if (!curr) {
    console.log(TAG, "没有获取到阅读页的元素")
    return
  }

  // 当前页
  curr.style.setProperty("color", "rgba(0, 0, 255, 1)", "important")

  // 其它页
  GM_addStyle(`
  .chapterPages a {
    color: #666 !important;
  }
  `)
}

/**
 * 脚本页面： 添加设置按钮
 */
const addSettingsButton = () => {
  const settingsLink = document.createElement("a")
  settingsLink.textContent = "扩展设置"
  settingsLink.onclick = () => {
    const panel = createSettingsPanel()
    showDialog("扩展设置", panel)
  }
  settingsLink.style.cursor = "pointer"

  const nav = document.querySelector("div.nav")
  containerToRow(nav)
  nav.appendChild(settingsLink)
}

/**
 * 脚本页面： 保存历史阅读记录到篡改猴
 *
 * 注释：localstorage 中 bookList 保存书籍 ID列表（以"#"分隔），只保存这个是无效的，还要保存 ID 对应的阅读进度才是完整的历史记录。
 * 所以读取、保存整个 localstorage
 */
const saveHistoryBooks = () => {
  const history = readLocalStorageValues(/^Hm_lvt/)
  if (history) {
    // 保存到篡改猴
    GM_setValue(V_DYBZ_HISTORY, history)
  }

  const values = GM_getValue(V_DYBZ_HISTORY)
  console.log(TAG, "已保存的历史阅读记录：", values)
}

/**
 * 增强作者文本为链接
 * @param authorNode 作者的 Node 实例
 */
const makeAuthorLink = (authorNode) => {
  const author = authorNode.textContent.trim().replace("作者：", "")

  const link = document.createElement("a")
  link.textContent = author
  link.href = `/author/${author}`
  link.classList.add("author")

  const parentElem = authorNode.parentElement
  authorNode.textContent = "作者："
  parentElem.insertBefore(link, parentElem.childNodes[1])
}

/**
 * 脚本页面：自动填充网站人机验证
 */
const verifyPage = () => {
  document.querySelector("input#password").value = "1234"
  document.querySelector("div.login a").click()
}

/**
 * 脚本页面：自动填充 CF 人机验证
 */
const cfPage = () => {
  const click = (elem) => {
    console.log(TAG, "CF 人机验证的选择框", elem)
    elem.click()
  }

  // 点击`span.mark`而不是`input[type='checkbox']`更容易通过验证
  // 参考 https://stackoverflow.com/a/76575463
  waitElem("div#challenge-stage span.mark", click)
}


(function () {
  'use strict'

  // Your code here...

  // CF 验证页面需要放在最前面。避免因为不是目标网站而跳过

  // 脚本页面：自动填充 CF 人机验证
  // 注意 CF 验证是通过 iframe 嵌入实现的，所以在指定 URL 的 iframe 中运行该函数
  if (location.href.startsWith("https://challenges.cloudflare.com/cdn-cgi/challenge-platform/")) {
    console.log(TAG, "自动填充 CF 人机验证")
    cfPage()
  }

  // 不是目标小说网站
  if (!document.title.includes(SITE_NAME) &&
    !(document.title === "您的阅读足迹" &&
      document.querySelector("h1.page-title").textContent === "您的阅读足迹")) {
    console.log(TAG, "不是目标小说网站，停止运行。", `网站标题："${document.title}"`, `网站地址：${location.href}`)
    return
  }

  // 在导航栏添加“扩展设置”按钮
  if (document.querySelector("div.nav")) {
    console.log('在导航栏添加“扩展设置”按钮')
    addSettingsButton()
  }

  // 脚本页面：自动填充网站人机验证
  if (document.querySelector("div.title")?.textContent?.includes("为防止恶意访问")) {
    console.log(TAG, "自动填充网站人机验证")
    verifyPage()
  }

  // 脚本页面：阅读页面
  if (document.querySelector("div#ChapterView")) {
    console.log(TAG, "预加载下一页")
    prefetchNextPage()

    console.log(TAG, "单手操作面板")
    oneHand()

    console.log(TAG, "准许复制文本")
    enableCopyText()

    console.log(TAG, "额外显著标识当前阅读的页")
    markCurrPage()
  }

  // 脚本页面：增强作者文本为链接
  if (/作者：.+/.test(document.querySelector("p.info")?.firstChild?.textContent?.trim())) {
    console.log(TAG, "增强作者文本为链接")
    makeAuthorLink(document.querySelector("p.info").firstChild)
  }
})()
