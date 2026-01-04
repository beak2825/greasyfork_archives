// ==UserScript==
// @name        YouTube Anti-RickRoll
// @match       *://*.youtube.com/watch*
// @grant       none
// @version     1.1.0
// @author      yodaluca23
// @license     GNU GPLv3
// @description Give a warning alert if video is suspected RickRoll.
// @namespace https://greasyfork.org/users/1315976
// @downloadURL https://update.greasyfork.org/scripts/517817/YouTube%20Anti-RickRoll.user.js
// @updateURL https://update.greasyfork.org/scripts/517817/YouTube%20Anti-RickRoll.meta.js
// ==/UserScript==

const larssieboy18 = 'https://raw.githubusercontent.com/larssieboy18/rickroll-list/refs/heads/main/rickrolls.json';
const dnorhojBlockedIds = 'https://raw.githubusercontent.com/dnorhoj/AntiRickRoll/refs/heads/main/src/background/blockedIds.js';

// Function to fetch RickRoll IDs from both sources
async function extractYouTubeIDs() {
    try {
        const [rickrollResponse, blockedIdsResponse] = await Promise.all([
            fetch(larssieboy18),
            fetch(dnorhojBlockedIds)
        ]);

        const rickrollData = await rickrollResponse.json();
        const blockedIdsData = await blockedIdsResponse.text();

        const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|video_id=)([\w-]+)/g;

        const links = rickrollData.rickrolls || [];
        const youtubeIDs = [];

        for (const link of links) {
            let match;
            while ((match = youtubeRegex.exec(link)) !== null) {
                youtubeIDs.push(match[1]);
            }
        }

        const blockedIdsMatch = blockedIdsData.replace('export default ', '').replace(';', '');
        const blockedIds = JSON.parse(blockedIdsMatch);

        const allVideoIDs = [...new Set([...youtubeIDs, ...blockedIds])];

        return allVideoIDs;
    } catch (error) {
        console.error('Error fetching or processing data:', error);
        return [];
    }
}

function extractSong() {
  if (unsafeWindow.ytInitialData.engagementPanels) {
    for (const panel of unsafeWindow.ytInitialData.engagementPanels) {
      const section = panel.engagementPanelSectionListRenderer;
      if (section && section.content && section.content.structuredDescriptionContentRenderer) {
        const items = section.content.structuredDescriptionContentRenderer.items;

        for (const item of items) {
          if (item.horizontalCardListRenderer && item.horizontalCardListRenderer.cards) {
            for (const card of item.horizontalCardListRenderer.cards) {
              if (card.videoAttributeViewModel && card.videoAttributeViewModel.title) {
                // Return the found title
                return card.videoAttributeViewModel.title;
              }
            }
          }
        }
      }
    }
  }
  // return a value that will not be matched with regex
  return "not";
}


// Function to check if the video is a RickRoll
function isRickRoll() {
    try {
        const videoDetails = unsafeWindow.ytInitialPlayerResponse.videoDetails;
        const videoTitle = videoDetails?.title?.toLowerCase().replace(/\s+/g, '');
        const videoKeywords = videoDetails?.keywords?.map(keyword => keyword.toLowerCase().replace(/\s+/g, ''));
        const song = extractSong().toLowerCase().replace(/\s+/g, '');

        const rickrollPattern = /(rickroll|rickastley|nevergoingtogiveyouup|nevergonnagiveyouup)/;

        // Check if videoTitle or videoKeywords exist and match the pattern
        if ((videoTitle && videoTitle.match(rickrollPattern)) || (song.match(rickrollPattern)) || (videoKeywords && videoKeywords.some(keyword => keyword.match(rickrollPattern)))) {
            return true;
        }
    } catch (e) {
        console.error('Error while checking video details:', e);
    }
    return false;
}

// Function to display warning
function warning(message) {
    document.querySelector('video').pause();
    var userResponse = confirm(message);
    if (!userResponse) {
        if (document.querySelector('button[title="Mute (m)"]')) {
            document.querySelector('button[title="Mute (m)"]').click();
        }
    }
}

// Main logic
extractYouTubeIDs().then((ids) => {
    const currentVideoID = window.location.href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);

    if (currentVideoID && ids.includes(currentVideoID[1])) {
        warning("This is a RickRoll! Do you want to continue? (Cancel to mute)");
    } else if (isRickRoll()) {
        warning("This is likely a RickRoll! Do you want to continue? (Cancel to mute)");
    }
});