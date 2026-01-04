// ==UserScript==
// @name             Lawline Checkpoint Verifier
// @description      Automatically acknowledges and dismisses the Lawline checkpoint verification modal without requiring user interaction
// @namespace        rplanier
// @match            https://www.lawline.com/course-center/*
// @version          1.0
// @license          MIT
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/455900/Lawline%20Checkpoint%20Verifier.user.js
// @updateURL https://update.greasyfork.org/scripts/455900/Lawline%20Checkpoint%20Verifier.meta.js
// ==/UserScript==

const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style' && mutation.target.style.display !== 'none') {
        try {
          setTimeout(() => {
            mutation.target.querySelector('button.btn').click();
            console.log('SUCCESS: Verfication checkpoint passed!');
          }, 3000);
        }
        catch(err) {
          console.log('ERROR: Verification checkpoint failed!');
        }
      }
    });
});

observer.observe(document.querySelector('.verification-checkpoint-modal'), { attributes : true, attributeFilter : ['style'], childList: false, characterData: false });