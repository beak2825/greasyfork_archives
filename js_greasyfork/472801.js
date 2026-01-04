// ==UserScript==
// @name         Lezhin Comics Downloader
// @namespace    lezhin-comics-scraper
// @version      1.1.1
// @description  Scrape a full lezhin chapter. Creates a zip with PNGs
// @author       TzurS11
// @match        https://www.lezhinus.com/*
// @match        https://www.lezhin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lezhinus.com
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472801/Lezhin%20Comics%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/472801/Lezhin%20Comics%20Downloader.meta.js
// ==/UserScript==

(function() {
    async function getImageSrcFromElement(imageElementString,index) {
        // Create a temporary div element to hold the image element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = imageElementString;

        // Find the image element within the temporary div
        const imageElement = tempDiv.querySelector('img');

        if (imageElement) {
            const imageUrl = imageElement.src;

            try {
                await timeout(500);
                const response = await fetch(imageUrl);
                const blob = await response.blob();

                // Create a temporary anchor element to trigger the download
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = `image-${index}.jpg`;
                downloadLink.style.display = 'none';

                return downloadLink;
            } catch (error) {
                return false;
            }
        } else {
            return false
        }
    }



    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    function downloadImagesAsZip(anchorElements) {
        const zip = new JSZip();

        const promises = Array.from(anchorElements).map((anchor, index) => {
            const url = anchor.href;
            return fetch(url)
                .then(response => response.blob())
                .then(blob => {
                const filename = `image_${index + 1}.jpg`; // Customize the filename as needed
                zip.file(filename, blob);
            });
        });

        Promise.all(promises)
            .then(() => {
            return zip.generateAsync({ type: 'blob' });
        })
            .then(zipBlob => {
            let pathNames = window.location.pathname.split('/');
            const zipFilename = `${pathNames[3]} ${pathNames[4]}.zip`;
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = zipFilename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
            .catch(error => {
            console.error('Error:', error);
        });
    }

    function waitForImgInDiv(targetDiv) {
        return new Promise(resolve => {

            if (!(targetDiv instanceof HTMLDivElement)) {
                resolve(false);
                return;

            }

            // Check if there's already an <img> element inside the div
            if (targetDiv.querySelector('img')) {
                resolve(true);
                return;
            }

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof HTMLImageElement && node.tagName === 'IMG') {
                            observer.disconnect(); // Stop observing once an <img> is added
                            resolve(true);
                            return;
                        }
                    });
                });
            });

            const config = { childList: true, subtree: true };
            observer.observe(targetDiv, config);

            let skip = setTimeout(async () => {
                observer.disconnect(); // Disconnect the observer
                resolve(true); // Resolve with true after the timeout
            }, 1000);
        });
    }


    function waitForDivChanges(divId) {
        return new Promise(resolve => {
            const targetDiv = document.getElementById(divId);

            if (!targetDiv) {
                console.error(`Element with ID "${divId}" not found.`);
                resolve(false);
                return;
            }

            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'attributes' || mutation.type === 'characterData') {
                        resolve(true);
                        observer.disconnect();
                    } else if (mutation.type === 'childList') {
                        for (const addedNode of mutation.addedNodes) {
                            if (addedNode instanceof HTMLElement && addedNode.id === divId) {
                                resolve(true);
                                observer.disconnect();
                                return;
                            }
                        }
                    }
                });
            });

            const config = { attributes: true, childList: true, characterData: true, subtree: true };
            observer.observe(targetDiv, config);
        });
    }

    let pathNames = window.location.pathname.split('/');
    if(pathNames[2] == "comic"){
        waitForDivChanges("scroll-list").then(x=>{
            let button = document.createElement("button");
            button.innerHTML = "Download Chapter";
            button.style.position = "fixed";
            button.style.bottom = 0
            button.style.zIndex = 10000;
            button.style.fontSize = "30px"
            button.style.marginLeft = "10px"
            button.id = "DownloadButton"
            button.onclick=function(){downloadChapter()}
            document.body.appendChild(button);
        })
    }



    let scrollList = document.getElementById("scroll-list");
    if(scrollList != null){
        if(localStorage.getItem("firstTime") == null){
            localStorage.setItem("firstTime", "no")
            alert("To use the Lezhin downloader wait for a button to appear on the bottom left corner and press it. This alert will not appear again.")
        }
    }

    async function downloadChapter(){
        let downloadButton= document.getElementById("DownloadButton");
        downloadButton.innerHTML = "Scraping..."
        downloadButton.disabled = true;
        let elements = []
        if(scrollList == null){
            alert("You are not viewing a chapter");
            return;
        }
        let descendents = scrollList.getElementsByTagName('*');
        let imgLen = descendents.length;
        for (let i = 0; i < descendents.length; ++i) {
            downloadButton.innerHTML = `Scraping... (${i+1}/${imgLen})`
            let element = descendents[i];
            element.scrollIntoView();
            await waitForImgInDiv(element)
            let image = element.innerHTML;
            //await timeout(500);
            let res = await getImageSrcFromElement(image,i);
            if (res != false){
                elements.push(res)
                //console.log(i+1 + "/" + imgLen)
            }
        }
        //console.log("creating zip")
        downloadImagesAsZip(elements)
        downloadButton.innerHTML = "Download Chapter";
        downloadButton.disabled = false;
    }
})();