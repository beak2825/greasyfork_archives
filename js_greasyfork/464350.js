// ==UserScript==
// @name         RoSniperX
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  stream sniper script without using exploits
// @author       Lukas Dobbles
// @match        https://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464350/RoSniperX.user.js
// @updateURL https://update.greasyfork.org/scripts/464350/RoSniperX.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const getJSON = (url, args = {}) => {
    args.headers = args.headers || {};
    args.credentials = "include";

    return fetch(url, args).then((r) => r.json());
  };

  const search = async (placeId, name, setStatus, cb, setThumb) => {
    const userId = await getUserId(name);
    const thumbUrl = await getThumb(userId);
    setStatus("thumb url: " + thumbUrl);
    setThumb(thumbUrl);
    let cursor = null;
    let searching = true;
    let serversScraped = 0;
    const startTime = Date.now();

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    let serverQueue = [];
    let retryCount = 0;
    const maxRetries = 5;

    while (searching) {
      try {
        // Fetch servers data
        const servers = await getServer(placeId, cursor);

        // Reset retry count on success
        retryCount = 0;

        // Update the count of scraped servers
        serversScraped += servers.data.length;

        // Update the cursor for the next page
        cursor = servers.nextPageCursor;

        // Process each server's player tokens
        for (const place of servers.data) {
          const tokens = place.playerTokens.map((token) => ({ token, place }));
          serverQueue = serverQueue.concat(tokens);
        }

        // If there's no next page, exit the loop
        if (!cursor) break;

        // Update the status with the current progress
        setStatus(
          `Scraped ${serverQueue.length} player tokens from ${serversScraped} servers`
        );
      } catch (err) {
        if (retryCount >= maxRetries) {
          setStatus(
            `Error fetching servers after ${maxRetries} retries. Please try again later. ${err}`
          );
          break;
        }

        // Apply exponential backoff
        const backoffTime = Math.pow(2, retryCount) * 1000; // Exponential backoff in milliseconds
        setStatus(
          `Error fetching servers. Retrying in ${backoffTime / 1000} seconds... (${err})`
        );
        await delay(backoffTime);
        retryCount++;
        continue;
      }
    }

    let found = false;

    while (serverQueue.length > 0 && !found) {
      const tokens = serverQueue.splice(0, 100); // Process tokens in batches of 100

      try {
        const serverThumbs = (await fetchThumbs(tokens.map(({ token }) => token))).data;

        if (!serverThumbs) {
          setStatus(
            "Error fetching server thumbnails. Try again or get help at the Discord server: https://discord.gg/7zTCxVj9JD."
          );
          throw new Error("No thumbnails received");
        }

        for (const thumb of serverThumbs) {
          if (thumb && thumb.imageUrl === thumbUrl) {
            const thumbToken = thumb.requestId.split(":")[1];
            const matchedPlace = tokens.find((x) => x.token === thumbToken)?.place;

            if (matchedPlace) {
              found = true;
              setStatus(
                `Found them! Completed in ${(Date.now() - startTime) / 1000} seconds`
              );

              cb({
                found: true,
                place: matchedPlace,
              });
              return;
            }
          }
        }
      } catch (err) {
        setStatus(
          "There was an error when fetching user thumbnails. Try again or get help at the Discord server: https://discord.gg/7zTCxVj9JD. " +
            err
        );
      }
    }

    // If not found after all tokens
    if (!found) {
      cb({ found: false });
    }
  };

  const getUserId = (name) =>
    getJSON("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernames: [name],
        excludeBannedUsers: true,
      }),
    }).then((d) => d.data[0]["id"]);

  const getThumb = (id) =>
    getJSON(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&format=Png&size=150x150`
    ).then((d) => d.data[0].imageUrl);

  const getServer = (placeId, cursor) => {
    let url = `https://games.roblox.com/v1/games/${placeId}/servers/Public?limit=100`;

    if (cursor) url += "&cursor=" + cursor;
    return getJSON(url);
  };

  const fetchThumbs = (tokens) => {
    let body = [];

    tokens.forEach((token) => {
      body.push({
        requestId: `0:${token}:AvatarHeadshot:150x150:png:regular`,
        type: "AvatarHeadShot",
        targetId: 0,
        token,
        format: "png",
        size: "150x150",
      });
    });

    return getJSON("https://thumbnails.roblox.com/v1/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  const instancesContainer = document.getElementById(
    "running-game-instances-container"
  );
  if (instancesContainer) {
    const containerHeader = document.createElement("div");
    containerHeader.id = "rosniperx";

    const headerText = document.createElement("h2");
    headerText.innerText = "RoSniperX";
    headerText.id = "rosniperx-header";
    containerHeader.appendChild(headerText);

    const form = document.createElement("form");

    const thumbImage = document.createElement("img");
    thumbImage.height = "40";
    thumbImage.style.display = "none";
    containerHeader.appendChild(thumbImage);

    const usernameInput = document.createElement("input");
    usernameInput.classList = "input-field";
    usernameInput.placeholder = "Username";
    form.appendChild(usernameInput);

    const submitButton = document.createElement("button");
    submitButton.classList = "btn-primary-md";
    submitButton.innerText = "Search";
    submitButton.disabled = true;
    form.appendChild(submitButton);

    usernameInput.addEventListener("keyup", (e) => {
      submitButton.disabled = e.target.value.length === 0;
    });

    const statusText = document.createElement("p");
    form.appendChild(statusText);

    const joinBtn = document.createElement("button");
    joinBtn.style.display = "none";
    joinBtn.innerText = "Join";
    joinBtn.classList =
      "btn-control-xs rbx-game-server-join game-server-join-btn btn-primary-md btn-min-width";

    containerHeader.appendChild(form);
    containerHeader.appendChild(joinBtn);
    instancesContainer.insertBefore(
      containerHeader,
      instancesContainer.firstChild
    );

    form.addEventListener("submit", (evt) => {
      evt.preventDefault();

      joinBtn.style.display = "none";

      const placeId = location.href.match(/\d+/)[0];

      search(
        placeId,
        usernameInput.value,
        (txt) => {
          console.log(txt);
          statusText.innerText = txt;
        },
        (place) => {
          if (!place.found) {
            statusText.innerText = "couldn't find them";
            joinBtn.style.display = "none";
            return;
          }

          joinBtn.style.display = "";

          joinBtn.onclick = () => {
            window.Roblox.GameLauncher.joinGameInstance(placeId, place.place.id);
          };
        },
        (src) => {
          thumbImage.src = src;
          thumbImage.style.display = "";
        }
      );
    });
  }
})();
