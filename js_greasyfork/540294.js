// ==UserScript==
// @name         Falcon Chat Auto Sign-In
// @description  Autofill login and submit on Falcon Chat
// @match        https://chat.falconllm.tii.ae/*
// @version 0.0.1.20251028093029
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/540294/Falcon%20Chat%20Auto%20Sign-In.user.js
// @updateURL https://update.greasyfork.org/scripts/540294/Falcon%20Chat%20Auto%20Sign-In.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const emailAddress = '';
  const userPassword = '';

  let formObserver = null;

  const fillAndSubmitForm = () => {
    const emailInputField = document.querySelector('input[type="text"][placeholder="Enter your email"]');
    const passwordInputField = document.querySelector('input[type="password"][placeholder="********"]');
    const signInSubmitButton = Array.from(document.querySelectorAll('button[type="submit"]'))
      .find(button => button.textContent.trim().toLowerCase() === 'sign in');

    if (emailInputField && passwordInputField && signInSubmitButton) {
      emailInputField.value = emailAddress;
      passwordInputField.value = userPassword;

      // Dispatch multiple events to ensure validation
      ['input', 'change', 'blur'].forEach(eventType => {
        emailInputField.dispatchEvent(new Event(eventType, { bubbles: true }));
        passwordInputField.dispatchEvent(new Event(eventType, { bubbles: true }));
      });

      setTimeout(() => signInSubmitButton.click(), 500); // Increased delay for validation

      if (formObserver) {
        formObserver.disconnect();
        formObserver = null;
      }
    }
  };

  const startFormObservation = () => {
    if (formObserver) return;

    formObserver = new MutationObserver(() => {
      const loginForm = document.querySelector('form');
      if (loginForm) {
        fillAndSubmitForm();
      }
    });

    formObserver.observe(document, { childList: true, subtree: true });
  };

  let lastKnownUrl = location.href;

  const observeUrlChanges = () => {
    new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastKnownUrl) {
        lastKnownUrl = currentUrl;

        if (currentUrl.includes('/auth')) {
          startFormObservation();
        } else if (formObserver) {
          formObserver.disconnect();
          formObserver = null;
        }
      }
    }).observe(document, { childList: true, subtree: true });
  };

  if (location.href.includes('/auth')) {
    startFormObservation();
  }

  observeUrlChanges();
})();