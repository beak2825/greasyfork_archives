// ==UserScript==
// @name         Copy Magnet Links
// @namespace    https://lynelluo.github.io/
// @version      0.1
// @description  Copy all magnet links on the page to the clipboard
// @author       lynel0625
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504725/Copy%20Magnet%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/504725/Copy%20Magnet%20Links.meta.js
// ==/UserScript==


(function() {
    // Function to copy magnet links to clipboard
    function copyMagnetLinks() {
        var magnets = [];
        var links = document.querySelectorAll('a[href^="magnet:"]');

        links.forEach(function(link) {
            magnets.push(link.href);
        });

        if (magnets.length > 0) {
            var magnetLinks = magnets.join("\n");

            var textarea = document.createElement("textarea");
            textarea.value = magnetLinks;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);

            showNotification("Copied magnet links:\n" + magnetLinks);
        } else {
            showNotification("No magnet links found.");
        }
    }

    // Function to show a notification
    function showNotification(message) {
        var notification = document.createElement("div");
        notification.innerText = message;
        notification.style.position = "fixed";
        notification.style.bottom = "50px";
        notification.style.left = "10px";
        notification.style.backgroundColor = "#333";
        notification.style.color = "#fff";
        notification.style.padding = "10px";
        notification.style.borderRadius = "5px";
        notification.style.zIndex = 1001;
        notification.style.fontSize = "14px";
        notification.style.opacity = "0.9";
        document.body.appendChild(notification);

        // Automatically remove the notification after 2 seconds
        setTimeout(function() {
            document.body.removeChild(notification);
        }, 2000);
    }


    // Create a button to trigger the copy action
    var button = document.createElement("button");
    button.innerText = "Copy Magnet Links";
    button.style.position = "fixed";
    button.style.bottom = "10px";
    button.style.left = "10px"; // Place the button in the bottom-left corner
    button.style.zIndex = 1000; // Make sure the button is on top of other elements
    document.body.appendChild(button);

    // Add event listener for the button
    button.addEventListener("click", function() {
        copyMagnetLinks();
    });
})();
