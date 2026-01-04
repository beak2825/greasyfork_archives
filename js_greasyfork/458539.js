// ==UserScript==
// @name            Bypass the redirection notice
// @name:fr         Outrepasser l'alerte de redirection
// @description     Bypass the redirection notice displayed by Google when clicking a link on custom clients
// @description:fr  Outrepasser l'alerte de redirection affichée par Google lorsque l'on clique sur un lien dans un client non-officiel
// @author          Deuchnord
// @version         1.0.1
// @namespace       https://deuchnord.fr/userscripts#google.com/bypass-redirection
// @match           https://www.google.com/url?*
// @icon            https://www.google.com/favicon.ico
// @license         AGPL-3.0
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/458539/Bypass%20the%20redirection%20notice.user.js
// @updateURL https://update.greasyfork.org/scripts/458539/Bypass%20the%20redirection%20notice.meta.js
// ==/UserScript==

(function() {

    const url = new URL(document.location.href);
    let redirectTo = url.searchParams.get("url");
    document.location.href = redirectTo;
  
})();
