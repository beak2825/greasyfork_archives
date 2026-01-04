// ==UserScript==
// @name         Facebook no ads - Redesign 2020
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Makes sponsored feeds invisible on facebook.com
// @author       Guido & Darmikon
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411445/Facebook%20no%20ads%20-%20Redesign%202020.user.js
// @updateURL https://update.greasyfork.org/scripts/411445/Facebook%20no%20ads%20-%20Redesign%202020.meta.js
// ==/UserScript==

const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

const doHack = (feed) => {
    const title = feed
      .querySelector('[data-testid*="story"]');

    const link = title.querySelector('a');

    // trigger mouseover to check if generated href contains ads inside
    if(link) {
      const mouseoverEvent = new Event('mouseover');
      link.dispatchEvent(mouseoverEvent);
      if(link.href && link.href.contains('ads')) {
         const mouseoutEvent = new Event('mouseout');
         link.dispatchEvent(mouseoutEvent);
         return true;
      }
    }
}

const removeAdsNew = () => {
    let list = document.querySelectorAll(`[aria-label="Sponsored"],[aria-label="Book Now"],[aria-label="Learn More"],[aria-label="Shop Now"],[aria-label="Donate Now"],[aria-label="Play Now"]`);
    let list2 = Array.from(document.querySelectorAll('div[role=feed] div')).filter(el => el.textContent.indexOf('Sponsored') > -1);

    for (let el of [...list,...list2]) {
        let story = el.closest('[data-pagelet]');
        if (story) {
            story.remove();
        }
    }
}

(function() {
    const throttleKill = throttle(removeAdsNew, 50);
    throttleKill();
    window.addEventListener('scroll', throttleKill);
    window.addEventListener('resize', throttleKill);
})();