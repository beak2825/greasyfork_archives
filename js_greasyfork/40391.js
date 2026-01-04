// ==UserScript==
// @name Ylilauta Tagpost-hider
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.1
// @locale en
// @description Hide all posts with tags automatically
// @downloadURL https://update.greasyfork.org/scripts/40391/Ylilauta%20Tagpost-hider.user.js
// @updateURL https://update.greasyfork.org/scripts/40391/Ylilauta%20Tagpost-hider.meta.js
// ==/UserScript==

const allowedTags = [
  'postername',
  'tag text postedbyop',
  'postnumber quotelink',
  'posttime'
]

const shouldBeHidden = (div) => {
  const postinfo = Array.from(div.childNodes).find(c => c.className === 'postinfo')
  const tags = Array.from(postinfo.childNodes).find(c => c.className === 'tags')
  return Array.from(tags.childNodes)
    .map (t => t.className)
    .filter(t => t && !allowedTags.includes(t))
    .length !== 0
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