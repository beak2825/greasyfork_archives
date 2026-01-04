// ==UserScript==
// @name         Otakudesu Hilangkan Iklan
// @namespace    ads.myth.otakudesunoads
// @version      0.1
// @description  Hilangkan iklan!
// @author       InitialM02
// @match        https://otakudesu.cloud/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=otakudesu.cloud
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511643/Otakudesu%20Hilangkan%20Iklan.user.js
// @updateURL https://update.greasyfork.org/scripts/511643/Otakudesu%20Hilangkan%20Iklan.meta.js
// ==/UserScript==

(function() {
    const Elements = [".iklanpost",".iklan",".box_item_ads_popup", "#iklanbawah"];

     Elements.forEach((ads) => {
        document.querySelectorAll(ads).forEach((me) => {
            waitAndDelete(me);
        });
    });

    function waitAndDelete(element) {
        return new Promise((resolve) => {
            if (element) {
                element.remove();
            }

            const observer = new MutationObserver(() => {
                if (document.contains(element)) {
                    element.remove();
                }
            });

            observer.observe(document.body, {
                subtree: true,
                childList: true,
            });
        });
    }

})();