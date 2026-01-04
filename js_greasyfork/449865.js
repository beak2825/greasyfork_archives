// ==UserScript==
// @name         Bilibili 标题和链接分享
// @namespace    https://zhaoji.wang/
// @version      0.41
// @description  为 Bilibili 网页版视频标题尾部增加一个小按钮，点击后可以复制当前视频的标题和链接（且会自动去除链接中 ? 之后除了分 P 信息之外的的所有查询参数）。
// @author       Zhaoji Wang
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @run-at       document-end
// @grant        unsafeWindow
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/449865/Bilibili%20%E6%A0%87%E9%A2%98%E5%92%8C%E9%93%BE%E6%8E%A5%E5%88%86%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/449865/Bilibili%20%E6%A0%87%E9%A2%98%E5%92%8C%E9%93%BE%E6%8E%A5%E5%88%86%E4%BA%AB.meta.js
// ==/UserScript==

;(() => {
  /**
   * 创建用于复制标题和链接的按钮
   * @returns {HTMLElement}
   */
  const createBtn = () => {
    const $btn = document.createElement('span')
    $btn.id = 'bilibili-title-and-url-share-btn'
    $btn.title = '复制当前视频标题和链接'
    $btn.style.cursor = 'pointer'
    $btn.style.display = 'inline-block'
    $btn.style.marginRight = '12px'
    $btn.style.transition = 'all 0.2s'
    $btn.innerText = '🏷️'
    $btn.addEventListener('mousedown', () => {
      $btn.style.transform = 'scale(0.8)'
      setTimeout(() => {
        $btn.style.transform = 'scale(1)'
      }, 200)
    })
    return $btn
  }

  /**
   * 等待视频标题元素渲染完成
   * @returns {Promise<HTMLElement>}
   */
  const waitForTitle = () => {
    return new Promise((resolve) => {
      const checkTitle = () => {
        const $h1 = document.querySelector('h1.video-title')
        if ($h1 && $h1.innerText) {
          resolve($h1)
        } else {
          setTimeout(checkTitle, 100)
        }
      }
      checkTitle()
    })
  }

  /**
   * 生成供复制的文本
   * @param {string} title 视频标题
   * @returns {string}
   */
  const getTextToCopy = (title) => {
    /**
     * 获取分 P 参数
     */
    const p = location.search
      .slice(1)
      .split('&')
      .map((x) => x.split('='))
      .find((x) => x[0] === 'p')
    const query = p ? `?p=${p[1]}` : ''
    const url = `${location.origin}${location.pathname}${query}`
    const textToCopy = `${title}\n${url}`
    return textToCopy
  }

  /**
   * 挂载按钮到视频标题元素之后
   */
  const mount = async () => {
    const $h1 = await waitForTitle()
    $h1.style.textIndent = 0
    const textToCopy = getTextToCopy($h1.innerText)

    const $btn = createBtn()
    $btn.addEventListener('click', () =>
      navigator.clipboard.writeText(textToCopy).then(
        () => {
          if ($btn.innerText === '🏷️') {
            console.info(`Share link copied to clipboard:\n${textToCopy}`)
            $btn.innerText = '👌'
            setTimeout(() => {
              $btn.innerText = '🏷️'
            }, 1000)
          }
        },
        (err) => {
          alert(err)
        }
      )
    )

    $h1.prepend($btn)
  }

  /**
   * 守护按钮不被清除
   */
  const ward = async () => {
    const $btn = document.querySelector('#bilibili-title-and-url-share-btn')
    if (!$btn) {
      await mount()
    }
    setTimeout(ward, 1000)
  }

  ward()
})()
