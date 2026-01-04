// ==UserScript==
// @name         Anime Sync
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A powerful userscript that automatically tracks and syncs your anime watching progress across various streaming platforms to AniList. Features direct episode detection, smart season handling, and a clean UI for seamless progress updates.
// @author       github.com/zenjahid
// @license      MIT
// @match        *://*.aniwatchtv.to/watch/*
// @match        *://*.aniwatchtv.com/watch/*
// @match        *://*.animepahe.com/play/*
// @match        *://*.animepahe.org/play/*
// @match        *://*.animepahe.ru/play/*
// @match        *://*.anime-pahe.com/play/*
// @match        *://*.pahe.win/play/*
// @match        *://*.miruro.tv/watch*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      graphql.anilist.co
// @downloadURL https://update.greasyfork.org/scripts/531620/Anime%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/531620/Anime%20Sync.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Debug mode - set to true to see more detailed logs
  const DEBUG = true;

  // Constants
  const ANILIST_API = "https://graphql.anilist.co";
  const SUPPORTED_DOMAINS = {
    ANIWATCHTV: ["aniwatchtv.to", "aniwatchtv.com"],
    ANIMEPAHE: [
      "animepahe.com",
      "animepahe.org",
      "animepahe.ru",
      "anime-pahe.com",
      "pahe.win",
    ],
    MIRURO: ["miruro.tv"],
  };

  // Helper function to check domain
  function getDomainType(url) {
    for (const [type, domains] of Object.entries(SUPPORTED_DOMAINS)) {
      if (domains.some((domain) => url.includes(domain))) {
        return type;
      }
    }
    return null;
  }

  // Get stored credentials
  let accessToken = GM_getValue("accessToken", "");
  let username = GM_getValue("username", "");

  // Debug function
  function debug(message) {
    if (DEBUG) {
      console.log("[AniList Updater] " + message);
    }
  }

  // Show a failure popup with error details
  function showFailurePopup(message) {
    debug(`Showing failure popup: ${message}`);

    // Remove any existing popups
    const existingPopups = document.querySelectorAll(
      ".anilist-updater-error-popup"
    );
    existingPopups.forEach((popup) => popup.remove());

    const popup = document.createElement("div");
    popup.className = "anilist-updater-error-popup";
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #F44336;
      color: white;
      padding: 20px;
      border-radius: 8px;
      z-index: 100000;
      max-width: 90%;
      width: 350px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      font-family: Arial, sans-serif;
      text-align: center;
    `;

    const title = document.createElement("h3");
    title.textContent = "Update Failed";
    title.style.margin = "0 0 15px 0";

    const icon = document.createElement("div");
    icon.innerHTML = "❌";
    icon.style.fontSize = "32px";
    icon.style.marginBottom = "10px";

    const text = document.createElement("p");
    text.textContent = message;
    text.style.margin = "0 0 15px 0";

    const button = document.createElement("button");
    button.textContent = "OK";
    button.style.cssText = `
      background-color: white;
      color: #F44336;
      border: none;
      padding: 8px 20px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
    `;

    button.addEventListener("click", () => popup.remove());

    popup.appendChild(icon);
    popup.appendChild(title);
    popup.appendChild(text);
    popup.appendChild(button);

    document.body.appendChild(popup);

    // Auto-close after 15 seconds
    setTimeout(() => {
      if (document.body.contains(popup)) {
        popup.remove();
      }
    }, 15000);

    return popup;
  }

  // ------- UI ELEMENTS -------

  // Simple modal dialog
  function createModal(title, content, buttons) {
    // Remove any existing modal
    const oldModal = document.getElementById("anilist-updater-modal");
    if (oldModal) oldModal.remove();

    const overlay = document.createElement("div");
    overlay.id = "anilist-updater-modal";
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;

    const modal = document.createElement("div");
    modal.style.cssText = `
            background-color: #2b2d42;
            color: white;
            border-radius: 8px;
            padding: 20px;
            width: 350px;
            max-width: 90%;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        `;

    const headerDiv = document.createElement("div");
    headerDiv.style.cssText = `
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #444;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

    const titleEl = document.createElement("h3");
    titleEl.textContent = title;
    titleEl.style.cssText = `
            margin: 0;
            color: #6C63FF;
            font-size: 18px;
        `;

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #aaa;
            font-size: 20px;
            cursor: pointer;
        `;
    closeBtn.onclick = () => overlay.remove();

    headerDiv.appendChild(titleEl);
    headerDiv.appendChild(closeBtn);

    const contentDiv = document.createElement("div");

    if (typeof content === "string") {
      contentDiv.innerHTML = content;
    } else {
      contentDiv.appendChild(content);
    }

    const buttonDiv = document.createElement("div");
    buttonDiv.style.cssText = `
            margin-top: 20px;
            text-align: right;
        `;

    if (buttons && buttons.length) {
      buttons.forEach((btn) => {
        const button = document.createElement("button");
        button.textContent = btn.text;
        button.style.cssText = `
                    background-color: ${btn.primary ? "#6C63FF" : "#444"};
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    margin-left: 10px;
                    border-radius: 4px;
                    cursor: pointer;
                `;
        button.onclick = () => {
          if (btn.callback) btn.callback();
          if (btn.close !== false) overlay.remove();
        };
        buttonDiv.appendChild(button);
      });
    }

    modal.appendChild(headerDiv);
    modal.appendChild(contentDiv);
    modal.appendChild(buttonDiv);
    overlay.appendChild(modal);

    document.body.appendChild(overlay);
    return overlay;
  }

  // Create a notification
  function showNotification(message, type = "info", duration = 5000) {
    // Remove any existing notification with the same message
    const existingNotif = document.querySelectorAll(".anilist-updater-notif");
    existingNotif.forEach((notif) => {
      if (notif.textContent.includes(message)) {
        notif.remove();
      }
    });

    const notif = document.createElement("div");
    notif.className = "anilist-updater-notif";

    // Style based on type
    let backgroundColor = "#2196F3"; // info
    let icon = "ℹ️";

    if (type === "success") {
      backgroundColor = "#4CAF50";
      icon = "✅";
    } else if (type === "error") {
      backgroundColor = "#F44336";
      icon = "❌";
      // Errors stay longer
      duration = 8000;
    } else if (type === "warning") {
      backgroundColor = "#FF9800";
      icon = "⚠️";
    }

    notif.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background-color: ${backgroundColor};
            color: white;
            border-radius: 4px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            max-width: 300px;
            word-wrap: break-word;
        `;

    notif.textContent = `${icon} ${message}`;

    document.body.appendChild(notif);

    // Remove after duration
    setTimeout(() => {
      if (document.body.contains(notif)) {
        notif.remove();
      }
    }, duration);

    return notif;
  }

  // Show login dialog
  function showLoginDialog() {
    const content = document.createElement("div");

    content.innerHTML = `
            <p style="margin: 0 0 15px 0;">Enter your AniList access token to enable automatic updates:</p>
            <div style="margin-bottom: 15px;">
                <label for="anilist-token" style="display: block; margin-bottom: 5px; font-size: 14px;">Access Token:</label>
                <input type="password" id="anilist-token" value="${accessToken}" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #383A59; color: white;">
            </div>
            <div style="margin-bottom: 10px;">
                <label for="anilist-username" style="display: block; margin-bottom: 5px; font-size: 14px;">Your AniList Username:</label>
                <input type="text" id="anilist-username" value="${username}" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #383A59; color: white;">
            </div>
            <div style="font-size: 12px; margin-top: 15px; color: #aaa;">
                <p style="margin: 0 0 5px 0;">To get your token:</p>
                <ol style="margin: 0 0 0 20px; padding: 0;">
                    <li>Go to <a href="https://anilist.co/settings/developer" target="_blank" style="color: #6C63FF;">AniList Developer Settings</a></li>
                    <li>Create a new client (name it whatever you want)</li>
                    <li>Set redirect URL to: <code style="background: #383A59; padding: 2px 4px; border-radius: 2px;">https://anilist.co/api/v2/oauth/pin</code></li>
                    <li>Copy your Client ID</li>
                    <li>Visit: <code style="background: #383A59; padding: 2px 4px; border-radius: 2px;">https://anilist.co/api/v2/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=token</code></li>
                    <li>After authorization, copy the provided access token</li>
                </ol>
            </div>
        `;

    const modal = createModal("AniList Auto Updater Setup", content, [
      {
        text: "Save & Connect",
        primary: true,
        callback: () => {
          const tokenInput = document.getElementById("anilist-token");
          const usernameInput = document.getElementById("anilist-username");

          if (!tokenInput || !usernameInput) return;

          const newToken = tokenInput.value.trim();
          const newUsername = usernameInput.value.trim();

          if (!newToken || !newUsername) {
            showNotification("Please fill both fields!", "error");
            return;
          }

          showNotification("Verifying credentials...", "info");

          verifyToken(newToken, newUsername)
            .then((isValid) => {
              if (isValid) {
                accessToken = newToken;
                username = newUsername;
                GM_setValue("accessToken", accessToken);
                GM_setValue("username", username);

                showNotification(
                  "Successfully connected to AniList!",
                  "success"
                );
                createStatusButton();

                // Try to detect and update
                setTimeout(detectAndUpdateAnime, 1000);
              } else {
                showNotification("Invalid token or username!", "error");
              }
            })
            .catch((err) => {
              debug("Verification error: " + err);
              showNotification("Failed to verify token: " + err, "error");
            });
        },
        close: false,
      },
      {
        text: "Cancel",
        primary: false,
      },
    ]);

    return modal;
  }

  // Create or update status button
  function createStatusButton() {
    // Remove any existing button
    const existingBtn = document.getElementById("anilist-updater-status");
    if (existingBtn) existingBtn.remove();

    const btn = document.createElement("div");
    btn.id = "anilist-updater-status";
    btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background-color: #6C63FF;
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-family: Arial, sans-serif;
            font-size: 13px;
            font-weight: bold;
            z-index: 9999;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
            display: flex;
            align-items: center;
        `;

    if (accessToken && username) {
      btn.innerHTML = `<span style="margin-right: 5px;">✓</span> AniList Connected`;
      btn.title = `Connected as ${username}`;
    } else {
      btn.innerHTML = `<span style="margin-right: 5px;">⚠️</span> AniList Setup Required`;
      btn.title = "Click to connect your AniList account";
      btn.style.backgroundColor = "#FF9800";
    }

    // Add click handler
    btn.addEventListener("click", () => {
      showLoginDialog();
    });

    document.body.appendChild(btn);

    // Reposition the update button if it exists
    const updateBtn = document.getElementById("anilist-manual-update");
    if (updateBtn) {
      const statusRect = btn.getBoundingClientRect();
      updateBtn.style.left = `${statusRect.width + 20}px`;
    }

    return btn;
  }

  // ------- API FUNCTIONS -------

  // Verify token is valid
  function verifyToken(token, user) {
    debug(`Verifying token for user: ${user}`);

    return new Promise((resolve, reject) => {
      if (!token || !user) {
        reject("Missing token or username");
        return;
      }

      const query = `
                query {
                    Viewer {
                        id
                        name
                    }
                }
            `;

      GM_xmlhttpRequest({
        method: "POST",
        url: ANILIST_API,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        data: JSON.stringify({ query }),
        onload: function (response) {
          try {
            debug("Verification response received");
            const result = JSON.parse(response.responseText);

            if (result.errors) {
              debug(`Verification error: ${JSON.stringify(result.errors)}`);
              reject(result.errors[0].message);
              return;
            }

            if (result.data && result.data.Viewer && result.data.Viewer.name) {
              const isValid =
                result.data.Viewer.name.toLowerCase() === user.toLowerCase();
              debug(
                `Token validation result: ${isValid ? "Valid" : "Invalid"}`
              );
              debug(
                `API returned username: ${result.data.Viewer.name}, expected: ${user}`
              );
              resolve(isValid);
            } else {
              debug("Invalid response structure");
              reject("Invalid API response");
            }
          } catch (e) {
            debug(`Parse error: ${e.message}`);
            reject(e.message);
          }
        },
        onerror: function (error) {
          debug(`Network error: ${error}`);
          reject("Network error");
        },
      });
    });
  }

  // Extract anime title and episode from the current page
  function extractAnimeInfo() {
    debug("Extracting anime info from page");

    let title = "";
    let episode = 0;
    let season = 1;
    let rawTitle = "";
    const currentUrl = window.location.href;
    const domainType = getDomainType(currentUrl);

    try {
      switch (domainType) {
        case "MIRURO": {
          debug("Detected Miruro");
          const urlParams = new URLSearchParams(new URL(currentUrl).search);
          const anilistId = urlParams.get("id");
          const episodeNumber = urlParams.get("ep");

          if (anilistId && episodeNumber) {
            debug(
              `Found AniList ID: ${anilistId} and Episode: ${episodeNumber}`
            );
            window.anilistDirectId = anilistId;
            episode = parseInt(episodeNumber, 10);

            // Get title from page for display purposes
            title = document.title.replace(/ Episode \d+$/, "").trim();
            rawTitle = title;
          } else {
            debug("Could not find AniList ID or episode number in URL");
          }
          break;
        }

        case "ANIWATCHTV": {
          debug("Detected AniWatchTV");
          const urlMatch = currentUrl.match(
            /\/watch\/[^\/]+-(?<animeId>\d+)\?ep=(?<episodeId>\d+)/
          );
          if (!urlMatch?.groups) {
            debug("URL format not recognized");
            break;
          }

          const { animeId, episodeId } = urlMatch.groups;
          const syncData = JSON.parse(
            document.getElementById("syncData")?.textContent || "{}"
          );

          title = syncData.name?.replace(/&#39;/g, "'") || "";
          rawTitle = title;

          if (syncData.anilist_id) {
            window.anilistDirectId = syncData.anilist_id;
            debug(`Using AniList ID from syncData: ${syncData.anilist_id}`);
          }

          const domain = currentUrl.includes("aniwatchtv.com")
            ? "aniwatchtv.com"
            : "aniwatchtv.to";
          const { idToNumberMap } =
            fetchAniWatchTVEpisodes(animeId, domain) ?? {};
          episode = idToNumberMap?.get(episodeId);

          if (!title || !episode) {
            title =
              document
                .querySelector(".film-name h2, .film-name")
                ?.textContent?.trim() || "";
            rawTitle = title;
            const epMatch = document
              .querySelector(".ep-item.active")
              ?.textContent?.match(/(\d+)/);
            episode = epMatch ? parseInt(epMatch[1], 10) : 0;
          }
          break;
        }

        case "ANIMEPAHE": {
          debug("Detected AnimePahe");

          // Step 1: Get AniList ID directly from meta tag
          const anilistMetaTag = document.querySelector('meta[name="anilist"]');
          if (anilistMetaTag) {
            const anilistId = anilistMetaTag.getAttribute("content");
            debug(`Found AniList ID directly from meta tag: ${anilistId}`);

            // Store the AniList ID in a global variable
            window.anilistDirectId = anilistId;

            // Get title from page title
            const pageTitle = document.title;
            const titleMatch = pageTitle.match(/(.*?)(?:Episode|Ep\.) ?(\d+)/i);
            if (titleMatch) {
              title = titleMatch[1].trim();
              rawTitle = title;
              debug(`Title extracted from page title: ${title}`);
            }
          }

          // Step 2: Get episode number from scrollArea and map to actual episode number
          const scrollArea = document.getElementById("scrollArea");
          if (scrollArea) {
            debug("Found scrollArea element for episode list");

            // Get all episode links
            const episodeLinks = Array.from(
              scrollArea.querySelectorAll("a.dropdown-item")
            );
            debug(`Found ${episodeLinks.length} episode links in scrollArea`);

            if (episodeLinks.length > 0) {
              // Sort episodes by their displayed number to ensure correct mapping
              episodeLinks.sort((a, b) => {
                const aNum = parseInt(
                  a.textContent.match(/Episode\s+(\d+)/i)?.[1] || "0",
                  10
                );
                const bNum = parseInt(
                  b.textContent.match(/Episode\s+(\d+)/i)?.[1] || "0",
                  10
                );
                return aNum - bNum;
              });

              // Create mapping of displayed episode numbers to actual episode numbers (1-based)
              const episodeMapping = new Map();
              episodeLinks.forEach((link, index) => {
                const displayedEp = parseInt(
                  link.textContent.match(/Episode\s+(\d+)/i)?.[1] || "0",
                  10
                );
                const actualEp = index + 1; // 1-based indexing
                episodeMapping.set(displayedEp, actualEp);
                debug(
                  `Mapped displayed episode ${displayedEp} to actual episode ${actualEp}`
                );
              });

              // Find the active episode
              const activeEpisodeLink = scrollArea.querySelector(
                "a.dropdown-item.active"
              );
              const currentPath = window.location.pathname;

              if (activeEpisodeLink) {
                // Get displayed episode number from active link text
                const epTextMatch =
                  activeEpisodeLink.textContent.match(/Episode\s+(\d+)/i);
                if (epTextMatch) {
                  const displayedEp = parseInt(epTextMatch[1], 10);
                  episode = episodeMapping.get(displayedEp) || displayedEp;
                  debug(
                    `Found displayed episode ${displayedEp}, mapped to actual episode ${episode}`
                  );
                }
              } else {
                // No active link, try to match URL path
                for (let i = 0; i < episodeLinks.length; i++) {
                  if (
                    episodeLinks[i]
                      .getAttribute("href")
                      .includes(currentPath.split("/").pop())
                  ) {
                    const epTextMatch =
                      episodeLinks[i].textContent.match(/Episode\s+(\d+)/i);
                    if (epTextMatch) {
                      const displayedEp = parseInt(epTextMatch[1], 10);
                      episode = episodeMapping.get(displayedEp) || displayedEp;
                      debug(
                        `Matched URL to displayed episode ${displayedEp}, mapped to actual episode ${episode}`
                      );
                    }
                    break;
                  }
                }
              }
            }
          }
          break;
        }

        case "CRUNCHYROLL": {
          debug("Detected Crunchyroll");
          const titleElem = document.querySelector(
            ".show-title-link h4, [data-t='show_title'], h4.title span, meta[property='og:title']"
          );

          if (titleElem?.tagName === "META") {
            title = titleElem.getAttribute("content").split(" - ")[0].trim();
          } else {
            title = titleElem?.textContent?.trim() || "";
          }
          rawTitle = title;

          const episodeMatch =
            currentUrl.match(/\/(\d+)$/) ||
            document
              .querySelector(".episode-title")
              ?.textContent?.match(/Episode (\d+)/);
          if (episodeMatch) {
            episode = parseInt(episodeMatch[1], 10);
          }

          const seasonMatch =
            document.title.match(/Season (\d+)/) ||
            document
              .querySelector(".season-name")
              ?.textContent?.match(/Season (\d+)/);
          if (seasonMatch) {
            season = parseInt(seasonMatch[1], 10);
          }
          break;
        }

        default:
          debug(`Unsupported domain type: ${domainType}`);
          break;
      }

      // Clean up title if we found one
      if (title) {
        const originalTitle = title;
        title = title
          .replace(/ \(TV\)/gi, "")
          .replace(/ \((Sub|Dub|Dubbed|Subbed)\)/gi, "")
          .replace(/ Season \d+/gi, "")
          .replace(/ Part \d+/gi, "")
          .replace(/ \(\d{4}\)/g, "")
          .replace(/ \- \d+/g, "")
          .replace(/^Watch /i, "")
          .replace(/ Online$/i, "")
          .replace(/English Sub\/Dub$/i, "")
          .trim();

        debug(`Cleaned title: "${originalTitle}" → "${title}"`);
      }

      debug(
        `Final extraction: Title="${title}", Season=${season}, Episode=${episode}, Raw Title="${rawTitle}"`
      );
      return { title, episode, season, rawTitle };
    } catch (error) {
      debug(`Error extracting anime info: ${error.message}`);
      return { title: "", episode: 0, season: 1, rawTitle: "" };
    }
  }

  // Search for anime on AniList
  function searchAnime(title) {
    debug(`Searching for anime: "${title}"`);

    return new Promise((resolve, reject) => {
      if (!title) {
        reject("No title provided for search");
        return;
      }

      const query = `
                query ($search: String) {
                    Page (page: 1, perPage: 5) {
                        media (search: $search, type: ANIME) {
                            id
                            title {
                                romaji
                                english
                                native
                            }
                            status
                            episodes
                        }
                    }
                }
            `;

      GM_xmlhttpRequest({
        method: "POST",
        url: ANILIST_API,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: JSON.stringify({
          query: query,
          variables: { search: title },
        }),
        onload: function (response) {
          try {
            debug("Search response received");
            const result = JSON.parse(response.responseText);

            if (result.errors) {
              debug(`Search error: ${JSON.stringify(result.errors)}`);
              reject(result.errors[0].message);
              return;
            }

            if (
              result.data &&
              result.data.Page &&
              result.data.Page.media &&
              result.data.Page.media.length > 0
            ) {
              debug(
                `Found ${result.data.Page.media.length} results for "${title}"`
              );
              debug(
                `First result: ${
                  result.data.Page.media[0].title.english ||
                  result.data.Page.media[0].title.romaji
                }`
              );
              resolve(result.data.Page.media);
            } else {
              debug("No results found");
              reject(`No anime found with title "${title}"`);
            }
          } catch (e) {
            debug(`Parse error: ${e.message}`);
            reject(e.message);
          }
        },
        onerror: function (error) {
          debug(`Network error during search: ${error}`);
          reject("Network error during search");
        },
      });
    });
  }

  // Update anime progress on AniList
  function updateAnimeProgress(animeId, episode) {
    debug(`Updating anime (ID: ${animeId}) to episode ${episode}`);

    return new Promise((resolve, reject) => {
      if (!accessToken) {
        reject("No access token provided");
        return;
      }

      if (!animeId || !episode) {
        reject("Invalid anime ID or episode number");
        return;
      }

      const query = `
                mutation ($mediaId: Int, $progress: Int) {
                    SaveMediaListEntry (mediaId: $mediaId, progress: $progress, status: CURRENT) {
                        id
                        progress
                        status
                    }
                }
            `;

      GM_xmlhttpRequest({
        method: "POST",
        url: ANILIST_API,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + accessToken,
        },
        data: JSON.stringify({
          query: query,
          variables: {
            mediaId: animeId,
            progress: episode,
          },
        }),
        onload: function (response) {
          try {
            debug("Update response received");
            const result = JSON.parse(response.responseText);

            if (result.errors) {
              debug(`Update error: ${JSON.stringify(result.errors)}`);
              reject(result.errors[0].message);
              return;
            }

            if (result.data && result.data.SaveMediaListEntry) {
              debug(`Successfully updated to episode ${episode}`);
              // Store the last updated anime and episode
              GM_setValue("lastUpdatedAnime", animeId);
              GM_setValue("lastUpdatedEpisode", episode);
              GM_setValue("lastUpdateTime", Date.now());

              // Store in history
              const history = GM_getValue("updateHistory", []);
              history.unshift({
                id: animeId,
                episode: episode,
                timestamp: Date.now(),
              });

              if (history.length > 10) history.pop();
              GM_setValue("updateHistory", history);

              resolve(result.data.SaveMediaListEntry);
            } else {
              debug("Unknown error in update response");
              reject("Unknown error updating anime progress");
            }
          } catch (e) {
            debug(`Parse error: ${e.message}`);
            reject(e.message);
          }
        },
        onerror: function (error) {
          debug(`Network error during update: ${error}`);
          reject("Network error during update");
        },
      });
    });
  }

  // Main function to detect anime and update AniList
  function detectAndUpdateAnime(forceUpdate = false) {
    debug("Starting detection process");

    // Check if we have credentials
    if (!accessToken || !username) {
      debug("Missing credentials");
      if (!document.getElementById("anilist-updater-modal")) {
        showNotification("AniList Auto Updater needs setup", "warning");
        showLoginDialog();
      }
      return;
    }

    // Extract anime info from page
    const { title, episode, season, rawTitle } = extractAnimeInfo();

    if (!title || !episode) {
      debug(`Missing title (${title}) or episode (${episode})`);
      showNotification(
        "Could not detect anime information on this page",
        "warning"
      );
      return;
    }

    debug(
      `Detected anime: "${title}", Season: ${season}, Episode: ${episode}, Raw Title: "${rawTitle}"`
    );

    // Check if this is the same as our last update
    const lastUpdatedAnime = GM_getValue("lastUpdatedAnime", null);
    const lastUpdatedEpisode = GM_getValue("lastUpdatedEpisode", null);
    const lastUpdateTime = GM_getValue("lastUpdateTime", 0);
    const updateThreshold = 30 * 60 * 1000; // 30 minutes threshold

    // Only update if:
    // 1. We're forcing an update, OR
    // 2. This is a different anime or episode than last time, OR
    // 3. The same anime/episode but last update was over threshold ago
    const needsUpdate =
      forceUpdate ||
      lastUpdatedAnime !== title ||
      lastUpdatedEpisode !== episode ||
      Date.now() - lastUpdateTime > updateThreshold;

    if (!needsUpdate) {
      debug("Skipping update - same anime/episode updated recently");
      return;
    }

    // If we have a direct AniList ID, use it instead of searching
    if (window.anilistDirectId) {
      debug(`Using direct AniList ID: ${window.anilistDirectId}`);

      // Show confirm dialog for manual updates
      if (forceUpdate) {
        let confirmMessage = `<p>Update anime (ID: ${window.anilistDirectId}) to episode <strong>${episode}</strong>?</p>`;

        createModal("Confirm Update", confirmMessage, [
          {
            text: "Update",
            primary: true,
            callback: () =>
              performUpdate(window.anilistDirectId, title, episode),
          },
          {
            text: "Cancel",
            primary: false,
          },
        ]);
      } else {
        // Automatic update
        performUpdate(window.anilistDirectId, title, episode);
      }
      return;
    }

    // Fallback to title search if no direct ID is available
    showNotification(`Searching for "${title}" on AniList...`, "info");

    searchAnime(title)
      .then((results) => {
        if (!results || results.length === 0) {
          showNotification(`Could not find "${title}" on AniList`, "error");
          return;
        }

        const animeData = results[0];
        const displayTitle = animeData.title.english || animeData.title.romaji;
        const animeId = animeData.id;
        let actualEpisode = episode;

        debug(`Selected anime: "${displayTitle}" (ID: ${animeId})`);

        // Handle multi-season episode calculation
        if (animeData.episodes && episode > animeData.episodes && season > 1) {
          debug(
            `Episode ${episode} exceeds total episodes (${animeData.episodes}) in season ${season}`
          );
          const seasonData = GM_getValue(`anime_seasons_${animeId}`, {});

          // Calculate actual episode based on season
          let offset = 0;
          for (let i = 1; i < season; i++) {
            const prevSeasonEps =
              seasonData[`season${i}`]?.episodes ||
              (i === 1 ? animeData.episodes : 12);
            offset += prevSeasonEps;
          }
          actualEpisode = episode + offset;
          debug(
            `Adjusted episode from ${episode} to ${actualEpisode} due to season ${season}`
          );

          // Store season data
          seasonData[`season${season}`] = {
            firstEp: 1,
            anilistOffset: offset,
          };
          GM_setValue(`anime_seasons_${animeId}`, seasonData);
        }

        // Show confirm dialog for manual updates
        if (forceUpdate) {
          let confirmMessage = `<p>Update <strong>${displayTitle}</strong> to episode <strong>${actualEpisode}</strong>?</p>`;
          if (actualEpisode !== episode) {
            confirmMessage += `<p style="font-size: 12px; color: #aaa;">Note: Converting from Season ${season} Episode ${episode} to overall episode ${actualEpisode}.</p>`;
          }

          createModal("Confirm Update", confirmMessage, [
            {
              text: "Update",
              primary: true,
              callback: () =>
                performUpdate(animeId, displayTitle, actualEpisode),
            },
            {
              text: "Cancel",
              primary: false,
            },
          ]);
        } else {
          // Automatic update
          performUpdate(animeId, displayTitle, actualEpisode);
        }
      })
      .catch((error) => {
        debug(`Search error: ${error}`);
        showNotification(`Error searching anime: ${error}`, "error");
      });
  }

  // Perform the actual update
  function performUpdate(animeId, displayTitle, episode) {
    debug(
      `Performing update for ${displayTitle} (ID: ${animeId}) to episode ${episode}`
    );

    // Check if we have a direct AniList ID from meta tag
    if (window.anilistDirectId) {
      debug(`Using direct AniList ID from meta tag: ${window.anilistDirectId}`);
      animeId = window.anilistDirectId;
    }

    // Show a notification that we're updating
    showNotification(
      `Updating "${displayTitle}" to episode ${episode}...`,
      "info"
    );

    updateAnimeProgress(animeId, episode)
      .then(() => {
        debug("Update successful");
        showNotification(
          `Successfully updated "${displayTitle}" to episode ${episode}!`,
          "success"
        );

        // Update the status button with success state
        const statusBtn = document.getElementById("anilist-updater-status");
        if (statusBtn) {
          statusBtn.innerHTML = `<span style="margin-right: 5px;">✓</span> Updated EP ${episode}`;
          statusBtn.style.backgroundColor = "#4CAF50";

          // Reset after 5 seconds
          setTimeout(() => {
            if (document.body.contains(statusBtn)) {
              statusBtn.innerHTML = `<span style="margin-right: 5px;">✓</span> AniList Connected`;
              statusBtn.style.backgroundColor = "#6C63FF";
            }
          }, 5000);
        }
      })
      .catch((error) => {
        debug(`Update failed: ${error}`);
        showNotification(`Failed to update: ${error}`, "error");
        showFailurePopup(
          `Failed to update "${displayTitle}" to episode ${episode}. Error: ${error}`
        );

        // Update status button with error state
        const statusBtn = document.getElementById("anilist-updater-status");
        if (statusBtn) {
          statusBtn.innerHTML = `<span style="margin-right: 5px;">❌</span> Update Failed`;
          statusBtn.style.backgroundColor = "#F44336";

          // Reset after 5 seconds
          setTimeout(() => {
            if (document.body.contains(statusBtn)) {
              statusBtn.innerHTML = `<span style="margin-right: 5px;">✓</span> AniList Connected`;
              statusBtn.style.backgroundColor = "#6C63FF";
            }
          }, 5000);
        }
      });
  }

  // Add manual update button
  function addManualUpdateButton() {
    // Remove any existing button
    const existingBtn = document.getElementById("anilist-manual-update");
    if (existingBtn) existingBtn.remove();

    // Get the status button width to calculate positioning
    const statusBtn = document.getElementById("anilist-updater-status");
    let statusWidth = 120; // Default fallback width

    if (statusBtn) {
      const statusRect = statusBtn.getBoundingClientRect();
      statusWidth = statusRect.width + 20; // Add 20px padding
    }

    const button = document.createElement("div");
    button.id = "anilist-manual-update";
    button.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: ${statusWidth}px;
            background-color: #6C63FF;
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            font-weight: bold;
            z-index: 9999;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            opacity: 0.7;
            transition: opacity 0.3s, background-color 0.3s;
        `;

    button.innerHTML = `📝 Update Now`;
    button.title = "Manually update AniList";

    button.addEventListener("mouseover", () => {
      button.style.opacity = "1";
    });

    button.addEventListener("mouseout", () => {
      button.style.opacity = "0.7";
    });

    button.addEventListener("click", () => {
      detectAndUpdateAnime(true); // Force update
    });

    document.body.appendChild(button);

    // Reposition on window resize
    window.addEventListener("resize", () => {
      const statusBtn = document.getElementById("anilist-updater-status");
      if (statusBtn && button) {
        const statusRect = statusBtn.getBoundingClientRect();
        button.style.left = `${statusRect.width + 20}px`;
      }
    });

    return button;
  }

  // Function to detect page changes in SPAs (Single Page Applications)
  function detectPageChange() {
    let lastUrl = window.location.href;

    // Create a new MutationObserver instance
    const observer = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        debug(`URL changed to: ${lastUrl}`);

        // Wait for page content to load
        setTimeout(() => {
          detectAndUpdateAnime();
        }, 3000);
      }
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });
    debug("Page change detection initialized");
  }

  // Initialize everything
  function init() {
    debug("Initializing AniList Auto Updater");

    // Create status button
    createStatusButton();

    // Add manual update button
    addManualUpdateButton();

    // Check if we have credentials, and if not, show login immediately
    if (!accessToken || !username) {
      debug("No credentials found, showing login dialog immediately");
      showLoginDialog();
    } else {
      // Verify token silently
      verifyToken(accessToken, username)
        .then((isValid) => {
          if (isValid) {
            debug("Stored token is valid");
            // Successful verification, run detection
            setTimeout(detectAndUpdateAnime, 2000);
          } else {
            debug("Stored token is invalid");
            showNotification(
              "Your AniList token appears to be invalid. Please re-authenticate.",
              "error"
            );
            showLoginDialog();
          }
        })
        .catch((err) => {
          debug(`Token verification error: ${err}`);
          showNotification("Error verifying AniList token", "error");
          showFailurePopup(
            `Could not verify your AniList token. Error: ${err}`
          );
          showLoginDialog();
        });
    }

    // Setup page change detection for SPAs
    detectPageChange();
  }

  // Register menu command
  GM_registerMenuCommand("AniList Auto Updater Settings", showLoginDialog);

  // Start the script once the page is fully loaded
  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init);
  }

  // Update the fetchAniWatchTVEpisodes function
  function fetchAniWatchTVEpisodes(animeId, domain = "aniwatchtv.to") {
    debug(`Fetching episode data for anime ID: ${animeId}`);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        `https://${domain}/ajax/v2/episode/list/${animeId}`,
        false
      );
      xhr.send();

      if (xhr.status !== 200) {
        throw new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
      }

      const { status, html } = JSON.parse(xhr.responseText);
      if (!status || !html) {
        throw new Error("Invalid API response");
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const episodeItems = Array.from(
        doc.querySelectorAll(".ssl-item.ep-item")
      );

      if (!episodeItems.length) {
        debug("No episodes found");
        return null;
      }

      // Sort episodes by their number and create mapping
      const sortedEpisodes = episodeItems
        .map((item) => ({
          id: item.getAttribute("data-id"),
          number: parseInt(item.getAttribute("data-number"), 10),
        }))
        .sort((a, b) => a.number - b.number);

      const idToNumberMap = new Map(
        sortedEpisodes.map((ep, idx) => [ep.id, idx + 1])
      );

      debug(`Mapped ${idToNumberMap.size} episodes`);
      return { idToNumberMap };
    } catch (error) {
      debug(`Episode fetch error: ${error.message}`);
      return null;
    }
  }
})();
