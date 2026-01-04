// ==UserScript==
// @name         VyxterHost Dark Theme
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Dark theme for VyxterHost!
// @author       Procatin0
// @license      MIT
// @match        https://panel.vyxterhost.com/*
// @icon         https://panel.vyxterhost.com/favicons/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/463422/VyxterHost%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/463422/VyxterHost%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    function addStyle(styleString) {
        const style = document.createElement('style');
        style.textContent = styleString;
        document.head.append(style);
    }
    addStyle(`
:root {
  --second-background: #000626 !important;
  --fondo-monedas: #000626 !important;
}
.dPGUGi, .kzDXoo {
margin: 0 !important;
}
.centrarlineasmonedas {
border: none !important;
}
.bg-neutral-800 {
  background-color: #000814 !important;
}

#nav-bar {
  background-color: #000626;
}

#header {
  background-color: #000626;
  z-index: 0;
}

html {
  background-color: #000814;
  font-family: Montserrat;
  overflow-x: hidden;
}

.cuadradobordesynegro {
  border: none;
}

#body-pd {
  background-image: none;
}
button {
background-color: #000626;
border: none;
}
.rowserver {
background-color: #000626;
}
.alert-info {
border: none !important;
background-color: #34a84c !important;
}
    `)

    // Your code here...
})();