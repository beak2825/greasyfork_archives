// ==UserScript==
// @name         Download Full Size Image from Clovia
// @namespace    Made by Abhinav
// @version      1.1
// @description  Adds download button that download image on product pages
// @author       You
// @match        https://www.clovia.com/product/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clovia.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488465/Download%20Full%20Size%20Image%20from%20Clovia.user.js
// @updateURL https://update.greasyfork.org/scripts/488465/Download%20Full%20Size%20Image%20from%20Clovia.meta.js
// ==/UserScript==

// declare as global so I can use it in multiple functions
let timeout;

async function download({ url, name }) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const file = new File([blob], name, { type: blob.type });

    // saveAs function is from filesaver.js.
    // eslint-disable-next-line
    saveAs(file, name);

    console.log(`ABHI: Image "${name}" downloaded and saved successfully.`);
  } catch (error) {
    console.error('ABHI: Error downloading or saving the image:', error);
  }
}

function downloadImage () {
    const $image = document.querySelector(".ns-img");
    const url = $image.attributes.imagefull.value;
    const splitup = url.split("/")
    const name = splitup[splitup.length - 1]

    const args = {
        url, name
    }

    download(args)
}

function placeButton () {
    const $parent = document.querySelector(".slider-inner");
    // check if slider has loaded.
    if ($parent === undefined) return null;

    const $button = document.createElement("button");
    $button.style.borderRadius = "0 4px 4px 0";
    $button.style.left = 0;
    $button.style.top = "2%";
    $button.style.zIndex = 3;
    $button.innerText = "Download";
    $button.onclick = downloadImage;

    // Append button at start of parent
    $parent.prepend($button);

    // Clear timeout now that we have no use for it
    clearTimeout(timeout);

    // does nothing, i think.
    return 1;

}


function main () {
    // page takes it's sweet time to load
    // this bit checks if the slider has loaded
    // if it is not loaded it will check again
    timeout = setTimeout(() => {
        if (placeButton() === null) return;
    }, 1000)
}

(function() {
    'use strict';
    // will run script when the window loads
    window.onload = main
})();