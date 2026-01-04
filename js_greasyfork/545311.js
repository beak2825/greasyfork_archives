// ==UserScript==
// @name         CyberPowerPC WPlace Overlay
// @namespace    http://tampermonkey.net/
// @version      2025-08-09
// @description  Try to take over the world!
// @author       You
// @match        *://*.wplace.live/*
// @icon         https://cpukbot.co.uk/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545311/CyberPowerPC%20WPlace%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/545311/CyberPowerPC%20WPlace%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

function applyBlueprint(tileBlob, blueprintImage) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const tile = new Image();
  const blueprint = new Image();

  tile.src = URL.createObjectURL(tileBlob);
  blueprint.crossOrigin = "Anonymous";
  blueprint.src = blueprintImage;

  const scale = 3; // minimal upscale
  const dotSize = 1; // in scaled pixels

  return new Promise((resolve) => {
    tile.onload = () => {
      canvas.width = tile.width * scale;
      canvas.height = tile.height * scale;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tile, 0, 0, canvas.width, canvas.height);

      blueprint.onload = () => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = blueprint.width;
        tempCanvas.height = blueprint.height;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(blueprint, 0, 0);
        const imageData = tempCtx.getImageData(
          0,
          0,
          blueprint.width,
          blueprint.height
        ).data;

        for (let y = 0; y < blueprint.height; y++) {
          for (let x = 0; x < blueprint.width; x++) {
            const i = (y * blueprint.width + x) * 4;
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3] / 255;

            if (a > 0) {
              ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
              ctx.fillRect(
                x * scale + (scale - dotSize) / 2,
                y * scale + (scale - dotSize) / 2,
                dotSize,
                dotSize
              );
            }
          }
        }

        resolve(canvas.toDataURL("image/png"));
        console.log(canvas.toDataURL("image/png"));
      };
    };
  });
}
    // Your code here...
    console.log("=== CyberPowerPC WPlace Overlay script loaded ===");

    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
        const { url } = args[0];

        // console.log("Fetch called with URL:", url, "and options:", options);

        const res = await originalFetch.apply(this, args);

        if (typeof url === 'string' && url.includes('/tiles/') && url.endsWith('1014/648.png')) {
            const clonedResponse = res.clone(); // Clone response, as it can only be read once

            const blob = await clonedResponse.blob();
            const dataUrl = await applyBlueprint(blob, "https://cpukbot.co.uk/wplace.png");
            const newResponse = new Response(await (await fetch(dataUrl)).blob(), {
                headers: { 'Content-Type': 'image/png' }
            });
            console.log("Response: ", clonedResponse);
            return newResponse;
        }

        return res;
    }
})();