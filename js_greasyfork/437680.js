// ==UserScript==
// @name        Hide VScode Live Server
// @namespace   Violentmonkey Scripts
// @match       http://127.0.0.1:550*/*
// @run-at      document-idle
// @grant       none
// @version     1.3
// @author      Mikhail 'UniBreakfast' Ninin
// @license     MIT 
// @description 12/28/2021, 9:44:59 AM
// @downloadURL https://update.greasyfork.org/scripts/437680/Hide%20VScode%20Live%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/437680/Hide%20VScode%20Live%20Server.meta.js
// ==/UserScript==

hideLiveServer()

function hideLiveServer() {
  const {body} = document
  const script = findScriptByText('LiveServer')
  const comment = findCommentByText('live-server')
  
  if (script) script.remove()
  if (comment) comment.remove()
  
  setTimeout(() => {
    body.classList.remove('vsc-initialized')
    if (!body.className) body.removeAttribute('class')
  }, 500)
}

function findCommentByText(text) {
  return Array.from(document.body.childNodes).find(node => node.textContent.includes('live-server'))
}

function findScriptByText(text) {
  return Array.from(document.scripts).find(script => script.textContent.includes(text))
}