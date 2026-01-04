// ==UserScript==
// @name         Copy Title and URL as Markdown
// @namespace    https://lynelluo.github.io/
// @version      1.10
// @description  Copy current page title and URL in Markdown format using a hotkey or button
// @author       lynel0625
// @match        *://*/*
// @grant        none
// @icon         https://raw.githubusercontent.com/Lynelluo/scriptastic-toolbox/main/scripts/Copy%20Title%20and%20URL%20as%20Markdown.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504183/Copy%20Title%20and%20URL%20as%20Markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/504183/Copy%20Title%20and%20URL%20as%20Markdown.meta.js
// ==/UserScript==
(function() {
    // Function to copy title and URL as Markdown
    function copyMarkdown() {
        var title = document.title;
        var url = window.location.href;
        var markdown;
        // Regular expression to check for common image file extensions
        var imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|tiff)$/i;
        // Determine if URL points to an image file
        if (imageExtensions.test(url)) {
            markdown = `![${title}](${url})`; // Markdown format for images
        } else {
            markdown = `[${title}](${url})`; // Markdown format for other links
        }

        var textarea = document.createElement("textarea");
        textarea.value = markdown;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        showNotification("Copied as Markdown: " + markdown);
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

    // Add event listener for 'Ctrl + Shift + y' or 'Command + Shift + y' shortcut
    document.addEventListener('keydown', function(e) {
        if ((e.key === 'y' || e.key === 'Y') && e.shiftKey) {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault(); // prevent default action
                copyMarkdown();
            }
        }
    });

    // Create a button to trigger the copy action
    var button = document.createElement("button");
    button.innerText = "Copy as Markdown";
    button.style.position = "fixed";
    button.style.bottom = "10px";
    button.style.left = "10px"; // Place the button in the bottom-left corner
    button.style.zIndex = 1000; // Make sure the button is on top of other elements
    document.body.appendChild(button);

    // Add event listener for the button
    button.addEventListener("click", function() {
        copyMarkdown();
    });
})();
