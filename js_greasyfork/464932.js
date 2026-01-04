// ==UserScript==
// @name         Gyazo Metadata Download
// @namespace    http://greasyfork.org
// @license      MIT
// @version      0.3
// @description  Download JPEG from Gyazo with Metadata
// @author       drlivog
// @match        https://*gyazo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gyazo.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/piexifjs/1.0.6/piexif.min.js
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/464932/Gyazo%20Metadata%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/464932/Gyazo%20Metadata%20Download.meta.js
// ==/UserScript==

// jshint esversion: 11
/* globals piexif */

var count=0; //set to -1 to not reload
const limit = 10 //set to NaN to keep checking if button can be added
const delay = 200;

GM.registerMenuCommand("Download Image", downloadImage, "D");

(function() {
    'use strict';
    //addDownloadBtn();
    /*
    window.onload = () => {
        new MutationObserver(mutations => mutations.forEach( () => oldHref !== document.location.href && (oldHref = document.location.href, count=0, addDownloadBtn())))
            .observe(document.querySelector("body"), { childList: true, subtree: true });
    };
    */
    window.onload = () => {
        new MutationObserver(mutations => mutations.forEach( () => (addDownloadBtn())))
            .observe(document.querySelector('body'), { childList: true, subtree: true });
    };
})();

function addDownloadBtn() {
    if (!document.location.href.includes("gyazo") || document.querySelector('#mydownloadbtn')) return; //not on gyazo or downloadbtn already added
    var imageactionbtngroup = document.querySelector('.images-show .explorer-action-btn-group');
    if (imageactionbtngroup) {
        var aElem = document.createElement('a');
        var nodeClass = document.querySelector('a[role="button"].explorer-action-btn')?.getAttribute("class");
        aElem.setAttribute('class', nodeClass);
        aElem.setAttribute('role',"button");
        aElem.setAttribute('id', "mydownloadbtn");
        //aElem.setAttribute('href', "javascript:void(0)");
        aElem.setAttribute('data-for', "tooltip-dafsdfadfasdf");
        aElem.onmouseenter = function() {
            document.getElementById('tooltip-dafsdfadfasdf').classList.add("show");
        }
        aElem.onmouseleave = function() {
            document.getElementById('tooltip-dafsdfadfasdf').classList.remove("show");
        }
        aElem.onclick = downloadImage;
        var svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElem.setAttribute('class',"kamon");
        var useElem = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        useElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/dist/sprite.3ab2174c1f1191749c1bc29d10d4cf95.svg#arrow-down-rect-usage');
        var divElem = document.createElement("div");
        nodeClass = document.querySelector('.__react_component_tooltip')?.getAttribute("class");
        divElem.appendChild(document.createTextNode("Download"));
        divElem.setAttribute('id',"tooltip-dafsdfadfasdf");
        divElem.setAttribute('class', nodeClass);
        divElem.setAttribute('data-id', "tooltip");
        divElem.setAttribute('style', "left: 1020px; top: 41px;");
        svgElem.appendChild(useElem);
        aElem.appendChild(svgElem);
        imageactionbtngroup.prepend(divElem);
        imageactionbtngroup.prepend(aElem);
    }
}

async function downloadImage() {
    var imgsrc = document.querySelector('.image-viewer')?.src;
    if (imgsrc == null || imgsrc == undefined) {
        console.log("Cannot find image");
        alert("Cannot find image!");
        return;
    }
    var data = document.querySelector('div.preload-data')?.dataset?.value || null;
    var date, user, desc, title, app, id;
    id = document.location.href.match(/gyazo\.com\/(.*)/i)[1];
    if (data != null) {
        data = JSON.parse(data);
        if (data.id === id) { //use the page loaded data if it matches
            console.log("Use pre-loaded data");
            date = new Date(data?.created_at) || new Date();
            user = data?.user?.name || "";
            desc = data?.desc || "";
            title = data?.metadata?.title || "";
            app = data?.metadata?.app || "";
        } else {
            console.log("Use page data");
            date = new Date(document.querySelector('.date')?.innerText) || new Date();
            user = document.querySelector('.owner-name')?.innerText || "";
            desc = document.querySelector('.image-desc-display')?.innerText || "";
            if (desc === "Type a description for search") {
                desc = "";
            }
            title = document.querySelector('.source')?.innerText || "";
            app = document.querySelector('div.captured-info-row:nth-child(3) > div:nth-child(2) > a:nth-child(1)')?.innerText || "";
        }
        console.log(`Date: ${date} User: ${user} Desc: ${desc} Title: ${title} App: ${app}`);
    }
    var imgdata = {
        'id': id,
        'date': date,
        'user': user,
        'desc': desc,
        'title': title,
        'app': app
    }
    fetchImage(imgsrc, imgdata);
}

async function fetchImage(imgsrc, data) {
    var canvas = document.createElement('canvas');
    fetch(imgsrc)
    .then((response) => response.blob())
    .then((blob) => createImageBitmap(blob))
    .then((imgbmp) => {
        canvas.width = imgbmp.width;
        canvas.height = imgbmp.height;
        canvas.getContext("2d",{alpha: false}).drawImage(imgbmp, 0, 0);
        canvas.toBlob( async (blob) => {
            var jpegtag = await addTagsToJpeg(blob, data);
            //console.log(base64);
            downloadFileFromBlob(jpegtag, data?.id || data?.title, data?.date);
        },"image/jpeg", 1);
    });
    canvas.remove();
}

const blobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
});

const base64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

async function addTagsToJpeg(jpeg, data) {
    var useBlob;
    if (useBlob = jpeg instanceof Blob) {
        jpeg = await blobToBase64(jpeg);
    }
    var zeroth = {};
    var exif = {};

    zeroth[piexif.ImageIFD.Artist] = data?.user || "";
    zeroth[piexif.ImageIFD.ImageDescription] = data?.title || "";
    zeroth[piexif.ImageIFD.ImageID] = data?.id || "";
    if (data?.date) {
        var date = data.date;
        var datestr = `${date.getFullYear()}:${(""+(date.getMonth()+1)).padStart(2,"0")}:${(""+date.getDate()).padStart(2,"0")} ${(""+date.getHours()).padStart(2,"0")}:${(""+date.getMinutes()).padStart(2,"0")}:${(""+date.getSeconds()).padStart(2,"0")}`;
        zeroth[piexif.ImageIFD.DateTime] = datestr;
        zeroth[piexif.ImageIFD.PreviewDateTime] = datestr;
        exif[piexif.ExifIFD.DateTimeOriginal] = datestr;
        exif[piexif.ExifIFD.DateTimeDigitized] = datestr;
    }
    exif[piexif.ExifIFD.UserComment] = data?.desc || "";
    var exifObj = {"0th":zeroth, "Exif":exif};
    var exifStr = piexif.dump(exifObj);
    jpeg = piexif.insert(exifStr, jpeg);
    if (useBlob) {
        jpeg = base64toBlob(jpeg.split(',')[1], "image/jpeg");
    }
    return jpeg;
}

function downloadFileFromBlob(blob, name, date=null) {
    name = name || "My Image";
    var file = new File([blob], "myimage", {lastModified: date==null?Date.now():date.getTime(), type: "image/jpeg"});
    var a = document.createElement('a');
    a.download = name;
    a.href = URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(file);
}