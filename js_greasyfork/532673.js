// ==UserScript==
// @name         GGn PTPImg Enforcer
// @namespace    https://greasyfork.org/users/1395131
// @version      2.1.1
// @author       SleepingGiant
// @description  Disable submit unless images use ptpimg.me and album_desc has proper format.
// @require      https://update.greasyfork.org/scripts/533781/1578387/GGn%20Upload%20Blocker%20Manager.js
// @include      https://gazellegames.net/upload.php*
// @match        https://gazellegames.net/torrents.php?action=editgroup*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532673/GGn%20PTPImg%20Enforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/532673/GGn%20PTPImg%20Enforcer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const COVER_SEL = 'input[name="image"]';
    const SCREENSHOTS_SEL = '#image_block input[name="screens[]"]';
    const REASON_TEXT = 'All images must be hosted on ptpimg.me.';

    function isValidImageURL(url) {
        return url.includes('ptpimg.me');
    }

    // The first 4 must be present AND valid.
    // After that, each must be present OR valid
    function hasFourValidURLs(inputs) {
        const arr = Array.from(inputs);
        if (arr.length < 4) return false;
        for (let i = 0; i < 4; i++) {
            const val = arr[i].value.trim();
            if (!val || !isValidImageURL(val)) {
                return false;
            }
        }

        for (let i = 4; i < arr.length; i++) {
            const val = arr[i].value.trim();
            if (!(isValidImageURL(val) || val === '')) {
                return false;
            }
        }
        return true;
    }

    function allURLsValid() {
        const cover = document.querySelector(COVER_SEL);
        if (!cover || !isValidImageURL(cover.value.trim())) return false;

        const screenshotInputs = document.querySelectorAll(SCREENSHOTS_SEL);

        // If the page doesn't have screenshot inputs (e.g. OST), don't block on them
        if (!screenshotInputs || screenshotInputs.length === 0) return true;

        if (!hasFourValidURLs(screenshotInputs)) return false;

        return true;
    }


    function refresh(mgr) {
        if (!allURLsValid()) {
            mgr.addReason(REASON_TEXT);
        } else {
            mgr.removeReason(REASON_TEXT);
        }
    }

    const finder = setInterval(() => {
        if (document.readyState !== 'complete') return;

        const submitBtn = document.querySelector('#post, input[type="submit"][value="Submit"]');
        if (!submitBtn) return;

        const mgr = new UploadBlockerManager(submitBtn);
        mgr.attachOverrideCheckbox();

        clearInterval(finder);

        setInterval(() => refresh(mgr), 500);
    }, 500);
})();
