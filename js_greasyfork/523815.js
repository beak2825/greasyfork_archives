// ==UserScript==
// @name         Animepahe Batch Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  Batch download anime episodes from Animepahe!
// @author       You
// @match        *://animepahe.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/523815/Animepahe%20Batch%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/523815/Animepahe%20Batch%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const site = {
        name: 'Animepahe',
        url: ['animepahe.com'],
        epLinks: 'a.episode-link',
        epTitle: '.entry-title',
        epNum: '.episode-number',
        thumbnail: '.anime-thumbnail img',
        addStartButton: function() {
            const header = document.querySelector('header');
            if (!header) {
                console.log("Header not found.");
                return;
            }
            const button = document.createElement('a');
            button.id = "AniLINK_startBtn";
            button.style.cssText = `cursor: pointer; background-color: #145132; float: right; padding: 10px 15px; color: white; font-weight: bold; border-radius: 5px;`;
            button.innerHTML = 'Generate Download Links';
            header.appendChild(button);
            button.addEventListener('click', extractEpisodes);
            console.log("Start button added.");
            return button;
        },
        extractEpisodes: async function(status) {
            status.textContent = 'Starting...';
            let episodes = {};
            const epLinks = Array.from(document.querySelectorAll(this.epLinks));
            const throttleLimit = 12;    // Number of episodes to extract in parallel

            for (let i = 0; i < epLinks.length; i += throttleLimit) {
                const chunk = epLinks.slice(i, i + throttleLimit);
                let episodePromises = chunk.map(async epLink => { 
                    try {
                        const page = await fetchPage(epLink.href); 
                        const epTitle = page.querySelector(this.epTitle).textContent;
                        const epNumber = page.querySelector(this.epNum).textContent.replace("Episode ", '').padStart(3, '0');
                        const episodeTitle = `${epNumber} - ${epTitle}`;

                        status.textContent = `Extracting ${epTitle} - ${epNumber}...`;
                        const links = { 'mp4': page.querySelector('video > source').src };

                        episodes[episodeTitle] = { number: epNumber, title: epTitle, links, type: 'mp4', thumbnail: this.thumbnail };
                    } catch (e) { showToast(e.message) }
                });
                await Promise.all(episodePromises);
            }
            return episodes;
        }
    };

    // Register menu command for extraction
    GM_registerMenuCommand('Extract Episodes', extractEpisodes);

    // Add start button after the page is loaded
    window.addEventListener('load', function() {
        console.log("Window loaded.");
        site.addStartButton();
    });

    // Function to fetch page content
    function fetchPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const page = (new DOMParser()).parseFromString(response.responseText, 'text/html');
                        resolve(page);
                    } else {
                        reject(`Failed to fetch page: ${url}`);
                    }
                },
                onerror: function(error) {
                    reject(`Request failed: ${error}`);
                }
            });
        });
    }

    // Function to handle episode extraction
    async function extractEpisodes() {
        // Check for existing overlay
        if (document.getElementById("AniLINK_Overlay")) {
            document.getElementById("AniLINK_Overlay").style.display = "flex";
            return;
        }

        // Create overlay
        const overlayDiv = document.createElement("div");
        overlayDiv.id = "AniLINK_Overlay";
        overlayDiv.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 999; display: flex; align-items: center; justify-content: center;";
        document.body.appendChild(overlayDiv);
        overlayDiv.onclick = event => linksContainer.contains(event.target) ? null : overlayDiv.style.display = "none";

        // Create container for links
        const linksContainer = document.createElement('div');
        linksContainer.id = "AniLINK_LinksContainer";
        linksContainer.style.cssText = "position:relative; height:70%; width:60%; color:cyan; background-color:#0b0b0b; overflow:auto; border: groove rgb(75, 81, 84); border-radius: 10px; padding: 10px 5px; resize: both; scrollbar-width: thin; scrollbar-color: cyan transparent; display: flex; justify-content: center; align-items: center;";
        overlayDiv.appendChild(linksContainer);

        // Status bar for extraction process
        const statusBar = document.createElement('span');
        statusBar.id = "AniLINK_StatusBar";
        statusBar.textContent = "Extracting Links..."
        statusBar.style.cssText = "background-color: #0b0b0b; color: cyan;";
        linksContainer.appendChild(statusBar);

        // Extract episodes
        const episodes = await site.extractEpisodes(statusBar);

        // Sort and display episodes
        const sortedEpisodes = Object.values(episodes).sort((a, b) => a.number - b.number);
        const qualityLinkLists = sortedEpisodes.map(episode => {
            return `<li style="list-style-type: none;">
                        <span style="user-select:none; color:cyan;">
                        Ep ${episode.number}: </span>
                        <a title="${episode.title}" download="${episode.title}.mp4" href="${episode.links.mp4}" style="color:#FFC119;">
                        ${episode.links.mp4}</a>
                    </li>`;
        }).join("");

        // Update links container with episode links
        linksContainer.innerHTML = `<ul>${qualityLinkLists}</ul>`;
    }

    // Display a simple toast message
    let toasts = [];

    function showToast(message) {
        const maxToastHeight = window.innerHeight * 0.5;
        const toastHeight = 50; // Approximate height of each toast
        const maxToasts = Math.floor(maxToastHeight / toastHeight);

        console.log(message);

        // Create the new toast element
        const x = document.createElement("div");
        x.innerHTML = message;
        x.style.color = "#000";
        x.style.backgroundColor = "#fdba2f";
        x.style.borderRadius = "10px";
        x.style.padding = "10px";
        x.style.position = "fixed";
        x.style.top = `${toasts.length * toastHeight}px`;
        x.style.right = "5px";
        x.style.fontSize = "large";
        x.style.fontWeight = "bold";
        x.style.zIndex = "10000";
        x.style.display = "block";
        x.style.borderColor = "#565e64";
        x.style.transition = "right 2s ease-in-out, top 0.5s ease-in-out";
        document.body.appendChild(x);

        // Add the new toast to the list
        toasts.push(x);

        // Remove the toast after it slides out
        setTimeout(() => {
            x.style.right = "-300px";
            x.style.top = `${-toastHeight}px`;
            toasts = toasts.filter(toast => toast !== x);
            setTimeout(() => x.remove(), 1000);
        }, 3000);
    }
})();