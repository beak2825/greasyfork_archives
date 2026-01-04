// ==UserScript==
// @name         PTP Log History
// @version      0.5
// @description  Go to the log history page of a torrent group with a keyboard shortcut
// @author       P
// @include      http*://*passthepopcorn.me/torrents.php?id=*
// @include      http*://*passthepopcorn.me/torrents.php?action=history_log*
// @grant        none
// @namespace https://greasyfork.org/users/778136
// @downloadURL https://update.greasyfork.org/scripts/449065/PTP%20Log%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/449065/PTP%20Log%20History.meta.js
// ==/UserScript==

document.addEventListener("keydown", function (e) {
  if (e.key == "h" && !e.target.matches("input, textarea")) {
    const fullURL = document.location.href;
    const partURL = document.location.search;
    const urlParams = new URLSearchParams(partURL);
    const historyURL =
      "https://passthepopcorn.me/torrents.php?action=history_log";
    const deletionsParam = "&search=&only_deletions=1";

    if (fullURL.includes("torrents.php?id=")) {
      const groupID = urlParams.get("id");
      window.location.href = `${historyURL}&groupid=${groupID}`;
    } else if (
      fullURL.includes(historyURL) &&
      fullURL.includes(deletionsParam)
    ) {
      const groupID = urlParams.get("groupid");
      window.location.href = `https://passthepopcorn.me/torrents.php?id=${groupID}`;
    } else if (fullURL.includes(historyURL)) {
      const groupID = urlParams.get("groupid");
      window.location.href = `${historyURL}&groupid=${groupID}${deletionsParam}`;
    }
  }
});