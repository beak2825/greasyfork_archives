
// ==UserScript==
// @name         OnlyFans to Coomer with Video Filter
// @namespace    http://coomer.su
// @version      1.3
// @description  Redirects from OnlyFans to Coomer and filters posts without videos.
// @author       Dirk Digler
// @match        *://onlyfans.com/*
// @match        https://*.coomer.party/*/user/*
// @match        https://*.kemono.party/*/user/*
// @match        https://*.coomer.su/*/user/*
// @match        https://*.kemono.su/*/user/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509296/OnlyFans%20to%20Coomer%20with%20Video%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/509296/OnlyFans%20to%20Coomer%20with%20Video%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Redirect functionality
    const usernameRegex = /^\/([^\/]+)/;
    const match = window.location.pathname.match(usernameRegex);
    const username = match ? match[1] : null;

    if (username) {
        const coomerUrl = `https://coomer.su/onlyfans/user/${username}`;

        const redirectButton = document.createElement('a');
        redirectButton.href = coomerUrl;
        redirectButton.innerHTML = 'Coomer';
        redirectButton.target = '_blank';
        redirectButton.style = 'position: fixed; top: 10px; left: 10px; padding: 10px; background-color: #0091ea; color: #ffffff; text-decoration: none; border-radius: 5px; z-index: 9999;';
        document.body.appendChild(redirectButton);
    } else {
        console.error('Username not found in URL');
    }

    // 2. Filter videos functionality
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

            let res = elm.querySelector("video") !== null;
            resolve(res);

            GM_setValue(postUrl, res);
          }
        }
      })
    }

    async function filterVideos() {
      let posts = [...(await querySelectorAsync(document, ".card-list__items")).children];
      for(let post of posts) {
        let postUrl = (await querySelectorAsync(post, "a")).href;
        hasVideo(postUrl).then(res => {
          if(!res) post.remove();
        })
      }
    }

    // 3. Add button to trigger filtering
    (async() => {
      let filterBtn = document.createElement("button");
      filterBtn.textContent = "Filter Videos";
      filterBtn.onclick = function(e) {
        e.preventDefault();
        filterBtn.remove();
        filterVideos();
      }

      let searchInputForm = await querySelectorAsync(document, "form");
      searchInputForm.appendChild(filterBtn);
    })();
})();
