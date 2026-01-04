// ==UserScript==
// @name         Geoguessr PAX
// @namespace    http://tampermonkey.net/
// @author       BrainyGPT
// @version      1.3
// @description  Official Pax Script
// @match        https://www.geoguessr.com/*
// @icon         https://i.imgur.com/IG8yPEV.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542731/Geoguessr%20PAX.user.js
// @updateURL https://update.greasyfork.org/scripts/542731/Geoguessr%20PAX.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const backgroundUrl = 'https://i.imgur.com/dISPMht.png';
  const customLogoUrl = 'https://i.imgur.com/wTOKwPC.png';

  const customStyles = `
    /* 1. Custom Background */
    .overlay_backdrop__ueiEF,
    .views_activeRoundWrapper__1_J5M {
      background-image: url('${backgroundUrl}') !important;
      background-position: center !important;
      background-size: cover !important;
      background-repeat: no-repeat !important;
    }

    /* 1b. Custom Background for Academy */
    .background_wrapper__BE727 {
      background-image: url('${backgroundUrl}') !important;
      background-position: center !important;
      background-size: cover !important;
      background-repeat: no-repeat !important;
    }


    /* 2. Primary Button Gradient for all except perform-guess */
    button.button_variantPrimary__u3WzI:not([data-qa="perform-guess"]) {
      background: linear-gradient(to bottom, #ff73b9, #6e52fa) !important;
      color: white !important;
      border: 0px solid #9e70ff !important;
      transition: all 0.3s ease !important;
    }

    button.button_variantPrimary__u3WzI:not([data-qa="perform-guess"]):hover {
      filter: brightness(1.1) !important;
    }

    /* 3. Spectate Circular Button with Outer Transparent Border & Inner Ring */
    .spectate-map_toggle__4u4XN button {
      background-color: #e28cff !important;
      border: none !important;
      border-radius: 50% !important;
      padding: 10px !important;
      width: 48px !important;
      height: 48px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow:
        0 0 0 6px rgba(178, 140, 255, 0.2),
        inset 0 0 12px 5px #7a55cc;
      transition: all 0.3s ease !important;
    }

    .spectate-map_toggle__4u4XN button:hover {
      filter: brightness(1.1) !important;
    }

    .spectate-map_toggle__4u4XN button img {
      filter: none !important;
      color: white !important;
      background: none !important;
    }

    .round-score-screen_hotkey__0sRwr,
    .hotkey-indicator_root__wE__d,
    .tooltip_tooltip__3D6bz,
    .status-section_introMessage__zvX6H,
    .notification-dot_wrapper__qe_8l {
      display: none !important;
    }
  `;

  const styleElem = document.createElement('style');
  styleElem.textContent = customStyles;
  document.head.appendChild(styleElem);

  /* 4. Mode Label Color Updates */
  const updateModeColor = () => {
    const labels = document.querySelectorAll('.views_roundMultiplier__iQZZW label');
    labels.forEach(label => {
      const text = label.textContent.trim();
      if (text === 'Moving') {
        label.style.color = '#79ed61';
      } else if (text === 'No Move') {
        label.style.color = '#ffc31f';
      } else if (text === 'NMPZ') {
        label.style.color = '#ff4557';
      }
    });
  };

  const observer = new MutationObserver(updateModeColor);
  observer.observe(document.body, { childList: true, subtree: true });
  updateModeColor();

  /* 5. Change "Host a party" text to "PAX AUSTRALIA" */
  const replaceHostPartyText = () => {
    const headline = document.querySelector('h1.headline_heading__2lf9L');
    if (headline && headline.textContent.trim().toLowerCase() === 'host a party') {
      headline.textContent = 'PAX AUSTRALIA';
    }
  };

  replaceHostPartyText();
  new MutationObserver(replaceHostPartyText).observe(document.body, { childList: true, subtree: true });

  /* 6. Replace GeoGuessr Logo with Custom Image and fix aspect ratio */
  const replaceLogoImage = () => {
    const logo = document.querySelector('img.header-logo_logoImage__TKbvf');
    if (logo) {
      logo.src = customLogoUrl;
      logo.srcset = '';
      logo.style.width = 'autopx';
      logo.style.height = 'auto';
      logo.style.objectFit = 'contain';
    }
  };

  replaceLogoImage();
  new MutationObserver(replaceLogoImage).observe(document.body, { childList: true, subtree: true });
})();
