// ==UserScript==
// @name         Instagram Threads Checker (OSINT)
// @version      1.4
// @description  Check if an instagram username has a threads profile by scraping
// @author       SH3LL
// @match        *://www.instagram.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/526760/Instagram%20Threads%20Checker%20%28OSINT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526760/Instagram%20Threads%20Checker%20%28OSINT%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // RUN ONLY IN USER PROFILES PAGES
    let url = window.location.href;
    let regex = /^https:\/\/www\.instagram\.com\/([a-zA-Z0-9_\.]+)\/$/;
    let match = url.match(regex);
    if (!match) {
        return;
    }


    function checkThreadsAccount(username) {
        console.log(username)
        if (!username) return;
        let threadsURL = `https://www.threads.net/@${username}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: threadsURL,
            onload: function(response) {

                let popup = document.createElement('div');
                popup.style.cssText = `
                   position: absolute;
                   top: 5px;
                   right: 43%;
                   background-color: black;
                   border: 1px solid #ccc;
                   padding: 5px;
                   padding-right: 18px;
                   border-radius: 5px;
                   z-index: 9999;
                   font-weight: bold;
                   `;

                // Create close button
                const closeButton = document.createElement('span');
                closeButton.innerHTML = '&times;'; // "x" character
                closeButton.style.cssText = `
                   position: absolute;
                   top: 5px;
                   right: 5px;
                   cursor: pointer;
                   color: white;
                   padding-left: 5px;
                   `;
                closeButton.onclick = function() {
                    if (popup) {
                        popup.remove();
                        popup = null;
                        labelAdded = false;
                    }
                };
                popup.appendChild(closeButton);

                const link = document.createElement('a');
                link.target = "_blank";

                if (response.status === 200 && response.responseText.includes('<meta property="og:type" content="profile" />')) {

                    link.href = threadsURL;
                    link.innerText = "Threads Profile: Found"
                    link.style.color = 'Chartreuse';

                } else {

                    link.style.color = 'red';
                    link.innerText = `Threads Profile: Not Found`;
                }

                popup.appendChild(link);
                document.body.appendChild(popup);
            }
        });
    }

    setTimeout(() => {
        let username = window.location.href.replace("https://www.instagram.com/","").split("/")[0];
        console.log("IG username: "+username);
        checkThreadsAccount(username);
    }, 3000);
})();
