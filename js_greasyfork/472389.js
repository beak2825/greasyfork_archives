// ==UserScript==
// @name        Remove the Reddit Image Overlay
// @namespace   RedditIngFix
// @include     https://i.redd.it/*.*
// @grant       none
// @version     1.2
// @author      Kane
// @license     MIT
// @description 04/08/2023, 3:54:16 pm
// @downloadURL https://update.greasyfork.org/scripts/472389/Remove%20the%20Reddit%20Image%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/472389/Remove%20the%20Reddit%20Image%20Overlay.meta.js
// ==/UserScript==

if (window.attachEvent) {window.attachEvent('onload', check_and_kill);}
else if (window.addEventListener) {window.addEventListener('load', check_and_kill, false);}
else {document.addEventListener('load', check_and_kill, false);}

function check_and_kill() {
  let overlay_enabled = document.getElementsByTagName("shreddit-app").length > 0;
  if (overlay_enabled) {

    let img_src = document.getElementsByTagName("img")[0].src;
    create_img_template(img_src);
  }
}

function addCSS(cssText) {
  const styleElement = document.createElement("style");
  styleElement.type = "text/css";
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = cssText;
  } else {
    styleElement.appendChild(document.createTextNode(cssText));
  }

  document.head.appendChild(styleElement);
}

function getFilenameFromURL(url) {
  const segments = url.split('/');
  const filename = segments[segments.length - 1];
  return filename.split('?')[0].split('#')[0];
}

function create_img_template(img_src) {
  console.log("Create img template...");
  console.log(img_src);
  let string_css = `
      html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
    }

    .image-container {
      position: relative;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
    }

    .image.full-size {
      top: 0;
      left: 0;
      width: auto;
      height: auto;
      width: unset;
      height: unset;
      z-index: 9999;
    }`;
  let string_html_head = `
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${getFilenameFromURL(img_src)}</title>
      <style>${string_css}</style>
    `;
  let string_html_body = `
      <div class="image-container">
        <img src="${img_src}" alt="Image" class="image">
      </div>`;

  document.body.innerHTML = string_html_body;
  document.head.innerHTML = string_html_head;

  const imageContainer = document.getElementsByClassName("image-container")[0];
  const image = document.getElementsByClassName("image")[0];

  imageContainer.addEventListener("click", function() {
    if (image.classList.contains("full-size")) {
      // Revert to scaled size
      image.classList.remove("full-size");
    } else {
      // Go full size
      image.classList.add("full-size");
    }
  });
}