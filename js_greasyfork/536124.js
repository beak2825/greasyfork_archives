// ==UserScript==
// @name         _Download Tab Text
// @namespace    Violentmonkey
// @version      1.2
// @description  Downloads all visible text content of the active tab as a .txt file via context menu.
// @author       Vibe-Coded by Piknockyou
// @match        *://*/*
// @match        file:///*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAA+BJREFUeJzt2kuIHFUUBuCvE3XMgxnjSow6mxhBUMSgiPhA8BHjIkYJblz4xJ2CKGgWLtyoGwURFCGCgsYgqFHUYBAkwSx0YzAqUaIhigpqHhhHOzPJuLjdZqYzXVN1u251DdM/FNM1Vef131vn3Dq3GGCAbliKHzGZ8NiKJVUFVBQrpQ2+fewQyK4d2gTsSaD7HNNJ2K5PJCzoh9EZcDU+0IfHoS4EwDV4B4uqNFonAuAGvIvTqzJYNwLgRmxREQl1JIBAQiUzoa4EwE1CThhKaaTOBMBqiUmoOwFwM96WiIS5QACswRs4tWzFc4UAuA1vKpmEuUQAgYSXy1R4SqTcBbi2wP1NYfSarfNDOIyRCNu34u4IuRkRS8ALuL6gzFFsav0+ghUYLSC/FJ+iUdBuJmIJeBLfY2HO+w/iw47//dE68iJmtvSElK/DMRgR/DlUptK5lgRLx7wnIDYHjGCVdAQexU5MJNKfC1k54D3pe4WPd9hMkgNiZ8Bb0nZujuGThPpzYVAF5gPmPQGxOQCWlebFyZjAXwn150JWDnhF+ipwX4fNWlWBn3BAyS8mUzCO3xPpzo1BFZgPGBDQbwf6jdgkuAH3luTD31iHvV2uD+MiXNo6H8Jd+BrftOSTICsJvqa8cjeOyzr0N7BW2B5rZsj+g81C2zyqImUJrRSC/05ogk7FQuEjh7wtsSwcxp9TzlfheVxZUM92PIhdJfiE/pTBe2SPeJ7Z9EBZzlRNwAblPFLH8VgZDlVJwHrB8bLyynHcnsdwbBW4Q9icKJoDduFRwck2RvGqcpfVDWzE58KyPQpZM2CLuJEZc3InaXMB+W+xr8D9L80WZGwVONOJulwE+1v62rgQu2fxo42m8Ap+Fn7IaW9c2IHaX8DH/1FFDnhK/tFsvwSNFJCZxENZDvR7KbyuAhtrsi72k4BFOL8CO52rzGnIUwUWK74TnAejqhmAZcLXZv8WFVyhvLpcxhGbAyZxXrcgs2bAPqH311W4Rwzj8ozrY3hE+FxubZd7NgpJ+mnZs+lIjIOpcbbsUfuidV8DTwjfGBBmQBP3t84X4LcMPWOJ4+gJB2ST8KwTq83Vrb+LhQ+rCYl00yw6dqcOohe8b/bndyvOmEF2uTBLZpN/JmkEPWK9fElsj+mr0SvwS07Zon2FSjGEX+UL5KDQL3hY6ATlkdkp3d5FabhTutJ5VYVxRKOBj5Uf/ItVBtErhvGl8oLfgdMqjaAEnIuv9B78Nml3rpNiCV4XF/gxPKe3Lf/a4Dp8Jn/wH+HiGEN1LxGX4BbhbXR565jAz0KXZ5uweZK3QzTAAB34D24ra6lP/4d1AAAAAElFTkSuQmCC
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536124/_Download%20Tab%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/536124/_Download%20Tab%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to sanitize filenames (removes or replaces invalid characters)
    function sanitizeFilename(name) {
        // Remove characters that are invalid in Windows filenames
        // and also problematic on other OSes.
        let sanitized = name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
        // Replace multiple underscores with a single one
        sanitized = sanitized.replace(/_+/g, '_');
        // Trim leading/trailing underscores/spaces
        sanitized = sanitized.replace(/^_+|_+$/g, '').trim();
        // Limit length to avoid overly long filenames (e.g., 200 chars before extension)
        sanitized = sanitized.substring(0, 200);
        // If the title becomes empty after sanitization, use a default
        if (!sanitized) {
            return 'downloaded_page_text';
        }
        return sanitized;
    }

    function downloadPageText() {
        // 1. Get the page title
        let pageTitle = document.title || 'Untitled Page';
        let filename = sanitizeFilename(pageTitle) + ".txt";

        // 2. Get all text content
        // document.body.innerText is usually what you want, as it tries to
        // replicate what a user would see and be able to select.
        // It excludes script, style, and hidden elements' text.
        let textContent = document.body.innerText;

        if (!textContent || textContent.trim() === "") {
            alert("No text content found on the page or the body is empty.");
            return;
        }

        // 3. Use GM_download to trigger the download
        // GM_download handles creating the blob and download link automatically.
        try {
            GM_download({
                url: 'data:text/plain;charset=utf-8,' + encodeURIComponent(textContent),
                name: filename,
                saveAs: true, // Prompts user with a save dialog
                onerror: function(errorDetails) {
                    console.error("Download Error:", errorDetails);
                    alert("Failed to initiate download. Error: " + errorDetails.error + (errorDetails.details ? "\nDetails: " + errorDetails.details : ""));
                }
            });
        } catch (e) {
            // Fallback for older Tampermonkey/Violentmonkey or if GM_download is restricted somehow
            // Or if GM_download itself fails (though the onerror should catch most issues)
            console.warn("GM_download threw an error, attempting fallback:", e);
            try {
                const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (fallbackError) {
                console.error("Fallback download method also failed:", fallbackError);
                alert("Failed to download text using both methods. Check browser console for details.");
            }
        }
    }

    // Register the menu command
    // This will appear when you click the Violentmonkey extension icon and then
    // look under "Userscript Commands" for the current tab,
    // OR if your Violentmonkey settings allow, directly in the page's context menu.
    GM_registerMenuCommand("Download Page Text as .txt", downloadPageText, 'd');
    // The 'd' is an optional access key. You can press 'd' when the menu is open.
})();
