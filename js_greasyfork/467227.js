// ==UserScript==
// @name           低端豆瓣
// @namespace      https://github.com/mefengl
// @author         mefengl
// @version        0.3.1
// @description    加入可能的低端影视链接
// @icon           https://www.google.com/s2/favicons?sz=64&domain=ddys.art
// @match          https://movie.douban.com/subject/*
// @match          https://ddys.art/*
// @grant          GM_xmlhttpRequest
// @run-at         document-end
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/467227/%E4%BD%8E%E7%AB%AF%E8%B1%86%E7%93%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/467227/%E4%BD%8E%E7%AB%AF%E8%B1%86%E7%93%A3.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const doubanIdRegex = /subject\/(\d+)/;
  const baseURL = "https://ddys.art/?s=";

  if (window.location.href.includes('movie.douban.com')) {
    const id = window.location.href.match(doubanIdRegex)[1];
    const asideDiv = document.querySelector('.aside');

    GM_xmlhttpRequest({
      method: "GET",
      url: baseURL + encodeURIComponent(id),
      onload: (response) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.responseText, "text/html");
        const postTitles = doc.querySelectorAll(".post-title > a");

        postTitles.forEach((postTitle) => {
          postTitle.style.cssText = "display:block; margin-bottom:10px; background-color:#ddd; padding:5px; text-align:center; cursor:pointer; border-radius:5px; color:#3a8fb7";
          postTitle.target = "_blank";

          const sourceLabel = document.createElement('small');
          sourceLabel.textContent = " (from 低端影视)";
          sourceLabel.style.cssText = "color:#666; margin-left:5px";
          postTitle.appendChild(sourceLabel);

          asideDiv.insertBefore(postTitle, asideDiv.firstChild);
        });
      }
    });
  } else if (window.location.href.includes('ddys.art')) {
    const titleLink = document.querySelector(".title > a");
    const doubanUrl = titleLink ? titleLink.href : null;
    const modDiv = document.querySelector('.mod');

    if (doubanUrl && modDiv) {
      GM_xmlhttpRequest({
        method: "GET",
        url: doubanUrl,
        onload: (response) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.responseText, "text/html");
          const recommendations = doc.querySelector("#recommendations");
          const recLinks = recommendations ? recommendations.querySelectorAll("dd > a") : [];

          recLinks.forEach((recLink) => {
            const recId = recLink.href.match(doubanIdRegex)[1];

            GM_xmlhttpRequest({
              method: "GET",
              url: baseURL + encodeURIComponent(recId),
              onload: (response) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const postTitle = doc.querySelector(".post-title > a");

                if (postTitle) {
                  postTitle.style.cssText = "display:block; margin-bottom:10px; background-color:#ddd; padding:5px; text-align:center; cursor:pointer; border-radius:5px; color:#3a8fb7";
                  postTitle.target = "_blank";

                  GM_xmlhttpRequest({
                    method: "GET",
                    url: recLink.href,
                    onload: (response) => {
                      const parser = new DOMParser();
                      const doc = parser.parseFromString(response.responseText, "text/html");
                      const ratingNum = doc.querySelector(".rating_num");
                      const ratingLabel = document.createElement('small');
                      ratingLabel.textContent = " (" + (ratingNum ? ratingNum.innerText : 'N/A') + ")";
                      ratingLabel.style.cssText = "color:#666; margin-left:5px";
                      postTitle.appendChild(ratingLabel);

                      modDiv.appendChild(postTitle);
                    }
                  });
                }
              }
            });
          });
        }
      });
    }
  }
})();
