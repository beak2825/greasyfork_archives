// ==UserScript==
// @name         Block New Player
// @namespace    microbes.torn.blocknewplayer
// @version      0.1
// @description  No more s-tier post in General Discussion
// @author       Microbes
// @match        https://www.torn.com/forums.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511747/Block%20New%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/511747/Block%20New%20Player.meta.js
// ==/UserScript==

let UID_LIMIT = parseInt(localStorage.getItem(`block_new_user_uid_limit`) || 3100000);

(function() {
    'use strict';

    // Start mutation observsor
    let currentUrl = window.location.href;

    function onUrlChange() {
        if (window.location.href == 'https://www.torn.com/forums.php' || window.location.href == 'https://www.torn.com/forums.php#/p=main') {
            waitForElementToExist('#updates').then((elm) => {
                $('#updates .update-wrap').prepend(`
                    <div class="dashboard w3" role="heading" aria-level="6">
                        <div class="title-black title-toggle active" role="button" aria-expanded="false">
                            <i class="arrow"></i>
                            Block New User Topic
                        </div>
                        <ul class="panel fm-list cont-gray bottom-round">
                            <li class="rating w3">
                                <label class='bold' for='block_uid_limit'>Starting From:</label> <input id="block_uid_limit" class="input-text" type="number" data-lpignore="true" value="${UID_LIMIT}">
                            </li>
                        </ul>
                    </div>

                    <hr class="delimiter-999 m-top10 m-bottom10">
                `);

                $('#block_uid_limit').change(() => {
                    UID_LIMIT = $('#block_uid_limit').val()
                    localStorage.setItem(`block_new_user_uid_limit`, UID_LIMIT);
                });
            });
        }
        else {
            waitForElementToExist('.forums-committee-wrap .pagination').then((elm) => {
                $('.starter .user').each((i, element) => {
                    var uid = $(element).prop('href').split('=')[1]

                    if (uid >= UID_LIMIT) {
                        $(element).parent().parent().parent().parent().remove();
                    }
                });
            });
        }
    }

    const observer = new MutationObserver(function(mutations) {
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            onUrlChange();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial call
    onUrlChange();
})();

function waitForElementToExist(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });
    });
}