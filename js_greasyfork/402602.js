// ==UserScript==
// @name         Wanikani s2speak
// @namespace    http://polvcode.dev/
// @version      0.1.1
// @description  Highlight the text, and press s to speak, anywhere on the website
// @author       Pacharapol Withayasakpunt
// @match        https://*.wanikani.com/*
// @require      https://cdn.jsdelivr.net/npm/xregexp@4.3.0/xregexp-all.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402602/Wanikani%20s2speak.user.js
// @updateURL https://update.greasyfork.org/scripts/402602/Wanikani%20s2speak.meta.js
// ==/UserScript==

(function () {
  window.addEventListener("keydown", (ev) => {
    if (ev.code === 'KeyS') {
        const lang = 'ja'
        const s = window.getSelection().toString();
        if (s && XRegExp('[\\p{Han}\\p{Hiragana}\\p{Katakana}]').test(s)) {
          speak(s, lang);
        }
    }
  });

  const allVoices = {}
  speechSynthesis.getVoices().map(v => {
    allVoices[v.lang] = v.lang
  })
  speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices().map(v => {
      allVoices[v.lang] = v.lang
    })
  }

  function speak (s, lang) {
    const voices = Object.keys(allVoices)
    const stage1 = () => voices.filter((v) => v === lang)[0]
    const stage2 = () => {
      const m1 = lang.substr(0, 2)
      const m2 = lang.substr(3, 2)
      const r1 = new RegExp(`^${m1}[-_]${m2}`, 'i')
      return voices.filter((v) => r1.test(v))[0]
    }
    const stage3 = () => {
      const m1 = lang.substr(0, 2).toLocaleLowerCase()
      return voices.filter((v) => v.toLocaleLowerCase().startsWith(m1))[0]
    }

    lang = stage1() || stage2() || stage3() || ''

    if (lang) {
      const utterance = new SpeechSynthesisUtterance(s)
      utterance.lang = lang
      speechSynthesis.speak(utterance)
    }
  }
})()