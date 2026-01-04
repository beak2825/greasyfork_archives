// ==UserScript==
// @name         Toggle imgs
// @namespace    http://tampermonkey.net/
// @version      1.7.1
// @description  hides trello covers but allows you to toggle them with a button
// @author       You
// @include      https://trello.com/b/*
// @include      https://trello.com/c/*
// @icon         https://www.google.com/s2/favicons?domain=trello.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447516/Toggle%20imgs.user.js
// @updateURL https://update.greasyfork.org/scripts/447516/Toggle%20imgs.meta.js
// ==/UserScript==

(function() {

    const style = document.createElement('style');
    style.setAttribute("id", "toggle-img-style");
    style.textContent = `.list-card-cover.js-card-cover.is-covered.visible{
     								display: block !important;
    							 }
                                 .badge.is-due-complete.visible {
     								display: inline-block !important;
    							 }
                                 .list-card-cover.js-card-cover.is-covered,.list-card.is-covered .list-card-cover {
                                 	display: none;
                                 }`;

    var mainFunction = function() {
        console.log("mainFunction Toggle imgs");
        var starBtn = document.querySelector('[data-testid="StarIcon"]').closest('button');
        if(starBtn != null){

            const styleBtn = document.createElement('style');
            styleBtn.textContent = `.bebold-img-btn .bebold-span-btn {
     								height:16px;
                                    width:16px;
                                    display: inline-block;
                                    margin-top: 3px;
     							 }
                                 .bebold-img-btn:hover .bebold-span-btn,
                                 .bebold-img-btn.active .bebold-span-btn {
     								margin-top: 2px;
     								transform: scale(1.2);
     							 }
                                 .bebold-img-btn:hover .bebold-span-btn path,
                                 .bebold-img-btn.active .bebold-span-btn path {
     								fill:#51E898;
     							 }`;
            document.head.append(styleBtn);
            document.head.append(style);
            // ADD MENU BUTTONS
            var toggleTrigger = document.createElement('a');
            toggleTrigger.innerHTML ='<span class="bmaJhd iJddsb bebold-span-btn" style=""><svg fill="#fff" viewBox="0 0 24 24"><path d="M14 13l4 5H6l4-4 1.79 1.78L14 13zm-6.01-2.99A2 2 0 0 0 8 6a2 2 0 0 0-.01 4.01zM22 5v14a3 3 0 0 1-3 2.99H5c-1.64 0-3-1.36-3-3V5c0-1.64 1.36-3 3-3h14c1.65 0 3 1.36 3 3zm-2.01 0a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h7v-.01h7a1 1 0 0 0 1-1V5"></path></svg></span>';
            toggleTrigger.setAttribute('href','#');
            toggleTrigger.classList.add('bebold-img-btn');
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
        /*var list = document.querySelectorAll(".list-card-cover.js-card-cover.is-covered,.badge.is-due-complete");
        for (var i = 0; i < list.length; ++i)
            list[i].classList.toggle("visible");*/
        if( document.querySelector('#toggle-img-style'))
            document.querySelector('#toggle-img-style').remove()
        else
            document.head.append(style);
            document.querySelector('.bebold-img-btn').classList.toggle("active");

    }


})();