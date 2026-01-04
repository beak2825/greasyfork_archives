// ==UserScript==
// @name         Night Mode for Cardboard Translations
// @namespace    https://silverlinkz.net/
// @version      0.1
// @description  Create a toggleable night mode
// @author       Jsilvermist
// @match        http://cardboardtranslations.com/*
// @match        https://cardboardtranslations.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/39762/Night%20Mode%20for%20Cardboard%20Translations.user.js
// @updateURL https://update.greasyfork.org/scripts/39762/Night%20Mode%20for%20Cardboard%20Translations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
      .__nightMode {
        background-color: #444 !important;
      }
      .__nightMode #page,
      .__nightMode h1,
      .__nightMode .site-title a,
      .__nightMode .site-description,
      .__nightMode .author-title {
        background-color: #282828 !important;
        color: #ddd !important;
      }
      .__nightMode .entry-title a {
        color: #ddd;
      }
    `;
    document.head.appendChild(style);

    if (GM_getValue('night_mode', false)) {
        document.body.classList.add('__nightMode');
    }

    const button = document.createElement('button');
    button.textContent = 'Toggle Night Mode';
    button.classList.add('wc-cta-button');
    button.style.margin = '16px 0 32px';
    button.addEventListener('click', () => {
        document.body.classList.toggle('__nightMode');
        GM_setValue('night_mode', document.body.classList.contains('__nightMode'));
    });

    document.querySelector('#primary').insertAdjacentElement('afterbegin', button);

})();
