// ==UserScript==
// @name     Let Freedom Drink
// @version  1
// @description:en Let Freedom Drink - https://www.reddit.com/r/PLCB/comments/fxt0sw/let_freedom_drink_getting_around_the_plcb_website/
// @grant    none
// @run-at   document-start
// @match https://*.finewineandgoodspirits.com/*
// @match https://www.finewineandgoodspirits.com/*
// @namespace https://greasyfork.org/users/547765
// @description Let Freedom Drink - https://www.reddit.com/r/PLCB/comments/fxt0sw/let_freedom_drink_getting_around_the_plcb_website/
// @downloadURL https://update.greasyfork.org/scripts/402423/Let%20Freedom%20Drink.user.js
// @updateURL https://update.greasyfork.org/scripts/402423/Let%20Freedom%20Drink.meta.js
// ==/UserScript==

window.addEventListener('beforescriptexecute', function(e) {
  if(e.target.text.search('var limitOrders = "true";') != -1)
  {
    console.log(e.target.src)
    e.stopPropagation();
    e.preventDefault();
    $(e.target).remove();
  }
}, true)