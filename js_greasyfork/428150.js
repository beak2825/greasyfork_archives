// ==UserScript==
// @name        WME Sandbox Fallback
// @author      Tom 'Glodenox' Puttemans
// @namespace   http://www.tomputtemans.com/
// @description Whenever the Waze features can't be loaded due to a server error, attempt to load the same data from the sandbox.
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version     0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/428150/WME%20Sandbox%20Fallback.user.js
// @updateURL https://update.greasyfork.org/scripts/428150/WME%20Sandbox%20Fallback.meta.js
// ==/UserScript==

(function() {
  var notificationMessage = document.createElement('div');
  notificationMessage.style.cssText = 'left:400px; bottom:32px; display:none; position:fixed; z-index:1000; background-color:#ffeb9c; padding:6px; border-radius:5px';
  notificationMessage.textContent = 'Had to fall back to sandbox mode to retrieve data';
  document.body.appendChild(notificationMessage);

  // Replace the send method with a function that adds a listener to the load event
  // This way we can monitor the results
  var originalFetch = window.fetch;
  window.fetch = (resource, init) => {
    return originalFetch(resource, init)
    .then(response => {
      var resourceUrl = typeof(resource) == 'string' ? resource : resource.url;
      if (response.status == 500 && resourceUrl.indexOf('/app/Features') != -1) {
        return originalFetch(resourceUrl + '&sandbox=true', init)
          .then(response => {
            if (response.ok) {
              notificationMessage.style.display = 'block';
              setTimeout(() => notificationMessage.style.display = 'none', 5000);
            }
            return response;
          });
      } else {
        return response;
      }
    });
  };
  log('WME Sandbox Fallback initiated');

  function log(message) {
    if (typeof message === 'string') {
      console.log('%c' + GM_info.script.name + ' (v' + GM_info.script.version + '): %c' + message, 'color:black', 'color:#d97e00');
    } else {
      console.log('%c' + GM_info.script.name + ' (v' + GM_info.script.version + ')', 'color:black', message);
    }
  }
})();