// ==UserScript==
// @name        Meet FulScreen
// @namespace   Violentmonkey Scripts
// *://*/*
// @match       https://meet.google.com/*
// @grant       none
// @version     1.1
// @author      -
// @description 30.08.2021, 18:20:22
// @downloadURL https://update.greasyfork.org/scripts/431646/Meet%20FulScreen.user.js
// @updateURL https://update.greasyfork.org/scripts/431646/Meet%20FulScreen.meta.js
// ==/UserScript==

let fullScreen = false

document.body.onkeydown = e => {
  const header = document.querySelector('[data-avatar-size="s"]')?.parentNode.parentNode.parentNode.parentNode
  const footer = document.querySelector('[data-capture-type]')?.parentNode.parentNode.parentNode.parentNode.parentNode
  const floater = header?.nextElementSibling.firstElementChild.firstElementChild
  const presentation = document.querySelector('[style="inset: 72px 16px 80px;"]')
  
  if (e.key === 'F' && e.ctrlKey && e.altKey && e.shiftKey) {
    if (fullScreen) {
      header.style.display = null
      footer.style.display = null
      floater.style.display = null
      presentation.style = 'inset: 72px 16px 80px;'
      
      fullScreen = false
      console.log('Monkey disables FullScreen')
    } else {
      header.style.display = 'none'
      footer.style.display = 'none'
      floater.style.display = 'none'
      presentation.style = 'height: 100%'
      
      fullScreen = true
      console.log('Monkey enables FullScreen')
    }
  }
}
