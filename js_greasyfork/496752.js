// ==UserScript==
// @name         Floatplane Always Captioned
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically check if a captioned version is available and switch to it if it is
// @license      GPL-v3
// @author       German
// @match        https://*.floatplane.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=floatplane.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496752/Floatplane%20Always%20Captioned.user.js
// @updateURL https://update.greasyfork.org/scripts/496752/Floatplane%20Always%20Captioned.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let apiRequestMade = false;

  function checkAndSwitchToCaptioned() {
    let url = new URL(window.location.href);

    if (url.pathname.includes('/post/')) {
      let post_id = url.pathname.split('/')[2];
      if (!post_id) return;

      if (apiRequestMade) return; // Prevent hammering API
      apiRequestMade = true;

      fetch(`${window.location.origin}/api/v3/content/post?id=${post_id}`)
        .then(response => response.json())
        .then(data => {
          if (!data) return;
          if (data.videoAttachments.length > 1) {
            let captioned = data.videoAttachments.find(attachment =>
              attachment.title.startsWith('Captioned')
            );
            if (captioned) {
              let attachmentList = document.querySelector('div[class*="attachmentList"]');
              if (attachmentList) {
                let attachments = attachmentList.querySelectorAll('div > div > div');
                for (let attachment of attachments) {
                  let titleDiv = attachment.querySelector('div[title]');
                  if (titleDiv && titleDiv.title.startsWith('Captioned')) {
                    let blackout = createBlackout();
                    setTimeout(() => {
                      attachment.firstChild.click();
                      hideBlockout(blackout);
                    }, 1000); // have to wait otherwise angular freaks out
                    break;
                  }
                }
              } else {
                console.log('Attachment list not found, retrying...');
                setTimeout(() => {
                  apiRequestMade = false;
                  checkAndSwitchToCaptioned();
                }, 1000);
              }
            }
          }
        })
        .catch(error => {
          console.error('API request failed:', error);
          apiRequestMade = false;
        });
    }
  }

  // Function to listen for URL changes
  function listenForUrlChanges() {
    let oldHref = document.location.href;

    window.addEventListener('popstate', function () {
      if (oldHref !== document.location.href) {
        oldHref = document.location.href;
        apiRequestMade = false;
        checkAndSwitchToCaptioned();
      }
    });

    // monkeypatch pushState and replaceState to detect changes
    const pushState = history.pushState;
    history.pushState = function () {
      const result = pushState.apply(this, arguments);
      window.dispatchEvent(new Event('popstate'));
      return result;
    };

    const replaceState = history.replaceState;
    history.replaceState = function () {
      const result = replaceState.apply(this, arguments);
      window.dispatchEvent(new Event('popstate'));
      return result;
    };
  }

  // Initial check in case the page is already loaded
  checkAndSwitchToCaptioned();

  // Start listening for URL changes
  listenForUrlChanges();

  // Cool blackout screen to let you know that it's switching
  function createBlackout() {
    let blackout = document.createElement('div');
    blackout.style.position = 'fixed';
    blackout.style.top = '0';
    blackout.style.left = '0';
    blackout.style.width = '100%';
    blackout.style.height = '100%';
    blackout.style.backgroundColor = 'black';
    blackout.style.zIndex = '9999';
    blackout.style.transition = 'all 0.2s';
    blackout.style.opacity = '0';
    blackout.innerHTML = `<h1 style="color: white; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: sans">Switching to captioned version...</h1>`;
    document.body.appendChild(blackout);
    setTimeout(() => {
      blackout.style.opacity = '1';
    }, 100);
    return blackout;
  }

  function hideBlockout(blackout) {
    blackout.style.opacity = '0';
    setTimeout(() => {
      blackout.remove();
    }, 200);
  }
})();