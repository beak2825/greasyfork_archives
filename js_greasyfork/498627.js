// ==UserScript==
// @name         NovelAI No Tag Copy
// @name:en      NovelAI No Tag Copy
// @namespace    https://novelai.net
// @version      1.2
// @description:zh-cn 复制没有Tag的图片
// @description:en Copy PNG without Tag
// @author       nahidajuice
// @license      MIT
// @match        https://novelai.net/image
// @grant        none
// @icon         https://novelai.net/icons/novelai-round.png
// @description
// @updateURL
// @description Copy PNG without Tag
// @downloadURL https://update.greasyfork.org/scripts/498627/NovelAI%20No%20Tag%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/498627/NovelAI%20No%20Tag%20Copy.meta.js
// ==/UserScript==

var buttoncpy = document.createElement("buttoncpy");
buttoncpy.innerHTML = "copy";
buttoncpy.style.position = "fixed";
buttoncpy.style.top = "0.5%";
buttoncpy.style.right = "0.5%";
buttoncpy.style.zIndex = "9999";
buttoncpy.style.backgroundColor = '#13152c';
buttoncpy.style.color = '#f5f3c2';
buttoncpy.style.borderRadius = '3px';
buttoncpy.style.border = '0.01px solid';
buttoncpy.style.borderColor = 'rgba(40, 43, 73, 1)';
buttoncpy.style.fontFamily = 'Source Sans Pro';
buttoncpy.style.fontSize = '15px';
buttoncpy.style.cursor = "pointer";
document.body.appendChild(buttoncpy);

async function createImageBlob(url) {
  const response = await fetch(url);
  return await response.blob();
}

async function imageDataFromSource (source) {
   const image = Object.assign(new Image(), { src: source });
   await new Promise(resolve => image.addEventListener('load', () => resolve()));
   const context = Object.assign(document.createElement('canvas'), {
      width: image.width,
      height: image.height
   }).getContext('2d');
   context.imageSmoothingEnabled = false;
   context.drawImage(image, 0, 0);
   return context.getImageData(0, 0, image.width, image.height);
}

async function imageDataToBlob(imageData){
  let w = imageData.width;
  let h = imageData.height;
  let canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  let ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);// synchronous
  return new Promise((resolve) => {
        canvas.toBlob(resolve); // implied image/png format
  });
}

buttoncpy.onclick = async function() {
    let img = document.querySelector("img");
    if (img == null){
        buttoncpy.innerHTML = "no image!";
        setTimeout(() => {
            buttoncpy.innerHTML = "copy";
        }, 800);
        return null
    }
    buttoncpy.innerHTML = "copying";
    let imgData = await imageDataFromSource(img.src);
    for (let i = 3; i < imgData.data.length; i+=4){
        imgData.data[i] = 255;
    }
    const imageBlob = await imageDataToBlob(imgData);
    console.log("process finished")
    try {
        const item = new ClipboardItem({
            [imageBlob.type]: imageBlob
        });
        await navigator.clipboard.write([item]);
        console.log("copy success");
    } catch (error) {
        console.error("copy error", error);
    }
    buttoncpy.innerHTML = "copyed!";
    setTimeout(() => {
        buttoncpy.innerHTML = "copy";
    }, 800);
};
