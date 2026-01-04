// ==UserScript==
// @name         PT Revive Helper
// @namespace    ptorn
// @version      0.2
// @description  Adds button on Hospital page for requesting revives.
// @author       aurigus
// @match        https://www.torn.com/hospitalview.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372837/PT%20Revive%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/372837/PT%20Revive%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
    var uid = 0;
    var userId = 0;
    var userName;
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].hasAttribute('uid')) uid = scripts[i].getAttribute('uid');
    }

    var infos = document.querySelectorAll("[class^=menu-info-row]")[0];
    if (infos) {
        userName = infos.getElementsByTagName("a")[0].innerHTML;
        userId = infos.getElementsByTagName("a")[0].href.match(/XID=(\d+)/)[1];
        console.log(userName, userId);
    } else {
        console.log('Couldnt get our info, abort!');
        return false;
    }

    var notificationElements = document.getElementsByClassName("msg-info-wrap");

    var reviveButton = document.createElement("button");
    reviveButton.id = "reviveMeButton";
    reviveButton.classList.add("reviveme-button");
    var t = document.createTextNode("Request Revive");
    reviveButton.appendChild(t);

    notificationElements[0].appendChild(reviveButton);

    reviveButton.onclick = function(event) {

        if (uid && userName) {
                var apiKey = null;
                var uniqueId = null;
                const req = new XMLHttpRequest();
                const url = 'https://ptorn.group/api/revive/';

                var data = {
                    apiKey: apiKey,
                    uniqueId: uniqueId,
                    uid:    uid,
                    name:   userName,
                };


                req.onreadystatechange = function() {
                    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                        try {
                            // if we are successful, do some sort of confirmation
                            console.log(JSON.parse(this.responseText));
                            let reviveMeButton = document.getElementById('reviveMeButton');
                            reviveMeButton.disabled = true;
                            while (reviveMeButton.firstChild) {
                                reviveMeButton.removeChild(reviveMeButton.firstChild);
                            }
                            let t = document.createTextNode("Revive Requested...");
                            reviveButton.appendChild(t);
                        } catch(err) {
                            console.log(err);
                        }
                    }
                };
                req.open("POST", url);
                req.setRequestHeader("Content-Type", "application/json");
                req.send(JSON.stringify(data));
            } else {
                return false;
            }
        }
    });
})();