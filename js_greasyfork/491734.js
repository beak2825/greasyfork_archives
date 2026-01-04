// ==UserScript==
// @name        Microsoft Teams - Keep Active / Available
// @description Keeps you active between the hours specified in the script
// @namespace   Violentmonkey Scripts
// @match       *://*.teams.microsoft.com/_*
// @grant       none
// @version     1.04
// @author      -
// @run-at       document-idle
// @license AGPL
// @downloadURL https://update.greasyfork.org/scripts/491734/Microsoft%20Teams%20-%20Keep%20Active%20%20Available.user.js
// @updateURL https://update.greasyfork.org/scripts/491734/Microsoft%20Teams%20-%20Keep%20Active%20%20Available.meta.js
// ==/UserScript==

var startTime =  9 * 60 + 0; // Work starts at 9am
var endTime   = 17 * 60 + 0; // Work ends at 5pm

function inTime() {
    var now = new Date();
    var time = now.getHours() * 60 + now.getMinutes();
    return time >= startTime && time < endTime;
}

(function(sendParam) {
  XMLHttpRequest.prototype.send = function() {
      if (typeof arguments[0] === 'string' || arguments[0] instanceof String) {
        try {
            let jsonMsg = JSON.parse(arguments[0]);
            if (jsonMsg.isActive != null) {
              if (jsonMsg.isActive === false) {
                if(inTime()) {
                  jsonMsg.isActive = true;
                  arguments[0] = JSON.stringify(jsonMsg);
                }
              }
            }
        } catch (e) {
          console.error('Teams - Always Online', e);
        }
      }

      sendParam.apply(this, arguments);
  };
})(XMLHttpRequest.prototype.send);