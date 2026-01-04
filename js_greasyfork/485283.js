// ==UserScript==
// @name         VSCO Gallery DL
// @version      1
// @description  Bulk DL or Single DL on img click
// @license MIT
// @match        https://vsco.co/*/gallery
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vsco.co
// @grant        GM_download
// @namespace https://greasyfork.org/users/1205165
// @downloadURL https://update.greasyfork.org/scripts/485283/VSCO%20Gallery%20DL.user.js
// @updateURL https://update.greasyfork.org/scripts/485283/VSCO%20Gallery%20DL.meta.js
// ==/UserScript==

const observer = new MutationObserver(() => {
  addClickEventOnImgs();
});

(function () {
  "use strict";

  addClickEventOnImgs();

  const userBox = document.querySelector(".css-8o02ty");
  const followBtn = document.querySelector(".css-sa5rcr");

  const gridImgs = document.querySelector(".css-1ub14e5");

  observer.observe(gridImgs, {
    subtree: true,
    childList: true,
  });

  const box = document.createElement("div");
  box.style.display = "flex";
  box.style.justifyContent = "space-around";
  box.style.gap = "1rem";

  const dlBtn = document.createElement("div");
  dlBtn.setAttribute("class", "css-sa5rcr e2k8kpg0");

  const dlBtnLink = document.createElement("a");
  dlBtnLink.textContent = "Download All";
  dlBtnLink.setAttribute("class", "css-10rsioe eq8m7vf1");
  dlBtnLink.setAttribute("href", "#");

  dlBtnLink.addEventListener("click", (e) => {
    e.preventDefault();

    const images = document.querySelectorAll(".MediaThumbnail a div div img");

    Array.from(images).forEach((el, i) => {
      const url = el.src.split("?")[0];

      e.preventDefault();

      GM_download({
        url,
        name: `image${i}.jpg`,
        saveAs: false,
        onerror: (e) => console.error(e),
      });
    });
  });

  dlBtn.appendChild(dlBtnLink);
  box.appendChild(dlBtn);
  box.appendChild(followBtn);

  userBox.appendChild(box);
})();

function addClickEventOnImgs() {
  const images = document.querySelectorAll(".MediaThumbnail a div div img");

  Array.from(images).forEach((el, i) => {
    const url = el.src.split("?")[0];

    el.onclick = (e) => downloadOnClickEvent(e, url, i);
  });
}

function downloadOnClickEvent(e, url, i) {
  e.preventDefault();

  GM_download({
    url,
    name: `image${i}.jpg`,
    saveAs: false,
    onerror: (e) => console.error(e),
  });
}
