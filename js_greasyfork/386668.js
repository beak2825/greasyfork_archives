// ==UserScript==
// @name       TVTropes Up-Shutter
// @author     Adam Novak
// @version    1.0
// @description Remove and hide the TVTropes "This is page #X you have viewed this month without ads" nag dialogs.
// @include    /https?:\/\/tvtropes.org\/*/
// @noframes
// @run-at     document-end
// @grant      none
// @namespace https://greasyfork.org/users/22981
// @downloadURL https://update.greasyfork.org/scripts/386668/TVTropes%20Up-Shutter.user.js
// @updateURL https://update.greasyfork.org/scripts/386668/TVTropes%20Up-Shutter.meta.js
// ==/UserScript==

// (C) 2019 Adam Novak
// MIT license

new MutationObserver(function(mutationsList, observer) {
  // Error reporting isn't free in userscripts
  try {
    for (let mutation of mutationsList) {
      if (mutation.type == 'childList') {
        // The dialog is the last thing in the page
        let body = document.getElementsByTagName("body")[0]
        let dialog = body.lastChild

        if (dialog.innerText.includes('without ads')) {
          // Found it
          body.removeChild(dialog)
          // We're done
          observer.disconnect()
        }
      }
    }
  } catch (e) {
  	console.error('TVTropes Up-Shutter exception: ', e)
  }
  
}).observe(document.getElementsByTagName("body")[0], {childList: true})  


