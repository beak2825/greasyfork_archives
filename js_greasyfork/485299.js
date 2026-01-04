// ==UserScript==
// @name         Torn Bazaar Blocker
// @namespace    http://tampermonkey.net/
// @version      2024-01-20
// @description  Add bazaars in Torn to a bloclist to prevent dodgy sellers.
// @author       Ballig
// @match        https://www.torn.com/bazaar.php?userId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/485299/Torn%20Bazaar%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/485299/Torn%20Bazaar%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `
    .bazaarBlock {
        pointer-events: none;
    }
    .bazaarBlockMsg {
        font-weight: bold;
        color: red;
        font-size: 150%;
    }
` );

    GM_registerMenuCommand('Add user to blacklist', () => {
        let BB_blacklist_JSON = GM_getValue("BB_blacklist", '[]');
        let BB_blacklist = JSON.parse(BB_blacklist_JSON);

        var new_blacklist = prompt("Enter the user ID to blacklist");

        if (new_blacklist) {
            if (BB_blacklist.includes(new_blacklist)) {
                alert('That user is already blacklisted.');
            }
            else {
                alert('User added to blacklist.');
                BB_blacklist.push(new_blacklist);
            }
        }
        GM_setValue("BB_blacklist", JSON.stringify(BB_blacklist));
    });

    GM_registerMenuCommand('Remove user from blacklist', () => {
        let BB_blacklist_JSON = GM_getValue("BB_blacklist", '[]');
        let BB_blacklist = JSON.parse(BB_blacklist_JSON);

        var new_blacklist = prompt("Enter the user ID to remove from your blacklist");

        if (new_blacklist) {
            if (!BB_blacklist.includes(new_blacklist)) {
                alert('That user is not blacklisted.');
            }
            else {
                alert('User removed from your blacklist.');
                const index = BB_blacklist.indexOf(new_blacklist);

                if (index >= 0) {
                    BB_blacklist.splice(index, 1);
                }
            }
        }
        GM_setValue("BB_blacklist", JSON.stringify(BB_blacklist));
    });

    const urlParams = new URLSearchParams(window.location.search);

    const userId = urlParams.get('userId');

    let BB_blacklist_JSON = GM_getValue("BB_blacklist", '[]');
    let BB_blacklist = JSON.parse(BB_blacklist_JSON);

    if (userId && BB_blacklist.includes(userId)) {
        var observeNode = document.getElementById('bazaarRoot');

        const config = { attributes: false, childList: true, subtree: true };

        let reactObserver = new MutationObserver(blockBazaar);
        reactObserver.observe(observeNode, config);
    }

    function blockBazaar(mutationList, observer) {
        var bazaar = document.getElementsByClassName('itemsContainner___tVzIR')[0];
        var message = document.getElementsByClassName('loaderText___d8TAE')[0];

        if (bazaar && !bazaar.classList.contains('bazaarBlock')) {// && !bazaarBlock) {
            bazaar.classList.add('bazaarBlock');
            if (message) {
                message.innerText = "THIS BAZAAR IS BLOCKED BY TORN BAZAAR BLOCKER.";
                message.classList.add('bazaarBlockMsg');
            }
        }
    }
})();