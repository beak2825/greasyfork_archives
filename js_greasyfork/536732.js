// ==UserScript==
// @name         Aviso.bz Auto Test Clicker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically clicks on tests from certain users on aviso.bz
// @author       kir0mi
// @match        https://aviso.bz/tasks-test
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536732/Avisobz%20Auto%20Test%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/536732/Avisobz%20Auto%20Test%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetUsers = ['user1', 'user2', 'user3'];

    function isTargetUser(userLink) {
        if (!userLink) return false;
        const username = userLink.textContent.trim();
        return targetUsers.includes(username);
    }

    function clickTargetTests() {
        const testLinks = document.querySelectorAll('a[onclick^="funcjs[\'go-test\']"]');

        const userLinks = document.querySelectorAll('a[href^="/wall?uid="][title="Стена автора теста"]');

        let clickedAny = false;

        testLinks.forEach((testLink, index) => {
            const userLink = userLinks[index];
            if (userLink && isTargetUser(userLink)) {
                testLink.click();
                clickedAny = true;
            }
        });

        if (!clickedAny) {
            console.log('');
        }
    }

    setTimeout(clickTargetTests, 2000);

    const observer = new MutationObserver(function(mutations) {
        clickTargetTests();
    });

    const contentContainer = document.getElementById('content') || document.body;
    observer.observe(contentContainer, {
        childList: true,
        subtree: true
    });

    console.log('');
})();