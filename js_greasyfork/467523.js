// ==UserScript==
// @name         Live Ping Display in zombsroyale.io
// @namespace    zombsroyale.io
// @version      1.0
// @description  Displays Real Time Ping in zombsroyale.io
// @match        zombsroyale.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467523/Live%20Ping%20Display%20in%20zombsroyaleio.user.js
// @updateURL https://update.greasyfork.org/scripts/467523/Live%20Ping%20Display%20in%20zombsroyaleio.meta.js
// ==/UserScript==

(function() {
    'use strict';

   
    var pingDisplay = document.createElement('div');
    pingDisplay.style.position = 'fixed';
    pingDisplay.style.top = '10px';
    pingDisplay.style.left = '10px';
    pingDisplay.style.zIndex = '9999';
    pingDisplay.style.backgroundColor = 'white';
    pingDisplay.style.padding = '10px';
    document.body.appendChild(pingDisplay);

  
    function measurePing() {
        var startTime = new Date().getTime();
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', window.location.href + '?rand=' + Math.random(), true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var endTime = new Date().getTime();
                var ping = endTime - startTime;
                pingDisplay.textContent = 'Ping: ' + ping + ' ms';
            }
        };
        xhr.send(null);
    }

    setInterval(measurePing, 125);
})();
