// ==UserScript==
// @name         (react-icons)Svg downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  download svg on one click
// @author       Poe
// @match        *react-icons.github.io/react-icons*
// @icon         https://cdn-icons-png.flaticon.com/512/1829/1829008.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472067/%28react-icons%29Svg%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/472067/%28react-icons%29Svg%20downloader.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const handleKeyDown = (event) => {
    if (event.altKey && (event.keyCode===83)) {
         alert(`SVG download functions attached to svgs
          1. click svg to download.
          2. refresh page to unmount download functions`)
        const svgs = document.getElementsByTagName("svg");
        const svgOnclick = (e) => {
          console.log("you clicked svg e.target:", e.currentTarget);
          const svg = e.currentTarget;
          const serializer = new XMLSerializer();
          let source = serializer.serializeToString(svg);

          //add name spaces.
          if (
            !source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)
          ) {
            source = source.replace(
              /^<svg/,
              '<svg xmlns="http://www.w3.org/2000/svg"',
            );
          }
          if (
            !source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)
          ) {
            source = source.replace(
              /^<svg/,
              '<svg xmlns:xlink="http://www.w3.org/1999/xlink"',
            );
          }

          //add xml declaration
          let sourceAll = '<?xml version="1.0" standalone="no"?>\r\n' + source;

          //convert svg source to URI data scheme.
          let url =
            "data:image/svg+xml;charset=utf-8," + encodeURIComponent(sourceAll);
          let link = document.createElement("a");
          document.body.appendChild(link);
          link.href = url;
          link.download = "svgDownloaded";
          link.click();
        };

        Object.values(svgs).forEach((svg) => {
          svg.removeEventListener("click", svgOnclick, true);
          svg.addEventListener("click", svgOnclick, true);
        });
    }
  };
  document.addEventListener("keydown", handleKeyDown, false);
})();
