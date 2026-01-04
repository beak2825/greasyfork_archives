// ==UserScript==
// @name                bilibili - display video av, bv number below the title bar
// @name:zh-CN          b 站 - 显示视频 av 号、bv 号及弹幕 cid
// @namespace           https://gist.github.com/phtwo
// @version             0.3.2
// @licence             MIT. Copyright (c) phtwo.
// @description         Display the video av, bv, cid number below the title bar of the bilibili play page, support copy short link
// @description:zh-CN   在 b 站播放页标题栏下面显示视频 av 号、bv 号及弹幕 cid，支持复制短链接
// @match               *://www.bilibili.com/video/*
// @grant               GM_addStyle
//
// @author              phtwo
// @homepage            https://gist.github.com/phtwo/e2d8c04707ed6a6369a55be37e3f14c7
// @supportURL          https://gist.github.com/phtwo/e2d8c04707ed6a6369a55be37e3f14c7
//
// @noframes
// @nocompat Chrome
//
// @downloadURL https://update.greasyfork.org/scripts/403846/bilibili%20-%20display%20video%20av%2C%20bv%20number%20below%20the%20title%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/403846/bilibili%20-%20display%20video%20av%2C%20bv%20number%20below%20the%20title%20bar.meta.js
// ==/UserScript==

/**
 * @licence MIT. Copyright (c) Feross Aboukhadijeh.
 * @description From https://github.com/feross/clipboard-copy
 * @param text
 * @returns {Promise<void>|any}
 */
function clipboardCopy(text) {
  // Use the Async Clipboard API when available. Requires a secure browsing
  // context (i.e. HTTPS)
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text).catch(function (err) {
      throw err !== undefined
        ? err
        : new DOMException('The request is not allowed', 'NotAllowedError')
    })
  }

  // ...Otherwise, use document.execCommand() fallback

  // Put the text to copy into a <span>
  const span = document.createElement('span')
  span.textContent = text

  // Preserve consecutive spaces and newlines
  span.style.whiteSpace = 'pre'

  // Add the <span> to the page
  document.body.appendChild(span)

  // Make a selection object representing the range of text selected by the user
  const selection = window.getSelection()
  const range = window.document.createRange()
  selection.removeAllRanges()
  range.selectNode(span)
  selection.addRange(range)

  // Copy text to the clipboard
  let success = false
  try {
    success = window.document.execCommand('copy')
  } catch (err) {
    console.log('error', err)
  }

  // Cleanup
  selection.removeAllRanges()
  window.document.body.removeChild(span)

  return success
    ? Promise.resolve()
    : Promise.reject(
        new DOMException('The request is not allowed', 'NotAllowedError')
      )
}

;(function () {
  const classPref = 'p-bevd'

  const styleCssText = `
.${classPref}-data-item {
  position: relative!important;
  color: #afafaf!important;
}

.${classPref}-data-item:hover .${classPref}-hover-box {
  display: inline-block!important;
}

.${classPref}-hover-box {
  display: none!important;
  vertical-align: top!important;
  
  position: absolute!important;
  bottom: 1.2em;
  right: 0;
  padding: 0 0 0 10px!important;
}

.${classPref}-copy-link {
  color: #afafaf!important;
}

.${classPref}-copy-link:hover {
  color: #00a1d6!important;
}
  `

  const urlNodeText = '短链接'

  const list = []

  /** @type {Element} */
  let videoDataLineElem

  init()

  function init() {
    console.log('[bilibili_extra_video_data] init')

    initVideoDataLineElem()
    if (!videoDataLineElem) {
      return
    }

    util_addStyle(styleCssText)

    start().catch((err) => {
      console.error(
        '[bilibili_extra_video_data] 发生未知错误，若刷新仍报错，可能为页面更新导致，',
        err
      )
    })
  }

  async function start() {
    await waitingForTheFirstInjection()

    initVideoDataChangeMonitor()
    doInject()
  }

  async function waitingForTheFirstInjection() {
    let lastElem

    lastElem = await waitingForChildElement(
      document.querySelector('#bilibili-player'),
      '.bilibili-player-video-sendbar',
      true
    )
    lastElem = await waitingForChildElement(
      lastElem,
      '.bilibili-player-video-info-people-number',
      true
    )

    console.log(
      '[bilibili_extra_video_data] Element(video-info-people-number) display'
    )

    // observeElementChange(
    //   lastElem,
    //   ({ off }) => {
    //     console.log(
    //       '[bilibili_extra_video_data] Element(video-info-people-number)'
    //     )
    //   },
    //   {
    //     attributes: false,
    //     characterData: true,
    //     characterDataOldValue: true,
    //   }
    // )

    // Trick Code: 检测到上述元素后，设置 2s 的延时
    await util_delay(2e3)
  }

  function initVideoDataLineElem() {
    videoDataLineElem = document.querySelector(
      '#viewbox_report .video-data:nth-of-type(1)'
    )
  }

  function initVideoDataChangeMonitor() {
    observeElementChange(videoDataLineElem.children[0], doInject, {
      attributeFilter: ['title'],
    })
  }

  function doInject() {
    const { aid, bvid, cid } = unsafeWindow

    list.length = 0 // clear list
    addItem('av', aid, true)
    addItem('', bvid, true)
    addItem('cid', cid)

    const fragment = createFragment()

    const referenceNode = videoDataLineElem.querySelector('.copyright')
    removeOldNodes()
    videoDataLineElem.insertBefore(fragment, referenceNode)

    console.log('[bilibili_extra_video_data] doInject finished')
  }

  function createFragment() {
    const firstPrefix = '&nbsp;&nbsp;'
    const prefix = '&nbsp;·&nbsp;'

    const nodeList = list.map((item, index) => {
      let text = item.prefix + item.value
      let innerHTML = (index === 0 ? firstPrefix : prefix) + text

      const elem = document.createElement('span')
      elem.title = text
      elem.innerHTML = innerHTML
      elem.classList.add(`${classPref}-data-item`)
      elem.setAttribute('data-inject', '')

      item.hasShortLink && elem.append(createHoverElem(text))

      return elem
    })

    const fragment = document.createDocumentFragment()
    fragment.append(...nodeList)
    return fragment
  }

  function createHoverElem(id) {
    const aNode = document.createElement('a')
    aNode.classList.add(`${classPref}-copy-link`)
    aNode.href = 'https://b23.tv/' + id
    aNode.textContent = urlNodeText
    aNode.title = '单击复制，右键打开菜单'

    aNode.addEventListener('click', copyUrlOnClick)

    const e = document.createElement('span')
    e.classList.add(`${classPref}-hover-box`)
    e.append(aNode)
    return e
  }

  function copyUrlOnClick(ev) {
    ev.preventDefault()
    ev.stopPropagation()

    const target = ev.target
    const text = target.href || ''

    clipboardCopy(text).then(
      async () => {
        console.log(
          '[bilibili_extra_video_data] copy [%s] to clipboard succeeded.',
          text
        )
        target.textContent = '已复制!'
        await util_delay(1e3)
        target.textContent = urlNodeText
      },
      () => {
        console.error(
          '[bilibili_extra_video_data] copy [%s] to clipboard failed.',
          text
        )
        window.prompt('自动复制失败，请手动复制', text)
      }
    )
  }

  function removeOldNodes() {
    videoDataLineElem
      .querySelectorAll('[data-inject]')
      .forEach((node) => node.parentNode.removeChild(node))
  }

  function addItem(prefix = '', value, hasShortLink = false) {
    value && list.push({ prefix, value, hasShortLink })
  }

  // ------

  /**
   * @name waitingForChildElement
   * @description 使用 MutationObserver 接口，等待父元素后代中匹配指定 CSS 选择器元素的出现并返回该元素
   * @param {Node | string} parent
   * @param {string} childSelectors - 使用 Element.matches 匹配
   * @param {boolean} subtree
   * @return {Promise<Element>}
   */
  function waitingForChildElement(parent, childSelectors, subtree = false) {
    // 先判断 后代元素 是否存在，存在立即返回
    // 不存在，再使用 MutationObserver 监视

    const deferred = createPromiseDeferred()

    const parentElem =
      typeof parent === 'string' ? document.querySelector(parent) : parent

    const targetChildElem = subtree
      ? parentElem.querySelector(childSelectors)
      : [...parentElem.children].find((elem) => elem.matches(childSelectors))

    if (targetChildElem) {
      deferred.resolve(targetChildElem)
      return deferred.promise
    }

    const options = {
      childList: true,
      subtree,
    }
    const observer = new MutationObserver(mutationCallback)
    observer.observe(parentElem, options)

    return deferred.promise

    function mutationCallback(/** @type {Array<MutationRecord>} */ recordList) {
      for (const record of recordList) {
        let targetNode

        for (const node of [...record.addedNodes]) {
          if (1 !== node.nodeType) {
            continue
          }
          if (node.matches(childSelectors)) {
            targetNode = node
            break
          }
          if (subtree) {
            let tNode = node.querySelector(childSelectors)
            if (tNode) {
              targetNode = tNode
              break
            }
          }
        }

        if (targetNode) {
          observer.disconnect()
          deferred.resolve(targetNode)
          break
        }
      }
    }
  }

  /**
   * observeElementChange
   * @description 监听元素属性的变化。 ps: 批量更新多个属性时仅触发一次
   * @param {Element} target
   * @param {Function} callback
   * @param {Object} options
   */
  function observeElementChange(target, callback, options) {
    const observer = new MutationObserver((recordList) => {
      observer.takeRecords()
      callback({
        off,
      })
    })

    observer.observe(target, {
      attributes: true,
      // attributeFilter: [],
      // subtree: true,
      // childList: true,
      // characterData: true,
      ...options,
    })

    function off() {
      observer.disconnect()
    }
  }

  // ------

  function createPromiseDeferred() {
    let _resolve, _reject
    let promise = new Promise((resolve, reject) => {
      _resolve = resolve
      _reject = reject
    })

    return {
      promise,
      resolve: _resolve,
      reject: _reject,
    }
  }

  function util_addStyle(css) {
    if (typeof GM_addStyle !== 'undefined') {
      return GM_addStyle(css)
    }

    const styleNode = document.createElement('style')
    styleNode.appendChild(document.createTextNode(css))
    ;(document.querySelector('head') || document.documentElement).appendChild(
      styleNode
    )
    return styleNode
  }

  function util_delay(timeout = 300, doReject) {
    return new Promise((resolve, reject) => {
      setTimeout(doReject ? reject : resolve, timeout)
    })
  }
})()
