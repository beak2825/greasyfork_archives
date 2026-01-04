// ==UserScript==
// @name         RDS Console Search Box Persistence
// @namespace    https://blog.vicshih.com
// @version      0.1
// @description  Persist RDS Console search box values per session.
// @author       Victor Shih
// @match        https://console.aws.amazon.com/rds/home*
// @grant        none
// @license      GPL-3.0-or-later

// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373167/RDS%20Console%20Search%20Box%20Persistence.user.js
// @updateURL https://update.greasyfork.org/scripts/373167/RDS%20Console%20Search%20Box%20Persistence.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    function addNewContentListener(root, targetSelector, callback) {
        let observer = new MutationObserver((mutations, observer) => {
            let $targets = $(root).find(targetSelector);

            if ($targets.length) {
                $targets.each(function () {
                    callback.call(this, observer);
                });
                return;
            }
        });

        observer.observe(root, {
            childList: true,
            subtree: true
        });
    }

    // Extract current subpage.
    function getSubpage() {
        return document.location.hash.split(':')[0].substr(1);
    }

    // Find index within list of visible search boxes.
    function findInputIndex(input) {
        return $('.awsui-input-type-search:visible').index(input);
    }

    function getSessionKey(input) {
        let subpage = getSubpage();
        let index = findInputIndex(input);
        return `${subpage}:q${index}`;
    }

    // Initialize search boxes from sessionStorage.
    addNewContentListener(document.body, 'awsui-table', function (observer) {
        if (this.getAttribute('initialized') != 'true') return;

        observer.disconnect();

        $('.awsui-input-type-search:visible').each(function () {
            let sessionKey = getSessionKey(this);
            let search = sessionStorage.getItem(sessionKey);

            if (search) {
                $(this).val(search).trigger('input');
            }
        });
    });

    // Key handler for search boxes.
    // Note that the initial startup triggers a superfluous (but benign) call to this.
    $(document.body).on('input', '.awsui-input-type-search:visible', function () {
        let sessionKey = getSessionKey(this);
        sessionStorage.setItem(sessionKey, this.value);
    });

})(jQuery);
