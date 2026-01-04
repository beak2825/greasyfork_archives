// ==UserScript==
// @name            Dumb Youtube lowest quality chooser
// @name:fr         Vidéos Youtube en résolution minimale par défaut
// @version         2
// @description     Auto select the lowest available quality of videos (more eco-friendly, and you can still manually select a higher resolution when needed)
// @description:fr  Choisir automatiquement la qualité minimum pour la lecture des vidéos (plus eco-friendly, avec toujours la possibilité de choisir manuellement une meilleure qualité quand nécessaire)
// @author          Les noix de coco
// @include         http://youtube.com/*
// @include         https://youtube.com/*
// @include         http://www.youtube.com/*
// @include         https://www.youtube.com/*
// @include         http://gaming.youtube.com/*
// @include         https://gaming.youtube.com/*
// @noframes
// @grant           none
// @namespace https://greasyfork.org/users/456082
// @downloadURL https://update.greasyfork.org/scripts/397564/Dumb%20Youtube%20lowest%20quality%20chooser.user.js
// @updateURL https://update.greasyfork.org/scripts/397564/Dumb%20Youtube%20lowest%20quality%20chooser.meta.js
// ==/UserScript==

(function() {

  "use strict"

  //--- USER SETTINGS

  // PREFERRED_QUALITY (string) can be set to 'lowest' (most of the time it means 144p),
  // or to a specific quality such as '240' or '360' (string without trailing 'p')
  const PREFERRED_QUALITY = 'lowest'

  //--- END OF USER SETTINGS


  function sortNumber(a, b) {
    return a - b
  }

  const DELAY = 1

  function setLowestQuality() {
    if (!window.location.href.match(/\?.*v=/)) {
      // Not a video
      return
    }
    console.log('Will try to set video quality...')
    setTimeout(() => {
      const videoSettingsButtonEl = document.querySelector('.ytp-settings-button')
      if (!videoSettingsButtonEl) {
        return
      }
      videoSettingsButtonEl.dispatchEvent(new Event('click'))

      setTimeout(() => {
        let found = false
        for (const el of document.querySelectorAll('.ytp-menuitem')) {
          if (el.textContent.match(/Qual|Calidad/)) {
            found = true
            el.dispatchEvent(new Event('click'))
            break
          }
        }
        if (!found) {
          return
        }

        setTimeout(() => {
          const qualities = {}
          for (const el of document.querySelectorAll('.ytp-menuitem')) {
            const match = el.textContent.match(/(\d+)p/)
            if (match) {
              const qualityNum = match[1]
              qualities[qualityNum] = el
            }
          }
          let qualitiesList = Object.keys(qualities).sort(sortNumber)
          console.log('Qualities (sorted):', qualitiesList)
          let quality
          if (!PREFERRED_QUALITY || PREFERRED_QUALITY === 'lowest') {
            quality = qualitiesList[0]
          } else {
            // Take the preferred quality (with a fallback to the lowest quality)
            const idx = qualitiesList.indexOf(PREFERRED_QUALITY)
            quality = idx >=0 ? qualitiesList[idx] : qualitiesList[0]
          }
          console.log(`Setting video quality to ${quality}p`)
          qualities[quality].dispatchEvent(new Event('click'))
        }, DELAY)

      }, DELAY)

    }, DELAY)
  }

  window.addEventListener("yt-navigate-finish", setLowestQuality, true)

})()
