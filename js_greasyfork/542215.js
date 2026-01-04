// ==UserScript==
// @name         Bluesky Link-Highlighter & Filter
// @version      1.2
// @description  Highlight Posts with external Links or hide Posts without Links
// @license MIT
// @author       Schubsi
// @match        https://bsky.app/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/1493523
// @downloadURL https://update.greasyfork.org/scripts/542215/Bluesky%20Link-Highlighter%20%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/542215/Bluesky%20Link-Highlighter%20%20Filter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Default-Werte
  let highlightEnabled = GM_getValue("highlightEnabled", true);
  let hideWithoutLinks = GM_getValue("hideWithoutLinks", false);
  const toggleHighlight = () => {
    highlightEnabled = !highlightEnabled;
    GM_setValue("highlightEnabled", highlightEnabled);
    processPosts();
  };
  const toggleHide = () => {
    hideWithoutLinks = !hideWithoutLinks;
    GM_setValue("hideWithoutLinks", hideWithoutLinks);
    processPosts();
  };
  // Menüeinträge in Tampermonkey
  GM_registerMenuCommand(
    `Highlighting: ${highlightEnabled ? "On" : "Off"}`,
    toggleHighlight
  );
  GM_registerMenuCommand(
    `Hide Posts without Links: ${hideWithoutLinks ? "On" : "Off"}`,
    toggleHide
  );

  const styleLinkPost = (post) => {
    if (highlightEnabled) {
      post.style.outline = "5px solid #4ca2fe";
    } else {
      post.style.outline = "";
    }
  };

  const styleNonLinkPost = (post) => {
    // Statt display:none verwenden wir "visibility: hidden; height: 0" trick,
    // um die Post-Elemente weiterhin im Layout zu behalten (für Scroll-Trigger)
    if (hideWithoutLinks) {
      post.style.visibility = "hidden";
      post.style.height = "0px";
      post.style.margin = "0";
      post.style.padding = "0";
      post.style.overflow = "hidden";
    } else {
      post.style.visibility = "";
      post.style.height = "";
      post.style.margin = "";
      post.style.padding = "";
      post.style.overflow = "";
    }
  };

  const autoCheckLink = (post) => {
    const linkEl = post.querySelector("a[target='_blank']");
    if (linkEl) {
      styleLinkPost(post);
      return;
    }
    const content = post.querySelector("div[data-testid='postText']");
    if (!content) {
      styleNonLinkPost(post);
      return;
    }
    if (
      /(?:^|\s)(?!bsky\.app)(?:https?:\/\/)?[a-zA-Z0-9][a-zA-Z0-9\-_.]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:[/?#][^\s]*)*/.test(
        content.textContent
      )
    ) {
      styleLinkPost(post);
      return;
    }
    // Links als Text in Embeded Posts
    const embedPost = post.querySelector("div[aria-label^='Post by ']");
    if (!embedPost || !embedPost.children || embedPost.children.length < 2) {
      styleNonLinkPost(post);
      return;
    }
    if (
      /(?:^|\s)(?!bsky\.app)(?:https?:\/\/)?[a-zA-Z0-9][a-zA-Z0-9\-_.]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:[/?#][^\s]*)*/.test(
        embedPost.children[1].textContent
      )
    ) {
      styleLinkPost(post);
      return;
    }

    styleNonLinkPost(post);
  };

  const processPosts = () => {
    // Seiten-Filter
    const url = window.location.href;
    const isHome = url === "https://bsky.app/";
    const isSearch = url.startsWith("https://bsky.app/search?q="); // hier kann ich die Posts nicht wie unten selecten
    const isProfile = url.match(/https:\/\/bsky.app\/profile\/[^\/]+$/);
    if (!(isHome || isSearch || isProfile)) {
      return;
    }

    document
      .querySelectorAll("div[data-testid^='feedItem-by-']")
      .forEach((post) => {
        autoCheckLink(post);
      });
  };

  const observer = new MutationObserver(() => {
    processPosts();
  });

  window.addEventListener("load", () => {
    processPosts();
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();