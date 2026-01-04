// ==UserScript==
// @name        GGn qBit Deleter
// @namespace   Violentmonkey Scripts
// @match       https://gazellegames.net/torrents.php?action=delete_notify
// @grant       none
// @version     1.1
// @author      Rope100M
// @description Copy deleted torrent notification IDs into clipboard
// @downloadURL https://update.greasyfork.org/scripts/547627/GGn%20qBit%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/547627/GGn%20qBit%20Deleter.meta.js
// ==/UserScript==

var ggnApiKey = '-YOUR-KEY-HERE-';

(function () {
  'use strict';

  async function copyIds() {
    if(ggnApiKey == "-YOUR-KEY-HERE-") {
      alert("You need to modify the script to include your API key");
      return;
    }

    document.getElementById('copyIds').innerHTML = "working";

    const response = await fetch("/api.php?request=delete_notifs&limit=999999", {
      method: "GET",
      headers: {
        "X-API-Key": ggnApiKey,
      }});

    const result = await response.json();
    var idsList = "";
    for(var i = 0; i < result.response.length; i++) {
      idsList += result.response[i].TorrentID + ",";
    }

    navigator.clipboard.writeText(idsList).then(() => {
      alert("Copied to clipboard!");
    });
  }

  function onPageLoaded() {
    document.getElementById('content').getElementsByTagName("h2")[0].innerHTML += '<button id="copyIds">Copy IDs</button>';

    const btn = document.getElementById('copyIds');
    if (btn) {
      btn.addEventListener('click', copyIds);
      btn.removeAttribute('onClick');
    }
  }

  if (document.readyState === 'complete') {
    onPageLoaded();
  } else {
    window.addEventListener('load', onPageLoaded, { once: true });
  }
})();