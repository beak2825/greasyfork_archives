// ==UserScript==
// @name         ETStats Gathering
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ETStats Script for gathering drop information from eternitytower.net, see drops at etstats.com/debug.html
// @author       You
// @match        http://eternitytower.net/combat
// @match        https://eternitytower.net/combat
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31187/ETStats%20Gathering.user.js
// @updateURL https://update.greasyfork.org/scripts/31187/ETStats%20Gathering.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var msgCount = 0;

  Meteor.connection._stream.on('message', function (message)
  {
  	var msg = JSON.parse(message);
  	if(msg.collection == "battles")
  	{
  		if(msg.fields != null && msg.fields.finalTickEvents != null)
  		{
        if(msgCount >= 25 && msg.fields.win)
        {
          ETStatsLog(msg);
        }
        msgCount++;
  		}
  	}
  });

  function ETStatsLog(data)
  {
    var https = (document.location.protocol == "https:");
    var socket = null;
    if(https)
      socket = new WebSocket("wss://ws.etstats.com");
    else
      socket = new WebSocket("ws://ws.etstats.com");
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify(data));
        socket.close();
    });
  }
})();