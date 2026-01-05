// ==UserScript==
// @name        mmmturkeybacon Color Coded Search with Checkpoints
// @author      mmmturkeybacon
// @description This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser.
//              it's Turkopticon ratings. Changes the color of the reward amount to 
//              match the color of the Turkopticon rating for pay. Adds colored
//              checkboxes to show/hide HITs by color rating. Adds a gray checkbox
//              to show only HITs for which you are not qualified. Changes the
//              background color of the HIT title and link to white for Master's HITs.
//              Changes the color of HITs for which you are not qualified to a darker
//              gray. Changes the color of visited links to black. Automatically clicks
//              "Show all details".
//              Adds checkboxes next to HIT links so that you can set a checkpoint.
//              A checkpoint will notify you that you've already seen a HIT by
//              changing the HIT link to display the date the checkpoint was set. A
//              well-placed checkpoint is useful when browsing HITs by creation date
//              (newest first) because it will alert you that you've already seen the
//              checkpoint HIT and probably all the HITs that come after it.
//              It's best to place a checkpoint on a HIT that won't be recreated
//              because recreated HITs jump to the first page.
//              This script is not a substitute for actually reading Turkopticon reviews.
// @namespace   http://userscripts.org/users/523367
// @match       https://*.mturk.com/mturk/viewhits*
// @match       https://*.mturk.com/mturk/findhits*
// @match       https://*.mturk.com/mturk/sorthits*
// @match       https://*.mturk.com/mturk/searchbar*
// @match       https://*.mturk.com/mturk/viewsearchbar*
// @match       https://*.mturk.com/mturk/sortsearchbar*
// @match       https://*.mturk.com/mturk/preview?*
// @match       https://*.mturk.com/mturk/return*
// @version     3.3.0.1
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/2716/mmmturkeybacon%20Color%20Coded%20Search%20with%20Checkpoints.user.js
// @updateURL https://update.greasyfork.org/scripts/2716/mmmturkeybacon%20Color%20Coded%20Search%20with%20Checkpoints.meta.js
// ==/UserScript==
