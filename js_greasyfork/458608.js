// ==UserScript==
// @name         Alibaba download videos product
// @namespace    https://github.com/DeveloperMDCM
// @version      0.1
// @description  Download videos from alibaba - Descarga el video de un producto
// @author       MDCM
// @match        *://*.alibaba.com/*
// @icon         https://play-lh.googleusercontent.com/D09AsmYSxDpMWRSXbu54j2R_8sR-1OgbV2DXSI9_HIuY2IMZ8b8JgscWol6mikknaks
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458608/Alibaba%20download%20videos%20product.user.js
// @updateURL https://update.greasyfork.org/scripts/458608/Alibaba%20download%20videos%20product.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //https://github.com/DeveloperMDCM
    // MDCM
let video = document.querySelector('#main-video > div > div > div > video');
const linkDiv = document.querySelector("#container > div.layout-content > div > div.screen-body > div.screen-layout > div.layout-left > div.main-layout > div.thumb-list > div > div > div.detail-next-slick-list");
const link = document.createElement('DIV');

linkDiv.appendChild(link);
link.innerHTML = `<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
.button-container{
  background-color: red;
}
.button-container:hover{
  background-color: black;
}

a:hover{
  background-color: black;
}
</style>
<div style="margin: 6px 0;" class="container">
<button style=" width: 100%;border-radius: 20px; " class="button-container">
  <a style="color: #fff;"  class="link-descarga" href="#">Download Video</a>
</button>
</div>
`;

const download = async (url, filename) => {
  const data = await fetch(url)
  const blob = await data.blob()
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', objectUrl)
  link.setAttribute('download', filename)
  link.textContent = 'moises';
  link.click();
  const linkdescarga = document.querySelector('.link-descarga');
  linkdescarga.textContent = 'Espere un momento';
  setTimeout(()=>{
    linkdescarga.textContent = 'Download Video'
  },3000);
}


link.addEventListener('click', ()=>{
  video = document.querySelector('#main-video > div > div > div > video');
  console.log(video.src)
  download(`${video.src}`,'video-MDCM');
})


if(video) {
  setInterval(()=>{
    video = document.querySelector('#main-video > div > div > div > video').src;
  },1000);
};

})();