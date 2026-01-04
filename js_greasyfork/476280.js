// ==UserScript==
// @name         sniped by barrett
// @namespace    http://tampermonkey.net/
// @version      2.5.3
// @description  (WORKING AS OF 5/08/2025) The only working stream sniper script without using exploits
// @author       Laurent De Laurentis
// @match        https://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476280/sniped%20by%20barrett.user.js
// @updateURL https://update.greasyfork.org/scripts/476280/sniped%20by%20barrett.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const getJSON = (url, args = {}) => {
    args.headers = args.headers || {};
    return fetch(url, args)
      .then((r) => r.json())
      .catch((e) => console.log(e));
  };

  const search = async (placeId, name, setStatus, cb, setThumb) => {
    const userId = await getUserId(name);
    const thumbUrl = await getThumb(userId);
    setStatus("thumb url: " + thumbUrl);
    setThumb(thumbUrl);
    let cursor = null;
    let searching = true;
    let allPlayerTokens = [];

    while (searching) {
      const servers = await getServer(placeId, cursor);

      cursor = servers.nextPageCursor;
      for (let i = 0; i < servers.data.length; i++) {
        const place = servers.data[i];
        allPlayerTokens = allPlayerTokens.concat(
          place.playerTokens.map((token) => ({
            token,
            place,
          }))
        );
      }

      if (!cursor) break;

      setStatus("looking deeper..");
    }

    const chunkSize = 100;
    let i = 0;

    let found = false;

    const nextThumbChunk = () => {
      if (found) return;

      let chunk;
      if (i + chunkSize > allPlayerTokens.length) {
        chunk = allPlayerTokens.slice(i);
      } else {
        chunk = allPlayerTokens.slice(i, i + chunkSize);
      }
      i += chunkSize;

      setStatus(
        `searching servers ${Math.floor((i / allPlayerTokens.length) * 100)}%`
      );

      fetchThumbs(chunk.map(({ token }) => token)).then(
        ({ data: serverThumbs }) => {
          if (!serverThumbs) setStatus("error: " + serverThumbs);
          else {
            for (let k = 0; k < serverThumbs.length; k++) {
              const thumb = serverThumbs[k];
              if (thumb && thumb.imageUrl === thumbUrl) {
                found = true;

                setStatus(thumb.imageUrl);
                setStatus("TRACKED!");

                const thumbToken = thumb.requestId.split(":")[1];
                cb({
                  found: true,
                  place: chunk.filter((x) => x.token === thumbToken)[0].place,
                });
              }
            }

            if (i + chunkSize > allPlayerTokens.length && !found)
              cb({ found: false });
            else if (!found) nextThumbChunk();
          }
        }
      );
    };

    [...Array(10)].map(() => nextThumbChunk());
  };

  const getUserId = (name) =>
    fetch("https://www.roblox.com/users/profile?username=" + name).then((r) => {
      if (!r.ok) throw "check the user!";
      return r.url.match(/\d+/)[0];
    });

  const getThumb = (id) =>
    getJSON(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&format=Png&size=150x150`
    ).then((d) => d.data[0].imageUrl);

  const getServer = (placeId, cursor) => {
    let url = `https://games.roblox.com/v1/games/${placeId}/servers/Public?limit=100`;

    if (cursor) url += "&cursor=" + cursor;
    return getJSON(url).catch(() => null);
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
    containerHeader.classList = "section";

    const headerText = document.createElement("h2");
    headerText.innerText = "sniped by barrettscowboy";
    containerHeader.appendChild(headerText);

    const form = document.createElement("form");

    const thumbImage = document.createElement("img");
    thumbImage.height = "40";
    thumbImage.display = "none";
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

    usernameInput.addEventListener("keyup", (e)=> {
      submitButton.disabled = e.target.value.length === 0;
    })

    const statusText = document.createElement("p");
    form.appendChild(statusText);

    const joinBtn = document.createElement("button");
    joinBtn.style.display = "none";
    joinBtn.innerText = "clock";
    joinBtn.classList =
      "btn-control-xs rbx-game-server-join game-server-join-btn btn-primary-md btn-min-width";

    const donateButton = document.createElement("a");
    donateButton.href =
      "https://www.paypal.com/paypalme/hellisateenageboy";
    donateButton.target = "blank";
    donateButton.style.marginTop = "0.2rem";
    donateButton.classList = "btn-secondary-md";
    donateButton.innerText = "donate :3";

    containerHeader.appendChild(form);
    containerHeader.appendChild(joinBtn);
    containerHeader.appendChild(donateButton);
    instancesContainer.insertBefore(
      containerHeader,
      instancesContainer.firstChild
    );

    const placeId = location.href.match(/\d+/)[0];

    form.addEventListener("submit", (evt) => {
      evt.preventDefault();

      joinBtn.display = "none";

      search(
        placeId,
        usernameInput.value,
        (txt) => {
          console.log(txt);
          statusText.innerText = txt;
        },
        (place) => {
          if (!place.found) {
            statusText.innerText = "not there :(";
            return;
          }

          joinBtn.style.display = "";
          joinBtn.onclick = () => {
            window.Roblox.GameLauncher.joinGameInstance(
              placeId,
              place.place.id
            );
          };
        },
        (src)=> {
           thumbImage.src = src;
           thumbImage.display = "";
        }
      );
    });
  }
})();



