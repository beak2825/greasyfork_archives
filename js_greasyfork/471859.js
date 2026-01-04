// ==UserScript==
// @name         Redirect WordPress Plugins to Instawp
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Redirect WordPress plugin links to Instawp.io
// @author       You
// @include      https://wordpress.org/plugins/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471859/Redirect%20WordPress%20Plugins%20to%20Instawp.user.js
// @updateURL https://update.greasyfork.org/scripts/471859/Redirect%20WordPress%20Plugins%20to%20Instawp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to redirect the URL to Instawp.io
    function redirectToInstawp(url) {
        var instawpURL = url.replace("https://wordpress.org/plugins/", "https://instawp.io/plugins/");
        window.location.href = instawpURL;
    }

    // Create an image element for the logo
    var logoImage = document.createElement("img");
    logoImage.src = "https://cdn.instawp.io/images/white.svg";  // old = https://instawpcom.b-cdn.net/wp-content/uploads/2022/11/logo_footer.svg
    logoImage.alt = "Launch InstaWP ";
    logoImage.style.height = "24px"; // Adjust the height as needed

    // Create a container div for the logo
    var logoContainer = document.createElement("div");
    logoContainer.style.padding = "2px 20px";
    logoContainer.style.backgroundColor = "#18B781";
    logoContainer.style.color = "#fff";
    logoContainer.style.border = "1px solid #000";
    logoContainer.style.borderRadius = "4px";
    logoContainer.style.cursor = "pointer";
    logoContainer.style.transition = "background-color 0.3s ease";
    logoContainer.style.marginLeft = "20px";
    logoContainer.style.fontSize = "14.4px";
    logoContainer.appendChild(logoImage);

    // Create a span element for the "Launch" text
    var launchSpan = document.createElement("span");
    launchSpan.textContent = "Launch";
    launchSpan.style.marginLeft = "6px";
    launchSpan.style.position = "relative";
    launchSpan.style.top = "-3px";

    // Add the span as a child to the logoContainer
    logoContainer.appendChild(launchSpan);

    // Add CSS hover effect
    logoContainer.addEventListener("mouseenter", function() {
        logoContainer.style.backgroundColor = "#337E76";
    });
    logoContainer.addEventListener("mouseleave", function() {
        logoContainer.style.backgroundColor = "#18B781";
    });

    // Add a click event listener to the logo container
    logoContainer.addEventListener("click", function() {
        // Get the current URL and redirect to Instawp
        redirectToInstawp(window.location.href);
    });

    // Find the "Download" button
    var downloadButton = document.querySelector('.plugin-actions a.plugin-download');

    // Insert the logo container after the "Download" button
    if (downloadButton) {
        downloadButton.parentNode.insertBefore(logoContainer, downloadButton.nextSibling);
    }
})();
