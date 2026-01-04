// ==UserScript==
// @name             ABA Journal Modal Blocker
// @description      Dismiss subscription modal pop-up on ABA Journal articles
// @namespace        rplanier
// @match            https://www.abajournal.com/magazine/article/*
// @version          1.0
// @license          MIT
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/455883/ABA%20Journal%20Modal%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/455883/ABA%20Journal%20Modal%20Blocker.meta.js
// ==/UserScript==

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.classList.contains('tp-modal-open')) {
        try {
          mutation.target.classList.remove('tp-modal-open');
          mutation.target.querySelector('.tp-modal').remove();
          mutation.target.querySelector('.tp-backdrop').remove();
          console.log('SUCCESS: Subscription modal removed by ABA Journal Modal Blocker script!')
        }
        catch (err) {
          console.log('ERROR: Failed to remove subscription modal!');
        }


      }
    });
});

observer.observe(document.querySelector('body'), { attributes : true, attributeFilter : ['class'], childList: false, characterData: false });