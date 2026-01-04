// ==UserScript==
// @name         revenuezone РЕШАТЕЛЬ КАПЧИ
// @namespace    http://tampermonkey.net/
// @version      2025-07-28
// @description  только решает капчу на входе
// @author       You
// @match        https://www.revenuezone.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=revenuezone.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543859/revenuezone%20%D0%A0%D0%95%D0%A8%D0%90%D0%A2%D0%95%D0%9B%D0%AC%20%D0%9A%D0%90%D0%9F%D0%A7%D0%98.user.js
// @updateURL https://update.greasyfork.org/scripts/543859/revenuezone%20%D0%A0%D0%95%D0%A8%D0%90%D0%A2%D0%95%D0%9B%D0%AC%20%D0%9A%D0%90%D0%9F%D0%A7%D0%98.meta.js
// ==/UserScript==
//только решает капчу на входе
(function() {
    'use strict';

var s = document.createElement("script")
s.src = "https://cdn.jsdelivr.net/gh/desousar/OcradJS_use_strict@v2/ocrad.js";
document.head.appendChild(s);
s.onload = (async () => {
      readImage(this);
});
    function readImage(input) {
          var image = new Image();
		  image.src = document.querySelectorAll("img[src*='data:image']")[0].src;

          image.onload = function() {

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const upscaleBy = 1
            canvas.width = image.width * upscaleBy;
            canvas.height = image.height * upscaleBy;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

           const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < imageData.data.length; i += 4) {
              const r = imageData.data[i];
              const g = imageData.data[i + 1];
              const b = imageData.data[i + 2];
              const brightness = (r + g + b) / 3;
              const bw = brightness < 128 ? brightness : 255;
              imageData.data[i] = bw;
              imageData.data[i + 1] = bw;
              imageData.data[i + 2] = bw;
            }
            ctx.putImageData(imageData, 0, 0);

            const base64Image = canvas.toDataURL('image/jpeg', 1);

            const image2 = new Image();
            image2.onload = function() {
              const result = OCRAD(image2);

			  console.log(result);
			  document.querySelector("#faucet_form > div > input").value = result;
            };
            image2.src = base64Image;
          };

    }

})();