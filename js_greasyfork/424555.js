// ==UserScript==
// @name              BJ's Wholesale Club Coupon Clicker
// @namespace         bjs-wholesale-coupon
// @version           1.4
// @description       Click all the coupons on BJ's Wholesale Club website
// @author            sleevetrick
// @match             https://www.bjs.com/myCoupons*
// @downloadURL https://update.greasyfork.org/scripts/424555/BJ%27s%20Wholesale%20Club%20Coupon%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/424555/BJ%27s%20Wholesale%20Club%20Coupon%20Clicker.meta.js
// ==/UserScript==
// Donations not required, but gladly appreciated via https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=lexlieberman@gmail.com&item_name=Greasy+Fork+for+BJs+CC

// Track total clippings between loads
var total_clipped = 0;

// Conduct coupon clipping
function clipCoupons(current_coupon_index, coupon_element_list){

    if (total_clipped === undefined) {
        total_clipped = 0;
    }

    // Retrieve the maximum count of coupons
    var maximum_count_of_coupons = document.querySelectorAll('[data-auto-data="coupon_categoryFilteredCouponCnt"]')[0].lastChild.innerHTML.replaceAll(" Coupons","");

    // Auto refresh the page if there are issues with auto-scrolling
    if (current_coupon_index > maximum_count_of_coupons || current_coupon_index > 40) {
        window.scrollTo(0, 0);
        location.href = "https://www.bjs.com/myCoupons" + "?clipped=" + total_clipped;
    }

    // Select all the coupons that still need clipping and scroll a bit
    coupon_element_list = document.querySelectorAll('[data-auto-data="coupon_ClipToCard"]');
    window.scrollBy(0,80);

   // If there are no coupons left to clip
   if (maximum_count_of_coupons == 0) {

       if (current_coupon_index > 0) {
          alert("You auto-clipped at least ["+total_clipped+"] coupons! Please consider a donation: https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=lexlieberman@gmail.com&item_name=Greasy+Fork+for+BJs+CC");
      } else {
          console.log("No coupons to clip");
      }
   } else if (coupon_element_list == "undefined") {
      alert("Alert developer to fix due to BJ's code change");
   } else {
       coupon_element_list[0].click();
       total_clipped++;
       current_coupon_index++;
       console.log("Clipping Coupon #" + total_clipped);
       setTimeout(()=>{
           clipCoupons(current_coupon_index, coupon_element_list);
       }, 1000)
   } 
}

// Loads the initial coupon clipping
function loadFrame() {
    total_clipped = parseInt(new URLSearchParams(window.location.search).get('clipped'));
    if (isNaN(total_clipped)) {
        total_clipped = 0;
    }
    console.log('Beginning Coupon Clipping...!');
    clipCoupons(0, "undefined");
};

// After the window loads, begin loading the coupon clipping
window.onload = setTimeout(loadFrame, 5000);