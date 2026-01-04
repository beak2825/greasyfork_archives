// ==UserScript==
// @name         4Panes
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  4chan generals stacked side by side
// @author       You
// @match        https://boards.4channel.org/*
// @match        https://boards.4chan.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=4channel.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465075/4Panes.user.js
// @updateURL https://update.greasyfork.org/scripts/465075/4Panes.meta.js
// ==/UserScript==

const main = () => {
  const threadUrl = (board, general) => `https://boards.4channel.org${board}catalog#s=${general}`
  const THREADS = [
    { name: '/aicg/', url: threadUrl('/g/', '/aicg/'), color: '#7070AB' },
    { name: '/lmg/', url: threadUrl('/g/', '/lmg/'), color: '#EC8C8C' },
    { name: '/wAIfu/', url: threadUrl('/vt/', '/wAIfu/'), color: '#DBB9D9' },
  ]

  const isIframePane = window.top !== window.self
  if (isIframePane) {
    const scrollbarColorQueryParam =
      new URLSearchParams(window.location.search).get('scrollbarColor')
    const iframeKey = window.frameElement.getAttribute('id')
    const storedScrollbarColor = localStorage.getItem(iframeKey)
    const scrollbarColor = storedScrollbarColor ?? scrollbarColorQueryParam
    localStorage.setItem(iframeKey, scrollbarColor)
    document.head.insertAdjacentHTML('beforeend', `
      <style>
        ::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
          border-radius: 10px;
          background-color: #F5F5F5;
        }

        ::-webkit-scrollbar {
          width: 12px;
          background-color: #F5F5F5;
        }

        ::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
          background-color: ${scrollbarColor};
        }
      </style>
    `)
    return
  }

  const insertScrollbarColorInUrl = (url, color) => {
    const [baseUrl, anchor] = url.split('#')
    return `${baseUrl}?scrollbarColor=${encodeURIComponent(color)}#${anchor}`
  }

  const noSlashes = str => str.replaceAll('/', '')

  const iframeSrc = (title, url, color) => `
    <div
      id="pane-${noSlashes(title)}"
      style="
        border: 3px ${color} solid;
        border-radius: 5px;
        width: 100%;
        height: calc(100% - 18px);
        padding: 6px;
        margin: 6px;
        position: relative;
      "
    >
      <div
        style="
          position: absolute;
          top: 30px;
          right: 30px;
          color: black;
          background: white;
          border: 3px solid ${color};
          padding: 6px;
          border-radius: 5px;
          font-weight: bold;
          color: ${color};
        "
      >
        ${title}
      </div>
      <iframe
        id="iframe-${noSlashes(title)}"
        src="${insertScrollbarColorInUrl(url, color)}"
        style="
          width: 100%;
          height: 100%;
          overflow-y: scroll;
        "
      >
      </iframe>
    </div>
  `

  const initPaneBtnSrc = `
    <div
      id="init-pane-btn"
      style="
        position: fixed;
        top: 30px;
        right: 30px;
        padding: 5px;
        border: 3px solid black;
        background: white;
        color: black;
        border-radius: 3px;
        z-index: 999999;
      "
    >
      [Initialize stack]
    </div>
  `

  const pageStackSrc = `
    <html>
      <head><style></style></head>
      <body>
        <div
          id="page-stack"
          style="
            display: flex;
            height: calc(100vw - (100vw - 100%));
            width: calc(100vh - (100vh - 100%));
            overflow: hidden;
          "
        >
        </div>
      </body>
    </html>
  `

  document.body.insertAdjacentHTML('beforeend', initPaneBtnSrc)
  document.getElementById('init-pane-btn').onclick = () => {
    document.write(pageStackSrc)
    document.styleSheets[0].insertRule("* { box-sizing: border-box; }", 0);
    document.body.style.margin = '0'
    const stack = document.getElementById('page-stack')
    THREADS.forEach(thread => {
      stack.insertAdjacentHTML('beforeend', iframeSrc(thread.name, thread.url, thread.color))
    })
  }
}

main()
