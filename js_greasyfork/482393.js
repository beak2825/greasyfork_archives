// ==UserScript==
// @name         Discord multimedia dimmer
// @namespace    http://tampermonkey.net/
// @version      2023-12-18
// @description  Dim images and videos on Discord.
// @author       Andrew15-5
// @match        https://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/482393/Discord%20multimedia%20dimmer.user.js
// @updateURL https://update.greasyfork.org/scripts/482393/Discord%20multimedia%20dimmer.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const brightness_threshold = 100;

  async function get_image_data(element) {
    // Avoid insecure error on getImageData() by fetching the media again.
    // Firefox caches fetches, so refetching doesn't really refetch from the server.
    const url = element.poster === undefined ? element.src : element.poster;
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const image_data = ctx.getImageData(0, 0, img.width, img.height).data;
        resolve(image_data);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  async function get_average_brightness(element) {
    const data = await get_image_data(element);
    const pixel_count = element.width * element.height;
    let red, green, blue, average;
    let color_sum = 0;

    for (let x = 0, len = data.length; x < len; x += 4) {
      red = data[x];
      green = data[x + 1];
      blue = data[x + 2];
      average = Math.floor((red + green + blue) / 3);
      color_sum += average;
    }

    const brightness = Math.floor(color_sum / pixel_count);
    return brightness;
  }

  function dim_element(element) {
    element.style.filter = "brightness(50%)";
  }

  function dim_if_too_bright(elements) {
    elements.forEach(async (element) => {
      const average_brightness = await get_average_brightness(element);
      if (average_brightness > brightness_threshold) dim_element(element);
    });
  }

  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type !== "childList") return;
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeName === "IMG" || node.nodeName === "VIDEO") {
          dim_if_too_bright([node]);
          return;
        }
        const images = Array.from(node.querySelectorAll("img")).filter(
          (element) =>
            Array.from(element.getAttribute("alt")).length > 2 &&
            element.style.filter === "",
        );
        const videos = Array.from(node.querySelectorAll("video"));
        dim_if_too_bright(images);
        dim_if_too_bright(videos);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
