// ==UserScript==
// @name         hmeres dixos helios
// @name:el      Ημέρες δίχως helios
// @description  Prevents helios from downloading all files by default, instead of opening then on to browser
// @description:el Αποτρέπει το helios να κατεβάζει οτι μαλακία pdf βρει
// @match        https://helios.ntua.gr/*
// @author       Stavros Avramidis
// @version      0.1.1
// @license      MIT
// @namespace https://greasyfork.org/users/1065988
// @downloadURL https://update.greasyfork.org/scripts/464663/hmeres%20dixos%20helios.user.js
// @updateURL https://update.greasyfork.org/scripts/464663/hmeres%20dixos%20helios.meta.js
// ==/UserScript==

(function() {
  // Select all anchor tags with href attribute ending with forcedownload=1
  const downloadLinks = document.querySelectorAll('a[href$="forcedownload=1"]');

  // Loop through each download link and modify its href attribute
  downloadLinks.forEach(link => {
    link.href = link.href.replace('forcedownload=1', 'forcedownload=0');
  });

  // Add a click event listener to all elements with class ygtvspacer
  const spacers = document.querySelectorAll('.ygtvspacer');
  spacers.forEach(spacer => {
    spacer.addEventListener('click', () => {
      // Select all anchor tags with href attribute ending with forcedownload=1
      const downloadLinks = document.querySelectorAll('a[href$="forcedownload=1"]');
      // Loop through each download link and modify its href attribute
      downloadLinks.forEach(link => {
        link.href = link.href.replace('forcedownload=1', 'forcedownload=0');
      });
    });
  });
})();
