// ==UserScript==
// @name         HelpShift Admin URL
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Переход в админку профиля игрока
// @author       kolodkinvalentin@gmail.com
// @match        https://playkot.helpshift.com/admin/issues/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=helpshift.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467138/HelpShift%20Admin%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/467138/HelpShift%20Admin%20URL.meta.js
// ==/UserScript==

// @run-at document-end

(function() {
    'use strict';

    var everythingLoaded = setInterval(function() {
        if (document.readyState === 'complete') {
            let issuePage = document.getElementsByClassName('hs-page__container')[0];

            if (issuePage !== null && issuePage !== undefined) {
                clearInterval(everythingLoaded);

                issuePage.addEventListener('click', event => {
                    if (event.target.textContent === 'admin_url') {
                        let cfiInputs = event.target.parentElement.parentElement.getElementsByTagName('input');
                        if (cfiInputs.length > 0) {
                            let adminUrl = cfiInputs[0].value;
                            if (adminUrl.startsWith('http')) {
                                window.open(adminUrl);
                            }
                        }
                    }
                });
            }
        }
    }, 200);

})();
