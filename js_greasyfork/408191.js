// ==UserScript==
// @name        Trello Copy
// @namespace   1207bd0a-0252-4c8d-9134-d40ac51e4248
// @match       https://trello.com/*
// @grant       none
// @version     1.0.0
// @author      Rick0
// @description Trello 功能擴充
// @require     https://unpkg.com/clipboard@2/dist/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/408191/Trello%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/408191/Trello%20Copy.meta.js
// ==/UserScript==

// == class ==

class Card {
  url = location.href.match(/(https?:\/\/.+)\//)[1]
  title () {
    return document.querySelector('.mod-card-back-title.js-card-detail-title-input').value
  }
  // description = document.querySelector('.description-title > .u-inline-block')
  // headerIcon = document.querySelector('.window-header-icon')
  // header = document.querySelector('.window-header')
}

// == global function ==

function setCSS(src) {
  let stylesheet = createNode(`<link rel="stylesheet" type="text/css" href="${src}">`)
  document.head.appendChild(stylesheet)
}

function setClipboardJS() {
  copyButton = createNode(`<button class="oneCopy"></button>`)
  document.body.appendChild(copyButton)
  new ClipboardJS('.oneCopy')
}

function setClipboard (text) {
  copyButton.setAttribute('data-clipboard-text', text)
  copyButton.click()
}

function createNode(html) {
  let template = document.createElement('template')
  template.innerHTML = html
  
  return template.content.firstChild
}

function createButton (buttonName, eventName, callback) {
  let button = createNode(`<div><a class="button subtle" href="javascript:void(0)">${buttonName}</a></div>`)
  let link = button.querySelector('a')

  link.addEventListener(eventName, callback)

  return button
}

function createCopyButton (buttonName, text) {
  return createButton(buttonName, 'click', function () {
    setClipboard(text)
  })
}

// == global var ==



// == program start ==

// setCSS('https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.css')
setClipboardJS()

let observer = new MutationObserver(function () {
  let isCardDeatilMode = (location.pathname.slice(1, 2) === 'c')
  if (isCardDeatilMode) {
    let card = new Card()

    let tagArea = document.querySelector('.window-main-col>.card-detail-data')
    let copyArea = createNode(`<div class="window-module-title window-module-title-no-divider description-title"><span class="icon-copy icon-lg window-module-title-icon"></span><h3 class="u-inline-block">複製</h3></div>`)
    let titleCopyButton = createButton('標題', 'click', function () {
      setClipboard(card.title())
    })
    let urlCopyButton = createCopyButton('網址', card.url)
    let recordCopyButton = createButton('專案紀錄', 'click', function () {
      setClipboard(`=HYPERLINK("${card.url}","${card.title().replace(/"/g, '\"\"')}")`)
    })

    ;[
      titleCopyButton,
      urlCopyButton,
      recordCopyButton,
    ]
      .forEach(button => {
        copyArea.appendChild(button)
    })
    tagArea.insertAdjacentElement('afterend', copyArea)
  }
})
observer.observe(document.body, {
  attributeFilter: ['class'],
})
