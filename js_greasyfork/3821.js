// ==UserScript==
// @name        CSFD Movie Preview
// @namespace   http://csfd.cz
// @description Při najetí myší na odkaz na film se zobrazí náhled jeho profilu.
// @match       https://www.csfd.cz/*
// @match       https://www.csfd.sk/*
// @exclude     https://www.csfd.cz/uzivatel/*/editace/
// @exclude     https://www.csfd.sk/uzivatel/*/editace/
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant       GM_registerMenuCommand
// @grant       GM.registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM_setValue
// @grant       GM.setValue
// @version     2.5
// @downloadURL https://update.greasyfork.org/scripts/3821/CSFD%20Movie%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/3821/CSFD%20Movie%20Preview.meta.js
// ==/UserScript==

// CHANGES
// -------
// 2.5 - do náhledu vráceno hodnocení
// 2.4 - do náhledu vrácen název filmu
// 2.3 - opraveno načítání náhledů u epizod seriálů, úprava URL adres
// 2.2 - úpravy kvůli novému designu webu
// 2.1 - opraveno přepínání automatického nahrávání náhledů filmů
// 2.0 - GM_* funkce nahrazeny novými kvůli změně API v GreaseMonkey 4.0+
// 1.3 - upravena hlavička skriptu kvůli přechodu ČSFD na https
// 1.2 - doplněna podpora dynamicky přidávaných odkazů
// 1.1 - výměna jQuery.ajax(), který ve Firefoxu přestal fungovat, za GM_xmlhttpRequest()
// 1.0 - první verze

$ = this.jQuery = jQuery.noConflict(true);

$('<div id="movie-preview" style="display: none; z-index: 999; width: 420px; background-color: #efefef; padding: 6px; ' + 
  'border-radius: 4px; box-shadow: 0 0 10px 4px #777777"><table border="0"><tr><td id="movie-preview-poster" width="152" ' + 
  'style="text-align: center"></td><td id="movie-preview-content" style="vertical-align: top; padding-left: 7px"></td>' + 
  '</tr></table></div>').appendTo('body');

var cacheExpires = 7; // days

var movieBox = $('div#movie-preview');
var movieBoxPoster = movieBox.find('#movie-preview-poster');
var movieBoxContent = movieBox.find('#movie-preview-content');

var movieLinkSelector = 'a[href*="/film/"], a[href*="/film.php"]';

var thisPageMovieId = parseMovieId(window.location.href);
var currentMovieId = null;
var movies = [];

var timerId = -1;

// Greasmonkey-only section start

if (typeof GM.registerMenuCommand == 'function' && isStorageSupported()) {
	GM.registerMenuCommand("Přepnout automatické nahrávání náhledů filmů", function() {
        GM.getValue("doPrefetch", false).then(function(doPrefetch) {
            GM.setValue("doPrefetch", !doPrefetch);

            alert("Automatické nahrávání náhledů filmů " + (doPrefetch? "vypnuto": "zapnuto") + ".\nZměna nastavení se projeví po obnovení stránky.");
        });
    });
}

// Greasmonkey-only section end

function isStorageSupported() {
    return typeof(Storage) !== void(0);
}

function parseMovieId(movieURL) {
	var match = movieURL.match(/\/film(?:\.php\?)?(?:\/[\d]+)?.*\/([\d]+)/);
    
    return match && match.length >= 2? 'm' + match[1]: null;
}

function getDiffDays(date1, date2) {
	return Math.round(Math.abs(date1 - date2) / (1000 * 3600 * 24));
}

var storage = isStorageSupported()?
	{ // local storage
		getStoredItem: function(movieURL) {
    		return localStorage[parseMovieId(movieURL)];
		},
		setStoredItem: function(movieURL, value) {
			try {
				localStorage[parseMovieId(movieURL)] = value;
			} catch (ex) {
				// "Persistent storage maximum size reached" -> remove 10 random items
				for (var i=0; i < 10; i++) {
					var index = Math.floor(Math.random() * localStorage.length);
					var key = localStorage.key(index);

					localStorage.removeItem(key);
				}

				return this.setStoredItem(movieURL, value);
			}
		},
        cleanExpiredData: function() {
			var lastCleanup = localStorage["last-cleanup"]? Date.parse(localStorage["last-cleanup"]): new Date(0);

			// run cleanup only once per day
			if (getDiffDays(new Date(), lastCleanup) < 1) return;

            for(var key in localStorage) {
				if (key.match(/m\d+/)) {
					var cached = JSON.parse(localStorage[key]);
					
					if (getDiffDays(new Date(), Date.parse(cached.timestamp)) > cacheExpires) {
						localStorage.removeItem(key);
					}
				}
			}

			localStorage["last-cleanup"] = new Date();
        }
    }:
	{ // dummy storage
		getStoredItem: function(movieURL) {
    		return null;
		},
		setStoredItem: function(movieURL, value) {
    		// noop
		},
        cleanExpiredData: function() {
            // noop
        }
    };

function getMovieBoxPosition(event) {
	var boxWidth = movieBox.width() + 10;
	var tPosX = boxWidth - event.clientX + 30 > 0? event.pageX + 30: event.pageX - boxWidth - 30;
	var tPosY = event.pageY + event.clientY;

	if (event.clientY > 30) {
		var winHeight = $(window).height();
		var boxHeight = movieBox.height() > winHeight? winHeight - 60: movieBox.height();
		var overflowY = event.clientY + boxHeight - winHeight;
		tPosY = overflowY > 0? event.pageY - overflowY - 50: event.pageY - 30;
	}

    return { X: tPosX, Y: tPosY };
}
    
function showMovieBox(event, profile, rating) {
    var poster   = profile.find(".film-posters img");
    var title    = "<h1 style='font-size: 22px; padding-bottom: 12px'>" + profile.find(".film-header-name h1").text().trim() + "</h1>";
    var genre    = profile.find(".genres");
    var origin   = profile.find(".origin");
    var creators = profile.find(".creators");

    movieBoxPoster.html('');
    movieBoxPoster.append(poster.css('width', 140));
    movieBoxPoster.append('<h1 style="font-size: 32px; margin-top: 12px">' + rating + '</h1>');

    movieBoxContent.html('');
    movieBoxContent.append(title);
    movieBoxContent.append(genre.css('font-weight', 'bold'));
    movieBoxContent.append(origin.css('font-weight', 'bold'));
    movieBoxContent.append('<br>');
    movieBoxContent.append(creators);

    var pos = getMovieBoxPosition(event);
    
    movieBox.css({ 'position': 'absolute', 'top': pos.Y, 'left': pos.X }).show();
}

function getCachedData(movieURL) {
    var cached = storage.getStoredItem(movieURL);

	if (cached) {
		cached = JSON.parse(cached);

		if (getDiffDays(new Date(), Date.parse(cached.timestamp)) <= cacheExpires)
			return { "profile": $(cached.profile), "rating": cached.rating };
	}

	return null;
}
    
function loadMovieBox(movieURL, doneCallback, errorCallback, redirectMovieURL) {
	if (!redirectMovieURL) redirectMovieURL = movieURL;

	console.log("[CSFD Movie Preview] Loading movie page: " + redirectMovieURL);

	GM.xmlHttpRequest({
		method: "GET",
		url: redirectMovieURL,
		onload: function(response) {
			try {
				if (false /* TODO: handle redirect */) {
					loadMovieBox(movieURL, doneCallback, errorCallback, response.redirect);
				} else {
					response = $(response.responseText);

					var profile = response.find(".film-info").html().replace(/[\t\n]+/mg, ' ');
					var rating  = response.find(".film-info .film-rating-average").text().trim();
					
					storage.setStoredItem(movieURL, JSON.stringify({ "profile": profile, "rating": rating, "timestamp": new Date() }));
					
					if (doneCallback) doneCallback($(profile), rating);
				}
			} catch(ex) {
				console.log("[CSFD Movie Preview] Error in AJAX handler: " + ex.message);

				if (errorCallback) errorCallback();
			}
		},
		onerror: function(response) {
			if (errorCallback) errorCallback();
		}
	});
}

function prefetchMovies() {
	if (!isStorageSupported()) return;
	
    GM.getValue("doPrefetch", false).then(function(doPrefetch) {
		var movieURL;

		if (doPrefetch && (movieURL = movies.shift())) {
			setTimeout(function() {
				if (!getCachedData(movieURL)) {
					loadMovieBox(movieURL, prefetchMovies, prefetchMovies);
				} else {
					prefetchMovies();
				}
			}, 300);
		}
	});
}

function addHoverHandler(element) {
	element.hover(function(event) {
		var movieURL = $(this).attr("href").trim();
		var movieId  = parseMovieId(movieURL);

		// prevent previews of the movie on its page
		if (thisPageMovieId == movieId) return;

		currentMovieId = movieId;

		var cached = getCachedData(movieURL);
	  
		if (cached) {
			showMovieBox(event, cached.profile, cached.rating);
		} else {
			clearTimeout(timerId);

			timerId = setTimeout(function() {
				loadMovieBox(movieURL, function(profile, rating) {
					if (currentMovieId == movieId) showMovieBox(event, profile, rating);
				});
			}, 30);
		}
	}, function() {
		clearTimeout(timerId);
		timerId = -1;
		
		currentMovieId = null;

		movieBox.hide();
	});
}

function setupMutationObserver() {
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			for (var i=0; i < mutation.addedNodes.length; i++) {
				$(mutation.addedNodes[i]).find("a").each(function() {
					if (this.href && this.href.match(/\/film/)) {
						addHoverHandler($(this));

						var movieURL = this.href.trim();
						movies.push(movieURL);
					}
				});
			}
		});

		prefetchMovies();
	});

	observer.observe(document.querySelector("body"), {
		childList: true,
		subtree: true
	});
}

// program start

storage.cleanExpiredData();

$(movieLinkSelector).each(function() {
	addHoverHandler($(this));

	var movieURL = $(this).attr("href").trim();
	movies.push(movieURL);
});

setupMutationObserver();

prefetchMovies();

// program end
