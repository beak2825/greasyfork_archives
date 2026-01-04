// ==UserScript==
// @name         letterbox-to-radarr
// @namespace    http://tampermonkey.net/
// @description  ajouter bouton à letterbox pour radarr
// @author       You
// @match        https://letterboxd.com/film/*
// @match        https://letterboxd.com/*/film/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=letterboxd.com
// @grant       unsafeWindow
// @grant        GM_xmlhttpRequest
// @license MIT
// @version      2025-06-13
// @downloadURL https://update.greasyfork.org/scripts/539303/letterbox-to-radarr.user.js
// @updateURL https://update.greasyfork.org/scripts/539303/letterbox-to-radarr.meta.js
// ==/UserScript==

(async function () {
    var filmId = document.body.getAttribute("data-tmdb-id");
    console.log('Film ID from current page:', filmId);

    const actionsPanel = document.querySelector("ul.js-actions-panel");
    if (actionsPanel) {
        const newListItem = document.createElement("li");
        const newAItem = document.createElement("a");

        newAItem.textContent = "Ajouter à Radarr";
        newAItem.addEventListener('click', async () => {
            showBanner("Ajout en cours...", "#000");

            var filmTitle = document.querySelector('.js-widont').textContent.trim();
            if (filmTitle === '') {
                filmTitle = document.querySelector('span.film-title-wrapper a').textContent.trim();
                var movieUrl = document.querySelector('span.film-title-wrapper a').href;

                // Attendre que tmdb_id soit récupéré
                filmId = await fetchTmdbId(movieUrl);
                if (filmId) {
                    console.log('tmdb_id récupéré:', filmId);
                } else {
                    console.error('Impossible de récupérer tmdb_id, vérifiez l’URL ou le sélecteur.');
                }
            }
            console.log(filmTitle);

            const filmYear = document.querySelector('.releasedate').textContent.trim();
            const apiKey = '0e32394a38a54781b046d8e7bae1145d';
            const url = `https://api.themoviedb.org/3/movie/${filmId}?api_key=${apiKey}`;

            fetch(url)
                .then(response => response.json())
                .then(data => handleTMDBResponse(data, filmTitle, filmYear, filmId))
                .catch(error => console.error(error));
        });

        newListItem.appendChild(newAItem);
        actionsPanel.prepend(newListItem);
    } else {
        console.error("No ul element with class js-actions-panel found.");
    }
})();

async function fetchTmdbId(url) {

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    console.log('HTML téléchargé avec succès.');

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const element = doc.querySelector('[data-tmdb-id]');

                    if (element) {
                        console.log('Élément trouvé avec data-tmdb-id:', element);
                        resolve(element.getAttribute('data-tmdb-id'));
                    } else {
                        console.error('Aucun élément avec data-tmdb-id trouvé dans la page téléchargée.');
                        resolve(null);
                    }
                } else {
                    console.error('Erreur lors du téléchargement de la page. Statut:', response.status);
                    reject(new Error('Erreur lors du téléchargement de la page.'));
                }
            },
            onerror: function() {
                console.error('Erreur réseau lors du téléchargement de la page.');
                reject(new Error('Erreur réseau lors du téléchargement de la page.'));
            }
        });
    });
}

function showBanner(message, backgroundColor) {
    const banner = document.createElement("div");
    banner.textContent = message;
    banner.style.position = "fixed";
    banner.style.bottom = "10px";
    banner.style.right = "10px";
    banner.style.padding = "10px";
    banner.style.backgroundColor = backgroundColor;
    banner.style.color = "#fff";
    banner.style.borderRadius = "5px";
    banner.style.zIndex = "9999";
    banner.style.fontSize = '18px';
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 3000);
}

function handleTMDBResponse(data, filmTitle, filmYear, filmId) {
    if (data) {
        const formData = new URLSearchParams({
            title: filmTitle,
            tmdbId: filmId,
            originalLanguage: data.original_language
        });

        GM_xmlhttpRequest({
            method: "POST",
            url: "http://89.89.36.20:8000",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: formData.toString(),
            onload: (response) => showBanner(`${filmTitle} est ajouté à Radarr`, "#138808"),
            onerror: (error) => showBanner(`There was an error: ${error}`, "#992c28")
        });
    } else {
        console.log(`No movie found with the title "${filmTitle}".`);
    }
}
