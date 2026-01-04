// ==UserScript==
// @name:pl         AsianSister.com Maksymalna rozdzielczość obrazów (nieaktualny)
// @name:en         AsianSister.com image FullRes (outdated)
// @name            AsianSister.com image FullRes (outdated)
// @namespace       AsianSister.comImageFullRes
// @version         2.5
// @description:en  Sets full image resolution without redirect, also allow download image in full resolution
// @description:pl  Zmienia rozdzielczość zdjęć na pełną, pozwala rówież na pobieranie zdjęć
// @author          TheUnsleepingAlchemist
// @match           https://asiansister.com/view_*
// @require         https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @grant           GM_addStyle
// @grant           GM_download
// @run-at          document-idle
// @noframes
// @description Sets full image resolution without redirect, also allow download image in full resolution on page load
// @downloadURL https://update.greasyfork.org/scripts/401546/AsianSistercom%20image%20FullRes%20%28outdated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401546/AsianSistercom%20image%20FullRes%20%28outdated%29.meta.js
// ==/UserScript==

/* FileSaver.min.js
By Eli Grey
License: MIT
See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md */

/* jszip.min.js
By Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso
License: GPL version 3
See https://github.com/Stuk/jszip/blob/master/LICENSE.markdown */

(function () {
    "use strict";
    GM_addStyle(`
.downloadButtons {width:100%;display:flex;justify-content:space-between;}
.downloadButton {width:48%;border:none;border-radius:4px;font-size:25px;position:relative;height:70px;background-color:#404040;color:#dddddd;cursor:pointer;transition:all 150ms;}
.downloadButton:hover {background-color:#505050;}
.showMiniImage {width:auto;max-width:100%;height:auto;margin:0 auto;}
.imgContainer {padding:20px;width:90vw;display:flex;flex-wrap:wrap;flex-direction:column;justify-content:center;align-items:center;}
`)
    // init var
    let reg = /_t.jpg/i,
        images = document.querySelectorAll(".showMiniImage"),
        arrayOfImages = [],
        downloaded = 0,
        downloadButtons = document.createElement("div"),
        db = document.createElement("button"),
        dbzip = document.createElement("button"),
        collectionTitle = document.querySelector(".second_contant > center > h1").innerText;
    // manipulating the DOM
    db.id = "db";
    db.innerText = "Download";
    db.classList.add("downloadButton");
    dbzip.id = "dbzip";
    dbzip.innerText = "Download Zip";
    dbzip.classList.add("downloadButton");
    downloadButtons.append(db,dbzip);
    downloadButtons.classList.add("downloadButtons");
    document.querySelector(".second_contant").append(downloadButtons);
    document.querySelectorAll(".rootContant")[1].classList.add("imgContainer");
    images.forEach((image) => {
        if (image.dataset.src.match(reg)) {
            image.src = `https://asiansister.com/${image.dataset.src.slice(0,-6)}.jpg`;
        }
        if (!image.classList.contains("loaded")) {
            image.classList.add("loaded")
            image.setAttribute("data-was-processed", true);
        }
        image.removeAttribute("onclick");
        arrayOfImages.push(`https://asiansister.com/${image.dataset.src.slice(0,-6)}.jpg`);
    })
    // reseting scroll position
    setTimeout(function(){
        document.documentElement.scrollTop = 0;
    }, 1);
    // adding events
    db.addEventListener("click", () => {
        downloaded = 0;
        let downloading = setInterval(function() {
            if (downloaded === arrayOfImages.length) {
                clearInterval(downloading);
                downloaded = 0;
            }
            else {
                GM_download(arrayOfImages[downloaded], `${collectionTitle}_${downloaded + 1}.jpg`)
                downloaded++;
            }
        }, 100);
    })
    dbzip.addEventListener("click", () => {
        downloaded = 0;
        let zip = new JSZip();
        arrayOfImages.map((el, index) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', el, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function(e) {
                if (this.status !== 200) return;
                zip.file(`${document.querySelector(".second_contant > center > h1").innerText}_${index + 1}.jpg`, xhr.response);
                downloaded++;
                if (downloaded === arrayOfImages.length) {
                    zip.generateAsync({type:"blob"})
                        .then(function(content) {
                        saveAs(content, `${collectionTitle}.zip`);
                    });
                }
            };
            xhr.send();
        })
    })
    window.addEventListener('scroll', () => {
        document.querySelector("#desktopScroll").classList.remove("desktopTopMenu2");
        document.querySelector("#desktopScroll").classList.add("desktopTopMenu1")
    });
    console.log(collectionTitle,images.length)
}());