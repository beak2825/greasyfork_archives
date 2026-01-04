// ==UserScript==
// @name         Bunkrr DL Button
// @version      1
// @description  Add a download button below each thumbnails
// @match        https://bunkrr.su/a/*
// @namespace    bunkrr
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477623/Bunkrr%20DL%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/477623/Bunkrr%20DL%20Button.meta.js
// ==/UserScript==

(async () => {
  "use strict";
  const mediaLinks = Array.from(
    document.querySelectorAll(".grid-images_box-link")
  );

  const links = mediaLinks.map((mediaLink) => {
    const relativeLink = mediaLink.getAttribute("href");

    return window.location.origin + relativeLink;
  });

  const ddlLinks = await Promise.all(
    links.map(async (link) => {
      const response = await fetch(link);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const ddlLink = doc.querySelector("a[href$='.mp4']").getAttribute("href");

      return ddlLink;
    })
  );

  const grid = document.querySelector(".grid-images");
  const medias = document.querySelectorAll(".grid-images > *");

  medias.forEach((media, i) => {
    const newBox = document.createElement("div");
    newBox.style.display = "flex";
    newBox.style.flexDirection = "column";

    const dlBox = document.createElement("button");
    dlBox.textContent = "Download";
    dlBox.style.border = "solid #ffd369 2px";
    dlBox.style.borderRadius = "0px 0px 20px 20px";

    dlBox.addEventListener("click", (e) => {
      e.stopPropagation();

      window.open(ddlLinks[i]);
    });

    media.style.borderBottom = "none";
    media.style.borderBottomLeftRadius = "0px";
    media.style.borderBottomRightRadius = "0px";
    newBox.appendChild(media);
    newBox.appendChild(dlBox);
    grid.appendChild(newBox);
  });
})();