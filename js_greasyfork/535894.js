// ==UserScript==
// @name         Bitcointalk Banned Users Checker
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Checks if a user is banned on Bitcointalk.
// @author       promise444c5
// @match        https://bitcointalk.org/index.php?action=profile*
// @match        https://bitcointalk.org/index.php?topic=*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      loyce.club
// @downloadURL https://update.greasyfork.org/scripts/535894/Bitcointalk%20Banned%20Users%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/535894/Bitcointalk%20Banned%20Users%20Checker.meta.js
// ==/UserScript==

(function () {
    "use strict";
  
    const BANNED_LIST_URL = "https://loyce.club/bans/usernames.txt";
    const CACHE_KEY_DATA = "bannedUsersData";
    const CACHE_KEY_TIMESTAMP = "bannedUsersTimestamp";
    const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // cache for 1 day  (24 hours)
  
    let bannedUsers = [];
    let scriptError = false;
  
    function parseBannedUsers(text) {
      const users = [];
      if (!text) return users;
  
      text.split("\n").forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          const lastColonIndex = trimmedLine.lastIndexOf(":");
          if (lastColonIndex !== -1) {
            const userId = trimmedLine.substring(0, lastColonIndex).trim();
            const username = trimmedLine.substring(lastColonIndex + 1).trim();
            users.push({ username, userId });
          } else {
            console.warn(`Bitcointalk Ban Checker: Skipping malformed line: ${trimmedLine}`);
          }
        }
      });
      return users;
    }
  
    function applyBan() {
      if (scriptError || bannedUsers.length === 0) {
        console.log(
          "Bitcointalk Ban Checker: Skipping application due to error or empty list."
        );
        return;
      }
  
      console.log(
        `Bitcointalk Ban Checker: Applying Ban on ${bannedUsers.length} banned users.`
      );
      const currentUrl = window.location.href;
      const isProfilePage = currentUrl.includes("action=profile");
      const isThreadPage = currentUrl.includes("topic=");
  
      // Add CSS style to the page
      const style = document.createElement("style");
      style.textContent = `
            .banned-user-text {
              text-decoration: line-through;
              color: red;
            }
      
            .banned-label {
              background-color: red;
              color: white;
              font-size: 10px;
              padding: 1px 3px;
              border-radius: 3px;
              margin-left: 5px;
              font-weight: bold;
              display: inline-block;
              vertical-align: middle;
            }
          `;
      document.head.appendChild(style);
  
      if (isProfilePage) {
        console.log("Bitcointalk Ban Checker: Running on profile page.");
        let profileUsernameElement = null;
        // Find the 'Name:' cell and get the next sibling cell which contains the username
        document.querySelectorAll("td.windowbg table td").forEach((td) => {
          const boldElement = td.querySelector("b");
          if (boldElement && boldElement.textContent.trim() === "Name:") {
            profileUsernameElement = td.nextElementSibling;
            console.log(
              "Bitcointalk Ban Checker: Found potential username TD element."
            );
          }
        });
  
        if (profileUsernameElement) {
          let profileUsername = profileUsernameElement.textContent.trim();
          console.log(
            `Bitcointalk Ban Checker: Checking profile username: ${profileUsername}`
          );
  
          // Check if the username exists in the bannedUsers array
          const isBanned = bannedUsers.find(
            (user) => user.username === profileUsername
          );
  
          if (isBanned) {
            let banMessage = `User ${profileUsername} is listed as banned.`;
  
            // Create and insert the ban status message below the username row
            let banStatusElement = document.createElement("div");
            banStatusElement.style.color = "red";
            banStatusElement.style.fontWeight = "bold";
            banStatusElement.style.marginTop = "5px";
            banStatusElement.textContent = banMessage;
  
            let usernameRow = profileUsernameElement.closest("tr");
            if (usernameRow && usernameRow.parentNode) {
              let newRow = document.createElement("tr");
              let newCell = document.createElement("td");
              newCell.colSpan = 2;
              newCell.appendChild(banStatusElement);
              newRow.appendChild(newCell);
              usernameRow.parentNode.insertBefore(
                newRow,
                usernameRow.nextSibling
              );
              console.log(
                "Bitcointalk Ban Checker: Inserted ban status message row."
              );
            } else {
              console.warn(
                "Bitcointalk Ban Checker: Could not find username row to insert message."
              );
            }
  
            // Check if label already exists to prevent duplicates on potential re-runs (though unlikely on profile)
            if (!profileUsernameElement.querySelector(".banned-label")) {
              const bannedLabel = document.createElement("span");
              bannedLabel.textContent = "BANNED";
              bannedLabel.classList.add("banned-label");
              // Append the label to the TD containing the username
              profileUsernameElement.appendChild(bannedLabel);
              console.log(
                "Bitcointalk Ban Checker: Appended BANNED label to username TD."
              );
              // The following lines attempt to wrap the text and re-append the label,
              profileUsernameElement.childNodes[0].nodeValue =
                profileUsernameElement.childNodes[0].nodeValue + " "; // Add space before label - This assumes first child is text node
              profileUsernameElement.innerHTML = `<span class="banned-user-text">${profileUsername}</span>`; // Wrap text - This overwrites existing content including the label just added
              profileUsernameElement.appendChild(bannedLabel);
            }
          } else {
            console.log(
              `Bitcointalk Ban Checker: User ${profileUsername} is not listed as banned.`
            );
          }
        } else {
          console.log(
            "Bitcointalk Ban Checker: Could not find username element on profile page using the 'Name:' label."
          );
        }
      } else if (isThreadPage) {
        console.log("Bitcointalk Ban Checker: Running on thread page.");
        function checkBannedUsersOnThread() {
          const postElements = document.querySelectorAll(".windowbg, .windowbg2");
          let bannedFound = 0;
  
          postElements.forEach((post) => {
            const usernameElement = post.querySelector(".poster_info b a");
            if (!usernameElement) return;
  
            // Check if style already applied to prevent redundant checks/updates
            if (usernameElement.style.textDecoration === "line-through") return;
  
            const username = usernameElement.textContent.trim();
  
            // Check if the username exists in the bannedUsers array
            const isBanned = bannedUsers.find(
              (user) => user.username === username
            );
  
            if (isBanned) {
              // Apply styles directly to the <a> tag
              usernameElement.style.textDecoration = "line-through";
              usernameElement.style.color = "red";
  
              // create a label next to the username link
              if (!usernameElement.parentNode.querySelector(".banned-label")) {
                const bannedLabel = document.createElement("span");
                bannedLabel.textContent = "BANNED";
                bannedLabel.classList.add("banned-label");
                usernameElement.parentNode.insertBefore(
                  bannedLabel,
                  usernameElement.nextSibling
                );
                bannedFound++;
                console.log(
                  `Bitcointalk Ban Checker: Added BANNED label for ${username}.`
                );
              }
            }
          });
          if (bannedFound > 0) {
            console.log(
              `Bitcointalk Ban Checker: Found ${bannedFound} banned occurence`
            );
          }
        }
  
        // Initial check
        checkBannedUsersOnThread();
      }
    }
  
    /*
     ** Fetch and cache list,
     ** Used in the main script execution
     */
    const fetchAndCacheList = () => {
      console.log("Bitcointalk Ban Checker: Fetching fresh banned users list...");
  
      //Modified header
      const reqHeader = {
        "User-Agent": "UserScript/1.0",
        Accept: "text/plain",
        "Accept-Language": "en",
        Referer: "",
      };
  
      GM_xmlhttpRequest({
        method: "GET",
        url: BANNED_LIST_URL,
        headers: reqHeader,
        timeout: 5000, // 5 seconds timeout
        onload: (response) => {
          if (response.status >= 200 && response.status < 300) {
            const fetchedText = response.responseText;
            bannedUsers = parseBannedUsers(fetchedText);
            GM_setValue(CACHE_KEY_DATA, fetchedText); // Store raw text
            GM_setValue(CACHE_KEY_TIMESTAMP, Date.now());
            console.log(
              `Bitcointalk Ban Checker: Successfully fetched and cached ${bannedUsers.length} users.`
            );
            applyBan();
          } else {
            console.error(
              `Bitcointalk Ban Checker: Failed to fetch list. Status: ${response.status}`
            );
            scriptError = true;
            // use stale cache if available?
            applyBan();
          }
        },
        onerror: function (error) {
          console.error(
            "Bitcointalk Ban Checker: Network error fetching list.",
            error
          );
          scriptError = true;
        },
      });
    };
  
    /* --- Main Script Execution ---*/
    const cachedTimestamp = GM_getValue(CACHE_KEY_TIMESTAMP, 0);
    const cachedData = GM_getValue(CACHE_KEY_DATA, null);
    const now = Date.now();
  
    if (cachedData && now - cachedTimestamp < CACHE_DURATION_MS) {
      console.log("Bitcointalk Ban Checker: Using cached banned users list.");
      bannedUsers = parseBannedUsers(cachedData);
      applyBan();
    } else {
      if (cachedData) {
        console.log("Bitcointalk Ban Checker: Cache expired, fetching new list.");
        // Use stale data immediately while fetching in background
        bannedUsers = parseBannedUsers(cachedData);
        applyBan();
        fetchAndCacheList(); // Fetch new list in background
      } else {
        console.log("Bitcointalk Ban Checker: No cache found, fetching list.");
        fetchAndCacheList(); // Fetch list
      }
    }
  })();
