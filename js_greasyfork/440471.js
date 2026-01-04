// ==UserScript==
// @name         TankiChatRight
// @version      0.1
// @description  Moves the tanki chat icon back to the right position
// @author       NotLordElias
// @match        https://*.tankionline.com/*
// @namespace https://greasyfork.org/users/855411
// @downloadURL https://update.greasyfork.org/scripts/440471/TankiChatRight.user.js
// @updateURL https://update.greasyfork.org/scripts/440471/TankiChatRight.meta.js
// ==/UserScript==

(() => {
  document.body.insertAdjacentHTML('beforeend', `
		<style id="customcss2">
            /* Old design stuff */
            [data-style*="AnnouncementHomeScreenComponentStyle-mainContainer"] {
              bottom: unset;
              top: 20em;
            }
            [data-style*="FooterComponent-chatButton"] {
              margin-bottom: 1.5em;
              right: 1em;
            }
		</style>
        `);

  const frameLoop = () => {
    requestAnimationFrame(() => frameLoop());

    /* Move chat button to the right (style above) */
    const chatButton = document.querySelector('ul [data-style*="FooterComponent-chatButton"]');
    // Is false because it searches for the chat button inside a ul element
    if(chatButton) {
      chatButton.parentElement.insertAdjacentElement('afterend', chatButton);
    }
  };
  frameLoop();
})();
