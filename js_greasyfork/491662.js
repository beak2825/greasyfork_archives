// ==UserScript==
// @name         Grab User Details from Profile Tools
// @namespace    https://greasyfork.org/en/users/1265537-kloob
// @version      1.0
// @description  Extracts user information and creates a button to copy it in a formatted manner on mod profile tools page.
// @author       kloobert @ gaia
// @match        https://www.gaiaonline.com/admin/user/mod/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/491662/Grab%20User%20Details%20from%20Profile%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/491662/Grab%20User%20Details%20from%20Profile%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getUserInfo() {
        // Extract username
        let usernameText;
        let paragraphs = document.querySelectorAll("p");
        for (let p of paragraphs) {
            if (p.textContent.includes("Username:")) {
                usernameText = p.textContent;
                break;
            }
        }

        if (!usernameText) {
            console.error("Username text not found");
            return null;
        }

        let username = usernameText.split("Username:")[1].split("(")[0].trim();

        // Extract user ID
        let userID;
        for (let p of paragraphs) {
            if (p.textContent.includes("ID:")) {
                let possibleIDText = p.textContent.split("ID:")[1].trim();
                if (possibleIDText) {
                    userID = possibleIDText;
                    break;
                }
            }
        }

        if (!userID) {
            console.error("User ID not found");
            return null;
        }

        let profileToolsURL = `https://www.gaiaonline.com/admin/user/mod/${userID}`;
        let moddogURL = `https://www.gaiaonline.com/moddog/note/search/${userID}/`;

        let formattedString = `[size=14][b]${username}[/b] | [${userID}][/size]\n[url=${profileToolsURL}]Profile Tools[/url] | [url=${moddogURL}]Moddog[/url]`;
        return formattedString;
    }

    function insertButton() {
        let button = document.createElement("button");
        button.textContent = "Copy Info";
        button.style.margin = "10px";

        let userStatusParagraph = document.querySelector("p[title^='Updated']");
        if (userStatusParagraph) {
            userStatusParagraph.parentNode.insertBefore(button, userStatusParagraph.nextSibling);
        } else {
            console.error("User status paragraph not found");
            return;
        }

        button.addEventListener("click", function() {
            let info = getUserInfo();
            if (info) {
                GM_setClipboard(info, "text");
                alert("Information copied to clipboard!");
            } else {
                alert("Failed to extract user info.");
            }
        });
    }

    window.addEventListener("load", insertButton);
})();
