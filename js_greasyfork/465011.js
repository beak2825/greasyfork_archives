// ==UserScript==
// @name         WZ Common Mail Search button
// @namespace    http://tampermonkey.net/
// @version      2024-07-09
// @description  Creates a button on player profiles to quickly find common mails between yourself and the player
// @author       JK_3
// @match        https://www.warzone.com/Profile?p=*
// @match        https://www.warzone.com/profile?p=*
// @match        https://www.warzone.com/Profile?u=*
// @match        https://www.warzone.com/profile?u=*

// @downloadURL https://update.greasyfork.org/scripts/465011/WZ%20Common%20Mail%20Search%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/465011/WZ%20Common%20Mail%20Search%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let ownAccountID = document.querySelector(`a[href^="/Profile"]`).href.match(/p=(\d*)/gmi)[0].slice(4,-2)
    let accountID = document.location.href.match(/p=(\d*)/gmi)[0].slice(4,-2);

    if (accountID != ownAccountID ) { //dont create button on own account page

        let target = "https://www.warzone.com/Discussion/SearchPrivateDiscussions?PlayerID=" + accountID;

        let link = document.createElement("a");
        link.href = target;
        link.text = "Common mails";
        link.style.color = "#000000";

        let btn = document.createElement("button");
        btn.appendChild(link);
        btn.id = "commonMailSearchBtn";
        btn.style.cursor = "pointer";
        btn.onclick = target;

        let buttonDiv = document.createElement("div");
        buttonDiv.id = "commonMailSearch";
        buttonDiv.appendChild(document.createElement("br"));
        buttonDiv.appendChild(btn)

        let feedbackMsgElement = document.getElementById("FeedbackMsg");

        if (feedbackMsgElement != null) {
            // normal profile page
            feedbackMsgElement.insertAdjacentElement('beforeBegin', buttonDiv);
        } else {
            // profile page deleted
            let textElement = document.querySelector(`div[class^="container "]`);
            textElement.appendChild(buttonDiv);
        }
    }
})();