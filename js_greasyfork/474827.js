// ==UserScript==
// @name     Just For U Coupon Clipper
// @version  1
// @grant    none
// @include https://www.safeway.com/foru/coupons-deals.html*
// @description Clips all the coupons (09/2023) Safeway Just For U
// @namespace https://greasyfork.org/users/803889
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474827/Just%20For%20U%20Coupon%20Clipper.user.js
// @updateURL https://update.greasyfork.org/scripts/474827/Just%20For%20U%20Coupon%20Clipper.meta.js
// ==/UserScript==
  
/// While the load more button exists, load more
function loadUntilDone() {
  let buttons = document.getElementsByClassName('load-more')
  
  if (buttons.length > 0) {
    // Still a load more button. Click until it goes away
    
    console.log("Loading more coupons...")
    
    try {
      buttons[0].click()
    } catch (e) {
      console.error(e)
    }
  
  // Give it some time to load.
      setTimeout(loadUntilDone, 1000)
  } else {
    // Now find and click all the coupons
    console.log("Clicking all coupons...")
    clickAllUnclicked(document.querySelectorAll('.grid-coupon-btn'))
    
  }
}
  
/// Resolve after the given delay
async function sleep(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay)
  })
}
  
/// Click on every element in the given collection, at a sensible pace, unless alredy clicked
async function clickAllUnclicked(elems) {
  let i = elems.length
  for (i > 0; i--;) {
    let elem = elems[i];
    if (!elem.classList.contains('.grid-coupon-btn')) {
      console.log("Click coupon " + i + ": " + elem)
      elem.click()
      await sleep(100)
    }
  }
  console.log("All coupons clicked!")
}
  
// Wait for the page to load and then start collecting coupons
console.log("Waiting to load coupons")
setTimeout(loadUntilDone, 4000)