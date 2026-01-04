// ==UserScript==
// @name        Netflix subtitle cleanup
// @namespace   Violentmonkey Scripts
// @match       https://www.netflix.com/*
// @grant       none
// @version     1.4
// @author      Einar Lielmanis, einars@spicausis.lv
// @license     MIT
// @description Remove all "[inhales]", "[loud noise]" from the subtitles
// @downloadURL https://update.greasyfork.org/scripts/411038/Netflix%20subtitle%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/411038/Netflix%20subtitle%20cleanup.meta.js
// ==/UserScript==

let observed_node = undefined

let kill_song_lyrics = false

const cleanup = (t) => {
  if (kill_song_lyrics && t.includes('♪')) {
    return '' // ignore song lyrics
  } else if (t.includes('[') && t.includes(']')) {
    return t.replace(/(- *)?\[[^\]]+\]/g, '') // (maybe "- ") "[" .. (not "]")+ .. "]"
  } else if (t.includes('(') && t.includes(')')) {
    return t.replace(/(- *)?\([^\)]+\)/g, '') // (maybe "- ") "(" .. (not ")")+ .. ")"
  }

  return t
}

const on_mutated = (changes) => {
  const ts = observed_node.querySelectorAll('.player-timedtext-text-container span')
  for (let i = 0; i < ts.length; i++) {
    
    const t = ts[i].innerHTML
    const nt = cleanup(t)
    
    if (nt !== t) {
      ts[i].innerHTML = nt
      // console.log({ original: t, filtered: nt })
    }
  }
}

const observer = new MutationObserver(on_mutated)

const reobserve = () => {
  const elems = document.getElementsByClassName('player-timedtext')
  if (elems[0] !== undefined) {
    if (observed_node !== elems[0]) {
      observed_node = elems[0]
      console.log({ observed_node })
      observer.observe(observed_node, { childList: true, subtree: true})
    }
  }
  window.setTimeout(reobserve, 1000)
}


const run_tests = () => {
  // the tests are lightning fast, so just do run them quickly on every script startup
  const test_cleanup = (source, expected) => {
    console.assert(cleanup(source) === expected, { test_result: false, source, expected, actual: cleanup(source) })
  }
  test_cleanup('normal text', 'normal text')
  test_cleanup('[coughs]', '')
  test_cleanup('[coughs] yeah', ' yeah')
  test_cleanup('-[coughs]', '')
  test_cleanup('- [coughs]', '')
  test_cleanup('- (inhales)', '')
  test_cleanup('some ♪ singing', '')
  console.log('tests ok')
}


console.log('Netflix subtitle filter userscript starting up')
run_tests()
reobserve()
