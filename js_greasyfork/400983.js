// ==UserScript==
// @name     MobyGames - Click to Aspect-Correct Screenshots
// @namespace ssokolow.com
// @description One-click aspect ratio toggle for 320x200 screenshots
// @version  1
// @match *://www.mobygames.com/game/*
// @downloadURL https://update.greasyfork.org/scripts/400983/MobyGames%20-%20Click%20to%20Aspect-Correct%20Screenshots.user.js
// @updateURL https://update.greasyfork.org/scripts/400983/MobyGames%20-%20Click%20to%20Aspect-Correct%20Screenshots.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

// Browser-accelerated implementation of
// https://www.gamasutra.com/blogs/FelipePepe/20150423/241730/No_MSDOS_games_werent_widescreen_Tips_on_correcting_aspect_ratio.php
function makeScaled(img) {
  let canvas = document.createElement("canvas");

  // Implement toggling back to 1-for-1 square pixel rendering
  canvas.title = 'Click to disable pixel aspect-ratio correction';
  canvas.style.cursor = 'pointer';
  canvas.addEventListener("click", () => {
    canvas.parentNode.replaceChild(img, canvas);
  });

  // Nearest-neighbour upscaling to 640x1200 using the browser's
  // accelerated routines to preserve horizontal pixel clarity
  canvas.width = 640;
  canvas.height = 1200;
  let context = canvas.getContext('2d');
  context.mozImageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.msImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;
  context.drawImage(img, 0, 0, 640, 1200);

  // Bilinear (or equivalent) downscaling using the browser's
  // accelerated routines to best approximate the appearance of
  // non-square pixels without relying on a HiDPI display
  canvas.style.width = "640px";
  canvas.style.height = "480px";
  canvas.style.imageRendering = "auto";
  canvas.style.imageRendering = "high-quality";
  canvas.style.imageRendering = "smooth";
  canvas.style.imageRendering = "optimizeQuality";
  canvas.style.imageRendering = "-webkit-optimize-quality";
  canvas.style.imageRendering = "-moz-optimizeQuality";
  canvas.style.imageRendering = "-o-optimizeQuality";
  canvas.style.imageRendering = "-webkit-optimize-quality";
  canvas.style.msInterpolationMode = "bicubic";

  return canvas;
}

window.addEventListener("load", () => {
  document.querySelectorAll(".screenshot img").forEach((img) => {
    // Skip screenshots that aren't 320x200
    if (img.naturalWidth !== 320 || img.naturalHeight !== 200) { return; }

    // Cache the resulting DOM node containing the first-stage upscale
    let canvas = null;

    // Implement toggling to aspect-corrected pixels
    img.title = 'Click to enable pixel aspect-ratio correction';
    img.style.cursor = 'pointer';
    img.addEventListener("click", () => {
      if (!canvas) { canvas = makeScaled(img); }

      img.parentNode.replaceChild(canvas, img);
    });
  });
});
