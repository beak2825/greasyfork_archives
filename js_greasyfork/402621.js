// ==UserScript==
// @name          Redirect to Desktop Wikipedia
// @version       1.0.2
// @description   Redirect mobile Wikipedia to desktop
// @author        mooms,AgentRev
// @namespace     https://greasyfork.org/fr/scripts/402621-redirect-to-desktop-wikipedia/
// @icon          https://en.wikipedia.org/favicon.ico
// @include       *://*.m.wikipedia.org/*
// @run-at        document-start
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/402621/Redirect%20to%20Desktop%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/402621/Redirect%20to%20Desktop%20Wikipedia.meta.js
// ==/UserScript==

location.replace(location.href.replace(".m.wikipedia.org/", ".wikipedia.org/"));