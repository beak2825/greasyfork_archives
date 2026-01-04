// ==UserScript==
// @name Paypal Offer Cliper
// @include     https://www.paypal.com/offers/*
// @description Clip all the offers on Paypal (as of 04/05/2025).
// @version 1.2
// @namespace https://greasyfork.org/users/864548
// @downloadURL https://update.greasyfork.org/scripts/532028/Paypal%20Offer%20Cliper.user.js
// @updateURL https://update.greasyfork.org/scripts/532028/Paypal%20Offer%20Cliper.meta.js
// ==/UserScript==
 
// While the load more button exists, load more
function loadUntilDone() {
    let buttons = document.querySelectorAll('[data-cy^="tertiary_card_list__show_more_button"]')
 
    if (buttons.length > 0) {
        // Still a load more button. Click until it goes away
        console.log("Loading more offer...")
 
        try {
            buttons[0].click()
        } catch (e) {
            console.error(e)
        }
 
        // Give it some time to load.
        setTimeout(loadUntilDone, 5000)
    } else {
        // Now find and click all the coupons
        console.log("Clicking all coupons...")
        clickAllUnclicked(document.querySelectorAll('[data-cy^="base_offer_card__auto_save"]'))
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
    for (let i = 0; i < elems.length; i++) {
        let elem = elems[i];
        console.log("Click element " + i + ": " + elem)
        elem.click()
        await sleep(400)
    }
    console.log("All coupons clicked!")
}
 
// Wait for the page to load and then start collecting coupons
console.log("Waiting to load offers")
setTimeout(loadUntilDone, 5000)