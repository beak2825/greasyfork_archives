// ==UserScript==
// @name         PTP Ratings Exporter for IMDb
// @namespace    PTP Ratings Exporter for IMDb
// @version      1.1.0
// @description  Automatically add and rate movies to your IMDb watchlist
// @author       Delgan
// @match        https://passthepopcorn.me/forums.php?*&threadid=37787&*
// @match        https://passthepopcorn.me/forums.php?*&threadid=37787
// @match        https://passthepopcorn.me/forums.php?threadid=37787&*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/406076/PTP%20Ratings%20Exporter%20for%20IMDb.user.js
// @updateURL https://update.greasyfork.org/scripts/406076/PTP%20Ratings%20Exporter%20for%20IMDb.meta.js
// ==/UserScript==

function main() {
    let placeholder = `Fill in this text box with an JSON array looking like this:
    [
        {"title": "Sonatine", "year": 1993, "imdb": {"id": "tt0108188", "url": "https://www.imdb.com/title/tt0108188/", "my_rating": 9}},
        {"title": "Se7en", "year": 1995, "imdb": {"id": "tt0114369", "url": "https://www.imdb.com/title/tt0114369/", "my_rating": 6}}
    ]`

    let textarea = `<textarea id='ptp-ratings-exporter-textarea' style='width: 100%; height: 7rem; padding: 10px;' placeholder='${placeholder}'></textarea>`;
    let button = `<button id='ptp-ratings-exporter-button' style='display:block; margin: auto; margin-top: 10px;'>Rate my movies</button>`;
    let checkbox = `<label style='cursor:pointer;display:block;text-align:center;margin-top:5px;'><input id='ptp-ratings-exporter-checkbox-watchlist' type="checkbox" /> Add movies to watchlist</label>`;
    let progression = `<div id='ptp-ratings-exporter-progression' data-count="0" data-progress="0" style='text-align:center; margin-top: 5px;'></div>`;

    document.getElementById("content").insertAdjacentHTML("afterbegin", textarea + checkbox + button + progression);
    document.getElementById("ptp-ratings-exporter-button").addEventListener("click", rateMovies);
    renderProgression();
}

function getAuthToken(imdbId, onSuccess) {
    GM_xmlhttpRequest({
        url: `https://www.imdb.com/title/${imdbId}/`,
        method: "PUT",
        timeout: 30000,
        onload: function (response) {
            let auth;
            try {
                let html = document.createElement("html");
                html.innerHTML = response.responseText;
                auth = html.querySelector("#star-rating-widget").getAttribute("data-auth");
            } catch (err) {
                alert(`An error occurred while fetching IMDb auth token: '${err.message}'`);
                return;
            }
            onSuccess(auth);
        },
        onerror: function (_) {
            alert(`The HTTP request for auth token  failed`);
        },
        ontimeout: function (_) {
            alert(`The HTTP request for auth token timed out`);
        },
    });
}

function addMovieToWatchlist(imdbId) {
    GM_xmlhttpRequest({
        url: `https://www.imdb.com/watchlist/${imdbId}`,
        method: "PUT",
        timeout: 30000,
        onload: function (_) {
            console.log(`Successfully added movie '${imdbId}' to watchlist`);
        },
        onerror: function (_) {
            alert(`The HTTP request for movie '${imdbId}' failed`);
        },
        ontimeout: function (_) {
            alert(`The HTTP request for movie '${imdbId}' timed out`);
        },
    });
}

function rateMovie(imdbId, rating, auth) {
    let data = {
        "tconst": imdbId,
        "rating": Math.min(Math.max(rating, 1), 10).toFixed(),
        "auth": auth,
        "tracking_tag": "title-maindetails",
        "pageId": imdbId,
        "pageType": "title",
        "subpageType": "main",
    };

    let payload = "";
    for (let field in data) {
        payload += `${field}=${encodeURIComponent(data[field])}&`;
    }

    let headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:77.0) Gecko/20100101 Firefox/77.0',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
    };

    GM_xmlhttpRequest({
        url: `https://www.imdb.com/ratings/_ajax/title`,
        method: "POST",
        headers: headers,
        timeout: 30000,
        data: payload,
        onload: function (_) {
            console.log(`Successfully rated movie '${imdbId}'`);
        },
        onerror: function (_) {
            alert(`The HTTP request for movie '${imdbId}' failed`);
        },
        ontimeout: function (_) {
            alert(`The HTTP request for movie '${imdbId}' timed out`);
        },
    });
}

function disableForm() {
    document.getElementById("ptp-ratings-exporter-textarea").setAttribute("disabled", "disabled");
    document.getElementById("ptp-ratings-exporter-button").setAttribute("disabled", "disabled");
}

function enableForm() {
    document.getElementById("ptp-ratings-exporter-textarea").removeAttribute("disabled");
    document.getElementById("ptp-ratings-exporter-button").removeAttribute("disabled");
}


function resetProgression(progress, count) {
    let progression = document.getElementById("ptp-ratings-exporter-progression");
    progression.setAttribute("data-progress", progress);
    progression.setAttribute("data-count", count);
    renderProgression();
}

function updateProgression() {
    let progression = document.getElementById("ptp-ratings-exporter-progression");
    let progress = parseInt(progression.getAttribute("data-progress"));
    progression.setAttribute("data-progress", progress + 1);
    renderProgression();

    if (progress + 1 === parseInt(progression.getAttribute("data-count"))) {
        enableForm();
    }
}

function renderProgression() {
    let progression = document.getElementById("ptp-ratings-exporter-progression");
    let progress = progression.getAttribute("data-progress")
    let count = progression.getAttribute("data-count");
    if (count === "0") {
        progression.innerHTML = "Progression: ---";
    } else {
        progression.innerHTML = `Progression: ${progress} / ${count}`;
    }
}

function rateMovies() {
    disableForm();

    resetProgression(0, 0);

    let text = document.getElementById("ptp-ratings-exporter-textarea").value;

    if (text === "") {
        alert("No data to parse");
        enableForm();
        return;
    }

    let movies;

    try {
        movies = JSON.parse(text);
    } catch (err) {
        alert(`Unable to parse the JSON array: "${err.message}"`);
        enableForm();
        return;
    }

    if (!Array.isArray(movies)) {
        alert("Invalid parsed JSON, it should be an array");
        enableForm();
        return;
    }

    if (movies.length === 0) {
        enableForm();
        return;
    }

    resetProgression(0, movies.length);

    let addMoviesToWatchList = document.getElementById("ptp-ratings-exporter-checkbox-watchlist");

    let delay = 1000;

    for (let movie of movies) {
        if (!movie.hasOwnProperty("imdb")) {
            alert("Missing 'imdb' property in one data entry");
            updateProgression();
            continue;
        }
        if (!movie.imdb.hasOwnProperty("id")) {
            alert("Missing 'id' property in one data entry");
            updateProgression();
            continue;
        }
        if (!movie.imdb.hasOwnProperty("my_rating")) {
            alert("Missing 'my_rating' property in one data entry");
            updateProgression();
            continue;
        }

        let imdbId = movie.imdb.id;
        let myRating = parseFloat(movie.imdb.my_rating);

        if (!imdbId.match(/tt[0-9]+/)) {
            alert(`The imdb id format is incorrect: '${imdbId}'`);
            updateProgression();
            continue;
        }
        if (Number.isNaN(myRating) || myRating < 0 || myRating > 10) {
            alert(`The rating value is incorrect: '${myRating}'`);
            updateProgression();
            continue;
        }

        setTimeout(function () {addMoviesToWatchList
            updateProgression();
            getAuthToken(imdbId, function (auth) {
                if (addMoviesToWatchList) {
                    addMovieToWatchlist(imdbId);
                }
                rateMovie(imdbId, myRating, auth);
            });
        }, delay);

        delay += 1000;
    }
}

main();
