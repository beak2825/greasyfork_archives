// ==UserScript==
// @name          Likes counter for SkyScraperCity
// @name:pl       Liczydło lajków dla SkyScraperCity
// @description   Counts likes for given post.
// @description:pl Zlicza lajki pod postem.
// @version       2
// @namespace     https://github.com/skalee/ssc-grease
// @author        me
// @license       Unlicense
// @homepageURL   https://github.com/skalee/ssc-grease
// @supportURL    https://www.skyscrapercity.com/showthread.php?t=2017475
// @grant         none
// @include       https://www.skyscrapercity.com/showthread.php?*
// @include       https://www.skyscrapercity.com/showpost.php?*
// @downloadURL https://update.greasyfork.org/scripts/372768/Likes%20counter%20for%20SkyScraperCity.user.js
// @updateURL https://update.greasyfork.org/scripts/372768/Likes%20counter%20for%20SkyScraperCity.meta.js
// ==/UserScript==

(function() {
  let ready = async function() {
    let like_lists = document.querySelectorAll("div[id^='dbtech_thanks_block_'] .smallfont")

    for (list of like_lists) {
      let like_entries = list.querySelectorAll("a[href^='member.php']")
      let likes_count = like_entries.length
      let last_like = like_entries[likes_count - 1]

      if (likes_count > 0) {
        last_like.insertAdjacentHTML("afterend", ` (${likes_count} total)`)
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
