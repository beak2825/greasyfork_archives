// ==UserScript==
// @name         desbloquea.me bypass
// @version      1.2
// @description  Bypass desbloquea.me shortlink
// @author       Rust1667
// @match        https://desbloquea.me/s.php?i=*
// @match        https://desbloquea.me/l.php?i=*
// @match        https://desbloquea.me/r.php?l=*
// @run-at       document-start
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/484488/desbloqueame%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/484488/desbloqueame%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function rot13(input) {
        return input.replace(/[a-zA-Z]/g, function(c) {
            return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
    }

    if (window.location.hostname === 'desbloquea.me') {

      // Typical case
      if (window.location.href.includes("desbloquea.me/s.php?i=")) {
        var currentURL = window.location.href;
        var encodedURL = currentURL.split('?i=')[1]
        var decodedURL = rot13(atob(atob(atob(atob(atob(encodedURL))))));
        var cleanURL = decodedURL.split('|')[0];
        window.location.replace(cleanURL);

      // Set cookie case
      } else if (window.location.href.includes("desbloquea.me/l.php?i=")) {
        var referrer = document.referrer;
        if (referrer.includes("pelisenhd.org")) {
          const cookieToSet = "P9w_HDwe*651";
          document.cookie = `${cookieToSet} = Wn275; path=/`;
        } else {
          const cookieToSet = "P9w_HDwe*651";
          document.cookie = `${cookieToSet} = Wn275; path=/`;
          alert("You don't seem to be coming from pelisenhd.org (Referrer domain is not pelisenhd.org). Bypass may not work.");
        }

      // Redirect once the cookie is enabled case
      } else if (window.location.href.includes("desbloquea.me/r.php?l=")) {
        const urlParams = new URLSearchParams(window.location.search);
        const paramL = urlParams.get('l');
        if (paramL) {
            const decodedURL = decodeURIComponent(rot13(atob(paramL)));
            window.location.href = decodedURL;
        }
      }

    }

})();
