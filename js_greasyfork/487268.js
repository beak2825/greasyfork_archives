// ==UserScript==
// @name Reddit image-preview / gallery fixer (old and new)
// @description For both the "new" and "old" reddit, allows the image previews to be set to almost be fullscreen (so that the images are big but fit within your screen).
// @match https://www.reddit.com/*
// @match https://old.reddit.com/*
// @version 1.0.1
// @namespace https://greasyfork.org/users/1260957
// @downloadURL https://update.greasyfork.org/scripts/487268/Reddit%20image-preview%20%20gallery%20fixer%20%28old%20and%20new%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487268/Reddit%20image-preview%20%20gallery%20fixer%20%28old%20and%20new%29.meta.js
// ==/UserScript==


(function() {

    // Sets the height to 900px. Choose a height that fits well within your screen. I have a 1440 vertical resolution, and 900px works well for me (it fits almost the full screen).

    // for the new reddit
    const style = document.createElement('style');
    style.textContent = `

          /* for the new reddit */
          figure > div, figure > div > img, figure > a > div, figure > a > div > img { height:900px; width:auto; }
          figure > a > div > div { display:none;}


          /* for the old reddit */
          div.media-preview-content:not(.gallery-tile-content) img.preview { height:900px; width:auto;}
          div.media-preview { max-width:100% !important;}
      `;
    document.head.appendChild(style);

    document.querySelector('div[style="height:700px"]').setAttribute("style", "height:900px; width:auto;");


})();