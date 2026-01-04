// ==UserScript==
// @name         Hacker News Enhanced
// @namespace    https://github.com/schalkburger/website-enhancements
// @include      https://news.ycombinator.com/*
// @match        https://news.ycombinator.com/*
// @version      1.0.1
// @author       Schalk Burger <schalkb@gmail.com>
// @description  Hacker News Enhanced adds a [l+c] link that opens the link and comments page in new tabs for you in one click.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510452/Hacker%20News%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/510452/Hacker%20News%20Enhanced.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // Init script
  let version = GM_info.script.version;
  console.log(`Hacker News Readable Dark ${version}`);
  // titleLinks
  const aThings = document.querySelectorAll(".athing");
  for (let i = 0; i < aThings.length; i++) {
    const aThing = aThings[i];
    aThing.classList.add("news-link");
    // Open new link and add class
    const titleLineLinks = document.querySelectorAll(".titleline > a");
    for (let i = 0; i < titleLineLinks.length; i++) {
      const titleLineLink = titleLineLinks[i];
      titleLineLink.setAttribute("target", "_blank");
    }
    const subLineLinks = document.querySelectorAll(".subtext a");
    for (let i = 0; i < subLineLinks.length; i++) {
      const subLineLink = subLineLinks[i];
      subLineLink.setAttribute("target", "_blank");
    }
    // Get link
    // Get comments ID
    const aThingID = aThing.id;
    const linkCommentSpan = document.createElement("td");
    linkCommentSpan.setAttribute("id", aThingID);
    linkCommentSpan.className = "link-comment-td";
    linkCommentSpan.innerHTML = `<a href="${aThingID}" comments-id="${aThingID}" target="_blank" title="Open link + comments" class="link-comment">[l+c]</a>`;
    aThing.append(linkCommentSpan);
    // linkCommentSpanAnchors
    const linkCommentSpanAnchors = document.querySelectorAll(".link-comment");
    for (let i = 0; i < linkCommentSpanAnchors.length; i++) {
      const linkCommentSpanAnchor = linkCommentSpanAnchors[i];
      linkCommentSpanAnchor.setAttribute("style", "padding: 10px;");
    }
  }
  // Get story link
  const titleLineHrefs = document.querySelectorAll(".titleline > a");
  var hrefsArray = []; // create an Array to save hrefs
  var j = 0;
  for (; j < titleLineHrefs.length; j++) {
    hrefsArray.push(titleLineHrefs[j].href); // push hrefs in array
  }
  const newsLinks = document.querySelectorAll(".link-comment-td a");
  for (let i = 0; i < newsLinks.length; i++) {
    const newsLink = newsLinks[i];
    newsLink.setAttribute("href", hrefsArray[i]);
  }
  // Open comments + link
  const singleClickLinks = document.querySelectorAll(".link-comment-td a");
  for (let i = 0; i < singleClickLinks.length; i++) {
    const singleClickLink = singleClickLinks[i];
    const singleClickLinkCommentsID = singleClickLink.getAttribute("comments-id");
    const singleClickLinkCommentsIDLink = `https://news.ycombinator.com/item?id=${singleClickLinkCommentsID}`;
    const singleClickLinkNewsLink = singleClickLink.getAttribute("href");
    singleClickLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.open(singleClickLinkCommentsIDLink);
      window.open(singleClickLinkNewsLink);
    });
  }
  // Remove [l+c] links from comments page
  // comment-tree
  const commentTreeLinks = document.querySelectorAll(".comment-tree .link-comment, .fatitem .link-comment");
  for (let i = 0; i < commentTreeLinks.length; i++) {
    const commentTreeLink = commentTreeLinks[i];
    commentTreeLink.remove();
  }
})();
