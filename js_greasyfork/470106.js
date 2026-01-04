// ==UserScript==
// @name         Profile Links are now attack links
// @namespace    profile.links.are.now.attack.links
// @version      1.0.3
// @description  Replace all profile links with attack links
// @author       Heasley
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/blacklist.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470106/Profile%20Links%20are%20now%20attack%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/470106/Profile%20Links%20are%20now%20attack%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // create observer to wait for faction name to appear on the page
    var profileLinkObserver = new MutationObserver(function(mutations, observer) {

        $(".content-wrapper a[href*='profiles.php?XID=']").each(function() {
            const a = $(this);
            const name = a.text();
            const href = a.attr('href');
            const userID = href.replace("/profiles.php?XID=","").replace(/\D/g, "");
            const attackURL = "https://www.torn.com/loader.php?sid=attack&user2ID=" + userID;

            a.off('click').on('click', function (e) {
                e.preventDefault();
                window.open(attackURL);

                return false;
            });
        });

    });
    const target = document.querySelector('.content-wrapper');
    const obsOptions = {attributes: false, childList: true, characterData: false, subtree:true};

    profileLinkObserver.observe(target, obsOptions);
})();