// ==UserScript==
// @name         soundcloud shuffle likes
// @version      1.7
// @description  Adds a shuffle play button to "Likes" and playlists
// @author       bhackel
// @match        https://soundcloud.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @noframes
// @namespace https://greasyfork.org/en/users/324178-bhackel
// @downloadURL https://update.greasyfork.org/scripts/393088/soundcloud%20shuffle%20likes.user.js
// @updateURL https://update.greasyfork.org/scripts/393088/soundcloud%20shuffle%20likes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* Injects Button into the page once it has loaded,
       then tries to re-add it if it disappears due to page change
    */
    function insertButtonLoop() {
        let url = window.location.href;
        url = url.split('?')[0];
        let btnShuffle = document.querySelector('.bhackel-shuffle-likes');

        // Check if button does not exist already, and that user is on likes or a playlist
        if (!btnShuffle && (url.includes("/likes") || url.includes("/sets/") || url.includes("/discover/"))) {
            btnShuffle = document.createElement('Button');
            btnShuffle.innerHTML = 'Shuffle Play';
            btnShuffle.onclick = function(){ setupLoad(this); };
            btnShuffle.scrolling = false;
            btnShuffle.interval = 0;

            // Case for likes
            if (url.includes("you/likes")) {
                btnShuffle.className = 'bhackel-shuffle-likes sc-button sc-button-large';
                btnShuffle.pageType = "Likes";
                // Check if top bar has loaded
                let collectionTop = document.querySelector('.collectionSection__top');
                if (collectionTop) {
                    // Insert the button above the grid of tracks
                    collectionTop.insertBefore(btnShuffle, collectionTop.children[2]);
                } else {
                    setTimeout(insertButtonLoop, 1000);
                }
            }
            // Case for generic user likes
            else if (url.includes("/likes") && !url.includes("you/likes")) {
                btnShuffle.className = 'bhackel-shuffle-likes sc-button sc-button-medium';
                btnShuffle.pageType = "GenericLikes";
                // Check if top bar has loaded
                let titleBar = document.querySelector(".userNetworkTabs");
                if (titleBar) {
                    // Insert the button above the list of tracks
                    titleBar.appendChild(btnShuffle);
                } else {
                    setTimeout(insertButtonLoop, 1000);
                }
            }
            // Case for a playlist
            else if (url.includes("/sets/") && !url.includes("/discover/")) {
                btnShuffle.className = 'bhackel-shuffle-likes sc-button sc-button-medium';
                btnShuffle.pageType = "Playlist";
                // Check if action bar has loaded
                let soundActions = document.querySelector('.soundActions');
                if (soundActions) {
                    // Insert the button after other action buttons
                    soundActions.children[0].appendChild(btnShuffle);
                } else {
                    setTimeout(insertButtonLoop, 1000);
                }
            }
            // Case for discover playlists
            else if (url.includes("/discover/sets/")) {
                btnShuffle.className = 'bhackel-shuffle-likes sc-button sc-button-medium';
                btnShuffle.pageType = "Discover";
                // Check if action bar has loaded
                let playlistControls = document.querySelector('.systemPlaylistDetails__controls');
                if (playlistControls) {
                    // Insert the button after other action buttons
                    playlistControls.appendChild(btnShuffle);
                } else {
                    setTimeout(insertButtonLoop, 1000);
                }
            }
        }
        // Perform another check in 3 seconds, in the case button has been removed
        setTimeout(insertButtonLoop, 3000);
    }

    /* Changes the text of the button, resets the queue to have the user's
       likes, then starts the scrolling loop. Or it stops the loop from running.
    */
    function setupLoad(btn) {
        // Check whether the loop is running or not
        if (btn.scrolling === false) {
            btn.innerHTML = 'Click to Stop Loading';
            btn.scrolling = true;
            // The list of tracks visible on screen, which changes for a playlist or likes
            let tracks;
            if (btn.pageType === "Likes") {
                tracks = document.querySelector('.lazyLoadingList__list');
            } else if (btn.pageType === "GenericLikes") {
                tracks = document.querySelector('.lazyLoadingList__list');
            } else if (btn.pageType === "Playlist") {
                tracks = document.querySelector('.trackList__list');
            } else if (btn.pageType === "Discover") {
                tracks = document.querySelector('.systemPlaylistTrackList__list');
            }
            if (tracks.childElementCount > 2) {
                // Reset the queue to the beginning of the list of tracks
                let firstTrack = tracks.children[0];
                let secondTrack = tracks.children[1];

                let firstPlayButton = firstTrack.querySelector(".playButton");
                let secondPlayButton = secondTrack.querySelector(".playButton");
                // Reset by playing 2, playing 1, then pausing playback
                secondPlayButton.click();
                setTimeout(function(){ firstPlayButton.click(); }, 150);
                setTimeout(function(){
                    let playButton = document.querySelector('.playControl');
                    if (playButton.classList.contains('playing')) {
                        playButton.click();
                    }
                }, 500);

                // Add the first track to the queue so it gets shuffled
                tracks.getElementsByClassName("sc-button-more")[0].click()
                document.getElementsByClassName("moreActions__button addToNextUp")[0].click()

                // Open the queue to load it
                toggleQueue('open');

                // Setup the scrolling loop - Needs time before running so the queue loads
                btn.timeout = setTimeout(function(){
                    btn.interval = setInterval(function() { scrollQueue(btn); }, 500);
                }, 3000);
            } else {
                // The list has two or less tracks - cannot shuffle play
                btn.innerHTML = 'Error: Too Few Tracks';
            }
        } else {
            clearInterval(btn.interval);
            clearTimeout(btn.timeout);
            btn.interval = 0;
            btn.scrolling = false;
            btn.innerHTML = 'Shuffle Play';
        }
    }

    /* Scrolls the queue down, ensuring that the queue is open by opening it
    */
    function scrollQueue(btn) {
        let queue = document.querySelector('.queue');
        // Check if the queue is open
        if (queue.classList.contains('m-visible')) {
            // Scroll the queue to the bottom, loading new tracks below
            let scrollableQueue = document.querySelector('.queue__scrollableInner');
            let queueContainer = document.querySelector('.queue__itemsHeight');
            let scrollToHeight = parseInt(queueContainer.style.height);
            scrollableQueue.scroll(0,scrollToHeight);

            // Check if all tracks are loaded, then play
            let autoplayDiv = document.querySelector('.queue__fallback');
            if (autoplayDiv) {
                clearInterval(btn.interval);
                btn.scrolling = false;
                btn.interval = 0;
                play(btn);
            }
        } else {
            // Open the queue if it is closed
            toggleQueue('open');
        }
    }

    /* Shuffles the queue, skips the first track, then plays it
    */
    function play(btn) {
        btn.innerHTML = 'Shuffle Play';
        let playButton = document.querySelector('.playControl');
        let shuffleButton = document.querySelector('.shuffleControl');
        let skipButton = document.querySelector(".skipControl__next");

        // Re-Shuffle tracks if shuffle is enabled, and enable shuffle if it is disabled
        if (shuffleButton.classList.contains('m-shuffling')) {
            shuffleButton.click();
            shuffleButton.click();
        } else if (!shuffleButton.classList.contains('m-shuffling')) {
            shuffleButton.click();
        }

        // Skip the duplicate first track that was added previously
        // This also begins playback
        skipButton.click();

        // Close the queue if it is open
        toggleQueue('close');

        // Add focus back to the play/pause button so keybinds work
        playButton.focus()
    }

    /* Opens or closes the song queue
    */
    function toggleQueue(changeToState) {
        let queue = document.querySelector('.queue');
        let isQueueOpen = queue.classList.contains('m-visible');
        // Toggle queue if the queue is open and it should be closed, or if it's closed and should be open
        if ((isQueueOpen && changeToState === 'close') || (!isQueueOpen && changeToState === 'open')) {
            let queueTrigger = document.querySelector('.playbackSoundBadge__queueCircle');
            queueTrigger.click();
        }
    }

    insertButtonLoop();

})();