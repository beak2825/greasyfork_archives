// ==UserScript==
// @name         知网HTML阅读页面全文复制按钮
// @namespace    https://zhaoji.wang/
// @version      0.12
// @description  在知网HTML阅读页面标题尾部添加一个按钮，点击后复制全文内容。
// @author       Zhaoji Wang
// @match        https://kns.cnki.net/nzkhtml/xmlRead/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnki.net
// @run-at       document-end
// @grant        unsafeWindow
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/505896/%E7%9F%A5%E7%BD%91HTML%E9%98%85%E8%AF%BB%E9%A1%B5%E9%9D%A2%E5%85%A8%E6%96%87%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/505896/%E7%9F%A5%E7%BD%91HTML%E9%98%85%E8%AF%BB%E9%A1%B5%E9%9D%A2%E5%85%A8%E6%96%87%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

;(() => {
  /**
   * 创建用于复制全文的按钮
   * @returns {HTMLElement}
   */
  const createCopyButton = () => {
    const $btn = document.createElement('span')
    $btn.id = 'copy-full-text-btn'
    $btn.title = '复制全文'
    $btn.style.cursor = 'pointer'
    $btn.style.display = 'inline-block'
    $btn.style.marginLeft = '0.5em'
    $btn.style.fontSize = '0.8em' // 调整图标大小为 0.8em
    $btn.style.transition = 'all 0.2s'
    $btn.innerText = '📋'

    // 添加点击时的动画效果
    $btn.addEventListener('mousedown', () => {
      $btn.style.transform = 'scale(0.8)'
      setTimeout(() => {
        $btn.style.transform = 'scale(1)'
      }, 200)
    })

    return $btn
  }

  /**
   * 生成供复制的文本
   * @returns {string}
   */
  const getTextToCopy = () => {
    const textToCopy = document.querySelector('#paperRead.ChapterContainer')?.innerText || ''
    const wordEndText = document.querySelector('.word-end')?.innerText || ''
    const copyFullTextBtnText = document.querySelector('#copy-full-text-btn')?.innerText || ''
    return textToCopy.replace(wordEndText, '').replace(copyFullTextBtnText, '').split('\n').map((line) => line.trim()).join('\n')
  }

  /**
   * 挂载按钮到标题元素之后
   */
  const mount = async () => {
    const $h1 = document.querySelector('h1.Chapter')
    if (!$h1) {
      return
    }

    const $btn = createCopyButton()
    $btn.addEventListener('click', () => {
      const textToCopy = getTextToCopy()
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(
          () => {
            if ($btn.innerText === '📋') {
              alert('全文已复制到剪贴板')
              $btn.innerText = '👌'
              setTimeout(() => {
                $btn.innerText = '📋'
              }, 1000)
            }
          },
          (err) => {
            alert('复制失败，请重试')
            console.error(err)
          }
        )
      } else {
        alert('未找到全文内容')
      }
    })

    $h1.appendChild($btn)
  }

  /**
   * 守护按钮不被清除
   */
  const ward = async () => {
    const $btn = document.querySelector('#copy-full-text-btn')
    if (!$btn) {
      await mount()
    }
    setTimeout(ward, 1000)
  }

  ward()
})()