// ==UserScript==
// @name         Email Crawler TrangVang
// @namespace    http://github.com/DemonDucky
// @version      1.0.0
// @description  Crawl email from TrangVang
// @author       DemonDucky
// @match        https://trangvangvietnam.com/*
// @match        https://www.trangvangvietnam.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trangvangvietnam.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504481/Email%20Crawler%20TrangVang.user.js
// @updateURL https://update.greasyfork.org/scripts/504481/Email%20Crawler%20TrangVang.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractCompaniesInfo(parentElement) {
    const companies = parentElement.querySelectorAll('.w-100.h-auto.shadow.rounded-3.bg-white');
    const result = [];

    companies.forEach((company) => {
      const nameElement = company.querySelector('h2.fs-5 a');
      const emailElement = company.querySelector('a[href^="mailto:"]');

      if (nameElement && emailElement) {
        const name = nameElement.textContent.trim();
        const email = emailElement.getAttribute('href').replace('mailto:', '');

        if (name && email) {
          result.push({ name, email });
        }
      }
    });

    return result;
  }

function copyCompaniesInfoToClipboard() {
    const parentElement = document.querySelector("div.div_list_cty"); // Adjust this to match your actual parent element
    const companies = extractCompaniesInfo(parentElement);

    if (companies.length === 0) {
      alert('No company information found.');
      return;
    }

    const formattedText = companies.map(company => `${company.name} | ${company.email}`).join('\n');

    navigator.clipboard.writeText(formattedText)
      .then(() => {
        console.log('Companies information copied to clipboard');
        alert('Companies information copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy to clipboard. See console for details.');
      });
  }

  // Event listener for 'Z' key press
  document.addEventListener('keydown', function(event) {
    if (event.key === 'z' || event.key === 'Z') {
      copyCompaniesInfoToClipboard();
    }
  });
})();