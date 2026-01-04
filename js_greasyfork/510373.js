// ==UserScript==
// @name         Reaper manual call
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Click to get some noob to hit you...
// @author       You
// @match        https://cartelempire.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/510373/Reaper%20manual%20call.user.js
// @updateURL https://update.greasyfork.org/scripts/510373/Reaper%20manual%20call.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const USERNAME = 'SOMBRA_NEGRA';
    const USERID = '2012';
    const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1289040700393918501/iSt9_EkJXl0D4k8ZsjvBR4hVL4yMBOAOzMzRKm5KFzx0ds51UZP00IeoViXO84YNdaqA';
    //const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1289049902067875860/9i7dXGpJAsiFcagfAnB5ftfIy6Asc-U74ihTJ5FMSkgWRVxBR2vBGarHCchosoW4t4ru';

    const li = document.createElement('li');
    li.className = 'nav-item';

    const link = document.createElement('a');
    link.className = 'nav-link';
    link.href = '#';
    link.textContent = 'Call for Hit';

    li.appendChild(link);

    // Add click event listener
    link.addEventListener('click', function() {
        let d = new Date();
        let time = d.toISOString();

        const message = {
  "content": "<@&1258951297885933568> HIT "+USERNAME,
  "tts": false,
  "embeds": [
    {
      "id": 359718918,
      "description": "<@&1258951297885933568> HIT "+USERNAME,
      "fields": [],
      "author": {
        "name": ""+USERNAME,
        "url": "https://cartelempire.online/User/"+USERID
      },
      "url": "https://cartelempire.online/User/"+USERID,
      "color": 16721189,
      "title": USERNAME + " needs to be hit",
      "footer": {
        "text": "Please hit quickly"
      },
      "timestamp": time
    }
  ],
  "components": [],
  "actions": {},
};

        GM_xmlhttpRequest({
            method: 'POST',
            url: DISCORD_WEBHOOK,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(message),
            onload: function(response) {
                if (response.status === 204) {
                    alert('Message sent to Discord successfully!');
                } else {
                    alert('Failed to send message to Discord. Status: ' + response.status);
                }
            },
            onerror: function(error) {
                alert('Error sending message to Discord: ' + error);
            }
        });
    });

    document.getElementById("siteLinksNav").appendChild(li);
    //document.body.appendChild(button);
})();