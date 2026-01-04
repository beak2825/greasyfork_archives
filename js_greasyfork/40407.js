// ==UserScript==
// @name         Amazon Prime Video Expiry Viewer
// @namespace    https://github.com/Kadauchi
// @version      1.0.4
// @description  Makes it obvious which and when videos are going to expire.
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://www.amazon.com/gp/video*
// @include      https://www.amazon.com/Prime-Video/*
// @downloadURL https://update.greasyfork.org/scripts/40407/Amazon%20Prime%20Video%20Expiry%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/40407/Amazon%20Prime%20Video%20Expiry%20Viewer.meta.js
// ==/UserScript==

const checked = {}

function checkShelf () {
  for (const el of document.getElementsByClassName('dv-shelf-item')) checkIfLeaving(el);
  for (const el of document.getElementsByClassName('dv-packshot')) checkIfLeaving(el);
  for (const el of document.getElementsByClassName('UaW15H')) checkIfLeaving(el);
  for (const el of document.getElementsByClassName('UI789i')) checkIfLeaving(el);
}

async function checkIfLeaving (item) {
  const asin = item.querySelector('[data-asin]').dataset.asin;
  const leaving = await fetchHover(asin);

if (leaving.isLeaving) {
    const date = document.createElement('div');
    date.textContent = 'Leaving ' + leaving.isLeaving;
    date.style = 'text-align: center; color: black;';
    date.style.backgroundColor = 'yellow';
    item.appendChild(date);
  }

  if (leaving.isImdb) {
    const date = document.createElement('div');
    date.textContent = 'Available on your IMDb TV channel';
    date.style = 'text-align: center; color: black;';
    date.style.backgroundColor = 'gold';
    item.appendChild(date);
  }
}

function fetchHover (asin) {
  return new Promise(async (resolve) => {
    if (asin && !checked[asin]) {
      const response = await window.fetch(`https://www.amazon.com/gp/video/hover/${asin}?format=json`);
      const text = await response.text();
      // console.log(text);
      const imdb = text.match(/ncluded with your IMDb TV channel/);
      const leaving = text.match(/Leaving Prime on ([\w\s,]+)/);
      const isImdb = !!imdb;
      const isLeaving = leaving ? leaving[1] : false;
      checked[asin] = { isImdb, isLeaving };
      resolve(checked[asin]);
    } else if (checked[asin]) {
      resolve(checked[asin]);
    }
  })
}

checkShelf();
