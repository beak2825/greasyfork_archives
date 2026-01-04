// ==UserScript==
// @name         instakeeplay
// @description  Prevents Instagram videos from pausing when switching tabs and adds a custom seek bar to all videos.
// @version      1.03

// @author       Halil Nevzat
// @match        *://*.instagram.com/*
// @run-at       document-start
// @license      MIT

// @namespace    https://instagram.com/
// @icon         https://www.instagram.com/favicon.ico

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528836/instakeeplay.user.js
// @updateURL https://update.greasyfork.org/scripts/528836/instakeeplay.meta.js
// ==/UserScript==

/*
    Author: Halil Nevzat
    Github: https://github.com/halilnevzat
    Greasyfork: https://greasyfork.org/en/users/1442441-halilnevzat
    Website: halilnevzat.com
*/

// === Part 1: Prevent videos from pausing when switching tabs ===
// Override the document.hidden property
Object.defineProperty(document, 'hidden', {
    get: function() {
        return false; // Always return false to indicate the tab is visible
    }
});

// Override the document.visibilityState property
Object.defineProperty(document, 'visibilityState', {
    get: function() {
        return 'visible'; // Always return 'visible' to indicate the tab is visible
    }
});

// Trigger a fake visibilitychange event to ensure Instagram updates its state
const event = new Event('visibilitychange');
document.dispatchEvent(event);

console.log('Instagram tab visibility detection overridden. Videos should no longer pause when switching tabs.');

// === Part 2: Add a custom seek bar to Instagram videos ===
function addSeekBarToVideos() {
    // Select all video elements on the page
    const videos = document.querySelectorAll('video');

    videos.forEach(video => {
        // Check if the video already has a seek bar
        if (video.parentElement && video.parentElement.querySelector('.custom-seek-bar')) return;

        // Ensure parentElement exists before proceeding
        if (!video.parentElement) return;

        // Create a container for the seek bar
        const seekBarContainer = document.createElement('div');
        seekBarContainer.style.position = 'absolute';
        seekBarContainer.style.bottom = '10px';
        seekBarContainer.style.left = '10px';
        seekBarContainer.style.right = '10px';
        seekBarContainer.style.height = '5px';
        seekBarContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        seekBarContainer.style.borderRadius = '5px';
        seekBarContainer.style.cursor = 'pointer';
        seekBarContainer.classList.add('custom-seek-bar');

        // Create the progress bar
        const progressBar = document.createElement('div');
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = '#0095f6';
        progressBar.style.borderRadius = '5px';
        progressBar.style.width = '0%';

        // Append the progress bar to the container
        seekBarContainer.appendChild(progressBar);

        // Append the seek bar container to the video's parent element
        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(seekBarContainer);

        // Update the progress bar as the video plays
        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${progress}%`;
        });

        // Allow clicking on the seek bar to jump to a specific time
        seekBarContainer.addEventListener('click', (e) => {
            const rect = seekBarContainer.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            video.currentTime = clickPosition * video.duration;
        });
    });
}

// Wait for the page to load before running the function initially
window.addEventListener('load', () => {
    setTimeout(() => {
        addSeekBarToVideos();
        console.log('Custom seek bar added to Instagram videos after delay.');
    }, 2000); // 2-second delay, adjust as needed
});

// Observe the DOM for new videos (e.g., when scrolling)
const observer = new MutationObserver(addSeekBarToVideos);
observer.observe(document.body, { childList: true, subtree: true });