// ==UserScript==
// @name         fapodrop.com gallery downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fapodrop.com gallery downloader. Ads a button on top to Download all imagenes of the gallery (including pagination)
// @author       ReallyAmateur
// @match        https://fapodrop.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fapodrop.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.js
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/471844/fapodropcom%20gallery%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/471844/fapodropcom%20gallery%20downloader.meta.js
// ==/UserScript==

function getOriginalImageUrl(thumbnailUrl) {
    return thumbnailUrl.replace('thumbnails', 'photo').replace('_thumbnail.jpeg', '.jpeg');
}

async function getImageUrlsFromPage(pageUrl) {
    let response = await fetch(pageUrl);
    let htmlString = await response.text();
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlString, 'text/html');
    let thumbnails = Array.from(doc.querySelectorAll('img.thumbnail-img'));
    return thumbnails.map(img => getOriginalImageUrl(img.src));
}

async function getImageBlob(url) {
    let response = await fetch(url);
    return await response.blob();
}
function getSafeFilename(filename) {
    return filename.replace(/[\/\\:*?"<>|]/g, '_');
}
async function getAllImageUrls() {
    let pageUrl = window.location.href;
    let allImageUrls = [];
    while (pageUrl) {
        let imageUrls = await getImageUrlsFromPage(pageUrl);
        allImageUrls.push(...imageUrls);

        let response = await fetch(pageUrl);
        let htmlString = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(htmlString, 'text/html');
        let nextButton = Array.from(doc.querySelectorAll('a.btn.mx-auto.d-inline.page-btn')).reduce((resultado, el) => {
            if (!resultado && el.textContent.includes('Next')) {
                return el;
            }
            return resultado;
        }, null);

        pageUrl = nextButton ? nextButton.href : null;
    }

    let zip = new JSZip();

    for (let i = 0; i < allImageUrls.length; i++) {
        let url = allImageUrls[i];
        let blob = await getImageBlob(url);
        zip.file(`image${i}.jpeg`, blob, {binary:true});
    }

    zip.generateAsync({type:"blob"})
        .then(function(blob) {
            saveAs(blob, getSafeFilename(document.title)+".zip");
        });
}

function generateButton(){
    const button = document.createElement('button');
    button.textContent = 'Download all!';

    button.style.position = 'fixed';
    button.style.top = '0%';
    button.style.left = '50%';
    button.style.transform = 'translate(-50%, 8px)';
    button.style.zIndex = 9999;
    button.onclick = getAllImageUrls
    document.body.appendChild(button);
}


function startGalleryDownloaderScript(){
    if(!!document.querySelectorAll('img.thumbnail-img').length){
        generateButton()
    } else {
        console.log("No image gallery")
    }
}
window.addEventListener('load', startGalleryDownloaderScript);



