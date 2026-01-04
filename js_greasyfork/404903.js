// ==UserScript==
// @name:pl         AsianSister.com Szybki podgląd na strone głównej
// @name:en         AsianSister.com Quick preview on homepage
// @name            AsianSister.com Quick preview on homepage
// @namespace       http://tampermonkey.net/
// @version         1.2
// @description:en  Allows to Quick preview image collections on Homepage
// @description:pl  Umożliwia szybki podgląd kolecji obrazów na stronie głównej
// @author          TheUnsleepingAlchemist
// @include         /https?:\/\/asiansister.com\/(tag.|search.|_page[0-9]?).+/
// @match           https://asiansister.com/
// @require         https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @grant           GM_addStyle
// @grant           GM_download
// @run-at          document-idle
// @noframes
// @description     Allows to Quick preview image collections on Homepage
// @downloadURL https://update.greasyfork.org/scripts/404903/AsianSistercom%20Quick%20preview%20on%20homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/404903/AsianSistercom%20Quick%20preview%20on%20homepage.meta.js
// ==/UserScript==

/* FileSaver.min.js
By Eli Grey
License: MIT
See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md */

/* jszip.min.js
By Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso
License: GPL version 3
See https://github.com/Stuk/jszip/blob/master/LICENSE.markdown */

(function() {
    'use strict';
    //adding necessary CSS
    GM_addStyle(`.viewCountBox {pointer-events: none} .downloadInput {left: 10px;top: 2px;position: absolute;} .inputHidden {pointer-events: none;display:none} .inputShowen {pointer-events: all}`)
    //init varables
    let collections = [],
        collectionsList = [],
        collectionsToDownload = [],
        downloaded = 0,
        collIndex = 0,
        images = document.querySelectorAll(".imageBox img:not(.vip_cover)"),
        currentId = 0,
        hidden = false, //set on "true" if you wanna hide checkboxs
        imageQuality = "lq", //imageQuality represent quality of presented image possible options are "lq" and "hq", the last one is not recommended if you haven't good network connection
        selectBtn = document.createElement("div"),
        downloadBtn = document.createElement("div"),
        downloadAllBtn = document.createElement("div");
    //adding some HTML for fun
    selectBtn.innerHTML = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,5V19H5V5H19M10,17L6,13L7.41,11.58L10,14.17L16.59,7.58L18,9" />
    </svg><div class="headerMenuSpace"></div><div class="headerMenuSpace"></div>Select for Download`;
    selectBtn.style = `position: relative;top: 60px;align-items: center;display: flex;`;
    selectBtn.classList.add("leftMenu");
    downloadBtn.innerHTML = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
    </svg><div class="headerMenuSpace"></div><div class="headerMenuSpace"></div>Download Selected`;
    downloadBtn.style = `position: relative;top: 60px;align-items: center;display: flex;`;
    downloadBtn.classList.add("leftMenu");
    downloadAllBtn.innerHTML = `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H8V4H20V16M16,20V22H4A2,2 0 0,1 2,20V7H4V20H16M18.53,8.06L17.47,7L12.59,11.88L10.47,9.76L9.41,10.82L12.59,14L18.53,8.06Z" />
    </svg><div class="headerMenuSpace"></div><div class="headerMenuSpace"></div>Download All`;
    downloadAllBtn.style = `position: relative;top: 60px;align-items: center;display: flex;`;
    downloadAllBtn.classList.add("leftMenu");
    document.getElementById("leftMenu").append(selectBtn,downloadAllBtn,downloadBtn)
    //adding events
    images.forEach(image => {
        image.addEventListener('mouseenter', enterImg);
        image.addEventListener('mousemove', hoverImg);
        image.addEventListener('mouseleave', leaveImg);
    })
    selectBtn.addEventListener("click", () => {
        hidden = false
        document.querySelector(".headerMenu").click();
        document.querySelectorAll(".downloadInput").forEach(el => {el.classList.remove("inputHidden");el.classList.add("inputShowen")});
    })
    downloadBtn.addEventListener("click",() => {
        document.querySelector(".headerMenu").click();
        downloaded = 0;
        collIndex = 0;
        let buttons = document.querySelectorAll(".downloadInput:checked");
        if (buttons.length === 0) return;
        buttons.forEach(button => collectionsToDownload.push(...collections.filter(el => el.id === +button.value)))
        buttons.forEach(button => {button.checked = false})
        if (hidden === true) document.querySelectorAll(".downloadInput").forEach(el => {el.classList.add("inputHidden");el.classList.remove("inputShowen")});
        let downloading = setInterval(function() {
            if (collIndex === collectionsToDownload.length) {
                clearInterval(downloading);
                collIndex = 0;
            }
            else {
                let collection = collectionsToDownload[collIndex].images,
                    id = collectionsToDownload[collIndex].id;
                downloadColl(collection,id)
                collIndex++;
            }
        }, 1000);
    })
    downloadAllBtn.addEventListener("click",() => {
        document.querySelector(".headerMenu").click();
        downloaded = 0;
        collIndex = 0;
        if ((collections.length === images.length) === false) return alert(`Wait until you see all the Checkmarks '✔' next to the number of views. Available ${collections.length} out of ${images.length}`);
        else {
            collectionsToDownload = collections
            let downloading = setInterval(function() {
                if (collIndex === collectionsToDownload.length) {
                    clearInterval(downloading);
                    collIndex = 0;
                }
                else {
                    let collection = collectionsToDownload[collIndex].images,
                        id = collectionsToDownload[collIndex].id;
                    downloadColl(collection,id)
                    collIndex++;
                }
            }, 1000);
        }
    })
    //scraping image from links
    document.querySelectorAll(".itemBox a").forEach((link,index) => {
        let xhr = new XMLHttpRequest();
        xhr.responseType = "document"
        collectionsList.push({collId: +link.href.match(/view_([0-9]+)_/)[1], id: index})
        xhr.addEventListener("load", function() {
            if (xhr.status === 200) {
                let request = xhr.response,
                    output = {id: +xhr.responseURL.match(/view_([0-9]+)_/)[1], images: []}
                request.querySelectorAll(".lazyload.showMiniImage").forEach(el => output.images.push(el.dataset.src))
                collections.push(output)
                let collId = collectionsList.filter(el => el.collId === output.id);
                if (collId.length === 1) document.querySelectorAll('.viewCountBox')[collId[0].id].innerHTML = `<input type="checkbox" class="downloadInput ${hidden === true? "inputHidden" : "inputShowen"}" value="${output.id}">  ✔  ${document.querySelectorAll('.viewCountBox')[collId[0].id].innerHTML}`
                if (collections.length === images.length) {collections.sort((a, b) => a.id < b.id ? 1 : -1); console.log(collections)}
            }
        });
        xhr.open("GET", link.href, true);
        xhr.send();
    })
    //functions
    function downloadColl(array,collectionTitle) {
        downloaded = 0;
        let zip = new JSZip();
        array.map((el, index) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `https://asiansister.com/${el.slice(0,-6)}.jpg`, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function(e) {
                if (this.status !== 200) return;
                zip.file(`image_${index + 1}.jpg`, xhr.response);
                downloaded++;
                if (downloaded === array.length) {
                    zip.generateAsync({type:"blob"})
                        .then(function(content) {
                        saveAs(content, `${collectionTitle}.zip`);
                    });
                }
            }
            xhr.send();
        })
    }
    function hoverImg(e) {
        let distance = e.clientY - this.y, //calculating distance from top
            id = collections.findIndex(el => el.id === currentId);
        if (id === -1) return;
        let step = this.height / collections[id].images.length, //calculating amount of steps
            target = Math.round(distance/step); //pointing single image
        if (collections.length > 0 && imageQuality === "hq") this.src = `https://asiansister.com/${collections[id].images[target].slice(0,-6)}.jpg`
        if (collections.length > 0 && imageQuality === "lq") this.src = `https://asiansister.com/${collections[id].images[target]}`
    }
    function enterImg() {
        currentId = +this.parentElement.parentElement.href.match(/view_([0-9]+)_/)[1]
    }
    function leaveImg() {
        currentId = 0;
        this.src = this.dataset.src;
    }
})();