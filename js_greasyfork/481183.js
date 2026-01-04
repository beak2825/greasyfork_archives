// ==UserScript==
// @name        Auto Load Preferences
// @namespace   Ultrabox Scripts
// @match       https://ultraabox.github.io/
// @match       https://aurysystem.github.io/goldbox/
// @match       https://jummb.us/
// @grant       none
// @version     1.0.1
// @author      PlanetBluto
// @description Quickly load all of your preferred preferences by pressing CTRL + M
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/481183/Auto%20Load%20Preferences.user.js
// @updateURL https://update.greasyfork.org/scripts/481183/Auto%20Load%20Preferences.meta.js
// ==/UserScript==

const SETTINGS = {
  autoPlay: false,
  // autoFollow: false,
  enableNotePreview: true,
  showLetters: true,
  showFifth: true,
  notesOutsideScale: false,
  setDefaultScale: true,
  showChannels: true,
  showScrollBar: true,
  alwaysFineNoteVol: true,
  enableChannelMuting: true,
  displayBrowserUrl: true,
  displayVolumeBar: true,
  showOscilloscope: true,
  showSampleLoadingStatus: true
}

const print = console.log

var inited = false

var toggleFunc = (elem, key) => {
    elem.value = key
    elem.dispatchEvent(new Event("change"))

    print(`${key}: `, localStorage.getItem(key))
}

var int = setInterval(() => {
  var selectElem = document.querySelector(".selectContainer.menu.preferences > select")
  if (selectElem) {
    clearInterval(int)

    document.addEventListener("keydown", e => {
      if (e.which == 77 && e.ctrlKey) {
        Object.keys(SETTINGS).forEach(key => {
          localStorage.setItem(key, `${SETTINGS[key]}`)
        })

        location.reload()
      }
    })
  }
}, 10)