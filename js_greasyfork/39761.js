// ==UserScript==
// @name         Night Mode for dsrealm
// @namespace    https://silverlinkz.net/
// @version      0.2
// @description  Create a toggleable night mode
// @author       Jsilvermist
// @match        https://dsrealm.com/table-of-contents/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/39761/Night%20Mode%20for%20dsrealm.user.js
// @updateURL https://update.greasyfork.org/scripts/39761/Night%20Mode%20for%20dsrealm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
      .__nightMode .site-branding,
      .__nightMode .site-content,
      .__nightMode .content-wrapper,
      .__nightMode .entry-title,
      .__nightMode .site-title a,
      .__nightMode .widget-title,
      .__nightMode .widget-area,
      .__nightMode .footer-widget-area a,
      .__nightMode .site-footer,
      .__nightMode .site-info,
      .__nightMode .xyz.wc-comment div,
      .__nightMode .comments-area div {
        background-color: #282828 !important;
        color: #ddd !important;
      }
      .__nightMode .wc-form-wrapper,
      .__nightMode .wpdiscuz-subscribe-bar,
      .__nightMode .wpdiscuz-front-actions {
        border: 0 !important;
      }
    `;
    document.head.appendChild(style);

    if (GM_getValue('night_mode', false)) {
        document.body.classList.add('__nightMode');
    }

    const button = document.createElement('button');
    button.textContent = 'Toggle Night Mode';
    button.classList.add('wc-cta-button');
    button.style.margin = '0 0 48px';
    button.addEventListener('click', () => {
        document.body.classList.toggle('__nightMode');
        GM_setValue('night_mode', document.body.classList.contains('__nightMode'));
    });

    document.querySelector('#primary').insertAdjacentElement('afterbegin', button);

    // button.style.margin = '16px 0 0';
    // document.querySelector('.site-branding').appendChild(button);

})();
