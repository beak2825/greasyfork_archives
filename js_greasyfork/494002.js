// ==UserScript==
// @name           Add to Watch Later for Invidious
// @namespace      https://github.com/WalsGit
// @version        1.2
// @description    Adds an "Add to Watch Later" button on video thumbnails for Invidious
// @author         Wa!id
// @license        MIT
// @match          *://yt.artemislena.eu/*
// @match          *://yewtu.be/*
// @match          *://invidious.fdn.fr/*
// @match          *://vid.puffyan.us/*
// @match          *://invidious.nerdvpn.de/*
// @match          *://invidious.projectsegfau.lt/*
// @match          *://invidious.lunar.icu/*
// @match          *://inv.tux.pizza/*
// @match          *://invidious.flokinet.to/*
// @match          *://iv.ggtyler.dev/*
// @match          *://inv.nadeko.net/*
// @match          *://iv.nboeck.de/*
// @match          *://invidious.protokolla.fi/*
// @match          *://invidious.private.coffee/*
// @match          *://inv.us.projectsegfau.lt/*
// @match          *://invidious.perennialte.ch/*
// @match          *://invidious.jing.rocks/*
// @match          *://invidious.drgns.space/*
// @match          *://invidious.einfachzocken.eu/*
// @match          *://inv.oikei.net/*
// @match          *://vid.lilay.dev/*
// @match          *://iv.datura.network/*
// @match          *://yt.drgnz.club/*
// @match          *://yt.cdaut.de/*
// @match          *://invidious.privacydev.net/*
// @match          *://iv.melmac.space/*
// @match          *://umbrel.local:3420/*
// @match          *://umbrel:3420/*
// @supportURL     https://github.com/WalsGit/Add2WL-for-Invidious/issues
// @downloadURL https://update.greasyfork.org/scripts/494002/Add%20to%20Watch%20Later%20for%20Invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/494002/Add%20to%20Watch%20Later%20for%20Invidious.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Styles
    const head = document.querySelector("head");
    const styleElement = document.createElement("style");
    styleElement.textContent = `
        div.thumbnail > .top-right-overlay {
            z-index: 100;
            position: absolute;
            padding: 0;
            margin: 0;
            font-size: 16px;
        }
        .top-right-overlay {
            display: none;
            top: 0.6em;
            right: 0.6em;
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        .thumbnail:hover .top-right-overlay {
            display: block;
            opacity: 1;
        }

        .top-right-overlay > .icon, .top-right-overlay > form > .icon {
            width: 2em;
            height: 2em;
        }

        .WLButton, form > .WLButton {
            border: none;
            background-color: rgba(35, 35, 35, 0.85);
            border-radius: 3px;
        }
        `;
    styleElement.type = "text/css";
    styleElement.id = "AddWLStyles";
    head.appendChild(styleElement);

    // Default values
    let WLPLID = localStorage.getItem("WLPLID");
    let WLPLTitle = localStorage.getItem("WLPLTitle");
    let ChangeDefaultWLPLID = false;

    const protocol = window.location.protocol;
    const IVinstance = protocol + "//" + window.location.host;
    const currentPageURL = window.location.href;
    const playlistsPageURL = IVinstance + "/feed/playlists";

    const alertWLmissingTxt =
        '⚠️ No default Watch Later playlist defined: please go to your <a href="' +
        playlistsPageURL +
        '">playlists page</a> and select one (or create one if necessary).';
    const alertWLmissingTxtOnPLPage =
        '⚠️ No default Watch Later playlist defined: please select (or create) your default "Watch Later" playlist. To do so, hover over your prefered playlist and click on the clock icon that will appear on the top right corner of the thumbnail.';
    const defaultWLMessage =
        "✅ [" + WLPLTitle + "] is set as your default Watch Later playlist";

    // Icons
    const WLicon = `<svg fill="#fff" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>`;
    const savedIcon = `<svg fill="#0f0" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>`;

    // Functions
    function checkIfLoggedIn() {
        const userName = document.getElementById("user_name");
        return !!userName;
    }

    function addSetDefaultPLButton(thumbnail) {
        const button = document.createElement("div");
        const currentPLID = thumbnail
            .querySelector("a")
            .href.match(/list=(.+)$/)[1];
        const currentPLTitle = thumbnail.parentElement.querySelector(".video-card-row a p").textContent;
        button.classList.add("top-right-overlay");
        button.innerHTML =
            '<button class="WLButton icon" title="Set *' +
            currentPLTitle +
            '* as default WL playlist">' +
            WLicon +
            "</button>";
        button.addEventListener("click", () => {
            localStorage.setItem("WLPLID", currentPLID);
            WLPLID = localStorage.getItem("WLPLID");
            localStorage.setItem("WLPLTitle", currentPLTitle);
            WLPLTitle = localStorage.getItem("WLPLTitle");
            console.log(
                "The playlist",
                WLPLTitle,
                "(",
                WLPLID,
                ") was set as the default WL playlist."
            );
            location.reload();
        });

        thumbnail.appendChild(button);
    }

    function addToWLButton(thumbnail, addedVideos) {
        const videoURL = thumbnail.querySelector("a").href;
        const videoID = videoURL.match(/v=(.+)$/)[1];

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("top-right-overlay");

        const WLButton = document.createElement("button");
        WLButton.classList.add("WLButton", "icon");

        let isAdded = videoID in addedVideos;
        WLButton.setAttribute("data-added", isAdded ? "1" : "0");

        if (isAdded) {
            WLButton.setAttribute("title", `remove from ${WLPLTitle}`);
            WLButton.innerHTML = savedIcon;
        } else {
            WLButton.setAttribute("title", `Add to ${WLPLTitle}`);
            WLButton.innerHTML = WLicon;
        }

        buttonContainer.appendChild(WLButton);

        WLButton.addEventListener("click", async () => {
            try {
                const apiUrl = WLButton.dataset.added === "1"
                ? `${IVinstance}/api/v1/auth/playlists/${WLPLID}/videos/${addedVideos[videoID].indexId}`
                : `${IVinstance}/api/v1/auth/playlists/${WLPLID}/videos`;

                const method = WLButton.dataset.added === "1" ? "DELETE" : "POST";
                const body = method === "POST" ? JSON.stringify({ videoId: videoID }) : null;

                const response = await fetch(apiUrl, {
                    method,
                    headers: method === "POST" ? { "Content-Type": "application/json" } : {},
                    body,
                });

                if (!response.ok) {
                    throw new Error(`${method === "POST" ? "Failed to add video" : "Failed to remove video"}: ${response.statusText}`);
                }

                if (response.status === (method === "POST" ? 201 : 204)) {
                    isAdded = !isAdded;
                    WLButton.dataset.added = isAdded ? "1" : "0";
                    WLButton.setAttribute("title", isAdded ? `remove from ${WLPLTitle}` : `Add to ${WLPLTitle}`);
                    WLButton.innerHTML = isAdded ? savedIcon : WLicon;
                    addedVideos = await getPLVideos(WLPLID);
                }
            } catch (error) {
                console.error("Error adding/removing video to playlist:", error);
            }
        });

            thumbnail.appendChild(buttonContainer);
        }

    async function getPLVideos(WLPLID) {
        try {
            const response = await fetch(`${IVinstance}/api/v1/auth/playlists/${WLPLID}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch playlist: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.videos) {
                return {};
            }

            const videoData = {};
            for (const video of data.videos) {
                const videoId = video.videoId;
                const indexId = video.indexId;

                if (videoId) {
                    videoData[videoId] = { indexId };
                }
            }

            return videoData;
        } catch (error) {
            console.error("Error fetching playlist video IDs:", error);
            return {};
        }
    }

    async function checkPLExists(WLPLID) {
        try {
            const response = await fetch(`${IVinstance}/api/v1/auth/playlists/${WLPLID}`);

            if (!response.ok) {
                const json = await response.json();
                if (json.error === "Playlist does not exist.") {
                    return false;
                } else {
                    console.error("Error checking playlist's existence:", json.error);
                    return false;
                }
            }
            return true;
        } catch (error) {
            console.error("Error checking playlist's existence:", error);
            return false;
        }
    }

    function addAlertMessage(currentPageURL) {
        const navbar = document.querySelector(".pure-g.navbar.h-box");
        const alertMessage = document.createElement("div");
        alertMessage.classList.add("h-box");
        let message = null;

        if (typeof WLPLID === null || ChangeDefaultWLPLID === true) {
            if (currentPageURL == playlistsPageURL) {
                message = alertWLmissingTxtOnPLPage;
            } else {
                message = alertWLmissingTxt;
            }
        } else if (currentPageURL == playlistsPageURL) {
            message = defaultWLMessage;
        }
        if (message !== null) {
        alertMessage.innerHTML = "<h3>" + message + "</h3>";
        navbar.parentNode.insertBefore(alertMessage, navbar.nextSibling);
        }
    }

    // Processes
    const isLoggedIn = checkIfLoggedIn();
    const thumbnails = document.querySelectorAll("div.thumbnail");

    if (isLoggedIn) {
        checkPLExists(WLPLID)
          .then((exists) => {
            ChangeDefaultWLPLID = !exists;
            if (currentPageURL != IVinstance) {
              addAlertMessage(currentPageURL);
              if (currentPageURL == playlistsPageURL) {
                thumbnails.forEach(addSetDefaultPLButton);
              } else {
                if (!ChangeDefaultWLPLID) {
                  let addedVideos;
                  getPLVideos(WLPLID)
                    .then((videos) => {
                      addedVideos = videos;
                      thumbnails.forEach((thumbnail) =>
                        addToWLButton(thumbnail, addedVideos)
                      );
                    })
                    .catch((error) => {
                      console.error("Error fetching playlist videos:", error);
                    });
                }
              }
            }
          })
          .catch((error) => {
            console.error("Error checking playlist existence:", error);
          });
    }
})();
