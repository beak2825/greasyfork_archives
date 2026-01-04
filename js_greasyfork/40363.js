// ==UserScript==
// @name Ylilauta Namefag-hider
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.1
// @locale en
// @description Hide posts by all named users automatically
// @downloadURL https://update.greasyfork.org/scripts/40363/Ylilauta%20Namefag-hider.user.js
// @updateURL https://update.greasyfork.org/scripts/40363/Ylilauta%20Namefag-hider.meta.js
// ==/UserScript==

const shouldBeHidden = (div) => {
  const postinfo = Array.from(div.childNodes).find(c => c.className === 'postinfo')
  const tags = Array.from(postinfo.childNodes).find(c => c.className === 'tags')
  const name = Array.from(tags.childNodes).find(c => c.className === 'postername').innerHTML
  return name !== 'Anonyymi'
}

const hide = () => Array.from(document.querySelectorAll('div.op_post, div.answer'))
  .filter(div => shouldBeHidden(div))
  .map(div => div.hidden = true)

hide()

const targetDiv = document.querySelector('div.answers')
const config = { childList: true }
const observer = new MutationObserver(
  (mutationsList) => {
    if (Array.from(mutationsList).filter(
      (mutation) => mutation.type === 'childList').length > 0) {
      hide()
    }
  }
)
observer.observe(targetDiv, config)