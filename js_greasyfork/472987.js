// ==UserScript==
// @name         Agnai: Clear CoT inside HTML comments from bot responses
// @description  Automatically removes <!-- HTML comments --> from bot responses (useful if you don't want CoT to remain in your prompt). Makes the deleted comments visible via a new [CoT] button on the UI as well as in the browser console
// @author       prkstop
// @license      MIT
// @match        https://agnai.chat/*
// @version 0.0.1
// @namespace https://greasyfork.org/users/1124234
// @downloadURL https://update.greasyfork.org/scripts/472987/Agnai%3A%20Clear%20CoT%20inside%20HTML%20comments%20from%20bot%20responses.user.js
// @updateURL https://update.greasyfork.org/scripts/472987/Agnai%3A%20Clear%20CoT%20inside%20HTML%20comments%20from%20bot%20responses.meta.js
// ==/UserScript==

(function() {

// Settings
const EMPTY_THE_COMMENT_INSTEAD_OF_DELETING = false

// helpers
const log = a => (console.log(a), a)
const q = sel => document.querySelector(sel)
const qAll = sel => document.querySelectorAll(sel)
const last = arr => arr[arr.length-1]
const sleep = ms => new Promise(res => setTimeout(res, ms))
const selStrs = {
  loadingAnim: '.dot-flashing',
  markdownClass: 'rendered-markdown',
}
const sels = {
  editBtns: () => [...qAll('.edit-btn')],
  editBtn: () => last([...qAll('.edit-btn')]),
  editBox: () => q('.msg-edit-text-box'),
  confirmEditBtn: () => q('.confirm-edit-btn'),
  cancelEditBtn: () => q('.cancel-edit-btn'),
  loadingAnim: () => q(selStrs.loadingAnim),
  lastIconList: () => last([...qAll('.flex.flex-row.justify-between.pb-1 > div.flex')]),
  streamingMarkdown: () => q('.streaming-markdown')
}
const loadingAnimRemoved = muts => muts
  .flatMap(m => [...m.removedNodes])
  .find(n => n.querySelector?.(selStrs.loadingAnim))

const comments = {}
let nextId = 0
let mustRefreshCotId = null

const clearLatestHtmlComment = async () => {
  const chatEditingInitiallyEnabled = sels.editBtns().length > 0
  if (!chatEditingInitiallyEnabled) {
    // TODO: handle this case by enabling it then re-disabling it later
    console.log("[HTML Comment Clearer] Enable chat editing if you haven't.")
    return
  }
  await sleep(0)
  sels.editBtn().click()
  if (!sels.editBox()?.innerHTML) return
  const htmlCommentRegex = /&lt;![-–—]{1,2}[\s\S]*?[-–—]{1,2}&gt;/g
  const found = sels.editBox().innerHTML.match(htmlCommentRegex)?.join('\n') ?? ''
  sels.editBox().innerHTML = sels.editBox().innerHTML
    .replace(htmlCommentRegex, EMPTY_THE_COMMENT_INSTEAD_OF_DELETING ? '&lt;!-- --&gt;' : '')
    .replace(/^(<br>\s*)+/i, '')
    .trim()
  sels.confirmEditBtn().click()
  const id = nextId
  nextId++
  comments[id] = found.replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
  if (!comments[id]) return
  console.log(`[HTML Comment Clearer] Removed this comment:\n${comments[id].replace(/<br>/g, '\n')}`)
  ensureCotBtnIsShown(id)
}

const ensureCotBtnIsShown = async (id) => {
  q(`#show-comments-${id}`)?.remove()
  sels.lastIconList()?.insertAdjacentHTML('afterbegin', `
    <div id="show-comments-${id}" style="cursor: pointer;">[CoT]</div>
  `)
  q(`#show-comments-${id}`).addEventListener('click', () => {
    alert(comments[id]?.replace(/<br>/g, '\n'))
  })
  await sleep(0)
  mustRefreshCotId = id
}

let isStreaming = false

let addingCot = false
new MutationObserver(async muts => {
  const previouslyStreaming = isStreaming
  if (sels.streamingMarkdown()) {
    mustRefreshCotId = null
    isStreaming = true
  } else {
    isStreaming = false
    if (previouslyStreaming) {
      clearLatestHtmlComment()
    }
  }
  if (sels.loadingAnim()) {
    mustRefreshCotId = null
  }
  if (loadingAnimRemoved(muts)) {
    // await sleep(2000)
    if (sels.loadingAnim() || isStreaming) return
    clearLatestHtmlComment()
  }
  if (mustRefreshCotId !== null && !addingCot) {
    addingCot = true
    await ensureCotBtnIsShown(mustRefreshCotId)
    addingCot = false
  }
}).observe(document.body, { childList: true, subtree: true })

})();
