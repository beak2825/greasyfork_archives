// ==UserScript==
// @name         Bypass the GitLab & GitHub Region Restriction
// @namespace    http://tampermonkey.net/
// @version      0.6.0
// @description  Bypass the GitLab Region Restriction by modifying the navigator.language field
// @author       Lucas
// @match        https://*.gitlab.com/*
// @match        https://*.github.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPLv3
// @icon         https://www.gitlab.com/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/522277/Bypass%20the%20GitLab%20%20GitHub%20Region%20Restriction.user.js
// @updateURL https://update.greasyfork.org/scripts/522277/Bypass%20the%20GitLab%20%20GitHub%20Region%20Restriction.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let isEnabled = GM_getValue('isEnabled', false);

  function toggleBypass() {
      isEnabled = !isEnabled;
      GM_setValue('isEnabled', isEnabled);
      alert(`Bypass is now ${isEnabled ? 'enabled' : 'disabled'}`);
      location.reload();
  }

  const icon = isEnabled ? '✅' : '❌';
  GM_registerMenuCommand('Toggle Bypass (current: ' + (isEnabled ? 'enabled' : 'disabled') + ')', toggleBypass, icon);

  const originalLanguage = 'zh-CN';
  const newLanguage = 'en-US';

  Object.defineProperty(navigator, 'language', {
      get: function() {
          return isEnabled ? newLanguage : originalLanguage;
      }
  });

  Object.defineProperty(navigator, 'languages', {
      get: function() {
          return isEnabled ? [newLanguage] : [originalLanguage];
      }
  });

  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this.addEventListener('readystatechange', function() {
      if (this.readyState === 1 && isEnabled) {
        this.setRequestHeader('Accept-Language', 'en-US');
      }
    });
    originalOpen.apply(this, arguments);
  };
  
})();