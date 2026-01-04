// ==UserScript==
// @name         AniWave QoL
// @namespace    https://greasyfork.org/en/users/1262395-grinnch
// @version      1.2
// @description  Moves episode list under player, auto expands player, auto 1080p (requires CORS), removes some unnecessary stuff, other UI changes.
// @author       grinnch
// @license      MIT
// @match        https://aniwave.to/*
// @icon         https://cdn2.steamgriddb.com/icon_thumb/21b203a02c91d5272135dbbebe6afc00.png
// @downloadURL https://update.greasyfork.org/scripts/487503/AniWave%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/487503/AniWave%20QoL.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    function waitForElement(selector, baseElement = document.body) {
        return new Promise(resolve => {
            if (baseElement.querySelector(selector)) {
                return resolve(baseElement.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (baseElement.querySelector(selector)) {
                    resolve(baseElement.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(baseElement, {
                childList: true,
                subtree: true
            });
        });
    }

    function modifyStyle() {
        // Places episode-panel underneath player
        let element = document.querySelector('#w-media');
        if (element) {
            element.style.flexDirection = 'column';
        }

        let episodesElement = document.querySelector('#w-media #w-episodes');
        if (episodesElement) {
            episodesElement.style.order = '3';
            episodesElement.style.maxWidth = 'unset';
            episodesElement.style.marginTop = '10px';
            episodesElement.style.marginLeft = '85px';
            episodesElement.style.marginRight = '85px';
        }

        let episodesBodyElement = document.querySelector('#w-media #w-episodes .body .episodes');
        if (episodesBodyElement) {
            episodesBodyElement.style.position = 'static';
            episodesBodyElement.style.maxHeight = '300px';
            episodesBodyElement.style.overflowY = 'auto';
        }

        // Adds padding to player to fit on-screen
        let wplayerElement = document.querySelector('#w-media #w-player');
        if (wplayerElement) {
            wplayerElement.style.marginLeft = '96px';
            wplayerElement.style.marginRight = '96px';
        }

        // Reduces width of player to remove black bars
        let playerElement = document.querySelector('#w-media #w-player #player-wrapper #player');
        if (playerElement) {
            playerElement.style.width = '98%';
            playerElement.style.left = '15px';
        }

        // Reduces width of controls underneath player to align with player
        let controlsElement = document.querySelector('#w-media #controls');
        if (controlsElement) {
            controlsElement.style.width = '98%';
            controlsElement.style.left = '15px';
            controlsElement.style.position = 'relative';
        }

        // Adds left-padding to related panel
        let sidebarElement = document.querySelector('#watch-main aside.sidebar');
        if (sidebarElement) {
            sidebarElement.style.marginLeft = '10px';
            sidebarElement.style.marginRight = '10px';
        }

        // Adds left-padding to info
        let descriptionElement = document.querySelector('#w-info');
        if (descriptionElement) {
            descriptionElement.style.marginLeft = '10px';
            descriptionElement.style.marginRight = '10px';
        }
    }

    modifyStyle();

    // Watches for changes in the element
    let observer = new MutationObserver(modifyStyle);

    // Starts observing the target element
    let target = document.querySelector('#w-media');
    if (target) {
        observer.observe(target, { attributes: true, childList: true, subtree: true });
    }


    window.onload = function() {
        // Removes built-in ad
        var elements = document.getElementsByClassName('mb-4 text-center');
        while(elements.length > 0){
            while(elements[0].firstChild) {
                elements[0].removeChild(elements[0].firstChild);
            }
            elements[0].classList.remove('mb-4', 'text-center');
        }

        // Removes sharing
        var bsharingElements = document.getElementsByClassName('bsharing mb-4');
        while(bsharingElements.length > 0){
            while(bsharingElements[0].firstChild) {
                bsharingElements[0].removeChild(bsharingElements[0].firstChild);
            }
            bsharingElements[0].classList.remove('bsharing', 'mb-4');
        }

        // Auto expands
        var expandElement = document.querySelector('.ctrl.expand');
        if (expandElement) {
            expandElement.click();
        }

        // Auto selects highest quality (requires CORS)
        setTimeout(function() {
            let iframe = document.querySelector("#player > iframe");
            let command = "jwplayer().setCurrentQuality(1)";

            if (iframe) {
                iframe.contentWindow.eval(command);
            }
        }, 3000);
    };
})();
