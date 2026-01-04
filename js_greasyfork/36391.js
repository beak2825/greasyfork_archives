// ==UserScript==
// @name         WME Google Link Enhancements
// @namespace    WazeDev
// @version      2018.03.12.001
// @description  This script has been incorporated into WME Place Interface Enhancements.
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/36391/WME%20Google%20Link%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/36391/WME%20Google%20Link%20Enhancements.meta.js
// ==/UserScript==

let WARNING_TEXT = 'GOOGLE LINK ENHANCEMENTS\n\nThis script has been incorporated into WME Place Interface Enhancements (PIE). Please uninstall WME Google Link Enhancements to prevent conflicts.';


function init() {
    alert(WARNING_TEXT);
    localStorage.removeItem('_wme_gle_settings');
}

function bootstrap() {
    if (W && W.loginManager && W.loginManager.isLoggedIn()) {
        init();
    } else {
        setTimeout(() => bootstrap(), 500);
    }
}

bootstrap();
