// ==UserScript==
// @name        Auto code viewer for Github (for mobile users)
// @namespace   https://myanimelist.net/profile/kyoyatempest
// @match       https://github.com/*/*
// @version     1.1
// @author      kyoyacchi
// @description Auto clicks "View code" on Github repositories. Useful for mobile users.
// @license     gpl-3.0
// @icon        https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://github.com&size=64
// @downloadURL https://update.greasyfork.org/scripts/454253/Auto%20code%20viewer%20for%20Github%20%28for%20mobile%20users%29.user.js
// @updateURL https://update.greasyfork.org/scripts/454253/Auto%20code%20viewer%20for%20Github%20%28for%20mobile%20users%29.meta.js
// ==/UserScript==
window.onload = function () {
let code = document.querySelector(".py-2.px-3.width-full.d-block.btn-link.js-details-target")

if (code) {
  code.click()
} else return

}