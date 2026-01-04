// ==UserScript==
// @name            Redirect from mobile
// @name:fr         Rediriger la version mobile
// @description     Automatically redirect from mobile websites to their desktop counterpart.
// @description:fr  Redirige automatiquement les sites mobiles vers leur version pour ordinateur.
// @author          Deuchnord
// @version         1.0
// @namespace       https://deuchnord.fr/userscripts#all_sites/redirect-from-mobile
// @match           https://www.bfmtv.com/amp/*
// @match           https://*.m.wikipedia.org/*
// @match           https://amp.la-croix.com/*
// @license         AGPL-3.0
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/492838/Redirect%20from%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/492838/Redirect%20from%20mobile.meta.js
// ==/UserScript==

(function () {

  const redirects = {
    "www.bfmtv.com/amp/": "www.bfmtv.com/",
    ".m.wikipedia.org/": ".wikipedia.org/",
    "amp.la-croix.com/": "la-croix.com/"
  };

  for (let redirectFrom in redirects) {
    if (!location.href.includes(redirectFrom)) {
      continue;
    }

    let redirectTo = location.href.replace(redirectFrom, redirects[redirectFrom]);
    location.replace(redirectTo);
  }

})();
