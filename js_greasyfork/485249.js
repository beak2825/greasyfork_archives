// ==UserScript==
// @name         Koodo Reader Style overwrite
// @namespace    http://wiidede.github.io/
// @license      MIT
// @version      0.5
// @description  Overwrite Koodo Reader CSS.
// @author       wiidede
// @match        https://reader.960960.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reader.960960.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485249/Koodo%20Reader%20Style%20overwrite.user.js
// @updateURL https://update.greasyfork.org/scripts/485249/Koodo%20Reader%20Style%20overwrite.meta.js
// ==/UserScript==

(async function () {
  'use strict'

  const css = `
.background-box1, .background-box2, .background-box3 {
  display: none !important;
}

.html-viewer-page.scrolling-html-viewer-page {
  margin: 0 !important;
  font-size: var(--reader-font-size, inherit) !important;
  padding-left: calc(50vw - 32.5ch) !important;
  padding-right: calc(50vw - 32.5ch) !important;
}

.popup-menu-container {
  opacity: 30% !important;
  left: 10px !important;
  transform: translateY(-100%) !important;
}

.popup-menu-container .menu-list {
  width: fit-content !important;
  height: fit-content !important;
}

.popup-menu-container .menu-list > div:not(.speaker-option) {
  display: none !important;
}

.popup-menu-container .color-option-container {
  display: none !important;
}
    `

  const iframeCss = `
p.kookit-text {
  font-family: Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji" !important;
  font-weight: normal !important;
  line-height: 1.75 !important;
}
  `

  function selectElement(selector, interval) {
    return new Promise((resolve) => {
      const select = () => {
        const element = document.querySelector(selector)
        if (element)
          resolve(element)
        else
          setTimeout(select, interval)
      }
      select()
    })
  }

  function addStyle(doc, css) {
    const style = doc.createElement('style')
    style.type = 'text/css'

    if (style.styleSheet)
      style.styleSheet.cssText = css
    else
      style.appendChild(doc.createTextNode(css))

    doc.head.appendChild(style)
  }

  addStyle(document, css)

  function getReaderFontSize(configStr) {
    try {
      const config = JSON.parse(configStr)
      const size = Number.parseInt(config.fontSize)
      return size || 16
    }
    catch {
      return 16
    }
  }

  function setSizeCssVar(size) {
    document.documentElement.style.setProperty('--reader-font-size', `${size}px`)
  }

  setSizeCssVar(getReaderFontSize(localStorage.getItem('readerConfig')))

  const pageEl = await selectElement('#page-area')
  const pageObserver = new MutationObserver((e) => {
    const iframe = Array.from(e[0].addedNodes).find(el => el.tagName === 'IFRAME')
    if (iframe) {
      setSizeCssVar(getReaderFontSize(localStorage.getItem('readerConfig')))
      addStyle(iframe.contentDocument, iframeCss)
    }
  })
  pageObserver.observe(pageEl, { childList: true })
})()
