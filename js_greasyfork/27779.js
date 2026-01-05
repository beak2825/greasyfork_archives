// ==UserScript==
// @name        WME Error Details
// @author      Tom 'Glodenox' Puttemans
// @namespace   http://www.tomputtemans.com/
// @description Display the error messages received from Waze in the web console
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version     0.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27779/WME%20Error%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/27779/WME%20Error%20Details.meta.js
// ==/UserScript==

(function() {
  // Replace the send method with a function that adds a listener to the load event
  // This way we can monitor the results
  XMLHttpRequest.prototype.reallySend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(body) {
    this.addEventListener('load', function() {
      if (this.status != 200) {
        try {
          var response = JSON.parse(this.response);
          log(response);
          response.errorList.forEach(function(error) {
            log('Error code ' + error.code + ': ' + error.details);
          });
        } catch (e) {
          log(this.response);
        }
      }
    });
    this.reallySend(body);
  };

  function log(message) {
    if (typeof message === 'string') {
      console.log('%c' + GM_info.script.name + ' (v' + GM_info.script.version + '): %c' + message, 'color:black', 'color:#d97e00');
    } else {
      console.log('%c' + GM_info.script.name + ' (v' + GM_info.script.version + ')', 'color:black', message);
    }
  }
})();