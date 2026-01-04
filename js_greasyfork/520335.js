// ==UserScript==
// @name         Lovoo Profile Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Open Lovoo profiles in a new tab, even restricted ones. | Ouvrez les profils Lovoo dans un nouvel onglet, même ceux restreints. | Abra perfiles de Lovoo en una nueva pestaña, incluso los restringidos. | Öffnen Sie Lovoo-Profile in einem neuen Tab, auch eingeschränkte. | Открывайте профили Lovoo в новой вкладке, даже ограниченные. | 打开 Lovoo 个人资料，即使是受限制的，也可以在新选项卡中打开。
// @author       Manu OVG
// @icon         https://www.tempsdimages.eu/wp-content/uploads/2019/09/logo-lovoo.png
// @match        https://fr.lovoo.com/*
// @match        https://en.lovoo.com/*
// @match        https://es.lovoo.com/*
// @match        https://de.lovoo.com/*
// @match        https://ru.lovoo.com/*
// @match        https://cn.lovoo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520335/Lovoo%20Profile%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/520335/Lovoo%20Profile%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add click listener to handle profile opening
    document.addEventListener('click', function(e) {
        const target = e.target.closest('.user-image.user-userpic'); // Select the clicked element
        if (target) {
            // Attempt to capture the direct URL
            const profileUrl = target.closest('a')?.href || null;
            if (profileUrl) {
                window.open(profileUrl, '_blank'); // Open the profile directly
            } else {
                alert('Could not find the direct profile URL. The profile may have special restrictions.');
            }
        }
    });
})();
