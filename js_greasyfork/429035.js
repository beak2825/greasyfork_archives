// ==UserScript==
// @name         AO3 Exchange requests' names link to their profiles
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  adds linked names to requests
// @author       exuvia
// @match        https://archiveofourown.org/collections/*/requests*
// @match        https://archiveofourown.org/collections/*/assignments/*
// @icon         http://archiveofourown.org/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/429035/AO3%20Exchange%20requests%27%20names%20link%20to%20their%20profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/429035/AO3%20Exchange%20requests%27%20names%20link%20to%20their%20profiles.meta.js
// ==/UserScript==

(function () {
    Array.from(document.getElementsByClassName("header module")).forEach(authorBox => {
        let ele = authorBox.children[0];
        let keep = ele.innerText.split(" by ");
        let authorName = keep.pop();
        ele.innerText = keep.join("") + " by ";
        let linkedName = document.createElement('a');
        if (authorName.indexOf("(") > -1) {
            let username = authorName.split("(")[1].split(")")[0];
            let pseud = authorName.split(" (")[0];
            linkedName.href = "https://archiveofourown.org/users/" + username + "/pseuds/" + pseud;
        } else {
            linkedName.href = "https://archiveofourown.org/users/" + authorName;
        }
        linkedName.innerText = authorName;
        ele.appendChild(linkedName);
    })
})();