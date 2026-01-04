// ==UserScript==
// @name         WikiArt Downloader
// @namespace    https://greasyfork.org/en/scripts/492666-wikiart-downloader
// @version      1.0
// @description  Add button to download full resolution images from WikiArt
// @author       CertifiedDiplodocus
// @match        https://www.wikiart.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikiart.org
// @grant        GM_addStyle
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/492666/WikiArt%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/492666/WikiArt%20Downloader.meta.js
// ==/UserScript==

/* PURPOSE: Adds a "download" button to WikiArt gallery, single painting, and fullscreen views.
    - Default filename from painting info.
    - To change the default formatting, edit the variable saveAsName in the function savePaintingAs() below.
    - Verbose logging for debugging purposes. Errors will always be logged.

LIST OF JSON ATTRIBUTES (e.g. painting.title):
    title, year, width, height, artistName,
    imageUrl      (key renamed from "image"),
    paintingUrl   (url on WikiArt, e.g. "/en/zdzislaw-beksinski/untitled-1972-0"),
    artistUrl     (on WikiArt, e.g. "/en/zdzislaw-beksinski")

----------------------------------------------------------------------------------------------------------------------
*/

(function() {
    'use strict';

    const enableVerboseLogging = false // set to 'true' for debugging purposes

    // Attempt to find paintings
    verboseLog ('Page loading. Starting to search for painting information...')
    let painting
    let paintingInfoDiv = document.querySelector ('div[ng-init^="paintingJson"]') // why doesn't this detect the gallery items? (which I appreciate, but...)
    let galleryOuterContainer = document.querySelector ('.masonry-content')

    if (!paintingInfoDiv && !galleryOuterContainer) {verboseLog ('No gallery or painting info found.'); return null} //    EXIT

    // Create download button in fullscreen mode
    const newButtonFullscreen = createButton ('a','download-button-fullscreen', downloadFromFullscreen);
    document.getElementsByClassName('sueprsized-navigation-panel-right')[0].appendChild(newButtonFullscreen); // typo in source code

    // Create download button on the main artwork page
    if (paintingInfoDiv) {
        verboseLog('Found div with painting information.')

        const newButtonStandard = createButton ('div', 'download-button-standard', downloadFromDetailedView)
        document.getElementsByClassName('fav-controls-wrapper')[0].appendChild (newButtonStandard)
    }

    if (galleryOuterContainer) {
        verboseLog ('Gallery found! Waiting for user to select a painting...');

        // On page load (before the user does anything) get the container and watch for paintings being added or removed
        let typeOfGallery = document.querySelector('.masonry-content').firstElementChild.getAttribute('ng-switch-when')
        let galleryContainer = getGalleryContainer ()
        if (galleryContainer) {
            createGalleryObserver()
        }

        // If the user switches between details / masonry / text views, identify and create an observer for the new gallery
        const galleryTypeObserver = new MutationObserver (galleryTypeChange)
        galleryTypeObserver.observe (galleryOuterContainer, {childList: true})

        function galleryTypeChange (mutations, galleryTypeObserver) {
            for (const mutation of mutations) {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.nodeType === 1) { // select elements, ignore comments
                        typeOfGallery = addedNode.getAttribute('ng-switch-when')
                        galleryContainer = getGalleryContainer ()
                        if (galleryContainer) {
                            createGalleryObserver()
                        }
                    }
                }
            }
        }

        function getGalleryContainer () {
            let galleryMasonryContainer = document.querySelector ('.wiki-masonry-container')
            let galleryDetailedContainer = document.querySelector('.wiki-detailed-container')
            switch (typeOfGallery) {
                case 'detailed':
                case 'masonry':
                    verboseLog (`A valid (${typeOfGallery}) gallery view was found.`);
                    return galleryMasonryContainer || galleryDetailedContainer;
                case 'text':
                    verboseLog ('Cannot download from gallery text view. Waiting for valid gallery type...');
                    return false;
                default:
                    console.error ('Could not evaluate the type of gallery.');
                    return null
            }
        }

        // If gallery items change...
        function createGalleryObserver() {
            const galleryObserver = new MutationObserver (galleryItemChanges)
            galleryObserver.observe (galleryContainer, {childList: true})
        }

        // ...create download buttons for each newly-added painting. Buttons are appended to a <div> with the painting's unique ID or JSON.
        function galleryItemChanges(mutations, galleryObserver) {
            let a = 0
            let r = 0
            let newGalleryItems = [] // empty array
            let classOfButtonParent
            typeOfGallery = document.querySelector('[ng-switch-when]').getAttribute('ng-switch-when')
            switch (typeOfGallery) {
                case 'masonry': classOfButtonParent = '.title-block'; break;
                case 'detailed': classOfButtonParent = '.wiki-layout-painting-info-bottom'; break;
            }

            // Select the added paintings (element type). Track removed paintings for debugging purposes.
            for (const mutation of mutations) {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.nodeType === 1) {
                        let buttonParent = addedNode.querySelector(classOfButtonParent)
                        newGalleryItems.push(buttonParent)
                        a++
                    }
                }
                for (const removedNode of mutation.removedNodes) {
                    if (removedNode.nodeType === 1) {r++}
                }
            }
            verboseLog (`Loading: removed ${r} paintings, added ${a} paintings.`)
            if (a > 0) { createButtonsInGallery(newGalleryItems) }
        }

        // Create download buttons in gallery view
        function createButtonsInGallery (galleryItemList) {
            verboseLog (`Created buttons in ${typeOfGallery} view.`)
            switch (typeOfGallery) {
                case 'masonry':
                    galleryItemList.forEach(item => {
                        const newButtonGallery = createButton ('div', 'download-button-gallery like-overlay', downloadFromGalleryMasonry)
                        item.appendChild (newButtonGallery)
                    })
                    break;
                case 'detailed':
                    galleryItemList.forEach(item => {
                        const newButtonGallery = createButton ('div', 'download-button-standard', downloadFromDetailedView)
                        item.querySelector('.fav-controls-wrapper').appendChild(newButtonGallery) // needs to be in the fav wrapper or it will not be clickable
                    })
            }
        }
    }

    // EVENT LISTENER HANDLERS  -------------------------------------------------------
    // 'this' = the 'buttonGallery' element (https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_value_of_this_within_the_handler)

    function downloadFromDetailedView() { // single and gallery modes
        parsePaintingJson (this.parentElement.parentElement)
        savePaintingAs()
    }

    function downloadFromGalleryMasonry() {
        let parentId = this.parentElement.id
        painting = {
            title: document.querySelector(`#${parentId} .artwork-name`).innerText,
            year: document.querySelector(`#${parentId} .artwork-year`).innerText,
            artistName: document.querySelector(`#${parentId} .artist-name`).innerHTML.trim().split('&nbsp;')[0],
            imageUrl: this.parentElement.parentElement.querySelector('img').src.split('!')[0]
        }
        savePaintingAs()
    }

    function downloadFromFullscreen() {
        painting = {
            title: document.querySelector('.supersized-slide-name').title,
            year: document.querySelector('span.year').innerText.slice(1).slice(0,-1), // remove the first and last characters: (1956) -> 1956
            artistName: document.querySelector('.supersized-slide-header').title,
            imageUrl: document.querySelector('.primary-image').src
        }
        savePaintingAs()
    }

    function parsePaintingJson (sourceDiv) {
        let initContent = sourceDiv.getAttribute('ng-init')
        let jsonString = initContent.match('paintingJson = ({.*?})')[1] //   clean up
        jsonString = jsonString.replace('"image" :','"imageUrl" :') //       better key name

        if (!jsonString || jsonString.length<=1) {console.error ("Could not extract JSON from the element."); return null} // EXIT
        verboseLog ('Extracted JSON string:', jsonString);

        try {
            painting = JSON.parse(jsonString);
            verboseLog (painting.title + ' - ' + painting.year + ' (' + painting.artistName + ')');
            verboseLog ('Painting information parsed and extracted!');
        } catch (e) {
            console.error ('Error parsing JSON:', e);
            alert ('There was an error parsing the painting information. Check the console for more details.');
        };
    }

    // When a download button is clicked, save URL with the default filename = ARTIST - TITLE (YEAR).EXT
    function savePaintingAs () {
        const imgExtension = painting.imageUrl.split('.').pop(); // pop() returns the last element from an array; in this case, the extension
        let saveAsName = `${painting.artistName} - ${painting.title} (${painting.year}).${imgExtension}`;
        saveAsName = decodeHTML(saveAsName); // handle special characters (í, ç etc)
        downloadImage(painting.imageUrl, saveAsName);
    }

    // FUNCTIONS AND STYLES ---------------------------------------------------------------

    // Create a button with an event listener
    function createButton (elementType, buttonClass, callbackFunctionName) {
        let newButton = document.createElement (elementType)
        newButton.className = buttonClass
        newButton.addEventListener ('click', callbackFunctionName, false)
        return newButton
    }

    // Check for HTML codes in text and convert to characters
    function decodeHTML (stringInput) {
        let txt = document.createElement("textarea");
        txt.innerHTML = stringInput;
        return txt.value;
    }

    // Save image using fetch (a workaround because Chrome and Firefox both block the "download" attribute for images on different domains)
    async function downloadImage(imageSrc, imageName) {
        const image = await fetch(imageSrc)
        const imageBlob = await image.blob()
        const imageURL = URL.createObjectURL(imageBlob)

        const link = document.createElement('a')
        link.href = imageURL
        link.download = imageName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    function verboseLog (textForConsole) {
        if (!enableVerboseLogging) {return null}
        console.log (textForConsole)
    }

    //--- Style newly-added button in CSS. Modify the page CSS to make room for the button (overwrite with !important flag).
    GM_addStyle ( `
    .download-button-fullscreen {
        display:block;
        height:40px;
        width:40px;
        background:url(https://upload.wikimedia.org/wikipedia/commons/8/8a/Download-icon.svg) center center no-repeat;
        margin:0 10px;
        cursor:pointer
    }
    .download-button-standard {
        display:block;
        height:40px;
        width:40px;
        position:absolute;
        right:0px;
        background:url(https://upload.wikimedia.org/wikipedia/commons/7/72/Download-icon-green.svg) center center no-repeat;
        background-size:24px;
        cursor:pointer
    }
    .download-button-gallery {
        left:calc(50% - 20px - 8px - 40px) !important;
        background:url(https://upload.wikimedia.org/wikipedia/commons/7/72/Download-icon-green.svg) center center no-repeat !important;
        background-size:24px !important;
        /*; background-color:#e9e9eb !important */
    }
    .wiki-masonry-container>li:hover .title-block .like-overlay.like-overlay-left {
        left:calc(50% - 20px) !important
    }
    .wiki-masonry-container>li:hover .title-block .like-overlay.like-overlay-right {
        left:calc(50% + 20px + 8px) !important
    }

    /* Fix weird formatting in gallery detailed view */
    .fav-controls-wrapper {
        width:120px !important
    }
    .copyright-wrapper {
        width:calc(100% - 120px) !important
    }
    .fav-controls-heart {
        top:0px !important
    }
    .fav-controls-folder {
        top:0px !important;
        right:40px !important
    }
    ` );

})();