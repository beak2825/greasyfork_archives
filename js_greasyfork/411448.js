// ==UserScript==
// @name Arial Destroyer
// @namespace github.com/openstyles/stylus
// @version 1.1.0
// @description Replaces Arial with Helvetica on all webpages
// @author pythoncoder42
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:^(?!.*docs.google.com).*$)$/
// @downloadURL https://update.greasyfork.org/scripts/411448/Arial%20Destroyer.user.js
// @updateURL https://update.greasyfork.org/scripts/411448/Arial%20Destroyer.meta.js
// ==/UserScript==

(function() {
let css = `
    @font-face {
    font-family: 'Arial';
    src: local('Helvetica');
    font-weight: normal;
    font-style: normal;
    }
    
    @font-face {
    font-family: 'Arial';
    src: local('Helvetica italic');
    font-weight: normal;
    font-style: italic;  
    }
    
    @font-face {
    font-family: 'Arial';
    src: local('Helvetica bold');
    font-weight: bold;
    font-style: normal;
    }
    
    @font-face {
    font-family: 'Arial';
    src: local('Helvetica bold italic');
    font-weight: bold;
    font-style: italic;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
