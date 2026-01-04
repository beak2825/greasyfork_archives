// ==UserScript==
// @name         NUS e‑journals download redirect
// @version      1.4.0
// @description  e-journals download redirect for NUS students V1.4.0 (AIP sites require a manual click to avoid bot‑detection)
// @namespace    https://greasyfork.org/users/741351
// @include      *://advanced.onlinelibrary.wiley.com/*
// @include      *://onlinelibrary.wiley.com/*
// @include      *://www.nature.com/*
// @include      *://www.science.org/*
// @include      *://aip.scitation.org/*
// @include      *://journals.aps.org/*
// @include      *://pubs.acs.org/*
// @include      *://link.springer.com/*
// @include      *://www.sciencedirect.com/*
// @include      *://www.osapublishing.org/*
// @include      *://ieeexplore.ieee.org/*
// @include      *://pubs.rsc.org/*
// @include      *://iopscience.iop.org/*
// @include      *://science.sciencemag.org/*
// @include      *://www.spiedigitallibrary.org/*
// @include      *://www.cambridge.org/*
// @include      *://www.pnas.org/*
// @include      *://royalsocietypublishing.org/*
// @include      *://opg.optica.org/*
// @include      *://pubs.aip.org/*
// @author       SAPEREAUDE & ChatGPT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533286/NUS%20e%E2%80%91journals%20download%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/533286/NUS%20e%E2%80%91journals%20download%20redirect.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Do nothing if already on the proxy domain
  if (location.hostname.includes('libproxy1.nus.edu.sg')) return;

  /* ---------- Unified domain → proxy domain replacement ---------- */
  const proxify = url =>
    url.replace('advanced.onlinelibrary.wiley.com', 'advanced-onlinelibrary-wiley-com.libproxy1.nus.edu.sg')
       .replace('onlinelibrary.wiley.com',        'onlinelibrary-wiley-com.libproxy1.nus.edu.sg')
       .replace('www.nature.com',                 'www-nature-com.libproxy1.nus.edu.sg')
       .replace('www.science.org',                'www-science-org.libproxy1.nus.edu.sg')
       .replace('aip.scitation.org',              'aip-scitation-org.libproxy1.nus.edu.sg')
       .replace('journals.aps.org',               'journals-aps-org.libproxy1.nus.edu.sg')
       .replace('pubs.acs.org',                   'pubs-acs-org.libproxy1.nus.edu.sg')
       .replace('link.springer.com',              'link-springer-com.libproxy1.nus.edu.sg')
       .replace('www.sciencedirect.com',          'www-sciencedirect-com.libproxy1.nus.edu.sg')
       .replace('www.osapublishing.org',          'www-osapublishing-org.libproxy1.nus.edu.sg')
       .replace('ieeexplore.ieee.org',            'ieeexplore-ieee-org.libproxy1.nus.edu.sg')
       .replace('pubs.rsc.org',                   'pubs-rsc-org.libproxy1.nus.edu.sg')
       .replace('iopscience.iop.org',             'iopscience-iop-org.libproxy1.nus.edu.sg')
       .replace('science.sciencemag.org',         'science-sciencemag-org.libproxy1.nus.edu.sg')
       .replace('www.spiedigitallibrary.org',     'www-spiedigitallibrary-org.libproxy1.nus.edu.sg')
       .replace('www.cambridge.org',              'www-cambridge-org.libproxy1.nus.edu.sg')
       .replace('www.pnas.org',                   'www-pnas-org.libproxy1.nus.edu.sg')
       .replace('royalsocietypublishing.org',     'royalsocietypublishing-org.libproxy1.nus.edu.sg')
       .replace('opg.optica.org',                 'opg-optica-org.libproxy1.nus.edu.sg')
       .replace('pubs.aip.org',                  'pubs-aip-org.libproxy1.nus.edu.sg');

  /* ---------- Check if it is an AIP domain ---------- */
  const isAIP = /(^|\.)aip\.scitation\.org$/.test(location.hostname) ||
                /(^|\.)pubs\.aip\.org$/.test(location.hostname);

  if (isAIP) {
    /* ------- AIP: Inject a "Manual Redirect" Button ------- */
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.createElement('button');
      btn.textContent = 'Access via NUS Proxy';
      btn.style.cssText = `
        position:fixed;
        top:16px; right:16px;
        z-index:9999;
        padding:8px 12px;
        font-size:14px;
        border:none;
        border-radius:6px;
        background:#0055a6;
        color:#fff;
        cursor:pointer;
        box-shadow:0 2px 6px rgba(0,0,0,.25);
      `;
      btn.addEventListener('click', () => {
        location.href = proxify(location.href);
      });
      document.body.appendChild(btn);
    });
  } else {
    /* ------- Other publishers: Immediate Redirect ------- */
    location.href = proxify(location.href);
  }
})();