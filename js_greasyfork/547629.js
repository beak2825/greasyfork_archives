// ==UserScript==
// @name        qBit GGn Deleter
// @namespace   Violentmonkey Scripts
// @match       https://your.qbit.example.com/
// @grant       none
// @version     1.0
// @author      Rope100M
// @description Delete GGn torrents from IDs
// @downloadURL https://update.greasyfork.org/scripts/547629/qBit%20GGn%20Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/547629/qBit%20GGn%20Deleter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  async function deleteIds() {
    document.getElementById('deleteIds').innerHTML = "working";

    let rawIds = prompt("IDs from GGn");
    let ids = rawIds.split(',');

    const response = await fetch("/api/v2/torrents/info");

    const result = await response.json();

    console.log(ids);

    for(var i = 0; i < result.length; i++) {
      if(result[i].comment.startsWith("https://gazellegames.net/torrents.php?torrentid=") == false) {
        continue;
      }

      if(ids.includes(result[i].comment.substring(48))) {
        console.log(result[i].hash);
        console.log(result[i].content_path);

        var formData = new FormData();
        formData.append('hashes', result[i].hash);
        formData.append('deleteFiles', 'true');

        await fetch("/api/v2/torrents/delete", { method: "POST", body: formData });
      }
    }
  }

  function onPageLoaded() {
    document.getElementById('desktopNavbar').getElementsByTagName("ul")[0].innerHTML += '<button id="deleteIds">Delete</button>';

    const btn = document.getElementById('deleteIds');
    if (btn) {
      btn.addEventListener('click', deleteIds);
      btn.removeAttribute('onClick');
    }
  }

  if (document.readyState === 'complete') {
    onPageLoaded();
  } else {
    window.addEventListener('load', onPageLoaded, { once: true });
  }
})();