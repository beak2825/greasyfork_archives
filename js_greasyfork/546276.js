// ==UserScript==
// @name        Genius - DisplaySongLinks
// @namespace   https://ioj4.net
// @match       https://genius.com/*-lyrics
// @grant       none
// @version     2
// @author      ioj4
// @license MIT
// @description Displays all streaming links (SoundCloud, YouTube, Apple Music) of a song on their Genius page
// @downloadURL https://update.greasyfork.org/scripts/546276/Genius%20-%20DisplaySongLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/546276/Genius%20-%20DisplaySongLinks.meta.js
// ==/UserScript==


class ReactiveContainer extends HTMLElement {
  disconnectedCallback() {
    setTimeout(injectLinks, 100);
  }
}

function generateLinksContainer(links, textColor, isDesktop) {
  const container = document.createElement("reactive-container");
  container.className = "displaysonglinks";
  container.style = `margin-top: ${isDesktop ? "0.5rem" : "0.75rem"}`;

  if (isDesktop) {
    const header = document.createElement("span");
    header.innerText = "Links";
    header.style = `color: rgba(${textColor}, 0.6);`
    container.appendChild(header);
  }

  const content = document.createElement("div");
  if (links.length > 0) {
    for (const link of links) {
      const linkElement = document.createElement("a");
      linkElement.href = link.url;
      linkElement.innerText = link.provider;
      linkElement.rel = "noreferrer";
      linkElement.style = `color: rgb(${textColor});${!isDesktop ? "font-size: 0.75rem;" : ""}`;
      content.appendChild(linkElement);
    }
  } else {
    const p = document.createElement("p");
    p.style = `font-weight: 100; color: rgb(${textColor});`;
    p.innerText = "Not available";
    content.appendChild(p);
  }


  container.appendChild(content);
  return container;
}


function injectStyle() {
  const style = document.createElement("style");
  style.innerHTML = `
    .displaysonglinks span {
      font-family: "Programme", Arial, sans-serif;
      font-size: 0.75rem;
      font-style: normal;
      font-weight: 300;
    }

    .displaysonglinks a {
      font-weight: 100;
      text-decoration: underline;
    }

    .displaysonglinks a:hover {
      text-decoration: none;
    }

    .displaysonglinks > div {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
    }

    div.displaysonglinks {
      display: flex;
      flex-direction: column;
    }
  `;
  document.documentElement.appendChild(style);
}

let links = [];
let textColor = "255, 255, 255";

function getLinksAndTextColor() {
  const song = Object.values(__PRELOADED_STATE__.entities.songs).find(s => s.url === location.href);
  if (!song) throw new Error(`Song object not found! Current location: ${location.href}`, __PRELOADED_STATE__.entities.songs);
  if (song.songArtTextColor && song.songArtTextColor.startsWith("#000")) textColor = "0, 0, 0";
  if (song.soundcloudUrl) links.push({
    provider: "SoundCloud",
    url: song.soundcloudUrl
  });
  if (song.youtubeUrl) links.push({
    provider: "YouTube",
    url: song.youtubeUrl
  });
  if (song.appleMusicId) links.push({
    provider: "Apple Music",
    url: `https://music.apple.com/song/${song.appleMusicId}`
  });
}

function injectLinks() {
  const desktopDetails = document.querySelector("[class*=SongHeader-desktop__SongDetails]");
  if (desktopDetails) {
    return desktopDetails.appendChild(generateLinksContainer(links, textColor, true));
  }

  const mobileDetails = document.querySelector("[class*=SongHeader-mobile__Right]");
  if (mobileDetails) {
    return mobileDetails.appendChild(generateLinksContainer(links, textColor, false));
  }

  setTimeout(injectLinks, 500);
  throw new Error("SongDetails element not found!");
}


try {
  customElements.define("reactive-container", ReactiveContainer);
  injectStyle();
  getLinksAndTextColor();
  injectLinks();
} catch (e) {
  console.error("[DisplaySongLinks]", e);
}