// ==UserScript==
// @name         SturdyChan External Sounds
// @namespace    Sturdychan
// @description  Plays 4chan-style soundposts on SturdyChan
// @author       anonVNscripts
// @version      1.0.0
// @match        *://sturdychan.help/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533155/SturdyChan%20External%20Sounds.user.js
// @updateURL https://update.greasyfork.org/scripts/533155/SturdyChan%20External%20Sounds.meta.js
// ==/UserScript==

(function() {
    var doInit;
    var doParseFile;
    var doParseFiles;
    var doPlayFile;
    var doMakeKey;

    var allow;
    var players;

    // Allowed domains for sound files
    allow = [
        "4cdn.org",
        "catbox.moe",
        "dmca.gripe",
        "lewd.se",
        "pomf.cat",
        "zz.ht"
    ];

    // Initialize when DOM is ready.
    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(doInit, 1);
    });

    doInit = function () {
        var observer;

        if (players) {
            return;
        }

        players = {};

        doParseFiles(document.body);

        observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            doParseFiles(node);
                            doPlayFile(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // Modified doParseFile: accepts either an anchor (<a>) that contains the sound marker
    // or a container element from which we try to extract an anchor.
    doParseFile = function (elem) {
        var fileLink, fileName, key, match, player, link;

        // If the element is an anchor, use it directly.
        if (elem.tagName === "A") {
            fileLink = elem;
            // Prefer the download attribute if available; otherwise, use the text content.
            fileName = fileLink.download || fileLink.textContent;
        } else if (elem.classList.contains("file")) {
            // For backward compatibility: search inside a container with class "file"
            fileLink = elem.querySelector("a");
            if (fileLink) {
                fileName = fileLink.title || fileLink.textContent;
            }
        } else {
            return;
        }

        if (!fileLink || !fileLink.href) {
            return;
        }

        if (!fileName) {
            return;
        }

        // Replace a hyphen with a slash (mirroring original behavior)
        fileName = fileName.replace(/\-/, "/");

        key = doMakeKey(fileLink);
        if (!key) {
            return;
        }

        if (players[key]) {
            return;
        }

        // Look for an audio marker such as [sound=...]
        match = fileName.match(/[\[\(\{](?:audio|sound)[ \=\:\|\$](.*?)[\]\)\}]/i);
        if (!match) {
            return;
        }

        link = match[1];

        // Decode percent-encoded characters if needed.
        if (link.includes("%")) {
            try {
                link = decodeURIComponent(link);
            } catch (error) {
                return;
            }
        }

        // Ensure the link is a full URL; if not, prepend the page protocol.
        if (link.match(/^(https?\:)?\/\//) === null) {
            link = (location.protocol + "//" + link);
        }

        try {
            link = new URL(link);
        } catch (error) {
            return;
        }

        // Make sure the host for the sound file is allowed.
        if (allow.some(function (item) {
            return link.hostname.toLowerCase() === item ||
                   link.hostname.toLowerCase().endsWith("." + item);
        }) === false) {
            return;
        }

        // Create and configure the audio player.
        player = new Audio();
        player.preload = "none";
        player.volume = 0.80;
        player.loop = true;
        player.src = link.href;

        players[key] = player;
    };

    // Parse all potential file containers or anchor elements within the target node.
    doParseFiles = function (target) {
        // Look for elements with class "file"
        target.querySelectorAll(".file").forEach(function (node) {
            doParseFile(node);
        });
        // Additionally, check for anchor elements that might be direct links with sound markers.
        target.querySelectorAll("a").forEach(function (node) {
            // Check if the download attribute or text contains "[sound"
            if ((node.download && node.download.includes("[sound")) ||
                (node.textContent && node.textContent.includes("[sound"))) {
                doParseFile(node);
            }
        });
    };

    // Modified doPlayFile remains similar, relying on the key generated via doMakeKey.
    doPlayFile = function (target) {
        var key, player, interval;

        // Adjust the selectors based on what sturdychan.help uses for preview images/videos.
        if (!(
            target.id === "image-hover" ||
            target.className === "expanded-thumb" ||
            target.className === "expandedWebm" ||
            target.tagName === "IMG"  // also consider standalone images
        )) {
            return;
        }

        if (!target.src) {
            return;
        }

        key = doMakeKey(target);
        if (!key) {
            return;
        }

        player = players[key];
        if (!player) {
            return;
        }

        if (!player.paused) {
            if (player.dataset.play == 1) {
                player.dataset.again = 1;
            } else {
                player.pause();
            }
        }

        if (player.dataset.play != 1) {
            player.dataset.play = 1;
            player.dataset.again = 0;
            player.dataset.moveTime = 0;
            player.dataset.moveLast = 0;
        }

        switch (target.tagName) {
            case "IMG":
                player.loop = true;
                if (player.dataset.again != 1) {
                    player.currentTime = 0;
                    player.play();
                }
                break;
            case "VIDEO":
                player.loop = false;
                player.currentTime = target.currentTime;
                player.play();
                break;
            default:
                return;
        }

        if (player.paused) {
            document.dispatchEvent(new CustomEvent("CreateNotification", {
                bubbles: true,
                detail: {
                    type: "warning",
                    content: "Your browser blocked autoplay, click anywhere on the page to activate it and try again.",
                    lifetime: 5
                }
            }));
        }

        interval = setInterval(function () {
            if (document.body.contains(target)) {
                if (target.tagName === "VIDEO") {
                    if (target.currentTime != (+player.dataset.moveLast)) {
                        player.dataset.moveTime = Date.now();
                        player.dataset.moveLast = target.currentTime;
                    }
                    if (!isNaN(player.duration) && (
                        target.paused === true ||
                        target.currentTime > player.duration ||
                        ((Date.now() - (+player.dataset.moveTime)) > 300)
                    )) {
                        if (!player.paused) {
                            player.pause();
                        }
                    } else {
                        if (player.paused || Math.abs(target.currentTime - player.currentTime) > 0.100) {
                            player.currentTime = target.currentTime;
                        }
                        if (player.paused) {
                            player.play();
                        }
                    }
                }
            } else {
                clearInterval(interval);
                if (player.dataset.again == 1) {
                    player.dataset.again = 0;
                } else {
                    player.pause();
                    player.dataset.play = 0;
                }
            }
        }, 1000 / 30);
    };

    // Modified doMakeKey:
    // If the file element (or anchor) has a data-hash attribute, use that.
    // Otherwise, try to extract an identifier from the href.
    doMakeKey = function(elem) {
        // If the element has a dataset with a hash, use it.
        if (elem.dataset && elem.dataset.hash) {
            return elem.dataset.hash;
        }

        // Otherwise, try to use the href.
        // If elem is an image (or has a src), use that; else use href.
        var urlString = (elem.src) ? elem.src : elem.href;
        if (!urlString) {
            return null;
        }

        // Try to match URLs of the form:
        // https://sturdychan.help/assets/images/src/<hash>.<ext>
        var match = urlString.match(/sturdychan\.help\/assets\/images\/src\/([a-f0-9]+)\.(?:jpg|png|gif|webm|m4a)/i);
        if (match) {
            return match[1];
        }
        return null;
    };

})();
