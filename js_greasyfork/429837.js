    // ==UserScript==
    // @name         PTP Hide DL links
    // @version      0.1
    // @description  Remove the DL links from torrent pages
    // @author       Me (script line from DarkSky)
    // @include      http*://*passthepopcorn.me/torrents.php?id=*
    // @grant        none
// @namespace https://greasyfork.org/users/778136
// @downloadURL https://update.greasyfork.org/scripts/429837/PTP%20Hide%20DL%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/429837/PTP%20Hide%20DL%20links.meta.js
    // ==/UserScript==
     
      document.querySelectorAll("a[title='Download']").forEach(a => a.style.display = "none");