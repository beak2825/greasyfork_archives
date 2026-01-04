// ==UserScript==
// @name             Law Insider Modal Blocker
// @description      Dismiss subscription modal pop-up on Law Insider articles
// @namespace        rplanier
// @match            https://www.lawinsider.com/contracts/*
// @match            https://www.lawinsider.com/clause/*
// @version          1.0
// @license          MIT
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/455887/Law%20Insider%20Modal%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/455887/Law%20Insider%20Modal%20Blocker.meta.js
// ==/UserScript==

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.classList.contains('mdc-dialog-scroll-lock')) {
        try {
        mutation.target.classList.remove('mdc-dialog-scroll-lock');
        mutation.target.querySelector('.mdc-dialog').remove();
        console.log('SUCCESS: Subscription modal removed by Law Insider Modal Blocker script!')
        }
        catch (err) {
          console.log('ERROR: Failed to remove subscription modal!');
        }
      }
    });
});

observer.observe(document.querySelector('body'), { attributes : true, attributeFilter : ['class'], childList: false, characterData: false });