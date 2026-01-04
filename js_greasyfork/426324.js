// ==UserScript==
// @name         FullScreen Meeting
// @namespace    fullscreen.meet.google.aurium.one
// @version      2.0
// @description  Makes pinned video to use maximum window space
// @author       Aurélio A. Heckert
// @match        https://meet.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426324/FullScreen%20Meeting.user.js
// @updateURL https://update.greasyfork.org/scripts/426324/FullScreen%20Meeting.meta.js
// ==/UserScript==

'use strict';

console.log('Starting FullScreen Meeting Userscript. ✨')

// Build functions with rich error log
function catchable(name, fn) {
  catchable.counter++
  fn.displayName = name || 'catchable-' + catchable.counter
  return (...args)=> {
    try {
      return fn(...args)
    } catch(err) {
      if (!err.cascaded) console.error(err)
      const prefix = err.cascaded ? '‼️' : '🔸'
      if (args.length === 0) console.error(`${fn.displayName} Fail with no params.`)
      else console.error(`${fn.displayName} Fail with params:`, ...args)
      Object.assign(err, {cascaded: true})
      throw(err)
    }
  }
}
catchable.counter = 0


setInterval(catchable('enablePicInPic', ()=> {
  document.querySelectorAll('[data-participant-id]').forEach(parent => {
    parent.classList.add('video-box')
    //parent.lastChild.classList.add('video-overlay')
    parent.childNodes.forEach(c => {
      if (c.getAttribute('jsaction').match(/^mousedown:/)) {
        c.classList.add('video-overlay')
      }
    })
  })
}), 1000)

document.body.id = 'gotcha'

const style = document.createElement('style')
document.head.appendChild(style)
style.innerHTML = `
  #gotcha .video-box video {
    pointer-events: all;
  }
  #gotcha .video-overlay {
    width: 50%;
    background: radial-gradient(rgba(0,150,255,.2), transparent 33%);
    opacity: 0;
    transition: opacity 1s;
  }
  #gotcha .video-box:hover .video-overlay {
    opacity: 1;
  }
`