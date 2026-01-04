// ==UserScript==
// @name           Visited Links on Wikipedia Coloriz0r
// @description    Links and visited links are easier to differentiate from regular text now.
// @author         Sgt. Nukem
// @include        https://*.wikipedia.org
// @version        0.666
// @namespace https://greasyfork.org/users/324223
// @downloadURL https://update.greasyfork.org/scripts/394073/Visited%20Links%20on%20Wikipedia%20Coloriz0r.user.js
// @updateURL https://update.greasyfork.org/scripts/394073/Visited%20Links%20on%20Wikipedia%20Coloriz0r.meta.js
// ==/UserScript==

function addCss(cssString) {
    var head = document.getElementsByTagName('head')[0];
    var newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
}


const betterLinkColors = `
.mw-body-content a:link {
   color: #0048BA !important;
}
.mw-body-content a:visited {
   color: #A66DDB !important;
}
`;

addCss(betterLinkColors);