// ==UserScript==
// @name         HITOMI GALLERY PAGE LOADER
// @namespace    https://greasyfork.org
// @version      2024-10-06
// @description  script for loading pages inside galleries on hitomi.la
// @author       qwertybot
// @match        https://hitomi.la/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511631/HITOMI%20GALLERY%20PAGE%20LOADER.user.js
// @updateURL https://update.greasyfork.org/scripts/511631/HITOMI%20GALLERY%20PAGE%20LOADER.meta.js
// ==/UserScript==

(function() {
    'use strict';
let pageNum = 1;
let intervalId;
let isPaused = false;
let isCodeExecuted = false;


if (window.location.href.endsWith('.html#1')) {

    function createOriginalThumbnailContainer() {
        let originalThumbnailList = document.querySelector('ul.thumbnail-list');


        let originalContainer = document.createElement('div');
        originalContainer.appendChild(originalThumbnailList.cloneNode(true));


        document.querySelector('div.simplePagerContainer').appendChild(originalContainer);
    }


    function loadNextPage() {
        if (isPaused) return;


        let nextPageSelector = 'li.simplePageNav' + (pageNum + 1) + ' a';
        let nextLink = document.querySelector(nextPageSelector);


        if (nextLink) {

            nextLink.click();


            pageNum++;


            setTimeout(() => {

                let newThumbnailList = document.querySelector('ul.thumbnail-list');


                if (newThumbnailList) {

                    let galleryContainer = document.createElement('div');
                    galleryContainer.appendChild(newThumbnailList.cloneNode(true));


                    document.querySelector('div.simplePagerContainer').appendChild(galleryContainer);
                }
            }, 1000);
        } else {
            console.log('No next page. Hide original thumbnail-list and stop.');
            document.querySelector('ul.thumbnail-list').style.display = 'none';
            clearInterval(intervalId);
        }
    }


    function togglePause() {
        isPaused = !isPaused;
        const pauseButton = document.getElementById('pause-button');
        pauseButton.innerText = isPaused ? 'Continue' : 'Pause';
    }


    function createPauseButton() {
        const pauseButton = document.createElement('button');
        pauseButton.id = 'pause-button';
        pauseButton.innerText = 'Pause';
        pauseButton.style.position = 'fixed';
        pauseButton.style.top = '10px';
        pauseButton.style.right = '10px';
        pauseButton.style.zIndex = '9999';
        pauseButton.style.padding = '10px 15px';
        pauseButton.style.backgroundColor = '#ff5722';
        pauseButton.style.color = '#fff';
        pauseButton.style.border = 'none';
        pauseButton.style.borderRadius = '5px';
        pauseButton.style.cursor = 'pointer';
        pauseButton.addEventListener('click', togglePause);
        document.body.appendChild(pauseButton);
    }


    createOriginalThumbnailContainer();
    createPauseButton();


    isCodeExecuted = true;


    intervalId = setInterval(loadNextPage, 1500);
} else {
    console.log('Wrong page, script on pause.');
}
})();