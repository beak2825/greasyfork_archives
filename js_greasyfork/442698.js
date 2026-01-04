// ==UserScript==
// @name         r/place templater Mouse Hat Shop
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license MIT
// @description  try to take over the canvas! Made by r/httyd Edited For /r/stardewvalley Mouse Hat Shop
// @author       oralekin, exdeejay (xDJ_), 101arrowz Edited for /r/stardewvalley by VeraLapsa
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        GM_xmlhttpRequest
// @connect      imgur.com
// @downloadURL https://update.greasyfork.org/scripts/442698/rplace%20templater%20Mouse%20Hat%20Shop.user.js
// @updateURL https://update.greasyfork.org/scripts/442698/rplace%20templater%20Mouse%20Hat%20Shop.meta.js
// ==/UserScript==

(function() {
  // OTHER MEMBERS OF R/PLACE: change the following URL to your own transparent PNG template!
  // Multiple copies of this script can be used at the same time.
  const TEMPLATE = 'https://i.imgur.com/GL6IUN8.png';
    //[from left,from top]
  const X_YCoords = [1708,1008];

  const getToothlessData = async () => {
    const toothlessBlob = new Blob([new Uint8Array(await new Promise(resolve => {
        GM_xmlhttpRequest({ method: 'GET', url: TEMPLATE, responseType: 'arraybuffer', onload: function(response) { resolve(response.response); } });
    }))], { type: 'image/png' });
    const toothlessDataURL = await new Promise(resolve => {
        const fr = new FileReader();
        fr.onload = () => { resolve(fr.result); }
        fr.readAsDataURL(toothlessBlob);
    });
    const tmpImg = document.createElement('img');
    tmpImg.src = toothlessDataURL;
    await new Promise(resolve => tmpImg.onload = resolve);
    const cnv = document.createElement('canvas');
    cnv.width = tmpImg.width;
    cnv.height = tmpImg.height;
    const tmpCtx = cnv.getContext('2d');
    tmpCtx.drawImage(tmpImg, 0, 0);
    return tmpCtx.getImageData(0, 0, cnv.width, cnv.height);
  };

  const dither = (src) => {
    const dithered = new ImageData(src.width * 3, src.height * 3);
    for (let y = 0; y < src.height; ++y) {
      for (let x = 0; x < src.width; ++x) {
        const srcPx = (y * src.width + x) * 4;
        const tgtPx = ((y * 3 + 1) * dithered.width + (x * 3 + 1)) * 4;
        dithered.data[tgtPx] = src.data[srcPx];
        dithered.data[tgtPx + 1] = src.data[srcPx + 1];
        dithered.data[tgtPx + 2] = src.data[srcPx + 2];
        dithered.data[tgtPx + 3] = src.data[srcPx + 3];
      }
    }
    return dithered;
  };

  const getToothlessImg = async () => {
    const toothlessDithered = dither(await getToothlessData());
    const cnv = document.createElement('canvas');
    cnv.width = toothlessDithered.width;
    cnv.height = toothlessDithered.height;
    cnv.getContext('2d').putImageData(toothlessDithered, 0, 0);
    const toothlessBlob = await new Promise(resolve => cnv.toBlob(resolve, 'image/png'));
    const toothlessDataURL = await new Promise(resolve => {
        const fr = new FileReader();
        fr.onload = () => { resolve(fr.result); }
        fr.readAsDataURL(toothlessBlob);
    });
    const tmpImg = document.createElement('img');
    tmpImg.src = toothlessDataURL;
    await new Promise(resolve => tmpImg.onload = resolve);
    tmpImg.style = `position: absolute;left: ${X_YCoords[0]}px;top: ${X_YCoords[1]}px;image-rendering: pixelated;width: ${tmpImg.width / 3}px;height: ${tmpImg.height / 3}px;`;
    return tmpImg;
  };

  let oldToothlessImg;

  const addToothlessImg = async () => {
    if (oldToothlessImg) oldToothlessImg.remove();
    document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
      oldToothlessImg = await getToothlessImg()
    );
  };

  if (window.top !== window.self) {
    window.addEventListener('load', () => {
      addToothlessImg();
      setInterval(addToothlessImg, 60 * 1000);
    }, false);
  }
})()