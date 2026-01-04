// ==UserScript==
// @name            PractiTest Thumbnail Viewer
// @name:ja         PractiTest Thumbnail Viewer
// @namespace       https://prod.practitest.com/
// @version         1.1
// @description     Displays PractiTest thumbnails in their original size by click.
// @description:ja  PractiTestのサムネイルをクリックするとオリジナルサイズで表示します。
// @author          proyuki02
// @match           https://prod.practitest.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=prod.practitest.com
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/472684/PractiTest%20Thumbnail%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/472684/PractiTest%20Thumbnail%20Viewer.meta.js
// ==/UserScript==

function modifyThumbnail() {
    const thumbs = [];
    const images = document.getElementsByTagName("img");
    for (let i = 0; i < images.length; i++) {
        if (images[i].getAttribute('src').endsWith('style=thumb')) {
            thumbs.push(images[i]);
        }
    }

    thumbs.map((thumb) => {
        if (thumb.className) {
            return;
        }
        thumb.className = 'ptv_thumb_img';
        thumb.onclick = () => {
            // loading
            const loading = document.createElement("div");
            loading.className = 'ptv_loader';

            // original image
            const img = document.createElement("img");
            img.src = thumb.src + '&style=original';
            img.className = 'ptv_original_img';
            img.onload = () => {
                loading.remove();
            }

            // background
            const div = document.createElement("div");
            div.className = 'ptv_original_img_bg';
            div.onclick = () => {
                div.remove();
            };
            div.append(loading);
            div.append(img);

            document.body.appendChild(div);
        }
    });
}

(function() {
    'use strict';

    const style = `
.ptv_thumb_img {
  cursor: pointer;
  margin-bottom: 2px;
}
.ptv_thumb_img:hover {
  box-shadow: 0px 0px 2px 2px rgba(60, 194, 235, 0.5);
}

.ptv_original_img {
  position: fixed;
  inset: 0;
  margin: auto;
  z-index: 10000000000;
  cursor: pointer;
  max-width: 95%;
  max-height: 95%;
}
.ptv_original_img_bg {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.8);
  z-index: 1000000000;
  cursor: pointer;
}

.ptv_loader,
.ptv_loader:before,
.ptv_loader:after {
  background: #ffffff;
  -webkit-animation: ptv_load1 1s infinite ease-in-out;
  animation: ptv_load1 1s infinite ease-in-out;
  width: 1em;
  height: 4em;
}
.ptv_loader {
  position: fixed;
  inset: 0;
  margin: auto;
  z-index: 10000000000;
  color: #ffffff;
  text-indent: -9999em;
  font-size: 7px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.ptv_loader:before,
.ptv_loader:after {
  position: absolute;
  top: 0;
  content: '';
}
.ptv_loader:before {
  left: -1.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.ptv_loader:after {
  left: 1.5em;
}
@-webkit-keyframes ptv_load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
@keyframes ptv_load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
`;

    document.querySelector('head').insertAdjacentHTML('beforeend', '<style id="ptv_custom_css"></style>');
    document.querySelector('#ptv_custom_css').innerHTML = style;

    setInterval(modifyThumbnail, 1000);
})();