// ==UserScript==
// @name         New PHP Theme
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Replace php.net to new theme
// @author       SergoZar
// @match        *://*.php.net*
// @icon         https://notabug.org/SergoZar/new-php-icon/raw/572f5865302c8c3efbc147fe5dbd7b1c630aa1dd/php.png
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/491671/New%20PHP%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/491671/New%20PHP%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll("link[rel=icon]").forEach(item => {item.href="https://notabug.org/SergoZar/new-php-icon/raw/572f5865302c8c3efbc147fe5dbd7b1c630aa1dd/php.png"});
let style = document.createElement("style");
    style.innerHTML = `
:root {
    --orange: rgb(255,153,0);
    --dark-blue-color: var(--orange);
	--medium-blue-color: var(--orange);
    --light-blue-color: #FFF;
    --dark-magenta-color: #000;
  --medium-magenta-color: #000;
  --light-magenta-color: #000;
}

#layout-content a:link {
   color: var(--orange)
}

.hero-btn-secondary {
  color: var(--orange) !important;
  border: 1px solid var(--orange);
}


.navbar .nav > li > a {
  font-weight: bold;
}

.navbar .nav > li > a > img, .hero-logo{
  filter: brightness(0%);
}

`;
   document.body.append(style)
})();