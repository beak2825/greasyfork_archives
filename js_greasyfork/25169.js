// ==UserScript==
// @name         View Full Twitter Image
// @version      2.0.1
// @description  Undo Twitter's insistence to down-res images when viewing on its dedicated page and add a button to download the full image without the weird file extensions which don't count as actual images.
// @author       ForgottenUmbrella
// @match        https://pbs.twimg.com/media/*
// @grant        none
// @noframes
// @namespace    https://greasyfork.org/users/83187
// @downloadURL https://update.greasyfork.org/scripts/25169/View%20Full%20Twitter%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/25169/View%20Full%20Twitter%20Image.meta.js
// ==/UserScript==

"use strict";

// Returns the URL to the original image file (as a string), given a `location` object.
function ogImageUrl(location) {
    let url = new URL(location.href);
    const isNewFormat = url.search.length > 0;
    if (isNewFormat) {
        // The old URL format is https://pbs.twimg/media/hash.jpg:orig.
        // The new URL format is https://pbs.twimg.com/media/hash?format=jpg&name=orig.
        let params = new URLSearchParams(url.search);
        params.set("name", "orig");
        url.search = params.toString();
        return url.href;
    }
    return url.href.replace(":large", "") + ":orig";
}

// Returns the filename of the original image, given a `location` to said image.
function imageName(location) {
    const filename = location.pathname.split("/").pop();
    // Remove the ":orig" tag if Twitter is using the old URL format.
    return filename.replace(":orig", "");
}

// Saves the webpage/file being viewed as `filename`.
function download(filename) {
    let element = document.createElement("a");
    // The `download` attribute only works if `href` is set.
    element.href = location.href;
    element.download = filename;
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// View original image file.
const isOgImage = location.href.includes("orig");
if (!isOgImage) {
    location.assign(ogImageUrl(location));
}
// Add spacing between image and download button.
const image = document.getElementsByTagName("img")[0];
const spacing = document.createElement("p");
document.body.insertBefore(spacing, image);
// Add download button.
let button = document.createElement("button");
button.innerHTML = "Download";
button.onclick = () => void download(imageName(location));
document.body.insertBefore(button, spacing);
