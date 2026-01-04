// ==UserScript==
// @name         图集岛VIP
// @namespace    https://github.com/jin-lin0/tampermonkey-demo
// @version      0.1
// @description  2023/10/7
// @author       logyes
// @license      MPL-2.0

// @match        *://*.sqmuying.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476899/%E5%9B%BE%E9%9B%86%E5%B2%9BVIP.user.js
// @updateURL https://update.greasyfork.org/scripts/476899/%E5%9B%BE%E9%9B%86%E5%B2%9BVIP.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function getImageNumber(image) {
    const imgNum = image
      .closest("li")
      .querySelector("span.shuliang")
      .textContent.match(/\d+/)[0];
    return parseInt(imgNum);
  }

  function openNewTabWithImagesAndSlider(imgArr) {
    const newTab = window.open();
    let html = `
    <html>
        <head>
            <title>Image</title>
                <style>
                    input{
                        width:100%
                    }
                </style>
        </head>
    <body>`;

    html += `<input type="range" id="imageSlider" min="2" max="100" value="33"><br>`;

    imgArr.forEach((imgUrl) => {
      html += `<img src="${imgUrl}" class="resizable-image"/>`;
    });

    html += `
        <script>
            const slider = document.getElementById("imageSlider");
            const images = document.querySelectorAll(".resizable-image");
            images.forEach((image) => {
                image.style.width = slider.value + "%";
              });

            slider.addEventListener("input", function (e) {
                const imageSize = e.target.value + "%";
                images.forEach((image) => {
                    image.style.width = imageSize;
                });
                
            });
        </script>
    `;

    html += `</body></html>`;
    newTab.document.open();
    newTab.document.write(html);
    newTab.document.close();
  }

  const images = document.querySelectorAll("img");
  images.forEach((image) => {
    image.addEventListener("click", (e) => {
      e.preventDefault();
      let imgSrc = e.target.src;
      const imgNum = getImageNumber(image);
      let imgArr = Array.from({ length: imgNum }, (_, i) =>
        imgSrc.replace(
          /(\d+)\.(jpg|png|gif|jpeg)$/,
          (match, number, ext) => `${i + 1}.${ext}`
        )
      );
      openNewTabWithImagesAndSlider(imgArr);
    });
  });
})();
