// ==UserScript==
// @name Ylilauta code highlighter
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @grant none
// @version 0.2
// @locale en
// @description Highlight codeblocks with Highlight.js
// @downloadURL https://update.greasyfork.org/scripts/39909/Ylilauta%20code%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/39909/Ylilauta%20code%20highlighter.meta.js
// ==/UserScript==

const loadCSS = () => {
  const css = document.createElement('link')
  css.rel = 'stylesheet'
  css.href = 'https://gitcdn.xyz/repo/isagalaev/highlight.js/cf4b46e5b7acfe2626a07914e1d0d4ef269aed4a/src/styles/darcula.css'
  document.head.insertBefore(css, document.head.lastChild)
}

const transform = () => {
  Array.from(document.querySelectorAll('pre[class="pre"]'))
    .map((pre) => hljs.highlightBlock(pre))
}

loadCSS()
transform()

const targetDiv = document.querySelector('div.answers')
const config = { childList: true }

const observer = new MutationObserver(
  (mutationsList) => {
    if (Array.from(mutationsList).filter(
      (mutation) => mutation.type === 'childList').length > 0) {
      transform()
    }
  }
)

observer.observe(targetDiv, config)