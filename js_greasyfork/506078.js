// ==UserScript==
// @name                             Free Ropro Ultra ICON CHANGER (Fixed) 
// @namespace                     http://tampermonkey.net/
// @version                        1.1
// @description              Forcefully replaces the Free Ropro icon with the Ultra one, keeps checking till it's done. CHANGE USERID IN MATCH URL!
// @author                     Emree.el on Instagram ;)
// @match                        https://www.roblox.com/users/564962235/profile
// @grant                          none
// @license                      MIT
// @downloadURL https://update.greasyfork.org/scripts/506078/Free%20Ropro%20Ultra%20ICON%20CHANGER%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/506078/Free%20Ropro%20Ultra%20ICON%20CHANGER%20%28Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ULTRA_ICON_SRC = 'chrome-extension://adbacgifemdbhdkfppmeilbgppmhaobf/images/ultra_icon.png';

    // Force check every 300ms
    const interval = setInterval(() => {
        const icon = document.querySelector('.ropro-profile-icon');
        if (icon && icon.src !== ULTRA_ICON_SRC) {
            icon.src = ULTRA_ICON_SRC;
            console.log('[Ropro Ultra] Icon replaced ✅');
        }
    }, 300);
})();

