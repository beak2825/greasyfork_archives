// ==UserScript==
// @name        Downloader
// @namespace   d1
// @match       https://drive.google.com/file/d/*
// @grant       none
// @version     1.0
// @author      -
// @description 02.11.2022, 17:56:23
// @downloadURL https://update.greasyfork.org/scripts/454144/Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/454144/Downloader.meta.js
// ==/UserScript==
const jspdf =
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js';
const script = document.createElement('script');
script.onload = load;
script.src = jspdf;
document.body.appendChild(script);

async function load() {
  const pdf = new jsPDF();
  const name = window.viewerData.itemJson[1].replace(/[\s\/\.]/g, '_');
  const metaUrl = window.viewerData.itemJson.find((i) => i && /meta/.test(i));
  const metaRaw = await fetch(metaUrl).then((response) => response.text());
  const meta = JSON.parse(metaRaw.split('\n').pop());
  const url = new URL(metaUrl);
  url.pathname = url.pathname.replace('meta', 'img');
  url.searchParams.set('authuser', '0');
  url.searchParams.set('skiphighlight', 'true');
  url.searchParams.set('webp', 'true');
  url.searchParams.set('w', '800');
  const imageLoads = [];
  console.log('Loading...');
  for (let i = 0; i < meta.pages; i++) {
    url.searchParams.set('page', i);
    imageLoads.push(loadImage(url));
  }
  const images = await Promise.all(imageLoads);
  console.log('Rendering...');
  for (const image of images) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, image.width, image.height);
    const data = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(data, 'JPEG', 0, 0);
    pdf.addPage();
  }
  console.log('Saving...');
  pdf.save(`${name}.pdf`);
}

function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve(image);
  });
}