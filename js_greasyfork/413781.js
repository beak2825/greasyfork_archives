// ==UserScript==
// @name         Hide Slack User
// @namespace    d6b21ea17506e772
// @version      1.0.0
// @grant        none
// @description  Hide / mute / censor / block specified users in Slack.
// @match        https://*.slack.com/*
// @author       Picadillo
// @downloadURL https://update.greasyfork.org/scripts/413781/Hide%20Slack%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/413781/Hide%20Slack%20User.meta.js
// ==/UserScript==
(()=>{
const hiddenUsers = ['some_user', 'some_other_user']

// Iterates a container of .c-virtual_list__items
// and, if hiddenUsers includes their sender, hides them.
const hideMessages = (container)=>{
  let hide = false

  for (const message of container.children) {
    if (message.className != 'c-virtual_list__item') { continue }

    // Detect a.c-message__sender_link and, if present, update hide.
    const sender = message.querySelector('a.c-message__sender_link')
    if (sender != null) {
      hide = hiddenUsers.includes(sender.textContent)
    }
    // If hiddenUsers includes the most recent sender, then hide.
    if (hide) {
      message.style.display = 'none'
    }
  }
}
// Observes a container for childList updates
// and, when they occur, invokes hideMessages(container).
const observeMessages = (container)=>{
  // Observe at most once per container.
  if (container.hasAttribute('data-observe_messages')) { return }
  container.setAttribute('data-observe_messages', true)

  const callback = (mutations)=>{
    hideMessages(container)
  }
  callback()
  const observer = new MutationObserver(callback)
  observer.observe(container, {childList:true})
}
// Observes the layout for childList subtree updates
// and, when they occur, searches for the specified view
// and, if found, searches the view for a container
// and, if found, invokes observeMessages(container).
const observeContainerIn = (layout, view)=>{
  const callback = (mutations)=>{
    for (const child of layout.children) {
      if (child.className === view) {
        const container = child.querySelector('div.c-virtual_list__scroll_container')
        if (container != null) { observeMessages(container) }
      }
    }
  }
  callback()
  const observer = new MutationObserver(callback)
  observer.observe(layout, {childList:true, subtree:true})
}
window.addEventListener('load', ()=>{
  const workspace_layout = document.querySelector('div.p-workspace-layout')
  observeContainerIn(workspace_layout, 'p-workspace__primary_view')
  observeContainerIn(workspace_layout, 'p-workspace__secondary_view')
}, false)
})();
