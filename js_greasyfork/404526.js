// ==UserScript==
// @name         AtoZ Weapon Stat Helper
// @namespace    http://tampermonkey.net/
// @version      1.0.0.4
// @description  Checks the stats of weapons and notifies of highest/lowest values
// @author       AlienZombie [2176352]
// @match        https://www.torn.com/bazaar.php*
// @source       https://greasyfork.org/en/scripts/404526-atoz-weapon-stat-helper
// @downloadURL https://update.greasyfork.org/scripts/404526/AtoZ%20Weapon%20Stat%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/404526/AtoZ%20Weapon%20Stat%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('AtoZ Weapon Stat Helper Started')

    var bazaarRoot = document.querySelector('#bazaarroot');
    var myDiv = document.createElement('div');
    myDiv.innerHTML = "<div style='border: 1px solid darkgreen;padding: 10px;border-radius: 5px;background-color: lightgreen;color: darkgreen;font-size: 14px;text-align: center;'><p style='font-weight: bold;margin-bottom: 10px;'>AtoZ Weapon Spec Helper Active!</p><p style='font-size: 11px;margin-top: 10px;'>Created by: <a href='https://www.torn.com/profiles.php?XID=2176352' class='menu-value___2xqSF' target='blank'>AlienZombie [2176352]</a></p></div>";
    bazaarRoot.parentNode.insertBefore(myDiv, bazaarRoot);

    let intervalId = setInterval(lookForBazaar, 500);
    let contentIntervalId = 0;

    function lookForBazaar() {
        let bazaarItemsNode = document.querySelector('div.ReactVirtualized__Grid.ReactVirtualized__List');

        console.log("bazaarItemsNode:");
        console.log(bazaarItemsNode);
        if (bazaarItemsNode) {
            startObserver(bazaarItemsNode);
            clearInterval(intervalId);
        }
    }

    function startObserver(bazaarItemsNode) {
        console.log("Observer Started");
        let observer = new MutationObserver(function(mutations) {
            console.log("Mutations:");
            console.log(mutations);
            mutations.forEach(function(mutation) {
                console.log("localName");
                console.log(mutation.target.localName);
                // if ((mutation.target.className.indexOf("chat-box-notebook_1JE1u") > -1) || (mutation.target.className.indexOf("chat-box-content_2C5UJ") > -1)) {
                    //console.log("Got the text");
                    //mutation.target.classList.add('bazaarItemsNode-text');
                    // if (contentIntervalId === 0) {
                        // document.querySelector('.chat-box-notebook_1JE1u').classList.add("bazaarItemsNode-text");
                        // contentIntervalId = setInterval(lookForContent, 500);
                    // }
                // }
            });
        });
        let config = { childList: true, subtree: true };
        observer.observe(bazaarItemsNode, config);
    }

    // function lookForContent() {
    //     let notebookContent = document.querySelector('.edit-note_1Cvo5');

    //     if (notebookContent) {
    //         notebookContent.classList.add("bazaarItemsNode-text");
    //         clearInterval(contentIntervalId);
    //         contentIntervalId = 0;
    //     }
    // }
})();