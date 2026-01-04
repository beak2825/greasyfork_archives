// ==UserScript==
// @name         Netflix IMDB Ratings [fork]
// @version      1.6
// @description  Show IMDB ratings on Netflix
// @author       ioannisioannou16, kraki5525, joeytwiddle
// @match        https://www.netflix.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_openInTab
// @connect      imdb.com
// @connect      www.omdbapi.com
// @resource     customCSS  https://raw.githubusercontent.com/kraki5525/netflix-imdb/master/netflix-imdb.css
// @resource     imdbIcon   https://raw.githubusercontent.com/kraki5525/netflix-imdb/master/imdb-icon.png
// @namespace https://greasyfork.org/users/8615
// @downloadURL https://update.greasyfork.org/scripts/453540/Netflix%20IMDB%20Ratings%20%5Bfork%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/453540/Netflix%20IMDB%20Ratings%20%5Bfork%5D.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Original
    //var source = 'imdb';
    // Faster
    var source = 'omdbapi';

    // If you are getting rate limited, then generate your own key from: https://www.omdbapi.com/apikey.aspx
    var omdbApiKey = '3e29acf0';

    GM_addStyle(GM_getResourceText("customCSS"));

    GM_addStyle(`
        /* We should change the link in some way when hovered, so users know they will be clicking to IMDB and not on the Netflix card. */
        .imdb-rating {
            transition: 200ms all;
        }
        .imdb-rating:hover {
            background: #fff2;
        }
        /* It looks a little better if we move the gap otuside the element, rather than inside it */
        .imdb-rating {
            padding: 0 !important;
            margin: 6px 0;
        }
    `);

    var domParser = new DOMParser();

    function GM_xmlhttpRequest_get(url, cb) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (x) { cb(null, x); },
            onerror: function () { cb("Request to " + url + " failed"); }
        });
    }

    function requestRating(title, cb) {
        if (source === 'imdb') {
            requestRatingImdb(title, cb);
        } else if (source === 'omdbapi') {
            requestRatingOmdbApi(title, cb);
        }
    }

    function requestRatingImdb(title, cb) {
        var searchUrl = "https://www.imdb.com/find?s=tt&q=" + title;
        GM_xmlhttpRequest_get(searchUrl, function (err, searchRes) {
            if (err) return cb(err);
            var searchResParsed = domParser.parseFromString(searchRes.responseText, "text/html");
            var link = searchResParsed.querySelector(".ipc-metadata-list-summary-item__tc > a");
            var titleEndpoint = link && link.getAttribute("href");
            if (!titleEndpoint) return cb(null, {});
            var titleUrl = "https://www.imdb.com" + titleEndpoint;
            GM_xmlhttpRequest_get(titleUrl, function (err, titleRes) {
                if (err) return cb(err);
                var titleResParsed = domParser.parseFromString(titleRes.responseText, "text/html");
                //
                //var score = titleResParsed.querySelector("span[class^='AggregateRatingButton__RatingScore']");
                //var votes = titleResParsed.querySelector("div[class^='AggregateRatingButton__TotalRatingAmount']");
                // kraki5525 method
                //var score = titleResParsed.querySelector("div[data-testid='hero-rating-bar__aggregate-rating__score'] span");
                //var votes = titleResParsed.querySelector("div[data-testid='hero-rating-bar__aggregate-rating__score'] ~ div:not(:empty)");
                // joey method
                var score = titleResParsed.querySelector("*[data-testid='hero-rating-bar__aggregate-rating__score'] > span:nth-child(1)");
                var votes = titleResParsed.querySelector("*[data-testid='hero-rating-bar__aggregate-rating__score'] + div + div");
                //
                if (!score || (!score.textContent)) return cb(null, {})
                cb(null, { score: score.textContent, votes: (votes || {}).textContent || "", url: titleUrl });
            });
        });
    }

    function requestRatingOmdbApi(title, cb) {
        var searchUrl = "http://www.omdbapi.com/?apikey=" + omdbApiKey + "&t=" + encodeURIComponent(title);
        GM_xmlhttpRequest_get(searchUrl, function (err, searchRes) {
            if (err) return cb(err);
            try {
                var data = JSON.parse(searchRes.responseText);
                if (!data.imdbRating || data.imdbRating === 'N/A' || !data.imdbVotes || data.imdbVotes === 'N/A' || !data.imdbID) {
                    console.warn('Some data missing from OMDB API:', data);
                    // Fall back to IMDB
                    return requestRatingImdb(title, cb);
                }
                var score = data.imdbRating;
                var votesNum = Number(String(data.imdbVotes).replace(/,/g, ''));
                var votesShow = (votesNum / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'k';
                var imdbID = data.imdbID;
                var url = "https://www.imdb.com/title/" + imdbID;
                cb(null, { score, votes: votesShow, url });
            } catch (error) {
                console.error('Failed to fetch OMDB API data:', error);
                cb(error);
            }
        });
    }

    var cache = (function () {

        var cacheKey = "netflix-cache";

        var oneDayMs = 86400000;

        function getRandom(start, end) {
            return Math.ceil(Math.random() * (end - start) + start);
        }

        function mergeWithOtherCache(otherCache) {
            Object.keys(otherCache).forEach(function (otherKey) {
                var thisValue = _cache[otherKey];
                var otherValue = otherCache[otherKey];
                if (!thisValue || otherValue.expiration > thisValue.expiration) {
                    _cache[otherKey] = otherValue;
                }
            });
        }

        var listener = GM_addValueChangeListener(cacheKey, function (name, oldV, newV, remote) {
            if (remote) {
                mergeWithOtherCache(JSON.parse(newV));
            }
        });

        var _cache = JSON.parse(GM_getValue(cacheKey) || "{}");

        function isValid(res) {
            return res && (res.expiration - (new Date()).getTime() > 0);
        }

        function get(key) {
            var res = _cache[key];
            if (isValid(res)) return res.value;
        }

        function set(key, value) {
            var valueObj = { value: value, expiration: (new Date()).getTime() + getRandom(60 * oneDayMs, 65 * oneDayMs) };
            _cache[key] = valueObj;
        }

        function removeInvalidEntries() {
            Object.keys(_cache).forEach(function (key) {
                if (!isValid(_cache[key])) {
                    delete _cache[key];
                }
            });
        }

        window.addEventListener("blur", function () {
            removeInvalidEntries();
            GM_setValue(cacheKey, JSON.stringify(_cache));
        });

        window.addEventListener("beforeunload", function () {
            removeInvalidEntries();
            GM_setValue(cacheKey, JSON.stringify(_cache));
            GM_removeValueChangeListener(listener);
        });

        return { get: get, set: set };
    })();

    function getRating(title, cb) {
        var cacheRes = cache.get(title);
        if (!cacheRes || Object.keys(cacheRes).length === 0) {
            requestRating(title, function (err, rating) {
                if (err) {
                    cb(err);
                } else {
                    cache.set(title, rating);
                    cb(null, rating);
                }
            });
        } else {
            cb(null, cacheRes);
        }
    }

    var imdbIconURL = GM_getResourceURL("imdbIcon");

    function getOutputFormatter() {
        var div = document.createElement("div");
        div.classList.add("imdb-rating");
        div.style.cursor = "default";
        div.addEventListener("click", function () { });
        var img = document.createElement("img");
        img.classList.add("imdb-image");
        img.src = imdbIconURL;
        img.style.marginRight = '0.25em';
        div.appendChild(img);
        div.appendChild(document.createElement("div"));
        return function (res) {
            var restDiv = document.createElement("div");
            var rating = res.rating;
            if (res.error) {
                var error = document.createElement("span");
                error.classList.add("imdb-error");
                error.appendChild(document.createTextNode("ERROR"));
                restDiv.appendChild(error);
            } else if (res.loading) {
                var loading = document.createElement("span");
                loading.classList.add("imdb-loading");
                loading.appendChild(document.createTextNode("Fetching..."));
                loading.style.opacity = 0.6;
                restDiv.appendChild(loading);
            } else if (rating && rating.score && rating.votes && rating.url) {
                var score = document.createElement("span");
                score.classList.add("imdb-score");
                //score.appendChild(document.createTextNode(rating.score + "/10"));
                score.appendChild(document.createTextNode(rating.score));
                score.style.fontWeight = 'bold';
                restDiv.appendChild(score);
                var votes = document.createElement("span");
                votes.classList.add("imdb-votes");
                votes.appendChild(document.createTextNode("(" + rating.votes + " votes)"));
                votes.style.opacity = 0.6;
                restDiv.appendChild(votes);
                div.addEventListener('click', function (evt) {
                    GM_openInTab(rating.url, { active: true, insert: true, setParent: true });
                    // If the card has been expanded, clicking the IMDB link will also play the show, which we don't really want!
                    // If the card hasn't been expanded, then clicking this link will also expand the card.
                    // Unfortunately, this doesn't prevent that, even with 'capture=true' below...
                    evt.preventDefault();
                });
                div.style.cursor = "pointer";
            } else {
                var noRating = document.createElement("span");
                noRating.classList.add("imdb-no-rating");
                noRating.appendChild(document.createTextNode("N/A"));
                restDiv.appendChild(noRating);
            }
            div.replaceChild(restDiv, div.querySelector("div"));
            return div;
        }
    }

    function getRatingNode(title) {
        var node = document.createElement("div");
        var outputFormatter = getOutputFormatter();
        node.appendChild(outputFormatter({ loading: true }));
        getRating(title, function (err, rating) {
            if (err) return node.appendChild(outputFormatter({ error: true }));
            node.appendChild(outputFormatter({ rating: rating }));
        });
        return node;
    }

    function findAncestor(el, cls) {
        while (el && !el.classList.contains(cls)) {
            el = el.parentNode;
        }
        return el;
    }

    var rootElement = document.getElementById("appMountPoint");

    if (!rootElement) return;

    function imdbRenderingForExpandedCard(node) {
            var titleNode = node;
            var title = titleNode && titleNode.getAttribute("alt");
            if (!title) return;
            var ratingNode = getRatingNode(title);
            var parentNode = node.parentElement;
            var buttonContainer = parentNode.querySelector(".buttonControls--container");
            if (!buttonContainer || !parentNode) return;
            parentNode.insertBefore(ratingNode, buttonContainer);
    }

    function imdbRenderingForHeroDisplay(node) {
        var titleNode = node.querySelector(".title-logo");
        var title = titleNode && titleNode.getAttribute("alt");
        if (!title) return;
        var ratingNode = getRatingNode(title);
        ratingNode.style.fontSize = "1.4vw";
        titleNode.parentNode.insertBefore(ratingNode, titleNode.nextSibling);
    }

    function imdbRenderingForOverview(node) {
        var text = node.querySelector(".image-fallback-text");
        var logo = node.querySelector(".logo");
        var titleFromText = text && text.textContent;
        var titleFromImage = logo && logo.getAttribute("alt");
        var title = titleFromText || titleFromImage;
        if (!title) return;
        var meta = node.querySelector(".meta");
        if (!meta) return;
        var ratingNode = getRatingNode(title);
        meta.parentNode.insertBefore(ratingNode, meta.nextSibling);
    }

    function imdbRenderingForMoreLikeThis(node) {
        var titleNode = node.querySelector(".ptrack-content > img");
        var title = titleNode && titleNode.getAttribute("alt");
        if (!title) return;
        var meta = node.querySelector(".titleCard--metadataWrapper .videoMetadata--container-container");
        if (!meta) return;
        var ratingNode = getRatingNode(title);

        meta.parentNode.insertBefore(ratingNode, meta.nextSibling);
    }

    function imdbRenderingForCard(node) {
        var titleNode = node.querySelector(".previewModal--boxart")
        var title = titleNode && titleNode.getAttribute("alt");
        if (!title) return;
        var ratingNode = getRatingNode(title);
        ratingNode.classList.add("imdb-overlay");
        // If the show/film has already been viewed, then Netflix might show a progress-bar instead of the info for the show.
        // In that case, the metadatAndControls-info element might not be in the DOM, but we can add to the metadatAndControls element instead.
        // We prefer the metadatAndControls-info element when it is available, so that the iMDB rating appears above other info.
        //
        // BUG: But it gets worse.  Sometimes the metadatAndControls is there, and we add our element, then Netflix goes and removes it, and replaces it with a fresh metadatAndControls element!  I have not fixed that yet.
        var destination = node.querySelector(".previewModal--metadatAndControls-info")
                          || node.querySelector(".previewModal--metadatAndControls");
                          //|| node.querySelector(".videoMetadata--container")?.parentNode;
        if (!destination) return;
        destination.appendChild(ratingNode);
    }

    function cacheTitleRanking(node) {
        var titleNode = node.querySelector(".titleCard-imageWrapper img");
        var title = titleNode && titleNode.getAttribute("alt");
        if (!title) return;
        getRating(title, function () { });
    }

    var observerCallback = function (mutationsList) {
        for (var i = 0; i < mutationsList.length; i++) {

            var newNodes = mutationsList[i].addedNodes;

            for (var j = 0; j < newNodes.length; j++) {
                var newNode = newNodes[j];
                if (!(newNode instanceof HTMLElement)) continue;

                if (newNode.classList.contains("previewModal--player-titleTreatment-logo")) {
                    imdbRenderingForExpandedCard(newNode);
                    continue;
                }

                if (newNode.classList.contains("previewModal--wrapper")) {
                    imdbRenderingForCard(newNode);
                    continue;
                }

                // Hero Display
                var trailer = newNode.querySelector(".billboard-row");
                if (trailer) {
                    imdbRenderingForHeroDisplay(trailer);
                    continue;
                }

                const moreLikeItems = newNode.querySelectorAll(".moreLikeThis--container .more-like-this-item");
                if (moreLikeItems && moreLikeItems.length > 0) {
                    for (const item of moreLikeItems.entries()) {
                        imdbRenderingForMoreLikeThis(item[1]);
                    }
                    //continue;
                }
            }
        }
    };

    var observer = new MutationObserver(observerCallback);

    var observerConfig = { childList: true, subtree: true };

    observer.observe(document, observerConfig);

    var existingOverview = document.querySelector(".jawBone");
    existingOverview && imdbRenderingForOverview(existingOverview);

    var existingTrailer = document.querySelector(".billboard-row");
    existingTrailer && imdbRenderingForHeroDisplay(existingTrailer);

    // var existingCard = document.querySelector(".previewModal--player-titleTreatment-logo");
    var existingCard = document.querySelector("previewModal--wrapper");
    existingCard && imdbRenderingForCard(existingCard);

    window.addEventListener("beforeunload", function () {
        observer.disconnect();
    });
})();
