// ==UserScript==
// @name            Download Gif Button for GIPHY (working in 2025)
// @namespace       com.giphy
// @version         1.0.3
// @description     Adds a download button for gif download
// @author          Thomas R.
// @license         MIT
// @match           http*://giphy.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=giphy.com
// @require         https://greasyfork.org/scripts/374849-library-onelementready-es6/code/Library%20%7C%20onElementReady%20ES6.js
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/523324/Download%20Gif%20Button%20for%20GIPHY%20%28working%20in%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523324/Download%20Gif%20Button%20for%20GIPHY%20%28working%20in%202025%29.meta.js
// ==/UserScript==

const slugify = (string) => {
    return string
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const downloadFile = (url, filename) => {
    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        })
        .catch(err => console.error("Download failed:", err));
}

const handleDownload = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.currentTarget.querySelectorAll("*").forEach(element => element.style.pointerEvents = 'none');

    // not present on client side navigation
    // const imageData = JSON.parse(document.querySelectorAll('script[type="application/ld+json"]')[1].text);
    // const urlArray = imageData.image.url.split('/');
    // const gifId = urlArray[urlArray.length - 2];

    const pageUrlArray = window.location.pathname.split('/');
    const gifNameArray = pageUrlArray[pageUrlArray.length - 1].split('-');;
    const gifId = gifNameArray[gifNameArray.length - 1];

    const gifURL = `https://i.giphy.com/${gifId}.gif`;

    downloadFile(gifURL, `${slugify(document.title.split('-')[0])}.gif`);
}

const init = () => {
    onElementReady('div.flex.flex-col.justify-between.gap-2.px-4 > div > div:nth-child(3)', false, (element) => {
        element.addEventListener("click",handleDownload);
    });
}

init();
