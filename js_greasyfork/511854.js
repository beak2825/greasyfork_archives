// ==UserScript==
// @name        Reddit image de-framer
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/media*
// @require     https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.7/viewer.js
// @resource    customCSS https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.7/viewer.css
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @version     1.02
// @author      ape-that-presses-keys
// @license     MIT
// @description Removes the frame from reddit images and replaces it with a minimalist image viewer.
// @downloadURL https://update.greasyfork.org/scripts/511854/Reddit%20image%20de-framer.user.js
// @updateURL https://update.greasyfork.org/scripts/511854/Reddit%20image%20de-framer.meta.js
// ==/UserScript==

// add the image viewer source files to the page
var customCSS = GM_getResourceText("customCSS");
GM_addStyle(customCSS);

// replace the body with the elements needed for the image viewer
let image_url = document.querySelector("zoomable-img > img").src;
document.body.innerHTML = `
<div style="
    background-color: #282828;
    height: 100%;
    width: 100%;
    position: fixed;"
></div>
<div>
    <img id="image" src="${image_url}" alt="Picture">
</div>
`;

// setup and show the viewer
const viewer = new Viewer(document.getElementById('image'), {
    backdrop: false,
    button: false,
    navbar: false,
    title: false,
    toolbar: false,
    initialCoverage: 1.0,
    inline: false,
    rotatable: false,
    scalable: false,
    zoomable: true
});
viewer.show();

// image has been shown and viewed in the viewer
let i = document.querySelector("#image");
i.style.display = "none";
