// ==UserScript==
// @name         Break the medium wall!
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license MIT 
// @description  Read premium content on medium.com or towardsdatascience.com (credit to freedium.cfd).
// @author       biganthonymo
// @match        *://*.medium.com/*
// @match        *://*.towardsdatascience.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498223/Break%20the%20medium%20wall%21.user.js
// @updateURL https://update.greasyfork.org/scripts/498223/Break%20the%20medium%20wall%21.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Create the button
    var button = document.createElement("button");
    button.innerHTML = '<img src="https://cdn.iconscout.com/icon/free/png-512/free-hammer-252-444777.png" style="width: 26px; height: 26px; vertical-align: middle; margin-right: 8px;">Break the medium wall!';
    button.style.position = "fixed";
    button.style.top = "50%";
    button.style.right = "10px";
    button.style.zIndex = "10000";
    button.style.padding = "10px 20px";
    button.style.backgroundColor = "#f66";
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.fontSize = "16px";
    button.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
    button.style.display = "flex";
    button.style.alignItems = "center";
 
    // Add the button to the body
    document.body.appendChild(button);
 
    // Add click event to the button
    button.addEventListener("click", function() {
        var currentUrl = window.location.href;
        var domain = new URL(currentUrl).hostname;

        if (domain.endsWith("medium.com") || domain.endsWith("towardsdatascience.com")) {
            var freeURL = "https://freedium.cfd/" + currentUrl;
            window.location.href = freeURL;
        } else {
            alert("This link is not under medium.com or towardsdatascience.com");
        }
    });
})();
