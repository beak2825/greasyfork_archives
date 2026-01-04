// ==UserScript==
// @name Ylilauta wordhider
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @grant none
// @version 0.1
// @locale en
// @description Hide posts that contain blacklisted words
// @downloadURL https://update.greasyfork.org/scripts/40366/Ylilauta%20wordhider.user.js
// @updateURL https://update.greasyfork.org/scripts/40366/Ylilauta%20wordhider.meta.js
// ==/UserScript==

/*
 * INSERT WORDS OR PHRASES TO HIDE HERE IN LOWERCASE
 */
const blacklist = [
  'add',
  'your',
  'words',
  'here'
]

const shouldBeHidden = (div) => {
  const post = Array.from(div.childNodes).find(c => c.className === 'post')
  
  // REMOVE .toLowerCase() IF YOU WANT THE MATCHING TO BE CASE-SENSITIVE
  const postcontent = Array.from(post.childNodes).find(c => c.className === 'postcontent').innerText.toLowerCase()
  
  return blacklist.some(word => postcontent.indexOf(word) !== -1)
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