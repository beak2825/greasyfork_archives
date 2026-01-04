// ==UserScript==
// @name         Hacker news girlfriends
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       You
// @match        htt*://news.ycombinator.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @description  Don't browse HN alone.
// @downloadURL https://update.greasyfork.org/scripts/477051/Hacker%20news%20girlfriends.user.js
// @updateURL https://update.greasyfork.org/scripts/477051/Hacker%20news%20girlfriends.meta.js
// ==/UserScript==

// Initialize variables
let cachedGfirendsData = [];
let retryCount = 0;

// Function to fetch random list of Gfriend avatars
const fetchRamdomGfirendsAvatar = async () => {
  const url = `https://cdn.jsdelivr.net/gh/utags/random-avatars@main/public/gfriends-1.json`;
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      return await response.json();
    }
  } catch (error) {
    console.error(error);
    retryCount++;
    if (retryCount < 3) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchRamdomGfirendsAvatar();
    }
  }
};

// Initialize cache
const initRamdomGfirendsAvatar = async () => {
  const data = await fetchRamdomGfirendsAvatar();
  if (data) {
    cachedGfirendsData = data;
  }
};

// Generate a seed based on username
const generateSeed = (username) => {
  let seed = 0;
  for (const char of username) {
    seed += char.charCodeAt(0);
  }
  return seed % cachedGfirendsData.length;
};

// Main function
(async () => {
  'use strict';
  await initRamdomGfirendsAvatar();

  for (const u of document.querySelectorAll('.hnuser, #me')) {
    const seed = generateSeed(u.innerText);

    // Choose avatar based on seed
    const avatar = cachedGfirendsData[seed];
    const encodedAvatar = encodeURIComponent(avatar).replaceAll("%2F", "/");
    const imgSrc = `https://wsrv.nl/?url=cdn.jsdelivr.net/gh/gfriends/gfriends@master/Content/${encodedAvatar}&w=64&h=64&dpr=2&fit=cover&a=focal&fpy=0.35&output=webp`;

    // Replace canvas with fetched avatar
    const img = document.createElement('img');
    img.src = imgSrc;
    img.width = 64;  // Set width to 32 pixels
    img.height = 64; // Set height to 32 pixels
    u.parentElement.prepend(img);
  }
})();
