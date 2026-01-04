// ==UserScript==

// @name                RapidMoviez Scrollable Popular Movies and TV Shows Section
// @description         Changes the grid style of "Popular Movies and TV Shows" section of RapidMoviez to a scrollable list mimicking the "Latest Episodes" section.
// @version             2.1

// @namespace           io.github.ni554n
// @match               http*://rmz.cr/*

// @supportURL          https://github.com/ni554n/userscripts/issues
// @license             MIT

// @author              Nissan Ahmed
// @homepageURL         https://ni554n.github.io/
// @contributionURL     https://paypal.me/ni554n

// @downloadURL https://update.greasyfork.org/scripts/398906/RapidMoviez%20Scrollable%20Popular%20Movies%20and%20TV%20Shows%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/398906/RapidMoviez%20Scrollable%20Popular%20Movies%20and%20TV%20Shows%20Section.meta.js
// ==/UserScript==

const popularSectionDiv = document.getElementsByClassName("pops clear")[0];

if (!popularSectionDiv) {
  console.warn(`Failed to get a reference of the "Popular Movies and TV Shows" section.`);

  return;
}

const releaseList = popularSectionDiv.getElementsByTagName("ul")[0];

// Mimic the structure of "Latest Episodes" items.
for (const releaseItem of releaseList?.children) {
  // Remove the class in order to reset the current grid style.
  releaseItem.removeAttribute("class");

  const thumbnailLink = releaseItem.firstElementChild;

  // Align the thumbnail image to the left.
  thumbnailLink.firstElementChild.setAttribute("align", "left");

  // Prepare a clickable link of the release title next to the thumbnail.
  const releaseTitleLink = thumbnailLink.cloneNode();

  // The link title attribute can be unavailable in some releases. In that case,
  // transform the link path to the release title.
  releaseTitleLink.textContent = releaseTitleLink.getAttribute("title")
    || releaseTitleLink.getAttribute("href").substring(1)
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(" ");

  const linkSpan = document.createElement("span");
  linkSpan.appendChild(releaseTitleLink);

  releaseItem.appendChild(linkSpan);
}

// To apply the list style, mimic the div structure of the "Latest Episodes" section.
const div = document.createElement("div");
div.className = "epicontainer";
div.setAttribute("style", "margin: 0px 0 0 -5px; height: 380px");
div.appendChild(releaseList);

popularSectionDiv.className = "latest clear";
popularSectionDiv.appendChild(div);
