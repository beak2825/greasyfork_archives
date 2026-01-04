// ==UserScript==
// @name         traffic exchange clickvoyager auto surf
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  traffic exchange clickvoyager auto surf unlimited
// @author       aligood203
// @match        http://www.clickvoyager.com/surf.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542659/traffic%20exchange%20clickvoyager%20auto%20surf.user.js
// @updateURL https://update.greasyfork.org/scripts/542659/traffic%20exchange%20clickvoyager%20auto%20surf.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // دالة للتحقق من ظهور الزر والنقر عليه
    function checkAndClick() {
        const nextButton = document.getElementById('nsbutton');
        if (nextButton && nextButton.offsetParent !== null) {
            // تحقق مما إذا الزر مرئي (ليس له display: none أو visibility: hidden)
            const style = window.getComputedStyle(nextButton);
            if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                nextButton.click();
                console.log('تم النقر على زر Next Site تلقائيًا');
            }
        }
    }

    // التحقق كل 500 مللي ثانية (نصف ثانية)
    setInterval(checkAndClick, 500);
})();