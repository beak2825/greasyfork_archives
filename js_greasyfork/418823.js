// ==UserScript==
// @name         Image File Viewer
// @namespace    https://greasyfork.org/zh-CN/scripts/418823-image-file-viewer
// @version      0.2
// @description  open image file with viewer.min.js
// @description:zh  用viewer.min.js打开图片(本地,网络)
// @match             *://*/*.jpg
// @match             *://*/*.png
// @grant        GM_addStyle
// @require    https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.8.0/viewer.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/418823/Image%20File%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/418823/Image%20File%20Viewer.meta.js
// ==/UserScript==

(function(){
    GM_addStyle("body{overflow: hidden}");

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.8.0/viewer.min.css";
    document.getElementsByTagName("head")[0].appendChild(link);

    var img = document.getElementsByTagName('img');
    if(img.length === 0) return;
    img[0].hidden = true;

    const viewer = new Viewer(img[0], {
        inline: true,
      button:false,
      tooltip:false,
        backdrop: false,
        toolbar: {
            zoomIn: 4,
            zoomOut: 4,
            oneToOne: 4,
            reset: 4,
            prev: 0,
            play: {
                show: 0,
                size: 'large',
            },
            next: 0,
            rotateLeft: 4,
            rotateRight: 4,
            flipHorizontal: 4,
            flipVertical: 4,
        },
        title: 0,
        navbar: 0,
        //    minWidth: ,
        //    minHeight: ,
        viewed() {
        },
    });
})();