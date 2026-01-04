// ==UserScript==
// @name         YouTube ID/Age Verification Warning (Animated, YouTube-Styled, White Text)
// @namespace    https://greasyfork.org/en/users/yourname
// @version      1.4
// @description  Shows an animated YouTube-themed warning about AI-powered age/ID verification on YouTube
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545634/YouTube%20IDAge%20Verification%20Warning%20%28Animated%2C%20YouTube-Styled%2C%20White%20Text%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545634/YouTube%20IDAge%20Verification%20Warning%20%28Animated%2C%20YouTube-Styled%2C%20White%20Text%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Inject MDL CSS
  const mdlCSS = document.createElement('link');
  mdlCSS.rel = 'stylesheet';
  mdlCSS.href = 'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css';
  document.head.appendChild(mdlCSS);

  // Add custom YouTube-red animation and style
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeScaleIn {
      0% { opacity: 0; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1); }
    }
    dialog#ytIDWarningDialog {
      border: none;
      border-radius: 8px;
      padding: 24px;
      max-width: 450px;
      width: 90%;
      background-color: #282828;
      color: #FFFFFF;
      animation: fadeScaleIn 0.5s ease-out;
    }
    dialog#ytIDWarningDialog * {
      color: #FFFFFF !important; /* Force all text to white */
    }
    .mdl-dialog__title {
      font-size: 1.4em;
      margin-bottom: 16px;
      color: #FF0000 !important; /* Title stays YouTube red */
    }
    .mdl-dialog__content p {
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 1.5;
    }
    .mdl-button--colored {
      background-color: #FF0000 !important;
      color: #FFFFFF !important;
    }
    .mdl-dialog__actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
  `;
  document.head.appendChild(style);

  // Inject dialog polyfill (if needed)
  const polyfillJS = document.createElement('script');
  polyfillJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/dialog-polyfill/0.5.6/dialog-polyfill.min.js';
  document.head.appendChild(polyfillJS);

  polyfillJS.onload = function () {
    // Build the warning dialog
    const dialog = document.createElement('dialog');
    dialog.id = 'ytIDWarningDialog';
    dialog.innerHTML = `
      <h4 class="mdl-dialog__title">YouTube ID/Age Verification Alert</h4>
      <div class="mdl-dialog__content">
        <p>
          YouTube is testing a new AI-driven age verification system in the U.S., which may restrict mature video access based on behavior, account age, and viewing habits.
        </p>
        <p>
          If the system misclassifies you as under 18—even if your account is decades old—you may be prompted to verify your age using a government ID, credit card, or selfie.
        </p>
        <p>
          This is currently a trial for a small number of users, starting around August 13, 2025.
        </p>
      </div>
      <div class="mdl-dialog__actions">
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="proceedBtn">
          I Understand
        </button>
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="verifyBtn">
          Go to ID Verification
        </button>
      </div>
    `;
    document.body.appendChild(dialog);

    if (!dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }

    // Show popup after slight delay
    setTimeout(() => dialog.showModal(), 1000);

    // Button actions
    dialog.addEventListener('click', e => {
      if (e.target.id === 'proceedBtn') {
        dialog.close();
      } else if (e.target.id === 'verifyBtn') {
        window.open('https://myaccount.google.com/identity-document/submit', '_blank');
      }
    });
  };
})();
