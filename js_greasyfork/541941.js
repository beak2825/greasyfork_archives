// ==UserScript==
// @name         Cartel Empire - No Education Warning Message
// @namespace    baccy.ce
// @version      0.1.1
// @description  Shows a message if there is no univeristy book icon
// @author       Baccy
// @match        https://*.cartelempire.online/*
// @icon         https://cartelempire.online/images/icon-white.png
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541941/Cartel%20Empire%20-%20No%20Education%20Warning%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/541941/Cartel%20Empire%20-%20No%20Education%20Warning%20Message.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createMessage(text) {
        const element = document.querySelector('#mainBackground .container .row')
        const wrapper = document.createElement('div');
        wrapper.className = 'mb-4 card border-success statusAlertBox';
        wrapper.style.cssText = 'background: #2b3035;';
        wrapper.innerHTML = `
            <div class="card-body text-center" style="background: #2b3035;">
                <p class="card-text fw-bold text-white">${text}</p>
                <a href="/University">Click Here</a>
            </div>
        `;
        element.prepend(wrapper);
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('li.eventIcon.statusIcon')) {
            obs.disconnect();
            if (!document.querySelector('li.educationIcon.statusIcon')) createMessage('You do not have an active education course.');
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
