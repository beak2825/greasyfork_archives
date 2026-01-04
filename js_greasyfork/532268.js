// ==UserScript==
// @name         Comick.dev Random Comic Button
// @namespace    https://github.com/GooglyBlox
// @version      1.2
// @description  Replaces the Home button with a Random button that navigates to random comics
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        GM_xmlhttpRequest
// @connect      api.comick.dev
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532268/Comickdev%20Random%20Comic%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/532268/Comickdev%20Random%20Comic%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let comics = [];
    let isLoading = false;

    function loadComics() {
        if (isLoading) return;
        isLoading = true;
        loadPage(1);
    }

    function loadPage(page, maxPages = 50) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.comick.dev/v1.0/search?limit=50&page=${page}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data && Array.isArray(data)) {
                        comics = comics.concat(data);

                        if (data.length > 0 && page < maxPages) {
                            loadPage(page + 1, maxPages);
                        } else {
                            isLoading = false;
                            console.log(`Loaded ${comics.length} comics for random selection`);
                        }
                    }
                } catch (error) {
                    console.error("Error loading comics:", error);
                    isLoading = false;
                }
            },
            onerror: function(error) {
                console.error("Error loading comics:", error);
                isLoading = false;
            }
        });
    }

    function updateButton() {
        const homeLink = document.querySelector('a[href="/"].relative.grow-0');

        if (!homeLink) return false;

        if (homeLink.getAttribute('data-random-button-modified')) return true;

        homeLink.setAttribute('data-random-button-modified', 'true');

        const buttonDiv = homeLink.querySelector('button div');
        if (buttonDiv) {
            buttonDiv.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dices-icon lucide-dices w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7">
                    <rect width="12" height="12" x="2" y="10" rx="2" ry="2"/>
                    <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"/>
                    <path d="M6 18h.01"/>
                    <path d="M10 14h.01"/>
                    <path d="M15 6h.01"/>
                    <path d="M18 9h.01"/>
                </svg>
                <div class="text-xs absolute left-1/2 -translate-x-1/2">Random</div>
            `;
        }

        const newHomeLink = homeLink.cloneNode(true);
        homeLink.parentNode.replaceChild(newHomeLink, homeLink);

        newHomeLink.setAttribute('href', '#');
        newHomeLink.setAttribute('data-random-button-modified', 'true');

        newHomeLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (comics.length === 0) {
                alert("Still loading comics. Please try again in a moment.");
                return;
            }

            const randomComic = comics[Math.floor(Math.random() * comics.length)];
            if (randomComic && randomComic.slug) {
                window.location.href = `https://comick.dev/comic/${randomComic.slug}`;
            }
        });

        return true;
    }

    function checkForButton() {
        if (updateButton()) {
            setTimeout(checkForButton, 1000);
            return;
        }

        setTimeout(checkForButton, 300);
    }

    loadComics();
    checkForButton();

    const observer = new MutationObserver(function(mutations) {
        for (let i = 0; i < mutations.length; i++) {
            const mutation = mutations[i];

            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                if (mutation.target.tagName === 'NAV' ||
                    mutation.target.closest('nav') ||
                    mutation.target.closest('.sidebar')) {
                    updateButton();
                    break;
                }
            }
        }
    });

    const navElements = document.querySelectorAll('nav, .sidebar, header');
    if (navElements.length > 0) {
        navElements.forEach(el => observer.observe(el, { childList: true, subtree: true }));
    } else {
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();