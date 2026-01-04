// ==UserScript==
// @name        Imgflip direct download
// @namespace   Violentmonkey Scripts
// @match       https://imgflip.com/memegenerator*
// @grant       none
// @version     1.0
// @author      thepiguy (gh: rocking1001)
// @description 17/01/2024, 16:06:44
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485073/Imgflip%20direct%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/485073/Imgflip%20direct%20download.meta.js
// ==/UserScript==


let download_btn = document.createElement('button');
download_btn.innerText = "download";
download_btn.onclick = download;
download_btn.classList.add("mm-reset");
download_btn.classList.add("reset");
download_btn.classList.add("but");
download_btn.classList.add("l");

let copy_btn = document.createElement('button');
copy_btn.innerText = "copy";
copy_btn.onclick = copyimg;
copy_btn.classList.add("mm-reset");
copy_btn.classList.add("reset");
copy_btn.classList.add("but");
copy_btn.classList.add("l");


let btn_container = document.querySelector('.gen-wrap-btns');
btn_container.appendChild(download_btn);
btn_container.appendChild(copy_btn);

function download() {
  const canvas = document.querySelector('.mm-canv');
  const imageDataURL = canvas.toDataURL('image/png');
  const downloadLink = document.createElement('a');
  downloadLink.download = 'canvas_image.png';
  downloadLink.href = imageDataURL;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function copyimg() {
  const canvas = document.querySelector('.mm-canv');
  const imageDataURL = canvas.toDataURL('image/png');
  const blob = dataURLtoBlob(imageDataURL);

  navigator.clipboard.write([
    new ClipboardItem({ 'image/png': blob })
  ]).then(() => {
    console.log('Canvas image copied to clipboard successfully!');
  }).catch((err) => {
    console.error('Error copying canvas image to clipboard:', err);
  });
}

function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}