// ==UserScript==
// @name         Vanta - A KoGaMa Theme
// @namespace    discord/@angelstreatment
// @version      1.1
// @description  A gentle bright theme in dreams of summer sunset.
// @author       strayqt (simon)
// @match        *://www.kogama.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527664/Vanta%20-%20A%20KoGaMa%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/527664/Vanta%20-%20A%20KoGaMa%20Theme.meta.js
// ==/UserScript==

// ⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆ | Snippet to allow copy-pasting on website.
(function () {
  "use strict";
  function allowPaste(event) {
    event.stopImmediatePropagation();
    return true;
  }
  document.addEventListener("paste", allowPaste, true);
})();


// ⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆ | Snippet to hide bloated navigation menu + gold icon in user panel.
(function () {
  "use strict";
  function hideMenuItems() {
    const menuItemsToHide = [
      "/news/",
      "/leaderboard/",
      "/subscription/subscribe/",
      "/purchase/",
    ];
    const menuLinks = document.querySelectorAll("a.MuiTypography-root");

    menuLinks.forEach((link) => {
      if (menuItemsToHide.includes(link.getAttribute("href"))) {
        const parentLi = link.closest("li");
        if (parentLi) {
          parentLi.style.display = "none";
        }
      }
    });
    const levelItem = Array.from(menuLinks).find((link) => {
      const href = link.getAttribute("href");
      return href && href.includes("/levels/");
    });
    if (levelItem) {
      const parentLi = levelItem.closest("li");
      if (parentLi) {
        parentLi.style.display = "none";
      }
    }
    const goldCubeItem = document.querySelector("li._3WhKY._18cmu");
    if (goldCubeItem) {
      goldCubeItem.style.display = "none";
    }
  }

  window.addEventListener("load", hideMenuItems);
})();
const injectCss = (id, css) => {
  const style = document.createElement("style");
  style.id = id;
  style.innerText = css;
  document.head.appendChild(style);
  return style;
};

// ⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆ | Snippet to process image RGB to make profile banner look cleaner.
(function () {
  "use strict";

  function removeBlueBackground(imageUrl, callback) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (b > 150 && b > r && b > g) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      callback(canvas.toDataURL());
    };
    img.src = imageUrl;
  }

  function processImages() {
    document.querySelectorAll("image._3tYRU").forEach((imageElement) => {
      removeBlueBackground(imageElement.getAttribute("xlink:href"), (newImageUrl) => {
        imageElement.setAttribute("xlink:href", newImageUrl);
      });
    });
  }

  window.addEventListener("load", processImages);
})();

// ⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆ | CSS
(function() {
    'use strict';
    GM_addStyle(`
        /* Global Attributes */
        :root {
        --reactpanels: rgba(18, 18, 18, 0.36);
        --focusreactpanels: rgba(24, 24, 24, 0.56);
        }
        #root-page-mobile { /* Global Page */
        background-color: transparent !important;
        background-image: linear-gradient(113deg, #b25003, #581d56 80%) !important;
        }


        /* Profile Tab Attributes */
        ._2IqY6 h1::before {
        content: "| " !important;
        color: inherit !important;
        margin-right: 5px !important;
        }
        .UA3TP._2bUqU {
        top: 55px;
        }
        ._33DXe {
        background-image: none !important;
        }
        ._1z4jM {
        display: none !important;
        }
        ._1q4mD ._1sUGu ._3hI0M .jdoNW a {
        display: none !important;
        }
        .UA3TP ._3tYRU, .UA3TP rect {
        clip-path: circle(50%) !important;
        }
        .UA3TP rect {
        display: none !important;
        }
        .css-zslu1c {
        background-color: var(--reactpanels) !important;
        border-radius: 9px !important;
        backdrop-filter: blur(4px) !important;
        }

        .css-1udp1s3 {
        background-color: var(--reactpanels)  !important;
        border-radius: 9px !important;
        backdrop-filter: blur(4px) !important;
        }
        ._2O_AH {
        opacity: 0 !important;
        transition: opacity 0.8s ease-in-out !important;
        }

        ._2IqY6:hover ._2O_AH {
        opacity: 0.7 !important;
        }
        .UA3TP ._11RkC {
        display: none !important;
        }
        ._2IqY6 {
        position: relative !important;
        bottom: 15px;
        }

        ._1q4mD ._1sUGu ._3hI0M ._18cmu, .css-rebkop {
        opacity: 0.1;
        transition: opacity ease-in-out 0.7s;
        }
        ._1q4mD ._1sUGu ._3hI0M ._3WhKY._18cmu:hover, .css-rebkop:hover {
        opacity: 0.9;
        }

        .css-b0qydj {
        background-color: transparent !important;
        background-image: none !important;
        }



        /* Friends Bar Attributes  */
        ._3TORb {
        position: fixed !important;
        right: -192px !important;
        background-color: var(--reactpanels) !important;
        width: 450px !important;
        transition: all 0.8s ease-in-out !important;
        opacity: 0 !important;
        }

        ._3TORb:hover {
        opacity: 1 !important;
        right: 2px !important;
        }

        ._3TORb:not(:hover) {
        opacity: 0 !important;
        right: -192px !important;
        }
        ._1pEP2, .tRx6U {
        display: none !important;
        }
        ._3TORb ._1lvYU ._1taAL ._40qZj._1mEz4 {
        opacity: 0.1;
        transition: all ease-in-out 0.6s;
        }
        ._3TORb ._1lvYU ._1taAL ._40qZj._1mEz4:hover {
        opacity: 0.8;
        }
        .zUJzi, .uwn5j, ._375XK {
        background-color: var(--focusreactpanels) !important;
        }
        .zUJzi .o_DA6 .uwn5j {
        border-right: none !important;
        }
        ._375XK .F3PyX {
        border-bottom: none !important;
        }
        ._375XK textarea {
        background-color: var(--reactpanels);
        color: #fff !important;
        outline: none !important;
        box-shadow: none !important;
        border-top: none !important;
        }
        ._375XK textarea::placeholder {
        color: #fff !important;
        }
        .zUJzi ._2BvOT ._375XK textarea {
        outline: none !important;
        box-shadow: none !important;
        border: none !important;
        }







        /* Feed Attributes */
        .css-bho9d5 {
        background: linear-gradient(to right, #ff1d1d, #ff1eec, #fc22ea, #0f93ff, #00ffb3, #00ff00, #fffb21, #e69706, #ff1111);
        -webkit-background-clip:a text;
        background-clip: text;
        color: transparent !important;
        animation: rainbow_animation 10s ease-in-out infinite;
        background-size: 400% 100%;
        }
        @keyframes rainbow_animation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
        }
        .css-1rbdj9p { /* Feed Comments */
        background-color: var(--reactpanels)  !important;
        border-radius: 9px !important;
        backdrop-filter: blur(4px) !important;
        }



        /* Game Tab Attributes */
        .BO5D_ {
        opacity: 0.2 !important;
        transition: all 0.6s ease-in-out !important;
        }
        .BO5D_:hover {
        opacity: 1 !important;
        }
        ._1CJub, ._1fV3a, ._35ABf {
        display: none !important;
        }

        ._1iWPR {
        opacity: 0.2 !important;
        transition: opacity ease-in-out 0.7s !important;
        }
        ._1iWPR:hover {
        opacity: 0.7 !important;
        }
        .gmqKr ._1ZdZA {
        background: transparent !important;
        color: #fff !important;
        }
        ._3i_24 {
        display: none !important;
        }





        /* Website garbage */
        ._1RMYS {
         display: none !important;
        }
        .Hkdag {
        display: none !important;
        }
        ._21Sfe {
        color: #fff !important;
        }
        ._1q4mD {
        background-color: var(--reactpanels) !important;

        }
        ._1q4mD ._1sUGu ._1u05O {
        background-color: transparent !important;
        }
        .css-1xh9k1k {
        background-color: var(--reactpanels) !important;
        }
        .css-1srashi {
        background-color: var(--reactpanels) !important;
        }
        .css-srzahu {
        background-color: transparent !important;
        }
        .css-1q5yd8z, .css-1m6r9c9 {
        color: #fff !important;
        }
        .css-qr6c39, .css-fw2tbd {
        color: #fff !important;
        }
        .css-16fidy5, .css-qr6c39, .css-cisn0m, .css-fw2tbd, .css-rqc8s9 {
        background-color: var(--reactpanels) !important;
        }
        .css-16fidy5:hover,, .css-qr6c39:hover, .css-cisn0m:hover, .css-fw2tbd:hover, .css-rqc8s9:hover {
        background-color: var(--focusreactpanels) !important;
        }
        .j4PNr {
        background-color: var(--reactpanels) !important;
        }
        .j4PNr ._38CK4 .Rj_QH, .j4PNr ._38CK4 ._341Kw {
        display: none !important;
        }
    `);
})();