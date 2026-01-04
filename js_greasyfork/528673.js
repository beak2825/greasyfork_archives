// ==UserScript==
// @name         (useless now)1Fichier Redirect to FastDebrid
// @namespace    https://violentmonkey.github.io/
// @version      1.5
// @description  Save 1fichier link, redirect to FastDebrid and autofill the link.
// @author       Rust1667
// @match        https://1fichier.com/*
// @match        https://fastdebrid.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/528673/%28useless%20now%291Fichier%20Redirect%20to%20FastDebrid.user.js
// @updateURL https://update.greasyfork.org/scripts/528673/%28useless%20now%291Fichier%20Redirect%20to%20FastDebrid.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the Cloudflare captcha is solved
    function checkCloudflareCaptchaSolved() {
        if (document.querySelector('.cf-turnstile') || document.querySelector('#captcha-turnstile')) {
            return unsafeWindow.turnstile && unsafeWindow.turnstile.getResponse().length !== 0;
        }
        return true;
    }

    // Wait for the page to load fully
    window.addEventListener('load', function() {

      const currentUrl = window.location.href;

      // On 1fichier page
      if (currentUrl.includes('1fichier.com') && !currentUrl.endsWith('=') && !document.body.innerText.includes("file has been deleted") && !document.body.innerText.includes("automatically deleted")) {
          GM_setValue('saved1FichierLink', currentUrl);
          window.location.assign('https://fastdebrid.com/');

      // On FastDebrid page
      } else if (currentUrl === 'https://fastdebrid.com/') {

              const fichierOption = document.querySelector('[data-name="1fichier"]');
              if (fichierOption) {
                  fichierOption.click();
              }

              function fillForm() {
                  const savedLink = GM_getValue('saved1FichierLink');
                  if (savedLink) {
                      const inputField = document.querySelector('#link');
                      if (inputField) {
                          inputField.value = savedLink;
                          GM_deleteValue('saved1FichierLink');
                      }
                  }
              }

              function clickDebridButton() {
                  const debridButton = document.querySelector('button.btn-primary');
                  if (debridButton && debridButton.innerText.includes('Debrid my link')) {
                      debridButton.click();
                  }
              }

              // Wait for cloudflare captcha to be solved to fill the form and click the button
              let captchaCheckInterval = setInterval(() => {
                  if (checkCloudflareCaptchaSolved()) {
                      clearInterval(captchaCheckInterval);
                      fillForm();
                      clickDebridButton();
                  }
              }, 1000);



      // On fastdebrid page with link ready for download
      } else if (/https:\/\/fastdebrid.com\/.*/.test(currentUrl)) {
          const shortlinkElement = document.querySelector('a.btn-primary.mx-1')
          const dlLinkElement =  document.querySelector('a.btn-success.mx-1')
          if (shortlinkElement) {window.location.assign(shortlinkElement.href);}
          //else if (dlLinkElement) {window.location.assign(dlLinkElement.href);}
      }
    });

})();
