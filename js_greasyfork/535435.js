// ==UserScript==
// @name         Steam Inventory Card to Badge Info
// @namespace    github.com/encumber
// @version      1.15
// @description  badge displaying when using the SteamDB extension in the steam inventory to display the badges, too tired to add more functionality tonight, there is a known bug where sometimes it wont fetch on first click, if that happens just click again
// @match        https://steamcommunity.com/*/inventory*
// @grant        GM_xmlhttpRequest
// @connect      api.steamsets.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535435/Steam%20Inventory%20Card%20to%20Badge%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/535435/Steam%20Inventory%20Card%20to%20Badge%20Info.meta.js
// ==/UserScript==

(function() {
  const API_SECRET = ''; //Steamsets API Key https://steamsets.com/settings/developer-apps

  // Inject CSS for badge styling and foil effect
  const style = document.createElement('style');
  style.textContent = `
  /* Common badge style for size and layout */
  .steam-badge-item {
      margin: 4px;
      flex: 0 0 auto;
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 10px; /* Adjust size here globally */
      width: 70px;     /* Adjust width here globally */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  }

  /* Foil style with animated shine overlay */
  .steam-badge-item.foil {
      position: relative;
      overflow: hidden;
      background-color: #222;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 0 10px rgba(255, 255, 245, 0.1);
  }

  .steam-badge-item.foil::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
          45deg,
          rgba(255, 255, 255, 0) 70%,
          rgba(255, 255, 255, 0.3) 50%,
          rgba(255, 255, 255, 0) 60%
      );
      background-size: 300% 150%;
      animation: shine 60s linear infinite;
      pointer-events: none;
  }

  @keyframes shine {
      0% { background-position: -100% 0; }
      100% { background-position: 200% 0; }
  }
  `;
  document.head.appendChild(style);

  console.log("[BadgeScript] Script initialized.");

  function displayBadges(div, badges, appId) {
    // Remove all badge info blocks *not* for this appId
    document.querySelectorAll('.steamdb_badge_info_extended').forEach(node => {
      if (node.getAttribute('data-appid') !== String(appId)) {
        node.remove();
      }
    });

    // Check if info for this appId already exists; if yes, do nothing
    const existingForApp = document.querySelector('.steamdb_badge_info_extended[data-appid="' + appId + '"]');
    if (existingForApp) {
      console.log('[BadgeScript] Badge info for appId', appId, 'already exists. Skipping creation.');
      return;
    }

    // Create new info block
    const infoDiv = document.createElement('div');
    infoDiv.className = 'steamdb_badge_info_extended';
    infoDiv.setAttribute('data-appid', appId);

    Object.assign(infoDiv.style, {
      width: '316px',
      marginTop: '8px',
      padding: '8px',
      border: '1px solid #ccc',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      boxSizing: 'border-box'
    });

    // Sort badges: non-foil first, then foil
    badges = badges.filter(b => typeof b.baseLevel === 'number' && typeof b.isFoil === 'boolean');
    badges.sort((a, b) => {
      if (a.isFoil === b.isFoil) {
        return a.baseLevel - b.baseLevel;
      }
      return a.isFoil ? 1 : -1;
    });

    badges.forEach(badge => {
      const badgeEl = document.createElement('div');
      badgeEl.className = 'steam-badge-item';
      if (badge.isFoil) {
        badgeEl.classList.add('foil');
      }

      const nameEl = document.createElement('div');
      nameEl.textContent = badge.name || 'Badge';
      Object.assign(nameEl.style, {
        fontWeight: 'bold',
        fontSize: '12px',
        width: '60px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      });

      const badgeImage = badge.badgeImage.replace(/\?.*$/, '');
      const imgUrl = `https://cdn.steamstatic.com/steamcommunity/public/images/items/${badge.appId}/${badgeImage}`;
      const imgEl = document.createElement('img');
      imgEl.src = imgUrl;
      imgEl.style.maxWidth = '60px';
      imgEl.style.maxHeight = '60px';

      const scarcityEl = document.createElement('div');
      scarcityEl.textContent = badge.scarcity || 'Scarcity';
      scarcityEl.style.fontSize = '14px';

      badgeEl.appendChild(nameEl);
      badgeEl.appendChild(imgEl);
      badgeEl.appendChild(scarcityEl);
      infoDiv.appendChild(badgeEl);
    });

    div.parentNode.insertBefore(infoDiv, div.nextSibling);
  }

  function fetchBadgeData(div) {
    if (div.dataset.processed) {
      console.log("[BadgeScript] Already processed, skipping:", div);
      return;
    }
    div.dataset.processed = 'true';

    console.log("[BadgeScript] Badge detected, will process after delay.");
    setTimeout(() => {
      const a = div.querySelector('a');
      if (!a) {
        console.log("[BadgeScript] No link inside badge div after delay, skipping:", div);
        return;
      }
      const href = a.getAttribute('href');
      const match = href.match(/\/(\d+)(?:\?.*)?$/);
      if (!match) {
        console.log("[BadgeScript] No appId found in href:", href);
        return;
      }
      const appId = parseInt(match[1], 10);
      console.log("[BadgeScript] AppId detected:", appId);

      // Skip if info for this appId already exists
      if (document.querySelector('.steamdb_badge_info_extended[data-appid="' + appId + '"]')) {
        console.log('[BadgeScript] Badge info for appId', appId, 'already exists. Skipping fetch.');
        return;
      }

      // Fetch badge data
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://api.steamsets.com/v1/app.listBadges',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + API_SECRET
        },
        data: JSON.stringify({ appId: appId }),
        onload: function(res) {
          console.log('GM_xmlhttpRequest status:', res.status);
          console.log('GM_xmlhttpRequest response:', res.responseText);
          if (res.status >= 200 && res.status < 300) {
            try {
              const data = JSON.parse(res.responseText);
              console.log('Parsed response:', data);
              if (data && data.badges) {
                displayBadges(div, data.badges, appId);
              } else {
                console.log("[BadgeScript] No badges in response for appId:", appId);
              }
            } catch (e) {
              console.error("[BadgeScript] JSON parse error:", e);
            }
          } else {
            console.error("[BadgeScript] Request failed with status:", res.status);
          }
        },
        onerror: function(err) {
          console.error("[BadgeScript] GM_xmlhttpRequest error:", err);
        }
      });
    }, 500);
  }

  // Setup DOM mutation observer
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;

        if (node.matches('div.steamdb_badge_info')) {
          console.log("[BadgeScript] Found badge div:", node);
          const hrefA = node.querySelector('a');
          if (hrefA) {
            const href = hrefA.getAttribute('href');
            const match = href.match(/\/(\d+)(?:\?.*)?$/);
            if (match) {
              const appId = parseInt(match[1], 10);
              // Remove info blocks for other appIds
              document.querySelectorAll('.steamdb_badge_info_extended').forEach(n => {
                if (n.getAttribute('data-appid') !== String(appId)) {
                  n.remove();
                }
              });
            }
          }
          fetchBadgeData(node);
        } else {
          node.querySelectorAll('div.steamdb_badge_info').forEach(n => {
            console.log("[BadgeScript] Found nested badge div:", n);
            const hrefA = n.querySelector('a');
            if (hrefA) {
              const href = hrefA.getAttribute('href');
              const match = href.match(/\/(\d+)(?:\?.*)?$/);
              if (match) {
                const appId = parseInt(match[1], 10);
                // Remove info blocks for other appIds
                document.querySelectorAll('.steamdb_badge_info_extended').forEach(n2 => {
                  if (n2.getAttribute('data-appid') !== String(appId)) {
                    n2.remove();
                  }
                });
              }
            }
            fetchBadgeData(n);
          });
        }
      }
    }
  });
  console.log("[BadgeScript] Starting MutationObserver");
  observer.observe(document.body, { childList: true, subtree: true });

  // Process existing badges at page load
  document.querySelectorAll('div.steamdb_badge_info').forEach(div => {
    console.log("[BadgeScript] Existing badge div:", div);
    const hrefA = div.querySelector('a');
    if (hrefA) {
      const href = hrefA.getAttribute('href');
      const match = href.match(/\/(\d+)(?:\?.*)?$/);
      if (match) {
        const appId = parseInt(match[1], 10);
        // Remove info blocks for other appIds
        document.querySelectorAll('.steamdb_badge_info_extended').forEach(n => {
          if (n.getAttribute('data-appid') !== String(appId)) {
            n.remove();
          }
        });
      }
    }
    fetchBadgeData(div);
  });
})();