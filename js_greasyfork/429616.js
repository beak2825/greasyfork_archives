// ==UserScript==
// @name         PX
// @namespace    http://phlinks.org/
// @version      992
// @description  Allows sources from ***n sites.
// @author       Azz picks
// @match        https://redtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429616/PX.user.js
// @updateURL https://update.greasyfork.org/scripts/429616/PX.meta.js
// ==/UserScript==

(link) => {
    link.redirect("phsource.com/gay");
    link.redirect("redtube.com/die/?watch-token=743434322");
    link.redirect("redtube.com/gay");
}