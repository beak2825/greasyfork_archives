// ==UserScript==
// @name         Retwitter
// @description  Auto follow script for Twitter (Made for secretnoye casino)
// @version      0.0.2
// @author       Deps
// @match https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @namespace https://greasyfork.org/users/791270
// @downloadURL https://update.greasyfork.org/scripts/463411/Retwitter.user.js
// @updateURL https://update.greasyfork.org/scripts/463411/Retwitter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let enabled = false;
  let followCount = 0;
  let intervalId;
  let quietMode = false;

  const panelHtml = `
    <div style="position: fixed; bottom: 50px; right: 50px; z-index: 9999; background: white; padding: 10px; border-radius: 5px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-weight: bold;">Retwitter</span>
          <span>Following: <span id="follow-count">${followCount}</span></span>
        </div>
        <div>
          <label style="display: inline-flex; align-items: center;">
            <input type="checkbox" id="enable-checkbox" ${enabled ? 'checked' : ''} style="margin-right: 5px;">
            <span>Enabled</span>
          </label>
          <button id="close-button" style="border: none; background: none; font-size: 20px; cursor: pointer;">&times;</button>
        </div>
      </div>
    </div>
  `;

  function clickFollowButtons() {
    if (!quietMode) {
      const followButtons = document.querySelectorAll('div[aria-label^="Follow"] span span');
      followButtons.forEach((button) => {
        if (button.textContent === 'Follow') {
          button.click();
          followCount++;
          document.querySelector('#follow-count').textContent = followCount;
          handleFollowLimit();
        }
      });
    } else if (quietMode) {
      const followButtons = document.querySelectorAll('div[aria-label^="Follow"] span span');
      followButtons.forEach((button) => {
        if (button.textContent === 'Follow') {
          button.click();
          handleFollowLimit();
         }
      });
    }
  }

    function toggleScript() {
        enabled = !enabled;
        document.querySelector('#enable-checkbox').checked = enabled;
        if (enabled) {
            intervalId = setInterval(clickFollowButtons, 5000);
            clickFollowButtons()
        } else {
            clearInterval(intervalId);
        }
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.innerHTML = panelHtml;
        document.body.appendChild(panel);

        document.querySelector('#enable-checkbox').addEventListener('change', toggleScript);
        document.querySelector('#close-button').addEventListener('click', () => {
            panel.style.display = 'none';
        });
    }

    function handleFollowLimit() {
        let consecutiveFailures = 0;
        const checkInterval = setInterval(() => {
            const errorBanner = document.querySelector('div[aria-label^="You are unable to follow more people at this time."] span span');
            if (errorBanner) {
                clearInterval(checkInterval);
                quietMode = true;
                document.querySelector('#follow-count').textContent = followCount + ' (quiet mode)';
                setInterval(clickFollowButtons, 180000);
            } else if (consecutiveFailures >= 3) {
                clearInterval(checkInterval);
                quietMode = true;
                document.querySelector('#follow-count').textContent = followCount + ' (quiet mode)';
                setInterval(clickFollowButtons, 180000);
            }
            else {
                fetch('/i/api/1.1/friendships/create.json', {method: 'POST'})
                    .then(response => {
                    if (!response.ok) {
                        consecutiveFailures++;
                    } else {
                        consecutiveFailures = 0;
                    }
                });
            }
        }, 1000);
    }


    function init() {
        createPanel();
    }

    init();
})();
