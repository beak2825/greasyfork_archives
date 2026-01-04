// ==UserScript==
// @name         Steam Screenshots Hider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make all your screenshots is private in Steam
// @author       You
// @match        **://steamcommunity.com/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391874/Steam%20Screenshots%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/391874/Steam%20Screenshots%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let triggerBtn = 'q'

    // Main event, by button click starts the screenshots hidding
    window.addEventListener('keypress', event => {
      if(event.key === triggerBtn) {
          console.log('Starting!')
          scrollDown()
      }

      console.log(event)
    })

    // Check if we are at the end of the page
    function scrolledThoroughly() {
      const el = document.querySelector('html')
      const steamLoadingBoolean = document.getElementById('action_wait').style.display === 'none'
      if(el.scrollTop == el.scrollHeight - el.clientHeight === true && steamLoadingBoolean === true) return true
      return false
    }

    // Open settings menu
    function openSettingsMenu() {
      // Check if settings open
      const settingsOpenBtn = document.getElementById('ScreenshotManagementToggle')
      const hasClass = settingsOpenBtn.classList.contains('screenshotManagementToggleUp')
      // If opened, exit
      if(hasClass === true) return void 0
      // If closed, opening
      settingsOpenBtn.click()
    }

    // Function for page scrolldown
    function scrollDown() {
      // Function which does scroll on page
      let scrollFunc = function() {
          if(scrolledThoroughly() === true) {
            // Creating setTimeout which fixes case when the page was not scrolled to the end, but the browser considered that it was scrolled to the end
            setTimeout(() => {
              window.scrollBy(0, 1000)
              if(scrolledThoroughly() === true) {
                  // Creating setInterval for get of all setIntervals in page
                  let interval_ids = setInterval(function () {})
                  // Clearing all setIntervals
                  while (interval_ids--) clearInterval(interval_ids)
                  // Console output
                  console.log('Page is successfully scrolled')
                  const screenshotsCount = document.querySelectorAll('.imgWallHover').length
                  const message = "Are you sure you want to hide screenshots?"
                  if(window.confirm(message)) {
                    openSettingsMenu()
                    // Calling function which will choose all screenshots
                    setTimeout(setScreenShots, 300)
                    // Making them private
                    setTimeout(setPrivate, 600)
                    // Clearing all timeouts
                    setTimeout(() => {
                      let timeout_ids = setTimeout(function () {})
                      while (timeout_ids--) clearTimeout(timeout_ids)
                    }, 602)
                  }
              }
            }, 300)
          }
          window.scrollBy(0, 1000)
      }
      // Call scroll function by interval (100 ms)
      functionInterval(scrollFunc, 100)
    }

    // Tool function for call function by interavl
    function functionInterval(func, seconds = 500) {
      if(typeof func !== 'function') return void 0
      const intervalRoot = setInterval(() => func(), seconds)
    }

    // Choose all screenshots on the page
    function setScreenShots() {
      const screenshotsCollection = document.querySelectorAll("[id*='imgWallHover']")
      screenshotsCollection.forEach((el) => el.click())
    }

    // Steam function which will made your screenshots is private
    function setPrivate() {
      ConfirmBatchAction('private')
      return void 0
    }

})();