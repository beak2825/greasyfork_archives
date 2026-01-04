// ==UserScript==
// @name         MafiaBlackboxes
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Hides the stupid FIIM spoilers by mercilessly covering them with black boxes. Tested in Chrome and Firefox on YouTube and Twitch.
// @author       Kirill Khazan <kirillkh@gmail.com>
// @match        https://*.youtube.com/*
// @match        https://youtube.com/*
// @match        https://*.youtube.com/*
// @match        https://*.youtu.be/*
// @match        https://youtu.be/*
// @match        https://*.twitch.tv/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487514/MafiaBlackboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/487514/MafiaBlackboxes.meta.js
// ==/UserScript==

(function() {
    //    'use strict';
    var debounceData = {};
    var bbUninstallers = [];
    var tbUninstallers = [];
    var nAttempts = 0;

    function updateOnBoxEvents(uninstallers, fupdate) {
        // Function to update the black box when the video box is resized
        const video = document.querySelector('video');
        if(video == null) {
            return;
        }

        // Monitor changes in the video box size using ResizeObserver
        const resizeObserver = new ResizeObserver(() => {
            fupdate();
        });
        resizeObserver.observe(video);
        resizeObserver.observe(video.parentElement);
        uninstallers.push(() => resizeObserver.disconnect());

        const scrollHandler = () => {
            //console.log("win scrolled");
            fupdate();
        };
        window.addEventListener('scroll', scrollHandler);
        uninstallers.push(() => window.removeEventListener('scroll', scrollHandler));


        const intersectionObserver = new IntersectionObserver(fupdate, {
            root: null,
            threshold: buildThresholdList(),
        });
        intersectionObserver.observe(video);
        uninstallers.push(() => intersectionObserver.disconnect());
    }


    function videoDimensions(video) {
        // Ratio of the video's intrisic dimensions
        var videoRatio = video.videoWidth / video.videoHeight;
        // The width and height of the video element
        var width = video.offsetWidth, height = video.offsetHeight;
        // The ratio of the element's width to its height
        var elementRatio = width/height;
        // If the video element is short and wide
        if(elementRatio > videoRatio) width = height * videoRatio;
        // It must be tall and thin, or exactly equal to the original ratio
        else height = width / videoRatio;
        return {
            width: width,
            height: height
        };
    }

    function removeBlackBox(boxId) {
        const existingBlackBox = document.getElementById(boxId);
        if (existingBlackBox) {
            existingBlackBox.remove();
        }
    }

    function buildThresholdList() {
        let thresholds = [];
        let numSteps = 2000;

        for (let i = 1.0; i <= numSteps; i++) {
            let ratio = i / numSteps;
            thresholds.push(ratio);
        }

        thresholds.push(0);
        return thresholds;
    }

    function enableBlackBoxes() {
        console.log('enableBlackBoxes');
        bbEnabled = 1;

        function _updateBoxPosition(boxId, topRatio, leftRatio, widthRatio, heightRatio) {
            const blackBox = document.getElementById(boxId);
            if (!blackBox) {
                return;
            }

            console.log('updateBoxPosition');

            const video = document.querySelector('video'); // Selecting the video element on the page
            const videoBox = video.getBoundingClientRect();

            const actual = videoDimensions(video);
            const innerOffsetLeft = video.offsetLeft + (videoBox.width - actual.width) / 2;
            const innerOffsetTop = video.offsetTop + (videoBox.height - actual.height) / 2;

            //console.log(`VVV ${videoBox.top}, ${videoBox.left}, ${videoBox.height}, ${videoBox.width}, `);
            blackBox.style.position = 'absolute';
            blackBox.style.backgroundColor = 'black';
            blackBox.style.opacity = '1';

            blackBox.style.top = `${innerOffsetTop + actual.height * topRatio}px`;
            blackBox.style.left = `${innerOffsetLeft + actual.width * leftRatio}px`;
            blackBox.style.width = `${actual.width * widthRatio}px`;
            blackBox.style.height = `${actual.height * heightRatio}px`;

            blackBox.style.pointerEvents = 'none'; // To allow clicks to pass through
            blackBox.style.zIndex = '2'; // Ensure it's above other elements
        }

        var debounceData = {};

        function debounce(fn, boxId, ms = 0) {
            return function(...args) {
                const exec = function() {
                    delete debounceData[boxId];
                    fn.apply(this, args);
                };

                clearTimeout(debounceData[boxId]);
                debounceData[boxId] = setTimeout(() => exec(), ms);
            };
        }

        function updateBoxPosition(boxId, topRatio, leftRatio, widthRatio, heightRatio) {
            console.log(`debounce updateBoxPosition ${boxId}`);
            debounce(_updateBoxPosition, boxId, 30)(boxId, topRatio, leftRatio, widthRatio, heightRatio);
        }


        function createBlackBox(boxId, topRatio, leftRatio, widthRatio, heightRatio) {
            const video = document.querySelector('video'); // Selecting the video element on the page

            // Remove any existing black box
            removeBlackBox(boxId);

            var playerControls = document.querySelector('.ytp-chrome-bottom') || document.querySelector('.player-controls');
            playerControls.style.zIndex = '99'

            const blackBox = document.createElement('div');
            blackBox.id = boxId;

            updateBoxPosition(boxId, topRatio, leftRatio, widthRatio, heightRatio);
            //document.getElementsByClassName('video-stream html5-main-video')[0].parentElement.appendChild(blackBox);

            video.parentElement.appendChild(blackBox);
            //document.body.appendChild(blackBox);
        }

        function manageBlackBox(boxId, topRatio, leftRatio, widthRatio, heightRatio) {
            // Call the function to initially create the black box
            createBlackBox(boxId, topRatio, leftRatio, widthRatio, heightRatio);
            // Call the function to update the black box on video box resize
            // updateBlackBoxOnEvents();
            updateOnBoxEvents(bbUninstallers, () => updateBoxPosition(boxId, topRatio, leftRatio, widthRatio, heightRatio));
        }

        manageBlackBox('bottomBlackBox', 0.75, 0, 1, 0.25);
        manageBlackBox('topLeftBlackBox', 0, 0, 0.2, 0.16);
        manageBlackBox('topTopBlackBox', 0, 0, 0.65, 0.08);
        manageBlackBox('rightBlackBox', 0, 0.85, 0.15, 0.25);
    }



    function disableBlackBoxes() {
        bbEnabled = false;
        console.log('disableBlackBoxes');
        removeBlackBox('bottomBlackBox');
        removeBlackBox('topLeftBlackBox');
        removeBlackBox('topTopBlackBox');
        removeBlackBox('rightBlackBox');

        for (var boxId in Object.keys(debounceData)) {
            clearTimeout(debounceData[boxId]);
            delete debounceData[boxId];
        }

        bbUninstallers.forEach((u) => u());
        bbUninstallers = [];
    }


    var bbEnabled = false;
    function toggleBlackBoxes() {
        const button = document.getElementById('bbToggleButton');
        if(bbEnabled){
            disableBlackBoxes();
            //button.style.opacity = 0;
            button.textContent = 'Hide roles';
        } else {
            enableBlackBoxes();
            //button.style.opacity = 1;
            button.textContent = 'Show roles';
        }
    }

    function updateToggleButton() {
        console.log("updToggleButton");
        const video = document.querySelector('video');
        const button = document.getElementById('bbToggleButton');
        const videoBox = video.getBoundingClientRect();
        const actual = videoDimensions(video);
        const innerOffsetLeft = video.offsetLeft + (videoBox.width - actual.width) / 2;
        const innerOffsetTop = video.offsetTop + (videoBox.height - actual.height) / 2;

        //console.log(`VVV ${videoBox.top}, ${videoBox.left}, ${videoBox.height}, ${videoBox.width}, `);
        //console.log(`ZZZ ${innerOffsetTop}, ${actual.height}`);
        //console.log(`ZZZ ${video.offsetTop}, ${videoBox.height}, ${actual.height}`);
        //button.style.top = `${innerOffsetTop + 5}px`;
        if(video.offsetTop < 0) {
            button.style.top = `${videoBox.height * 0.05}px`;
            button.style.left = `px`;
        } else {
            button.style.top = `${innerOffsetTop + actual.height * 0.05}px`;
            button.style.left = `${innerOffsetLeft + 5}px`;
        }
    }

    function createToggleButton() {
        const video = document.querySelector('video');
        console.log(`YYY video is OK`);

        const button = document.createElement('button');
        button.id = 'bbToggleButton';
        button.textContent = 'Hide roles';
        button.style.cssText = `
            position: absolute;
            background-color: green;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: opacity 0.2s ease-in-out;
            z-index: 200;
            opacity: 0;
            top: 5;
            left: 5;
            width: 200px;
            height: 80px;
            text-align: center;
        `;

        video.parentElement.appendChild(button);

        button.addEventListener('mouseover', () => {
            button.style.opacity = 1;
        });

        button.addEventListener('mouseout', () => {
            //button.style.opacity = bbEnabled ? 1 : 0;
            button.style.opacity = 0;
        });

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
            event.preventDefault();
            toggleBlackBoxes();
            return false;
        });

        updateToggleButton();
    }

    function manageToggleButton() {
        const video = document.querySelector('video');
        if(video == null) {
            //console.log(`XXX video == null; ${document.body.childElementCount}`);
            if(nAttempts++ < 1000) {
                setTimeout(() => manageToggleButton(), 50);
            }
            return;
        }

        console.log(`YYY video is OK`);

        createToggleButton();
        updateOnBoxEvents(tbUninstallers, updateToggleButton);
    }

    function removeToggleButton() {
        const existingButton = document.getElementById('bbToggleButton');
        if (existingButton) {
            existingButton.remove();
        }
        tbUninstallers.forEach((u) => u());
        tbUninstallers = [];
    }

    const observeUrlChange = () => {
        let oldHref = document.location.href;
        const body = document.querySelector("body");
        const observer = new MutationObserver(mutations => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                console.log('LOADDDDD');
                nAttempts = 0;
                disableBlackBoxes();
                removeToggleButton();
                manageToggleButton();
            }
        });
        observer.observe(body, { childList: true, subtree: true });
    };

    //window.onload = observeUrlChange;
    observeUrlChange();

    manageToggleButton();
})();
