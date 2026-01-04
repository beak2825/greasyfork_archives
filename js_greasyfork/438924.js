// ==UserScript==
// @name        Right-Click Twitter NFT Profile Pics
// @description Free hexagonal profile pics for everyone!
// @namespace   https://github.com/insin/greasemonkey/
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @version     2
// @downloadURL https://update.greasyfork.org/scripts/438924/Right-Click%20Twitter%20NFT%20Profile%20Pics.user.js
// @updateURL https://update.greasyfork.org/scripts/438924/Right-Click%20Twitter%20NFT%20Profile%20Pics.meta.js
// ==/UserScript==

let hexagon = 'M193.248 69.51C185.95 54.1634 177.44 39.4234 167.798 25.43L164.688 20.96C160.859 15.4049 155.841 10.7724 149.998 7.3994C144.155 4.02636 137.633 1.99743 130.908 1.46004L125.448 1.02004C108.508 -0.340012 91.4873 -0.340012 74.5479 1.02004L69.0879 1.46004C62.3625 1.99743 55.8413 4.02636 49.9981 7.3994C44.155 10.7724 39.1367 15.4049 35.3079 20.96L32.1979 25.47C22.5561 39.4634 14.0458 54.2034 6.74789 69.55L4.39789 74.49C1.50233 80.5829 0 87.2441 0 93.99C0 100.736 1.50233 107.397 4.39789 113.49L6.74789 118.43C14.0458 133.777 22.5561 148.517 32.1979 162.51L35.3079 167.02C39.1367 172.575 44.155 177.208 49.9981 180.581C55.8413 183.954 62.3625 185.983 69.0879 186.52L74.5479 186.96C91.4873 188.32 108.508 188.32 125.448 186.96L130.908 186.52C137.638 185.976 144.163 183.938 150.006 180.554C155.85 177.17 160.865 172.526 164.688 166.96L167.798 162.45C177.44 148.457 185.95 133.717 193.248 118.37L195.598 113.43C198.493 107.337 199.996 100.676 199.996 93.93C199.996 87.1841 198.493 80.5229 195.598 74.43L193.248 69.51Z'

let pentagon = 'M 42.131237,181.40652 C 33.734518,175.31027 3.2636023,81.637938 6.4667493,71.768344 9.6698973,61.898744 89.341543,3.972838 99.717933,3.969338 c 10.376357,-0.0034 90.087057,57.868656 93.296857,67.736085 3.20981,9.867435 -27.19792,103.560307 -35.59052,109.662207 -8.39261,6.10191 -106.896314,6.13514 -115.293033,0.039 z'

document.body.insertAdjacentHTML('beforeend', `
<div style="width: 0px; height: 0px;">
  <svg height="0" viewBox="0 0 200 188" width="0">
    <defs>
      <clipPath clipPathUnits="objectBoundingBox" id="right-click" transform="scale(0.005 0.005319148936170213)">
        <path d="${hexagon}"></path>
      </clipPath>
    </defs>
  </svg>
</div>
<style>
div[style^="height: calc(100%"] {
  clip-path: url("#right-click");
  border-radius: unset;
}
</style>
`)