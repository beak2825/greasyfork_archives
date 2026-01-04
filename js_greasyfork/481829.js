// ==UserScript==
// @name        Youtube - Add Thumbnail
// @namespace   Youtube Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     0.0.2
// @author      Matthew Chai
// @description Displays URLs for video thumbnails, embed, and Invidious.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481829/Youtube%20-%20Add%20Thumbnail.user.js
// @updateURL https://update.greasyfork.org/scripts/481829/Youtube%20-%20Add%20Thumbnail.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function promiseElementId(id, dt = 500) {
    const promise = new Promise(function(resolve, reject) {
      const check = setInterval(function() {
        const element = document.getElementById(id);
        if (element !== null) {
          clearInterval(check);
          resolve(element);
        }
      }, dt);
    });
    return promise;
  }

  function findFirstChild(parent, predicate) {
    for (let i = 0; i < parent.children.length; i++) {
      const child = parent.children[i];
      if (predicate(child)) {
        return child;
      }
    }
    return undefined;
  }

  function getPartialUrlTarget() {
    const video_url = new URL(window.location.href);
    //const video_id = video_url.search.substring(3);
    const video_id = video_url.searchParams.get("v");
    const target = "https://img.youtube.com/vi/" + video_id;
    return target;
  }

  function getInvidiousTarget() {
    const video_url = new URL(window.location.href);
    const video_id = video_url.searchParams.get("v");
    const target = "https://inv.nadeko.net/watch?v=" + video_id;
    return target;
  }

  function getEmbedTarget() {
    const video_url = new URL(window.location.href);
    const video_id = video_url.searchParams.get("v");
    const target = "https://youtube.com/embed/" + video_id;
    return target;
  }

  function maxResolutionLink() {
    const max_link = document.createElement("a");
    max_link.innerHTML = "Thumbnail (Max-Res)";
    max_link.style.setProperty("font-size", "14px");
    max_link.style.setProperty("padding-left", "10px");
    max_link.setAttribute("href", getPartialUrlTarget() + "/maxresdefault.jpg");
    return max_link;
  }

  function defaultResolutionLink() {
    const default_link = document.createElement("a");
    default_link.innerHTML = "Thumbnail (Default)";
    default_link.style.setProperty("font-size", "14px");
    default_link.setAttribute("href", getPartialUrlTarget() + "/0.jpg");
    return default_link;
  }

  function invidiousLink() {
    const invidious_link = document.createElement("a");
    invidious_link.innerHTML = "Invidious Mirror";
    invidious_link.style.setProperty("font-size", "14px");
    invidious_link.style.setProperty("padding-left", "10px");
    invidious_link.setAttribute("href", getInvidiousTarget());
    return invidious_link;
  }

  function embedLink() {
    const embed_link = document.createElement("a");
    embed_link.innerHTML = "Embed";
    embed_link.style.setProperty("font-size", "14px");
    embed_link.style.setProperty("padding-left", "10px");
    embed_link.setAttribute("href", getEmbedTarget());
    return embed_link;
  }

  function infoContents() {
    //#info-contents
    return promiseElementId("info-contents")
    .then(function(info_contents) {
      const container = info_contents.querySelector("#container");
      const title = container.querySelector(".title");
      const max_link = maxResolutionLink();
      const default_link = defaultResolutionLink();
      const invidious_link = invidiousLink();
      const embed_link = embedLink();
      // Create span to add space between links.
      const spacer = document.createElement("span");
      spacer.innerHTML = "";
      container.insertBefore(embed_link, title.nextSibling);
      container.insertBefore(spacer.cloneNode(), title.nextSibling);
      container.insertBefore(invidious_link, title.nextSibling);
      container.insertBefore(spacer.cloneNode(), title.nextSibling);
      container.insertBefore(max_link, title.nextSibling);
      container.insertBefore(spacer, title.nextSibling);
      container.insertBefore(default_link, title.nextSibling);
      // Poll to check for URL changes (forward/back, Youtube links, etc.)
      let window_href = window.location.href;
      setInterval(function() {
        if (window.location.href !== window_href) {
          window_href = window.location.href;
          default_link.setAttribute("href", getPartialUrlTarget() + "/0.jpg");
          max_link.setAttribute("href", getPartialUrlTarget() + "/maxresdefault.jpg");
          invidious_link.setAttribute("href", getInvidiousTarget());
          embed_link.setAttribute("href", getEmbedTarget());
        }
      }, 500);
    });
  }

  function aboveTheFold() {
    // #above-the-fold
    return promiseElementId("above-the-fold")
    .then(function(above_the_fold) {
      const title = above_the_fold.querySelector("#title");
      const max_link = maxResolutionLink();
      const default_link = defaultResolutionLink();
      const invidious_link = invidiousLink();
      const embed_link = embedLink();
      // Create span to add space between links.
      const spacer = document.createElement("span");
      spacer.innerHTML = "";
      above_the_fold.insertBefore(embed_link, title.nextSibling);
      above_the_fold.insertBefore(spacer.cloneNode(), title.nextSibling);
      above_the_fold.insertBefore(invidious_link, title.nextSibling);
      above_the_fold.insertBefore(spacer.cloneNode(), title.nextSibling);
      above_the_fold.insertBefore(max_link, title.nextSibling);
      above_the_fold.insertBefore(spacer.cloneNode(), title.nextSibling);
      above_the_fold.insertBefore(default_link, title.nextSibling);
      // Poll to check for URL changes (forward/back, Youtube links, etc.)
      let window_href = window.location.href;
      setInterval(function() {
        if (window.location.href !== window_href) {
          window_href = window.location.href;
          default_link.setAttribute("href", getPartialUrlTarget() + "/0.jpg");
          max_link.setAttribute("href", getPartialUrlTarget() + "/maxresdefault.jpg");
          invidious_link.setAttribute("href", getInvidiousTarget());
          embed_link.setAttribute("href", getEmbedTarget());
        }
      }, 500);
    });
  }

  function main() {
    let window_href = window.location.href;
    Promise.any([infoContents(), aboveTheFold()]);
  }
  main();
})();
