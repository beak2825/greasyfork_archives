// ==UserScript==
// @name         Hejto Embed Helper
// @namespace    hejtoscripts
// @version      0.1
// @description  Pozwala wklejać obrazki ze schowka
// @author       devRJ45
// @match        https://www.hejto.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420918/Hejto%20Embed%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/420918/Hejto%20Embed%20Helper.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.addEventListener('paste', e => {
    let activeElement = document.activeElement;
    if (activeElement == null || activeElement.tagName.toLowerCase() != 'textarea') {
      return false;
    }

    if (e.clipboardData.files[0] == null) {
      return false;
    }

    let fileInput = activeElement.closest('form').querySelector('input[type=file]');
    fileInput.files = e.clipboardData.files;

    console.log(fileInput.files);

    let event = new Event('HTMLEvents');
    event.initEvent('change', true, true);
    fileInput.dispatchEvent(event);
  });

})();