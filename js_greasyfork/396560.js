// ==UserScript==
// @name    edx Shortcuts and Extra Speeds
// @description Make edx more accessible
// @namespace https://greasyfork.org/users/446410
// @version 0.0.3
// @match   https://courses.edx.org/courses/*
// @require https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.6.3/mousetrap.min.js
// @downloadURL https://update.greasyfork.org/scripts/396560/edx%20Shortcuts%20and%20Extra%20Speeds.user.js
// @updateURL https://update.greasyfork.org/scripts/396560/edx%20Shortcuts%20and%20Extra%20Speeds.meta.js
// ==/UserScript==

function requireEl(selector, cb) {
  let el = document.querySelector(selector)
  if (el) {
    cb(el)
  }
}

function click(el, ev, repeat) {
  repeat = repeat || 1
  for (let i = 0; i < repeat; ++i) {
    el.dispatchEvent(new KeyboardEvent('keydown', ev))
  }
  el.dispatchEvent(new KeyboardEvent('keyup', ev))
}

// === Navigation ===

Mousetrap.bind('p', () => {
  requireEl('.button-previous', el => el.click())
})

Mousetrap.bind('n', () => {
  requireEl('.button-next', el => el.click())
})

// === Video player ===

Mousetrap.bind('f', () => {
  requireEl('.add-fullscreen', el => el.click())
})

Mousetrap.bind(['space', 'k'], () => {
  requireEl('.video_control', el => el.click())
  return false
})

Mousetrap.bind('j', () => {
  requireEl('.progress-handle', el => {
    click(el, {
      key: "ArrowRight",
      charCode: 0,
      keyCode: 39
    }, 5)
  })
})

Mousetrap.bind('l', () => {
  requireEl('.progress-handle', el => {
    click(el, {
      key: "ArrowLeft",
      charCode: 0,
      keyCode: 37
    }, 5)
  })
})

Mousetrap.bind('shift+j', () => {
  requireEl('.subtitles-menu .current', el => {
    let el_ = el
    el = el.previousSibling
    if (el) {
      el_.remove('current')
      el.querySelector('[tabindex]').click()
      el.classList.add('current')
    }
  })
})

Mousetrap.bind('shift+l', () => {
  requireEl('.subtitles-menu .current', el => {
    let el_ = el
    el = el.nextSibling
    if (el) {
      el_.remove('current')
      el.querySelector('[tabindex]').click()
      el.classList.add('current')
    }
  })
})


Mousetrap.bind('<', () => {
  requireEl('.video-speeds .is-active', el => {
    el = el.nextSibling
    if (el) {
      el.querySelector('[tabindex]').click()
      el.classList.add('is-active')
    }
  })
})

Mousetrap.bind('>', () => {
  requireEl('.video-speeds .is-active', el => {
    el = el.previousSibling
    if (el) {
      el.querySelector('[tabindex]').click()
      el.classList.add('is-active')
    }
  })
})

// === Add new video playback speeds ===

const speeds = [
  "1.75",
  "2",
  "2.25",
  "2.5",
  "2.75",
  "3",
]

new MutationObserver(mutations => {
  requireEl('.video-speeds', el => {
    if (el.children.length <= 4) {
      // Patch
      for (const speed of speeds) {
        el.insertAdjacentHTML('afterbegin', `<li class="" data-speed="${speed}"><button class="control speed-option" tabindex="-1" aria-pressed="false">${speed}x</button></li>`)
      }
    }
  })
}).observe(document.body, {
  childList: true,
})