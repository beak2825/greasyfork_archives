// ==UserScript==
// @name         Images from Google books preview
// @namespace    https://heterorrhina.in/
// @version      0.1
// @description  Provides a button to open an auto updating page containing only images from the book preview of Google books
// @author       Umesh Mohan
// @match        https://books.google.co.in/books*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12932/Images%20from%20Google%20books%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/12932/Images%20from%20Google%20books%20preview.meta.js
// ==/UserScript==
var imgsrcL, imgWindow, br, viewport, link;

function updateimgList() {
    var imgL = viewport.getElementsByTagName("img"), imgN, imgsrc, img;
    for (imgN in imgL) {
        imgsrc = imgL[imgN].src;
        if (imgsrc == undefined || imgsrc == "") {continue;}
        if (imgsrcL.indexOf(imgsrc) == -1) {
            imgsrcL.push(imgsrc);
            img = imgWindow.document.createElement("img");
            img.style.width = "100%";
            img.src = imgsrc;
            imgWindow.document.body.appendChild(img);
            imgWindow.document.body.appendChild(br);
        }
    }
}

function Refresh() {
    viewport = document.getElementById("viewport")
    viewport.addEventListener("DOMSubtreeModified",updateimgList,false);
    imgWindow = window.open();
    br = imgWindow.document.createElement("br");
    imgsrcL = [];
    updateimgList();
    imgWindow.document.title = document.title;
}

link = document.createElement("a");
link.innerHTML = "?";
link.style.cursor = "pointer";
link.onclick = Refresh;
document.getElementsByClassName("kd-appname")[0].appendChild(link);