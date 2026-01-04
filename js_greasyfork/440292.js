// ==UserScript==
// @name         BrightSpace Change to the old icon
// @description  to use old icon
// @namespace    http://tampermonkey.net/
// @homepage     https://greasyfork.org/en/users/195184-franxx
// @version      0.1
// @author       franxx
// @license      GPL-3.0-only
// @match        https://*.brightspace.com/*
// @downloadURL https://update.greasyfork.org/scripts/440292/BrightSpace%20Change%20to%20the%20old%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/440292/BrightSpace%20Change%20to%20the%20old%20icon.meta.js
// ==/UserScript==

function changeToOldIcon(){
    let iconImgAddress="https://s.brightspace.com/lib/favicon/2.0.0/favicon.ico";
    let icons=document.querySelectorAll('[rel="icon"]');
    for(let i=0;i<icons.length;i++){
        icons[i].href=iconImgAddress;
        let parent=icons[i].parentElement;
        parent.removeChild(icons[i]);
        parent.appendChild(icons[i]);
    }
}

(function() {
    changeToOldIcon();
})();