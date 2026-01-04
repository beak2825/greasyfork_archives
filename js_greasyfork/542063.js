// ==UserScript==
// @name         RED: Freeze Animated Covers
// @version      0.1
// @description  Pauses animated cover art on artist and group pages
// @author       HookTL
// @match        https://redacted.sh/*
// @run-at       document-end
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/1492972
// @downloadURL https://update.greasyfork.org/scripts/542063/RED%3A%20Freeze%20Animated%20Covers.user.js
// @updateURL https://update.greasyfork.org/scripts/542063/RED%3A%20Freeze%20Animated%20Covers.meta.js
// ==/UserScript==

// Based on the following script by mrpoot:
// https://greasyfork.org/en/scripts/374798-red-freeze-animated-avatars/code

(() => {
  GM_addStyle ( `
      .group_image:hover canvas {
	    border-radius: 0 !important;
        position: absolute !important;
        transform: scale(3.2) !important;
        left: 2px !important;
        right: 2px !important;
        transition: transform 0.2s ease, -webkit-transform 0.2s ease !important;
        transition-delay: 0.2s !important;
      }

      .group_image canvas {
        width: 90px;
        height: 90px;
      }

      .group_image:has(canvas) {
        background-color: transparent !important;
        box-shadow: none;
      }

      .warning_icon_container {
        float: right !important;
        align-items: center !important;
      }

      .warning_icon {
        width: 10px !important;
        height: 10px !important;
        border-radius: 50% !important;
        background-color: #f58080 !important;
        margin-top: 5px !important;
        margin-left: 5px !important;
      }
    `);

  const covers = document.querySelectorAll('div#covers img, div.group_image img');

  const process = (img) => {
    const { complete, parentNode, width, height, src } = img;

    const imageURL = src.includes('redacted.sh/image.php?')
      ? decodeURIComponent(src.match(/[?&]i=([^&]+)/)[0].replace(/\+/g, ' '))
      : src;

    if (!/\.gif(?:\?.+)?(?:#.+)?$/.test(imageURL)) {
      return;
    }

    if (!complete) {
      img.addEventListener('load', () => process(img));
      return;
    }

    // Scale canvas up for images displayed at a small size
    // Prevents image from displaying low-res on hover
    var scaleFactor = 1;
    if (parentNode.classList.contains("group_image")) { scaleFactor = 5; }

    // Draw frozen image and delete old image
    const canvas = document.createElement('canvas');
    canvas.width = width*scaleFactor;
    canvas.height = height*scaleFactor;
    canvas.alt = "Cover";
    canvas.title = "This image will be animated if clicked on.";
    parentNode.insertBefore(canvas, img);

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width*scaleFactor, height*scaleFactor);
    parentNode.removeChild(img);

    // Add warning icon next to image
    const container = document.createElement("div");
    container.className = "warning_icon_container";
    container.title = "This image will be animated if clicked on.";
    parentNode.appendChild(container);
    const icon = document.createElement("div");
    icon.className = "warning_icon";
    icon.title = "This image will be animated if clicked on.";
    container.appendChild(icon);

    // Add lightbox(click image to view full size)
    canvas.addEventListener('click', function(ev) {
      lightbox.init(img.src, width);
    });
  };

  [...covers].forEach(process);
})();