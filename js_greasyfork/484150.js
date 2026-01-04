// ==UserScript==
// @name            Crunchyroll Set Default Language
// @name:de         Crunchyroll Set Default Language
// @namespace       http://tampermonkey.net/
// @version         0.1.4
// @description     Select default language for Crunchyroll and always redirect to the correct language. Useful if you click on Crunchyroll links other than your language.
// @description:de  Wähle die Standardsprache für Crunchyroll aus, um die Seite immer auf die richtige Sprache umzuleiten. Nützlich, wenn auf Crunchyroll-Links in einer anderen als der Standardsprache geklickt werden.
// @author          Lolen10
// @match           https://www.crunchyroll.com/*
// @grant           none
// @license         GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/484150/Crunchyroll%20Set%20Default%20Language.user.js
// @updateURL https://update.greasyfork.org/scripts/484150/Crunchyroll%20Set%20Default%20Language.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // User-configuration
    // Change this variable according to the desired language name
    // All options are listed below
    const selectedLanguage = 'german';

    // -------------------Normally no changes need to be made below this line--------------------

    // Language codes for various options
    const languageCodes = {
        german: '/de',
        english: '',
        arabic: '/ar',
        spanish: '/es',
        spanishSpain: '/es-es',
        french: '/fr',
        italian: '/it',
        portugueseBrazil: '/pt-br',
        portuguesePortugal: '/pt-pt',
        russian: '/ru',
        hindi: '/hi'
    };

    // Function to check and redirect
    function checkAndRedirect() {
        if (selectedLanguage !== 'english') {
          // Check if the selected language is present in the URL
          if (!window.location.href.includes(languageCodes[selectedLanguage])) {
              // Extract the path and remove any incorrect language code
              let path = window.location.pathname.replace(/\/[a-z]{2}(-[a-z]{2})?(?=\/|$)/, '');
              window.location.href = `https://www.crunchyroll.com${languageCodes[selectedLanguage]}${path}`;
          }
        }else{
          // For english: Check if there is a language code in the URL. If yes: remove it, if no: skip it.
          if (window.location.pathname.match(/\/[a-z]{2}(-[a-z]{2})?(?=\/|$)/)) {
              let path = window.location.pathname.replace(/\/[a-z]{2}(-[a-z]{2})?(?=\/|$)/, '');
              window.location.href = `https://www.crunchyroll.com${path}`;
          }
        }
    }

    // Perform the check on page load.
    checkAndRedirect();

})();