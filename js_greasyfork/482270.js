// ==UserScript==
// @name RedGifs Downloader
// @namespace burrito.scripts
// @match http*://*.redgifs.com/*
// @match http*://redgifs.com/*
// @run-at document-idle
// @grant GM_addStyle
// @version 1.13
// @author hunkyburrito
// @description Creates a sidebar button to download the currently playing gif in the currently selected quality.
// @homepage https://gist.github.com/hunkyburrito/f588fa77e75e29f9eeabcd24b21e35f8#file-redgif_downloader-js
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/482270/RedGifs%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/482270/RedGifs%20Downloader.meta.js
// ==/UserScript==

// Remove Ads
GM_addStyle(`
  .injection,.liveAdButton,.InformationBar,.OnlyFansCreatorsSidebar{
   display: none !important;
  }
`);

// Cache with TTL
const cacheTTL = 5 * 60 * 1000; // 5 minutes
const gifCache = new Map(); // { id: { data, timestamp } }

function getCachedGif(gifId) {
    const entry = gifCache.get(gifId);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > cacheTTL) {
        gifCache.delete(gifId); // auto-expire
        return null;
    }
    return entry.data;
}
function setCachedGif(gifId, data) {
    gifCache.set(gifId, { data, timestamp: Date.now() });
}

// Fetch Gif
async function getGif(gifId) {
    const cached = getCachedGif(gifId);
    if (cached) return cached;

    try {
        const sessionData = localStorage.getItem('session_data');
        if (!sessionData) throw new Error('No session data found');
        const token = JSON.parse(sessionData).token;
        if (!token) throw new Error('Missing auth token');

        const res = await fetch(`https://api.redgifs.com/v2/gifs/${gifId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const gifInfo = await res.json();

        setCachedGif(gifId, gifInfo);
        return gifInfo;
    } catch (err) {
        console.error('[RedGifs Downloader] Failed to fetch GIF info:', err);
        throw err;
    }
}

// Download Gif
async function download(gifId) {
    const gifInfo = await getGif(gifId);
    const dlLink = gifInfo.gif.urls['hd'];

    // Fetch video data
    const response = await fetch(dlLink);
    const data = await response.blob();

    // Create a link element and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(data);
    link.download = `${gifInfo.gif.id}.mp4`;
    link.className = 'download';

    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// Cache Styles
let cachedButtonStyle = null;
function getButtonStyleReference() {
    if (cachedButtonStyle) return cachedButtonStyle;
    const refBtn = document.querySelector('.FSButton');
    if (!refBtn) return null;
    const styles = window.getComputedStyle(refBtn);
    // Prefer cssText; fallback to serialization
    cachedButtonStyle = styles.cssText || Array.from(styles).reduce((str, prop) => {
        return `${str}${prop}:${styles.getPropertyValue(prop)};`;
    }, '');
    return cachedButtonStyle;
}

// Icon
const dlIconTemplate = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
dlIconTemplate.setAttribute('width', '24');
dlIconTemplate.setAttribute('height', '24');
dlIconTemplate.setAttribute('viewBox', '0 0 24 24');
dlIconTemplate.setAttribute('fill', 'white');
dlIconTemplate.innerHTML = "<path d='M11.29 15.71a1 1 0 0 0 .33.21 1 1 0 0 0 .76 0 1 1 0 0 0 .33-.21l3-3a1 1 0 0 0-1.42-1.42L13 12.59V9a1 1 0 0 0-2 0v3.59l-1.29-1.3a1 1 0 0 0-1.42 0 1 1 0 0 0 0 1.42zM12 22A10 10 0 1 0 2 12a10 10 0 0 0 10 10zm0-18a8 8 0 1 1-8 8 8 8 0 0 1 8-8z' stroke='currentColor' stroke-width='0.5' stroke-linecap='round' stroke-linejoin='round'></path>";

// Insert download button
async function addButton (target, gifId) {
    // Check if download button already exists
    if (document.getElementById(`DL_Btn_${gifId}`)) return;

    // Sidebar item and button
    const sbItem = document.createElement('li');
    sbItem.className = 'sideBarItem';
    const dlBtn = document.createElement('button');
    dlBtn.className = 'DL_Btn';
    dlBtn.id = `DL_Btn_${gifId}`; // Unique ID for each button

    // Button icon
    const dlIcon = dlIconTemplate.cloneNode(true); // Reuse pre-created SVG icon
    dlBtn.appendChild(dlIcon);
    sbItem.appendChild(dlBtn);

    const sibling = await waitForElm('.LikeButton', target, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });

    // Copy other button styles
    dlBtn.style.cssText = getButtonStyleReference();

    // Insert button into sidebar
    const siblingNode = sibling.parentNode;
    const parent = siblingNode.parentNode;
    parent.insertBefore(sbItem, siblingNode);

    dlBtn.addEventListener('click', function(){ download(gifId) } );
}

// Generic observer
function waitForElm(selector, root = document, config = {childList: true, subtree: true}) {
    return new Promise(resolve => {
        const existing = root.querySelector(selector);
        if (existing) return resolve(existing);

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                const target = root.querySelector(selector);
                if (target) {
                    observer.disconnect();
                    resolve(target);
                }
            });
        });

        observer.observe(root, config);
    });
}

async function handleFeedUpdate(mutation) {
      const target = mutation.target;
      if (target.classList.contains('GifPreview_isActive')) { // gifs
          const gifId = target.id.split('_')[1];
          addButton(target, gifId);
      } else if (target.childNodes.length){
          if (target.childNodes[0].classList.contains('_StreamateCamera_1eekr_1')) { // streams
              target.parentNode.removeChild(target);
          }
      }
}

const feedObserver = new MutationObserver(mutations => {
    mutations.forEach(handleFeedUpdate);
});

async function init() {
    const first = await waitForElm('div.GifPreview', document, {
                                   childList: true,
                                   subtree: true,
                                   attributes: true,
                                   attributeFilter: ['class']
                        });

    const feed = document.getElementsByClassName('previewFeed')[0];
    const gifPreviews = feed.getElementsByClassName('GifPreview');

    for (let gif of gifPreviews) {
        feedObserver.observe(gif, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
}

let navDebounce;
async function handleNavigate() {
  const routeWrapper = await waitForElm('div.routeWrapper');
  const navObserver = new MutationObserver(mutations => {
    if (navDebounce) clearTimeout(navDebounce);
    navDebounce = setTimeout(() => {
        feedObserver.disconnect();
        gifCache.clear();
        init();
    }, 50);
});
  navObserver.observe(routeWrapper, {childList: true});
}

handleNavigate();
init();