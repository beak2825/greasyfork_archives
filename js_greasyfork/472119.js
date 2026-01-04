// ==UserScript==
// @name          Show Password on MouseOver
// @namespace     MickyFoley
// @description   Show password when mouseover a password field
// @version       1.1
// @author        MickyFoley
// @license       free
// @include       *
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/472119/Show%20Password%20on%20MouseOver.user.js
// @updateURL https://update.greasyfork.org/scripts/472119/Show%20Password%20on%20MouseOver.meta.js
// ==/UserScript==

(function() {
  function showPassword(event) {
    const target = event.target;
    if (target.matches('input[type="password"]')) {
      target.type = 'text';

      // Use MutationObserver to prevent interference
      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.attributeName === 'type' && target.type !== 'text') {
            target.type = 'text';
          }
        }
      });

      observer.observe(target, { attributes: true });

      const restoreType = () => {
        observer.disconnect();
        target.type = 'password';
        target.removeEventListener('mouseleave', restoreType);
      };

      target.addEventListener('mouseleave', restoreType, { once: true });
    }
  }

  document.addEventListener('mouseover', showPassword, true);
})();
