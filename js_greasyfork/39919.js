// ==UserScript==
// @name         YouTube Suggested Video Hider (for YouTube classic)
// @namespace    https://davidjb.online/
// @version      0.2.1
// @description  Hide specified channels from the YouTube suggested videos sidebar (in classic view)
// @author       David Bailey
// @match        https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39919/YouTube%20Suggested%20Video%20Hider%20%28for%20YouTube%20classic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/39919/YouTube%20Suggested%20Video%20Hider%20%28for%20YouTube%20classic%29.meta.js
// ==/UserScript==

const hidden = [];
// e.g. to hide videos from Gus Johnson and Top 10 Trends:
// const hidden = ['Gus Johnson', 'Top 10 Trends'];
// (don't worry Gus, I love you)

if (hidden.length === 0) {
    alert('YouTube Suggested Video Hider is installed, but no channels are hidden. Please edit the script to specify which channels to hide.');
}

const videos = document.querySelectorAll('.watch-sidebar-section:nth-child(2) .video-list-item');

// loop through all the sidebar videos and remove any which are made by somebody in the hidden list
for (const video of videos) {
    const profileName = (video.querySelector('.attribution span') || video.querySelector('.attribution')).textContent;
    if (hidden.indexOf(profileName) !== -1) {
        video.remove();
        console.log(`[YSVH] Video hidden from ${profileName}`);
    }
    if (video.querySelector('.related-playlist')) {
        video.classList.add('playlist');
    }
}

let autoplayChanged = false;

const autoplayVideo = document.querySelector('.watch-sidebar-body .video-list-item');
const profileName = autoplayVideo.querySelector('.attribution span').textContent;

const replace = document.querySelector('.watch-sidebar-section:nth-child(2) .video-list-item:not(.playlist)');
const replaceTitle = replace.querySelector('.title').textContent.trim();
const replaceProfile = replace.querySelector('.attribution span').textContent;

if (hidden.indexOf(profileName) !== -1) {
    autoplayChanged = true;
    // replace the autoplay video with the suggested video beneath it
    autoplayVideo.parentElement.appendChild(replace);
    autoplayVideo.remove();
    console.log(`[YSVH] Autoplay video from ${profileName} replaced with ${replaceTitle} by ${replaceProfile}`);
}

document.querySelector('.video-stream').onended = () => {
    // don't do anything unless the autoplay video was replaced and autoplay is enabled
    if (!(autoplayChanged && document.querySelector('#autoplay-checkbox').checked)) {
        return;
    }
    const autoplay = document.querySelector('.ytp-upnext');
    autoplay.querySelector('.ytp-upnext-header').textContent = 'Up Next (Warning: Autoplay will not pause)';
    autoplay.querySelector('.ytp-upnext-title').textContent = replaceTitle;
    autoplay.querySelector('.ytp-upnext-author').textContent = replaceProfile;
    autoplay.querySelector('.ytp-upnext-autoplay-icon').href = replace.querySelector('.thumb-link').href;
    autoplay.querySelector('.ytp-cued-thumbnail-overlay-image').style.backgroundImage = `url(${replace.querySelector('.yt-uix-simple-thumb-wrap img').src})`;

    // redirect to the replacement video just before YouTube's autoplay system kicks in (7.5 seconds vs 8 seconds)
    window.setTimeout(() => {
        // the user might have pressed Cancel or turned off autoplay
        if (autoplay.style.display === 'none') {
            return;
        }
        replace.querySelector('.thumb-link').click();
    }, 7800);
};