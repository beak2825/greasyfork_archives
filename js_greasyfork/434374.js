// ==UserScript==
// @name         find-me-at-thbwiki
// @namespace    Gizeta.Debris.FindMeAtTHBWiki
// @version      0.1.1
// @description  Find selection text on THBWiki
// @author       Gizeta
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434374/find-me-at-thbwiki.user.js
// @updateURL https://update.greasyfork.org/scripts/434374/find-me-at-thbwiki.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const API = 'https://thwiki.cc/api.php?action=query&format=json&uselang=zh&list=search&srlimit=5&srsearch=';

function getTooltipTarget(create = false) {
  const target = document.getElementById('find-me-at-thbwiki-tooltip');
  if (!create || target)
    return target;
  const tooltip = document.createElement('div');
  tooltip.id = 'find-me-at-thbwiki-tooltip';
  tooltip.style.position = 'absolute';
  tooltip.style.backgroundColor = '#ddd';
  tooltip.style.maxWidth = '50%';
  tooltip.style.padding = '5px';
  document.body.appendChild(tooltip);
  return tooltip;
}

function getPosition() {
  const rect = document.getSelection().getRangeAt(0).getBoundingClientRect();
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const top = Math.floor(scrollTop + rect.top + rect.height);
  const left = Math.floor(rect.left);
  return [top, left];
}

function showTooltip(result) {
  const tooltip = getTooltipTarget(true);
  const [top, left] = getPosition();
  tooltip.style.display = 'block';
  tooltip.style.fontSize = '14px';
  tooltip.style.color = 'black';
  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
  tooltip.innerHTML = result.map(([title, content]) => `<h3><a href="https://thwiki.cc/${title}" target="_blank" rel="noopener noreferrer">${title}</a></h3><div>${content}</div>`);
}

function hideToolip() {
  if (getTooltipTarget())
    getTooltipTarget().style.display = 'none';
}

document.body.addEventListener("mouseup", () => {
  const selection = document.getSelection();
  if (!selection || selection.type === "Caret") {
    hideToolip();
    return;
  }
  fetch(API + selection.toString().trim()).then(resp => resp.json()).then(data => {
    if (data.query && data.query.search && data.query.search.length > 0)
      showTooltip(data.query.search.map(x => [x.title, x.snippet]));
    else
      showTooltip('', 'not found');
  });
});
