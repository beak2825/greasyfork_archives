// ==UserScript==
// @name        ScoreSaber BeatSaver Link
// @namespace   forked_bytes
// @match       https://scoresaber.com/*
// @match       https://hitbloq.com/leaderboard/*
// @grant       none
// @version     1.3.1
// @author      forked_bytes
// @license     0BSD
// @description Adds a link to BeatSaver map on ScoreSaber and Hitbloq leaderboard pages
// @downloadURL https://update.greasyfork.org/scripts/481269/ScoreSaber%20BeatSaver%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/481269/ScoreSaber%20BeatSaver%20Link.meta.js
// ==/UserScript==

const beatsaverLink = document.createElement("a");
const beatmaps = {};

setInterval(location.hostname === "hitbloq.com" ? hitbloq : scoresaber, 500);

async function scoresaber() {
  if (beatsaverLink.isConnected || !location.pathname.startsWith("/leaderboard/")) return;
  const target = document.querySelector("img.map-cover");
  const hash = target?.src.match(/[A-Z0-9]{40}/)?.[0];
  if (!hash) return;

  const beatmap = await getBeatmap(hash);
  if (beatmap?.id) {
    const link = createLink(beatmap.id);
    link.style.marginTop = "0.5rem";
    document.querySelector(".hash-row")?.appendChild(link);
  }
}

async function hitbloq() {
  if (beatsaverLink.isConnected || !location.pathname.startsWith("/leaderboard/")) return;
  const prefix = "web+bsmap://";
  const target = document.querySelector(`a[href^="${prefix}"]`);
  const hash = target?.href.substring(prefix.length);
  if (!hash) return;

  const id = target.parentNode.textContent.match(/\b([a-f0-9]{1,8})\b/)?.[1];
  if (id) {
    target.parentNode.replaceChild(createLink(id), target.parentNode.childNodes[3]);
    return;
  }

  const beatmap = await getBeatmap(hash);
  if (beatmap?.id) {
    target.parentNode?.parentNode?.appendChild(createLink(beatmap.id));
  }
}

function getBeatmap(hash) {
  if (!beatmaps[hash]) {
    beatmaps[hash] = fetch("https://api.beatsaver.com/maps/hash/" + hash).then(r => r.json());
  }
  return beatmaps[hash];
}

function createLink(id) {
  const icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAPFBMVEUAAADAAGe6AGm9AGrmAILnAIHbAHv/+/3/4vL/4fH/s97/sd3/kc//j87/esX/TbP/FJz/A5X/AJD9AI/M2IS5AAAAB3RSTlMAJSkrvsHAP6LsMgAAAF9JREFUeNpVz1kOgCAMRVEmiwNCofvfq8TGV+kX5yZA6nQiUXS/8ZtI8ovHkM0v1mJGgVGieZYUHMHcKgshtHPPpc8QkpYr57vPK9+jfLy2b5pZSy1qFFajJIGxftDTA2/CCDAL30DlAAAAAElFTkSuQmCC`;
  beatsaverLink.href = "https://beatsaver.com/maps/" + id;
  beatsaverLink.innerHTML = `<img alt="!bsr" title="Copy to clipboard" src="${icon}"> ${id}`;
  beatsaverLink.firstChild.onclick = function() {
    navigator.clipboard.writeText(`!bsr ${id}`);
    this.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXklEQVR42mPABU5dutV48uLN/+gYJM5ADDh58ebPkxdv/ifbEJhifIaQZwAC/8TpX4QB+DG6f8k3AF1g1ADUgMWDf2IYgCcp401ICAPIAwgDyJVH+Bc//ok365KbeQCN1APg5RVUHwAAAABJRU5ErkJggg==`;
    setTimeout(() => this.src = icon, 300);
    return false;
  };
  beatsaverLink.style.display = "block";
  return beatsaverLink;
}