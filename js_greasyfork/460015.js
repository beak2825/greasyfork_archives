// ==UserScript==
// @name        Image out of carousel and high quality - iwara.tv
// @namespace   Violentmonkey Scripts
// @match       *://*.iwara.tv/images/*
// @match       *://*.iwara.tv/node/*
// @grant       none
// @version     1.0
// @author      hme54
// @license     GNU GPLv3
// @description High quality images vertical scrolling
// @downloadURL https://update.greasyfork.org/scripts/460015/Image%20out%20of%20carousel%20and%20high%20quality%20-%20iwaratv.user.js
// @updateURL https://update.greasyfork.org/scripts/460015/Image%20out%20of%20carousel%20and%20high%20quality%20-%20iwaratv.meta.js
// ==/UserScript==


(function() {

  function init() {
    console.log("Beginning image process")

    let viewport = document.querySelector(".slick-slider");

    if (!viewport) {
      handleSingleImage();
      console.log("Resized Single Image");
      return;
    }

    let targetCarouselItems = document.querySelectorAll(".slick-slide");

    let container = document.querySelector(".field-name-field-images");
    container.style = "display: flex; flex-direction: column; align-items: center; row-gap: 2vh;";

    replaceImages(targetCarouselItems, container);
    console.log("image process complete")
  }

  function handleSingleImage() {
    let container = document.querySelector(".field-item.even");
    let parentAnchor = container.firstElementChild;
    if (!parentAnchor) return;
    // if the parent href link does not contain reference to `photos`, then ignore this one
    // this IS DEPENDENT ON PAGE ARCHITECTURE
    if (!parentAnchor.href.includes("photos")) return;

    let new_image = document.createElement("img");
    new_image.src = parentAnchor.href;

    parentAnchor.innerHTML = ""; // clear the old element
    parentAnchor.appendChild(new_image); // add in our image

    new_image.addEventListener("load", () => {
      let i_w = new_image.naturalWidth;
      let c_w = container.clientWidth;
      console.log(i_w, c_w);
      let s_div = document.createElement("div");
      s_div.style = `height: ${container.clientHeight}px; margin-bottom: 10px;`;
      container.appendChild(s_div);
      let off_l = (i_w > c_w) ? 0 : (c_w / 2) - (i_w / 2);

      parentAnchor.style = `transition: none !important; position: absolute; left: ${off_l}px;`;
    })
  }

  function replaceImages(targetCarouselItems, container) {
    replaceCarouselImages(targetCarouselItems, container);
  }

  // replace all images with higher quality versions, modifying the DOM
  function replaceCarouselImages(carousel_divs, container) {
    let items = [];
    for (carousel_div of carousel_divs) {
      if (carousel_div.classList.contains("slick-cloned")) {
        continue;
      }
      // assume image format is one of the images in the slide carousel
      // therefore its parent is an `a` tag
      let parentAnchor = carousel_div.querySelector("a");
      if (parentAnchor) {
        // if the parent href link does not contain reference to `photos`, then ignore this one
        // this IS DEPENDENT ON PAGE ARCHITECTURE
        if (!parentAnchor.href.includes("photos")) return;

        let new_image = document.createElement("img");
        new_image.src = parentAnchor.href;

        items.push(new_image);
      } else {
        carousel_div.childNodes.forEach(node => items.push(node));
      }
    }

    container.innerHTML = "";
    items.reverse().forEach(it => { container.prepend(it); })
  }


  window.addEventListener("load", init);

})();