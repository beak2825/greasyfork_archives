// ==UserScript==
// @name            wikiFeet Dark Theme
// @name:de         wikiFeet Dark Theme
// @name:fr         wikiFeet Dark Theme
// @name:it         wikiFeet Dark Theme
// @author          iXXX94
// @namespace       https://sleazyfork.org/users/809625-ixxx94
// @icon            https://www.google.com/s2/favicons?sz=64&domain=wikifeet.com
// @description     Enable dark theme on wikiFeet
// @description:de  Aktivieren Sie das dunkle Thema auf wikiFeet
// @description:fr  Activer le thème sombre sur wikiFeet
// @description:it  Abilita il tema scuro su wikiFeet
// @copyright       2021, iXXX94 (https://sleazyfork.org/users/809625-ixxx94)
// @license         MIT
// @version         1.2.0
// @homepageURL     https://greasyfork.org/scripts/431539-wikifeet-dark-theme
// @homepage        https://greasyfork.org/scripts/431539-wikifeet-dark-theme
// @supportURL      https://greasyfork.org/scripts/431539-wikifeet-dark-theme/feedback
// @require         https://cdn.jsdelivr.net/npm/js-cookie@3.0.1
// @match           *://*.wikifeet.com/*
// @run-at          document-start
// @inject-into     page
// @downloadURL https://update.greasyfork.org/scripts/431539/wikiFeet%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/431539/wikiFeet%20Dark%20Theme.meta.js
// ==/UserScript==

/* global Cookies */

(() => {
  const darkCookie = document.cookie.split(';').some((item) => item.includes('dark=true'))

  if (!darkCookie) {
    Cookies.set('dark', true)

    window.location.reload(false)
  }
})()
