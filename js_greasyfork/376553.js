// ==UserScript==
// @name         Resizer for readcomiconline.to
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  Make comic book pages fit on screen, because you're worth it.
// @author       itsnotlupus
// @match        https://readcomiconline.to/*
// @match        https://readcomiconline.li/*
// @grant        GM_xmlhttpRequest
// @require      https://unpkg.com/jquery@3.3.1/dist/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/376553/Resizer%20for%20readcomiconlineto.user.js
// @updateURL https://update.greasyfork.org/scripts/376553/Resizer%20for%20readcomiconlineto.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // remedial ad cleanup, for the adblock-impaired.
  try { document.getElementById('cus-exo').parentElement.remove() } catch (e){};
  setInterval(()=> {
    $([
      'script',
      'iframe[src^="/Ads"]',
      'iframe[src*="ads"]',
      'iframe:not([src*="disqus.com"]):not([src^="https://www.google.com/recaptcha"])',
      '[style="position: static !important;"]',
      '[id*="ads"]',
      '.top_page_alert',
      '#fb-root',
      '#stcpDiv',
      '#stwrapper',
      '#stOverlay'
    ].toString()).remove();
  }, 100);
  
  // add some basic image sizing so pages are quickly readable before the fitScreen thing finishes
  // and hide the zoom controls. just use your browser zoom, it works better.
  $(`<style type=text/css>
#divImage img {
  height: ${innerHeight}px; 
}
#divImage > p:not(:first-child) {
  display: inline-block;
}
.btnZoom-container {
  display: none;
}
#status {
  position: fixed;
  bottom: 0;
  background: black;
  color: #ccc;
}
</style>`).appendTo('head');
  
  const images = "#divImage>p>img";
  
  const msg = n => n>0 ? 'done.' : [
    'Run batman, run!',
    'This page is brought to you by Porn doritos. Porn Doritos, it\'s what for dinner. In bed.',
    'Do you ever wonder what would happen if...',
    'The packets are coming from INSIDE your network!'
  ][~~(Math.random()*4)]
  
  const fitScreen = async () => {
    const status= $('<div id=status>loading...').appendTo('body');
    const pageWidth = document.body.clientWidth;
    const pages = $(images);
    const totalPages = pages.length;
    let processedPages = 0;
    const updateTimer = setInterval(() => {
      status.text(`processing ${processedPages}/${totalPages} pages...`);
      if (processedPages >= totalPages) {
        clearInterval(updateTimer);
        status.text(msg(totalPages));
        setTimeout(()=>status.fadeOut(2000,()=>status.remove()), 2000);
      }
    }, 250);
    for (let i = 0; i < totalPages; i++) {
      const elt = pages[i];
      let url, width, height;
      if (elt.src.indexOf('blob:') === 0) {
        return;
      } else {
        ({ url, width, height } = await removeBanner(await blobify(elt.src), i));
      }      
      elt.src = url;
      elt.onload = () => {
        URL.revokeObjectURL(url);
        elt.onload = null;
      };
      
      elt.style.maxWidth = "inherit";
      elt.style.maxHeight = "inherit";
      if (i===0) { // force cover to sit by itself.
        elt.style.display="block";
        elt.style.marginLeft = elt.style.marginRight = "auto";
      } else { 
        elt.parentElement.style.display="inline-block";
      }
      if (width>height) {
        // double pages. make it fit, even if you need to upscale.
        if (width/height > pageWidth/innerHeight) {
            elt.style.width = (pageWidth*0.95)+"px";
        } else {
            elt.style.height = innerHeight + "px";
        }
      } else {
        // single page. we don't upscale for now. maybe we should.
        elt.style.maxWidth = pageWidth/2+"px";
        elt.style.maxHeight = innerHeight + "px";
      }
      processedPages += 1;
    }
  };
  

  addEventListener('keydown', e => {
    let nextImage;
    if (e.ctrlKey || e.altKey) return;
    switch (e.keyCode){
      case 34:
      case 39:
      case 40:
        nextImage = Array.from($(images)).find(img=>img.offsetTop>scrollY);
        if (!nextImage) $(".btnNext")[0].click();
        break;
      case 33:
      case 37:
      case 38:
        nextImage = Array.from($(images)).reverse().find(img=>img.offsetTop<scrollY);
        break;
    }
    if (nextImage) {
      nextImage.scrollIntoView();
      e.preventDefault();
    }
  });
  
  const blobify = url => new Promise(resolve => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'blob',
      onload: xhr => resolve(URL.createObjectURL(xhr.response))
    });
  });
  const loadImg = url => new Promise(resolve => {
    const img = new Image;
    img.src = url;
    img.onload = e => { img.onload = null; resolve(img); }
  });
  const removeBanner = blobUrl => new Promise(async resolve => {
    const img = await loadImg(blobUrl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    // sad test for banner.
    const data = ctx.getImageData(0, img.height - 11, 40, 10).data;
    let found = false;
    for (let i=0;i<data.length;i++) if (data[i] !== (i%4===3?255:0)) { found = true; break }
    if (!found) {
      canvas.height -= 80; // remove banner
      ctx.drawImage(img, 0, 0);
      canvas.toBlob( blob => {
          const url = URL.createObjectURL(blob);
          resolve({
            url,
            width: canvas.width,
            height: canvas.height
          });
        URL.revokeObjectURL(blobUrl);
      });
    } else {
      // no banner, do nothing.
      resolve({ url: blobUrl, width: img.width, height: img.height });
    }
  });
  
  fitScreen();
})();