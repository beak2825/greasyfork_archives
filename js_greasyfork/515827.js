
// ==UserScript==
// @name         YouTube Sidebar Playlists Loader
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Load and show YouTube playlists in the sidebar on hover
// @author       Ahmad H.
// @match        *://www.youtube.com/*
// @grant        GM_xmlhttpRequest
// @connect      www.youtube.com
// @compatible   ECMAScript 2020+ (ES11+)
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515827/YouTube%20Sidebar%20Playlists%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/515827/YouTube%20Sidebar%20Playlists%20Loader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Run code after the page loads
    window.addEventListener('load', function () {
        const sidebar = document.querySelector('#sections'); // Sidebar container
        console.log("--- Is YT sidebar found ---", !!sidebar);
        const itemsSection = sidebar?.querySelector('#section-items');

        if (!itemsSection) {
            console.log("==== Not Adding Custom Playlist Link ====");
            return;
        }

        // Create a new "Playlists" item in the sidebar
        const playlistLink = document.createElement('a');
        playlistLink.innerText = 'My Playlists';
        playlistLink.style.cursor = 'pointer';
        playlistLink.style.fontSize = "1.4rem";
        playlistLink.style.lineHeight = "2rem";
        playlistLink.style.fontWeight = "400";
        playlistLink.style.padding = '8px 12px 8px 58px';
        playlistLink.style.color = '#ddd';
        playlistLink.style.background = 'rgba(0,0,0,0)';
        playlistLink.style.display = 'block';
        itemsSection.appendChild(playlistLink);

        // Create submenu container for playlists
        const submenu = document.createElement('div.sub_menu_playlist');
        submenu.style.display = 'none';
        submenu.style.position = 'absolute';
        submenu.style.background = 'rgba(0,0,0,0.8)';
        submenu.style.border = '1px solid #aaa';
        submenu.style.padding = '10px';
        submenu.style.zIndex = '9999';
        submenu.style.borderRadius = '10px';
        document.body.appendChild(submenu);

        // Function to fetch playlists
        const fetchPlaylists = () => {
            console.log('Start fetchPlaylists:');
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://www.youtube.com/feed/playlists',
                onload: function (response) {
                    console.log('after fetcing playlist data');
                    const ytInitialDataMatch = response.responseText.match(/ytInitialData = ({.*?});<\/script>/);
                    if (ytInitialDataMatch && ytInitialDataMatch[1]) {
                        const ytInitialData = JSON.parse(ytInitialDataMatch[1]);
                        const playlists = ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer.contents;

                        // Clear existing submenu items
                        while (submenu.firstChild) {
                            submenu.removeChild(submenu.firstChild);
                        }

                        playlists.forEach((item, index) => {
                            const playlistInfo = item.richItemRenderer?.content?.lockupViewModel?.metadata?.lockupMetadataViewModel;
                            const title = playlistInfo?.title?.content;
                            let url = playlistInfo?.metadata?.contentMetadataViewModel?.metadataRows[2]?.metadataParts[0]?.text?.commandRuns[0]?.onTap?.innertubeCommand?.commandMetadata?.webCommandMetadata?.url;
                            url = url || playlistInfo?.metadata?.contentMetadataViewModel?.metadataRows[1]?.metadataParts[0]?.text?.commandRuns[0]?.onTap?.innertubeCommand?.commandMetadata?.webCommandMetadata?.url;

                            if (!url || !title) {
                                console.warn(`!! URL not found for ${title}`);
                                return;
                            }

                            if (title && url) {
                                const playlistItem = document.createElement('a');
                                playlistItem.href = `https://www.youtube.com${url}`;
                                playlistItem.target = '_blank';
                                playlistItem.textContent = title;
                                playlistItem.style.display = 'block';
                                playlistItem.style.color = '#f1f1f1';
                                playlistItem.style.padding = '5px';
                                playlistItem.style.fontSize = "1.4rem";
                                playlistItem.style.lineHeight = "2rem";
                                playlistItem.style.fontWeight = "400";
                                if (index < playlists.length - 1) {
                                    playlistItem.style.borderBottom = "1px solid #ccc";
                                }
                                playlistItem.style.textDecoration = 'none';

                                playlistItem.addEventListener('mouseover', () => {
                                    playlistItem.style.color = 'yellow';
                                });
                                playlistItem.addEventListener('mouseout', () => {
                                    playlistItem.style.color = '#f1f1f1';
                                });

                                submenu.appendChild(playlistItem);
                            }
                        });
                    }
                }
            });
        };

        fetchPlaylists();

        // Toggle submenu visibility
        playlistLink.addEventListener('mouseenter', () => {
            playlistLink.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            playlistLink.style.borderRadius = '10px';
            submenu.style.display = 'block'; // Show the submenu
            const rect = playlistLink.getBoundingClientRect();
            submenu.style.left = `${rect.right + 10}px`; // Position submenu to the right of the link
            submenu.style.top = `${rect.top}px`;
        });

        playlistLink.addEventListener('mouseleave', () => {
            playlistLink.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            playlistLink.style.borderRadius = '0';
            setTimeout(() => {
                if (!submenu.matches(':hover')) submenu.style.display = 'none';
            }, 200);
        });

        submenu.addEventListener('mouseleave', () => {
            submenu.style.display = 'none';
        });

        submenu.addEventListener('mouseenter', () => {
            submenu.style.display = 'block';
        });
    });
})();
