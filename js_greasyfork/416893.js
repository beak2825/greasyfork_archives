// ==UserScript==
// @name         Simplify Rakuten.co.jp
// @namespace    https://gist.github.com/liquidx/c5dfe2759de48a1f98a3a1b0a08daa11
// @version      0.2
// @description  Remove promotional (PR) content from item pages on rakuten.co.jp  楽天市場は簡単になる
// @author       @liquidx
// @include      https://item.rakuten.co.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416893/Simplify%20Rakutencojp.user.js
// @updateURL https://update.greasyfork.org/scripts/416893/Simplify%20Rakutencojp.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let displayLightbox = (imgUrl) => {
    let lightbox = document.createElement("div");
    lightbox.style =
      "position: fixed; height: 80vh; width: 100vw; bottom: 0; background-color: rgba(0, 0, 0, 0.2);";
    lightbox.addEventListener("click", (e) => {
      lightbox.parentElement.removeChild(lightbox);
    });

    let lightboxInner = document.createElement("div");
    lightboxInner.style =
      "display: flex; width: 100%; height: 100%; justify-content: center; align-items: center;";

    let img = document.createElement("img");
    img.src = imgUrl;
    img.style = "width: 60vw;";
    img.addEventListener("click", (e) => {
      lightbox.parentElement.removeChild(lightbox);
    });

    lightboxInner.appendChild(img);
    lightbox.appendChild(lightboxInner);
    document.body.appendChild(lightbox);
  };

  let placeholderNode = () => {
    return document.createTextNode("Removed");
  };

  // Remove all iframes.
  document.querySelectorAll("iframe").forEach((f) => {
    f.parentElement.replaceChild(placeholderNode(), f);
  });

  // Remove header
  document.querySelectorAll(".exT_sdtext").forEach((f) => {
    f.parentElement.replaceChild(placeholderNode(), f);
  });

  let mainTable = document.querySelector("#pagebody > table");

  // Find the main listing information and push it to the
  // top of the page.
  let offerCell = document.querySelector("#offers");
  if (offerCell) {
    let offerTable = offerCell;
    while (offerTable.tagName != "TABLE") {
      offerTable = offerTable.parentElement;
    }

    let firstCellInMainTable = mainTable.querySelector("td");
    if (firstCellInMainTable) {
      firstCellInMainTable.insertBefore(
        offerTable,
        firstCellInMainTable.firstChild
      );
    }

    // Shrink left hand bar image cells
    let leftSidebar = offerTable.querySelector(
      ".rakutenLimitedId_ImageMain1-3"
    );
    if (leftSidebar) {
      leftSidebar = leftSidebar.parentElement;
      leftSidebar.style = "display: flex; flex-wrap: wrap; width: 300px;";
    }
    offerTable
      .querySelectorAll(".rakutenLimitedId_ImageMain1-3 img")
      .forEach((e) => {
        e.style = "max-width: 100px;";
      });
  }

  // Compress the sale_desc section into small thumbnails.
  let saleDesc = document.querySelector(".sale_desc");
  if (saleDesc) {
    let thumbnailContainer = document.createElement("div");
    thumbnailContainer.style = "display: flex; width: 600px; flex-wrap: wrap;";
    saleDesc.querySelectorAll("img").forEach((img) => {
      let thumbnail = document.createElement("img");
      thumbnail.classList.add("saleThumbnail");
      thumbnail.style = "width: 200px;";
      thumbnail.src = img.src;
      thumbnail.addEventListener("click", (e) => {
        displayLightbox(img.src);
      });
      thumbnailContainer.appendChild(thumbnail);
    });

    let itemDesc = document.querySelector(".item_desc");
    itemDesc.appendChild(thumbnailContainer, saleDesc.firstChild);

    let mainSaleContent = saleDesc.querySelector("center");
    if (mainSaleContent) {
      saleDesc.removeChild(mainSaleContent);
    }
  }
})();
