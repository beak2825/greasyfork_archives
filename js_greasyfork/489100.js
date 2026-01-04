// ==UserScript==
// @name         random string generator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  generates a random string
// @license MIT
// @author       joshclark756
// @include http://*/*
// @include https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489100/random%20string%20generator.user.js
// @updateURL https://update.greasyfork.org/scripts/489100/random%20string%20generator.meta.js
// ==/UserScript==

function getRandomString(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
}

function detectSelectedInput() {
  return document.activeElement;
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Insert') {
    const selectedInput = detectSelectedInput();
    if (selectedInput) {
      const randomString = getRandomString(10); // Change the length as needed
      selectedInput.value = randomString;
    }
  }
});