// ==UserScript==
// @name         redacted/manual mofo
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Insert RateYourMusic, Album of the Year, Bandcamp, Spotify, Qobuz, and YouTube Music links into the More info section, alphabetically sorted. Multiple links can be space-separated.
// @author       Your Name
// @match        https://redacted.sh/torrents.php?action=editgroup&groupid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528329/redactedmanual%20mofo.user.js
// @updateURL https://update.greasyfork.org/scripts/528329/redactedmanual%20mofo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for DOM to load
    window.addEventListener('load', function() {
        // Find the container that wraps the textarea
        var wrap = document.getElementById('textarea_wrap_0');
        if (!wrap) return;

        // Create a container for our input and button
        var container = document.createElement('div');
        container.style.margin = "10px 0";

        // Create the input textbox
        var inputBox = document.createElement('input');
        inputBox.type = "text";
        inputBox.placeholder = "Enter RYM/AOT/Spotify/Bandcamp/Qobuz/YouTube Music links separated by spaces";
        inputBox.style.width = "70%";
        inputBox.style.marginRight = "10px";

        // Create the submit button
        var submitButton = document.createElement('button');
        submitButton.textContent = "Submit";

        // Append input and button to our container
        container.appendChild(inputBox);
        container.appendChild(submitButton);

        // Insert our container after the wrap element
        wrap.parentNode.insertBefore(container, wrap.nextSibling);

        // Get the textarea element
        var textarea = document.getElementById('body');
        if (!textarea) return;

        // When the button is clicked:
        submitButton.addEventListener('click', function() {
            // Split input by any whitespace into an array of URLs
            var urls = inputBox.value.trim().split(/\s+/);
            if (urls.length === 0 || !urls[0]) return;

            // Filter for valid links (rateyourmusic.com, albumoftheyear, bandcamp.com, spotify.com, qobuz.com, or music.youtube.com)
            var validLinks = urls.filter(function(url) {
                return url.indexOf("rateyourmusic.com") !== -1 ||
                       url.indexOf("albumoftheyear") !== -1 ||
                       url.indexOf("bandcamp") !== -1 ||
                       url.indexOf("spotify.com") !== -1 ||
                       url.indexOf("qobuz.com") !== -1 ||
                       url.indexOf("music.youtube.com") !== -1;
            });

            if (validLinks.length === 0) {
                alert("Please enter at least one valid rateyourmusic.com, albumoftheyear, bandcamp.com, spotify.com, qobuz.com, or music.youtube.com link.");
                return;
            }

            // Prepare new links markup array
            var newLinkMarkups = validLinks.map(function(url) {
                var linkLabel = "";
                if (url.indexOf("rateyourmusic.com") !== -1) {
                    linkLabel = "RYM";
                } else if (url.indexOf("albumoftheyear") !== -1) {
                    linkLabel = "AOTY";
                } else if (url.indexOf("spotify.com") !== -1) {
                    linkLabel = "Spotify";
                } else if (url.indexOf("bandcamp.com") !== -1) {
                    linkLabel = "Bandcamp";
                } else if (url.indexOf("qobuz.com") !== -1) {
                    linkLabel = "Qobuz";
                } else if (url.indexOf("music.youtube.com") !== -1) {
                    linkLabel = "YT";
                } else {
                    linkLabel = url;
                }
                return `[url=${url}]${linkLabel}[/url]`;
            });

            // Get the current textarea content
            var text = textarea.value;
            var moreInfoTag = '[b]More info:[/b]';
            var idx = text.indexOf(moreInfoTag);
            if (idx === -1) {
                // If no More info exists, append it at the end with the new links
                textarea.value = text + "\n\n" + moreInfoTag + " " + newLinkMarkups.join(" | ");
            } else {
                // Split the content into two parts: before and after the More info tag
                var before = text.substring(0, idx);
                var after = text.substring(idx + moreInfoTag.length).trim();

                // Remove any leading colon or dash from the after part
                if (after.charAt(0) === ':' || after.charAt(0) === '-') {
                    after = after.substring(1).trim();
                }

                // If there are already some links, split them by " | "
                var links = [];
                if (after) {
                    links = after.split(" | ").map(function(link) {
                        return link.trim();
                    }).filter(function(link) { return link.length > 0; });
                }

                // Add each new link if it does not already exist
                newLinkMarkups.forEach(function(newLink) {
                    if (links.indexOf(newLink) === -1) {
                        links.push(newLink);
                    }
                });

                // Sort the links alphabetically based on the link label extracted from [url=...]{label}[/url]
                links.sort(function(a, b) {
                    var labelA = a.match(/\](.*?)\[/);
                    var labelB = b.match(/\](.*?)\[/);
                    labelA = labelA ? labelA[1].toLowerCase() : "";
                    labelB = labelB ? labelB[1].toLowerCase() : "";
                    if (labelA < labelB) return -1;
                    if (labelA > labelB) return 1;
                    return 0;
                });

                // Reassemble the text with the updated More info block
                var newMoreInfo = moreInfoTag + " " + links.join(" | ");
                textarea.value = before + newMoreInfo;
            }

            // Clear the input box after processing
            inputBox.value = "";
        });
    });
})();
