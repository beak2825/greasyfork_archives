// ==UserScript==
// @name         Go to Graph button
// @namespace    MALgraphGo
// @version      1.4
// @description  a quick way to open a user's anime graph profile from their MAL profile
// @author       Samu
// @match        https://myanimelist.net/profile/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/375105/Go%20to%20Graph%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/375105/Go%20to%20Graph%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = document.location.href;

    var matchUsername = url.match(/\/profile\/([a-zA-Z0-9_-]{2,16})/);
    var nameEl = document.querySelector("[name='profileUsername']");
    // check if username is available on the page, otherwise get it from url, otherwise empty
    var username = nameEl && nameEl.value || matchUsername && matchUsername[1] || "";
    var url = "https://anime.plus/" + username ;
    var queueUrl = url + "/queue-add";
    var addUserUrl = url + "/profile" + "?referral=search";
    var graphButton = document.createElement("a");
    var userButtons = document.querySelector("#content .user-profile .user-button");

    graphButton.href = addUserUrl;
    graphButton.className = "btn-profile-submit";
    graphButton.innerText = "Graph";
    graphButton.setAttribute("style", "width: 100%;margin-top: 4px;");
    graphButton.setAttribute("target", "_blank");
    graphButton.setAttribute("rel", "noopener");

    if (userButtons) {
      userButtons.appendChild(graphButton);

      graphButton.addEventListener("click", function() {
        GM_xmlhttpRequest({
          method: "GET",
          url: queueUrl
        });
      });
    }

})();