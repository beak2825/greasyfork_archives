// ==UserScript==
// @name         Toggle card details
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  hides trello summary details but allows you to toggle them with a button
// @author       You
// @include      https://trello.com/b/*
// @include      https://trello.com/c/*
// @icon         https://www.google.com/s2/favicons?domain=trello.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459677/Toggle%20card%20details.user.js
// @updateURL https://update.greasyfork.org/scripts/459677/Toggle%20card%20details.meta.js
// ==/UserScript==

(function() {

    const style = document.createElement('style');
    style.setAttribute("id", "toggle-badges-style");
    style.textContent = `
                                 .badges .badge:not(.is-unread-notification){
                                 	display: none;
                                 }`;

    var mainFunction = function() {
        console.log("mainFunction Toggle card details");
        var starBtn = document.querySelector('[data-testid="StarIcon"]').closest('button');
        if(starBtn != null){

            const styleBtn = document.createElement('style');
            styleBtn.textContent = `.bebold-badges-btn .bebold-span-btn {
     								height:16px;
                                    width:16px;
                                    display: inline-block;
                                    margin-top: 3px;
     							 }
                                 .bebold-badges-btn:hover .bebold-span-btn,
                                 .bebold-badges-btn.active .bebold-span-btn {
     								margin-top: 2px;
     								transform: scale(1.2);
     							 }
                                 .bebold-badges-btn:hover .bebold-span-btn path,
                                 .bebold-badges-btn.active .bebold-span-btn path {
     								fill:#84a8ff;
     							 }`;
            document.head.append(styleBtn);
            document.head.append(style);
            // ADD MENU BUTTONS
            var toggleTrigger = document.createElement('a');
            toggleTrigger.innerHTML ='<span class="bmaJhd iJddsb bebold-span-btn" style=""><svg fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z"/></svg></span>';
            toggleTrigger.setAttribute('href','#');
            toggleTrigger.classList.add('bebold-badges-btn');
            toggleTrigger.classList.add('board-header-btn');
            toggleTrigger.setAttribute('style', 'padding-left: 8px; padding-right: 10px;');
            toggleTrigger.addEventListener('click', toggleAllOnClick);

            if(starBtn != null)
                starBtn.parentNode.insertBefore(toggleTrigger, starBtn.nextSibling);
            else{
                var menuButtonsContainer = document.querySelector('.board-header-btns.mod-left');
                menuButtonsContainer.appendChild(toggleTrigger);
            }
        }
        else docReady(mainFunction);
    };
    // basically wait for DOM ready
    waitForElm('[data-testid="StarIcon"]').then((elm) => {
        mainFunction();
    });

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function toggleAllOnClick(e) {
        if( document.querySelector('#toggle-badges-style'))
            document.querySelector('#toggle-badges-style').remove()
        else
            document.head.append(style);

        document.querySelector('.bebold-badges-btn').classList.toggle("active");
    }


})();