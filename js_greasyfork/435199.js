// ==UserScript==
// @name        Gelbooru Overhaul
// @namespace   https://github.com/Enchoseon/gelbooru-overhaul-userscript/raw/main/gelbooru-overhaul.user.js
// @version     0.7.2
// @description Various toggleable changes to Gelbooru such as enlarging the gallery, removing the sidebar, and more.
// @author      Enchoseon
// @include     *gelbooru.com*
// @run-at      document-start
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_download
// @downloadURL https://update.greasyfork.org/scripts/435199/Gelbooru%20Overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/435199/Gelbooru%20Overhaul.meta.js
// ==/UserScript==

(function() {
    "use strict";
    // =============
    // Configuration
    // =============
    const config = {
        general: {
            amoled: true, // A very lazy Amoled theme
			autoDarkMode: true, // Apply Amoled theme if system in Dark mode, higher priority than 'amoled'
            autoDarkModeForceTime: false, // Ignore system theme and check time for dark mode
            autoDarkModeStartHour: 19, // Start and End time if ForceTime is enabled or system does not supports dark mode
            autoDarkModeEndHour: 7,
            sexySidebar: true, // Move the leftmost sidebar to the top-left of the screen next to the Gelbooru logo
        },
        post: {
            fitVertically: true, // Scale media to fit vertically in the screen
            center: true, // Center media
        },
        gallery: {
            removeTitle: true, // Removes the title attribute from thumbnails
            rightClickDownload: true, // Makes it so that when you right-click thumbnails you'll download their highest-resolution counterpart
            rightClickDownloadSaveAsPrompt: false, // Show the "Save As" File Explorer prompt when right-click downloading
            enlargeFlexbox: true, // Make the thumbnails in the gallery slightly larger & reduce the number of columns
            enlargeThumbnailsOnHover: true, // Make the thumbnails in the gallery increase in scale when you hover over them (best paired with gallery.higherResThumbnailsOnHover)
            higherResThumbnailsOnHover: true, // Make the thumbnails in the gallery higher-resolution when you hover over them
            advancedBlacklist: true, // Use the advanced blacklist that supports AND operators & // comments
            advancedBlacklistConfig: `
                // Humans
                realistic
                photo_(medium)
                // Extremely Niche Kinks
                egg_laying
                minigirl penis_hug
                // Shitty Artists
                shadman
                morrie
            `, // ^ This arbitrary blacklist is purely for demo purposes. For a larger blacklist, see blacklist.txt in the GitHub repository
        },
        download: {
            blockUnknownArtist: true, // Block the download of files without a tagged artist
            missingArtistText: "_unknown-artist", // Text that replaces where the artist name would usually be in images missing artist tags
        },
    };
    var css = "";
    // =======================================================
    // Higher-Resolution Preview When Hovering Over Thumbnails
    //        Download Images in Gallery on Right-Click
    //               Remove Title from Thumbnails
    //                    Advanced Blacklist
    // =======================================================
    if (config.gallery.higherResThumbnailsOnHover || config.gallery.rightClickDownload || config.gallery.removeTitle || config.gallery.advancedBlacklist) {
        document.addEventListener("DOMContentLoaded", function () {
            Object.values(document.querySelectorAll(".thumbnail-preview")).forEach((elem) => {
                var aElem = elem.querySelector("a");
                var imgElem = aElem.querySelector("img");
                if (config.gallery.higherResThumbnailsOnHover) { // Higher-Resolution Preview When Hovering Over Thumbnails
                    imgElem.addEventListener("mouseenter", function() {
                        convertThumbnail(imgElem, aElem, false);
                    }, false);
                }
                if (config.gallery.rightClickDownload) { // Download Images in Gallery on Right-Click
                    imgElem.addEventListener("contextmenu", (event) => {
                        event.preventDefault();
                        convertThumbnail(imgElem, aElem, true).then(function() {
                            downloadImage(imgElem, aElem);
                        });
                    })
                }
                if (config.gallery.removeTitle) { // Remove Title from Thumbnails
                    imgElem.title = "";
                }
                if (config.gallery.advancedBlacklist) { // Advanced Blacklist
                    config.gallery.advancedBlacklistConfig.forEach((blacklistLine) => {
                        if (blacklistLine.includes("&&")) { // AND statements
                            var remove = true;
                            blacklistLine = blacklistLine.split("&&");
                            blacklistLine.forEach((andArg) => {
                                if (!tagFound(andArg)) {
                                    remove = false;
                                }
                            });
                            if (remove) {
                                elem.remove();
                            }
                        } else if (tagFound(blacklistLine)) { // Simple & straightforward blacklisting
                            elem.remove();
                        }
                    });
                    function tagFound(query) { // Check if a tag is present in the imgElem
                        var tags = imgElem.alt.split(",");
                        tags = tags.map(tag => tag.trim())
                        if (tags.includes(query)) {
                            return true;
                        }
                        return false;
                    }
                }
            });
            Object.values(document.querySelector(".mainBodyPadding").querySelectorAll("div")).reverse()[1].querySelectorAll("a").forEach((aElem) => {
                var imgElem = aElem.querySelector("img");
                if (config.gallery.higherResThumbnailsOnHover) { // Higher-Resolution Preview When Hovering Over Thumbnails
                    imgElem.addEventListener("mouseenter", function() {
                        convertThumbnail(imgElem, aElem, false);
                    }, false);
                }
                if (config.gallery.rightClickDownload) { // Download Images in Gallery on Right-Click
                    imgElem.addEventListener("contextmenu", (event) => {
                        event.preventDefault();
                        convertThumbnail(imgElem, aElem, true).then(function() {
                            downloadImage(imgElem, aElem);
                        });
                    })
                }
                if (config.gallery.removeTitle) { // Remove Title from Thumbnails
                    imgElem.title = "";
                }
                if (config.gallery.advancedBlacklist) { // Advanced Blacklist
                    config.gallery.advancedBlacklistConfig.forEach((blacklistLine) => {
                        if (blacklistLine.includes("&&")) { // AND statements
                            var remove = true;
                            blacklistLine = blacklistLine.split("&&");
                            blacklistLine.forEach((andArg) => {
                                if (!tagFound(andArg)) {
                                    remove = false;
                                }
                            });
                            if (remove) {
                                elem.remove();
                            }
                        } else if (tagFound(blacklistLine)) { // Simple & straightforward blacklisting
                            elem.remove();
                        }
                    });
                    function tagFound(query) { // Check if a tag is present in the imgElem
                        var tags = imgElem.alt.split(",");
                        tags = tags.map(tag => tag.trim())
                        if (tags.includes(query)) {
                            return true;
                        }
                        return false;
                    }
                }
            });
        });
    }
    // =================================
    // Make Leftmost Sidebar Collapsable
    // =================================
    if (config.general.sexySidebar && window.location.search !== "") {
        document.addEventListener("DOMContentLoaded", function () {
            var div = document.createElement("div");
            div.id = "sidebar";
            div.innerHTML = document.querySelectorAll(".aside")[0].innerHTML;
            document.body.appendChild(div);
        });
        css += `
          .aside {
              grid-area: aside;
              display: none;
          }
          #container {
              grid-template-columns: 0px auto;
          }
          #sidebar {
              position: fixed;
              width: 4px;
              height: 100%;
              padding-top: 60px;
              overflow: hidden;
              background: red;
              top: 0;
              left: 0;
              transition: 142ms;
              z-index: 420690;
          }
          #sidebar:hover {
              position: fixed;
              width: 240px;
              height: 100%;
              padding-top: 0px;
              overflow-y: scroll;
              background: ${isDarkMode() ? 'black' : 'white'};
              opacity: 0.9;
          }
      `;
    }
    // =============================
    // Scale Media To Fit Vertically
    // =============================
    if (config.post.fitVertically) {
        css += `
          #image, #gelcomVideoPlayer {
              height: 90vh !important;
              width: auto !important;
          }
      `;
      // resize to fit horizontally on 'Click here to expand image.'
        document.addEventListener("DOMContentLoaded", function () {
            let resizeLink = document.querySelector("#resize-link").querySelector("a");
            let oldOnClick = resizeLink.onclick;
            resizeLink.onclick = function(event) {
                oldOnClick(event);
                Object.values(document.querySelectorAll("#image, #gelcomVideoPlayer")).forEach((elem) => {
                    elem.style.cssText += `
                        height: auto !important;
                        width: 95vw !important;
                    `;
                });
            };
        });
    }
    // ============
    // Center Media
    // ============
    if (config.post.center) {
        css += `
          .image-container {
              display: flex !important;
              justify-content: center;
          }
      `;
    }
    // ===========================
    // Enlarge Thumbnails On Hover
    // ===========================
    if (config.gallery.enlargeThumbnailsOnHover) {
        css += `
          .thumbnail-preview a img {
              transform: scale(1);
              transition: transform 169ms;
          }
          .thumbnail-preview a img:hover {
              transform: scale(2.42);
              transition-delay: 142ms;
          }
          .thumbnail-preview:hover {
              position: relative;
              z-index: 690;
          }
          .mainBodyPadding div a img {
              max-height: 10vw !important;
              transform: scale(1);
              transition: transform 169ms;
          }
          .mainBodyPadding div a img:hover {
              transform: scale(2.42);
              transition-delay: 142ms;
              position: relative;
              z-index: 690;
          }
      `;
    }
    // =======================
    // Enlarge Gallery Flexbox
    // =======================
    if (config.gallery.enlargeFlexbox) {
        css += `
          .thumbnail-preview {
              height: 21em;
              width: 20%;
          }
          .thumbnail-preview {
              transform: scale(1.42);
          }
          html, body {
              overflow-x: hidden;
          }
          .searchArea {
              z-index: 420;
          }
          #paginator {
              margin-top: 6.9em;
          }
          main {
              margin-top: 1.21em;
          }
      `;
    }
    // ===========================
    // Extremely Lazy Amoled Theme
    // ===========================
    if (isDarkMode()) {
        css += `
          body, #tags-search {
              color: white;
          }
          .note-body {
              color: black !important;
          }
          .aside, .searchList, header, .navSubmenu, #sidebar {
              filter: saturate(42%);
          }
          .thumbnail-preview a img {
              border-radius: 0.42em;
          }
          #container, header, .navSubmenu, body, .alert-info, footer, html, #tags-search {
              background-color: black !important;
              background: black !important;
          }
          .searchArea a, .commentBody, textarea, .ui-menu {
              filter: invert(1) saturate(42%);
          }
          .aside, .alert-info, #tags-search {
              border: unset;
          }
      `;
    }
    // ==========
    // Inject CSS
    // ==========
    (function() {
        var s = document.createElement("style");
        s.setAttribute("type", "text/css");
        s.appendChild(document.createTextNode(css));
        document.querySelector("head").appendChild(s);
    })();
    // =================
    // Process Blacklist
    // =================
    (function() {
        var blacklist = config.gallery.advancedBlacklistConfig.split(/\r?\n/);
        var output = [];
        blacklist.forEach((line) => { // Convert blacklist to array form
            line = line.trim();
            if (!line.startsWith("//") && line !== "") { // Ignore comments
                output.push(line.replace(/ /g, "&&") // Marker to tell the blacklist loop this is an AND statement
                                .replace(/_/g, " ") // Format to be same as imgElem alt text
                                .toLowerCase()
                           );
            }
        });
        config.gallery.advancedBlacklistConfig = output;
    })();
    // ================
    // Utility Functions
    // ================
    // Get higher-resolution counterpart of a thumbnail
    function convertThumbnail(imgElem, aElem, highestQuality) {
        return new Promise(function(resolve, reject) {
            var gelDB = GM_getValue("gelDB", {});
            var index = hash(aElem.href);
            if (!gelDB[index] || (highestQuality && !gelDB[index].high) || (!gelDB[index].medium)) { // Request higher-resolution image (unless it's already indexed)
                var xobj = new XMLHttpRequest();
                xobj.open("GET", aElem.href, true);
                xobj.onreadystatechange = function() {
                    if (xobj.readyState == 4 && xobj.status == "200") {
                        const responseDocument = new DOMParser().parseFromString(xobj.responseText, "text/html");
                        if (responseDocument.querySelector("#gelcomVideoPlayer")) { // Reject videos
                            reject("Gelbooru Overhaul doesn't support videos in convertThumbnail() or downloadImage() yet.");
                            if (highestQuality) {
                                alert("Gelbooru Overhaul doesn't support videos in convertThumbnail() or downloadImage() yet.");
                            }
                            return;
                        }
                        gelDB[index] = {};
                        gelDB[index].tags = convertTagElem(responseDocument.querySelector("#tag-list")); // Grab tags
                        gelDB[index].medium = responseDocument.querySelector("#image").src; // Get medium-quality src
                        gelDB[index].high = responseDocument.querySelectorAll("script:not([src])"); // Get highest-quality src
                        gelDB[index].high = gelDB[index].high[gelDB[index].high.length - 1]
                            .innerHTML
                            .split(`image.attr('src','`)[1]
                            .split(`');`)[0];
                        GM_setValue("gelDB", gelDB);
                        output();
                    }
                };
                xobj.send(null);
            } else { // Skip the AJAX voodoo if it's already indexed. Added bonus of cache speed.
                output();
            }
            function output() {
                if (highestQuality) {
                    imgElem.src = gelDB[index].high;
                } else {
                    imgElem.src = gelDB[index].medium;
                }
                resolve();
            }
        });
    }
    // Convert tag list elem into a friendlier object
    function convertTagElem(tagElem) {
        var tagObj = {
            "artist": [],
            "character": [],
            "copyright": [],
            "metadata": [],
            "general": [],
            "deprecated": [],
        };
        Object.values(tagElem.querySelectorAll("li")).forEach((tag) => {
            if (tag.className.startsWith("tag-type-")) {
                var type = tag.className.replace("tag-type-", "");
                tag = tag.querySelector("span a")
                    .href
                    .replace("https://gelbooru.com/index.php?page=wiki&s=list&search=", "");
                tagObj[type].push(tag);
            }
        });
        return tagObj;
    }
    // Generate hash from string (https://stackoverflow.com/a/52171480)
    function hash(str, seed = 0) {
        let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
        h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
        return 4294967296 * (2097151 & h2) + (h1>>>0);
    };
    // Download image
    function downloadImage(imgElem, aElem) {
        var gelDB = GM_getValue("gelDB", {});
        var index = hash(aElem.href);
        var extension = imgElem.src.split(".").at(-1);
        var artist = gelDB[index].tags.artist.join(" ");
        if (config.download.blockUnknownArtist && artist === "") { // Don't download if blockUnknownArtist is enabled and artist tag is missing
            return;
        }
        GM_download({
            url: imgElem.src,
            name: formatFilename(artist, index, extension),
            saveAs: config.gallery.rightClickDownloadSaveAsPrompt,
        })
    }
    // Create the filename from the artist's name
    function formatFilename(artist, index, extension) {
        if (artist === "") {
            artist = config.download.missingArtistText;
        }
        const illegalRegex = /[\/\?<>\\:\*\|":]/g;
        artist = decodeURI(artist).replace(illegalRegex, "_") // Make filename-safe (https://stackoverflow.com/a/11101624)
            .replace(/_{2,}/g, "_") // and remove consecutive underscores
            .toLowerCase() + "_" + index + "." + extension;
        return artist;
    }
	// Check if dark mode should be applied
    function isDarkMode() {
        //if auto enabled
        if(config.general.autoDarkMode)
        {
            let hasMediaColorScheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme)').media !== 'not all');

            if(config.general.autoDarkModeForceTime || !hasMediaColorScheme)
            {
                let hours = new Date().getHours();
                if(hours >= config.general.autoDarkModeStartHour || hours <= config.general.autoDarkModeEndHour)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            //system in dark mode
            if(window.matchMedia('(prefers-color-scheme: dark)').matches)
            {
                return true;
            }
            //system in light mode
            else
            {
                return false;
            }
        }
        //if permanent dark mode enabled
        else if(config.general.amoled)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
})();
