// ==UserScript==
// @name         Replace svg to png
// @version      1.0
// @namespace    svn2png
// @description Replace all svg to png
// @author       muxueqz
// @license      GPL
// @include *://*/*
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/442055/Replace%20svg%20to%20png.user.js
// @updateURL https://update.greasyfork.org/scripts/442055/Replace%20svg%20to%20png.meta.js
// ==/UserScript==

console.log("svg2png init")

const svg2png_single = (svgString, width, height) => {
  return new Promise((res) => {
    var image = new Image();
    image.src = "data:image/svg+xml," + encodeURIComponent(svgString.outerHTML);
    let url = "";
    image.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      console.log('width and height:', canvas.width, canvas.height)
      url = canvas.toDataURL("image/" + "png", 1.0);
      res(url);
    };
  });
};

async function svg2png() {
  console.log("svg2png get")
  let svgs = document.querySelectorAll('svg')
  console.log("svg2png svgs", svgs)
  for (const i of svgs) {
    let svg_item = document.getElementById(i.id)
    console.log(svg_item.parentNode)
    var height = svg_item.clientHeight
    var width = svg_item.clientWidth

    let png_b64 = await svg2png_single(svg_item, width, height)
    var new_img = new Image();
    new_img.src = png_b64
    // console.log(new_img)
    let parentNode = (svg_item.parentNode)
    parentNode.append(new_img);
    svg_item.remove()
  }
}

GM_registerMenuCommand("SVG to PNG", svg2png);
