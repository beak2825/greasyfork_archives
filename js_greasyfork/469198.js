// ==UserScript==
// @name        Filter Videos
// @namespace   Violentmonkey Scripts
// @match       https://*.coomer.party/*/user/*
// @match       https://*.kemono.party/*/user/*
// @match       https://*.coomer.su/*/user/*
// @match       https://*.kemono.su/*/user/*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     2.03
// @author      -
// @description 6/21/2023, 11:18:54 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/469198/Filter%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/469198/Filter%20Videos.meta.js
// ==/UserScript==

async function querySelectorAsync(element, selector) {
  return await new Promise(resolve => {
    let elm = element.querySelector(selector);
    if(elm) return resolve(elm);

    const observer = new MutationObserver(_ => {
      elm = element.querySelector(selector);
      if(elm) {
        resolve(elm);
        observer.disconnect();
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}

async function hasVideo(postUrl) {
  // Check if the result has been cached, return cache if yes
  let cache = await GM_getValue(postUrl);
  if(cache !== undefined) return cache;

  return new Promise(resolve => {
    let request = new XMLHttpRequest();
    request.open("GET", postUrl, true);
    request.send(null);

    request.onreadystatechange = function() {
      if(request.readyState === 4) {
        let elm = document.createElement("html");
        elm.innerHTML = request.responseText;

        // If we can find a video tag, then post has video
        let res = elm.querySelector("video") !== null;
        resolve(res);

        // Cache value of this post
        GM_setValue(postUrl, res);
      }
    }
  })
}

async function filterVideos() {
  // For every post, check the html and if there is no video, then remove post
  let posts = [...(await querySelectorAsync(document, ".card-list__items")).children];
  for(let post of posts) {
    let postUrl = (await querySelectorAsync(post, "a")).href;
    hasVideo(postUrl).then(res => {
      if(!res) post.remove();
    })
  }
}

(async() => {
  let filterBtn = document.createElement("button");
  filterBtn.textContent = "Filter Videos";
  filterBtn.onclick = function(e) {
    // Prevent redirection
    e.preventDefault();
    // Remove the button to prevent spam
    filterBtn.remove();
    // Filter videos
    filterVideos();
  }

  let searchInputForm = await querySelectorAsync(document, "form");
  searchInputForm.appendChild(filterBtn);
})()
