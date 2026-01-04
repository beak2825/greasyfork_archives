// ==UserScript==
// @name         RED Collage Subscription Quick Catchup
// @version      0.7
// @description  Catch up a collage without reloading the page.
// @author       mrpoot
// @match        https://redacted.sh/userhistory.php?action=subscribed_collages*
// @grant        none
// @namespace    https://greasyfork.org/users/148773
// @downloadURL https://update.greasyfork.org/scripts/370260/RED%20Collage%20Subscription%20Quick%20Catchup.user.js
// @updateURL https://update.greasyfork.org/scripts/370260/RED%20Collage%20Subscription%20Quick%20Catchup.meta.js
// ==/UserScript==
  
(() => {
  const catchupHandler = async (e) => {
    e.preventDefault();
  
    let { target } = e;
    const { href } = target;
  
    for(;target.tagName !== 'TABLE';) {
      target = target.parentNode;
    }
    const targetSibling = target.nextElementSibling;
  
    target.style.opacity = targetSibling.style.opacity = 0.5;
  
    await fetch(href, { credentials: 'same-origin' });
  
    target.style.display = targetSibling.style.display = 'none';
  };
  
  document.querySelectorAll('.subscribed_collages_table a[href*="action=catchup_collages"]')
    .forEach((el) => el.addEventListener('click', catchupHandler));
})();