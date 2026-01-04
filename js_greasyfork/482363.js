// ==UserScript==
// @name         github repo delete auto confirm
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  auto complete the confirm input when deleting a repo on github
// @author       remisiki
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482363/github%20repo%20delete%20auto%20confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/482363/github%20repo%20delete%20auto%20confirm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // https://stackoverflow.com/a/56760883
    const rs = history.replaceState;
    history.replaceState = () => {
        rs.apply(history, arguments); // preserve normal functionality
        window.dispatchEvent(new Event("locationchange")); // do something extra here; raise an event
    };

    window.addEventListener("locationchange", () => {
        if (window.location.href.match(/https:\/\/github\.com\/.*?\/settings/g)) {
            const handler = () => {
                document.querySelector("#repo-delete-proceed-button").click();
                setTimeout(() => {
                    document.querySelector("#repo-delete-proceed-button").click();
                    setTimeout(() => {
                        const confirmBox = document.querySelector("#verification_field");
                        confirmBox.value = confirmBox.getAttribute("data-repo-nwo");
                        confirmBox.dispatchEvent(new Event("focus"));
                        confirmBox.dispatchEvent(new Event("input"));
                    }, 100);
                }, 0);
            };
            document.querySelector("#dialog-show-repo-delete-menu-dialog").addEventListener("click", handler);
        }
    });
})();
