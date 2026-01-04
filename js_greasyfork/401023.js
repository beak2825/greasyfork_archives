// ==UserScript==
// @name     Constantly reload Credit Karma Tax dashboard to prevent timeout
// @description Constantly reloads the Credit Karma Tax dashboard to prevent the site from logging you out while you are entering data. Open https://tax.creditkarma.com/r/dashboard#income in another tab and it will refresh every minute.
// @version  1
// @grant    none
// @include https://tax.creditkarma.com/r/dashboard#income
// @namespace https://greasyfork.org/users/22981
// @downloadURL https://update.greasyfork.org/scripts/401023/Constantly%20reload%20Credit%20Karma%20Tax%20dashboard%20to%20prevent%20timeout.user.js
// @updateURL https://update.greasyfork.org/scripts/401023/Constantly%20reload%20Credit%20Karma%20Tax%20dashboard%20to%20prevent%20timeout.meta.js
// ==/UserScript==

let TARGET_PAGE = "https://tax.creditkarma.com/r/dashboard#income"

if (window.location == "https://tax.creditkarma.com/r/dashboard#income") {
	// We are on the dashboard. No forms here; safe to periodically reload.
  console.log('Reloading in 60 seconds to keep session alive')
  window.setTimeout(() => {
    // Every 60 seconds, reload
    if (window.location == "https://tax.creditkarma.com/r/dashboard#income") {
      // But make sure we are on the right page; other pages are loaded into the dashboard page dynamically.
      console.log('Reloading now to keep session alive')
      window.location.reload()
    } else {
      console.log('Left dashboard. Not reloading.')
    }
  }, 60 * 1000)
}
