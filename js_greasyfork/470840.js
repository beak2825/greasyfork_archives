// ==UserScript==
// @name         Useless Things Series: Auto Translation Fun
// @version      1.0
// @description  Automatically translates webpages to random languages except English for fun.
// @match        *://*/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1126616
// @downloadURL https://update.greasyfork.org/scripts/470840/Useless%20Things%20Series%3A%20Auto%20Translation%20Fun.user.js
// @updateURL https://update.greasyfork.org/scripts/470840/Useless%20Things%20Series%3A%20Auto%20Translation%20Fun.meta.js
// ==/UserScript==

// Configuration
let translationProbability = 0.2; // Initial probability of translation (0.2 = 20% chance)
const translationInterval = 5000; // Time interval in milliseconds (5 seconds)

// Array of target languages (excluding English)
const targetLanguages = ['es', 'fr', 'de', 'it', 'ja', 'ko', 'pt', 'ru', 'zh-CN'];

// Function to generate a random language code
function generateRandomLanguage() {
  const randomIndex = Math.floor(Math.random() * targetLanguages.length);
  return targetLanguages[randomIndex];
}

// Function to translate the webpage
function translatePage() {
  const currentLanguage = window.navigator.language;

  if (currentLanguage.startsWith('en') && Math.random() < translationProbability) {
    const randomLanguage = generateRandomLanguage();
    const translationURL = `https://translate.google.com/translate?sl=auto&tl=${randomLanguage}&u=${window.location}`;
    window.location.href = translationURL;
  }
}

// Activate the translation at the specified interval
setInterval(() => {
  translatePage();
}, translationInterval);
