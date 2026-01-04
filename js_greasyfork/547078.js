// ==UserScript==
// @name         Letterboxd to IMDb Links with Ratings and Additional Sites
// @name:tr      Letterboxd Puan ve Ek Site Linkleri
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  Add IMDb, Rotten Tomatoes, Metacritic ratings, and links to Ekşi Sözlük, Trakt, and Sinefil for Letterboxd films using PythonAnywhere API, with console logs for debugging missing information issues
// @description:tr  Letterboxd Puan ve Ek Site Linkleri Sunar
// @author       sheeper
// @match        https://letterboxd.com/*
// @grant        GM_xmlhttpRequest
// @connect      sheeper.pythonanywhere.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/547078/Letterboxd%20to%20IMDb%20Links%20with%20Ratings%20and%20Additional%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/547078/Letterboxd%20to%20IMDb%20Links%20with%20Ratings%20and%20Additional%20Sites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_URL = 'https://sheeper.pythonanywhere.com/movie_by_letterboxd?link=';
    const processedPosters = new WeakSet();

    function fetchPythonAnywhereData(filmLink, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: API_URL + encodeURIComponent(filmLink),
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    callback(data);
                } catch (error) {
                    console.error(`Error parsing response for: ${filmLink}`, error);
                }
            },
            onerror: function(error) {
                console.error(`Error fetching data from PythonAnywhere for: ${filmLink}`, error);
            }
        });
    }

    function addRatingsAndLinks(data, $posterElement) {
        if (!data || !data.imdbID) {
            console.warn('Received invalid data or no imdbID for poster:', $posterElement.html());
            return;
        }

        const imdbId = data.imdbID;
        const imdbRating = data.IMDbSc;
        const rtRating = data.RT_Score;
        const mcRating = data.MetaSc;
        const letterboxdRating = data.Lbx;

        // Ratings div (üst kısım)
        const ratingsDiv = $('<div>').css({
            'background-color': 'rgba(0, 0, 0, 0.7)', 'padding': '2px 3px', 'border-radius': '5px',
            'display': 'flex', 'align-items': 'center', 'justify-content': 'center', 'margin-top': '2px',
            'font-size': '10px', 'position': 'absolute', 'top': '0', 'left': '0', 'width': '100%',
            'white-space': 'nowrap', 'overflow': 'hidden', 'box-sizing': 'border-box', 'z-index': '2'
        });

        if (letterboxdRating && letterboxdRating !== 'N/A') {
            ratingsDiv.append(createRatingElement(data['Letterboxd_Link'], 'https://i.imgur.com/YSiskZp.png', letterboxdRating, '12.5px'));
        }
        if (imdbRating && imdbRating !== 'N/A') {
            ratingsDiv.append(createRatingElement(`https://www.imdb.com/title/${imdbId}`, 'https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg', imdbRating, '12.5px'));
        }
        if (rtRating && rtRating !== 'N/A') {
            ratingsDiv.append(createRatingElement(`https://www.rottentomatoes.com/search?search=${encodeURIComponent(data.Title)}`, 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg', rtRating, '12.5px'));
        }
        if (mcRating && mcRating !== 'N/A') {
            ratingsDiv.append(createRatingElement(`https://www.metacritic.com/search/all/${encodeURIComponent(data.Title)}/results`, 'https://upload.wikimedia.org/wikipedia/commons/2/20/Metacritic.svg', mcRating, '12.5px'));
        }

        // Links div (alt kısım)
        const linksDiv = $('<div>').css({
            'background-color': 'rgba(0, 0, 0, 0.7)', 'padding': '1px 1px', 'border-radius': '3px',
            'display': 'flex', 'align-items': 'center', 'justify-content': 'center', 'font-size': '10px',
            'position': 'absolute', 'bottom': '0', 'left': '0', 'width': '100%', 'white-space': 'nowrap',
            'overflow': 'hidden', 'box-sizing': 'border-box', 'z-index': '2'
        });

        const ekşiLink = `https://eksisozluk.com/?q=${encodeURIComponent(data.Title)}`;
        const traktLink = `https://trakt.tv/search/imdb?query=${encodeURIComponent(imdbId)}`;
        const sinefilLink = `https://www.sinefil.com/ara/${encodeURIComponent(imdbId)}`;

        linksDiv.append(createIconLink(ekşiLink, 'https://i.imgur.com/k5K7m9h.png', 'Ekşi Sözlük', '10px'));
        linksDiv.append(createIconLink(traktLink, 'https://i.imgur.com/adN3cCW.png', 'Trakt', '12.5px'));
        linksDiv.append(createIconLink(sinefilLink, 'https://i.imgur.com/Z8E36pP.png', 'Sinefil', '12.5px'));

        // Elementleri afişe ekle
        $posterElement.css('position', 'relative').append(ratingsDiv).append(linksDiv);
    }

    function createRatingElement(link, imgSrc, rating, size) {
        const ratingContainer = $('<div>').css({'display': 'flex', 'align-items': 'center', 'margin-right': '5px'});
        const icon = $('<img>').attr('src', imgSrc).css({'width': size, 'vertical-align': 'middle', 'margin-right': '2px'});
        const ratingText = $('<span>').text(rating).css({'color': '#fff', 'font-weight': 'bold'});
        return ratingContainer.append(icon).append(ratingText).wrap('<a>').parent().attr('href', link).attr('target', '_blank');
    }

    function createIconLink(link, imgSrc, altText, size) {
        return $('<a>').attr('href', link).attr('target', '_blank')
            .append($('<img>').attr('src', imgSrc).attr('alt', altText).css({'width': size, 'vertical-align': 'middle', 'margin': '0 2px'}));
    }

    function processAllFilms() {
        // DEĞİŞİKLİK 1: Yeni afiş konteyner seçicisi. data-target-link niteliği olan tüm react-component'leri hedefliyoruz.
        const POSTER_SELECTOR = 'div.react-component[data-target-link]';

        $(POSTER_SELECTOR).each(function() {
            const $posterComponent = $(this); // Bu artık div.react-component

            if (processedPosters.has($posterComponent[0])) {
                return;
            }

            // DEĞİŞİKLİK 2: Linki doğrudan bu elementin kendisinden alıyoruz.
            const filmLink = $posterComponent.attr('data-target-link');

            if (filmLink && filmLink.startsWith('/')) {
                const fullUrl = `https://letterboxd.com${filmLink}`;

                // DEĞİŞİKLİK 3: Puanlamaları ekleyeceğimiz görsel afiş elementini (.film-poster) bulup fonksiyona onu gönderiyoruz.
                const $visualPoster = $posterComponent.find('.film-poster');
                if ($visualPoster.length > 0) {
                    fetchPythonAnywhereData(fullUrl, data => {
                        addRatingsAndLinks(data, $visualPoster);
                        processedPosters.add($posterComponent[0]);
                    });
                }
            }
        });
    }

    // Sayfa içeriği değiştikçe betiğin tekrar çalışmasını sağlayan gözlemci
    const observer = new MutationObserver(function(mutations) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(processAllFilms, 500);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // İlk sayfa yüklenmesi için
    $(document).ready(function() {
        setTimeout(processAllFilms, 1000); // Sayfanın tam oturması için küçük bir gecikme eklendi
    });

})();