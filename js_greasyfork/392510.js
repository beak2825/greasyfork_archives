// ==UserScript==
// @name         Duolingo mods
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Duolingo keyboard shortcuts
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://www.duolingo.com/*
// @downloadURL https://update.greasyfork.org/scripts/392510/Duolingo%20mods.user.js
// @updateURL https://update.greasyfork.org/scripts/392510/Duolingo%20mods.meta.js
// ==/UserScript==
// constants
const home_class = '_2QyU5'
const strengthen_class = '_1_mnP _3QG2_ _1vaUe _3IS_q'
const practice_class = '_1A_Px oNqWF _3hso2 _2vmUZ _2Zh2S _1X3l0 eJd0I _3yrdh _2wXoR _1AM95 _2PUh7 H7AnT'
const discuss_class = 'uRLFE _11g-P _2yH8S _3j92s'
const untimed_class = '_3_pD1 _2ESN4 _2arQ0 _2vmUZ _2Zh2S _1X3l0 eJd0I _3yrdh _2wXoR _1AM95 _1dlWz _2gnHr _2L5kw _3Ry1f'
const test_out_class = 'cVLwd _2arQ0 _2vmUZ _2Zh2S _1X3l0 eJd0I _3yrdh _2wXoR _1AM95 _1dlWz _2gnHr _3Ry1f _2VaJD _23-CV _2arQ0 _2vmUZ _2Zh2S _1X3l0 eJd0I _3yrdh _2wXoR _1AM95 _1dlWz _2gnHr'
const start_lesson_class = 'TZE8O'
const hint_class = '_1FxPb _3RFcO _3kmYT _2vmUZ _2Zh2S _1X3l0 eJd0I _3yrdh _2wXoR _1AM95 _3lAD6 H7AnT'
const test_class = '_3Gihx'
const textarea_class = '_2MGCg _1py6s _1e69E _3_NyK _1Juqt'
const replay_audio_class = '_2GN1p _1ZlfW _2cIrv'
const choice_class = 'iNLw3'
const mouseover_character_class = '_2KZ79'
const asdfg_arr = ['a','s','d','f','g']
const qwert_arr = ['q','w','e','r','t']
const hjkl_arr  = ['h','j','k','l',';']
// variables
let last_selected_index = -1
let mouseover_active = false
// helpers
const getEls = class_name => document.getElementsByClassName(class_name)
function clickIndex(class_name, idx) {
  const els = getEls(class_name)
  if (els.length > idx) {
    els[idx].click()
    return true
  }
  return false
}
const clickFirst = class_name => clickIndex(class_name, 0)
function mouseoverCharacter(idx) {
  const mouseover_els = getEls(mouseover_character_class)
  if (idx < 0) {
    idx = mouseover_els.length - 1
  } else if (idx >= mouseover_els.length) {
    idx = 0
  }
  for (let i = 0; i < mouseover_els.length; ++i) {
    const el = mouseover_els[i]
    if (el.className == mouseover_character_class || i == idx) {
      el.click()
    }
  }
  mouseover_active = (idx !== last_selected_index)
  last_selected_index = idx
}
// core functionality
function onKey(e) {
  console.warn(e)
  const key = e.key.toLowerCase()
  if (key == '`') {
    clickFirst(textarea_class)
  } else if (key == ' ' && e.ctrlKey && !e.shiftKey) {
    clickFirst(replay_audio_class)
  } else if (key == 's') {
    clickFirst(strengthen_class) || clickFirst(practice_class) || clickFirst(untimed_class)
  } else if (key == 't') {
      clickFirst(test_class)
  } else if (key == 'h') {
      clickFirst(hint_class)
  } else if (key == 'd') {
    getEls('OzTZU')[1].click()
  } else if (key == 'r' && e.altKey) {
    clickFirst(home_class)
  } else if (key == 'tab') {
    if (e.shiftKey) {
      mouseoverCharacter(last_selected_index - 1)
    } else {
      mouseoverCharacter(last_selected_index + 1)
    }
    e.preventDefault()
  } else if (key == 'escape') {
    mouseoverCharacter(last_selected_index)
  } else if (e.keyCode >= 112 && e.keyCode <= 121) { // Fn
    const idx = e.keyCode - 112
    mouseoverCharacter(idx)
    e.preventDefault()
  } else if (e.keyCode >= 49 && e.keyCode <= 53) {
    const idx = (Number(key) + 10 - 1) % 10
    clickIndex(start_lesson_class, idx) || clickIndex(choice_class, idx)
  } else if (asdfg_arr.indexOf(key) != -1) {
    clickIndex(choice_class, asdfg_arr.indexOf(key))
  } else if (qwert_arr.indexOf(key) != -1) {
    clickIndex(choice_class, qwert_arr.indexOf(key) + 5)
  } else if (hjkl_arr.indexOf(key) != -1) {
    clickIndex(choice_class, hjkl_arr.indexOf(key) + 5)
  } else if (key == 'enter') {
      last_selected_index = -1
  } else {
      if (mouseover_active) {
        mouseoverCharacter(last_selected_index)
      }
  }
}
function startUntimed() {
  clickFirst(untimed_class)
  const els = getEls(test_out_class)
  if (els.length && els[0].innerText.includes('TEST OUT'))
      els[0].click()
}
setInterval(startUntimed, 100)
document.addEventListener('keydown', onKey)
window.localStorage["duo.session.coach_duo.last_shown_big_right_streak"] =
    window.localStorage["duo.session.coach_duo.last_shown_small_right_streak"] =
    window.localStorage["duo.session.coach_duo.last_shown_wrong_streak"] =
    Math.floor(new Date().valueOf() / 1000);