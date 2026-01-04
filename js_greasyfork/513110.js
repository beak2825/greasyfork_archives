// ==UserScript==
// @name         Komoot Tour Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Easily download komoot tours as GPX
// @author       Ulysses
// @match        https://www.komoot.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=komoot.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513110/Komoot%20Tour%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/513110/Komoot%20Tour%20Downloader.meta.js
// ==/UserScript==
(function() {
    'use strict';

const downloadGPXToken = "Download GPX";

const BASIC_URL_REGEX =
  /https:\/\/www.komoot.([a-z]+)(\/[a-z][a-z]-[a-z][a-z])?/;
const TOUR_URL_REGEX =
  /https:\/\/www.komoot.([a-z]+)(\/[a-z][a-z]-[a-z][a-z])?\/(tour|smarttour)\/([a-z0-9]+)/;

const getId = () => {
  const match = window.location.href.match(TOUR_URL_REGEX);
  if (match === null) {
    return undefined;
  }
  const [, , , , id] = match; // Use the match variable directly
  return id;
};
const getName = () => document.title.split("|")[0];

const containsGPX = () => getId() !== undefined;

const getPositionsFromMainPage = async () => {
  const response = await fetch(window.location.href, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "es-ES,es;q=0.9,en;q=0.8,ca;q=0.7",
      "cache-control": "max-age=0",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  });

  const html = await response.text();
  const regex = /kmtBoot.setProps\("(.*)"\)/m;
  const regexResult = regex.exec(html);
  const jsonText = regexResult[1].replace(/\\"/gm, '"').replace(/\\"/gm, '"');
  const json = JSON.parse(jsonText);
  return json.page._embedded.tour._embedded.coordinates.items;
};

const buildGPX = (
  id,
  name,
  positions
) => `<?xml version="1.0" encoding="UTF-8"?>
<gpx creator="Komoot Extension" version="1.1"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/11.xsd"
  xmlns:ns3="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ns2="http://www.garmin.com/xmlschemas/GpxExtensions/v3">
  <trk>
    <name>${id} - ${name}</name>
    <type>cycling</type>
    <trkseg>
    ${positions
      .map(
        (position) => `<trkpt lat="${position[`lat`]}" lon="${position[`lng`]}">
        <ele>${position[`alt`]}</ele>
      </trkpt>`
      )
      .join("")}
    </trkseg>
  </trk>
</gpx>`;

const configureAsBubble = (container) => {
  container.style.background = "white";
  container.style.border = "1px solid #00c300";
  container.style.borderRadius = "8px";
  container.style.padding = "5px 10px 5px 10px";
};

const createButton = (
  document,
  onDownload,
  configureAsBubble,
  downloadGPXToken
) => {
  const button = document.createElement("button");
  button.setAttribute("name", "ke-download-button");
  configureAsBubble(button);
  button.onclick = onDownload;

  const buttonContent = document.createElement("div");
  buttonContent.style.display = "flex";

  const spinner = document.createElement("div");
  spinner.innerHTML = `<svg viewBox="0 0 32 32" width="24" height="24" stroke-width="4" fill="none" stroke="currentcolor" role="img" class="css-yay0ma">
  <title>loading</title>
  <circle cx="16" cy="16" r="12" opacity="0.125"></circle>
  <circle cx="16" cy="16" r="12" stroke-dasharray="75.39822368615503" stroke-dashoffset="56.548667764616276" class="css-wpcq6n"></circle>
  </svg>`;
  spinner.style.display = "none";
  spinner.setAttribute("name", "ke-spinner");
  buttonContent.append(spinner);

  const image = document.createElement("div");
  image.innerHTML = `<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzY3IiBoZWlnaHQ9IjM2NyIgdmlld0JveD0iMCAwIDM2NyAzNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjE4My41IiBjeT0iMTgzLjUiIHI9IjE4My41IiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMl80KSIvPgo8cGF0aCBkPSJNODMgMTAyLjJDODMgOTEuMDkgOTIuMDkgODIgMTAzLjIgODJIMjY0LjhDMjcwLjE1NyA4MiAyNzUuMjk1IDg0LjEyODIgMjc5LjA4NCA4Ny45MTY0QzI4Mi44NzIgOTEuNzA0NyAyODUgOTYuODQyNiAyODUgMTAyLjJWMjYzLjhDMjg1IDI2OS4xNTcgMjgyLjg3MiAyNzQuMjk1IDI3OS4wODQgMjc4LjA4NEMyNzUuMjk1IDI4MS44NzIgMjcwLjE1NyAyODQgMjY0LjggMjg0SDEwMy4yQzk3Ljg0MjYgMjg0IDkyLjcwNDcgMjgxLjg3MiA4OC45MTY0IDI3OC4wODRDODUuMTI4MiAyNzQuMjk1IDgzIDI2OS4xNTcgODMgMjYzLjhWMTAyLjJaTTIyNC40IDIyMy40SDI2NC44VjEwMi4ySDEwMy4yVjIyMy40SDE0My42QzE0My42IDIzNC41MSAxNTIuNjkgMjQzLjYgMTYzLjggMjQzLjZIMjA0LjJDMjA5LjU1NyAyNDMuNiAyMTQuNjk1IDI0MS40NzIgMjE4LjQ4NCAyMzcuNjg0QzIyMi4yNzIgMjMzLjg5NSAyMjQuNCAyMjguNzU3IDIyNC40IDIyMy40Wk0xNzMuOSAxNjIuOFYxMzIuNUgxOTQuMVYxNjIuOEgyMjQuNEwxODQgMjAzLjJMMTQzLjYgMTYyLjhIMTczLjlaIiBmaWxsPSJ3aGl0ZSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzJfNCIgeDE9IjE4My41IiB5MT0iMCIgeDI9IjE4My41IiB5Mj0iMzY3IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM4RkNFM0MiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNjRBMzIyIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg=="/>`;
  image.style.width = "20px";
  image.setAttribute("name", "ke-logo");
  buttonContent.append(image);

  const text = document.createElement("span");
  text.style.marginLeft = "8px";
  text.innerText = downloadGPXToken;
  buttonContent.append(text);

  button.append(buttonContent);

  return button;
};

const onDownload = async () => {
  const id = getId();
  const name = getName();

  document.getElementsByName("ke-download-button").forEach((element) => {
    element.disabled = true;
  });
  document.getElementsByName("ke-logo").forEach((element) => {
    element.style.display = "none";
  });
  document.getElementsByName("ke-spinner").forEach((element) => {
    element.style.display = "";
  });
  const positions = await getPositionsFromMainPage(id);
  const gpx = buildGPX(id, name, positions);

  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/gpx+xml;charset=utf-8," + encodeURIComponent(gpx)
  );
  element.setAttribute("download", id + ".gpx");

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
  document.getElementsByName("ke-download-button").forEach((element) => {
    element.disabled = false;
  });
  document.getElementsByName("ke-logo").forEach((element) => {
    element.style.display = "";
  });
  document.getElementsByName("ke-spinner").forEach((element) => {
    element.style.display = "none";
  });

};

const run = () => {
  var observer = new MutationObserver(function (mutations) {
    const shouldAddButton = containsGPX();
    const downloadButtons = document.getElementsByName("ke-download-button");
    const isButtonAlreadyAdded = downloadButtons.length > 0;

    if (shouldAddButton && isButtonAlreadyAdded) return;
    if (!shouldAddButton && isButtonAlreadyAdded) {
      // Remove button
      downloadButtons.forEach((button) => button.remove());
    } else if (shouldAddButton && !isButtonAlreadyAdded) {
      // Add button
      const body = document.querySelector("body");
      const target = body;

      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.top = "60px";
      container.style.right = "20px";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.alignItems = "end";

      const button = createButton(document, onDownload, configureAsBubble, downloadGPXToken);

      container.appendChild(button);
      target.appendChild(container);
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true, // needed if the node you're targeting is not the direct parent
  });
};

run();

})();