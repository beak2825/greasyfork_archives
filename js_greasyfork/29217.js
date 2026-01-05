// ==UserScript==
// @name         Wanikani Hide Review %
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides the review percentages when you're done with reviews, and when you go to the /review page. 
//               Still shows total number answered correctly and incorrectly.
// @author       cavellis
// @include     http://www.wanikani.com/review/session*
// @include     https://www.wanikani.com/review/session*
// @include     http://www.wanikani.com/review*
// @include     https://www.wanikani.com/review*
// @grant       GM_addStyle
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/29217/Wanikani%20Hide%20Review%20%25.user.js
// @updateURL https://update.greasyfork.org/scripts/29217/Wanikani%20Hide%20Review%20%25.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function hidePercent()
{
    // % during the review
    var reviewPcnt = document.getElementById('correct-rate');
    if(reviewPcnt != null)
    {
        reviewPcnt.style.display = 'none';
    }
    // % shown on the summary page, when the reviews are done
    var summaryPcnt = document.getElementById('review-stats-answered-correctly');
    console.log('summary %? ' + summaryPcnt);
    if(summaryPcnt != null)
    {
        summaryPcnt.style.display = 'none';
    }
}

function scriptInit()
{
  // Set up hooks
  try {
    hidePercent();
  } catch (err) {
    // do nothing
  }
}

/*
 * Start the script
 */
 
scriptInit();