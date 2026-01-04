// ==UserScript==
// @name         Letterboxd - Films en Français
// @description  Remplace le titre, slogan et description des films sur Letterboxd par ceux en français (via TMDB)
// @match        https://letterboxd.com/film/*
// @match        https://letterboxd.com/*/film/*
// @icon         https://letterboxd.com/favicon.ico
// @version      2.6
// @namespace https://greasyfork.org/users/1060999
// @downloadURL https://update.greasyfork.org/scripts/543928/Letterboxd%20-%20Films%20en%20Fran%C3%A7ais.user.js
// @updateURL https://update.greasyfork.org/scripts/543928/Letterboxd%20-%20Films%20en%20Fran%C3%A7ais.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TMDB_API_KEY = 'YOUR_TMDB_API_KEY_HERE'; //METTRE VOTRE API KEY TMDB ICI
    const TMDB_API_BASE = 'https://api.themoviedb.org/3';

    const isReviewPage = location.pathname.match(/^\/[^\/]+\/film\//);

    if (isReviewPage) {
        const titleLink = document.querySelector('h2.name.-primary a[href^="/film/"]');
        const yearElement = document.querySelector('.releasedate a');

        if (!titleLink || !yearElement) return;

        const title = titleLink.textContent.trim();
        const year = yearElement.textContent.trim();

        fetch(`${TMDB_API_BASE}/search/movie?api_key=${TMDB_API_KEY}&include_adult=true&query=${encodeURIComponent(title)}&year=${year}`)
            .then(res => res.json())
            .then(async data => {
            const results = data.results || [];
            if (results.length === 0) return;

            // --- sélection stricte pour pages /user/film/ ---
            const normalize = s => (s || "")
            .toLowerCase()
            .normalize("NFD").replace(/\p{Diacritic}/gu, "")
            .replace(/[^a-z0-9]+/g, " ") // retire ponctuation/espaces multiples
            .trim();

            const normTitle = normalize(title);

            // 1) restreindre à l'année affichée
            const byYear = results.filter(r => (r.release_date || "").slice(0, 4) === year);

            // 2) ne conserver que les titres qui matchent exactement (title OU original_title)
            const exactMatchesYear = byYear.filter(r => {
                const t = normalize(r.title);
                const o = normalize(r.original_title);
                return t === normTitle || o === normTitle;
            });

            // 3) s’il y en a, choisir celui avec le plus de votes (puis popularity en tie-break)
            if (exactMatchesYear.length) {
                const pick = exactMatchesYear.reduce((a, b) => {
                    if (a.vote_count !== b.vote_count) return a.vote_count > b.vote_count ? a : b;
                    if (a.popularity !== b.popularity) return a.popularity > b.popularity ? a : b;
                    return a;
                });

                const detailsRes = await fetch(`${TMDB_API_BASE}/movie/${pick.id}?api_key=${TMDB_API_KEY}&language=fr`);
                const details = await detailsRes.json();

                if (details.title && details.title.toLowerCase() !== title.toLowerCase()) {
                    titleLink.textContent = details.title;
                    console.log(`[Letterboxd-FR] Titre critique remplacé : ${title} → ${details.title}`);
                }
            } else {
                console.log('[Letterboxd-FR] Aucun match exact titre+année — aucun remplacement effectué.');
            }

        });

        return; // Ne pas exécuter la suite du script sur les pages critiques
    }

    // === PAGE FILM CLASSIQUE ===
    const titleElement = document.querySelector('h1.primaryname span.name');
    if (!titleElement) return;
    const title = titleElement.textContent.trim();

    const yearElement = document.querySelector('.releasedate a');
    const year = yearElement ? yearElement.textContent.trim() : null;

    const directorElement = document.querySelector('.creatorlist a.contributor span');
    const director = directorElement ? directorElement.textContent.trim().toLowerCase() : null;

    if (!year) {
        console.warn('[Letterboxd-FR] Année introuvable');
        return;
    }

    fetch(`${TMDB_API_BASE}/search/movie?api_key=${TMDB_API_KEY}&include_adult=true&query=${encodeURIComponent(title)}&year=${year}`)
        .then(res => res.json())
        .then(data => {
        const results = data.results || [];

        const checkDirector = async (movie) => {
            if (!director) return false;
            try {
                const creditsRes = await fetch(`${TMDB_API_BASE}/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}`);
                const creditsData = await creditsRes.json();
                const directors = (creditsData.crew || []).filter(person => person.job === "Director");
                return directors.some(d => d.name.toLowerCase() === director);
            } catch {
                return false;
            }
        };

        (async () => {
            let fallbackMovie = null;
            let maxVotes = 0;

            for (const movie of results) {
                const isMatch = await checkDirector(movie);
                if (isMatch) {
                    const detailsRes = await fetch(`${TMDB_API_BASE}/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=fr`);
                    const details = await detailsRes.json();
                    applyMovieDetails(movie, details);
                    return;
                }
                if (movie.vote_count > maxVotes) {
                    maxVotes = movie.vote_count;
                    fallbackMovie = movie;
                }
            }

            if (fallbackMovie) {
                console.warn('[Letterboxd-FR] Aucun réalisateur trouvé, fallback au film le plus voté.');
                const detailsRes = await fetch(`${TMDB_API_BASE}/movie/${fallbackMovie.id}?api_key=${TMDB_API_KEY}&language=fr`);
                const details = await detailsRes.json();
                applyMovieDetails(fallbackMovie, details);
            } else {
                console.warn('[Letterboxd-FR] Aucun film exploitable trouvé.');
            }
        })();
    })
        .catch(err => {
        console.error('[Letterboxd-FR] Erreur TMDB :', err);
    });

    function applyMovieDetails(movie, details) {
        const title = document.querySelector('h1.primaryname span.name')?.textContent.trim();
        const originalNameEl = document.querySelector('h2.originalname');
        const isOriginalFr = originalNameEl && originalNameEl.lang === 'fr';

        if (isOriginalFr) {
            originalNameEl.remove();
            console.log('[Letterboxd-FR] Titre original supprimé (déjà en français)');
        }

        if (details.title && details.title.toLowerCase() !== title?.toLowerCase()) {
            document.querySelector('h1.primaryname span.name').textContent = details.title;
            console.log(`[Letterboxd-FR] Titre principal remplacé : ${title} → ${details.title}`);
        }

        if (
            details.original_language === 'en' &&
            details.title && movie.title &&
            details.title.toLowerCase() !== movie.title.toLowerCase()
        ) {
            const originalName = document.createElement('h2');
            originalName.className = 'originalname';
            originalName.lang = 'en';
            const em = document.createElement('em');
            em.className = 'quoted-creative-work-title';
            em.textContent = movie.title;
            originalName.appendChild(em);

            const productionInfo = document.querySelector('.productioninfo');
            if (productionInfo) {
                const releaseDate = productionInfo.querySelector('.releasedate');
                if (releaseDate) {
                    productionInfo.insertBefore(originalName, releaseDate.nextSibling);
                } else {
                    productionInfo.prepend(originalName);
                }
                console.log(`[Letterboxd-FR] Titre original anglais réinséré : ${movie.title}`);
            }
        }

        if (details.tagline) {
            const taglineElement = document.querySelector('h4.tagline');
            if (taglineElement) {
                taglineElement.textContent = details.tagline;
                console.log(`[Letterboxd-FR] Tagline remplacée : ${details.tagline}`);
            }
        }

        if (details.overview) {
            const condensedDiv = document.querySelector('.truncate.condensed');
            const condenseableDiv = document.querySelector('.truncate.condenseable');
            const moreBtn = document.querySelector('.condense_control.condense_control_more');

            if (condensedDiv && condenseableDiv) {
                const condensedP = condensedDiv.querySelector('p');
                const condenseableP = condenseableDiv.querySelector('p');

                if (condensedP) condensedP.textContent = details.overview;
                if (condenseableP) condenseableP.textContent = details.overview;

                condenseableDiv.style.display = 'block';
                condensedDiv.style.display = 'none';

                if (moreBtn) moreBtn.remove();

                console.log(`[Letterboxd-FR] Synopsis long remplacé`);
            } else {
                const simpleP = document.querySelector('.truncate p');
                if (simpleP) {
                    simpleP.textContent = details.overview;
                    console.log(`[Letterboxd-FR] Synopsis court remplacé`);
                }
            }
        }
    }
})();
