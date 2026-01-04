// ==UserScript==
// @name         Kemono Discord Favourite Button
// @namespace    https://kemono.su/
// @author       Agent 9
// @version      1.1
// @license MIT
// @description  Add a favourite button to Discord server creator pages on Kemono
// @match        https://kemono.su/*
// @grant        window.onurlchange
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/533135/Kemono%20Discord%20Favourite%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/533135/Kemono%20Discord%20Favourite%20Button.meta.js
// ==/UserScript==

(function () {
    // ————————————————————————
    // SPA Navigation Listener
    // ————————————————————————

    window.addEventListener('urlchange', () => {
        waitForElement('#main ul', (ul) => {
            initFavoriteButton();
        });
        console.log('url changed');
        const targetNode = document.querySelector("#main")
        console.log(targetNode);
        const config = { attributes: true, childList: true, subtree: true };
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    initFavoriteButton();
                } else if (mutation.type === "attributes") {
                    initFavoriteButton();
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    });
    window.addEventListener('load', () => {
        waitForElement('#main ul', (ul) => {
            initFavoriteButton();
        });
        console.log('load');
    });

    // ————————————————————————
    // Utilities
    // ————————————————————————
    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) return callback(el);
        setTimeout(() => waitForElement(selector, callback), 100);
    }

    function getServerId(url) {
        const parts = url.split("/"); // splits into parts by "/"
        const serverIndex = parts.indexOf("server"); // find "server"
        return serverIndex !== -1 ? parts[serverIndex + 1].trim() : null;
    }

    function createButton(service,profileID){
        let btn = document.createElement('button');
        btn.id = 'favorite-button-template';
        btn.className = 'user-header__favourite';
        btn.type = 'button';
        btn.innerHTML = `<span class="user-header__fav-icon">☆</span>
                         <span class="user-header__fav-text">Favorite</span>`;

        // Set initial state based on current favourites
        fetch('/api/v1/account/favorites', {
            method: 'GET',
            credentials: 'include'
        })
            .then(function(response){
            return response.json();
        })
            .then(function(data){
            const isFav = data.some(item => item.service == service && item.id == profileID);
            console.log(isFav);
            if(isFav==true){
                btn.className = 'user-header__favourite user-header__favourite--unfav ';
                btn.innerHTML =`<span class="user-header__fav-icon">★</span>
                                <span class="user-header__fav-text">Unfavorite</span>`;
            }
        })
            .catch(error => console.error('Error:', error));

        return btn;
    }


    // ————————————————————————
    // Main Injector / Syncer
    // ————————————————————————
    function initFavoriteButton() {
        // Only target Discord creator pages
        if (!/\/discord\//.test(location.pathname)){
            console.log('not a discord server');
            return;
        }

        // Prevent duplicate injection
        if (document.getElementById('creator-actions')){
            console.log('creator-actions already injected');
            return;
        }
        // Create the favorite button
        let service = 'discord';
        let profileID = getServerId(location.pathname);
        let btn = createButton(service,profileID);

        // Toggle favourite on click
        btn.addEventListener('click', () => {
            const isNowFav = btn.classList.toggle('user-header__favourite--unfav');
            if(isNowFav){
                btn.innerHTML =`<span class="user-header__fav-icon">★</span>
                                <span class="user-header__fav-text">Unfavorite</span>`;
            }
            else{
                btn.innerHTML = `<span class="user-header__fav-icon">☆</span>
                                 <span class="user-header__fav-text">Favorite</span>`;
            }
            const method = isNowFav ? 'POST' : 'DELETE';

            fetch(`/api/v1/favorites/creator/${service}/${profileID}`, {
                method,
                credentials: 'include',
            }).catch(console.error);
        });

        // Inject into page when element is ready
        waitForElement('#main ul', (ul) => {
            const container = document.createElement('div');
            container.id = 'creator-actions';
            container.appendChild(btn);
            ul.prepend(container);
        });
    }
})();