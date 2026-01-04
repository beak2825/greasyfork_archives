// ==UserScript==
// @name        High-res cover images on genius.com
// @description Changes all cover images on genius.com lyrics pages to their highest possible resolution
// @namespace   https://github.com/Sv443
// @version     1.0.3
// @author      Sv443
// @copyright   Sv443 (https://github.com/Sv443)
// @license     MIT
// @match       *://genius.com/*
// @homepageURL https://github.com/Sv443/High-res-cover-images-on-genius.com#readme
// @supportURL  https://github.com/Sv443/High-res-cover-images-on-genius.com/issues
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/528145/High-res%20cover%20images%20on%20geniuscom.user.js
// @updateURL https://update.greasyfork.org/scripts/528145/High-res%20cover%20images%20on%20geniuscom.meta.js
// ==/UserScript==

/** Regex to match the asset URL and extract the current width & height and the max width & height */
const imgSrcRegex = /https?:\/\/[a-zA-Z0-9]+\.genius\.com\/unsafe\/\d+x\d+\/.+\.(\d+)x(\d+)x\d+\.[a-z0-9]{3,}/;
/** Max amount of seconds to check for image elements before giving up */
const timeoutSec = 5;
/** Interval in milliseconds between checking for image elements */
const checkInterval = 100;

function run(startTs = Date.now()) {
  const imgs = document.querySelectorAll("#application img");
  if(imgs && imgs.length > 0) {
    let replacedAmt = 0;
    for(const img of imgs) {
      const matches = "src" in img ? img.src.match(imgSrcRegex) : null;
      if(matches && matches.length === 3) {
        const [src, maxW, maxH] = matches;
        img.src = src.replace(/\/unsafe\/\d+x\d+\//, `/unsafe/${maxW}x${maxH}/`);
        replacedAmt++;
      }
    }
    if(replacedAmt > 0)
      console.info(`Replaced ${replacedAmt} low-res ${replacedAmt === 1 ? "image with a high-res one" : "images with high-res ones"}.\n\n${GM.info.script.name} v${GM.info.script.version}\n${GM.info.script.homepageURL}`);
    else
      warn("Found no suitable images to replace.");
  }
  else if(Date.now() - startTs < timeoutSec * 1000)
    setTimeout(() => run(startTs), checkInterval);
  else
    warn(`Couldn't find any images to replace after ${timeoutSec} seconds.`);
}

function warn(msg) {
  console.warn(`${msg}\n\nIf you are not on a lyrics page, you can ignore this warning.\nIf this issue keeps happening on lyrics pages, please submit a bug report here: ${GM.info.script.supportURL}`);
}

document.addEventListener("DOMContentLoaded", () => run());
