// ==UserScript==
// @name         Mailtrack.io Signature Remove
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  No Mailtrack Signature
// @author       Max Cheng
// @include      https://mail.google.com/mail/u
// @icon         https://www.google.com/s2/favicons?domain=gmail.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463026/Mailtrackio%20Signature%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/463026/Mailtrackio%20Signature%20Remove.meta.js
// ==/UserScript==

const removeSignature = () => {
  console.log("removeSingature");
  setTimeout(function () {
    console.log("timeout removeSingature");
    document.getElementsByClassName("mt-remove")[0].click();
    closeModal();
  }, 2000);
};

const closeModal = () => {
  console.log("timeout closeModal");
  setTimeout(function () {
    console.log("timeout closeModal");
    document.getElementsByClassName("modal__close")[0].click();
  }, 1000);
};

const writeEmailButton = document.getElementsByClassName("T-I T-I-KE L3")[0];
writeEmailButton.addEventListener("click", () => {
  console.log("click event");
  setTimeout(removeSignature(), 2000);
});
