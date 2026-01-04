// ==UserScript==
// @name         Suno Playlist Sorter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows the number of likes beside each music track on playlist pages on Suno.ai and allows sorting the playlist by likes.
// @author       MahdeenSky
// @match        https://suno.com/playlist/*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/492268/Suno%20Playlist%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/492268/Suno%20Playlist%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const domain = "https://suno.com/";
    const songLink_xPath = `//div//p//a[contains(@class, "chakra-link")]`;
    const likes_xPath = `//button[contains(@class, "chakra-button")]`;
    const playPlaylistButton_xPath = `//div[descendant::img[contains(@alt, "Playlist cover art")]]//div//div//button[contains(@class, "chakra-button")]`;

    let alreadyLikeFetched = {};

    function setStyle(element, style) {
        for (let property in style) {
            element.style[property] = style[property];
        }
    }

    function extractSongLink(songElement) {
        return songElement.getAttribute("href");
    }

    function extractLikes(songLink) {
        return fetch(domain + songLink)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const obfuscatedLikes = doc.evaluate(likes_xPath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                const likes = obfuscatedLikes.innerText.match(/;}(\d+)/)[1];
                return likes;
            })
            .catch(error => console.error(error));
    }

    function addLikesToSongs() {
        const songSnapshots = document.evaluate(songLink_xPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const promises = [];

        for (let i = 0; i < songSnapshots.snapshotLength; i++) {
            const songElement = songSnapshots.snapshotItem(i);
            const songLink = extractSongLink(songElement);

            if (alreadyLikeFetched[songLink]) {
                continue;
            }

            const promise = extractLikes(songLink).then(likes => {
                const likesElement = document.createElement("span");
                likesElement.textContent = ` ${likes}`;
                fetchButtonDiv(songElement).then(buttonDiv => {
                    buttonDiv.insertBefore(likesElement, buttonDiv.children[1]);
                    alreadyLikeFetched[songLink] = likes;
                });
            });
            promises.push(promise);
        }

        return Promise.allSettled(promises);
    }

    function getKthParent(element, k) {
        let parent = element;
        for (let i = 0; i < k; i++) {
            parent = parent.parentNode;
        }
        return parent;
    }

    function fetchButtonDiv(songElement) {
        return Promise.resolve(getKthParent(songElement, 4).children[1].querySelector("div > button"));
    }

    function fetchLikesFromSongElement(songElement) {
        try {
            const likesElement = getKthParent(songElement, 4).children[1].querySelector("div > button").parentNode.querySelector("span");
            return Promise.resolve(likesElement ? likesElement.textContent : null);
        } catch (error) {
            return Promise.resolve(null);
        }
    }

    function fetchSongGrid() {
        const songSnapshots = document.evaluate(songLink_xPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const songElement = songSnapshots.snapshotItem(0);
        return Promise.resolve(getKthParent(songElement, 9));
    }

    function sortSongsByLikes() {
        fetchSongGrid().then(songGrid => {
            let songRows = Array.from(songGrid.children);
            let songSnapshots = document.evaluate(songLink_xPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            let songElements = [];
            for (let i = 0; i < songSnapshots.snapshotLength; i++) {
                let songElement = songSnapshots.snapshotItem(i);
                songElements.push(songElement);
            }

            // check if the likes are already fetched, if not fetch them
            fetchLikesFromSongElement(songElements[songElements.length - 1]).then(likes => {
                if (likes === null) {
                    addLikesToSongs().then(() => {
                        sortSongsByLikes();
                    });
                } else {
                    let songElementsWithLikes = [];
                    let promises = [];
                    for (let i = 0; i < songElements.length; i++) {
                        let songElement = songElements[i];
                        let promise = fetchLikesFromSongElement(songElement).then(likes => {
                            songElementsWithLikes.push({
                                songElement: songElement,
                                songRow: songRows[i],
                                likes: likes
                            });
                        });
                        promises.push(promise);
                    }

                    Promise.all(promises).then(() => {
                        // All promises have resolved, songElementsWithLikes is now fully populated

                        // sort the songElementsWithLikes array by likes
                        songElementsWithLikes.sort((a, b) => {
                            return parseInt(b.likes) - parseInt(a.likes);
                        });

                        // replace each songRow with the sorted songRow
                        // make a clone of the songGrid without the children
                        let songGridClone = songGrid.cloneNode(false);
                        for (let i = 0; i < songElementsWithLikes.length; i++) {
                            songGridClone.appendChild(songElementsWithLikes[i].songRow);
                        }

                        // replace the songGrid with the sorted songGrid
                        songGrid.replaceWith(songGridClone);
                    });
                }
            });
        });
    }

    function addSortButton() {
        const button = document.createElement("button");
        button.textContent = "Sort by Likes";
        button.onclick = sortSongsByLikes;
        setStyle(button, {
            backgroundColor: "#4CAF50", // Green background
            border: "none",
            color: "white",
            padding: "10px 24px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
            margin: "4px 2px",
            cursor: "pointer",
            borderRadius: "8px", // Rounded corners
            boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)" // Add a shadow
        });

        const playlistPlayButton = document.evaluate(playPlaylistButton_xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        playlistPlayButton.parentNode.appendChild(button);
    }

    function addLikesButton() {
        const button = document.createElement("button");
        button.textContent = "Show Likes";
        button.onclick = addLikesToSongs;
        setStyle(button, {
            backgroundColor: "#008CBA", // Blue background
            border: "none",
            color: "white",
            padding: "10px 24px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
            margin: "4px 2px",
            cursor: "pointer",
            borderRadius: "8px", // Rounded corners
            boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)" // Add a shadow
        });

        let playlistPlayButton = document.evaluate(playPlaylistButton_xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        playlistPlayButton.parentNode.appendChild(button);
    }

    // add button when the playlistPlayButton is loaded
    let observer = new MutationObserver((mutations, observer) => {
        let playlistPlayButton = document.evaluate(playPlaylistButton_xPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (playlistPlayButton) {
            addLikesButton();
            addSortButton();
            observer.disconnect();
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});

})();