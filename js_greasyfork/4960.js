// ==UserScript==
// @name          Dailymotion Fix Sexy Images
// @namespace     http://www.SavageCabbage.com
// @description   Restores preview images of adult videos
// @include       http://www.dailymotion.com/*
// @grant         metadata
// @version       1.1
// @license       GPL
// @downloadURL https://update.greasyfork.org/scripts/4960/Dailymotion%20Fix%20Sexy%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/4960/Dailymotion%20Fix%20Sexy%20Images.meta.js
// ==/UserScript==

// Previews of adult videos in dailymotion are not working on Firefox anymore
// This script restores them, by removing the blurred class name

// Special thanks goes to David Toso and JixunMoe for tips on this script

// If you have comments and suggestions, please send feedback under 
//    https://greasyfork.org/scripts/4960-dailymotion-fix-sexy-images

/* Fixes the images in a node and all of its children */
function fixImages(target)
{
  // console.log("Fixing", target)
  var imgs = target.getElementsByTagName('img');
  for (i = 0; i < imgs.length; i++)
  {
    imgs[i].classList.remove('blurred') // this is the magic
  }
}

/* Activates fixImages for every node changed */
function handleMutations(mutations, observer) {
  mutations.forEach(function (mutation) {
    fixImages(mutation.target)
  })
}

// Create an Event Listener for changes in the page
// This is required, as the dailymotion page is not loaded at once
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(handleMutations);

observer.observe(document, {
  childList: true,
  subtree: true
})
